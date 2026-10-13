'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  MapPin,
  TrendingUp,
  Scale,
  Leaf,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent } from '../../../components/ui/card';
import { ScrapVisionModal } from '../../../components/workflows/ScrapVisionModal';
import { MapLibreMap } from '../../../components/maps/MapLibreMap';
import { formatINR, formatKg, formatDate } from '../../../lib/utils';
import { useAuthStore } from '../../../store/authStore';
import { ScrapVisionPrediction } from '../../../types';

export default function HouseholdPortalPage() {
  const { user } = useAuthStore();
  const [isVisionOpen, setIsVisionOpen] = useState(false);

  // Booking items
  const [items, setItems] = useState([
    { categoryId: 'cat-paper', name: 'Paper & Cardboard', estimatedQty: 25, unit: 'kg', rate: 14.0 },
    { categoryId: 'cat-plastic', name: 'Rigid Plastics (PET)', estimatedQty: 10, unit: 'kg', rate: 18.5 },
  ]);
  const [slot, setSlot] = useState('Morning (9 AM - 12 PM)');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Active / recent pickups
  const [pickups, setPickups] = useState([
    {
      id: 'REQ-101',
      materials: 'Paper & Cardboard (25kg), PET Plastics (10kg)',
      estWeight: 35.0,
      estVal: 535.0,
      slot: 'Morning (9 AM - 12 PM)',
      status: 'OPEN',
      collector: null,
      date: 'Today, 2026-10-14',
    },
    {
      id: 'REC-2026-JP-00192',
      materials: 'Heavy Scrap Iron (42.5kg)',
      estWeight: 42.5,
      estVal: 1275.0,
      slot: 'Afternoon (12 PM - 3 PM)',
      status: 'COMPLETED',
      collector: 'Ramkishan Sahu (Verified Kabadiwala)',
      date: '2026-10-09',
    },
  ]);

  const totalEstWeight = items.reduce((acc, it) => acc + it.estimatedQty, 0);
  const totalEstVal = items.reduce((acc, it) => acc + it.estimatedQty * it.rate, 0);

  const handleAddCategoryFromAi = (pred: ScrapVisionPrediction) => {
    setItems((prev) => [
      ...prev,
      {
        categoryId: pred.categorySlug,
        name: pred.categoryName,
        estimatedQty: 15,
        unit: 'kg',
        rate: (pred.estimatedPriceRange.min + pred.estimatedPriceRange.max) / 2,
      },
    ]);
  };

  const handleBookPickup = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `REQ-${Math.floor(100 + Math.random() * 900)}`;
    const newReq = {
      id: newId,
      materials: items.map((i) => `${i.name} (${i.estimatedQty}kg)`).join(', '),
      estWeight: totalEstWeight,
      estVal: totalEstVal,
      slot,
      status: 'OPEN',
      collector: null,
      date: 'Scheduled for Tomorrow',
    };
    setPickups((prev) => [newReq, ...prev]);
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-forest-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-6 border border-emerald-800/80">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <span>🏠 Verified Household Generator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Pooja Verma'}!
          </h1>
          <p className="text-xs text-emerald-200/90 flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pickup Address: B-142, Malviya Nagar Sector 3, Jaipur (302017)</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
            <div className="text-xl font-extrabold text-amber-300">450 Pts</div>
            <div className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">
              Green Karma
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
            <div className="text-xl font-extrabold text-white">77.5 kg</div>
            <div className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">
              Total Diverted
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Scrap Booking Flow + Map / Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visual Booking Form */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-stone-900">Schedule Doorstep Scrap Pickup</h2>
                  <p className="text-xs text-stone-500 font-medium">
                    Select material types, estimate quantities, and view live Mandi price calculation
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="gold"
                  type="button"
                  onClick={() => setIsVisionOpen(true)}
                  className="text-xs font-bold"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-stone-900" />
                  <span>Scan with ScrapVision™ AI</span>
                </Button>
              </div>

              {bookingSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Pickup scheduled successfully! Broadcasted to nearest verified collectors in Malviya Nagar.</span>
                </div>
              )}

              <form onSubmit={handleBookPickup} className="space-y-6">
                {/* Material Item Rows */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-stone-800 block">
                    Scrap Categories & Estimated Weights:
                  </label>
                  {items.map((it, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/90 flex flex-wrap items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-bold text-stone-900">{it.name}</span>
                        <span className="text-stone-500 ml-2 font-mono">(@ ₹{it.rate}/kg)</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="1"
                            value={it.estimatedQty}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              setItems((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, estimatedQty: v } : item))
                              );
                            }}
                            className="w-16 p-2 rounded-xl border border-stone-300 bg-white text-center font-bold"
                          />
                          <span className="text-stone-500 font-semibold">kg</span>
                        </div>
                        <span className="font-extrabold text-emerald-900 w-20 text-right">
                          {formatINR(it.estimatedQty * it.rate)}
                        </span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-stone-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      setItems((prev) => [
                        ...prev,
                        { categoryId: 'cat-metal', name: 'Scrap Iron (Heavy)', estimatedQty: 10, unit: 'kg', rate: 30.0 },
                      ])
                    }
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 p-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Another Waste Category</span>
                  </button>
                </div>

                {/* Pickup Slot Chooser */}
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-2">
                    Preferred Time Slot:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      'Morning (9 AM - 12 PM)',
                      'Afternoon (12 PM - 3 PM)',
                      'Evening (3 PM - 6 PM)',
                    ].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSlot(s)}
                        className={`p-3 rounded-xl border text-center font-bold transition-all ${
                          slot === s
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ScrapRate Valuation Summary Box */}
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950">
                      Total Estimated Value (ScrapRate™):
                    </span>
                    <span className="text-xl font-black text-emerald-950">
                      {formatINR(totalEstVal)}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 leading-relaxed">
                    Based on North India Mandi baseline rates. Actual payout determined at doorstep with digital scale inspection.
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full text-xs font-bold py-3.5">
                  Confirm & Broadcast Scrap Pickup Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Active Jobs & GIS Radar Map */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Job Tracker */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-900 text-sm">Your Pickup Requests</h3>
                <span className="text-xs text-stone-500">{pickups.length} Records</span>
              </div>

              <div className="space-y-3">
                {pickups.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 font-mono">{p.id}</span>
                      <Badge variant={p.status === 'COMPLETED' ? 'success' : 'warning'}>
                        {p.status}
                      </Badge>
                    </div>

                    <div className="font-semibold text-stone-700">{p.materials}</div>

                    <div className="flex items-center justify-between text-stone-500 text-[11px] pt-1">
                      <span>{p.slot}</span>
                      <span className="font-extrabold text-emerald-800">{formatINR(p.estVal)}</span>
                    </div>

                    {p.status === 'COMPLETED' && (
                      <Link
                        href={`/passport/${p.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline pt-1"
                      >
                        <span>View Waste Passport™ QR</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Map Section */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <h4 className="font-bold text-stone-900 text-xs px-2 pt-2">
                Neighborhood Collector Radar
              </h4>
              <MapLibreMap
                center={[26.8524, 75.8173]}
                pickups={[
                  { id: 'p1', lat: 26.8524, lng: 75.8173, title: 'Your Residence', weightKg: 35.0, status: 'OPEN' },
                  { id: 'p2', lat: 26.8501, lng: 75.8155, title: 'Ramkishan Sahu (Collector)', weightKg: 25.0, status: 'ASSIGNED', distanceKm: 0.8 },
                ]}
                className="h-60 rounded-2xl"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ScrapVision Modal */}
      <ScrapVisionModal
        isOpen={isVisionOpen}
        onClose={() => setIsVisionOpen(false)}
        onConfirmCategory={handleAddCategoryFromAi}
      />
    </div>
  );
}
