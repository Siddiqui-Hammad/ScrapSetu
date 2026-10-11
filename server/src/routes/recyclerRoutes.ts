import { Router } from 'express';
import {
  getRecyclerOffers,
  createRecyclerOffer,
  createIntakeSlip,
  getRecyclerDashboardMetrics,
} from '../controllers/recyclerController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Publicly browse recycler offers
router.get('/offers', getRecyclerOffers);

// Protected recycler routes
router.post('/offers', authenticateToken, requireRole(['RECYCLER', 'ADMIN']), createRecyclerOffer);
router.post('/intakes', authenticateToken, requireRole(['RECYCLER', 'ADMIN']), createIntakeSlip);
router.get('/dashboard', authenticateToken, requireRole(['RECYCLER', 'ADMIN']), getRecyclerDashboardMetrics);

export default router;
