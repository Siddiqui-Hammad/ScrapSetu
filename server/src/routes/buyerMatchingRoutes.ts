import { Router } from 'express';
import { authenticateOptional, authenticateRole } from '../middleware/auth.js';
import {
  getBuyerMatches,
  selectBuyer,
  getCollectorLots,
  createScrapLot,
} from '../controllers/buyerMatchingController.js';

const router = Router();

// Get smart buyer matching offers (can be queried anonymously or with collector auth)
router.get('/offers', authenticateOptional, getBuyerMatches);

// Select buyer for a scrap lot (collector or admin only)
router.post('/select', authenticateRole(['COLLECTOR', 'ADMIN']), selectBuyer);

// Collector scrap lots
router.get('/lots', authenticateRole(['COLLECTOR', 'RECYCLER', 'ADMIN']), getCollectorLots);
router.post('/lots', authenticateRole(['COLLECTOR', 'ADMIN']), createScrapLot);

export default router;
