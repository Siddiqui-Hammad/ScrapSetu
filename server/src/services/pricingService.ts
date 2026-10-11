import prisma from '../utils/prisma.js';

export interface PriceEstimateBreakdown {
  categoryId: string;
  categoryName: string;
  hindiName: string;
  estimatedQty: number;
  unit: string;
  baselineRatePerUnit: number;
  gradeAdjustmentMultiplier: number;
  effectiveRatePerUnit: number;
  minEstimatedValue: number;
  maxEstimatedValue: number;
  indicativeEstimatedValue: number;
  pricingSource: string;
  isDemonstrationData: boolean;
  effectiveDate: string;
  lastUpdated: string;
}

export interface ValuationSummary {
  items: PriceEstimateBreakdown[];
  totalEstimatedWeightKg: number;
  totalEstimatedValue: number;
  currency: 'INR';
  formulaExplanation: string;
  disclaimer: string;
}

export class PricingService {
  /**
   * Calculates transparent, itemized indicative scrap price estimate.
   */
  static async calculateEstimate(
    items: Array<{ categoryId: string; estimatedQty: number; grade?: string }>
  ): Promise<ValuationSummary> {
    const itemBreakdowns: PriceEstimateBreakdown[] = [];
    let grandTotal = 0;
    let grandWeightKg = 0;

    for (const item of items) {
      const category = await prisma.materialCategory.findUnique({
        where: { id: item.categoryId },
        include: {
          prices: {
            orderBy: { lastUpdated: 'desc' },
            take: 1,
          },
          recyclerOffers: {
            where: { isActive: true },
            orderBy: { buyingPricePerKg: 'desc' },
            take: 1,
          },
        },
      });

      if (!category) continue;

      const priceRecord = category.prices[0];
      const baselineRate = priceRecord ? priceRecord.indicativePrice : 10.0;
      const minRate = priceRecord ? priceRecord.minPrice : 8.0;
      const maxRate = priceRecord ? priceRecord.maxPrice : 12.0;

      // Documented grade adjustment multiplier
      let gradeMultiplier = 1.0;
      if (item.grade) {
        const g = item.grade.toLowerCase();
        if (g.includes('clean') || g.includes('pure') || g.includes('sorted')) {
          gradeMultiplier = 1.08; // +8% incentive for segregated clean material
        } else if (g.includes('mixed') || g.includes('unsegregated')) {
          gradeMultiplier = 0.90; // -10% deduction for mixed scrap needing sorting
        }
      }

      const effectiveRate = Math.round(baselineRate * gradeMultiplier * 100) / 100;
      const indicativeVal = Math.round(item.estimatedQty * effectiveRate * 100) / 100;
      const minVal = Math.round(item.estimatedQty * (minRate * gradeMultiplier) * 100) / 100;
      const maxVal = Math.round(item.estimatedQty * (maxRate * gradeMultiplier) * 100) / 100;

      itemBreakdowns.push({
        categoryId: category.id,
        categoryName: category.name,
        hindiName: category.hindiName,
        estimatedQty: item.estimatedQty,
        unit: category.defaultUnit,
        baselineRatePerUnit: baselineRate,
        gradeAdjustmentMultiplier: gradeMultiplier,
        effectiveRatePerUnit: effectiveRate,
        minEstimatedValue: minVal,
        maxEstimatedValue: maxVal,
        indicativeEstimatedValue: indicativeVal,
        pricingSource: priceRecord ? priceRecord.source : 'Demonstration Regional Index',
        isDemonstrationData: priceRecord ? priceRecord.isDemo : true,
        effectiveDate: priceRecord ? priceRecord.effectiveDate.toISOString().split('T')[0] : '2026-10-01',
        lastUpdated: priceRecord ? priceRecord.lastUpdated.toISOString() : new Date().toISOString(),
      });

      grandTotal += indicativeVal;
      grandWeightKg += item.estimatedQty;
    }

    return {
      items: itemBreakdowns,
      totalEstimatedWeightKg: Math.round(grandWeightKg * 100) / 100,
      totalEstimatedValue: Math.round(grandTotal * 100) / 100,
      currency: 'INR',
      formulaExplanation:
        'Indicative Value = Estimated Quantity × Baseline Regional Mandi Benchmark Rate × Grade Adjustment Multiplier (1.08 for clean sorted scrap, 0.90 for mixed scrap).',
      disclaimer:
        'Rates shown are indicative demonstration benchmarks based on regional wholesale scrap indices. Final price is agreed mutually between requester and collector upon physical verification and digital weighing on-site.',
    };
  }
}
