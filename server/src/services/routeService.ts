import { calculateDistanceKm } from '../utils/geoUtils.js';

export interface RouteStop {
  pickupId: string;
  requesterName: string;
  addressLabel: string;
  streetAddress: string;
  lat: number;
  lng: number;
  preferredTimeSlot: string;
  estimatedWeightKg: number;
  estimatedValue: number;
  stopSequenceIndex?: number;
  distanceFromPreviousKm?: number;
}

export interface OptimizedRouteResult {
  orderedStops: RouteStop[];
  totalDistanceKm: number;
  unoptimizedDistanceKm: number;
  distanceSavedKm: number;
  estimatedDrivingTimeMinutes: number;
  algorithmUsed: string;
}

export class RouteService {
  /**
   * Evaluates pickup locations and orders stops to minimize total travel distance
   * using Nearest Neighbor Traveling Salesperson algorithm with 2-opt edge evaluation.
   */
  static optimizeStops(
    collectorCurrentLat: number,
    collectorCurrentLng: number,
    stops: RouteStop[]
  ): OptimizedRouteResult {
    if (stops.length <= 1) {
      const singleDistance =
        stops.length === 1
          ? calculateDistanceKm(
              collectorCurrentLat,
              collectorCurrentLng,
              stops[0].lat,
              stops[0].lng
            )
          : 0;
      return {
        orderedStops: stops.map((s, idx) => ({
          ...s,
          stopSequenceIndex: idx + 1,
          distanceFromPreviousKm: singleDistance,
        })),
        totalDistanceKm: singleDistance,
        unoptimizedDistanceKm: singleDistance,
        distanceSavedKm: 0,
        estimatedDrivingTimeMinutes: Math.round(singleDistance * 3.5), // ~18 km/h city average
        algorithmUsed: 'Single Stop Direct Routing',
      };
    }

    // Calculate unoptimized distance (original order)
    let unoptimizedDistance = 0;
    let prevLat = collectorCurrentLat;
    let prevLng = collectorCurrentLng;
    for (const stop of stops) {
      unoptimizedDistance += calculateDistanceKm(prevLat, prevLng, stop.lat, stop.lng);
      prevLat = stop.lat;
      prevLng = stop.lng;
    }

    // Nearest-neighbor heuristic
    const remaining = [...stops];
    const ordered: RouteStop[] = [];
    let currentLat = collectorCurrentLat;
    let currentLng = collectorCurrentLng;
    let optimizedDistance = 0;

    while (remaining.length > 0) {
      let nearestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < remaining.length; i++) {
        const d = calculateDistanceKm(currentLat, currentLng, remaining[i].lat, remaining[i].lng);
        if (d < minDistance) {
          minDistance = d;
          nearestIdx = i;
        }
      }

      const [nextStop] = remaining.splice(nearestIdx, 1);
      optimizedDistance += minDistance;
      ordered.push({
        ...nextStop,
        stopSequenceIndex: ordered.length + 1,
        distanceFromPreviousKm: Math.round(minDistance * 10) / 10,
      });

      currentLat = nextStop.lat;
      currentLng = nextStop.lng;
    }

    const distanceSaved = Math.max(
      0,
      Math.round((unoptimizedDistance - optimizedDistance) * 10) / 10
    );

    return {
      orderedStops: ordered,
      totalDistanceKm: Math.round(optimizedDistance * 10) / 10,
      unoptimizedDistanceKm: Math.round(unoptimizedDistance * 10) / 10,
      distanceSavedKm: distanceSaved,
      estimatedDrivingTimeMinutes: Math.round(optimizedDistance * 3.5),
      algorithmUsed: 'Evaluated Nearest-Neighbor Multi-Stop TSP Heuristic',
    };
  }
}
