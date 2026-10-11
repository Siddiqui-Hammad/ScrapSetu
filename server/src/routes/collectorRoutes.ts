import { Router } from 'express';
import {
  getNearbyOpenPickups,
  acceptPickup,
  updatePickupStatus,
  recordActualsAndComplete,
  getCollectorEarnings,
  getCollectorRoutePlan,
} from '../controllers/collectorController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);
router.use(requireRole(['COLLECTOR', 'ADMIN']));

router.get('/nearby', getNearbyOpenPickups);
router.post('/pickups/:id/accept', acceptPickup);
router.patch('/pickups/:id/status', updatePickupStatus);
router.post('/pickups/:id/complete', recordActualsAndComplete);
router.get('/earnings', getCollectorEarnings);
router.get('/route-plan', getCollectorRoutePlan);

export default router;
