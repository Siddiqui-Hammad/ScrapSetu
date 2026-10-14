import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { VoiceCommandService } from '../services/voiceCommandService.js';

export async function processVoiceCommand(req: AuthRequest, res: Response): Promise<void> {
  try {
    const schema = z.object({
      transcript: z.string().min(1, 'Transcript cannot be empty'),
      language: z.enum(['hi', 'en']).default('hi'),
      networkOnline: z.boolean().default(true),
    });

    const parsed = schema.parse(req.body);

    const parsedAction = VoiceCommandService.parseCommand(parsed.transcript);

    // If collector is authenticated, record audit log
    let logRecord: any = null;
    if (req.user) {
      logRecord = await VoiceCommandService.recordVoiceAudit({
        userId: req.user.id,
        transcript: parsed.transcript,
        language: parsed.language,
        recognizedAction: parsedAction.intent,
        actionPayload: {
          targetRoute: parsedAction.targetRoute,
          modalTarget: parsedAction.modalTarget,
          parameters: parsedAction.parameters,
        },
        status: parsedAction.requiresConfirmation ? 'PENDING_CONFIRMATION' : 'RECOGNIZED',
        networkOnline: parsed.networkOnline,
      });
    }

    res.json({
      success: true,
      logId: logRecord?.id,
      ...parsedAction,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Invalid voice input', errors: err.errors });
      return;
    }
    console.error('Error processing voice command:', err);
    res.status(500).json({ success: false, message: 'Error processing voice command' });
  }
}

export async function confirmVoiceAction(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { logId, confirmed } = req.body;

    if (logId) {
      await prisma.voiceCommandLog.updateMany({
        where: { id: logId, userId: req.user.id },
        data: {
          status: confirmed ? 'CONFIRMED' : 'CANCELLED',
        },
      });
    }

    res.json({
      success: true,
      message: confirmed ? 'Voice action confirmed and authorized.' : 'Action cancelled by collector.',
    });
  } catch (err: any) {
    console.error('Error confirming voice action:', err);
    res.status(500).json({ success: false, message: 'Error confirming voice action' });
  }
}

export async function getRecentVoiceLogs(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const logs = await prisma.voiceCommandLog.findMany({
      where: req.user.role === 'ADMIN' ? {} : { userId: req.user.id },
      orderBy: { timestamp: 'desc' },
      take: 20,
    });

    res.json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (err: any) {
    console.error('Error fetching voice logs:', err);
    res.status(500).json({ success: false, message: 'Error fetching voice logs' });
  }
}
