import { Router } from 'express';
import { classifyWaste } from '../controllers/aiController.js';
import { upload } from '../middleware/upload.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// AI image classification endpoint
router.post('/classify', authenticateToken, upload.single('wasteImage'), classifyWaste);

export default router;
