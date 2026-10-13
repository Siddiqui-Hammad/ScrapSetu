'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Compass, Layers } from 'lucide-react';
import { RouteStop } from '../../types';

interface MapProps {
  center?: [number, number]; // [lat, lng]
  zoom?: number;
  pickups?: Array<{
    id: string;
    lat: number;
    lng: number;
    title: string;
    weightKg: number;
    status: string;
    distanceKm?: number;
  }>;
  routeStops?: RouteStop[];
  onSelectPickup?: (id: string) => void;
  className?: string;
}

export const MapLibreMap: React.FC<MapProps> = ({
  center = [26.8524, 75.8173],
  pickups = [],
  routeStops = [],
  onSelectPickup,
  className = 'h-96 w-full rounded-2xl overflow-hidden border border-stone-200',
}) => {
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  // Approximate relative positioning on interactive styled canvas map
  const minLat = 26.75;
  const maxLat = 26.95;
  const minLng = 75.70;
  const maxLng = 75.90;

  const getPosPercent = (lat: number, lng: number) => {
    const x = Math.max(5, Math.min(95, ((lng - minLng) / (maxLng - minLng)) * 100));
    const y = Math.max(5, Math.min(95, (1 - (lat - minLat) / (maxLat - minLat)) * 100));
    return { left: `${x}%`, top: `${y}%` };
  };

  const centerPos = getPosPercent(center[0], center[1]);

  return (
    <div className={`relative bg-stone-100 ${className} select-none`}>
      {/* Map Surface Background with GIS Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/5 via-transparent to-emerald-900/10 pointer-events-none" />

      {/* Top Map HUD Overlay */}
      <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200/80 shadow-xs flex items-center gap-2 text-xs font-semibold text-stone-700">
        <Compass className="h-3.5 w-3.5 text-emerald-700 animate-spin-slow" />
        <span>Jaipur Central Mandi Zone • 26.85°N, 75.81°E</span>
      </div>

      <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-stone-200/80 shadow-xs flex items-center gap-2 text-xs text-stone-600">
        <Layers className="h-3.5 w-3.5 text-stone-500" />
        <span className="font-semibold text-emerald-900">{pickups.length} Open Hotspots</span>
      </div>

      {/* Collector / Center Position Anchor */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
        style={centerPos}
      >
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-emerald-500/25 animate-ping absolute" />
          <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center shadow-lg border-2 border-white text-xs">
            🛺
          </div>
        </div>
      </div>

      {/* TSP Route Polyline SVG Layer */}
      {routeStops.length > 1 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-15">
          <polyline
            points={routeStops
              .map((s) => {
                const pos = getPosPercent(s.lat, s.lng);
                return `${pos.left},${pos.top}`;
              })
              .join(' ')}
            fill="none"
            stroke="#059669"
            strokeWidth="3"
            strokeDasharray="6 4"
            className="animate-pulse"
          />
        </svg>
      )}

      {/* Pickup Pins */}
      {pickups.map((p, idx) => {
        const pos = getPosPercent(p.lat, p.lng);
        const isSelected = selectedPin === p.id;

        return (
          <div
            key={p.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
            style={pos}
            onClick={() => {
              setSelectedPin(p.id);
              if (onSelectPickup) onSelectPickup(p.id);
            }}
          >
            <div className="relative flex flex-col items-center">
              {/* Tooltip / Popup */}
              {isSelected && (
                <div className="absolute bottom-full mb-2 bg-stone-900 text-white p-2.5 rounded-xl shadow-xl border border-stone-700 text-[11px] whitespace-nowrap z-30">
                  <div className="font-bold">{p.title}</div>
                  <div className="text-emerald-300 font-semibold">{p.weightKg} kg estimated</div>
                  {p.distanceKm && <div className="text-stone-400">{p.distanceKm} km away</div>}
                </div>
              )}

              {/* Pin Icon */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md text-xs font-bold transition-transform group-hover:scale-125 ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 ring-2 ring-white scale-110'
                    : 'bg-emerald-700 text-white ring-1 ring-white'
                }`}
              >
                {idx + 1}
              </div>
            </div>
          </div>
        );
      })}

      {/* Bottom Map Legend */}
      <div className="absolute bottom-3 left-3 right-3 z-10 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between text-xs text-stone-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-800" />
            Your Vehicle Location
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            Open Scrap Pickups
          </span>
          {routeStops.length > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-emerald-600 border-t border-dashed" />
              EcoRoute TSP Path
            </span>
          )}
        </div>
        <span className="text-[11px] text-stone-400">MapLibre GL / OpenStreetMap</span>
      </div>
    </div>
  );
};
