import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { AiService } from '../services/aiService.js';

export async function classifyWaste(req: AuthRequest, res: Response): Promise<void> {
  try {
    const file = req.file;
    const sampleName = req.body.sampleName || '';

    if (!file && !sampleName) {
      res.status(400).json({
        success: false,
        message: 'Please upload an image file or provide a material descriptor.',
      });
      return;
    }

    const filePath = file ? file.path : sampleName;
    const originalName = file ? file.originalname : sampleName;

    const classification = await AiService.classifyWasteImage(filePath, originalName);

    res.json({
      success: true,
      classification,
      uploadedFile: file ? `/uploads/${file.filename}` : null,
      instruction:
        'Please review the AI predicted category. You may confirm it or manually choose a different category.',
    });
  } catch (error) {
    console.error('Error during AI classification:', error);
    res.status(500).json({
      success: false,
      message: 'AI classification service encountered an error. Please use manual selection.',
    });
  }
}
