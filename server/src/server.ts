import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import { ENV } from './config/env.js';

import authRoutes from './routes/authRoutes.js';
import pickupRoutes from './routes/pickupRoutes.js';
import collectorRoutes from './routes/collectorRoutes.js';
import recyclerRoutes from './routes/recyclerRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import impactRoutes from './routes/impactRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import buyerMatchingRoutes from './routes/buyerMatchingRoutes.js';
import poolingRoutes from './routes/poolingRoutes.js';
import passportRoutes from './routes/passportRoutes.js';
import voiceRoutes from './routes/voiceRoutes.js';
import kycRoutes from './routes/kycRoutes.js';

const app = express();

// Security & Middlewares
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploaded photos and receipts
const uploadsPath = path.resolve(process.cwd(), ENV.UPLOAD_DIR);
app.use('/uploads', express.static(uploadsPath));

// Rate limiter for auth endpoints to prevent brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' },
});

// Mount Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/collectors', collectorRoutes);
app.use('/api/recyclers', recyclerRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/buyer-matching', buyerMatchingRoutes);
app.use('/api/pools', poolingRoutes);
app.use('/api/passport', passportRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/kyc', kycRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    platform: 'ScrapSetu API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Central error handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('Unhandled Server Error:', err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error occurred.',
    });
  }
);

const PORT = ENV.PORT;
app.listen(PORT, () => {
  console.log(`🚀 ScrapSetu Backend Server running on port ${PORT}`);
  console.log(`🌐 Health check available at http://localhost:${PORT}/api/health`);
});

export default app;
