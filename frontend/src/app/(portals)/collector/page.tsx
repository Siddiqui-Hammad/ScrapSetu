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
  Users,
  Mic,
  Maximize2,
  Camera,
  Eye,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MapLibreMap } from '@/components/maps/MapLibreMap';
import { TrustWeighModal } from '@/components/workflows/TrustWeighModal';
import { SmartBuyerMatchingWorkspace } from '@/components/workflows/SmartBuyerMatchingWorkspace';
import { CollaborativePoolingWorkspace } from '@/components/workflows/CollaborativePoolingWorkspace';
import { VoiceKabadiwalaMode } from '@/components/workflows/VoiceKabadiwalaMode';
import { formatINR, formatKg } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export default function CollectorPortalPage() {
  const { user } = useAuthStore();
  const [activeNav, setActiveNav] = useState<
    'dashboard' | 'matching' | 'pooling' | 'routes' | 'earnings' | 'profile'
  >('dashboard');

  const [isOnline, setIsOnline] = useState(true);
  const [isWeighModalOpen, setIsWeighModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [selectedJobForWeigh, setSelectedJobForWeigh] = useState<any>(null);
  const [selectedJobForPhotoInspection, setSelectedJobForPhotoInspection] = useState<any>(null);

  // Exact 3 Nearby Jobs with verified customer uploaded scrap photos
  const [nearbyJobs, setNearbyJobs] = useState([
    {
      id: 'JOB-001',
      customer: 'Priya Sharma',
      address: '12th Main, Indiranagar, Bangalore',
      distance: '2.1 km',
      materials: '15 kg Plastic (PET Bottles) & Paper',
      estVal: 375,
      phone: '+91 98765 43210',
      status: 'AVAILABLE', // AVAILABLE, ACCEPTED, COMPLETED
      photoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" rx="16" fill="%230f241a"/><rect x="20" y="20" width="360" height="220" rx="12" fill="%2316382a" stroke="%2310b981" stroke-width="2"/><text x="200" y="85" font-family="sans-serif" font-size="44" text-anchor="middle">🍾 📦 🥤</text><text x="200" y="130" font-family="sans-serif" font-size="15" font-weight="bold" fill="%23ffffff" text-anchor="middle">PET Bottles &amp; Newspaper Bundle</text><text x="200" y="160" font-family="sans-serif" font-size="12" font-weight="bold" fill="%236ee7b7" text-anchor="middle">AI Verified Weight: ~15.0 kg</text><rect x="60" y="185" width="280" height="28" rx="6" fill="%23047857"/><text x="200" y="204" font-family="monospace" font-size="11" font-weight="bold" fill="%23ffffff" text-anchor="middle">CUSTOMER UPLOADED • 10:45 AM</text></svg>',
      photoThumbnailLabel: 'PET Bottles & Paper (15 kg)',
      aiDescription: 'I can see 15 kg of sorted transparent PET drink bottles and dry corrugated cartons tied with plastic strapping. Material is clean with zero liquid or organic contamination.',
      aiWeight: '15.0 kg',
      aiBreakdown: 'Plastic PET: 72% • Newspaper: 28%',
    },
    {
      id: 'JOB-002',
      customer: 'TechCorp Office',
      address: 'Koramangala 4th Block, Bangalore',
      distance: '3.4 km',
      materials: '40 kg E-Waste & Heavy Cardboard',
      estVal: 1200,
      phone: '+91 98110 77007',
      status: 'AVAILABLE',
      photoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" rx="16" fill="%230f241a"/><rect x="20" y="20" width="360" height="220" rx="12" fill="%2316382a" stroke="%2338bdf8" stroke-width="2"/><text x="200" y="85" font-family="sans-serif" font-size="44" text-anchor="middle">🖥️ ⚡ 📦</text><text x="200" y="130" font-family="sans-serif" font-size="15" font-weight="bold" fill="%23ffffff" text-anchor="middle">E-Waste Motherboards &amp; PC Towers</text><text x="200" y="160" font-family="sans-serif" font-size="12" font-weight="bold" fill="%237dd3fc" text-anchor="middle">AI Verified Weight: ~40.0 kg</text><rect x="60" y="185" width="280" height="28" rx="6" fill="%230284c7"/><text x="200" y="204" font-family="monospace" font-size="11" font-weight="bold" fill="%23ffffff" text-anchor="middle">OFFICE LOT • VERIFIED DISPATCH</text></svg>',
      photoThumbnailLabel: 'E-Waste Motherboards & Towers (40 kg)',
      aiDescription: 'I can see 2 dismantled desktop CPU towers, green motherboards with gold pins, and 6 corrugated shipping boxes from an IT office upgrade.',
      aiWeight: '40.0 kg',
      aiBreakdown: 'E-Waste PCB: 58% • Steel Chassis: 42%',
    },
    {
      id: 'JOB-003',
      customer: 'Amit Patel',
      address: 'HSR Layout Sector 2, Bangalore',
      distance: '5.2 km',
      materials: '25 kg Copper Wiring, Metal & Glass',
      estVal: 650,
      phone: '+91 98220 99881',
      status: 'AVAILABLE',
      photoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" rx="16" fill="%230f241a"/><rect x="20" y="20" width="360" height="220" rx="12" fill="%2316382a" stroke="%23f59e0b" stroke-width="2"/><text x="200" y="85" font-family="sans-serif" font-size="44" text-anchor="middle">⚡ 🍾 🔨</text><text x="200" y="130" font-family="sans-serif" font-size="15" font-weight="bold" fill="%23ffffff" text-anchor="middle">Copper Wiring &amp; Metal Scraps</text><text x="200" y="160" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23fde047" text-anchor="middle">AI Verified Weight: ~25.0 kg</text><rect x="60" y="185" width="280" height="28" rx="6" fill="%23d97706"/><text x="200" y="204" font-family="monospace" font-size="11" font-weight="bold" fill="%23ffffff" text-anchor="middle">HIGH-VALUE COPPER SCANNED</text></svg>',
      photoThumbnailLabel: 'Copper Wiring & Metal Rods (25 kg)',
      aiDescription: 'I can see coiled copper electric wires, steel household pipes, and glass beverage bottles. High density lot with excellent scrap value.',
      aiWeight: '25.0 kg',
      aiBreakdown: 'Copper Wire: 45% • Ferrous Iron: 40% • Glass: 15%',
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

  // Voice Command Action Dispatcher
  const handleVoiceAction = (action: string, payload?: any) => {
    switch (action) {
      case 'NAVIGATE_BUYER_MATCHING':
        setActiveNav('matching');
        break;
      case 'NAVIGATE_POOLING':
        setActiveNav('pooling');
        break;
      case 'NAVIGATE_NEARBY_JOBS':
      case 'NAVIGATE_TODAY_PICKUPS':
        setActiveNav('dashboard');
        break;
      case 'NAVIGATE_EARNINGS':
        setActiveNav('earnings');
        break;
      case 'COMPLETE_PICKUP_WORKFLOW':
        handleStartWeigh(nearbyJobs[0]);
        break;
      default:
        setActiveNav('dashboard');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#081711] text-zinc-100 flex relative">
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

          {/* Navigation Links with 4 Advanced Features */}
          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard Overview', icon: Layers },
              { id: 'matching', label: 'Smart Buyer Matching', icon: Sparkles, badge: 'Net Max' },
              { id: 'pooling', label: 'Scrap Pooling Groups', icon: Users, badge: '+25%' },
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-forest-950 font-black shadow-md'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                        isActive
                          ? 'bg-forest-950 text-emerald-300'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
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

      {/* 2. Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto pb-24">
        {/* Top Header Bar */}
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

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Prominent Voice Mode Button */}
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-forest-950 font-black text-xs shadow-lg hover:scale-105 transition-all"
            >
              <Mic className="w-4 h-4 text-forest-950 animate-pulse" />
              <span>🎤 आवाज़ से चलाएं (Voice Mode)</span>
            </button>

            {/* Online Toggle */}
            <div className="flex items-center gap-2 bg-[#0c2219] border border-emerald-500/30 px-3 py-1.5 rounded-xl">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'
                }`}
              />
              <span className="text-xs font-bold text-emerald-300">
                {isOnline ? 'Online' : 'Offline'}
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
              className="bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-black text-xs px-3.5 h-9"
            >
              <Scale className="w-3.5 h-3.5 mr-1" />
              <span>TrustWeigh Scale</span>
            </Button>
          </div>
        </div>

        {/* Dynamic Nav View Rendering */}
        {activeNav === 'matching' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveNav('dashboard')}
                className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                ← Back to Overview Dashboard
              </button>
            </div>
            <SmartBuyerMatchingWorkspace
              initialWeightKg={currentLoad}
              onBuyerSelected={(offer) => {
                alert(`Selected ${offer.recyclerName} at ₹${offer.buyingPricePerKg}/kg. Estimated Net: ₹${offer.netProceeds}`);
                setActiveNav('dashboard');
              }}
            />
          </div>
        ) : activeNav === 'pooling' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveNav('dashboard')}
                className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                ← Back to Overview Dashboard
              </button>
            </div>
            <CollaborativePoolingWorkspace />
          </div>
        ) : (
          /* Default Dashboard Overview */
          <div className="space-y-6">
            {/* Top Stats Cards Row: Earnings, Capacity, Smart Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Today's Earnings Card */}
              <div className="bg-[#0c2219] rounded-3xl p-5 border border-emerald-500/30 shadow-lg flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[11px] uppercase font-bold text-emerald-400 tracking-wider">
                    Today&apos;s Earnings
                  </span>
                  <div className="text-3xl font-black text-white font-mono">
                    ₹1,250
                  </div>
                  <div className="text-xs text-zinc-400 flex items-center gap-2 pt-1">
                    <span>Completed: <strong className="text-white">4</strong></span>
                    <span>•</span>
                    <span>Credits: <strong className="text-emerald-400">85</strong></span>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              {/* Vehicle Capacity Bar */}
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
                  <button
                    onClick={() => setActiveNav('matching')}
                    className="text-emerald-300 font-bold hover:underline"
                  >
                    Match Mill Buyer →
                  </button>
                </div>
              </div>

              {/* Advanced Shortcuts Card */}
              <div className="bg-gradient-to-br from-[#0c2219] to-[#041a12] rounded-3xl p-5 border border-emerald-500/30 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="text-[11px] uppercase font-bold text-emerald-300">
                    Collaborative Consignment
                  </div>
                  <div className="text-base font-black text-white mt-1">
                    Join Active PET Pool (64%)
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    Unlock ₹34/kg bulk tier (+₹6/kg bonus)
                  </div>
                </div>

                <button
                  onClick={() => setActiveNav('pooling')}
                  className="mt-3 py-2 px-3 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold text-center transition-all"
                >
                  View Pooling Groups →
                </button>
              </div>
            </div>

            {/* Central Operational Grid: Left Nearby Jobs (3), Right EcoRoute Map */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Nearby Jobs (3) */}
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

                        {/* Customer Uploaded Scrap Photo Banner */}
                        <div
                          onClick={() => setSelectedJobForPhotoInspection(job)}
                          className="mt-3 p-2.5 rounded-xl bg-black/40 border border-emerald-500/20 hover:border-emerald-400 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-12 h-12 rounded-lg bg-zinc-900 overflow-hidden shrink-0 border border-emerald-500/30 flex items-center justify-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={job.photoUrl} alt="Scrap preview" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{job.photoThumbnailLabel}</span>
                              </div>
                              <div className="text-[10px] text-zinc-400">
                                AI Weight: <strong className="text-emerald-400">{job.aiWeight}</strong> • Click to view full photo
                              </div>
                            </div>
                          </div>

                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-500/30 flex items-center gap-1 shrink-0">
                            <Eye className="w-3 h-3" />
                            <span>View Photo</span>
                          </span>
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

              {/* Right Column: Route Map & EcoRoute TSP Widget */}
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

                  <div className="rounded-2xl overflow-hidden border border-emerald-500/30">
                    <MapLibreMap height="240px" interactive={false} />
                  </div>

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
          </div>
        )}
      </main>

      {/* Floating Microphone Trigger for Voice Mode */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-forest-950 flex flex-col items-center justify-center shadow-2xl hover:scale-110 transition-all border-4 border-forest-950 animate-bounce"
          title="बोलकर चलाएं (Voice-First Kabadiwala Mode)"
        >
          <Mic className="w-7 h-7" />
          <span className="text-[8px] font-black tracking-wider uppercase">Voice</span>
        </button>
      </div>

      {/* TrustWeigh Scale Modal */}
      <TrustWeighModal
        isOpen={isWeighModalOpen}
        onClose={() => setIsWeighModalOpen(false)}
        jobContext={selectedJobForWeigh}
        onCompleteWeigh={handleCompleteWeigh}
      />

      {/* Voice-First Kabadiwala Mode Modal */}
      <VoiceKabadiwalaMode
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onExecuteAction={handleVoiceAction}
      />

      {/* Customer Uploaded Scrap Photo Inspection Modal */}
      {selectedJobForPhotoInspection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B1510] text-zinc-100 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-500/40 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-black text-white text-base flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-400" />
                  <span>Customer Uploaded Scrap Inspection</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Customer: <strong>{selectedJobForPhotoInspection.customer}</strong> ({selectedJobForPhotoInspection.distance})
                </p>
              </div>
              <button
                onClick={() => setSelectedJobForPhotoInspection(null)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Preview Container */}
            <div className="rounded-2xl overflow-hidden bg-zinc-950 border border-emerald-500/30 flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedJobForPhotoInspection.photoUrl}
                alt="Scrap item photo"
                className="max-h-60 w-full object-contain rounded-xl"
              />
            </div>

            {/* AI Vision Analysis Details */}
            <div className="p-3.5 rounded-2xl bg-[#102018] border border-emerald-500/30 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-300 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>AI Visual Inspection &amp; Weight:</span>
                </span>
                <span className="font-mono font-bold text-white bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  {selectedJobForPhotoInspection.aiWeight}
                </span>
              </div>
              <p className="text-zinc-300 leading-relaxed font-medium">
                &ldquo;{selectedJobForPhotoInspection.aiDescription}&rdquo;
              </p>
              <div className="text-[11px] text-zinc-400 font-mono pt-1 border-t border-white/10">
                Composition: <strong className="text-white">{selectedJobForPhotoInspection.aiBreakdown}</strong>
              </div>
            </div>

            {/* Address & Payout */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/10 text-xs">
              <div>
                <div className="text-[10px] text-zinc-400">Pickup Address:</div>
                <div className="font-bold text-white">{selectedJobForPhotoInspection.address}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-zinc-400">Net Collector Payout:</div>
                <div className="text-lg font-black font-mono text-emerald-400">₹{selectedJobForPhotoInspection.estVal}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setSelectedJobForPhotoInspection(null)}
                className="flex-1 border-white/10 text-zinc-300 hover:text-white bg-white/5 text-xs font-bold h-11 rounded-xl"
              >
                Close Preview
              </Button>
              <Button
                onClick={() => {
                  handleAcceptJob(selectedJobForPhotoInspection.id);
                  setSelectedJobForPhotoInspection(null);
                }}
                className="flex-2 bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-black text-xs h-11 rounded-xl shadow-lg gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept Pickup Job (₹{selectedJobForPhotoInspection.estVal})</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
