import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { ShieldCheck, MapPin, EyeOff } from 'lucide-react';

// Fix default Leaflet icon paths in bundler
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const collectorIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  weightKg?: number;
  isFuzzedForPrivacy?: boolean;
  distanceKm?: number;
  status?: string;
  onClick?: () => void;
}

interface PickupMapProps {
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  points?: MapPoint[];
  collectorPosition?: { lat: number; lng: number; title?: string };
  height?: string;
}

export const PickupMap: React.FC<PickupMapProps> = ({
  centerLat = 26.8524,
  centerLng = 75.8173,
  zoom = 13,
  points = [],
  collectorPosition,
  height = '420px',
}) => {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-sm" style={{ height }}>
      {/* Privacy Notice Banner Overlay */}
      <div className="absolute top-2 right-2 z-20 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg shadow-sm border border-stone-200 text-xs flex items-center gap-1.5 text-stone-700">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Privacy-Protected: Public pins are obfuscated by ~400m radius</span>
      </div>

      <MapContainer
        center={[centerLat, centerLng]}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Collector Current Location */}
        {collectorPosition && (
          <Marker
            position={[collectorPosition.lat, collectorPosition.lng]}
            icon={collectorIcon}
          >
            <Popup>
              <div className="text-xs p-1">
                <span className="font-bold text-emerald-800 block text-sm">
                  {collectorPosition.title || 'Your Current Hub / Location'}
                </span>
                <span className="text-stone-500">Live GPS Hub Coords</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Pickup Location Markers */}
        {points.map((point) => (
          <React.Fragment key={point.id}>
            <Marker position={[point.lat, point.lng]} icon={defaultIcon}>
              <Popup>
                <div className="text-xs p-1.5 max-w-[200px]">
                  <div className="font-bold text-stone-900 text-sm">{point.title}</div>
                  {point.subtitle && (
                    <div className="text-stone-600 mt-0.5">{point.subtitle}</div>
                  )}
                  {point.weightKg && (
                    <div className="mt-1 font-semibold text-emerald-700">
                      Est. Weight: {point.weightKg} kg
                    </div>
                  )}
                  {point.distanceKm !== undefined && (
                    <div className="text-stone-500">
                      Approx: {point.distanceKm} km away
                    </div>
                  )}
                  {point.isFuzzedForPrivacy && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 p-1 rounded">
                      <EyeOff className="w-3 h-3 shrink-0" />
                      <span>Address obfuscated until accepted</span>
                    </div>
                  )}
                  {point.onClick && (
                    <button
                      onClick={point.onClick}
                      className="mt-2 w-full py-1 text-center bg-emerald-700 hover:bg-emerald-800 text-white rounded font-medium text-xs transition-colors"
                    >
                      View Details
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>

            {/* If location is fuzzed for privacy, render subtle visual fuzzy radius circle */}
            {point.isFuzzedForPrivacy && (
              <Circle
                center={[point.lat, point.lng]}
                radius={400}
                pathOptions={{
                  color: '#10b981',
                  fillColor: '#10b981',
                  fillOpacity: 0.12,
                  dashArray: '4, 4',
                }}
              />
            )}
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};
