import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_SECRET: process.env.JWT_SECRET || 'scrapsetu_dev_fallback_secret_never_use_in_prod',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};

export const PICKUP_STATUS = {
  OPEN: 'OPEN',
  ACCEPTED: 'ACCEPTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  DISPUTED: 'DISPUTED',
} as const;

export type PickupStatus = (typeof PICKUP_STATUS)[keyof typeof PICKUP_STATUS];

export const VALID_STATUS_TRANSITIONS: Record<PickupStatus, PickupStatus[]> = {
  OPEN: ['ACCEPTED', 'CANCELLED'],
  ACCEPTED: ['IN_PROGRESS', 'CANCELLED', 'OPEN'], // can return to OPEN if collector cancels before start
  IN_PROGRESS: ['COMPLETED', 'DISPUTED', 'CANCELLED'],
  COMPLETED: ['DISPUTED'],
  CANCELLED: [],
  DISPUTED: ['COMPLETED', 'CANCELLED'],
};

export const USER_ROLES = {
  HOUSEHOLD: 'HOUSEHOLD',
  BUSINESS: 'BUSINESS',
  COLLECTOR: 'COLLECTOR',
  RECYCLER: 'RECYCLER',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
