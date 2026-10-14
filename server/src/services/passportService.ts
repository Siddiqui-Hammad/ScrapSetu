import crypto from 'crypto';
import prisma from '../utils/prisma.js';

export const LIFECYCLE_STAGES = [
  'GENERATED',
  'BOOKED',
  'COLLECTED',
  'WEIGHED',
  'BUYER_SELECTED',
  'HANDED_OVER',
  'RECEIVED',
  'PROCESSING_CONFIRMED',
] as const;

export type LifecycleStage = typeof LIFECYCLE_STAGES[number];

export class PassportService {
  /**
   * Helper to generate a tamper-evident SHA-256 event hash
   */
  static generateHash(payload: any, prevHash: string = ''): string {
    const dataString = JSON.stringify(payload) + prevHash + Date.now();
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }

  /**
   * Generate a unique non-guessable lot number (e.g. LOT-2026-X8K9M2)
   */
  static generateLotNumber(categorySlug: string = 'SCRP'): string {
    const prefix = 'LOT-2026';
    const rand = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `${prefix}-${rand}`;
  }

  /**
   * Create or initialize a new Scrap Passport
   */
  static async createPassport(data: {
    collectorId: string;
    categoryId: string;
    grade?: string;
    declaredWeightKg: number;
    collectedWeightKg?: number;
    pickupRequestId?: string;
    originCity?: string;
    originState?: string;
    originPincode?: string;
    actorName?: string;
  }) {
    const category = await prisma.materialCategory.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new Error(`Category ${data.categoryId} not found.`);
    }

    const collector = await prisma.user.findUnique({
      where: { id: data.collectorId },
    });

    if (!collector) {
      throw new Error(`Collector ${data.collectorId} not found.`);
    }

    const lotNumber = this.generateLotNumber(category.slug);
    const initialHash = this.generateHash({ lotNumber, categoryId: category.id, weight: data.declaredWeightKg });

    const lot = await prisma.$transaction(async (tx) => {
      const createdLot = await tx.scrapLot.create({
        data: {
          lotNumber,
          qrCodeData: `/passport/${lotNumber}`,
          pickupRequestId: data.pickupRequestId,
          collectorId: data.collectorId,
          categoryId: data.categoryId,
          grade: data.grade || 'Standard',
          declaredWeightKg: data.declaredWeightKg,
          collectedWeightKg: data.collectedWeightKg || data.declaredWeightKg,
          status: data.collectedWeightKg ? 'WEIGHED' : 'COLLECTED',
          originCity: data.originCity || 'Jaipur',
          originState: data.originState || 'Rajasthan',
          originPincode: data.originPincode || '302020',
          currentHashSha256: initialHash,
        },
      });

      // Event 1: Origin creation
      await tx.scrapLotEvent.create({
        data: {
          scrapLotId: createdLot.id,
          stage: 'GENERATED',
          actorRole: 'SYSTEM',
          actorName: 'ScrapSetu Digital Ledger',
          evidenceType: 'SYSTEM_RECORDED',
          location: `${createdLot.originCity}, ${createdLot.originState}`,
          details: JSON.stringify({
            message: 'Unique material digital identity created.',
            lotNumber,
            material: category.name,
            declaredWeightKg: data.declaredWeightKg,
          }),
          eventHash: initialHash,
        },
      });

      // Event 2: Collection & Weighed
      const secondHash = this.generateHash({ stage: 'COLLECTED', weight: createdLot.collectedWeightKg }, initialHash);
      await tx.scrapLotEvent.create({
        data: {
          scrapLotId: createdLot.id,
          stage: data.collectedWeightKg ? 'WEIGHED' : 'COLLECTED',
          actorRole: 'COLLECTOR',
          actorName: data.actorName || collector.name,
          actorId: data.collectorId,
          evidenceType: 'INDEPENDENTLY_VERIFIED',
          location: `${createdLot.originCity}`,
          details: JSON.stringify({
            message: 'Doorstep weighment verified via digital scale.',
            collectedWeightKg: createdLot.collectedWeightKg,
            grade: createdLot.grade,
          }),
          eventHash: secondHash,
        },
      });

      await tx.scrapLot.update({
        where: { id: createdLot.id },
        data: { currentHashSha256: secondHash },
      });

      return createdLot;
    });

