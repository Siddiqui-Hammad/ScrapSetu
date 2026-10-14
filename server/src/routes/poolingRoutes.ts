import { Router } from 'express';
import { authenticateOptional, authenticateRole } from '../middleware/auth.js';
import {
  getPools,
  getPool,
  createPool,
  pledgeScrap,
  withdrawPledge,
  matchBulkBuyer,
  settlePool,
} from '../controllers/poolingController.js';

const router = Router();

// Public / Authenticated list of pools
router.get('/', authenticateOptional, getPools);

// Single pool details
router.get('/:id', authenticateOptional, getPool);

// Create pool (Collector or Admin)
router.post('/', authenticateRole(['COLLECTOR', 'ADMIN']), createPool);

// Pledge scrap (Collector or Admin)
router.post('/:id/pledge', authenticateRole(['COLLECTOR', 'ADMIN']), pledgeScrap);

// Withdraw pledge (Collector or Admin)
router.post('/pledges/:pledgeId/withdraw', authenticateRole(['COLLECTOR', 'ADMIN']), withdrawPledge);

// Match bulk buyer (Recycler, Collector, or Admin)
router.post('/:id/match-buyer', authenticateRole(['COLLECTOR', 'RECYCLER', 'ADMIN']), matchBulkBuyer);

// Finalize settlement (Recycler or Admin)
router.post('/:id/settle', authenticateRole(['RECYCLER', 'ADMIN']), settlePool);

export default router;
