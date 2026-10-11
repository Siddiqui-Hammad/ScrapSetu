const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('scrapsetu_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async register(data: any) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async login(credentials: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async addAddress(addressData: any) {
    const res = await fetch(`${API_BASE}/auth/addresses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(addressData),
    });
    return res.json();
  },

  // Pickups
  async createPickup(pickupData: any) {
    const res = await fetch(`${API_BASE}/pickups`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(pickupData),
    });
    return res.json();
  },

  async listPickups(status?: string) {
    const url = status ? `${API_BASE}/pickups?status=${status}` : `${API_BASE}/pickups`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    return res.json();
  },

  async getPickupById(id: string) {
    const res = await fetch(`${API_BASE}/pickups/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async cancelPickup(id: string, reason?: string) {
    const res = await fetch(`${API_BASE}/pickups/${id}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });
    return res.json();
  },

  async disputePickup(id: string, subject: string, description: string) {
    const res = await fetch(`${API_BASE}/pickups/${id}/dispute`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ subject, description }),
    });
    return res.json();
  },

  // Collector
  async getNearbyPickups(lat?: number, lng?: number) {
    const query = lat && lng ? `?lat=${lat}&lng=${lng}` : '';
    const res = await fetch(`${API_BASE}/collectors/nearby${query}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async acceptPickup(id: string) {
    const res = await fetch(`${API_BASE}/collectors/pickups/${id}/accept`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async updatePickupStatus(id: string, status: string, reason?: string) {
    const res = await fetch(`${API_BASE}/collectors/pickups/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, reason }),
    });
    return res.json();
  },

  async completePickupWithWeighing(id: string, payload: any) {
    const res = await fetch(`${API_BASE}/collectors/pickups/${id}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getCollectorEarnings() {
    const res = await fetch(`${API_BASE}/collectors/earnings`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getCollectorRoutePlan() {
    const res = await fetch(`${API_BASE}/collectors/route-plan`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Recyclers
  async getRecyclerOffers(categoryId?: string) {
    const q = categoryId ? `?categoryId=${categoryId}` : '';
    const res = await fetch(`${API_BASE}/recyclers/offers${q}`);
    return res.json();
  },

  async createRecyclerOffer(data: any) {
    const res = await fetch(`${API_BASE}/recyclers/offers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async createIntakeSlip(data: any) {
    const res = await fetch(`${API_BASE}/recyclers/intakes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getRecyclerDashboard() {
    const res = await fetch(`${API_BASE}/recyclers/dashboard`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Pricing & Categories
  async getRates() {
    const res = await fetch(`${API_BASE}/pricing/rates`);
    return res.json();
  },

  async estimatePrice(items: Array<{ categoryId: string; estimatedQty: number; grade?: string }>) {
    const res = await fetch(`${API_BASE}/pricing/estimate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    return res.json();
  },

  // Transactions & Receipts
  async getReceipt(receiptNumber: string) {
    const res = await fetch(`${API_BASE}/transactions/receipt/${receiptNumber}`);
    return res.json();
  },

  async listTransactions() {
    const res = await fetch(`${API_BASE}/transactions`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Environmental Impact
  async getPublicImpact() {
    const res = await fetch(`${API_BASE}/impact/public`);
    return res.json();
  },

  async getMyImpact() {
    const res = await fetch(`${API_BASE}/impact/me`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // AI Classification
  async classifyWaste(formDataOrName: FormData | { sampleName: string }) {
    const token = localStorage.getItem('scrapsetu_token');
    if (formDataOrName instanceof FormData) {
      const res = await fetch(`${API_BASE}/ai/classify`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formDataOrName,
      });
      return res.json();
    } else {
      const res = await fetch(`${API_BASE}/ai/classify`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formDataOrName),
      });
      return res.json();
    }
  },

  // Admin
  async getAdminOverview() {
    const res = await fetch(`${API_BASE}/admin/overview`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getAdminUsers(role?: string) {
    const q = role ? `?role=${role}` : '';
    const res = await fetch(`${API_BASE}/admin/users${q}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async verifyUser(userId: string, isVerified: boolean, notes?: string) {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/verification`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isVerified, notes }),
    });
    return res.json();
  },

  async updatePrice(priceId: string, payload: any) {
    const res = await fetch(`${API_BASE}/admin/prices/${priceId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async resolveDispute(disputeId: string, resolution: string) {
    const res = await fetch(`${API_BASE}/admin/disputes/${disputeId}/resolve`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ resolution }),
    });
    return res.json();
  },

  async getAuditLogs() {
    const res = await fetch(`${API_BASE}/admin/audit-logs`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },
};
