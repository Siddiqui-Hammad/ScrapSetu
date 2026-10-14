import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { PassportService } from '../services/passportService.js';
import { logAuditEvent } from '../utils/auditLogger.js';

export async function getPassport(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { identifier } = req.params;

    const passport = await PassportService.getPassport(
      identifier,
      req.user?.id,
      req.user?.role
    );

    res.json({
      success: true,
      passport,
    });
  } catch (err: any) {
    console.error('Error retrieving passport:', err);
    res.status(404).json({ success: false, message: err.message || 'Scrap passport not found.' });
  }
}

export async function createPassport(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || (req.user.role !== 'COLLECTOR' && req.user.role !== 'ADMIN')) {
      res.status(403).json({ success: false, message: 'Only collectors or administrators can issue Scrap Passports.' });
      return;
    }

    const schema = z.object({
      categoryId: z.string().min(1, 'Category ID is required'),
      declaredWeightKg: z.number().positive('Declared weight must be positive'),
      collectedWeightKg: z.number().optional(),
      grade: z.string().optional(),
      pickupRequestId: z.string().optional(),
      originCity: z.string().optional(),
      originState: z.string().optional(),
      originPincode: z.string().optional(),
    });

    const parsed = schema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { addresses: { where: { isDefault: true }, take: 1 } },
    });

    const lot = await PassportService.createPassport({
      collectorId: req.user.id,
      categoryId: parsed.categoryId,
      grade: parsed.grade,
      declaredWeightKg: parsed.declaredWeightKg,
      collectedWeightKg: parsed.collectedWeightKg,
      pickupRequestId: parsed.pickupRequestId,
      originCity: parsed.originCity || user?.addresses[0]?.city,
      originState: parsed.originState || user?.addresses[0]?.state,
      originPincode: parsed.originPincode || user?.addresses[0]?.pincode,
      actorName: user?.name,
    });

    await logAuditEvent({
      userId: req.user.id,
      action: 'CREATE_PASSPORT',
      resource: 'ScrapLot',
      resourceId: lot.id,
      details: { lotNumber: lot.lotNumber, weightKg: lot.declaredWeightKg },
    });

    res.status(201).json({
      success: true,
      message: 'Scrap Passport successfully created.',
      lot,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation failed', errors: err.errors });
      return;
    }
    console.error('Error creating passport:', err);
    res.status(500).json({ success: false, message: err.message || 'Error creating passport' });
  }
}

export async function confirmHandover(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || (req.user.role !== 'COLLECTOR' && req.user.role !== 'ADMIN')) {
      res.status(403).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id: lotId } = req.params;
    const { notes } = req.body;

    const updated = await PassportService.confirmHandover(lotId, req.user.id, notes);

    res.json({
      success: true,
      message: 'Handover confirmed. Scrap lot in transit to facility.',
      lot: updated,
    });
  } catch (err: any) {
    console.error('Error confirming handover:', err);
    res.status(400).json({ success: false, message: err.message || 'Error confirming handover' });
  }
}

export async function confirmReceipt(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || (req.user.role !== 'RECYCLER' && req.user.role !== 'ADMIN')) {
      res.status(403).json({ success: false, message: 'Only recyclers can confirm intake weighbridge receipt.' });
      return;
    }

    const { id: lotId } = req.params;
    const schema = z.object({
      receivedWeightKg: z.number().positive('Received weighbridge weight must be positive'),
      weighbridgeSlipNumber: z.string().optional(),
      notes: z.string().optional(),
    });

    const parsed = schema.parse(req.body);

    const updated = await PassportService.confirmReceipt(lotId, req.user.id, parsed);

    res.json({
      success: true,
      message: updated.hasDiscrepancy
        ? `Weighbridge receipt confirmed. NOTICE: Discrepancy of ${updated.weightDiscrepancyKg} kg detected.`
        : 'Weighbridge receipt confirmed within certified tolerance.',
      lot: updated,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation failed', errors: err.errors });
      return;
    }
    console.error('Error confirming receipt:', err);
    res.status(400).json({ success: false, message: err.message || 'Error confirming receipt' });
  }
}

export async function confirmProcessing(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || (req.user.role !== 'RECYCLER' && req.user.role !== 'ADMIN')) {
      res.status(403).json({ success: false, message: 'Only recyclers can confirm material transformation.' });
      return;
    }

    const { id: lotId } = req.params;
    const schema = z.object({
      processingMethod: z.string().min(2, 'Processing method required (e.g. SHREDDED_WASHED, RPET_PELLETIZED)'),
      processingBatchNumber: z.string().min(2, 'Batch number is required'),
      cpcbComplianceRef: z.string().optional(),
      processingEvidenceUrl: z.string().optional(),
      processingNotes: z.string().optional(),
    });

    const parsed = schema.parse(req.body);

    const updated = await PassportService.confirmProcessing(lotId, req.user.id, parsed);

    res.json({
      success: true,
      message: 'Material recycling and transformation confirmed under CPCB circular guidelines.',
      lot: updated,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation failed', errors: err.errors });
      return;
    }
    console.error('Error confirming processing:', err);
    res.status(400).json({ success: false, message: err.message || 'Error confirming processing' });
  }
}

export async function disputeDiscrepancy(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { id: lotId } = req.params;
    const { disputeReason } = req.body;

    if (!disputeReason) {
      res.status(400).json({ success: false, message: 'disputeReason is required' });
      return;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const lot = await tx.scrapLot.update({
        where: { id: lotId },
        data: {
          isDisputed: true,
          disputeReason,
        },
      });

      await tx.scrapLotEvent.create({
        data: {
          scrapLotId: lotId,
          stage: lot.status,
          actorRole: req.user!.role,
          actorName: req.user!.email,
          actorId: req.user!.id,
          location: 'Dispute Arbitration Queue',
          evidenceType: 'INDEPENDENTLY_VERIFIED',
          details: JSON.stringify({
            message: 'Weight or condition dispute opened for investigation.',
            reason: disputeReason,
            flaggedBy: req.user!.role,
          }),
          eventHash: `dispute-${Date.now()}`,
        },
      });

      return lot;
    });

    res.json({
      success: true,
      message: 'Dispute opened. Regulatory administrator notified.',
      lot: updated,
    });
  } catch (err: any) {
    console.error('Error opening dispute:', err);
    res.status(500).json({ success: false, message: err.message || 'Error opening dispute' });
  }
}
