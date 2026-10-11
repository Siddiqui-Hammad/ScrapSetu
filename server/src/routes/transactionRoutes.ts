import { Router } from 'express';
import { getReceiptByNumber, listUserTransactions } from '../controllers/transactionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public verification of digital receipt by receipt number
router.get('/receipt/:receiptNumber', getReceiptByNumber);

// User's settled transactions
router.get('/', authenticateToken, listUserTransactions);

export default router;
