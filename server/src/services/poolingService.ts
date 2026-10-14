import prisma from '../utils/prisma.js';
import { calculateDistanceKm } from '../utils/geoUtils.js';

export interface PoolSummary {
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
  collectionDeadline: Date;
  status: string;
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
  createdAt: Date;
}

export class PoolingService {
  /**
   * List available pooling groups with optional category, status, and proximity filters
   */
  static async listPools(params: {
    categoryId?: string;
    status?: string;
    userLat?: number;
    userLng?: number;
    search?: string;
  }): Promise<PoolSummary[]> {
    const { categoryId, status, userLat, userLng, search } = params;

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { poolCode: { contains: search } },
      ];
    }

    const pools = await prisma.scrapPool.findMany({
      where,
      include: {
        category: true,
        creator: { select: { id: true, name: true } },
        matchedBuyer: { select: { id: true, name: true, profile: true } },
        matchedOffer: true,
        pledges: {
          where: { status: { not: 'WITHDRAWN' } },
          select: { collectorId: true, pledgedWeightKg: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return pools.map((p) => {
      const remainingKg = Math.max(0, p.targetWeightKg - p.currentPledgedKg);
      const progressPercentage = Math.min(100, Math.round((p.currentPledgedKg / p.targetWeightKg) * 100));
      const premiumSpreadPerKg = Math.round((p.targetPricePerKg - p.baselinePricePerKg) * 100) / 100;
      const estimatedTotalBulkValue = Math.round(p.targetWeightKg * p.targetPricePerKg);

      const uniqueParticipants = new Set(p.pledges.map((pl) => pl.collectorId)).size;

      let distanceKm: number | undefined;
      if (userLat && userLng) {
        distanceKm = calculateDistanceKm(userLat, userLng, p.hubLat, p.hubLng);
      }

      return {
        id: p.id,
        poolCode: p.poolCode,
        title: p.title,
        description: p.description,
        category: {
          id: p.category.id,
          name: p.category.name,
          hindiName: p.category.hindiName,
          slug: p.category.slug,
        },
        targetWeightKg: p.targetWeightKg,
        currentPledgedKg: p.currentPledgedKg,
        remainingKg,
        progressPercentage,
        targetPricePerKg: p.targetPricePerKg,
        baselinePricePerKg: p.baselinePricePerKg,
        premiumSpreadPerKg,
        estimatedTotalBulkValue,
        collectionDeadline: p.collectionDeadline,
        status: p.status,
        hubLocationName: p.hubLocationName,
        hubAddress: p.hubAddress,
        hubLat: p.hubLat,
        hubLng: p.hubLng,
        distanceKm,
        creatorName: p.creator.name,
        participantsCount: uniqueParticipants,
        matchedBuyer: p.matchedBuyer
          ? {
              id: p.matchedBuyer.id,
              name: p.matchedBuyer.name,
              facilityName: p.matchedOffer?.facilityName,
            }
          : null,
        disbursementStatus: p.disbursementStatus,
        paymentReference: p.paymentReference,
        settlementNotes: p.settlementNotes,
        createdAt: p.createdAt,
      };
    });
  }

  /**
   * Get detailed pool breakdown with participant pledges and timeline
   */
  static async getPoolDetails(poolId: string) {
    const pool = await prisma.scrapPool.findUnique({
      where: { id: poolId },
      include: {
        category: true,
        creator: { select: { id: true, name: true, phone: true } },
        matchedBuyer: {
          select: {
            id: true,
            name: true,
            phone: true,
            profile: true,
          },
        },
        matchedOffer: true,
        pledges: {
          include: {
            collector: {
              select: {
                id: true,
                name: true,
                profile: true,
              },
            },
            scrapLot: true,
          },
          orderBy: { pledgedAt: 'desc' },
        },
        activities: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!pool) {
      throw new Error(`Scrap pool with ID ${poolId} not found.`);
    }

    const remainingKg = Math.max(0, pool.targetWeightKg - pool.currentPledgedKg);
    const progressPercentage = Math.min(100, Math.round((pool.currentPledgedKg / pool.targetWeightKg) * 100));

    // Active pledges
    const activePledges = pool.pledges.filter((p) => p.status !== 'WITHDRAWN');
    const totalPledgedWeight = activePledges.reduce((sum, p) => sum + p.pledgedWeightKg, 0);

    // Compute fair allocation preview
    const participantsBreakdown = activePledges.map((pl) => {
      const shareRatio = totalPledgedWeight > 0 ? pl.pledgedWeightKg / totalPledgedWeight : 0;
      const sharePercentage = Math.round(shareRatio * 1000) / 10;
      const estGrossPayout = Math.round(pl.pledgedWeightKg * pool.targetPricePerKg);
      const estSingleLotValue = Math.round(pl.pledgedWeightKg * pool.baselinePricePerKg);
      const poolingAdvantageInr = estGrossPayout - estSingleLotValue;

      return {
        pledgeId: pl.id,
        collectorId: pl.collectorId,
        collectorName: pl.collector.name,
        vehicleType: pl.collector.profile?.vehicleType || 'THREE_WHEELER',
        pledgedWeightKg: pl.pledgedWeightKg,
        verifiedWeightKg: pl.verifiedWeightKg,
        sharePercentage,
        estGrossPayout,
        poolingAdvantageInr,
        allocatedPayout: pl.allocatedPayout,
        status: pl.status,
        pledgedAt: pl.pledgedAt,
        lotNumber: pl.scrapLot?.lotNumber,
      };
    });

    return {
      pool: {
        ...pool,
        remainingKg,
        progressPercentage,
        estimatedTotalBulkValue: Math.round(pool.targetWeightKg * pool.targetPricePerKg),
      },
      participantsBreakdown,
      activities: pool.activities,
    };
  }

  /**
   * Create a new Collaborative Scrap Pool
   */
  static async createPool(
    creatorId: string,
    data: {
      title: string;
      description?: string;
      categoryId: string;
      targetWeightKg: number;
      targetPricePerKg: number;
      baselinePricePerKg?: number;
      collectionDeadline: string | Date;
      hubLocationName?: string;
      hubAddress?: string;
      hubLat?: number;
      hubLng?: number;
    }
  ) {
    const user = await prisma.user.findUnique({
      where: { id: creatorId },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    const category = await prisma.materialCategory.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new Error(`Invalid category ID: ${data.categoryId}`);
    }

    // Baseline price from database if not supplied
    let baselinePrice = data.baselinePricePerKg;
    if (!baselinePrice) {
      const price = await prisma.materialPrice.findFirst({
        where: { categoryId: data.categoryId },
      });
      baselinePrice = price ? price.indicativePrice : data.targetPricePerKg * 0.85;
    }

    // Generate readable pool code e.g. POOL-2026-PLAS-102
    const categoryCode = category.slug.substring(0, 4).toUpperCase();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const poolCode = `POOL-2026-${categoryCode}-${randomSuffix}`;

    const pool = await prisma.$transaction(async (tx) => {
      const created = await tx.scrapPool.create({
        data: {
          poolCode,
          title: data.title,
          description: data.description,
          creatorId,
          categoryId: data.categoryId,
          targetWeightKg: data.targetWeightKg,
          currentPledgedKg: 0,
          targetPricePerKg: data.targetPricePerKg,
          baselinePricePerKg: baselinePrice,
          collectionDeadline: new Date(data.collectionDeadline),
          status: 'OPEN',
          hubLocationName: data.hubLocationName || 'Mansarovar Circular Recovery Hub',
          hubAddress: data.hubAddress || 'Sector 4, RIICO Industrial Area, Mansarovar, Jaipur',
          hubLat: data.hubLat || 26.8450,
          hubLng: data.hubLng || 75.7600,
          disbursementStatus: 'PENDING_SALE',
        },
      });

      await tx.poolActivityLog.create({
        data: {
          poolId: created.id,
          actorId: creatorId,
          actorName: user.name,
          action: 'CREATED',
          details: JSON.stringify({
            title: created.title,
            targetWeightKg: created.targetWeightKg,
            targetPricePerKg: created.targetPricePerKg,
            category: category.name,
          }),
        },
      });

      return created;
    });

    return pool;
  }

  /**
   * Pledge scrap lot or weight to an active pool
   * Validates:
   * 1. Pool is OPEN
   * 2. Material compatibility
   * 3. Prevents duplicate lot pledge across active pools
   * 4. Enforces capacity limit
   */
  static async pledgeScrap(
    collectorId: string,
    poolId: string,
    data: {
      pledgedWeightKg: number;
      scrapLotId?: string;
    }
  ) {
    if (data.pledgedWeightKg <= 0) {
      throw new Error('Pledged weight must be greater than zero.');
    }

    const collector = await prisma.user.findUnique({
      where: { id: collectorId },
    });

    if (!collector) {
      throw new Error('Collector account not found.');
    }

    const pool = await prisma.scrapPool.findUnique({
      where: { id: poolId },
      include: { category: true },
    });

    if (!pool) {
      throw new Error(`Pool with ID ${poolId} not found.`);
    }

    if (pool.status !== 'OPEN') {
      throw new Error(`Cannot pledge scrap: Pool status is '${pool.status}' (Must be OPEN).`);
    }

    if (new Date() > pool.collectionDeadline) {
      throw new Error('Cannot pledge scrap: The pool collection deadline has expired.');
    }

    // Check duplicate pledge if scrapLotId is specified
    if (data.scrapLotId) {
      const lot = await prisma.scrapLot.findUnique({
        where: { id: data.scrapLotId },
      });

      if (!lot) {
        throw new Error(`Scrap lot ${data.scrapLotId} not found.`);
      }

      if (lot.collectorId !== collectorId) {
        throw new Error('Unauthorized: You do not own this scrap lot.');
      }

      if (lot.categoryId !== pool.categoryId) {
        throw new Error(`Material mismatch: Lot is ${lot.categoryId}, but pool requires ${pool.category.name}.`);
      }

      // Check if this lot is actively pledged in any pool
      const existingActivePledge = await prisma.poolPledge.findFirst({
        where: {
          scrapLotId: data.scrapLotId,
          status: 'PLEDGED',
        },
        include: { pool: true },
      });

      if (existingActivePledge) {
        throw new Error(
          `Scrap lot ${lot.lotNumber} is already pledged to active pool '${existingActivePledge.pool.title}' (${existingActivePledge.pool.poolCode}).`
        );
      }
    }

    // Check remaining capacity tolerance (cannot exceed target by more than 20%)
    const remainingKg = pool.targetWeightKg - pool.currentPledgedKg;
    const maxAllowedPledge = remainingKg + pool.targetWeightKg * 0.2;
    if (data.pledgedWeightKg > maxAllowedPledge) {
      throw new Error(
        `Pledge of ${data.pledgedWeightKg} kg exceeds pool capacity. Remaining required is ${Math.max(0, remainingKg)} kg.`
      );
    }

    // Execute pledge transaction
    const result = await prisma.$transaction(async (tx) => {
      const pledge = await tx.poolPledge.create({
        data: {
          poolId,
          collectorId,
          scrapLotId: data.scrapLotId,
          pledgedWeightKg: data.pledgedWeightKg,
          status: 'PLEDGED',
        },
      });

      const updatedPledgedKg = pool.currentPledgedKg + data.pledgedWeightKg;
      const targetMet = updatedPledgedKg >= pool.targetWeightKg;

      const updatedPool = await tx.scrapPool.update({
        where: { id: poolId },
        data: {
          currentPledgedKg: updatedPledgedKg,
          status: targetMet ? 'TARGET_REACHED' : 'OPEN',
        },
      });

      await tx.poolActivityLog.create({
        data: {
          poolId,
          actorId: collectorId,
          actorName: collector.name,
          action: 'PLEDGED',
          details: JSON.stringify({
            pledgedWeightKg: data.pledgedWeightKg,
            scrapLotId: data.scrapLotId,
            poolProgressKg: updatedPledgedKg,
            targetMet,
          }),
        },
      });

      if (targetMet) {
        await tx.poolActivityLog.create({
          data: {
            poolId,
            actorId: 'SYSTEM',
            actorName: 'ScrapSetu Pooling Engine',
            action: 'TARGET_MET',
            details: JSON.stringify({
              targetWeightKg: pool.targetWeightKg,
              achievedWeightKg: updatedPledgedKg,
              readyForBulkBuyerMatch: true,
            }),
          },
        });
      }

      return { pledge, pool: updatedPool };
    });

    return result;
  }

  /**
   * Withdraw a pledge from an OPEN pool
   */
  static async withdrawPledge(collectorId: string, pledgeId: string) {
    const pledge = await prisma.poolPledge.findUnique({
      where: { id: pledgeId },
      include: { pool: true, collector: true },
    });

    if (!pledge) {
      throw new Error(`Pledge with ID ${pledgeId} not found.`);
    }

    if (pledge.collectorId !== collectorId) {
      throw new Error('Unauthorized: You can only withdraw your own pledge.');
    }

    if (pledge.status !== 'PLEDGED') {
      throw new Error(`Cannot withdraw: Pledge is already '${pledge.status}'.`);
    }

    if (pledge.pool.status !== 'OPEN') {
      throw new Error(
        `Cannot withdraw: Pool status is '${pledge.pool.status}'. Pledges are locked once target is reached or matched.`
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedPledge = await tx.poolPledge.update({
        where: { id: pledgeId },
        data: { status: 'WITHDRAWN' },
      });

      const newCurrentKg = Math.max(0, pledge.pool.currentPledgedKg - pledge.pledgedWeightKg);

      await tx.scrapPool.update({
        where: { id: pledge.poolId },
        data: { currentPledgedKg: newCurrentKg },
      });

      await tx.poolActivityLog.create({
        data: {
          poolId: pledge.poolId,
          actorId: collectorId,
          actorName: pledge.collector.name,
          action: 'WITHDRAWN',
          details: JSON.stringify({
            withdrawnWeightKg: pledge.pledgedWeightKg,
            remainingPledgedKg: newCurrentKg,
          }),
        },
      });

      return updatedPledge;
    });

    return updated;
  }

  /**
   * Match completed or eligible pool with a bulk buyer offer
   */
  static async matchBulkBuyer(poolId: string, offerId: string, matchedByUserId: string) {
    const pool = await prisma.scrapPool.findUnique({
      where: { id: poolId },
      include: { category: true },
    });

    if (!pool) {
      throw new Error(`Pool with ID ${poolId} not found.`);
    }

    const offer = await prisma.recyclerOffer.findUnique({
      where: { id: offerId },
      include: { recycler: true },
    });

    if (!offer) {
      throw new Error(`Recycler offer with ID ${offerId} not found.`);
    }

    if (offer.categoryId !== pool.categoryId) {
      throw new Error('Category mismatch between pool and buyer offer.');
    }

    const bulkTotalValue = Math.round(pool.currentPledgedKg * offer.buyingPricePerKg * 100) / 100;

    const updated = await prisma.$transaction(async (tx) => {
      const matchedPool = await tx.scrapPool.update({
        where: { id: poolId },
        data: {
          matchedBuyerId: offer.recyclerId,
          matchedOfferId: offer.id,
          bulkNegotiatedRate: offer.buyingPricePerKg,
          totalPoolValue: bulkTotalValue,
          status: 'MATCHED',
          disbursementStatus: 'BUYER_CONFIRMED',
        },
      });

      await tx.poolActivityLog.create({
        data: {
          poolId,
          actorId: matchedByUserId,
          actorName: offer.recycler.name,
          action: 'BUYER_MATCHED',
          details: JSON.stringify({
            buyerName: offer.recycler.name,
            facilityName: offer.facilityName,
            bulkNegotiatedRate: offer.buyingPricePerKg,
            totalPoolValue: bulkTotalValue,
            paymentTerms: offer.paymentTerms,
          }),
        },
      });

      return matchedPool;
    });

    return updated;
  }

  /**
   * Record verified intake and compute transparent pro-rata settlement breakdown
   */
  static async recordIntakeAndSettlement(
    poolId: string,
    data: {
      verifiedPledges: { pledgeId: string; verifiedWeightKg: number }[];
      paymentReference?: string;
      settlementNotes?: string;
      recordedByUserId: string;
    }
  ) {
    const pool = await prisma.scrapPool.findUnique({
      where: { id: poolId },
      include: {
        pledges: { where: { status: 'PLEDGED' } },
        matchedOffer: true,
      },
    });

    if (!pool) {
      throw new Error(`Pool with ID ${poolId} not found.`);
    }

    const ratePerKg = pool.bulkNegotiatedRate || pool.targetPricePerKg;

    // Calculate total verified weight
    const totalVerifiedWeight = data.verifiedPledges.reduce(
      (sum, p) => sum + p.verifiedWeightKg,
      0
    );

    const totalVerifiedPayout = Math.round(totalVerifiedWeight * ratePerKg * 100) / 100;

    const result = await prisma.$transaction(async (tx) => {
      for (const vp of data.verifiedPledges) {
        const shareRatio = totalVerifiedWeight > 0 ? vp.verifiedWeightKg / totalVerifiedWeight : 0;
        const allocatedPayout = Math.round(shareRatio * totalVerifiedPayout * 100) / 100;

        await tx.poolPledge.update({
          where: { id: vp.pledgeId },
          data: {
            verifiedWeightKg: vp.verifiedWeightKg,
            allocatedPayout,
            status: 'VERIFIED',
            verifiedAt: new Date(),
          },
        });
      }

      const updatedPool = await tx.scrapPool.update({
        where: { id: poolId },
        data: {
          status: 'SETTLED',
          disbursementStatus: data.paymentReference ? 'SETTLED' : 'AWAITING_PAYMENT_PROOF',
          paymentReference: data.paymentReference,
          settlementNotes: data.settlementNotes || 'Physical weighbridge verified. Pro-rata allocation complete.',
          totalPoolValue: totalVerifiedPayout,
        },
      });

      await tx.poolActivityLog.create({
        data: {
          poolId,
          actorId: data.recordedByUserId,
          actorName: 'Recycler Weighbridge',
          action: 'SETTLED',
          details: JSON.stringify({
            totalVerifiedWeight,
            ratePerKg,
            totalVerifiedPayout,
            paymentReference: data.paymentReference || 'PENDING_BANK_UTR',
          }),
        },
      });

      return updatedPool;
    });

    return result;
  }
}
