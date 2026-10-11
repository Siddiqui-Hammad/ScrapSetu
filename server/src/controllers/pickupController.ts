import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { PricingService } from '../services/pricingService.js';
import { MatchingService } from '../services/matchingService.js';
import { fuzzCoordinates } from '../utils/geoUtils.js';
import { VALID_STATUS_TRANSITIONS, PickupStatus } from '../config/env.js';
import { logAuditEvent } from '../utils/auditLogger.js';

const createPickupSchema = z.object({
  addressId: z.string().min(1, 'Address is required'),
  preferredDate: z.string().min(1, 'Preferred date is required'),
  preferredTimeSlot: z.string().min(1, 'Time slot is required'),
  notes: z.string().optional(),
  isRecurring: z.boolean().optional().default(false),
  recurringFrequency: z.enum(['WEEKLY', 'BIWEEKLY', 'MONTHLY']).optional(),
  items: z.array(
    z.object({
      categoryId: z.string().min(1),
      estimatedQty: z.number().positive('Quantity must be greater than 0'),
      unit: z.string().default('kg'),
      photoUrl: z.string().optional(),
      aiPredictedCategory: z.string().optional(),
      aiConfidence: z.number().optional(),
      gradeNotes: z.string().optional(),
    })
  ).min(1, 'At least one material item is required'),
});

export async function createPickup(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const parseResult = createPickupSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: parseResult.error.errors.map((e) => e.message).join(', '),
      });
      return;
    }

    const {
      addressId,
      preferredDate,
      preferredTimeSlot,
      notes,
      isRecurring,
      recurringFrequency,
      items,
    } = parseResult.data;

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: req.user.id },
    });

    if (!address) {
      res.status(404).json({ success: false, message: 'Specified pickup address not found.' });
      return;
    }

    // Calculate transparent indicative valuation
    const valuation = await PricingService.calculateEstimate(
      items.map((i) => ({ categoryId: i.categoryId, estimatedQty: i.estimatedQty }))
    );

    // Create pickup in DB inside transaction
    const newPickup = await prisma.pickupRequest.create({
      data: {
        requesterId: req.user.id,
        addressId: address.id,
        preferredDate,
        preferredTimeSlot,
        notes: notes || null,
        isRecurring,
        recurringFrequency: isRecurring ? recurringFrequency : null,
        status: 'OPEN',
        estimatedTotalWeightKg: valuation.totalEstimatedWeightKg,
        estimatedTotalValue: valuation.totalEstimatedValue,
        items: {
          create: items.map((item) => ({
            categoryId: item.categoryId,
            estimatedQty: item.estimatedQty,
            unit: item.unit,
            photoUrl: item.photoUrl || null,
            aiPredictedCategory: item.aiPredictedCategory || null,
            aiConfidence: item.aiConfidence || null,
            userConfirmedCategory: true,
            gradeNotes: item.gradeNotes || null,
          })),
        },
        statusHistory: {
          create: {
            fromStatus: 'INITIAL',
            toStatus: 'OPEN',
            changedById: req.user.id,
            changeReason: 'Created pickup request',
          },
        },
      },
      include: {
        items: {
          include: { category: true },
        },
        address: true,
      },
    });

    // Match prospective collectors to notify
    const categorySlugs = newPickup.items.map((i) => i.category.slug);
    const matchedCollectors = await MatchingService.findEligibleCollectors(
      address.lat,
      address.lng,
      categorySlugs,
      valuation.totalEstimatedWeightKg
    );

    // Create initial notification for top eligible collectors
    for (const match of matchedCollectors.slice(0, 3)) {
      await prisma.notification.create({
        data: {
          userId: match.collectorId,
          title: 'नया स्क्रैप पिकअप उपलब्ध (New Pickup Available)',
          message: `${address.area || address.city} में ${valuation.totalEstimatedWeightKg}kg कबाड़ का नया अनुरोध। दूरी: ${match.distanceKm}km.`,
          type: 'ALERT',
          link: `/collector/requests`,
        },
      });
    }

    await logAuditEvent({
      userId: req.user.id,
      action: 'CREATE_PICKUP',
      resource: 'PickupRequest',
      resourceId: newPickup.id,
      details: {
        totalWeightKg: valuation.totalEstimatedWeightKg,
        estimatedValue: valuation.totalEstimatedValue,
        itemCount: items.length,
      },
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Pickup request created successfully.',
      pickup: newPickup,
      valuation,
      matchedCollectorsCount: matchedCollectors.length,
    });
  } catch (error) {
    console.error('Error creating pickup:', error);
    res.status(500).json({ success: false, message: 'Server error creating pickup request.' });
  }
}

