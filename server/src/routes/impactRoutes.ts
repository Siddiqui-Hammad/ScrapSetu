import { Router } from 'express';
import { getPublicPlatformImpact, getMyEnvironmentalImpact } from '../controllers/impactController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Platform aggregate impact
router.get('/public', getPublicPlatformImpact);

// Authenticated user's personal ecological footprint savings
router.get('/me', authenticateToken, getMyEnvironmentalImpact);

export default router;
