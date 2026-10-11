import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { calculateDistanceKm, fuzzCoordinates } from '../utils/geoUtils.js';
import { RouteService, RouteStop } from '../services/routeService.js';
import { ReceiptService } from '../services/receiptService.js';
import { logAuditEvent } from '../utils/auditLogger.js';

export async function getNearbyOpenPickups(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== 'COLLECTOR') {
      res.status(403).json({ success: false, message: 'Only collectors can access nearby jobs.' });
      return;
    }

    // Collector's current location from default address or query params
    const latParam = req.query.lat ? Number(req.query.lat) : undefined;
    const lngParam = req.query.lng ? Number(req.query.lng) : undefined;

    const collector = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: true,
        addresses: { where: { isDefault: true }, take: 1 },
      },
    });

    const collectorLat = latParam || collector?.addresses[0]?.lat || 26.8501;
    const collectorLng = lngParam || collector?.addresses[0]?.lng || 75.8155;
    const maxRadiusKm = collector?.profile?.serviceAreaRadiusKm || 10.0;

    // Fetch all open requests
    const openPickups = await prisma.pickupRequest.findMany({
      where: { status: 'OPEN' },
      include: {
        items: { include: { category: true } },
        address: true,
        requester: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const nearby = openPickups
      .map((p) => {
        const distance = calculateDistanceKm(collectorLat, collectorLng, p.address.lat, p.address.lng);
        const { fuzzyLat, fuzzyLng } = fuzzCoordinates(p.address.lat, p.address.lng, p.id);

        return {
          id: p.id,
          distanceKm: distance,
          preferredDate: p.preferredDate,
          preferredTimeSlot: p.preferredTimeSlot,
          notes: p.notes,
          estimatedTotalWeightKg: p.estimatedTotalWeightKg,
          estimatedTotalValue: p.estimatedTotalValue,
          createdAt: p.createdAt,
          items: p.items.map((i) => ({
            categoryName: i.category.name,
            hindiName: i.category.hindiName,
            estimatedQty: i.estimatedQty,
            unit: i.unit,
            gradeNotes: i.gradeNotes,
          })),
          area: p.address.area || p.address.city,
          city: p.address.city,
          fuzzyLat,
          fuzzyLng,
          requesterName: p.requester.name.split(' ')[0] + ' (Verified User)',
        };
      })
      .filter((p) => p.distanceKm <= maxRadiusKm * 1.5)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json({
      success: true,
      count: nearby.length,
      collectorLocation: { lat: collectorLat, lng: collectorLng },
      pickups: nearby,
    });
  } catch (error) {
    console.error('Error getting nearby pickups:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving nearby pickups.' });
  }
}

export async function acceptPickup(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== 'COLLECTOR') {
      res.status(403).json({ success: false, message: 'Only collectors can accept pickups.' });
      return;
    }

    const { id } = req.params;

    // ATOMIC TRANSACTION: Verify status is still OPEN to prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      const pickup = await tx.pickupRequest.findUnique({
        where: { id },
        include: { address: true, requester: true },
      });

      if (!pickup) {
        throw new Error('NOT_FOUND');
      }

      if (pickup.status !== 'OPEN' || pickup.assignedCollectorId) {
        throw new Error('ALREADY_ASSIGNED');
      }

      // Compute distance for assignment record
      const collectorAddr = await tx.address.findFirst({
        where: { userId: req.user!.id, isDefault: true },
      });
      const distance = collectorAddr
        ? calculateDistanceKm(collectorAddr.lat, collectorAddr.lng, pickup.address.lat, pickup.address.lng)
        : 2.0;

      // Update pickup
      const updatedPickup = await tx.pickupRequest.update({
        where: { id },
        data: {
          status: 'ACCEPTED',
          assignedCollectorId: req.user!.id,
        },
      });

      // Create assignment
      await tx.collectorAssignment.create({
        data: {
          pickupRequestId: id,
          collectorId: req.user!.id,
          status: 'ACCEPTED',
          distanceKm: distance,
          matchScore: 95.0,
          matchExplanation: `Accepted via collector terminal at ${distance} km range`,
          acceptedAt: new Date(),
        },
      });

      // Create status history
      await tx.pickupStatusHistory.create({
        data: {
          pickupRequestId: id,
          fromStatus: 'OPEN',
          toStatus: 'ACCEPTED',
          changedById: req.user!.id,
          changeReason: `Accepted by collector ${req.user!.name}`,
        },
      });

      // Notify requester
      await tx.notification.create({
        data: {
          userId: pickup.requesterId,
          title: 'पिकअप स्वीकार कर लिया गया (Pickup Accepted)',
          message: `${req.user!.name} ने आपका कबाड़ पिकअप स्वीकार कर लिया है। वे समय पर पहुंचेंगे।`,
          type: 'PICKUP_UPDATE',
          link: `/track/${id}`,
        },
      });

      return updatedPickup;
    });

    await logAuditEvent({
      userId: req.user.id,
      action: 'ACCEPT_PICKUP',
      resource: 'PickupRequest',
      resourceId: id,
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: 'Pickup accepted successfully. Address details now unlocked.',
      pickup: result,
    });
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') {
      res.status(404).json({ success: false, message: 'Pickup request not found.' });
      return;
    }
    if (error.message === 'ALREADY_ASSIGNED') {
      res.status(409).json({
        success: false,
        message: 'This request was just accepted by another collector or is no longer open.',
      });
      return;
    }
    console.error('Error accepting pickup:', error);
    res.status(500).json({ success: false, message: 'Server error accepting pickup.' });
  }
}

