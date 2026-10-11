import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { PricingService } from '../services/pricingService.js';

export async function getCategoriesAndPrices(req: Request, res: Response): Promise<void> {
  try {
    const categories = await prisma.materialCategory.findMany({
      include: {
        prices: {
          orderBy: { lastUpdated: 'desc' },
        },
        recyclerOffers: {
          where: { isActive: true },
          take: 3,
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      categories,
      meta: {
        totalCategories: categories.length,
        demonstrationNotice:
          'Prices displayed are indicative benchmarks representing regional mandi market surveys. Actual transaction prices are established upon physical weighing.',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving categories and prices.' });
  }
}

export async function estimatePrice(req: Request, res: Response): Promise<void> {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Items array with categoryId and estimatedQty is required.',
      });
      return;
    }

    const valuation = await PricingService.calculateEstimate(items);
    res.json({ success: true, valuation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error calculating price estimate.' });
  }
}
