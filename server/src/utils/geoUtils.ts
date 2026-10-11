/**
 * Geolocation and Privacy Utility Functions
 */

// Earth radius in kilometers
const EARTH_RADIUS_KM = 6371;

/**
 * Calculates great-circle distance between two coordinates using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_KM * c * 10) / 10; // Round to 1 decimal place (e.g. 2.4 km)
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Obfuscates latitude and longitude by adding a deterministic pseudo-random offset
 * (~300m - 500m) to preserve user privacy for open public listings
 * before a request is officially accepted by a collector.
 */
export function fuzzCoordinates(lat: number, lng: number, seedString: string): { fuzzyLat: number; fuzzyLng: number } {
  // Simple deterministic hash to keep coordinates stable per request
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const offsetLat = ((Math.abs(hash % 100) - 50) / 10000); // approx +/- 300-500 meters
  const offsetLng = ((Math.abs((hash >> 4) % 100) - 50) / 10000);

  return {
    fuzzyLat: Math.round((lat + offsetLat) * 10000) / 10000,
    fuzzyLng: Math.round((lng + offsetLng) * 10000) / 10000,
  };
}
