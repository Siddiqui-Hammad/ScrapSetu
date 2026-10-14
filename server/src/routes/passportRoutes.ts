import { Router } from 'express';
import { authenticateOptional, authenticateRole } from '../middleware/auth.js';
import {
  getPassport,
  createPassport,
  confirmHandover,
  confirmReceipt,
  confirmProcessing,
  disputeDiscrepancy,
} from '../controllers/passportController.js';

const router = Router();

// Public / Authenticated traceability view by lotNumber or ID
router.get('/:identifier', authenticateOptional, getPassport);

// Create Scrap Passport (Collector or Admin)
router.post('/', authenticateRole(['COLLECTOR', 'ADMIN']), createPassport);

// Collector Handover
router.post('/:id/handover', authenticateRole(['COLLECTOR', 'ADMIN']), confirmHandover);

// Recycler Weighbridge Receipt Intake
router.post('/:id/receive', authenticateRole(['RECYCLER', 'ADMIN']), confirmReceipt);

// Recycler Processing Confirmation
router.post('/:id/confirm-processing', authenticateRole(['RECYCLER', 'ADMIN']), confirmProcessing);

// Dispute Discrepancy (Collector or Recycler)
router.post('/:id/dispute', authenticateRole(['COLLECTOR', 'RECYCLER', 'ADMIN']), disputeDiscrepancy);

export default router;
