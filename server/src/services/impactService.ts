import prisma from '../utils/prisma.js';

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

export class ImpactService {
  /**
   * Aggregates platform-wide or user-specific environmental metrics
   */
  static async getPlatformImpact(userId?: string): Promise<EnvironmentalImpactSummary> {
    // 1. Where filter for pickups
    const pickupFilter: any = { status: 'COMPLETED' };
    if (userId) {
      pickupFilter.OR = [{ requesterId: userId }, { assignedCollectorId: userId }];
    }

    const completedPickups = await prisma.pickupRequest.findMany({
      where: pickupFilter,
      include: {
        actualCollected: {
          include: { category: true },
        },
        transaction: true,
      },
    });

    const completedPickupsCount = completedPickups.length;
    let totalMaterialCollectedKg = 0;
    let totalCollectorPayoutsInr = 0;
    let co2OffsetKg = 0;
    let treesSaved = 0;
    let waterSavedLitres = 0;
    let energySavedKwh = 0;

    const categoryMap: Record<
      string,
      {
        name: string;
        hindiName: string;
        totalKg: number;
        co2SavedKg: number;
      }
    > = {};

    for (const p of completedPickups) {
      if (p.transaction) {
        totalCollectorPayoutsInr += p.transaction.totalAmount;
      }

      for (const item of p.actualCollected) {
        const qty = item.actualQty;
        totalMaterialCollectedKg += qty;

        const cat = item.category;
        const itemCo2 = qty * (cat.carbonFactorKg || 1.2);
        const itemTrees = qty * (cat.treeFactorKg || 0.0);
        const itemWater = qty * (cat.waterFactorL || 15.0);
        const itemEnergy = qty * (cat.energyFactorKwh || 3.5);

        co2OffsetKg += itemCo2;
        treesSaved += itemTrees;
        waterSavedLitres += itemWater;
        energySavedKwh += itemEnergy;

        if (!categoryMap[cat.name]) {
          categoryMap[cat.name] = {
            name: cat.name,
            hindiName: cat.hindiName,
            totalKg: 0,
            co2SavedKg: 0,
          };
        }
        categoryMap[cat.name].totalKg += qty;
        categoryMap[cat.name].co2SavedKg += itemCo2;
      }
    }

    // Material breakdown array with percentages
    const materialBreakdown = Object.values(categoryMap).map((c) => ({
      categoryName: c.name,
      hindiName: c.hindiName,
      totalKg: Math.round(c.totalKg * 10) / 10,
      percentage:
        totalMaterialCollectedKg > 0
          ? Math.round((c.totalKg / totalMaterialCollectedKg) * 1000) / 10
          : 0,
      co2SavedKg: Math.round(c.co2SavedKg * 10) / 10,
    }));

    // Platform user counts
    const activeCollectorsCount = await prisma.user.count({
      where: { role: 'COLLECTOR', isVerified: true },
    });
    const participatingUsersCount = await prisma.user.count({
      where: { role: { in: ['HOUSEHOLD', 'BUSINESS'] } },
    });
    const participatingRecyclersCount = await prisma.user.count({
      where: { role: 'RECYCLER', isVerified: true },
    });

    const verifiedRecyclerIntakeSum = await prisma.recyclerIntake.aggregate({
      _sum: { netWeightKg: true },
    });

    return {
      verifiedTotals: {
        completedPickupsCount,
        totalMaterialCollectedKg: Math.round(totalMaterialCollectedKg * 10) / 10,
        totalCollectorPayoutsInr: Math.round(totalCollectorPayoutsInr * 100) / 100,
        verifiedRecyclerIntakeKg: Math.round((verifiedRecyclerIntakeSum._sum.netWeightKg || 0) * 10) / 10,
        activeCollectorsCount,
        participatingUsersCount,
        participatingRecyclersCount,
      },
      ecologicalSavings: {
        co2EquivalentOffsetKg: Math.round(co2OffsetKg * 10) / 10,
        treesSavedCount: Math.round(treesSaved * 10) / 10,
        waterConservedLitres: Math.round(waterSavedLitres * 10) / 10,
        energySavedKwh: Math.round(energySavedKwh * 10) / 10,
        landfillDiversionKg: Math.round(totalMaterialCollectedKg * 10) / 10,
      },
      materialBreakdown,
      methodologyNotes: {
        carbonFactorSource:
          'CPCB (Central Pollution Control Board) & EPA WARM Lifecycle Carbon Equivalency Model.',
        treesCalculationFormula:
          '17 mature trees saved per 1,000 kg of virgin paper pulp substituted by recovered paper fiber.',
        verificationDistinction:
          'Metrics strictly distinguish between physical scales-verified collected scrap (recorded on digital receipts) vs pre-pickup user estimates.',
      },
    };
  }
}
