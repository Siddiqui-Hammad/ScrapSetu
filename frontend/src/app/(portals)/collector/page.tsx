'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  Scale,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  QrCode,
  ArrowRight,
  FileText,
  CreditCard,
  Map as MapIcon,
  Sparkles,
  Navigation,
  DollarSign,
  User,
  Recycle,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MapLibreMap } from '@/components/maps/MapLibreMap';
import { TrustWeighModal } from '@/components/workflows/TrustWeighModal';
import { formatINR, formatKg } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export default function CollectorPortalPage() {
  const { user } = useAuthStore();
  const [activeNav, setActiveNav] = useState<'dashboard' | 'jobs' | 'routes' | 'earnings' | 'profile'>('dashboard');
  const [isOnline, setIsOnline] = useState(true);
  const [isWeighModalOpen, setIsWeighModalOpen] = useState(false);
  const [selectedJobForWeigh, setSelectedJobForWeigh] = useState<any>(null);

  // Exact 3 Nearby Jobs matching Mockup Row 2 Panel 2
  const [nearbyJobs, setNearbyJobs] = useState([
    {
      id: 'JOB-001',
      customer: 'Priya Sharma',
      address: '12th Main, Indiranagar',
      distance: '2.1 km',
      materials: '15 kg Plastic & Paper',
      estVal: 375,
      phone: '+91 98765 43210',
      status: 'AVAILABLE', // AVAILABLE, ACCEPTED, COMPLETED
    },
    {
      id: 'JOB-002',
      customer: 'TechCorp Office',
      address: 'Koramangala 4th Block',
      distance: '3.4 km',
      materials: '40 kg E-Waste & Paper',
      estVal: 1200,
      phone: '+91 98110 77007',
      status: 'AVAILABLE',
    },
    {
      id: 'JOB-003',
      customer: 'Amit Patel',
      address: 'HSR Layout Sector 2',
      distance: '5.2 km',
      materials: '25 kg Metal & Glass',
      estVal: 650,
      phone: '+91 98220 99881',
      status: 'AVAILABLE',
    },
  ]);

  // Vehicle Capacity: 320 / 500 kg (64%) exact match to mockup
  const vehicleMax = 500;
  const currentLoad = 320;
  const capacityPct = Math.round((currentLoad / vehicleMax) * 100);

  const handleAcceptJob = (jobId: string) => {
    setNearbyJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'ACCEPTED' } : j))
    );
  };

  const handleStartWeigh = (job: any) => {
    setSelectedJobForWeigh(job);
    setIsWeighModalOpen(true);
  };

  const handleCompleteWeigh = () => {
    if (selectedJobForWeigh) {
      setNearbyJobs((prev) =>
        prev.map((j) =>
          j.id === selectedJobForWeigh.id ? { ...j, status: 'COMPLETED' } : j
        )
      );
    }
    setIsWeighModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#081711] text-zinc-100 flex">
      {/* 1. Left Dark Forest Sidebar */}
      <aside className="w-64 bg-[#05110c] text-white shrink-0 hidden lg:flex flex-col justify-between p-5 border-r border-[#0f291e]">
        <div className="space-y-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-forest-950 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-white leading-tight">
                ScrapSetu
              </div>
              <div className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">
                Collector Portal
              </div>
            </div>
          </Link>

          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Layers },
              { id: 'jobs', label: 'Nearby Jobs', icon: Truck },
              { id: 'routes', label: 'EcoRoute Navigation', icon: Navigation },
              { id: 'earnings', label: 'Earnings & Payouts', icon: DollarSign },
              { id: 'profile', label: 'KYC & License', icon: ShieldCheck },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-forest-950 font-black shadow-md'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Ramesh Status Card in Sidebar */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500 text-forest-950 font-black flex items-center justify-center text-xs">
            RK
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-extrabold text-white truncate">
              {user?.name || 'Ramesh Kumar'}
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>3-Point KYC Verified</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Dark Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Top Header: "Good Morning, Ramesh! 🚚" + Online Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0f291e]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Good Morning, Ramesh!</span>
              <span className="text-2xl">🚚</span>
            </h1>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              E-Rickshaw Loader DL 1 ER 4921 • Indiranagar Hub
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#0c2219] border border-emerald-500/30 px-3 py-1.5 rounded-xl">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'
                }`}
              />
              <span className="text-xs font-bold text-emerald-300">
                {isOnline ? 'Online for Pickups' : 'Offline'}
              </span>
              <button
                onClick={() => setIsOnline(!isOnline)}
                className="ml-2 text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded font-mono font-bold"
              >
                Toggle
              </button>
            </div>

            <Button
              size="sm"
              onClick={() => handleStartWeigh(nearbyJobs[0])}
              className="bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-black text-xs px-4"
            >
              <Scale className="w-3.5 h-3.5 mr-1.5" />
              <span>TrustWeigh Scale</span>
            </Button>
          </div>
        </div>

        {/* Top Stats Cards Row: Earnings & Capacity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Today's Earnings Card - Exact Match to Mockup */}
          <div className="bg-[#0c2219] rounded-3xl p-5 border border-emerald-500/30 shadow-lg flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-bold text-emerald-400 tracking-wider">
                Today&apos;s Earnings
              </span>
              <div className="text-3xl font-black text-white font-mono">
                ₹1,250
              </div>
              <div className="text-xs text-zinc-400 flex items-center gap-2 pt-1">
                <span>Completed Pickups: <strong className="text-white">4</strong></span>
                <span>•</span>
                <span>Green Credits: <strong className="text-emerald-400">85</strong></span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Vehicle Capacity: 320 / 500 kg (64%) - Exact Match to Mockup */}
          <div className="bg-[#0c2219] rounded-3xl p-5 border border-emerald-500/30 shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span className="text-zinc-200">Vehicle Capacity:</span>
              </div>
              <span className="text-emerald-400 font-mono font-extrabold">
                {currentLoad} / {vehicleMax} kg ({capacityPct}%)
              </span>
            </div>

            <div className="w-full bg-zinc-900 rounded-full h-3.5 p-0.5 overflow-hidden border border-emerald-950">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${capacityPct}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Payload: 180 kg remaining</span>
              <span className="text-emerald-300 font-semibold">Drop-off planned at EcoTransform #04</span>
            </div>
          </div>
        </div>

        {/* Central Operational Grid: Left Nearby Jobs (3), Right EcoRoute Map Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Nearby Jobs (3) - Exact Match to Mockup */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <h2 className="text-lg font-black text-white tracking-tight">
                  Nearby Jobs (3)
                </h2>
              </div>
              <span className="text-xs text-zinc-400">Instant Accept Enabled</span>
            </div>

            <div className="space-y-3">
              {nearbyJobs.map((job) => {
                const isAccepted = job.status === 'ACCEPTED';
                const isDone = job.status === 'COMPLETED';

                return (
                  <div
                    key={job.id}
                    className={`rounded-2xl p-4 border transition-all ${
                      isDone
                        ? 'bg-[#081711] border-zinc-800 opacity-60'
                        : isAccepted
                        ? 'bg-[#0e2c20] border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                        : 'bg-[#0c2219] border-emerald-500/20 hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-sm text-white">
                            {job.customer}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-white/10 text-emerald-300 text-[10px] font-mono font-bold">
                            {job.distance}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-300 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{job.address}</span>
                        </div>
                        <div className="text-xs font-semibold text-emerald-200">
                          {job.materials}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[10px] text-zinc-400">Est. Payout</div>
                        <div className="text-base font-black text-white font-mono">
                          ₹{job.estVal}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <a
                        href={`tel:${job.phone}`}
                        className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-semibold"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Customer</span>
                      </a>

                      <div className="flex items-center gap-2">
                        {isDone ? (
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                          </span>
                        ) : isAccepted ? (
                          <Button
                            size="sm"
                            onClick={() => handleStartWeigh(job)}
                            className="bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-black text-xs px-3"
                          >
                            <Scale className="w-3.5 h-3.5 mr-1" />
                            Weigh Scrap
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleAcceptJob(job.id)}
                            className="bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-black text-xs px-4"
                          >
                            Accept Job
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Route Map & EcoRoute TSP Widget - Exact Match to Mockup */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400" />
                <h2 className="text-lg font-black text-white tracking-tight">
                  EcoRoute Optimization
                </h2>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                TSP Engine Active
              </span>
            </div>

            <div className="bg-[#0c2219] rounded-3xl p-5 border border-emerald-500/30 shadow-lg space-y-4">
              {/* Route Summary Pill */}
              <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/20 flex items-center justify-between text-xs font-bold">
                <div className="space-y-0.5">
                  <div className="text-emerald-400 uppercase text-[10px] tracking-wider">
                    Optimal Daily Path
                  </div>
                  <div className="text-white">
                    4 stops • 12.5 km • ~2h 10m
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-zinc-400 text-[10px]">CO₂ Savings</div>
                  <div className="text-emerald-400 font-mono">3.8 kg saved</div>
                </div>
              </div>

              {/* Map Preview Component */}
              <div className="rounded-2xl overflow-hidden border border-emerald-500/30">
                <MapLibreMap height="240px" interactive={false} />
              </div>

              {/* Turn-by-Turn Waypoint List */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5 text-zinc-300">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-forest-950 font-black flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span className="font-bold text-white">Priya Sharma</span>
                  <span className="text-zinc-400">— Indiranagar (15 kg)</span>
                </div>
                <div className="flex items-center gap-2.5 text-zinc-300">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-forest-950 font-black flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span className="font-bold text-white">TechCorp Office</span>
                  <span className="text-zinc-400">— Koramangala (40 kg)</span>
                </div>
                <div className="flex items-center gap-2.5 text-zinc-300">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-forest-950 font-black flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span className="font-bold text-white">Amit Patel</span>
                  <span className="text-zinc-400">— HSR Layout (25 kg)</span>
                </div>
                <div className="flex items-center gap-2.5 text-zinc-300">
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white font-black flex items-center justify-center text-[10px]">
                    4
                  </span>
                  <span className="font-bold text-white">EcoTransform Mill #04</span>
                  <span className="text-zinc-400">— Drop-off &amp; Weighbridge</span>
                </div>
              </div>

              {/* Action Button: Start Route */}
              <Button
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-black h-12 rounded-2xl shadow-lg text-xs flex items-center justify-center gap-2"
                onClick={() => alert('Starting GPS turn-by-turn navigation via EcoRoute...')}
              >
                <Navigation className="w-4 h-4 fill-forest-950" />
                <span>Start Route (Turn-by-Turn)</span>
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* TrustWeigh Scale Modal */}
      <TrustWeighModal
        isOpen={isWeighModalOpen}
        onClose={() => setIsWeighModalOpen(false)}
        jobContext={selectedJobForWeigh}
        onCompleteWeigh={handleCompleteWeigh}
      />
    </div>
  );
}
