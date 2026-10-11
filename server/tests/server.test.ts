import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { calculateDistanceKm, fuzzCoordinates } from '../src/utils/geoUtils.js';
import { PricingService } from '../src/services/pricingService.js';
import { MatchingService } from '../src/services/matchingService.js';
import { RouteService } from '../src/services/routeService.js';
import { ReceiptService } from '../src/services/receiptService.js';
import prisma from '../src/utils/prisma.js';

describe('ScrapSetu Backend Core Logic Tests', () => {
  beforeAll(async () => {
    // Check db connection
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('calculates accurate Haversine distance and handles coordinate fuzzing for privacy', () => {
    // Malviya Nagar (26.8524, 75.8173) to C-Scheme (26.9112, 75.8011) in Jaipur is approx 6.7 km
    const dist = calculateDistanceKm(26.8524, 75.8173, 26.9112, 75.8011);
    expect(dist).toBeGreaterThan(6.0);
    expect(dist).toBeLessThan(7.5);

    // Coordinate fuzzing alters lat/lng within small threshold but preserves city locality
    const fuzzed = fuzzCoordinates(26.8524, 75.8173, 'test-request-id-123');
    expect(Math.abs(fuzzed.fuzzyLat - 26.8524)).toBeLessThan(0.01);
    expect(Math.abs(fuzzed.fuzzyLng - 75.8173)).toBeLessThan(0.01);
  });

  it('generates cryptographic tamper-evident digital receipts with valid SHA-256 verification', () => {
    const receiptNum = ReceiptService.generateReceiptNumber('JP');
    expect(receiptNum).toMatch(/^REC-\d{4}-JP-\d{5}$/);

    const testData = {
      receiptNumber: receiptNum,
      pickupId: 'pickup-test-456',
      collectorId: 'collector-test-789',
      requesterId: 'requester-test-012',
      totalAmount: 1450.5,
      totalWeightKg: 42.5,
      timestamp: '2026-10-11T12:00:00.000Z',
    };

    const hash = ReceiptService.generateReceiptHash(testData);
    expect(hash).toHaveLength(64); // SHA-256 hex string

    // Verification check with identical data passes
    const isValid = ReceiptService.verifyReceiptHash(hash, testData);
    expect(isValid).toBe(true);

    // Tampered data check fails
    const tamperedData = { ...testData, totalAmount: 9999.0 };
    const isTamperedValid = ReceiptService.verifyReceiptHash(hash, tamperedData);
    expect(isTamperedValid).toBe(false);
  });

  it('calculates indicative scrap valuation using database benchmark rates', async () => {
    const paperCat = await prisma.materialCategory.findUnique({
      where: { slug: 'paper-cardboard' },
    });
    expect(paperCat).not.toBeNull();

    if (paperCat) {
      const estimate = await PricingService.calculateEstimate([
        { categoryId: paperCat.id, estimatedQty: 50.0, grade: 'clean' },
      ]);

      expect(estimate.totalEstimatedWeightKg).toBe(50.0);
      expect(estimate.totalEstimatedValue).toBeGreaterThan(0);
      expect(estimate.items[0].gradeAdjustmentMultiplier).toBe(1.08); // Clean sorted bonus
      expect(estimate.disclaimer).toBeDefined();
    }
  });

  it('ranks eligible collectors with explainable multi-factor scoring', async () => {
    const candidates = await MatchingService.findEligibleCollectors(
      26.8524,
      75.8173,
      ['paper-cardboard', 'ferrous-metals'],
      30.0
    );

    expect(Array.isArray(candidates)).toBe(true);
    expect(candidates.length).toBeGreaterThan(0);

    const top = candidates[0];
    expect(top.matchScore).toBeGreaterThan(0);
    expect(top.scoreBreakdown.distanceScore).toBeDefined();
    expect(top.scoreBreakdown.materialOverlapScore).toBeDefined();
    expect(top.explanation).toContain('km away');
  });

  it('optimizes multi-stop collector route sequencing using evaluated TSP', () => {
    const collectorLat = 26.8501;
    const collectorLng = 75.8155;

    const stops = [
      {
        pickupId: 'p1',
        requesterName: 'Stop Far Away',
        addressLabel: 'Far',
        streetAddress: 'Far St',
        lat: 26.9200,
        lng: 75.8300,
        preferredTimeSlot: 'Morning',
        estimatedWeightKg: 10,
        estimatedValue: 150,
      },
      {
        pickupId: 'p2',
        requesterName: 'Stop Near Hub',
        addressLabel: 'Near',
        streetAddress: 'Near St',
        lat: 26.8520,
        lng: 75.8160,
        preferredTimeSlot: 'Morning',
        estimatedWeightKg: 20,
        estimatedValue: 300,
      },
    ];

    const result = RouteService.optimizeStops(collectorLat, collectorLng, stops);
    expect(result.orderedStops.length).toBe(2);
    // Nearest stop should be visited first (Stop Near Hub)
    expect(result.orderedStops[0].pickupId).toBe('p2');
    expect(result.totalDistanceKm).toBeLessThanOrEqual(result.unoptimizedDistanceKm);
  });
});
