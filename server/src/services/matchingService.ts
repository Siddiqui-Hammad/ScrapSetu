import prisma from '../utils/prisma.js';
import { calculateDistanceKm } from '../utils/geoUtils.js';

export interface MatchedCollector {
  collectorId: string;
  name: string;
  phone: string;
  vehicleType: string | null;
  distanceKm: number;
  matchScore: number; // 0 - 100
  scoreBreakdown: {
    distanceScore: number;
    materialOverlapScore: number;
    reliabilityScore: number;
    capacityScore: number;
  };
  explanation: string;
}

export class MatchingService {
  /**
   * Transparent scoring and ranking model for eligible collectors
   */
  static async findEligibleCollectors(
    pickupLat: number,
    pickupLng: number,
    requestedCategorySlugs: string[],
    estimatedWeightKg: number = 20
  ): Promise<MatchedCollector[]> {
    // 1. Fetch active, verified collectors with profiles and addresses
    const collectors = await prisma.user.findMany({
      where: {
        role: 'COLLECTOR',
        isVerified: true,
      },
      include: {
        profile: true,
        addresses: {
          where: { isDefault: true },
          take: 1,
        },
      },
    });

    const candidates: MatchedCollector[] = [];

    for (const c of collectors) {
      if (!c.profile || !c.profile.isAvailable) continue;

      const address = c.addresses[0];
      if (!address) continue;

      const distanceKm = calculateDistanceKm(pickupLat, pickupLng, address.lat, address.lng);
      const serviceRadius = c.profile.serviceAreaRadiusKm || 8.0;

      // Filter: must be within max operational service radius (with reasonable tolerance)
      if (distanceKm > serviceRadius * 1.5) continue;

      // Accepted categories overlap
      let acceptedSlugs: string[] = [];
      try {
        if (c.profile.acceptedCategories) {
          acceptedSlugs = JSON.parse(c.profile.acceptedCategories);
        }
      } catch {
        acceptedSlugs = [];
      }

      const matchingCategoryCount = requestedCategorySlugs.filter((slug) =>
        acceptedSlugs.includes(slug)
      ).length;

      const materialOverlapRatio =
        requestedCategorySlugs.length > 0
          ? matchingCategoryCount / requestedCategorySlugs.length
          : 1.0;

      // Distance score (closer gets higher score, max 40 points)
      // e.g. 0km = 40pts, 5km = 20pts, 10km+ = 0pts
      const distanceScore = Math.max(0, 40 - (distanceKm / serviceRadius) * 25);

      // Material Overlap score (max 30 points)
      const materialOverlapScore = materialOverlapRatio * 30;

      // Reliability & Rating score (max 20 points)
      // Rating is 1 to 5. 5.0 -> 20pts, 4.0 -> 16pts
      const rating = c.profile.reliabilityRating || 4.5;
      const reliabilityScore = (rating / 5.0) * 20;

      // Capacity & experience score (max 10 points)
      const capacityKg = c.profile.dailyCapacityKg || 100;
      const capacityAdequate = capacityKg >= estimatedWeightKg;
      const completedPickups = c.profile.totalPickupsCompleted || 0;
      const experienceBonus = Math.min(5, completedPickups / 20);
      const capacityScore = (capacityAdequate ? 5 : 2) + experienceBonus;

      const totalScore = Math.round(
        (distanceScore + materialOverlapScore + reliabilityScore + capacityScore) * 10
      ) / 10;

      // Explainable reason
      const reasons: string[] = [];
      reasons.push(`${distanceKm} km away`);
      if (materialOverlapRatio === 1) {
        reasons.push('Accepts all requested materials');
      } else if (matchingCategoryCount > 0) {
        reasons.push(`Accepts ${matchingCategoryCount}/${requestedCategorySlugs.length} materials`);
      }
      reasons.push(`${rating.toFixed(1)}★ rating (${completedPickups} completed pickups)`);
      if (c.profile.vehicleType) {
        reasons.push(`Vehicle: ${c.profile.vehicleType.replace('_', ' ').toLowerCase()}`);
      }

      candidates.push({
        collectorId: c.id,
        name: c.name,
        phone: c.phone,
        vehicleType: c.profile.vehicleType,
        distanceKm,
        matchScore: totalScore,
        scoreBreakdown: {
          distanceScore: Math.round(distanceScore * 10) / 10,
          materialOverlapScore: Math.round(materialOverlapScore * 10) / 10,
          reliabilityScore: Math.round(reliabilityScore * 10) / 10,
          capacityScore: Math.round(capacityScore * 10) / 10,
        },
        explanation: reasons.join(' • '),
      });
    }

    // Sort by match score descending
    return candidates.sort((a, b) => b.matchScore - a.matchScore);
  }
}
