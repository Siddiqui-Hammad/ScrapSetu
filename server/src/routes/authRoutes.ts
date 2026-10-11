import { Router } from 'express';
import { register, login, getMe, updateLanguage, addAddress } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.patch('/language', authenticateToken, updateLanguage);
router.post('/addresses', authenticateToken, addAddress);

export default router;
