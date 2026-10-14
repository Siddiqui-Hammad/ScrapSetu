import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { SmartBuyerMatchingService } from '../services/smartBuyerMatchingService.js';
import { logAuditEvent } from '../utils/auditLogger.js';

const matchQuerySchema = z.object({
  categoryId: z.string().min(1, 'Category ID is required'),
  weightKg: z.coerce.number().positive('Weight must be positive'),
  grade: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  vehicleType: z.string().optional(),
  lotId: z.string().optional(),
});

export async function getBuyerMatches(req: AuthRequest, res: Response): Promise<void> {
  try {
    const validated = matchQuerySchema.parse(req.query);

    let lat = validated.lat;
    let lng = validated.lng;
    let vehicleType = validated.vehicleType;

    // If collector is authenticated, use their registered profile/location if not provided in query
    if (req.user) {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { addresses: { where: { isDefault: true }, take: 1 }, profile: true },
      });
      if (user) {
        if (!lat && user.addresses[0]) lat = user.addresses[0].lat;
        if (!lng && user.addresses[0]) lng = user.addresses[0].lng;
        if (!vehicleType && user.profile?.vehicleType) vehicleType = user.profile.vehicleType;
      }
    }

    // Default coordinates to Jaipur if none found
    lat = lat || 26.8501;
    lng = lng || 75.8155;
    vehicleType = vehicleType || 'THREE_WHEELER';

    const results = await SmartBuyerMatchingService.matchBuyers({
      categoryId: validated.categoryId,
      weightKg: validated.weightKg,
      grade: validated.grade,
      collectorLat: lat,
      collectorLng: lng,
      vehicleType,
      lotId: validated.lotId,
    });

    res.json({
      success: true,
      ...results,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Invalid query parameters', errors: err.errors });
      return;
    }
    console.error('Error getting buyer matches:', err);
    res.status(500).json({ success: false, message: err.message || 'Error matching buyers' });
  }
}

export async function selectBuyer(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || (req.user.role !== 'COLLECTOR' && req.user.role !== 'ADMIN')) {
      res.status(403).json({ success: false, message: 'Only collectors can select buyers for scrap lots.' });
      return;
    }

    const { lotId, offerId } = req.body;
    if (!lotId || !offerId) {
      res.status(400).json({ success: false, message: 'lotId and offerId are required.' });
      return;
    }

    const updatedLot = await SmartBuyerMatchingService.selectBuyerForLot(lotId, offerId, req.user.id);

    await logAuditEvent({
      userId: req.user.id,
      action: 'SELECT_BUYER',
      resource: 'ScrapLot',
      resourceId: lotId,
      details: { offerId, lotNumber: updatedLot.lotNumber },
    });

    res.json({
      success: true,
      message: 'Buyer selected successfully. Route directions and intake slip ready.',
      lot: updatedLot,
    });
  } catch (err: any) {
    console.error('Error selecting buyer:', err);
    res.status(500).json({ success: false, message: err.message || 'Error selecting buyer' });
  }
}

export async function getCollectorLots(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const lots = await prisma.scrapLot.findMany({
      where: req.user.role === 'ADMIN' ? {} : { collectorId: req.user.id },
      include: {
        category: true,
        buyer: { select: { id: true, name: true } },
        selectedOffer: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      count: lots.length,
      lots,
    });
  } catch (err: any) {
    console.error('Error getting collector lots:', err);
    res.status(500).json({ success: false, message: 'Error retrieving scrap lots' });
  }
}

export async function createScrapLot(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const schema = z.object({
      categoryId: z.string().min(1),
      declaredWeightKg: z.number().positive(),
      grade: z.string().optional(),
      pickupRequestId: z.string().optional(),
    });

    const parsed = schema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { addresses: { where: { isDefault: true }, take: 1 } },
    });

    const originCity = user?.addresses[0]?.city || 'Jaipur';
    const originState = user?.addresses[0]?.state || 'Rajasthan';
    const originPincode = user?.addresses[0]?.pincode || '302020';

    const { PassportService } = await import('../services/passportService.js');
    const lot = await PassportService.createPassport({
      collectorId: req.user.id,
      categoryId: parsed.categoryId,
      grade: parsed.grade,
      declaredWeightKg: parsed.declaredWeightKg,
      pickupRequestId: parsed.pickupRequestId,
      originCity,
      originState,
      originPincode,
      actorName: user?.name,
    });

    res.status(201).json({
      success: true,
      message: 'Scrap lot and Passport identity initialized.',
      lot,
    });
  } catch (err: any) {
    console.error('Error creating scrap lot:', err);
    res.status(500).json({ success: false, message: err.message || 'Error creating scrap lot' });
  }
}
