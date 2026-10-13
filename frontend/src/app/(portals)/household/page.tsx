'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Recycle,
  Home,
  Package,
  Clock,
  Sparkles,
  Camera,
  Calendar,
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
  Award,
  Bell,
  User,
  Smartphone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrapVisionModal } from '@/components/workflows/ScrapVisionModal';
import { formatINR, formatKg, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { ScrapVisionPrediction } from '@/types';

export default function HouseholdPortalPage() {
  const { user } = useAuthStore();
  const [isVisionOpen, setIsVisionOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<'home' | 'book' | 'bookings' | 'karma' | 'profile'>('home');

  // 6 Materials exact match to mockup
  const materialCatalog = [
    { id: 'plastic', name: 'Plastic', icon: '🥤', rate: 15, unit: 'kg', color: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-200' },
    { id: 'paper', name: 'Paper', icon: '📄', rate: 12, unit: 'kg', color: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-200' },
    { id: 'metal', name: 'Metal', icon: '🥫', rate: 45, unit: 'kg', color: 'from-orange-500/10 to-orange-500/5', border: 'border-orange-200' },
    { id: 'ewaste', name: 'E-Waste', icon: '💻', rate: 60, unit: 'kg', color: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-200' },
    { id: 'glass', name: 'Glass', icon: '🍾', rate: 2, unit: 'kg', color: 'from-teal-500/10 to-teal-500/5', border: 'border-teal-200' },
    { id: 'others', name: 'Others', icon: '📦', rate: 8, unit: 'kg', color: 'from-zinc-500/10 to-zinc-500/5', border: 'border-zinc-200' },
  ];

  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, number>>({
    plastic: 10,
    paper: 15,
  });

  const [timeSlot, setTimeSlot] = useState('Today 2:00 PM - 4:00 PM');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Recent Bookings exact match to mockup
  const [recentBookings, setRecentBookings] = useState([
    {
      id: '#BK00124',
      items: '15 kg Plastic, Paper',
      slot: 'Scheduled Today 2 PM',
      amount: 375,
      status: 'Collector Assigned',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      id: '#BK00123',
      items: '8 kg Metal',
      slot: 'Completed Yesterday',
      amount: 360,
      status: 'Completed',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
  ]);

  const toggleMaterial = (id: string) => {
    setSelectedMaterials((prev) => {
      const next = { ...prev };
      if (next[id] !== undefined) {
        delete next[id];
      } else {
        next[id] = 10;
      }
      return next;
    });
  };

  const updateQuantity = (id: string, qty: number) => {
    setSelectedMaterials((prev) => ({
      ...prev,
      [id]: Math.max(1, qty),
    }));
  };

  const totalEstWeight = Object.entries(selectedMaterials).reduce(
    (acc, [id, qty]) => acc + qty,
    0
  );

  const totalEstPayout = Object.entries(selectedMaterials).reduce((acc, [id, qty]) => {
    const mat = materialCatalog.find((m) => m.id === id);
    return acc + qty * (mat?.rate || 0);
  }, 0);

  const handleBookPickup = () => {
    if (Object.keys(selectedMaterials).length === 0) return;
    const newId = `#BK00${Math.floor(125 + Math.random() * 800)}`;
    const itemsSummary = Object.entries(selectedMaterials)
      .map(([id, qty]) => {
        const mat = materialCatalog.find((m) => m.id === id);
        return `${qty} kg ${mat?.name}`;
      })
      .join(', ');

    const newBooking = {
      id: newId,
      items: itemsSummary,
      slot: timeSlot,
      amount: totalEstPayout,
      status: 'Collector Assigned',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };

    setRecentBookings([newBooking, ...recentBookings]);
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 5000);
  };

  const handleAddFromAi = (pred: ScrapVisionPrediction) => {
    const matchedCategory = materialCatalog.find((m) =>
      pred.categoryName.toLowerCase().includes(m.id)
    ) || materialCatalog[0];

    setSelectedMaterials((prev) => ({
      ...prev,
      [matchedCategory.id]: (prev[matchedCategory.id] || 0) + 12,
    }));
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex">
      {/* 1. Left Dark Forest Sidebar - Exact Match to Mockup Row 2 Panel 1 */}
      <aside className="w-64 bg-forest-900 text-white shrink-0 hidden lg:flex flex-col justify-between p-5 border-r border-forest-950">
        <div className="space-y-8">
          {/* Logo Branding */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-forest-950 flex items-center justify-center font-bold">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-white leading-tight">
                ScrapSetu
              </div>
              <div className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">
                Household Portal
              </div>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'book', label: 'Book Pickup', icon: Package },
              { id: 'bookings', label: 'My Bookings', icon: Clock },
              { id: 'karma', label: 'GreenKarma', icon: Leaf },
              { id: 'profile', label: 'Profile', icon: User },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-forest-950 shadow-md font-extrabold'
                      : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card in Sidebar */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-400 text-forest-950 font-black flex items-center justify-center text-xs">
            PS
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-extrabold text-white truncate">
              {user?.name || 'Priya Sharma'}
            </div>
            <div className="text-[10px] text-zinc-400">Indiranagar, BLR</div>
          </div>
        </div>
      </aside>

      {/* 2. Main Dashboard Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Top Header Greeting Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight flex items-center gap-2">
              <span>Good Morning, Priya!</span>
              <span className="text-2xl">👋</span>
            </h1>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">
              Indiranagar, Bangalore • Verified Household Account
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsVisionOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-forest-900 text-white hover:bg-forest-950 text-xs font-bold shadow-md transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI ScrapVision Scan</span>
            </button>

            <button className="w-9 h-9 rounded-xl bg-white border border-zinc-200 text-zinc-600 flex items-center justify-center shadow-2xs hover:bg-zinc-50">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* GreenKarma Banner Card - Exact Match to Mockup */}
        <div className="bg-gradient-to-r from-emerald-800 via-forest-900 to-forest-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-emerald-700/40 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                  GreenKarma Citizen Rewards
                </span>
                <span className="text-xs text-zinc-300 font-semibold">
                  Rank #14 in Indiranagar
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-baseline gap-2">
                <span>1,250 pts</span>
                <span className="text-xs font-bold text-emerald-300">(+200 this month)</span>
              </div>
              <p className="text-xs text-emerald-100/80 max-w-lg">
                150 points to unlock your next <span className="font-bold text-white">Tree Planter Badge</span> and 10% grocery voucher discount.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                className="bg-emerald-400 hover:bg-emerald-300 text-forest-950 font-black text-xs px-5 h-10 shadow-lg"
              >
                Redeem Rewards
              </Button>
            </div>
          </div>
        </div>

        {/* Central Dashboard Grid: Left Book Pickup (2 cols), Right Impact & Recent Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Book a Scrap Pickup (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-zinc-200/80 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-zinc-950 tracking-tight">
                    Book a Scrap Pickup
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Select material categories to request calibrated doorstep pickup.
                  </p>
                </div>
                <div className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Est: {formatINR(totalEstPayout)}
                </div>
              </div>

              {/* 6 Material Cards Grid - Exact Match to Mockup */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {materialCatalog.map((mat) => {
                  const isSelected = selectedMaterials[mat.id] !== undefined;
                  const qty = selectedMaterials[mat.id] || 0;
                  return (
                    <div
                      key={mat.id}
                      onClick={() => toggleMaterial(mat.id)}
                      className={`cursor-pointer rounded-2xl p-3.5 border transition-all text-center flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                          : 'border-zinc-200 bg-zinc-50/50 hover:bg-white hover:border-zinc-300'
                      }`}
                    >
                      <div className="text-3xl mb-1.5">{mat.icon}</div>
                      <div className="font-extrabold text-xs text-zinc-900">{mat.name}</div>
                      <div className="text-[11px] font-bold text-zinc-500 font-mono mt-0.5">
                        ₹{mat.rate}/{mat.unit}
                      </div>

                      {isSelected ? (
                        <div
                          className="mt-2.5 flex items-center justify-between bg-white rounded-xl border border-emerald-300 p-1 text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => updateQuantity(mat.id, qty - 5)}
                            className="w-6 h-6 rounded-lg bg-zinc-100 hover:bg-zinc-200 font-bold text-zinc-700 flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="font-mono font-bold text-zinc-900">{qty}kg</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(mat.id, qty + 5)}
                            className="w-6 h-6 rounded-lg bg-emerald-100 hover:bg-emerald-200 font-bold text-forest-900 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <div className="mt-2 text-[10px] text-zinc-400 font-semibold">
                          Click to add
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Slot and Schedule Selector */}
              <div className="space-y-3 pt-2 border-t border-zinc-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="w-full sm:w-auto">
                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      Preferred Pickup Slot
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl font-bold text-zinc-800 text-xs w-full sm:w-64"
                    >
                      <option value="Today 2:00 PM - 4:00 PM">Today 2:00 PM - 4:00 PM</option>
                      <option value="Tomorrow 9:00 AM - 12:00 PM">Tomorrow 9:00 AM - 12:00 PM</option>
                      <option value="Tomorrow 3:00 PM - 6:00 PM">Tomorrow 3:00 PM - 6:00 PM</option>
                    </select>
                  </div>

                  <div className="text-right w-full sm:w-auto">
                    <div className="text-[11px] text-zinc-400">Total Weight Est.</div>
                    <div className="text-sm font-black text-zinc-900 font-mono">
                      {totalEstWeight} kg
                    </div>
                  </div>
                </div>

                {bookingSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Pickup booked successfully! Ramesh Kumar has been assigned.</span>
                  </div>
                )}

                <Button
                  onClick={handleBookPickup}
                  disabled={totalEstWeight === 0}
                  className="w-full bg-forest-900 hover:bg-forest-950 text-white font-bold h-12 rounded-2xl shadow-md text-xs flex items-center justify-center gap-2"
                >
                  <span>Continue to Confirm Pickup</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Recent Bookings List - Exact Match to Mockup */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-zinc-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-zinc-950 tracking-tight">
                  Recent Bookings
                </h3>
                <span className="text-xs text-zinc-400 font-medium">History</span>
              </div>

              <div className="space-y-3">
                {recentBookings.map((bk) => (
                  <div
                    key={bk.id}
                    className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white transition-all shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-zinc-950">
                          {bk.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${bk.statusColor}`}
                        >
                          {bk.status}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-zinc-700">{bk.items}</div>
                      <div className="text-[11px] text-zinc-400">{bk.slot}</div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                      <div className="text-xs font-mono font-black text-forest-900">
                        ₹{bk.amount}
                      </div>
                      <Link
                        href="/passport/RCP-2026-DEL-0894"
                        className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <span>Passport</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Estimated Impact & Phone Mockup Dock (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Estimated Impact Wave Card - Exact Match to Mockup */}
            <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-forest-900 text-white rounded-3xl p-6 shadow-xl border border-emerald-500/30 relative overflow-hidden">
              <div className="space-y-2 relative z-10">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                  Estimated Environmental Impact
                </div>
                <div className="text-3xl font-black text-white font-mono">
                  12.5 kg CO₂ saved
                </div>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  Your recycled waste this month prevented toxic methane release and preserved natural virgin resource extraction.
                </p>

                <div className="pt-4 grid grid-cols-2 gap-3 border-t border-white/20">
                  <div className="bg-white/10 rounded-xl p-2.5">
                    <div className="text-lg font-black font-mono">3 Trees</div>
                    <div className="text-[10px] text-emerald-100">Equiv. Preserved</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-2.5">
                    <div className="text-lg font-black font-mono">48 kWh</div>
                    <div className="text-[10px] text-emerald-100">Energy Conserved</div>
                  </div>
                </div>
              </div>

              {/* Decorative SVG Wave Graph */}
              <div className="mt-4 pt-2">
                <svg className="w-full h-16 text-emerald-300/40" viewBox="0 0 300 60" fill="none">
                  <path
                    d="M0 45 C 50 10, 100 50, 150 20 C 200 -10, 250 40, 300 15 L 300 60 L 0 60 Z"
                    fill="currentColor"
                  />
                  <path
                    d="M0 45 C 50 10, 100 50, 150 20 C 200 -10, 250 40, 300 15"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Smartphone Booking Mockup - Exact Match to Mockup Board Left Column */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-zinc-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-forest-900" />
                  <span className="text-xs font-extrabold uppercase text-zinc-900">
                    ScrapSetu Mobile View
                  </span>
                </div>
                <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full font-mono font-bold">
                  iOS / Android PWA
                </span>
              </div>

              {/* Realistic Phone Bezel Frame */}
              <div className="mx-auto w-[240px] rounded-[36px] bg-zinc-900 p-3 shadow-2xl border-4 border-zinc-800">
                {/* Phone Speaker / Dynamic Island */}
                <div className="mx-auto w-16 h-3.5 bg-black rounded-full mb-2 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800/80 mr-2" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-900/40" />
                </div>

                {/* Inner Phone Screen Content */}
                <div className="bg-[#f8f9fa] rounded-[24px] p-3 text-[10px] space-y-2.5 overflow-hidden">
                  <div className="flex items-center justify-between text-zinc-700 font-bold border-b border-zinc-200 pb-1">
                    <span>9:41</span>
                    <span className="text-emerald-700 font-extrabold">ScrapSetu</span>
                    <span>5G 100%</span>
                  </div>

                  <div className="bg-forest-900 text-white rounded-xl p-2 space-y-1">
                    <div className="text-[9px] text-emerald-400 font-bold">Pick Up at:</div>
                    <div className="font-bold text-[10px] truncate">12th Main, Indiranagar</div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="bg-emerald-100/70 border border-emerald-300 rounded-lg p-1.5">
                      <div className="text-sm">🥤</div>
                      <div className="font-extrabold text-[8px]">Plastic</div>
                      <div className="text-[7px] text-zinc-500">₹15/kg</div>
                    </div>
                    <div className="bg-emerald-100/70 border border-emerald-300 rounded-lg p-1.5">
                      <div className="text-sm">📄</div>
                      <div className="font-extrabold text-[8px]">Paper</div>
                      <div className="text-[7px] text-zinc-500">₹12/kg</div>
                    </div>
                    <div className="bg-zinc-100 rounded-lg p-1.5">
                      <div className="text-sm">🥫</div>
                      <div className="font-extrabold text-[8px]">Metal</div>
                      <div className="text-[7px] text-zinc-500">₹45/kg</div>
                    </div>
                  </div>

                  <div className="bg-zinc-100 rounded-xl p-2 text-center">
                    <div className="text-[8px] text-zinc-500">Est. Payout</div>
                    <div className="text-xs font-black text-forest-900">₹375.00</div>
                  </div>

                  <div className="w-full py-1.5 bg-forest-900 text-white rounded-xl font-bold text-center text-[9px]">
                    Confirm Pickup (Tap)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ScrapVision Modal for AI Scanning */}
      <ScrapVisionModal
        isOpen={isVisionOpen}
        onClose={() => setIsVisionOpen(false)}
        onAcceptPrediction={handleAddFromAi}
      />
    </div>
  );
}
