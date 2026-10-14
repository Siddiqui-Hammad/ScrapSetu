import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { PoolingService } from '../services/poolingService.js';
import { logAuditEvent } from '../utils/auditLogger.js';

export async function getPools(req: AuthRequest, res: Response): Promise<void> {
  try {
    const categoryId = req.query.categoryId as string | undefined;
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const lat = req.query.lat ? Number(req.query.lat) : undefined;
    const lng = req.query.lng ? Number(req.query.lng) : undefined;

    const pools = await PoolingService.listPools({
      categoryId,
      status,
      search,
      userLat: lat,
      userLng: lng,
    });

    res.json({
      success: true,
      count: pools.length,
      pools,
    });
  } catch (err: any) {
    console.error('Error listing pools:', err);
    res.status(500).json({ success: false, message: err.message || 'Error listing pools' });
  }
}

export async function getPool(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const poolData = await PoolingService.getPoolDetails(id);
    res.json({
      success: true,
      ...poolData,
    });
  } catch (err: any) {
    console.error('Error getting pool details:', err);
    res.status(404).json({ success: false, message: err.message || 'Pool not found' });
  }
}

export async function createPool(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || (req.user.role !== 'COLLECTOR' && req.user.role !== 'ADMIN')) {
      res.status(403).json({ success: false, message: 'Only collectors or administrators can initiate a scrap pool.' });
      return;
    }

    const schema = z.object({
      title: z.string().min(5, 'Title must be at least 5 characters'),
      description: z.string().optional(),
      categoryId: z.string().min(1, 'Category is required'),
      targetWeightKg: z.number().min(50, 'Target weight must be at least 50 kg for bulk pooling'),
      targetPricePerKg: z.number().positive('Target price must be positive'),
      baselinePricePerKg: z.number().optional(),
      collectionDeadline: z.string().min(1, 'Collection deadline is required'),
      hubLocationName: z.string().optional(),
      hubAddress: z.string().optional(),
      hubLat: z.number().optional(),
      hubLng: z.number().optional(),
    });

    const parsed = schema.parse(req.body);

    const pool = await PoolingService.createPool(req.user.id, parsed);

    await logAuditEvent({
      userId: req.user.id,
      action: 'CREATE_POOL',
      resource: 'ScrapPool',
      resourceId: pool.id,
      details: { title: pool.title, targetWeightKg: pool.targetWeightKg },
    });

    res.status(201).json({
      success: true,
      message: 'Scrap pool initialized successfully.',
      pool,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation failed', errors: err.errors });
      return;
    }
    console.error('Error creating pool:', err);
    res.status(500).json({ success: false, message: err.message || 'Error creating pool' });
  }
}

export async function pledgeScrap(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || (req.user.role !== 'COLLECTOR' && req.user.role !== 'ADMIN')) {
      res.status(403).json({ success: false, message: 'Only collectors can pledge scrap to pools.' });
      return;
    }

    const { id: poolId } = req.params;
    const schema = z.object({
      pledgedWeightKg: z.number().positive('Pledged weight must be positive'),
      scrapLotId: z.string().optional(),
    });

    const parsed = schema.parse(req.body);

    const result = await PoolingService.pledgeScrap(req.user.id, poolId, parsed);

    await logAuditEvent({
      userId: req.user.id,
      action: 'PLEDGE_SCRAP',
      resource: 'PoolPledge',
      resourceId: result.pledge.id,
      details: { poolId, pledgedWeightKg: parsed.pledgedWeightKg },
    });

    res.json({
      success: true,
      message: 'Scrap quantity pledged successfully to the pool.',
      pledge: result.pledge,
      pool: result.pool,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation failed', errors: err.errors });
      return;
    }
    console.error('Error pledging scrap:', err);
    res.status(400).json({ success: false, message: err.message || 'Error pledging scrap' });
  }
}

export async function withdrawPledge(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || (req.user.role !== 'COLLECTOR' && req.user.role !== 'ADMIN')) {
      res.status(403).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { pledgeId } = req.params;

    const result = await PoolingService.withdrawPledge(req.user.id, pledgeId);

    await logAuditEvent({
      userId: req.user.id,
      action: 'WITHDRAW_PLEDGE',
      resource: 'PoolPledge',
      resourceId: pledgeId,
    });

    res.json({
      success: true,
      message: 'Pledge withdrawn successfully.',
      pledge: result,
    });
  } catch (err: any) {
    console.error('Error withdrawing pledge:', err);
    res.status(400).json({ success: false, message: err.message || 'Error withdrawing pledge' });
  }
}

export async function matchBulkBuyer(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { id: poolId } = req.params;
    const { offerId } = req.body;

    if (!offerId) {
      res.status(400).json({ success: false, message: 'offerId is required' });
      return;
    }

    const matchedPool = await PoolingService.matchBulkBuyer(poolId, offerId, req.user.id);

    res.json({
      success: true,
      message: 'Bulk buyer offer matched to pool successfully.',
      pool: matchedPool,
    });
  } catch (err: any) {
    console.error('Error matching bulk buyer:', err);
    res.status(500).json({ success: false, message: err.message || 'Error matching bulk buyer' });
  }
}

export async function settlePool(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || (req.user.role !== 'RECYCLER' && req.user.role !== 'ADMIN')) {
      res.status(403).json({ success: false, message: 'Only recyclers or administrators can record settlement.' });
      return;
    }

    const { id: poolId } = req.params;
    const schema = z.object({
      verifiedPledges: z.array(
        z.object({
          pledgeId: z.string(),
          verifiedWeightKg: z.number().positive(),
        })
      ).min(1, 'At least one verified pledge must be provided'),
      paymentReference: z.string().optional(),
      settlementNotes: z.string().optional(),
    });

    const parsed = schema.parse(req.body);

    const settled = await PoolingService.recordIntakeAndSettlement(poolId, {
      verifiedPledges: parsed.verifiedPledges,
      paymentReference: parsed.paymentReference,
      settlementNotes: parsed.settlementNotes,
      recordedByUserId: req.user.id,
    });

    res.json({
      success: true,
      message: 'Pool physical intake and settlement allocation finalized.',
      pool: settled,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation failed', errors: err.errors });
      return;
    }
    console.error('Error settling pool:', err);
    res.status(500).json({ success: false, message: err.message || 'Error settling pool' });
  }
}