export async function updatePickupStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== 'COLLECTOR') {
      res.status(403).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const { id } = req.params;
    const { status, reason } = req.body;

    if (!['IN_PROGRESS', 'ACCEPTED'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status update for this endpoint.' });
      return;
    }

    const pickup = await prisma.pickupRequest.findUnique({ where: { id } });
    if (!pickup) {
      res.status(404).json({ success: false, message: 'Pickup not found.' });
      return;
    }

    if (pickup.assignedCollectorId !== req.user.id) {
      res.status(403).json({ success: false, message: 'You are not assigned to this pickup.' });
      return;
    }

    const updated = await prisma.$transaction([
      prisma.pickupRequest.update({
        where: { id },
        data: { status },
      }),
      prisma.pickupStatusHistory.create({
        data: {
          pickupRequestId: id,
          fromStatus: pickup.status,
          toStatus: status,
          changedById: req.user.id,
          changeReason: reason || `Status updated to ${status}`,
        },
      }),
    ]);

    res.json({ success: true, message: `Status updated to ${status}`, pickup: updated[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating pickup status.' });
  }
}

const recordActualsSchema = z.object({
  paymentMode: z.enum(['CASH', 'UPI', 'BANK_TRANSFER']).default('CASH'),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      categoryId: z.string().min(1),
      actualQty: z.number().positive(),
      agreedPricePerUnit: z.number().nonnegative(),
      gradeRecorded: z.string().optional(),
    })
  ).min(1, 'At least one weighed item required'),
});

export async function recordActualsAndComplete(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== 'COLLECTOR') {
      res.status(403).json({ success: false, message: 'Only assigned collectors can record transactions.' });
      return;
    }

    const { id } = req.params;
    const parseResult = recordActualsSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: parseResult.error.errors.map((e) => e.message).join(', '),
      });
      return;
    }

    const { paymentMode, notes, items } = parseResult.data;

    const pickup = await prisma.pickupRequest.findUnique({
      where: { id },
      include: { requester: true },
    });

    if (!pickup) {
      res.status(404).json({ success: false, message: 'Pickup not found.' });
      return;
    }

    if (pickup.assignedCollectorId !== req.user.id) {
      res.status(403).json({ success: false, message: 'You are not the assigned collector for this pickup.' });
      return;
    }

    if (pickup.status === 'COMPLETED') {
      res.status(400).json({ success: false, message: 'This pickup has already been completed and settled.' });
      return;
    }

    // Calculate totals
    let grandAmount = 0;
    let grandWeightKg = 0;
    const itemRecords = items.map((i) => {
      const itemTotal = Math.round(i.actualQty * i.agreedPricePerUnit * 100) / 100;
      grandAmount += itemTotal;
      grandWeightKg += i.actualQty;
      return {
        pickupRequestId: id,
        categoryId: i.categoryId,
        actualQty: i.actualQty,
        agreedPricePerUnit: i.agreedPricePerUnit,
        itemTotal,
        gradeRecorded: i.gradeRecorded || 'Standard inspected',
      };
    });

    const receiptNumber = ReceiptService.generateReceiptNumber('JP');
    const timestampStr = new Date().toISOString();
    const receiptHash = ReceiptService.generateReceiptHash({
      receiptNumber,
      pickupId: id,
      collectorId: req.user.id,
      requesterId: pickup.requesterId,
      totalAmount: grandAmount,
      totalWeightKg: grandWeightKg,
      timestamp: timestampStr,
    });

    // Execute atomic completion transaction
    const [updatedPickup, createdTxn] = await prisma.$transaction([
      // 1. Update pickup status
      prisma.pickupRequest.update({
        where: { id },
        data: {
          status: 'COMPLETED',
        },
      }),
      // 2. Create Transaction and Digital Receipt
      prisma.transaction.create({
        data: {
          pickupRequestId: id,
          collectorId: req.user.id,
          requesterId: pickup.requesterId,
          totalWeightKg: Math.round(grandWeightKg * 10) / 10,
          totalAmount: Math.round(grandAmount * 100) / 100,
          paymentMode,
          paymentStatus: 'PAID',
          receiptNumber,
          receiptHash,
          notes: notes || 'Verified mutually with calibrated scale',
        },
      }),
      // 3. Insert Actual Collected Items
      prisma.actualCollectedItem.createMany({
        data: itemRecords,
      }),
      // 4. Update status history
      prisma.pickupStatusHistory.create({
        data: {
          pickupRequestId: id,
          fromStatus: pickup.status,
          toStatus: 'COMPLETED',
          changedById: req.user.id,
          changeReason: `Weighed ${grandWeightKg}kg. Paid ₹${grandAmount} via ${paymentMode}`,
        },
      }),
      // 5. Increment collector completed pickups count
      prisma.userProfile.updateMany({
        where: { userId: req.user.id },
        data: {
          totalPickupsCompleted: { increment: 1 },
        },
      }),
      // 6. Notify Requester
      prisma.notification.create({
        data: {
          userId: pickup.requesterId,
          title: `डिजिटल रसीद जारी (Digital Receipt: ${receiptNumber})`,
          message: `आपका पिकअप पूरा हुआ! कुल वजन: ${grandWeightKg}kg, भुगतान राशि: ₹${grandAmount}.`,
          type: 'PAYMENT',
          link: `/receipts/${receiptNumber}`,
        },
      }),
    ]);

    await logAuditEvent({
      userId: req.user.id,
      action: 'COMPLETE_TRANSACTION',
      resource: 'Transaction',
      resourceId: createdTxn.id,
      details: { receiptNumber, totalAmount: grandAmount, totalWeightKg: grandWeightKg },
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Transaction settled and digital receipt generated successfully.',
      pickup: updatedPickup,
      transaction: createdTxn,
      receiptNumber,
      receiptHash,
    });
  } catch (error) {
    console.error('Error completing transaction:', error);
    res.status(500).json({ success: false, message: 'Server error completing pickup.' });
  }
}

