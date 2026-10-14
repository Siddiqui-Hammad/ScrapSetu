import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import {
  verifyPhotoMatch,
  listVerificationDossiers,
  approveDossier,
  rejectDossier,
} from '../controllers/kycController.js';

const router = Router();

// Endpoint for Aadhaar / Driving Licence + Live Selfie photo match verification
router.post(
  '/verify-photo',
  upload.fields([
    { name: 'documentImage', maxCount: 1 },
    { name: 'livePhoto', maxCount: 1 },
  ]),
  verifyPhotoMatch
);

// Review Queue for Admin & Verification Dashboard
router.get('/dossiers', listVerificationDossiers);
router.post('/dossiers/:id/approve', approveDossier);
router.post('/dossiers/:id/reject', rejectDossier);

export default router;
