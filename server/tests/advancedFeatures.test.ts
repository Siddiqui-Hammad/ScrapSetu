import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '../src/utils/prisma.js';
import { SmartBuyerMatchingService } from '../src/services/smartBuyerMatchingService.js';
import { PoolingService } from '../src/services/poolingService.js';
import { PassportService } from '../src/services/passportService.js';
import { VoiceCommandService } from '../src/services/voiceCommandService.js';

describe('ScrapSetu 2.0: Advanced Circular Features Test Suite', () => {
  let plasticCatId: string;
  let collectorId: string;
  let recyclerId: string;

  beforeAll(async () => {
    await prisma.$connect();

    const cat = await prisma.materialCategory.findUnique({
      where: { slug: 'rigid-plastics' },
    });
    plasticCatId = cat!.id;

    const collector = await prisma.user.findFirst({
      where: { role: 'COLLECTOR' },
    });
    collectorId = collector!.id;

    const recycler = await prisma.user.findFirst({
      where: { role: 'RECYCLER' },
    });
    recyclerId = recycler!.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // -------------------------------------------------------------
  // FEATURE 1: SMART BUYER MATCHING
  // -------------------------------------------------------------
  describe('1. Smart Buyer Matching Engine', () => {
    it('calculates vehicle transport costs accurately based on vehicle tier and distance', () => {
      // 10 km for Three Wheeler: 50 base + 10 * 12 = 170
      const tw = SmartBuyerMatchingService.calculateTransportCost(10, 'THREE_WHEELER');
      expect(tw.totalTransportCost).toBe(170);
      expect(tw.baseFare).toBe(50);
      expect(tw.ratePerKm).toBe(12);

      // 10 km for Mini Truck: 90 base + 10 * 18 = 270
      const truck = SmartBuyerMatchingService.calculateTransportCost(10, 'MINI_TRUCK');
      expect(truck.totalTransportCost).toBe(270);
    });

    it('ranks buyers by Estimated Net Proceeds rather than merely highest advertised price', async () => {
      // Collector at Jaipur (26.8501, 75.8155) with 50 kg of plastic
      const match = await SmartBuyerMatchingService.matchBuyers({
        categoryId: plasticCatId,
        weightKg: 50.0,
        collectorLat: 26.8501,
        collectorLng: 75.8155,
        vehicleType: 'THREE_WHEELER',
      });

      expect(match.eligibleBuyers.length).toBeGreaterThan(0);

      // Verify that eligible buyers are sorted strictly by net proceeds descending
      for (let i = 0; i < match.eligibleBuyers.length - 1; i++) {
        expect(match.eligibleBuyers[i].netProceeds).toBeGreaterThanOrEqual(
          match.eligibleBuyers[i + 1].netProceeds
        );
      }

      // Check recommendation reason
      expect(match.recommendedBuyer).not.toBeNull();
      expect(match.recommendedBuyer?.recommendationReason).toContain('TOP RECOMMENDATION');
      expect(match.recommendedBuyer?.grossValue).toBeGreaterThan(0);
      expect(match.recommendedBuyer?.netProceeds).toBeLessThanOrEqual(match.recommendedBuyer!.grossValue);
    });

    it('identifies and disqualifies buyers that fail minimum lot-size requirement with clear reason', async () => {
      // With small quantity of 15 kg, buyers requiring min 25kg or 250kg must be marked ineligible
      const match = await SmartBuyerMatchingService.matchBuyers({
        categoryId: plasticCatId,
        weightKg: 15.0,
        collectorLat: 26.8501,
        collectorLng: 75.8155,
      });

      expect(match.incompatibleBuyers.length).toBeGreaterThan(0);
      const disqualified = match.incompatibleBuyers.find((b) => !b.meetsMinQuantity);
      expect(disqualified).toBeDefined();
      expect(disqualified?.disqualificationReason).toContain('Minimum lot size requirement not met');
    });
  });

  // -------------------------------------------------------------
  // FEATURE 2: COLLABORATIVE SCRAP POOLING
  // -------------------------------------------------------------
  describe('2. Collaborative Scrap Pooling', () => {
    let testPoolId: string;

    it('creates a new pooling group with valid targets, deadlines, and hub coordinates', async () => {
      const pool = await PoolingService.createPool(collectorId, {
        title: 'Vitest Unit Test PET Consolidation Drive',
        description: 'Test pooling group for automated verification',
        categoryId: plasticCatId,
        targetWeightKg: 100.0,
        targetPricePerKg: 24.0,
        collectionDeadline: new Date(Date.now() + 86400000 * 2),
      });

      expect(pool.id).toBeDefined();
      expect(pool.poolCode).toMatch(/^POOL-2026-/);
      expect(pool.status).toBe('OPEN');
      expect(pool.currentPledgedKg).toBe(0);
      testPoolId = pool.id;
    });

    it('allows participant to pledge scrap quantity and tracks progress percentage', async () => {
      const pledgeRes = await PoolingService.pledgeScrap(collectorId, testPoolId, {
        pledgedWeightKg: 40.0,
      });

      expect(pledgeRes.pledge.status).toBe('PLEDGED');
      expect(pledgeRes.pool.currentPledgedKg).toBe(40.0);

      // Verify pool details
      const details = await PoolingService.getPoolDetails(testPoolId);
      expect(details.pool.progressPercentage).toBe(40);
      expect(details.participantsBreakdown.length).toBe(1);
      expect(details.participantsBreakdown[0].pledgedWeightKg).toBe(40.0);
    });

    it('prevents pledging duplicate scrap lots across active pools', async () => {
      // Create a test scrap lot
      const lot = await PassportService.createPassport({
        collectorId,
        categoryId: plasticCatId,
        declaredWeightKg: 25.0,
      });

      // First pledge should succeed
      await PoolingService.pledgeScrap(collectorId, testPoolId, {
        pledgedWeightKg: 25.0,
        scrapLotId: lot.id,
      });

      // Second pledge of the SAME lot in any pool must fail
      await expect(
        PoolingService.pledgeScrap(collectorId, testPoolId, {
          pledgedWeightKg: 25.0,
          scrapLotId: lot.id,
        })
      ).rejects.toThrow(/already pledged/);
    });

    it('allows withdrawal while pool is OPEN and updates pool balance accordingly', async () => {
      // Find active pledge
      const details = await PoolingService.getPoolDetails(testPoolId);
      const pledge = details.participantsBreakdown[0];

      const initialPledged = details.pool.currentPledgedKg;
      const withdrawn = await PoolingService.withdrawPledge(collectorId, pledge.pledgeId);
      expect(withdrawn.status).toBe('WITHDRAWN');

      const afterWithdraw = await PoolingService.getPoolDetails(testPoolId);
      expect(afterWithdraw.pool.currentPledgedKg).toBe(initialPledged - pledge.pledgedWeightKg);
    });
  });

  // -------------------------------------------------------------
  // FEATURE 3: SCRAP PASSPORT & TRACEABILITY
  // -------------------------------------------------------------
  describe('3. Scrap Passport & QR-Based Traceability', () => {
    let testLotNumber: string;
    let testLotId: string;

    it('initializes a tamper-evident Scrap Passport with unique lot ID and SHA-256 seal', async () => {
      const lot = await PassportService.createPassport({
        collectorId,
        categoryId: plasticCatId,
        declaredWeightKg: 60.0,
        collectedWeightKg: 60.0,
        grade: 'Optical PET Flakes Clean',
      });

      expect(lot.lotNumber).toMatch(/^LOT-2026-[A-F0-9]{8}$/);
      expect(lot.currentHashSha256).toHaveLength(64);
      expect(lot.qrCodeData).toBe(`/passport/${lot.lotNumber}`);
      expect(lot.status).toBe('WEIGHED');

      testLotNumber = lot.lotNumber;
      testLotId = lot.id;
    });

    it('provides privacy-safe public view (masks generator PII and personal contact info)', async () => {
      // Unauthenticated visitor
      const publicView = await PassportService.getPassport(testLotNumber);
      expect(publicView.lotNumber).toBe(testLotNumber);
      expect(publicView.isAuthorizedDetailView).toBe(false);
      expect(publicView.generator.name).toContain('Verified');
      expect(publicView.collector.phone).toBeUndefined(); // Phone omitted for privacy!
      expect(publicView.events.length).toBeGreaterThan(0);
    });

    it('detects and flags weighbridge discrepancy when receiving weight differs beyond tolerance', async () => {
      // Progress to Handover
      await PassportService.confirmHandover(testLotId, collectorId, 'Dispatched to recycler weighbridge');

      // Recycler weighs 56.5 kg instead of 60.0 kg (-3.5 kg / -5.8% discrepancy!)
      const intake = await PassportService.confirmReceipt(testLotId, recyclerId, {
        receivedWeightKg: 56.5,
        weighbridgeSlipNumber: 'WB-TEST-9921',
        notes: 'Excess moisture loss and dirt deduction',
      });

      expect(intake.status).toBe('RECEIVED');
      expect(intake.hasDiscrepancy).toBe(true);
      expect(intake.weightDiscrepancyKg).toBe(-3.5);
      expect(intake.discrepancyPercentage).toBe(-5.8);
    });

    it('confirms processing with circular CPCB compliance and updates hash chain', async () => {
      const processed = await PassportService.confirmProcessing(testLotId, recyclerId, {
        processingMethod: 'SHREDDED_AND_PELLETIZED',
        processingBatchNumber: 'BATCH-2026-TEST-001',
        cpcbComplianceRef: 'CPCB/EPR/2026/TEST/999',
        processingNotes: 'Recycled into circular food-grade pellets.',
      });

      expect(processed.status).toBe('PROCESSING_CONFIRMED');
      expect(processed.processingMethod).toBe('SHREDDED_AND_PELLETIZED');
      expect(processed.processingConfirmedAt).toBeDefined();

      const passport = await PassportService.getPassport(testLotNumber);
      expect(passport.status).toBe('PROCESSING_CONFIRMED');
      const finalEvent = passport.events[passport.events.length - 1];
      expect(finalEvent.stage).toBe('PROCESSING_CONFIRMED');
      expect(finalEvent.evidenceType).toBe('INDEPENDENTLY_VERIFIED');
    });
  });

  // -------------------------------------------------------------
  // FEATURE 4: VOICE-FIRST KABADIWALA MODE
  // -------------------------------------------------------------
  describe('4. Voice-First Hindi Command Engine', () => {
    it('correctly maps Hindi voice phrase for today pickups', () => {
      const res = VoiceCommandService.parseCommand('आज के पिकअप दिखाओ');
      expect(res.intent).toBe('NAVIGATE_TODAY_PICKUPS');
      expect(res.targetRoute).toContain('jobs');
      expect(res.requiresConfirmation).toBe(false);
    });

    it('correctly maps Hindi voice phrase for nearby scrap jobs', () => {
      const res = VoiceCommandService.parseCommand('Paas ke scrap jobs dikhao');
      expect(res.intent).toBe('NAVIGATE_NEARBY_JOBS');
      expect(res.targetRoute).toContain('nearby');
    });

    it('correctly maps Hindi voice phrase for earnings', () => {
      const res = VoiceCommandService.parseCommand('Meri aaj ki kamai dikhao');
      expect(res.intent).toBe('NAVIGATE_EARNINGS');
      expect(res.targetRoute).toContain('earnings');
    });

    it('correctly extracts category parameters for buyer matching', () => {
      const res = VoiceCommandService.parseCommand('Plastic ke buyers dikhao');
      expect(res.intent).toBe('NAVIGATE_BUYER_MATCHING');
      expect(res.parameters?.categorySlug).toBe('rigid-plastics');
    });

    it('requires explicit confirmation before completing consequential pickup and weighment', () => {
      const res = VoiceCommandService.parseCommand('Pickup complete karna hai');
      expect(res.intent).toBe('COMPLETE_PICKUP_WORKFLOW');
      expect(res.requiresConfirmation).toBe(true);
      expect(res.hindiTitle).toContain('डिजिटल वजन');
    });

    it('records voice audit command securely', async () => {
      const log = await VoiceCommandService.recordVoiceAudit({
        userId: collectorId,
        transcript: 'प्लास्टिक के बायर्स दिखाओ',
        language: 'hi',
        recognizedAction: 'NAVIGATE_BUYER_MATCHING',
      });

      expect(log.id).toBeDefined();
      expect(log.transcript).toBe('प्लास्टिक के बायर्स दिखाओ');
      expect(log.status).toBe('RECOGNIZED');
    });
  });
});
