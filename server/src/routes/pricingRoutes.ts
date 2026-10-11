import { Router } from 'express';
import { getCategoriesAndPrices, estimatePrice } from '../controllers/pricingController.js';

const router = Router();

// Public endpoints for transparent rates & valuations
router.get('/rates', getCategoriesAndPrices);
router.post('/estimate', estimatePrice);

export default router;
