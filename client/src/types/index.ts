export type UserRole = 'HOUSEHOLD' | 'BUSINESS' | 'COLLECTOR' | 'RECYCLER' | 'ADMIN';

export interface UserProfile {
  id?: string;
  businessName?: string;
  businessType?: string;
  gstNumber?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  serviceAreaRadiusKm?: number;
  dailyCapacityKg?: number;
  acceptedCategories?: string;
  operatingHours?: string;
  bankUpiId?: string;
  isAvailable?: boolean;
  totalPickupsCompleted?: number;
  reliabilityRating?: number;
}

export interface Address {
  id: string;
  userId?: string;
  label: string;
  streetAddress: string;
  area?: string;
  city: string;
  state?: string;
  pincode: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
  isFuzzedForPrivacy?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  languagePref: 'en' | 'hi';
  isVerified: boolean;
  profile?: UserProfile;
  addresses?: Address[];
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
  recyclerOffers?: RecyclerOffer[];
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
  effectiveDate: string;
  lastUpdated: string;
  category?: MaterialCategory;
}

export interface PickupItem {
  id?: string;
  categoryId: string;
  category?: MaterialCategory;
  estimatedQty: number;
  unit: string;
  photoUrl?: string;
  aiPredictedCategory?: string;
  aiConfidence?: number;
  gradeNotes?: string;
}

export interface ActualCollectedItem {
  id?: string;
  categoryId: string;
  category?: MaterialCategory;
  actualQty: number;
  agreedPricePerUnit: number;
  itemTotal: number;
  gradeRecorded?: string;
}

export interface PickupRequest {
  id: string;
  requesterId: string;
  requester?: { id: string; name: string; phone?: string; email?: string };
  addressId: string;
  address: Address;
  preferredDate: string;
  preferredTimeSlot: string;
  notes?: string;
  status: 'OPEN' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  estimatedTotalWeightKg: number;
  estimatedTotalValue: number;
  isRecurring?: boolean;
  recurringFrequency?: string;
  assignedCollectorId?: string;
  cancelledReason?: string;
  disputeReason?: string;
  createdAt: string;
  updatedAt: string;
  items: PickupItem[];
  actualCollected?: ActualCollectedItem[];
  assignments?: Array<{
    id: string;
    collector: { id: string; name: string; phone?: string; profile?: UserProfile };
    status: string;
    distanceKm: number;
    matchScore: number;
    matchExplanation?: string;
  }>;
  statusHistory?: Array<{
    id: string;
    fromStatus: string;
    toStatus: string;
    changeReason?: string;
    timestamp: string;
  }>;
  transaction?: Transaction;
  ratings?: Array<{
    id: string;
    rating: number;
    reviewText?: string;
  }>;
}

export interface Transaction {
  id: string;
  pickupRequestId: string;
  collectorId: string;
  requesterId: string;
  collector?: { id: string; name: string; phone?: string; profile?: UserProfile };
  requester?: { id: string; name: string; phone?: string; email?: string };
  totalWeightKg: number;
  totalAmount: number;
  paymentMode: 'CASH' | 'UPI' | 'BANK_TRANSFER';
  paymentStatus: 'PENDING' | 'PAID' | 'DISPUTED';
  receiptNumber: string;
  receiptHash: string;
  notes?: string;
  transactionDate: string;
}

export interface RecyclerOffer {
  id: string;
  recyclerId: string;
  recycler?: { id: string; name: string; isVerified: boolean; profile?: UserProfile };
  categoryId: string;
  category: MaterialCategory;
  facilityName: string;
  facilityAddress: string;
  lat: number;
  lng: number;
  buyingPricePerKg: number;
  minQuantityKg: number;
  gradeAccepted: string;
  notes?: string;
  isActive: boolean;
}

export interface EnvironmentalImpactSummary {
  verifiedTotals: {
    completedPickupsCount: number;
    totalMaterialCollectedKg: number;
    totalCollectorPayoutsInr: number;
    verifiedRecyclerIntakeKg: number;
    activeCollectorsCount: number;
    participatingUsersCount: number;
    participatingRecyclersCount: number;
  };
  ecologicalSavings: {
    co2EquivalentOffsetKg: number;
    treesSavedCount: number;
    waterConservedLitres: number;
    energySavedKwh: number;
    landfillDiversionKg: number;
  };
  materialBreakdown: Array<{
    categoryName: string;
    hindiName: string;
    totalKg: number;
    percentage: number;
    co2SavedKg: number;
  }>;
  methodologyNotes: {
    carbonFactorSource: string;
    treesCalculationFormula: string;
    verificationDistinction: string;
  };
}