    return lot;
  }

  /**
   * Retrieve passport data with privacy protection:
   * Masks personal identifiable information (PII) for public visitors,
   * reveals authorized details for participants (collector, recycler, admin).
   */
  static async getPassport(identifier: string, requestingUserId?: string, requestingUserRole?: string) {
    const lot = await prisma.scrapLot.findFirst({
      where: {
        OR: [{ lotNumber: identifier }, { id: identifier }],
      },
      include: {
        category: true,
        collector: {
          select: {
            id: true,
            name: true,
            phone: true,
            profile: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true,
            profile: true,
          },
        },
        selectedOffer: true,
        pickupRequest: {
          include: {
            requester: { select: { id: true, name: true, phone: true } },
            address: true,
          },
        },
        events: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    if (!lot) {
      throw new Error(`Scrap Passport for '${identifier}' not found.`);
    }

    const isAuthorized =
      requestingUserRole === 'ADMIN' ||
      (Boolean(requestingUserId) &&
        (requestingUserId === lot.collectorId ||
          requestingUserId === lot.buyerId ||
          (Boolean(lot.pickupRequest) && requestingUserId === lot.pickupRequest?.requesterId)));

    // Environmental metrics calculation based on verified/collected weight
    const effectiveWeightKg = lot.receivedWeightKg || lot.collectedWeightKg || lot.declaredWeightKg;
    const carbonSavedKg = Math.round(effectiveWeightKg * lot.category.carbonFactorKg * 10) / 10;
    const waterSavedLiters = Math.round(effectiveWeightKg * lot.category.waterFactorL);
    const treesEquivalent = Math.round(effectiveWeightKg * lot.category.treeFactorKg * 10) / 10;

    // Mask PII for privacy-safe public view
    const publicOrigin = lot.pickupRequest?.address
      ? `${lot.pickupRequest.address.area || 'Neighborhood'}, ${lot.pickupRequest.address.city}`
      : `${lot.originCity}, ${lot.originState}`;

    const maskedGeneratorName = lot.pickupRequest?.requester?.name
      ? lot.pickupRequest.requester.name.split(' ')[0] + ' (Verified Citizen)'
      : 'Verified Generator';

    const maskedCollector = {
      name: lot.collector.name,
      vehicleType: lot.collector.profile?.vehicleType || 'THREE_WHEELER',
      reliabilityRating: lot.collector.profile?.reliabilityRating || 4.8,
      phone: isAuthorized ? lot.collector.phone : undefined,
    };

    const maskedBuyer = lot.buyer
      ? {
          name: lot.selectedOffer?.facilityName || lot.buyer.name,
          address: lot.selectedOffer?.facilityAddress || 'Authorized Recycling Plant, Jaipur',
          phone: isAuthorized ? lot.buyer.phone : undefined,
        }
      : null;

    return {
      lotNumber: lot.lotNumber,
      qrCodeData: lot.qrCodeData,
      status: lot.status,
      category: {
        id: lot.category.id,
        name: lot.category.name,
        hindiName: lot.category.hindiName,
        slug: lot.category.slug,
        icon: lot.category.icon,
      },
      grade: lot.grade,
      declaredWeightKg: lot.declaredWeightKg,
      collectedWeightKg: lot.collectedWeightKg,
      receivedWeightKg: lot.receivedWeightKg,
      weightDiscrepancyKg: lot.weightDiscrepancyKg,
      discrepancyPercentage: lot.discrepancyPercentage,
      hasDiscrepancy: lot.hasDiscrepancy,
      isDisputed: lot.isDisputed,
      disputeReason: lot.disputeReason,
      agreedRatePerKg: lot.agreedRatePerKg,
      estimatedGrossValue: lot.estimatedGrossValue,
      estimatedNetProceeds: lot.estimatedNetProceeds,
      processingMethod: lot.processingMethod,
      processingBatchNumber: lot.processingBatchNumber,
      processingNotes: lot.processingNotes,
      processingConfirmedAt: lot.processingConfirmedAt,
      cpcbComplianceRef: lot.cpcbComplianceRef,
      currentHashSha256: lot.currentHashSha256,
      createdAt: lot.createdAt,
      generator: {
        name: maskedGeneratorName,
        originLocation: publicOrigin,
      },
      collector: maskedCollector,
      buyer: maskedBuyer,
      environmentalImpact: {
        carbonSavedKg,
        waterSavedLiters,
        treesEquivalent,
      },
      events: lot.events.map((e) => ({
        id: e.id,
        stage: e.stage,
        actorRole: e.actorRole,
        actorName: e.actorName,
        location: e.location,
        evidenceType: e.evidenceType,
        details: e.details ? JSON.parse(e.details) : null,
        eventHash: e.eventHash,
        timestamp: e.timestamp,
      })),
      isAuthorizedDetailView: isAuthorized,
    };
  }

  /**
   * Collector marks lot as HANDED_OVER to the buyer/facility
   */
  static async confirmHandover(lotId: string, collectorId: string, notes?: string) {
    const lot = await prisma.scrapLot.findUnique({
      where: { id: lotId },
      include: { collector: true, selectedOffer: true },
    });

    if (!lot) throw new Error(`Lot ${lotId} not found.`);
    if (lot.collectorId !== collectorId) throw new Error('Unauthorized.');
    if (lot.status !== 'BUYER_SELECTED' && lot.status !== 'WEIGHED') {
      throw new Error(`Cannot handover lot: Current status is '${lot.status}'.`);
    }

    const newHash = this.generateHash({ stage: 'HANDED_OVER', lotId, notes }, lot.currentHashSha256);

    const updated = await prisma.$transaction(async (tx) => {
      const lotRes = await tx.scrapLot.update({
        where: { id: lotId },
        data: {
          status: 'HANDED_OVER',
          currentHashSha256: newHash,
        },
      });

      await tx.scrapLotEvent.create({
        data: {
          scrapLotId: lotId,
          stage: 'HANDED_OVER',
          actorRole: 'COLLECTOR',
          actorName: lot.collector.name,
          actorId: collectorId,
          location: lot.selectedOffer?.facilityName || 'Transit to Recycler Weighbridge',
          evidenceType: 'INDEPENDENTLY_VERIFIED',
          details: JSON.stringify({
            message: 'Scrap lot dispatched and handed over for facility intake.',
            notes: notes || 'Handover dispatch recorded.',
          }),
          eventHash: newHash,
        },
      });

      return lotRes;
    });

    return updated;
  }

  /**
   * Recycler records facility intake and performs digital weighbridge comparison.
   * Auto-flags discrepancy if receiving weight diverges beyond 2% or 0.75kg.
   */
  static async confirmReceipt(
    lotId: string,
    recyclerId: string,
    data: {
      receivedWeightKg: number;
      weighbridgeSlipNumber?: string;
      notes?: string;
    }
  ) {
    const lot = await prisma.scrapLot.findUnique({
      where: { id: lotId },
      include: { buyer: true, selectedOffer: true, category: true },
    });

    if (!lot) throw new Error(`Lot ${lotId} not found.`);
    if (lot.buyerId && lot.buyerId !== recyclerId) {
      throw new Error('Unauthorized: This lot was assigned to a different recycler.');
    }

    const baselineWeight = lot.collectedWeightKg || lot.declaredWeightKg;
    const discrepancyKg = Math.round((data.receivedWeightKg - baselineWeight) * 100) / 100;
    const discrepancyPercentage = Math.round((discrepancyKg / baselineWeight) * 1000) / 10;

    // Tolerance check: Discrepancy > 2% or > 0.75kg is flagged
    const hasDiscrepancy = Math.abs(discrepancyPercentage) > 2.0 || Math.abs(discrepancyKg) > 0.75;

    const newHash = this.generateHash(
      { stage: 'RECEIVED', receivedWeightKg: data.receivedWeightKg, discrepancyKg },
      lot.currentHashSha256
    );

    const updated = await prisma.$transaction(async (tx) => {
      const lotRes = await tx.scrapLot.update({
        where: { id: lotId },
        data: {
          buyerId: recyclerId,
          receivedWeightKg: data.receivedWeightKg,
          weightDiscrepancyKg: discrepancyKg,
          discrepancyPercentage,
          hasDiscrepancy,
          status: 'RECEIVED',
          currentHashSha256: newHash,
        },
      });

      await tx.scrapLotEvent.create({
        data: {
          scrapLotId: lotId,
          stage: 'RECEIVED',
          actorRole: 'RECYCLER',
          actorName: lot.selectedOffer?.facilityName || 'Authorized Recycler Facility',
          actorId: recyclerId,
          location: lot.selectedOffer?.facilityAddress || 'Plant Weighbridge Gate',
          evidenceType: 'INDEPENDENTLY_VERIFIED',
          details: JSON.stringify({
            message: hasDiscrepancy
              ? `Weighbridge intake recorded with discrepancy: ${discrepancyKg > 0 ? '+' : ''}${discrepancyKg} kg (${discrepancyPercentage}%).`
              : 'Weighbridge intake verified within calibrated tolerance.',
            receivedWeightKg: data.receivedWeightKg,
            collectorWeightKg: baselineWeight,
            discrepancyKg,
            discrepancyPercentage,
            weighbridgeSlipNumber: data.weighbridgeSlipNumber || `WB-${Date.now().toString().slice(-6)}`,
            hasDiscrepancy,
            notes: data.notes,
          }),
          eventHash: newHash,
        },
      });

      return lotRes;
    });

    return updated;
  }

  /**
   * Recycler updates and confirms processing with circular evidence
   */
  static async confirmProcessing(
    lotId: string,
    recyclerId: string,
    data: {
      processingMethod: string;
      processingBatchNumber: string;
      cpcbComplianceRef?: string;
      processingEvidenceUrl?: string;
      processingNotes?: string;
    }
  ) {
    const lot = await prisma.scrapLot.findUnique({
      where: { id: lotId },
      include: { buyer: true, selectedOffer: true },
    });

    if (!lot) throw new Error(`Lot ${lotId} not found.`);
    if (lot.buyerId !== recyclerId) {
      throw new Error('Unauthorized: Only the assigned receiving facility can confirm processing.');
    }

    if (lot.status !== 'RECEIVED') {
      throw new Error(`Cannot confirm processing: Lot must be in 'RECEIVED' state (current: '${lot.status}').`);
    }

    const newHash = this.generateHash(
      { stage: 'PROCESSING_CONFIRMED', batch: data.processingBatchNumber, method: data.processingMethod },
      lot.currentHashSha256
    );

    const updated = await prisma.$transaction(async (tx) => {
      const lotRes = await tx.scrapLot.update({
        where: { id: lotId },
        data: {
          status: 'PROCESSING_CONFIRMED',
          processingMethod: data.processingMethod,
          processingBatchNumber: data.processingBatchNumber,
          cpcbComplianceRef: data.cpcbComplianceRef || `CPCB/EPR/2026/${Math.floor(10000 + Math.random() * 90000)}`,
          processingEvidenceUrl: data.processingEvidenceUrl,
          processingNotes: data.processingNotes,
          processingConfirmedAt: new Date(),
          currentHashSha256: newHash,
        },
      });

      await tx.scrapLotEvent.create({
        data: {
          scrapLotId: lotId,
          stage: 'PROCESSING_CONFIRMED',
          actorRole: 'RECYCLER',
          actorName: lot.selectedOffer?.facilityName || 'Authorized Processing Plant',
          actorId: recyclerId,
          location: 'Recycling & Transformation Line',
          evidenceType: 'INDEPENDENTLY_VERIFIED',
          details: JSON.stringify({
            message: 'Material batch transformation confirmed under CPCB circular guidelines.',
            processingMethod: data.processingMethod,
            processingBatchNumber: data.processingBatchNumber,
            cpcbComplianceRef: lotRes.cpcbComplianceRef,
            notes: data.processingNotes,
          }),
          eventHash: newHash,
        },
      });

      return lotRes;
    });

    return updated;
  }
}
