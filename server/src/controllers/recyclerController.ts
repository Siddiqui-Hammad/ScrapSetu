import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import crypto from 'crypto';
import { logAuditEvent } from '../utils/auditLogger.js';

export async function getRecyclerOffers(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { categoryId, activeOnly = 'true' } = req.query;

    const whereClause: any = {};
    if (activeOnly === 'true') whereClause.isActive = true;
    if (categoryId) whereClause.categoryId = String(categoryId);

    const offers = await prisma.recyclerOffer.findMany({
      where: whereClause,
      include: {
        category: true,
        recycler: {
          select: {
            id: true,
            name: true,
            isVerified: true,
            profile: true,
          },
        },
      },
      orderBy: { buyingPricePerKg: 'desc' },
    });

    res.json({ success: true, count: offers.length, offers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching recycler offers.' });
  }
}

const createOfferSchema = z.object({
  categoryId: z.string().min(1),
  facilityName: z.string().min(2),
  facilityAddress: z.string().min(5),
  lat: z.number().optional().default(26.8450),
  lng: z.number().optional().default(75.7600),
  buyingPricePerKg: z.number().positive('Price must be greater than 0'),
  minQuantityKg: z.number().positive().default(25.0),
  gradeAccepted: z.string().optional().default('Clean segregated'),
  notes: z.string().optional(),
});

export async function createRecyclerOffer(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== 'RECYCLER') {
      res.status(403).json({ success: false, message: 'Only registered recycling companies can publish buying offers.' });
      return;
    }

    const parseResult = createOfferSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: parseResult.error.errors.map((e) => e.message).join(', '),
      });
      return;
    }

    const newOffer = await prisma.recyclerOffer.create({
      data: {
        recyclerId: req.user.id,
        ...parseResult.data,
      },
      include: { category: true },
    });

    await logAuditEvent({
      userId: req.user.id,
      action: 'CREATE_RECYCLER_OFFER',
      resource: 'RecyclerOffer',
      resourceId: newOffer.id,
      details: { buyingPrice: newOffer.buyingPricePerKg, category: newOffer.category.name },
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, message: 'Recycler offer published successfully.', offer: newOffer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error publishing recycler offer.' });
  }
}

const createIntakeSlipSchema = z.object({
  supplierName: z.string().min(2),
  materialGrade: z.string().min(2),
  netWeightKg: z.number().positive(),
  purchaseRatePerKg: z.number().positive(),
  offerId: z.string().optional(),
  transactionId: z.string().optional(),
});

export async function createIntakeSlip(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== 'RECYCLER') {
      res.status(403).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const parseResult = createIntakeSlipSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: parseResult.error.errors.map((e) => e.message).join(', '),
      });
      return;
    }

    const { supplierName, materialGrade, netWeightKg, purchaseRatePerKg, offerId, transactionId } =
      parseResult.data;

    const totalPurchaseAmount = Math.round(netWeightKg * purchaseRatePerKg * 100) / 100;
    const intakeSlipNumber = `INTAKE-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const receiptHash = crypto
      .createHash('sha256')
      .update(`${intakeSlipNumber}|${req.user.id}|${netWeightKg}|${totalPurchaseAmount}|${Date.now()}`)
      .digest('hex');

    const intakeRecord = await prisma.recyclerIntake.create({
      data: {
        recyclerId: req.user.id,
        supplierName,
        materialGrade,
        netWeightKg,
        purchaseRatePerKg,
        totalPurchaseAmount,
        offerId: offerId || null,
        transactionId: transactionId || null,
        intakeSlipNumber,
        receiptHash,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Intake weight slip recorded successfully.',
      intake: intakeRecord,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error recording intake slip.' });
  }
}

export async function getRecyclerDashboardMetrics(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== 'RECYCLER') {
      res.status(403).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const intakes = await prisma.recyclerIntake.findMany({
      where: { recyclerId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    const activeOffers = await prisma.recyclerOffer.findMany({
      where: { recyclerId: req.user.id, isActive: true },
      include: { category: true },
    });

    let totalTonnageKg = 0;
    let totalSpendInr = 0;
    for (const item of intakes) {
      totalTonnageKg += item.netWeightKg;
      totalSpendInr += item.totalPurchaseAmount;
    }

    res.json({
      success: true,
      metrics: {
        totalIntakeKg: Math.round(totalTonnageKg * 10) / 10,
        totalSpendInr: Math.round(totalSpendInr * 100) / 100,
        intakesCount: intakes.length,
        activeOffersCount: activeOffers.length,
      },
      activeOffers,
      recentIntakes: intakes.slice(0, 15),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving recycler dashboard.' });
  }
}
