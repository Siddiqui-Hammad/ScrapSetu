'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Camera,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Scale,
  ArrowRight,
  TrendingUp,
  Leaf,
  Plus,
  Trash2,
  QrCode,
  ShieldCheck,
  Truck,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { ScrapVisionModal } from '../../../components/workflows/ScrapVisionModal';
import { MapLibreMap } from '../../../components/maps/MapLibreMap';
import { formatINR, formatKg, formatDate } from '../../../lib/utils';
import { useAuthStore } from '../../../store/authStore';
import { ScrapVisionPrediction } from '../../../types';

export default function HouseholdPortalPage() {
  const { user } = useAuthStore();
  const [isVisionOpen, setIsVisionOpen] = useState(false);

  // Guided Multi-Step Wizard State (1 = Material Selection, 2 = Weight & Estimate, 3 = Schedule Slot)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Selected materials
  const [selectedMaterials, setSelectedMaterials] = useState<
    Array<{ id: string; name: string; rate: number; estQty: number; unit: string }>
  >([
    { id: 'cat-paper', name: 'Kraft Carton & Paper', rate: 15.5, estQty: 25, unit: 'kg' },
    { id: 'cat-plastic', name: 'PET Bottles & Plastic', rate: 28.0, estQty: 10, unit: 'kg' },
  ]);

  const [address, setAddress] = useState('Flat 402, Block C, South Extension II, New Delhi');
  const [pincode, setPincode] = useState('110049');
  const [timeSlot, setTimeSlot] = useState('Morning (9 AM - 12 PM)');
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);

  // Active Pickups & History
  const [activeBookings, setActiveBookings] = useState([
    {
      id: 'REQ-101',
      materials: 'Kraft Carton (25kg), PET Plastics (10kg)',
      estWeight: 35.0,
      estVal: 667.5,
      timeSlot: 'Morning (9 AM - 12 PM)',
      status: 'OPEN',
      collector: null,
      step: 1, // 1: Booked, 2: Assigned, 3: In Transit, 4: Settled
      date: 'Today, Oct 14',
    },
    {
      id: 'RCP-2026-DEL-0894',
      materials: 'Heavy Scrap Iron & Appliances (42.5kg)',
      estWeight: 42.5,
      estVal: 1445.0,
      timeSlot: 'Completed',
      status: 'COMPLETED',
      collector: 'Ramu Paswan (Kavach Certified)',
      step: 4,
      date: 'Oct 10, 2026',
      receiptHash: '9e7b28fc083a3d5b0018a1a310bb2447d25e0a9437d8fca02d13bb22283a0058',
    },
  ]);

  const totalEstWeight = selectedMaterials.reduce((acc, it) => acc + it.estQty, 0);
  const totalEstPayout = selectedMaterials.reduce((acc, it) => acc + it.estQty * it.rate, 0);
  const co2Mitigated = (totalEstWeight * 1.65).toFixed(1);

  const quickMaterialPresets = [
    { id: 'cat-paper', name: 'Kraft Carton & Paper', rate: 15.5, defaultQty: 20 },
    { id: 'cat-plastic', name: 'PET Bottles & Plastic', rate: 28.0, defaultQty: 10 },
    { id: 'cat-iron', name: 'Heavy Structural Iron', rate: 34.0, defaultQty: 15 },
    { id: 'cat-copper', name: 'Copper Wire & Cables', rate: 685.0, defaultQty: 5 },
    { id: 'cat-brass', name: 'Brass / Pital Utensils', rate: 460.0, defaultQty: 4 },
    { id: 'cat-ewaste', name: 'E-Waste & Electronics', rate: 135.0, defaultQty: 8 },
  ];

  const handleToggleMaterial = (preset: typeof quickMaterialPresets[0]) => {
    const existing = selectedMaterials.find((m) => m.id === preset.id);
    if (existing) {
      if (selectedMaterials.length > 1) {
        setSelectedMaterials(selectedMaterials.filter((m) => m.id !== preset.id));
      }
    } else {
      setSelectedMaterials([
        ...selectedMaterials,
        { id: preset.id, name: preset.name, rate: preset.rate, estQty: preset.defaultQty, unit: 'kg' },
      ]);
    }
  };

  const handleAddFromAi = (pred: ScrapVisionPrediction) => {
    setSelectedMaterials((prev) => [
      ...prev,
      {
        id: `ai-${Date.now()}`,
        name: pred.categoryName,
        rate: (pred.estimatedPriceRange.min + pred.estimatedPriceRange.max) / 2,
        estQty: 15,
        unit: 'kg',
      },
    ]);
  };

  const handleConfirmBooking = () => {
    const newId = `REQ-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = {
      id: newId,
      materials: selectedMaterials.map((m) => `${m.name} (${m.estQty}kg)`).join(', '),
      estWeight: totalEstWeight,
      estVal: totalEstPayout,
      timeSlot,
      status: 'OPEN',
      collector: null,
      step: 1,
      date: 'Scheduled for Tomorrow',
    };
    setActiveBookings([newOrder, ...activeBookings]);
    setIsBookingSuccess(true);
    setCurrentStep(1);
    setTimeout(() => setIsBookingSuccess(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Header & Quick Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
            Residential Scrap Dispatch Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
            Sell Recyclables from Home
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Verified doorstep collection with calibrated digital scales and direct UPI settlement.
          </p>
        </div>

        {/* Lifetime Personal Impact Counter */}
        <div className="flex items-center gap-6 text-right shrink-0 bg-white p-3.5 rounded-2xl border border-zinc-200 shadow-2xs">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Recycled</div>
            <div className="text-lg font-black text-forest-900 font-mono">77.5 kg</div>
          </div>
          <div className="border-l border-zinc-100 pl-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Payout</div>
            <div className="text-lg font-black text-emerald-700 font-mono">₹2,112.50</div>
          </div>
          <div className="border-l border-zinc-100 pl-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">CO₂ Avoided</div>
            <div className="text-lg font-black text-forest-900 font-mono">116.2 kg</div>
          </div>
        </div>
      </div>

      {isBookingSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-forest-950 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Pickup order scheduled successfully! Assigned to nearest verified Kabadiwala.</span>
          </div>
          <span className="font-mono text-emerald-800">REF: REQ-CONFIRMED</span>
        </div>
      )}

      {/* 2. Main Two-Column Layout: Guided Booking Flow vs Active Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Guided 3-Step Booking Wizard */}
        <div className="lg:col-span-7 space-y-6">
          <div className="circular-card p-6 bg-white space-y-6">
            {/* Step Navigation Bar */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                    currentStep === 1
                      ? 'bg-forest-900 text-white'
                      : 'bg-emerald-100 text-forest-900'
                  }`}
                >
                  1
                </span>
                <span className={`text-xs font-bold ${currentStep === 1 ? 'text-zinc-950' : 'text-zinc-400'}`}>
                  Materials
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                    currentStep === 2
                      ? 'bg-forest-900 text-white'
                      : 'bg-emerald-100 text-forest-900'
                  }`}
                >
                  2
                </span>
                <span className={`text-xs font-bold ${currentStep === 2 ? 'text-zinc-950' : 'text-zinc-400'}`}>
                  Valuation
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                    currentStep === 3
                      ? 'bg-forest-900 text-white'
                      : 'bg-emerald-100 text-forest-900'
                  }`}
                >
                  3
                </span>
                <span className={`text-xs font-bold ${currentStep === 3 ? 'text-zinc-950' : 'text-zinc-400'}`}>
                  Time Slot
                </span>
              </div>

              <button
                onClick={() => setIsVisionOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-forest-900 hover:bg-emerald-100 border border-emerald-200/80 text-xs font-bold transition-all shadow-2xs"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI Photo Scan</span>
              </button>
            </div>

            {/* STEP 1: Material Selection */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-950">
                    Step 1: Select Scrap Categories in Your Household
                  </h3>
                  <span className="text-[11px] text-zinc-500">Tap to toggle</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {quickMaterialPresets.map((preset) => {
                    const isSelected = selectedMaterials.some((m) => m.id === preset.id);
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleToggleMaterial(preset)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-500 ring-1 ring-emerald-500 shadow-2xs'
                            : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100/60'
                        }`}
                      >
                        <div className="font-bold text-xs text-zinc-950">{preset.name}</div>
                        <div className="text-[11px] text-emerald-700 font-mono font-semibold mt-0.5">
                          ₹{preset.rate}/kg
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setCurrentStep(2)}
                    className="font-bold text-xs"
                  >
                    Next: Estimate Quantities
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: Quantity & Valuation */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-950">
                    Step 2: Adjust Estimated Quantities (kg)
                  </h3>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-emerald-700 font-semibold hover:underline"
                  >
                    ← Edit Categories
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedMaterials.map((mat, idx) => (
                    <div
                      key={mat.id}
                      className="flex items-center justify-between gap-4 p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs"
                    >
                      <div className="flex-1">
                        <div className="font-bold text-zinc-950">{mat.name}</div>
                        <div className="text-zinc-500 text-[11px]">Benchmark: ₹{mat.rate}/kg</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="1"
                            max="250"
                            value={mat.estQty}
                            onChange={(e) => {
                              const val = Math.max(1, Number(e.target.value));
                              const updated = [...selectedMaterials];
                              updated[idx].estQty = val;
                              setSelectedMaterials(updated);
                            }}
                            className="w-16 px-2 py-1 bg-white border border-zinc-300 rounded-lg text-center font-mono font-bold text-xs"
                          />
                          <span className="text-zinc-500 font-medium">kg</span>
                        </div>

                        <div className="w-20 text-right font-mono font-bold text-forest-900">
                          {formatINR(mat.estQty * mat.rate)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculation Summary Box */}
                <div className="bg-forest-950 text-white p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-emerald-200">Net Estimated Doorstep Payout:</span>
                    <span className="text-2xl font-black font-mono text-emerald-300">
                      {formatINR(totalEstPayout)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-300 pt-1 border-t border-emerald-900/60">
                    <span>Total Weight: {totalEstWeight} kg</span>
                    <span className="text-emerald-400 font-semibold">{co2Mitigated} kg CO₂ Mitigated</span>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} className="text-xs">
                    Back
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => setCurrentStep(3)} className="font-bold text-xs">
                    Next: Choose Pickup Window
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Slot & Confirmation */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-sm font-bold text-zinc-950">
                  Step 3: Confirm Address & Preferred Arrival Window
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Doorstep Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-xl bg-white font-medium focus:ring-2 focus:ring-forest-900 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-zinc-700 mb-1">Postal Pincode</label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-xl bg-white font-mono font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-zinc-700 mb-1">Preferred Time Window</label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-xl bg-white font-medium"
                      >
                        <option>Morning (9 AM - 12 PM)</option>
                        <option>Afternoon (12 PM - 3 PM)</option>
                        <option>Evening (3 PM - 6 PM)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-[11px] text-forest-950 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    Your doorstep pickup is guaranteed zero-charge. Final price is sealed on the digital scale with calibrated accuracy (±0.05kg).
                  </span>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)} className="text-xs">
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleConfirmBooking}
                    className="font-bold text-xs shadow-md"
                  >
                    Confirm & Dispatch Pickup
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Neighborhood Collector Map Preview */}
          <div className="circular-card p-5 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Collector Coverage Radar
              </span>
              <span className="text-[11px] font-bold text-emerald-700">2 Verified Kabadiwalas Active in Your Ward</span>
            </div>
            <div className="h-48 rounded-xl overflow-hidden border border-zinc-200">
              <MapLibreMap height="100%" interactive={false} />
            </div>
          </div>
        </div>

        {/* Right Column: Active Booking Stepper & Digital Receipts */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Orders Timeline */}
          <div className="circular-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-sm font-bold text-zinc-950">Active Pickup Status</h3>
              <span className="text-[10px] font-mono font-bold bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">
                {activeBookings.filter((b) => b.status === 'OPEN').length} OPEN
              </span>
            </div>

            <div className="space-y-4">
              {activeBookings.map((booking) => {
                const isOpen = booking.status === 'OPEN';
                return (
                  <div
                    key={booking.id}
                    className={`p-4 rounded-xl border text-xs space-y-3 ${
                      isOpen
                        ? 'bg-white border-emerald-300 ring-1 ring-emerald-200 shadow-2xs'
                        : 'bg-zinc-50 border-zinc-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-zinc-950">{booking.id}</div>
                        <div className="text-zinc-500 text-[11px] mt-0.5">{booking.materials}</div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono ${
                          isOpen ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-forest-900'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    {/* Progress Stepper */}
                    <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-400 pt-1">
                      <span className={booking.step >= 1 ? 'text-forest-900 font-bold' : ''}>1. Booked</span>
                      <span>→</span>
                      <span className={booking.step >= 2 ? 'text-forest-900 font-bold' : ''}>2. Assigned</span>
                      <span>→</span>
                      <span className={booking.step >= 3 ? 'text-forest-900 font-bold' : ''}>3. Weighed</span>
                      <span>→</span>
                      <span className={booking.step >= 4 ? 'text-forest-900 font-bold' : ''}>4. Settled</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[11px]">
                      <span className="font-bold text-zinc-900">
                        Est. Payout: <span className="font-mono">{formatINR(booking.estVal)}</span>
                      </span>
                      {booking.receiptHash ? (
                        <Link
                          href={`/passport/${booking.id}`}
                          className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <QrCode className="w-3 h-3" />
                          <span>View Passport</span>
                        </Link>
                      ) : (
                        <span className="text-zinc-400">{booking.timeSlot}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ScrapVision Modal Integration */}
      <ScrapVisionModal
        isOpen={isVisionOpen}
        onClose={() => setIsVisionOpen(false)}
        onConfirmPrediction={handleAddFromAi}
      />
    </div>
  );
}
