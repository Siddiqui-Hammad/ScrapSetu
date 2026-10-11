import { Response } from 'express';
import prisma from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { logAuditEvent } from '../utils/auditLogger.js';

export async function getAdminPlatformOverview(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden: Admin access required.' });
      return;
    }

    const [
      usersCount,
      collectorsCount,
      recyclersCount,
      totalPickupsCount,
      completedPickupsCount,
      cancelledPickupsCount,
      disputedPickupsCount,
      totalTransactions,
      recentAuditLogs,
      openDisputes,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'COLLECTOR' } }),
      prisma.user.count({ where: { role: 'RECYCLER' } }),
      prisma.pickupRequest.count(),
      prisma.pickupRequest.count({ where: { status: 'COMPLETED' } }),
      prisma.pickupRequest.count({ where: { status: 'CANCELLED' } }),
      prisma.pickupRequest.count({ where: { status: 'DISPUTED' } }),
      prisma.transaction.aggregate({
        _sum: { totalAmount: true, totalWeightKg: true },
        _count: true,
      }),
      prisma.auditLog.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, role: true } } },
      }),
      prisma.complaintDispute.findMany({
        where: { status: 'OPEN' },
        include: {
          complainant: { select: { name: true, role: true } },
          pickupRequest: true,
        },
      }),
    ]);

    const completionRate =
      totalPickupsCount > 0
        ? Math.round((completedPickupsCount / totalPickupsCount) * 1000) / 10
        : 0;

    res.json({
      success: true,
      stats: {
        usersCount,
        collectorsCount,
        recyclersCount,
        totalPickupsCount,
        completedPickupsCount,
        cancelledPickupsCount,
        disputedPickupsCount,
        completionRatePercentage: completionRate,
        totalSettledInr: totalTransactions._sum.totalAmount || 0,
        totalDivertedKg: totalTransactions._sum.totalWeightKg || 0,
        transactionsCount: totalTransactions._count,
      },
      recentAuditLogs,
      openDisputes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving admin overview.' });
  }
}

export async function listAllUsers(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }

    const { role } = req.query;
    const whereClause: any = {};
    if (role) whereClause.role = String(role);

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        profile: true,
        addresses: true,
        verifications: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error listing users.' });
  }
}

export async function updateUserVerification(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }

    const { userId } = req.params;
    const { isVerified, notes } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isVerified: Boolean(isVerified) },
      select: { id: true, name: true, email: true, role: true, isVerified: true },
    });

    await logAuditEvent({
      userId: req.user.id,
      action: 'VERIFY_USER',
      resource: 'User',
      resourceId: userId,
      details: { isVerified, notes },
      ipAddress: req.ip,
    });

    res.json({ success: true, message: `User verification updated to ${isVerified}`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user verification.' });
  }
}

export async function updateIndicativePrice(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }

    const { priceId } = req.params;
    const { indicativePrice, minPrice, maxPrice, source } = req.body;

    const updated = await prisma.materialPrice.update({
      where: { id: priceId },
      data: {
        indicativePrice: Number(indicativePrice),
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        source: source || undefined,
        lastUpdated: new Date(),
      },
      include: { category: true },
    });

    await logAuditEvent({
      userId: req.user.id,
      action: 'UPDATE_PRICE',
      resource: 'MaterialPrice',
      resourceId: priceId,
      details: { newIndicativePrice: indicativePrice, category: updated.category.name },
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Material indicative price updated.', price: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating material price.' });
  }
}

export async function resolveDispute(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }

    const { disputeId } = req.params;
    const { resolution, status = 'RESOLVED' } = req.body;

    const dispute = await prisma.complaintDispute.update({
      where: { id: disputeId },
      data: {
        status,
        resolution,
        resolvedById: req.user.id,
        resolvedAt: new Date(),
      },
    });

    await logAuditEvent({
      userId: req.user.id,
      action: 'RESOLVE_DISPUTE',
      resource: 'ComplaintDispute',
      resourceId: disputeId,
      details: { resolution, status },
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Dispute case updated.', dispute });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error resolving dispute.' });
  }
}

export async function getAuditLogs(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }

    const logs = await prisma.auditLog.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, role: true, email: true } },
      },
    });

    res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching audit logs.' });
  }
}
