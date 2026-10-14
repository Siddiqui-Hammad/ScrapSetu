import { Router } from 'express';
import { classifyWaste } from '../controllers/aiController.js';
import { upload } from '../middleware/upload.js';
import { authenticateOptional } from '../middleware/auth.js';

const router = Router();

// AI image classification endpoint (accessible with optional auth for demo/home testing)
router.post('/classify', authenticateOptional, upload.single('wasteImage'), classifyWaste);

export default router;
