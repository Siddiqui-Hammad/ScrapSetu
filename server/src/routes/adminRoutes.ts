import { Router } from 'express';
import {
  getAdminPlatformOverview,
  listAllUsers,
  updateUserVerification,
  updateIndicativePrice,
  resolveDispute,
  getAuditLogs,
} from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);
router.use(requireRole(['ADMIN']));

router.get('/overview', getAdminPlatformOverview);
router.get('/users', listAllUsers);
router.patch('/users/:userId/verification', updateUserVerification);
router.patch('/prices/:priceId', updateIndicativePrice);
router.post('/disputes/:disputeId/resolve', resolveDispute);
router.get('/audit-logs', getAuditLogs);

export default router;
