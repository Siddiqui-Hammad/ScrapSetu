import prisma from '../utils/prisma.js';
import { calculateDistanceKm } from '../utils/geoUtils.js';

export interface TransportEstimate {
  vehicleType: string;
  baseFare: number;
  ratePerKm: number;
  distanceKm: number;
  totalTransportCost: number;
}

export interface BuyerMatchResult {
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
  
  // Financial breakdown
  weightKg: number;
  grossValue: number;
  transportEstimate: TransportEstimate;
  handlingFeeTotal: number;
  netProceeds: number;
  effectiveRatePerKg: number;
  
  // Eligibility & Explainability
  isEligible: boolean;
  meetsMinQuantity: boolean;
  meetsCapacity: boolean;
  recommendationRank?: number;
  recommendationReason: string;
  disqualificationReason?: string;
}

export class SmartBuyerMatchingService {
  /**
   * Calculate vehicle transportation cost based on vehicle tier and distance
   * Transport formula: Base Fare + (Distance in km * Per-km Rate)
   */
  static calculateTransportCost(distanceKm: number, vehicleType: string = 'THREE_WHEELER'): TransportEstimate {
    let baseFare = 50.0;
    let ratePerKm = 12.0;

    switch (vehicleType.toUpperCase()) {
      case 'CYCLE_RICKSHAW':
      case 'HAND_CART':
        baseFare = 25.0;
        ratePerKm = 6.0;
        break;
      case 'THREE_WHEELER':
        baseFare = 50.0;
        ratePerKm = 12.0;
        break;
      case 'MINI_TRUCK':
      case 'TEMPO':
        baseFare = 90.0;
        ratePerKm = 18.0;
        break;
      case 'TRUCK':
        baseFare = 150.0;
        ratePerKm = 25.0;
        break;
      default:
        baseFare = 50.0;
        ratePerKm = 12.0;
    }

    const variableCost = Math.round(distanceKm * ratePerKm);
    const totalTransportCost = Math.round(baseFare + variableCost);

    return {
      vehicleType,
      baseFare,
      ratePerKm,
      distanceKm: Math.round(distanceKm * 10) / 10,
      totalTransportCost,
    };
  }

  /**
   * Match available recycler offers for a scrap lot or inventory
   */
  static async matchBuyers(params: {
    categoryId: string;
    weightKg: number;
    grade?: string;
    collectorLat: number;
    collectorLng: number;
    vehicleType?: string;
    lotId?: string;
  }): Promise<{
    eligibleBuyers: BuyerMatchResult[];
    incompatibleBuyers: BuyerMatchResult[];
    recommendedBuyer: BuyerMatchResult | null;
    meta: {
      lotId?: string;
      categoryName: string;
      weightKg: number;
      collectorLocation: { lat: number; lng: number };
      vehicleType: string;
      timestamp: string;
    };
  }> {
    const { categoryId, weightKg, collectorLat, collectorLng, vehicleType = 'THREE_WHEELER', lotId } = params;

    const category = await prisma.materialCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new Error(`Material category with ID ${categoryId} not found.`);
    }

    // Retrieve active recycler offers for this category
    const offers = await prisma.recyclerOffer.findMany({
      where: {
        categoryId,
        isActive: true,
      },
      include: {
        recycler: {
          select: {
            id: true,
            name: true,
            phone: true,
            profile: true,
          },
        },
        category: true,
      },
    });

    const evaluatedMatches: BuyerMatchResult[] = [];

    for (const offer of offers) {
      const distanceKm = calculateDistanceKm(collectorLat, collectorLng, offer.lat, offer.lng);
      const transport = this.calculateTransportCost(distanceKm, vehicleType);

      const grossValue = Math.round(weightKg * offer.buyingPricePerKg * 100) / 100;
      const handlingFeeTotal = Math.round(weightKg * (offer.handlingFeePerKg || 0) * 100) / 100;
      const netProceeds = Math.max(0, Math.round((grossValue - transport.totalTransportCost - handlingFeeTotal) * 100) / 100);
      const effectiveRatePerKg = weightKg > 0 ? Math.round((netProceeds / weightKg) * 100) / 100 : 0;

      const availableCapacityKg = Math.max(0, offer.maxCapacityKg - offer.currentIntakeKg);
      const meetsMinQuantity = weightKg >= offer.minQuantityKg;
      const meetsCapacity = availableCapacityKg >= weightKg;
      const isEligible = meetsMinQuantity && meetsCapacity;

      let disqualificationReason: string | undefined;
      if (!meetsMinQuantity) {
        disqualificationReason = `Minimum lot size requirement not met: Requires min ${offer.minQuantityKg} kg (current lot: ${weightKg} kg).`;
      } else if (!meetsCapacity) {
        disqualificationReason = `Facility capacity exceeded: Available intake is ${availableCapacityKg} kg (lot requires ${weightKg} kg).`;
      }

      let recommendationReason = '';
      if (isEligible) {
        recommendationReason = `Estimated net return ₹${netProceeds.toLocaleString('en-IN')} after ₹${transport.totalTransportCost} transport over ${distanceKm} km.`;
      } else {
        recommendationReason = disqualificationReason || 'Ineligible offer.';
      }

      evaluatedMatches.push({
        offerId: offer.id,
        recyclerId: offer.recyclerId,
        recyclerName: offer.recycler.name,
        facilityName: offer.facilityName,
        facilityAddress: offer.facilityAddress,
        distanceKm,
        buyingPricePerKg: offer.buyingPricePerKg,
        minQuantityKg: offer.minQuantityKg,
        maxCapacityKg: offer.maxCapacityKg,
        currentIntakeKg: offer.currentIntakeKg,
        availableCapacityKg,
        gradeAccepted: offer.gradeAccepted,
        paymentTerms: offer.paymentTerms || 'INSTANT_BANK_TRANSFER',
        handlingFeePerKg: offer.handlingFeePerKg || 0,
        weightKg,
        grossValue,
        transportEstimate: transport,
        handlingFeeTotal,
        netProceeds,
        effectiveRatePerKg,
        isEligible,
        meetsMinQuantity,
        meetsCapacity,
        recommendationReason,
        disqualificationReason,
      });
    }

