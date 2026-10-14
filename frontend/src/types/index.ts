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

// -------------------------------------------------------------
// FEATURE 1: SMART BUYER MATCHING
// -------------------------------------------------------------
export interface TransportEstimate {
  vehicleType: string;
  baseFare: number;
  ratePerKm: number;
  distanceKm: number;
  totalTransportCost: number;
}

export interface BuyerMatchOffer {
  offerId: string;
  recyclerId: string;
  recyclerName: string;
  facilityName: string;
  facilityAddress: string;
  distanceKm: number;
  buyingPricePerKg: number;
  minQuantityKg: number;
  maxCapacityKg: number;
  currentIntakeKg: number;
  availableCapacityKg: number;
  gradeAccepted: string;
  paymentTerms: string;
  handlingFeePerKg: number;
  weightKg: number;
  grossValue: number;
  transportEstimate: TransportEstimate;
  handlingFeeTotal: number;
  netProceeds: number;
  effectiveRatePerKg: number;
  isEligible: boolean;
  meetsMinQuantity: boolean;
  meetsCapacity: boolean;
  recommendationRank?: number;
  recommendationReason: string;
  disqualificationReason?: string;
}

export interface SmartBuyerMatchResponse {
  eligibleBuyers: BuyerMatchOffer[];
  incompatibleBuyers: BuyerMatchOffer[];
  recommendedBuyer: BuyerMatchOffer | null;
  meta: {
    lotId?: string;
    categoryName: string;
    weightKg: number;
    collectorLocation: { lat: number; lng: number };
    vehicleType: string;
    timestamp: string;
  };
}

// -------------------------------------------------------------
// FEATURE 2: COLLABORATIVE SCRAP POOLING
// -------------------------------------------------------------
export interface ScrapPoolItem {
  id: string;
  poolCode: string;
  title: string;
  description?: string | null;
  category: {
    id: string;
    name: string;
    hindiName: string;
    slug: string;
  };
  targetWeightKg: number;
  currentPledgedKg: number;
  remainingKg: number;
  progressPercentage: number;
  targetPricePerKg: number;
  baselinePricePerKg: number;
  premiumSpreadPerKg: number;
  estimatedTotalBulkValue: number;
  collectionDeadline: string;
  status: 'OPEN' | 'TARGET_REACHED' | 'MATCHED' | 'DISPATCHED' | 'SETTLED' | 'CANCELLED';
  hubLocationName: string;
  hubAddress: string;
  hubLat: number;
  hubLng: number;
  distanceKm?: number;
  creatorName: string;
  participantsCount: number;
  matchedBuyer?: {
    id: string;
    name: string;
    facilityName?: string;
  } | null;
  disbursementStatus: string;
  paymentReference?: string | null;
  settlementNotes?: string | null;
  createdAt: string;
}

export interface PoolParticipantPledge {
  pledgeId: string;
  collectorId: string;
  collectorName: string;
  vehicleType: string;
  pledgedWeightKg: number;
  verifiedWeightKg?: number | null;
  sharePercentage: number;
  estGrossPayout: number;
  poolingAdvantageInr: number;
  allocatedPayout?: number | null;
  status: 'PLEDGED' | 'VERIFIED' | 'WITHDRAWN' | 'SETTLED' | 'REJECTED';
  pledgedAt: string;
  lotNumber?: string;
}

export interface PoolActivityEntry {
  id: string;
  actorId?: string;
  actorName: string;
  action: string;
  details?: string;
  timestamp: string;
}

export interface PoolDetailResponse {
  pool: ScrapPoolItem;
  participantsBreakdown: PoolParticipantPledge[];
  activities: PoolActivityEntry[];
}

// -------------------------------------------------------------
// FEATURE 3: SCRAP PASSPORT TRACEABILITY
// -------------------------------------------------------------
export interface ScrapPassportEvent {
  id: string;
  stage: string;
  actorRole: string;
  actorName: string;
  location?: string;
  evidenceType: 'SELF_REPORTED' | 'SYSTEM_RECORDED' | 'INDEPENDENTLY_VERIFIED';
  details?: any;
  eventHash: string;
  timestamp: string;
}

export interface ScrapPassportData {
  lotNumber: string;
  qrCodeData: string;
  status: string;
  category: {
    id: string;
    name: string;
    hindiName: string;
    slug: string;
    icon: string;
  };
  grade: string;
  declaredWeightKg: number;
  collectedWeightKg?: number | null;
  receivedWeightKg?: number | null;
  weightDiscrepancyKg?: number | null;
  discrepancyPercentage?: number | null;
  hasDiscrepancy: boolean;
  isDisputed: boolean;
  disputeReason?: string | null;
  agreedRatePerKg?: number | null;
  estimatedGrossValue?: number | null;
  estimatedNetProceeds?: number | null;
  processingMethod?: string | null;
  processingBatchNumber?: string | null;
  processingNotes?: string | null;
  processingConfirmedAt?: string | null;
  cpcbComplianceRef?: string | null;
  currentHashSha256: string;
  createdAt: string;
  generator: {
    name: string;
    originLocation: string;
  };
  collector: {
    name: string;
    vehicleType: string;
    reliabilityRating: number;
    phone?: string;
  };
  buyer?: {
    name: string;
    address: string;
    phone?: string;
  } | null;
  environmentalImpact: {
    carbonSavedKg: number;
    waterSavedLiters: number;
    treesEquivalent: number;
  };
  events: ScrapPassportEvent[];
  isAuthorizedDetailView: boolean;
}

// -------------------------------------------------------------
// FEATURE 4: VOICE COMMAND ENGINE
// -------------------------------------------------------------
export interface VoiceCommandResponse {
  success: boolean;
  logId?: string;
  intent: string;
  commandText: string;
  confidence: number;
  recognizedAction: string;
  targetRoute?: string;
  modalTarget?: string;
  parameters?: Record<string, any>;
  requiresConfirmation: boolean;
  hindiTitle: string;
  englishTitle: string;
  hindiConfirmationMessage: string;
  englishConfirmationMessage: string;
  suggestedQuickActions: Array<{ labelHi: string; labelEn: string; command: string }>;
}