export async function getCollectorEarnings(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== 'COLLECTOR') {
      res.status(403).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const transactions = await prisma.transaction.findMany({
      where: { collectorId: req.user.id },
      include: {
        pickupRequest: {
          include: {
            actualCollected: { include: { category: true } },
          },
        },
      },
      orderBy: { transactionDate: 'desc' },
    });

    let totalPayoutsInr = 0;
    let totalCollectedKg = 0;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let todayPayouts = 0;
    let weekPayouts = 0;
    let monthPayouts = 0;

    for (const t of transactions) {
      totalPayoutsInr += t.totalAmount;
      totalCollectedKg += t.totalWeightKg;

      const tDate = new Date(t.transactionDate);
      if (tDate >= startOfToday) todayPayouts += t.totalAmount;
      if (tDate >= startOfWeek) weekPayouts += t.totalAmount;
      if (tDate >= startOfMonth) monthPayouts += t.totalAmount;
    }

    res.json({
      success: true,
      summary: {
        totalPayoutsInr: Math.round(totalPayoutsInr * 100) / 100,
        totalCollectedKg: Math.round(totalCollectedKg * 10) / 10,
        totalTransactionsCount: transactions.length,
        todayPayouts: Math.round(todayPayouts * 100) / 100,
        weekPayouts: Math.round(weekPayouts * 100) / 100,
        monthPayouts: Math.round(monthPayouts * 100) / 100,
      },
      recentTransactions: transactions.slice(0, 15),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving collector earnings.' });
  }
}

export async function getCollectorRoutePlan(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== 'COLLECTOR') {
      res.status(403).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const collectorAddr = await prisma.address.findFirst({
      where: { userId: req.user.id, isDefault: true },
    });
    const currentLat = collectorAddr ? collectorAddr.lat : 26.8501;
    const currentLng = collectorAddr ? collectorAddr.lng : 75.8155;

    // Fetch active pickups assigned to collector
    const activePickups = await prisma.pickupRequest.findMany({
      where: {
        assignedCollectorId: req.user.id,
        status: { in: ['ACCEPTED', 'IN_PROGRESS'] },
      },
      include: {
        address: true,
        requester: { select: { name: true, phone: true } },
      },
    });

    const stops: RouteStop[] = activePickups.map((p) => ({
      pickupId: p.id,
      requesterName: p.requester.name,
      addressLabel: p.address.label,
      streetAddress: p.address.streetAddress,
      lat: p.address.lat,
      lng: p.address.lng,
      preferredTimeSlot: p.preferredTimeSlot,
      estimatedWeightKg: p.estimatedTotalWeightKg,
      estimatedValue: p.estimatedTotalValue,
    }));

    const optimizedRoute = RouteService.optimizeStops(currentLat, currentLng, stops);

    res.json({
      success: true,
      currentLocation: { lat: currentLat, lng: currentLng },
      route: optimizedRoute,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error computing route plan.' });
  }
}
