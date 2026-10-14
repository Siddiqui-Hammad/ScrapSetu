import { describe, it, expect } from 'vitest';
import { KycPhotoMatchingService } from '../src/services/kycPhotoMatchingService.js';
import { AiService } from '../src/services/aiService.js';

describe('KycPhotoMatchingService & AI Vision Test Suite', () => {
  it('should successfully verify face match between Aadhaar Card and Live Selfie', async () => {
    const result = await KycPhotoMatchingService.verifyPhotoMatch({
      documentImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD_aadhaar_card_sample_ramesh',
      livePhoto: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD_live_selfie_camera_ramesh',
      documentTypeHint: 'AADHAAR',
      applicantName: 'Ramesh Kumar Sahu',
    });

    expect(result.isMatch).toBe(true);
    expect(result.matchVerdict).toBe('VERIFIED');
    expect(result.matchScore).toBeGreaterThanOrEqual(80);
    expect(result.livenessScore).toBeGreaterThanOrEqual(70);
    expect(result.antiSpoofingPassed).toBe(true);
    expect(result.extractedDocument.documentType).toBe('AADHAAR');
    expect(result.extractedDocument.fullName).toBe('Ramesh Kumar Sahu');
    expect(result.biometricAuditHash).toContain('SHA256:');
  });

  it('should successfully verify Driving Licence document format and face match', async () => {
    const result = await KycPhotoMatchingService.verifyPhotoMatch({
      documentImage: 'data:image/jpeg;base64,dl_commercial_transport_card_sample_shyam',
      livePhoto: 'data:image/jpeg;base64,live_selfie_camera_shyam',
      documentTypeHint: 'DRIVING_LICENCE',
      applicantName: 'Shyam Sundar Sharma',
    });

    expect(result.isMatch).toBe(true);
    expect(result.extractedDocument.documentType).toBe('DRIVING_LICENCE');
    expect(result.extractedDocument.documentNumber).toMatch(/^[A-Z]{2}-\d{2}-\d{4}-\d+/);
    expect(result.extractedDocument.vehicleClass).toContain('LMV-TR');
  });

  it('should detect mismatch and reject when wrong individual selfie is compared', async () => {
    const result = await KycPhotoMatchingService.verifyPhotoMatch({
      documentImage: 'data:image/jpeg;base64,aadhaar_card_sample_ramesh',
      livePhoto: 'data:image/jpeg;base64,mismatch_person_different_face_selfie',
      documentTypeHint: 'AADHAAR',
    });

    expect(result.isMatch).toBe(false);
    expect(result.matchVerdict).toBe('MISMATCH_REJECTED');
    expect(result.matchScore).toBeLessThan(65);
    expect(result.verdictDescription).toContain('mismatch');
  });

  it('should detect spoofing attempt when fake screen photo is submitted', async () => {
    const result = await KycPhotoMatchingService.verifyPhotoMatch({
      documentImage: 'data:image/jpeg;base64,aadhaar_card_sample',
      livePhoto: 'data:image/jpeg;base64,screen_spoof_fake_display_photo',
      documentTypeHint: 'AADHAAR',
    });

    expect(result.antiSpoofingPassed).toBe(false);
    expect(result.isMatch).toBe(false);
  });

  it('should return rich multi-class breakdown and bounding boxes for PET plastic bottles in ScrapVision', async () => {
    const result = await AiService.classifyWasteImage('scrap_pet_plastic_bottles.jpg', 'pet_bottle.jpg');

    expect(result.categorySlug).toBe('rigid-plastics');
    expect(result.confidence).toBeGreaterThan(0.9);
    expect(result.materialBreakdown.length).toBeGreaterThanOrEqual(3);
    expect(result.materialBreakdown[0].label).toContain('Plastic (PET)');
    expect(result.boundingBoxes.length).toBeGreaterThan(0);
    expect(result.carbonSavedPerKg).toBe(2.1);
    expect(result.cpcbCategory).toContain('Category I');
  });

  it('should return electronic circuit and precious metals analysis for e-waste in ScrapVision', async () => {
    const result = await AiService.classifyWasteImage('electronic_circuit_motherboard.jpg', 'pcb_laptop.jpg');

    expect(result.categorySlug).toBe('e-waste');
    expect(result.confidence).toBeGreaterThan(0.95);
    expect(result.materialBreakdown[0].label).toContain('Printed Circuit');
    expect(result.carbonSavedPerKg).toBe(6.4);
    expect(result.recyclabilityIndex).toBe('SPECIAL_HANDLING');
  });
});
