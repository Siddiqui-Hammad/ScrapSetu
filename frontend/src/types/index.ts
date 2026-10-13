export type UserRole = 'HOUSEHOLD' | 'BUSINESS' | 'COLLECTOR' | 'RECYCLER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  languagePref: 'en' | 'hi';
  isVerified: boolean;
  avatarUrl?: string | null;
  createdAt: string;
  profile?: UserProfile | null;
  addresses?: Address[];
}

export interface UserProfile {
  id: string;
  userId: string;
  businessName?: string | null;
  businessType?: string | null;
  gstNumber?: string | null;
  vehicleType?: string | null;
  vehicleNumber?: string | null;
  serviceAreaRadiusKm: number;
  dailyCapacityKg: number;
  acceptedCategories?: string | null;
  bankUpiId?: string | null;
  isAvailable: boolean;
  totalPickupsCompleted: number;
  reliabilityRating: number;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  streetAddress: string;
  area?: string | null;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  isDefault: boolean;
}

export interface MaterialCategory {
  id: string;
  name: string;
  hindiName: string;
  slug: string;
  description: string;
  hindiDescription: string;
  icon: string;
  defaultUnit: string;
  carbonFactorKg: number;
  treeFactorKg: number;
  waterFactorL: number;
  energyFactorKwh: number;
  prices?: MaterialPrice[];
}

export interface MaterialPrice {
  id: string;
  categoryId: string;
  grade: string;
  unit: string;
  indicativePrice: number;
  minPrice: number;
  maxPrice: number;
  region: string;
  source: string;
  isDemo: boolean;
  lastUpdated: string;
}

export type PickupStatus =
  | 'OPEN'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export interface PickupItem {
  id?: string;
  categoryId: string;
  category?: MaterialCategory;
  estimatedQty: number;
  unit: string;
  photoUrl?: string | null;
  aiPredictedCategory?: string | null;
  aiConfidence?: number | null;
  userConfirmedCategory?: boolean;
  gradeNotes?: string | null;
}

export interface PickupRequest {
  id: string;
  requesterId: string;
  requester?: { id: string; name: string; phone?: string; email?: string };
  addressId: string;
  address?: Address;
  preferredDate: string;
  preferredTimeSlot: string;
  notes?: string | null;
  status: PickupStatus;
  estimatedTotalWeightKg: number;
  estimatedTotalValue: number;
  isRecurring: boolean;
  recurringFrequency?: string | null;
  assignedCollectorId?: string | null;
  assignedCollector?: { id: string; name: string; phone?: string };
  createdAt: string;
  items?: PickupItem[];
  actualCollected?: ActualCollectedItem[];
  transaction?: Transaction | null;
}

export interface ActualCollectedItem {
  id: string;
  categoryId: string;
  category: MaterialCategory;
  actualQty: number;
  agreedPricePerUnit: number;
  itemTotal: number;
  gradeRecorded?: string | null;
}

export interface Transaction {
  id: string;
  pickupRequestId: string;
  collectorId: string;
  collector?: { id: string; name: string };
  requesterId: string;
  requester?: { id: string; name: string };
  totalWeightKg: number;
  totalAmount: number;
  paymentMode: 'CASH' | 'UPI' | 'BANK_TRANSFER';
  paymentStatus: 'PAID' | 'PENDING' | 'DISPUTED';
  receiptNumber: string;
  receiptHash: string;
  transactionDate: string;
  notes?: string | null;
}

export interface DigitalReceipt {
  receiptNumber: string;
  receiptHash: string;
  isCryptographicallyValid: boolean;
  transactionDate: string;
  collector: { id: string; name: string; phone: string; profile?: UserProfile };
  requester: { id: string; name: string; phone: string; email: string };
  pickupAddress: Address;
  totalWeightKg: number;
  totalAmount: number;
  paymentMode: string;
  paymentStatus: string;
  notes?: string | null;
  items: Array<{
    categoryName: string;
    hindiName: string;
    actualQty: number;
    unit: string;
    agreedPricePerUnit: number;
    itemTotal: number;
    grade?: string | null;
  }>;
}

export interface RecyclerOffer {
  id: string;
  recyclerId: string;
  facilityName: string;
  facilityAddress: string;
  categoryId: string;
  category?: MaterialCategory;
  buyingPricePerKg: number;
  minQuantityKg: number;
  gradeAccepted: string;
  isActive: boolean;
}

export interface RouteStop {
  pickupId: string;
  requesterName: string;
  addressLabel: string;
  streetAddress: string;
  lat: number;
  lng: number;
  preferredTimeSlot: string;
  estimatedWeightKg: number;
  estimatedValue: number;
  stopSequenceIndex?: number;
  distanceFromPreviousKm?: number;
}

export interface OptimizedRouteResult {
  orderedStops: RouteStop[];
  totalDistanceKm: number;
  unoptimizedDistanceKm: number;
  distanceSavedKm: number;
  estimatedDrivingTimeMinutes: number;
  algorithmUsed: string;
}

export interface ScrapVisionPrediction {
  categorySlug: string;
  categoryName: string;
  hindiName: string;
  confidence: number;
  explanation: string;
  suggestedGrade: string;
  estimatedPriceRange: { min: number; max: number; unit: string };
  isExternalAiUsed: boolean;
  requiresUserConfirmation: true;
}

export interface GreenLedgerMetrics {
  totalDivertedKg: number;
  co2SavedKg: number;
  treesSaved: number;
  waterSavedLitres: number;
  energySavedKwh: number;
  categoryBreakdown: Array<{ name: string; weightKg: number; percentage: number }>;
}

export interface EcoShieldAnomaly {
  id: string;
  type: 'WEIGHT_MISMATCH' | 'PRICE_DEVIATION' | 'FREQUENT_CANCELLATION' | 'UNUSUAL_GEO_CLUSTER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  pickupId?: string;
  userId?: string;
  userName?: string;
  description: string;
  timestamp: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
}

export interface KycDossier {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  vehicle?: string;
  aadhaarNum: string;
  dlNum: string;
  aadhaarStatus: string;
  dlStatus: string;
  selfieStatus: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  appliedDate: string;
  reviewedBy?: string | null;
}
