import {
  User,
  MaterialCategory,
  PickupRequest,
  DigitalReceipt,
  RecyclerOffer,
  OptimizedRouteResult,
  ScrapVisionPrediction,
  GreenLedgerMetrics,
  SmartBuyerMatchResponse,
  ScrapPoolItem,
  PoolDetailResponse,
  ScrapPassportData,
  VoiceCommandResponse,
} from '../types';

const API_BASE = typeof window !== 'undefined' ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

function getAuthHeader(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('scrapsetu_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new ApiError(res.status, json.message || 'Request failed', json);
    }
    return json as T;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, err.message || 'Network connection failed');
  }
}

export const apiClient = {
  // Authentication
  auth: {
    register: (data: any) => request<{ success: boolean; token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    login: (credentials: { email: string; password: string }) => request<{ success: boolean; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    getMe: () => request<{ success: boolean; user: User }>('/auth/me'),
    updateLanguage: (languagePref: 'en' | 'hi') => request<{ success: boolean }>('/auth/language', {
      method: 'PATCH',
      body: JSON.stringify({ languagePref }),
    }),
    addAddress: (address: any) => request<{ success: boolean; address: any }>('/auth/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    }),
  },

  // Pickups
  pickups: {
    create: (data: any) => request<{ success: boolean; pickup: PickupRequest }>('/pickups', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    list: (status?: string) => request<{ success: boolean; pickups: PickupRequest[] }>(
      status ? `/pickups?status=${status}` : '/pickups'
    ),
    getById: (id: string) => request<{ success: boolean; pickup: PickupRequest }>(`/pickups/${id}`),
    cancel: (id: string, reason?: string) => request<{ success: boolean }>(`/pickups/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
    dispute: (id: string, subject: string, description: string) => request<{ success: boolean }>(`/pickups/${id}/dispute`, {
      method: 'POST',
      body: JSON.stringify({ subject, description }),
    }),
  },

  // Collector Workflow
  collector: {
    getNearby: (lat?: number, lng?: number) => {
      const q = lat && lng ? `?lat=${lat}&lng=${lng}` : '';
      return request<{ success: boolean; count: number; pickups: any[]; collectorLocation: { lat: number; lng: number } }>(
        `/collectors/nearby${q}`
      );
    },
    accept: (id: string) => request<{ success: boolean; message: string }>(`/collectors/pickups/${id}/accept`, {
      method: 'POST',
    }),
    updateStatus: (id: string, status: string, reason?: string) => request<{ success: boolean }>(
      `/collectors/pickups/${id}/status`,
      { method: 'PATCH', body: JSON.stringify({ status, reason }) }
    ),
    completeWeighing: (id: string, payload: any) => request<{ success: boolean; receiptNumber: string; receiptHash: string }>(
      `/collectors/pickups/${id}/complete`,
      { method: 'POST', body: JSON.stringify(payload) }
    ),
    getEarnings: () => request<{ success: boolean; summary: any }>('/collectors/earnings'),
    getRoutePlan: () => request<{ success: boolean; route: OptimizedRouteResult }>('/collectors/route-plan'),
  },

  // Recycler Workflow
  recyclers: {
    getOffers: (categoryId?: string) => {
      const q = categoryId ? `?categoryId=${categoryId}` : '';
      return request<{ success: boolean; count: number; offers: RecyclerOffer[] }>(`/recyclers/offers${q}`);
    },
    createOffer: (data: any) => request<{ success: boolean; offer: RecyclerOffer }>('/recyclers/offers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    createIntakeSlip: (data: any) => request<{ success: boolean; intakeSlipNumber: string; receiptHash: string }>(
      '/recyclers/intakes',
      { method: 'POST', body: JSON.stringify(data) }
    ),
    getDashboard: () => request<{ success: boolean; stats: any; activeOffers: any[]; recentIntakes: any[] }>(
      '/recyclers/dashboard'
    ),
  },

  // Pricing & ScrapRate
  pricing: {
    getRates: () => request<{ success: boolean; count: number; categories: MaterialCategory[] }>('/pricing/rates'),
    estimate: (items: Array<{ categoryId: string; estimatedQty: number; grade?: string }>) => request<{
      success: boolean;
      valuation: {
        totalEstimatedWeightKg: number;
        totalEstimatedValue: number;
        currency: string;
        disclaimer: string;
        items: any[];
      };
    }>('/pricing/estimate', {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),
  },

  // ScrapVision AI
  ai: {
    classify: async (formData: FormData) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('scrapsetu_token') : null;
      const res = await fetch(`${API_BASE}/ai/classify`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      return (await res.json()) as { success: boolean; classification: ScrapVisionPrediction };
    },
    classifySample: (sampleName: string) => request<{ success: boolean; classification: ScrapVisionPrediction }>('/ai/classify', {
      method: 'POST',
      body: JSON.stringify({ sampleName }),
    }),
  },

  // Transactions & Waste Passport
  transactions: {
    getReceipt: (receiptNumber: string) => request<{ success: boolean; receipt: DigitalReceipt }>(
      `/transactions/receipt/${receiptNumber}`
    ),
    list: () => request<{ success: boolean; count: number; transactions: any[] }>('/transactions'),
  },

  // GreenLedger Impact
  impact: {
    getPublic: () => request<{ success: boolean; impact: GreenLedgerMetrics }>('/impact/public'),
    getMy: () => request<{ success: boolean; impact: any }>('/impact/me'),
  },

  // Administrator Governance
  admin: {
    getOverview: () => request<{ success: boolean; stats: any; recentAuditLogs: any[]; openDisputes: any[] }>('/admin/overview'),
    getUsers: (role?: string) => {
      const q = role ? `?role=${role}` : '';
      return request<{ success: boolean; count: number; users: User[] }>(`/admin/users${q}`);
    },
    verifyUser: (userId: string, isVerified: boolean, notes?: string) => request<{ success: boolean; user: User }>(
      `/admin/users/${userId}/verification`,
      { method: 'PATCH', body: JSON.stringify({ isVerified, notes }) }
    ),
    updatePrice: (priceId: string, payload: any) => request<{ success: boolean; price: any }>(
      `/admin/prices/${priceId}`,
      { method: 'PATCH', body: JSON.stringify(payload) }
    ),
    resolveDispute: (disputeId: string, resolution: string) => request<{ success: boolean }>(
      `/admin/disputes/${disputeId}/resolve`,
      { method: 'POST', body: JSON.stringify({ resolution }) }
    ),
    getAuditLogs: () => request<{ success: boolean; count: number; auditLogs: any[] }>('/admin/audit-logs'),
  },

  // 1. Smart Buyer Matching
  buyerMatching: {
    getOffers: (params: {
      categoryId: string;
      weightKg: number;
      grade?: string;
      lat?: number;
      lng?: number;
      vehicleType?: string;
      lotId?: string;
    }) => {
      const q = new URLSearchParams({
        categoryId: params.categoryId,
        weightKg: params.weightKg.toString(),
        ...(params.grade ? { grade: params.grade } : {}),
        ...(params.lat ? { lat: params.lat.toString() } : {}),
        ...(params.lng ? { lng: params.lng.toString() } : {}),
        ...(params.vehicleType ? { vehicleType: params.vehicleType } : {}),
        ...(params.lotId ? { lotId: params.lotId } : {}),
      }).toString();
      return request<{ success: boolean } & SmartBuyerMatchResponse>(`/buyer-matching/offers?${q}`);
    },
    selectBuyer: (lotId: string, offerId: string) =>
      request<{ success: boolean; message: string; lot: any }>('/buyer-matching/select', {
        method: 'POST',
        body: JSON.stringify({ lotId, offerId }),
      }),
    getLots: () => request<{ success: boolean; count: number; lots: any[] }>('/buyer-matching/lots'),
    createLot: (data: { categoryId: string; declaredWeightKg: number; grade?: string; pickupRequestId?: string }) =>
      request<{ success: boolean; message: string; lot: any }>('/buyer-matching/lots', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // 2. Collaborative Scrap Pooling
  pooling: {
    list: (params?: { categoryId?: string; status?: string; search?: string; lat?: number; lng?: number }) => {
      const q = new URLSearchParams({
        ...(params?.categoryId ? { categoryId: params.categoryId } : {}),
        ...(params?.status ? { status: params.status } : {}),
        ...(params?.search ? { search: params.search } : {}),
        ...(params?.lat ? { lat: params.lat.toString() } : {}),
        ...(params?.lng ? { lng: params.lng.toString() } : {}),
      }).toString();
      return request<{ success: boolean; count: number; pools: ScrapPoolItem[] }>(`/pools${q ? `?${q}` : ''}`);
    },
    getById: (id: string) => request<{ success: boolean } & PoolDetailResponse>(`/pools/${id}`),
    create: (data: any) =>
      request<{ success: boolean; message: string; pool: ScrapPoolItem }>('/pools', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    pledge: (poolId: string, data: { pledgedWeightKg: number; scrapLotId?: string }) =>
      request<{ success: boolean; message: string; pledge: any; pool: ScrapPoolItem }>(`/pools/${poolId}/pledge`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    withdraw: (pledgeId: string) =>
      request<{ success: boolean; message: string }>(`/pools/pledges/${pledgeId}/withdraw`, {
        method: 'POST',
      }),
    matchBuyer: (poolId: string, offerId: string) =>
      request<{ success: boolean; message: string; pool: ScrapPoolItem }>(`/pools/${poolId}/match-buyer`, {
        method: 'POST',
        body: JSON.stringify({ offerId }),
      }),
    settle: (
      poolId: string,
      data: {
        verifiedPledges: { pledgeId: string; verifiedWeightKg: number }[];
        paymentReference?: string;
        settlementNotes?: string;
      }
    ) =>
      request<{ success: boolean; message: string; pool: ScrapPoolItem }>(`/pools/${poolId}/settle`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // 3. Scrap Passport & Traceability
  passport: {
    get: (identifier: string) =>
      request<{ success: boolean; passport: ScrapPassportData }>(`/passport/${identifier}`),
    create: (data: any) =>
      request<{ success: boolean; message: string; lot: any }>('/passport', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    handover: (lotId: string, notes?: string) =>
      request<{ success: boolean; message: string; lot: any }>(`/passport/${lotId}/handover`, {
        method: 'POST',
        body: JSON.stringify({ notes }),
      }),
    receive: (
      lotId: string,
      data: {
        receivedWeightKg: number;
        weighbridgeSlipNumber?: string;
        notes?: string;
      }
    ) =>
      request<{ success: boolean; message: string; lot: any }>(`/passport/${lotId}/receive`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    confirmProcessing: (
      lotId: string,
      data: {
        processingMethod: string;
        processingBatchNumber: string;
        cpcbComplianceRef?: string;
        processingNotes?: string;
      }
    ) =>
      request<{ success: boolean; message: string; lot: any }>(`/passport/${lotId}/confirm-processing`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    dispute: (lotId: string, disputeReason: string) =>
      request<{ success: boolean; message: string; lot: any }>(`/passport/${lotId}/dispute`, {
        method: 'POST',
        body: JSON.stringify({ disputeReason }),
      }),
  },

  // 4. Voice-First Kabadiwala Mode
  voice: {
    processCommand: (transcript: string, language: 'hi' | 'en' = 'hi', networkOnline: boolean = true) =>
      request<VoiceCommandResponse>('/voice/process-command', {
        method: 'POST',
        body: JSON.stringify({ transcript, language, networkOnline }),
      }),
    confirmAction: (logId?: string, confirmed: boolean = true) =>
      request<{ success: boolean; message: string }>('/voice/confirm-action', {
        method: 'POST',
        body: JSON.stringify({ logId, confirmed }),
      }),
    getRecentLogs: () =>
      request<{ success: boolean; count: number; logs: any[] }>('/voice/recent'),
  },
};
