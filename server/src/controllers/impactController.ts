import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { ImpactService } from '../services/impactService.js';

export async function getPublicPlatformImpact(_req: any, res: Response): Promise<void> {
  try {
    const impact = await ImpactService.getPlatformImpact();
    res.json({ success: true, impact });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving platform impact metrics.' });
  }
}

export async function getMyEnvironmentalImpact(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const personalImpact = await ImpactService.getPlatformImpact(req.user.id);
    res.json({ success: true, personalImpact });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving personal impact metrics.' });
  }
}
