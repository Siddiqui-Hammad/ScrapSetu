import { Router } from 'express';
import {
  createPickup,
  listPickups,
  getPickupById,
  cancelPickup,
  disputePickup,
} from '../controllers/pickupController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/', createPickup);
router.get('/', listPickups);
router.get('/:id', getPickupById);
router.post('/:id/cancel', cancelPickup);
router.post('/:id/dispute', disputePickup);

export default router;
