import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { ENV } from '../config/env.js';
import { AuthRequest } from '../middleware/auth.js';
import { logAuditEvent } from '../utils/auditLogger.js';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Valid 10-digit phone number required'),
  role: z.enum(['HOUSEHOLD', 'BUSINESS', 'COLLECTOR', 'RECYCLER']),
  languagePref: z.enum(['en', 'hi']).optional().default('en'),
  // Profile optional fields
  businessName: z.string().optional(),
  vehicleType: z.string().optional(),
  // Initial address optional fields
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: parseResult.error.errors.map((e) => e.message).join(', '),
      });
      return;
    }

    const {
      name,
      email,
      password,
      phone,
      role,
      languagePref,
      businessName,
      vehicleType,
      streetAddress,
      city,
      pincode,
      lat,
      lng,
    } = parseResult.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with profile and optional address
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone,
        role,
        languagePref,
        isVerified: role === 'HOUSEHOLD', // Household is auto-verified, collectors/recyclers/businesses undergo verification review
        profile: {
          create: {
            businessName: businessName || null,
            vehicleType: vehicleType || null,
            serviceAreaRadiusKm: role === 'COLLECTOR' ? 8.0 : 5.0,
            reliabilityRating: 5.0,
            isAvailable: true,
          },
        },
        addresses: streetAddress
          ? {
              create: {
                label: role === 'BUSINESS' ? 'Headquarters' : 'Home',
                streetAddress,
                city: city || 'Jaipur',
                pincode: pincode || '302001',
                lat: lat || 26.9124,
                lng: lng || 75.7873,
                isDefault: true,
              },
            }
          : undefined,
      },
      include: {
        profile: true,
        addresses: true,
      },
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, email: newUser.email },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    await logAuditEvent({
      userId: newUser.id,
      action: 'USER_REGISTER',
      resource: 'User',
      resourceId: newUser.id,
      details: { role: newUser.role, email: newUser.email },
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        languagePref: newUser.languagePref,
        isVerified: newUser.isVerified,
        profile: newUser.profile,
        addresses: newUser.addresses,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        addresses: true,
      },
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        languagePref: user.languagePref,
        isVerified: user.isVerified,
        profile: user.profile,
        addresses: user.addresses,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: true,
        addresses: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        languagePref: user.languagePref,
        isVerified: user.isVerified,
        profile: user.profile,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving user profile.' });
  }
}

export async function updateLanguage(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { languagePref } = req.body;
    if (!['en', 'hi'].includes(languagePref)) {
      res.status(400).json({ success: false, message: 'Language must be either en or hi.' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { languagePref },
      select: { id: true, languagePref: true },
    });

    res.json({ success: true, user: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating language preference.' });
  }
}

export async function addAddress(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { label, streetAddress, area, city, pincode, lat, lng, isDefault } = req.body;

    if (!streetAddress || !pincode) {
      res.status(400).json({ success: false, message: 'Street address and pincode are required.' });
      return;
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: req.user.id,
        label: label || 'Location',
        streetAddress,
        area: area || null,
        city: city || 'Jaipur',
        pincode,
        lat: lat || 26.9124,
        lng: lng || 75.7873,
        isDefault: Boolean(isDefault),
      },
    });

    res.status(201).json({ success: true, address: newAddress });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding address.' });
  }
}
