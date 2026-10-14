import { Request, Response } from 'express';
import { KycPhotoMatchingService, PhotoMatchRequest } from '../services/kycPhotoMatchingService.js';
import prisma from '../utils/prisma.js';

// In-memory queue for demo review queue persistence
let DEMO_VERIFICATION_QUEUE = [
  {
    id: 'KYC-001',
    applicantName: 'Ramesh Kumar Sahu',
    role: 'COLLECTOR',
    phone: '+91 98290 88008',
    vehicle: 'E-Rickshaw Loader RJ 14 ER 7721',
    documentType: 'AADHAAR',
    documentNumber: '4129-6638-6621',
    dlNumber: 'RJ-14-2022-00455',
    matchScore: 96.8,
    matchVerdict: 'VERIFIED',
    livenessScore: 98.4,
    status: 'PENDING',
    appliedDate: '2026-10-14 10:30',
    auditHash: 'SHA256:7f8a92b9381c0029adbe991a0f8b1c',
  },
  {
    id: 'KYC-002',
    applicantName: 'Shyam Sundar Sharma',
    role: 'COLLECTOR',
    phone: '+91 98290 11001',
    vehicle: '3-Wheeler Tempo RJ 14 TB 4921',
    documentType: 'DRIVING_LICENCE',
    documentNumber: '5482-9182-4912',
    dlNumber: 'RJ-14-2019-00291',
    matchScore: 98.4,
    matchVerdict: 'VERIFIED',
    livenessScore: 99.1,
    status: 'APPROVED',
    appliedDate: '2026-10-12 14:15',
    reviewedBy: 'Vikramaditya Sharma (Admin)',
    auditHash: 'SHA256:49aa1b3398fe11cde88290145fa30b',
  },
  {
    id: 'KYC-003',
    applicantName: 'Vikram Singh Shekhawat',
    role: 'RECYCLER',
    phone: '+91 98290 33445',
    facilityName: 'GreenTech Refiners & Extruders Pvt Ltd',
    documentType: 'AADHAAR',
    documentNumber: '6812-4419-8902',
    dlNumber: 'RJ-14-2015-00112',
    cpcbRegistration: 'CPCB/EPR/PLASTIC/2024/0912',
    matchScore: 94.2,
    matchVerdict: 'VERIFIED',
    livenessScore: 97.5,
    status: 'PENDING',
    appliedDate: '2026-10-14 11:45',
    auditHash: 'SHA256:91ef2b881a77dc300941a5fe0018bd',
  },
];

export async function verifyPhotoMatch(req: Request, res: Response): Promise<void> {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    let documentImage = req.body.documentImage;
    let livePhoto = req.body.livePhoto;

    // Handle multipart uploads if provided
    if (files) {
      if (files['documentImage'] && files['documentImage'][0]) {
        documentImage = `/uploads/${files['documentImage'][0].filename}`;
      }
      if (files['livePhoto'] && files['livePhoto'][0]) {
        livePhoto = `/uploads/${files['livePhoto'][0].filename}`;
      }
    }

    if (!documentImage || !livePhoto) {
      res.status(400).json({
        success: false,
        message: 'Both document image (Aadhaar or Driving Licence) and live photograph are required for verification.',
      });
      return;
    }

    const matchReq: PhotoMatchRequest = {
      documentImage,
      livePhoto,
      documentTypeHint: req.body.documentTypeHint || 'AUTO_DETECT',
      applicantName: req.body.applicantName,
      applicantPhone: req.body.applicantPhone,
    };

    const result = await KycPhotoMatchingService.verifyPhotoMatch(matchReq);

    // If verification succeeded and applicantName provided, append to pending queue for admin review
    const newQueueItem = {
      id: `KYC-00${DEMO_VERIFICATION_QUEUE.length + 1}`,
      applicantName: result.extractedDocument.fullName,
      role: req.body.role || 'COLLECTOR',
      phone: req.body.applicantPhone || '+91 98290 99887',
      vehicle: req.body.vehicle || 'Tata Ace Gold EV',
      documentType: result.extractedDocument.documentType,
      documentNumber: result.extractedDocument.documentNumber,
      dlNumber: result.extractedDocument.documentType === 'DRIVING_LICENCE' ? result.extractedDocument.documentNumber : 'RJ-14-2023-99881',
      matchScore: result.matchScore,
      matchVerdict: result.matchVerdict,
      livenessScore: result.livenessScore,
      status: result.isMatch ? 'PENDING' : 'REJECTED',
      appliedDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
      auditHash: result.biometricAuditHash,
    };

    DEMO_VERIFICATION_QUEUE.unshift(newQueueItem);

    res.json({
      success: true,
      message: result.isMatch
        ? 'Aadhaar / Driving Licence Biometric Face Match Verified Successfully.'
        : 'Biometric verification did not meet confidence threshold.',
      data: result,
    });
  } catch (error: any) {
    console.error('Error during KYC photo match:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error occurred while verifying ID document and live photograph.',
    });
  }
}

export async function listVerificationDossiers(_req: Request, res: Response): Promise<void> {
  try {
    res.json({
      success: true,
      count: DEMO_VERIFICATION_QUEUE.length,
      dossiers: DEMO_VERIFICATION_QUEUE,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve KYC dossiers.' });
  }
}

export async function approveDossier(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const item = DEMO_VERIFICATION_QUEUE.find((d) => d.id === id);
    if (!item) {
      res.status(404).json({ success: false, message: 'KYC Dossier not found.' });
      return;
    }

    item.status = 'APPROVED';
    (item as any).reviewedBy = 'Platform Administrator (Verified)';

    res.json({
      success: true,
      message: `KYC Dossier for ${item.applicantName} approved. Doorstep pickup and collection privileges activated.`,
      dossier: item,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error approving KYC dossier.' });
  }
}

export async function rejectDossier(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const item = DEMO_VERIFICATION_QUEUE.find((d) => d.id === id);
    if (!item) {
      res.status(404).json({ success: false, message: 'KYC Dossier not found.' });
      return;
    }

    item.status = 'REJECTED';
    (item as any).rejectionReason = req.body.reason || 'Document mismatch or unclear live photograph.';

    res.json({
      success: true,
      message: `KYC Dossier for ${item.applicantName} marked for re-upload.`,
      dossier: item,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error rejecting KYC dossier.' });
  }
}
