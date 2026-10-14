import { Router } from 'express';
import { authenticateOptional, authenticateRole } from '../middleware/auth.js';
import {
  processVoiceCommand,
  confirmVoiceAction,
  getRecentVoiceLogs,
} from '../controllers/voiceController.js';

const router = Router();

// Process spoken command (allows both authenticated and unauthenticated test/demo usage)
router.post('/process-command', authenticateOptional, processVoiceCommand);

// Confirm consequential action (collector or admin)
router.post('/confirm-action', authenticateRole(['COLLECTOR', 'ADMIN']), confirmVoiceAction);

// Get recent command audit history
router.get('/recent', authenticateRole(['COLLECTOR', 'ADMIN']), getRecentVoiceLogs);

export default router;