    // Rank eligible buyers primarily by Net Proceeds DESC, then by Distance ASC
    const eligibleBuyers = evaluatedMatches
      .filter((m) => m.isEligible)
      .sort((a, b) => {
        if (b.netProceeds !== a.netProceeds) {
          return b.netProceeds - a.netProceeds;
        }
        return a.distanceKm - b.distanceKm;
      });

    // Assign ranking and highlight top reasons
    eligibleBuyers.forEach((b, idx) => {
      b.recommendationRank = idx + 1;
      if (idx === 0) {
        b.recommendationReason = `★ TOP RECOMMENDATION: Maximum net earnings (₹${b.netProceeds.toLocaleString('en-IN')}) with lowest transit loss over ${b.distanceKm} km.`;
      } else {
        const netDiff = eligibleBuyers[0].netProceeds - b.netProceeds;
        b.recommendationReason = `Rank #${idx + 1}: ₹${b.netProceeds.toLocaleString('en-IN')} net proceeds (₹${netDiff.toLocaleString('en-IN')} lower net return than #1 due to ${b.distanceKm} km distance).`;
      }
    });

    // Incompatible buyers
    const incompatibleBuyers = evaluatedMatches
      .filter((m) => !m.isEligible)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return {
      eligibleBuyers,
      incompatibleBuyers,
      recommendedBuyer: eligibleBuyers.length > 0 ? eligibleBuyers[0] : null,
      meta: {
        lotId,
        categoryName: category.name,
        weightKg,
        collectorLocation: { lat: collectorLat, lng: collectorLng },
        vehicleType,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Select a buyer for a scrap lot
   */
  static async selectBuyerForLot(lotId: string, offerId: string, collectorId: string) {
    const lot = await prisma.scrapLot.findUnique({
      where: { id: lotId },
      include: { category: true },
    });

    if (!lot) {
      throw new Error(`Scrap lot with ID ${lotId} not found.`);
    }

    if (lot.collectorId !== collectorId) {
      throw new Error('Unauthorized: You do not own this scrap lot.');
    }

    const offer = await prisma.recyclerOffer.findUnique({
      where: { id: offerId },
      include: { recycler: true },
    });

    if (!offer) {
      throw new Error(`Recycler offer with ID ${offerId} not found.`);
    }

    // Collector location from profile or default Jaipur
    const collector = await prisma.user.findUnique({
      where: { id: collectorId },
      include: { addresses: { where: { isDefault: true }, take: 1 }, profile: true },
    });

    const collectorLat = collector?.addresses[0]?.lat || 26.8501;
    const collectorLng = collector?.addresses[0]?.lng || 75.8155;
    const vehicleType = collector?.profile?.vehicleType || 'THREE_WHEELER';

    const distanceKm = calculateDistanceKm(collectorLat, collectorLng, offer.lat, offer.lng);
    const transport = this.calculateTransportCost(distanceKm, vehicleType);

    const grossValue = Math.round(lot.declaredWeightKg * offer.buyingPricePerKg * 100) / 100;
    const netProceeds = Math.max(0, grossValue - transport.totalTransportCost);

    // Update lot atomically
    const updatedLot = await prisma.$transaction(async (tx) => {
      const updated = await tx.scrapLot.update({
        where: { id: lotId },
        data: {
          buyerId: offer.recyclerId,
          selectedOfferId: offer.id,
          agreedRatePerKg: offer.buyingPricePerKg,
          estimatedGrossValue: grossValue,
          estimatedTransportCost: transport.totalTransportCost,
          estimatedNetProceeds: netProceeds,
          status: 'BUYER_SELECTED',
        },
      });

      // Record event
      await tx.scrapLotEvent.create({
        data: {
          scrapLotId: lotId,
          stage: 'BUYER_SELECTED',
          actorRole: 'COLLECTOR',
          actorName: collector?.name || 'Collector',
          actorId: collectorId,
          location: `${distanceKm} km route to ${offer.facilityName}`,
          evidenceType: 'SYSTEM_RECORDED',
          details: JSON.stringify({
            facilityName: offer.facilityName,
            recyclerName: offer.recycler.name,
            buyingPricePerKg: offer.buyingPricePerKg,
            estimatedGrossValue: grossValue,
            estimatedTransportCost: transport.totalTransportCost,
            estimatedNetProceeds: netProceeds,
            distanceKm,
            paymentTerms: offer.paymentTerms,
          }),
          eventHash: `hash-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        },
      });

      return updated;
    });

    return updatedLot;
  }
}