export async function listPickups(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { status, limit = 50 } = req.query;
    const isCollector = req.user.role === 'COLLECTOR';
    const isAdmin = req.user.role === 'ADMIN';

    let whereClause: any = {};

    if (!isAdmin && !isCollector) {
      // Requesters only see their own pickups
      whereClause.requesterId = req.user.id;
    } else if (isCollector) {
      // Collectors can see pickups assigned to them OR open pickups
      if (status === 'OPEN') {
        whereClause.status = 'OPEN';
      } else {
        whereClause.OR = [
          { assignedCollectorId: req.user.id },
          { status: 'OPEN' },
        ];
      }
    }

    if (status && !isCollector) {
      whereClause.status = String(status);
    }

    const pickups = await prisma.pickupRequest.findMany({
      where: whereClause,
      include: {
        items: { include: { category: true } },
        address: true,
        requester: { select: { id: true, name: true, phone: true } },
        assignments: {
          include: {
            collector: { select: { id: true, name: true, phone: true } },
          },
        },
        transaction: true,
      },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
    });

    // Privacy protection transform: If open and viewer is NOT requester/admin, fuzz location
    const sanitizedPickups = pickups.map((p) => {
      const isOwner = p.requesterId === req.user?.id;
      const isAssigned = p.assignedCollectorId === req.user?.id;

      if (!isOwner && !isAssigned && !isAdmin) {
        const { fuzzyLat, fuzzyLng } = fuzzCoordinates(p.address.lat, p.address.lng, p.id);
        return {
          ...p,
          address: {
            id: p.address.id,
            label: p.address.label,
            area: p.address.area,
            city: p.address.city,
            pincode: p.address.pincode,
            lat: fuzzyLat,
            lng: fuzzyLng,
            isFuzzedForPrivacy: true,
            streetAddress: 'Revealed upon acceptance',
          },
          requester: {
            id: p.requester.id,
            name: p.requester.name.split(' ')[0] + ' (Verified User)',
            phone: 'Hidden for privacy',
          },
        };
      }

      return p;
    });

    res.json({ success: true, count: sanitizedPickups.length, pickups: sanitizedPickups });
  } catch (error) {
    console.error('Error listing pickups:', error);
    res.status(500).json({ success: false, message: 'Server error listing pickups.' });
  }
}

export async function getPickupById(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const pickup = await prisma.pickupRequest.findUnique({
      where: { id },
      include: {
        items: { include: { category: true } },
        address: true,
        requester: { select: { id: true, name: true, phone: true, email: true } },
        assignments: {
          include: {
            collector: {
              select: {
                id: true,
                name: true,
                phone: true,
                profile: true,
              },
            },
          },
        },
        statusHistory: { orderBy: { timestamp: 'asc' } },
        actualCollected: { include: { category: true } },
        transaction: true,
        ratings: true,
      },
    });

    if (!pickup) {
      res.status(404).json({ success: false, message: 'Pickup request not found.' });
      return;
    }

    const isOwner = pickup.requesterId === req.user.id;
    const isAssignedCollector = pickup.assignedCollectorId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    // Privacy mask if viewer is not authorized for exact details
    if (!isOwner && !isAssignedCollector && !isAdmin) {
      const { fuzzyLat, fuzzyLng } = fuzzCoordinates(pickup.address.lat, pickup.address.lng, pickup.id);
      res.json({
        success: true,
        pickup: {
          ...pickup,
          address: {
            ...pickup.address,
            streetAddress: 'Revealed to accepted collector only',
            lat: fuzzyLat,
            lng: fuzzyLng,
            isFuzzedForPrivacy: true,
          },
          requester: {
            id: pickup.requester.id,
            name: pickup.requester.name.split(' ')[0] + ' (User)',
            phone: 'Hidden until acceptance',
          },
        },
      });
      return;
    }

    res.json({ success: true, pickup });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving pickup details.' });
  }
}

export async function cancelPickup(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { reason } = req.body;

    const pickup = await prisma.pickupRequest.findUnique({ where: { id } });
    if (!pickup) {
      res.status(404).json({ success: false, message: 'Pickup request not found.' });
      return;
    }

    const isOwner = pickup.requesterId === req.user.id;
    const isCollector = pickup.assignedCollectorId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isCollector && !isAdmin) {
      res.status(403).json({ success: false, message: 'Not authorized to cancel this request.' });
      return;
    }

    if (pickup.status === 'COMPLETED') {
      res.status(400).json({ success: false, message: 'Completed pickups cannot be cancelled.' });
      return;
    }

    const updated = await prisma.$transaction([
      prisma.pickupRequest.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          cancelledReason: reason || 'Cancelled by user',
        },
      }),
      prisma.pickupStatusHistory.create({
        data: {
          pickupRequestId: id,
          fromStatus: pickup.status,
          toStatus: 'CANCELLED',
          changedById: req.user.id,
          changeReason: reason || 'Cancelled by user',
        },
      }),
    ]);

    await logAuditEvent({
      userId: req.user.id,
      action: 'CANCEL_PICKUP',
      resource: 'PickupRequest',
      resourceId: id,
      details: { reason },
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Pickup cancelled successfully.', pickup: updated[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error cancelling pickup.' });
  }
}

export async function disputePickup(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { subject, description } = req.body;

    if (!subject || !description) {
      res.status(400).json({ success: false, message: 'Subject and description are required.' });
      return;
    }

    const pickup = await prisma.pickupRequest.findUnique({ where: { id } });
    if (!pickup) {
      res.status(404).json({ success: false, message: 'Pickup not found.' });
      return;
    }

    const respondentId =
      pickup.requesterId === req.user.id
        ? pickup.assignedCollectorId
        : pickup.requesterId;

    await prisma.$transaction([
      prisma.pickupRequest.update({
        where: { id },
        data: {
          status: 'DISPUTED',
          disputeReason: description,
        },
      }),
      prisma.complaintDispute.create({
        data: {
          pickupRequestId: id,
          complainantId: req.user.id,
          respondentId: respondentId || null,
          subject,
          description,
          status: 'OPEN',
        },
      }),
      prisma.pickupStatusHistory.create({
        data: {
          pickupRequestId: id,
          fromStatus: pickup.status,
          toStatus: 'DISPUTED',
          changedById: req.user.id,
          changeReason: `Dispute raised: ${subject}`,
        },
      }),
    ]);

    res.json({ success: true, message: 'Dispute recorded. An administrator will review the case.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error filing dispute.' });
  }
}
