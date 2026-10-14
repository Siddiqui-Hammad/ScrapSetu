'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Recycle,
  Play,
  ArrowRight,
  Sparkles,
  Home,
  Building2,
  Truck,
  Factory,
  ShieldCheck,
  CheckCircle2,
  Scale,
  QrCode,
  TrendingUp,
  Leaf,
  Users,
  Camera,
  MapPin,
  Scan,
  Eye,
  X,
  ExternalLink,
  ChevronRight,
  FileText,
  Lock,
  Layers,
  Check,
  Award,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';
import { PhotoMatchingVerificationWorkspace } from '../components/workflows/PhotoMatchingVerificationWorkspace';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

export default function HomePage() {
  const { demoLoginAs } = useAuthStore();
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>('HOUSEHOLD');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isDesignBoardModalOpen, setIsDesignBoardModalOpen] = useState(false);

  // Interactive states for the 6 Core Innovation Engines
  const [visionSample, setVisionSample] = useState<'PET' | 'METAL' | 'EWASTE'>('PET');
  const [trustWeightKg, setTrustWeightKg] = useState<number>(15.0);
  const [trustRatePerKg, setTrustRatePerKg] = useState<number>(25);
  const [trustAdjustment, setTrustAdjustment] = useState<number>(0);
  const [isReceiptGenerated, setIsReceiptGenerated] = useState<boolean>(false);
  const [selectedRouteStop, setSelectedRouteStop] = useState<number>(1);
  const [navStarted, setNavStarted] = useState<boolean>(false);
  const [scrapRateKg, setScrapRateKg] = useState<number>(25);
  const [scrapRateCategory, setScrapRateCategory] = useState<string>('PET');

  const roleCards = [
    {
      role: 'HOUSEHOLD' as UserRole,
      title: 'Household',
      desc: 'Book pickups, track collections and earn Green Karma.',
      icon: Home,
      iconBg: 'bg-emerald-50 text-forest-900 border border-emerald-200',
      badge: 'Earn GreenKarma',
      link: '/household',
      linkLabel: 'Switch to Household →',
    },
    {
      role: 'BUSINESS' as UserRole,
      title: 'Business',
      desc: 'Manage bulk commercial scrap and download EPR/ESG reports.',
      icon: Building2,
      iconBg: 'bg-blue-50 text-blue-800 border border-blue-200',
      badge: 'ESG Compliance',
      link: '/business',
      linkLabel: 'Switch to Business →',
    },
    {
      role: 'COLLECTOR' as UserRole,
      title: 'Collector (Kabadiwala)',
      desc: 'Find high-paying nearby jobs, optimize routes and earn more.',
      icon: Truck,
      iconBg: 'bg-amber-50 text-amber-800 border border-amber-200',
      badge: '+25% Pooled Rates',
      link: '/collector',
      linkLabel: 'Switch to Collector →',
    },
    {
      role: 'RECYCLER' as UserRole,
      title: 'Recycler Facility',
      desc: 'Manage intake, set live buying rates and track transformation.',
      icon: Factory,
      iconBg: 'bg-purple-50 text-purple-800 border border-purple-200',
      badge: 'EPR Fulfilment',
      link: '/recycler',
      linkLabel: 'Switch to Recycler →',
    },
    {
      role: 'ADMIN' as UserRole,
      title: 'Admin Control',
      desc: 'Platform governance, KYC verification queue and impact telemetry.',
      icon: ShieldCheck,
      iconBg: 'bg-zinc-100 text-zinc-900 border border-zinc-300',
      badge: 'Full Telemetry',
      link: '/admin',
      linkLabel: 'Switch to Admin →',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-24 bg-[#F8F9FA] text-zinc-900">
      {/* 1. HERO SECTION (Exact Match to Master Design Board Top-Left) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-800 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>🌿 India&apos;s Circular Economy Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-zinc-950 leading-[1.10]">
              Turning Waste into a Greener Tomorrow
            </h1>

            <p className="text-base text-zinc-600 max-w-lg font-normal leading-relaxed">
              Connecting households, collectors, businesses and recyclers through technology for a cleaner, greener India.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/register">
                <Button size="lg" className="bg-forest-900 hover:bg-forest-950 text-white font-bold px-7 h-12 shadow-md hover:shadow-lg transition-all">
                  Get Started
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsVideoModalOpen(true)}
                className="bg-white border-zinc-300 text-zinc-800 font-bold px-6 h-12 shadow-2xs hover:bg-zinc-50 flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-zinc-800 text-zinc-800" />
                <span>Watch Video</span>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => setIsDesignBoardModalOpen(true)}
                className="text-forest-900 hover:bg-emerald-50 font-bold px-4 h-12 flex items-center gap-1.5 text-xs"
              >
                <Eye className="w-4 h-4 text-emerald-700" />
                <span>View Design Board</span>
              </Button>
            </div>

            {/* Bottom 4 Counters */}
            <div className="pt-6 border-t border-zinc-200/90 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-white rounded-2xl border border-zinc-200/70 shadow-2xs">
                <div className="text-2xl font-black text-zinc-950 font-mono">50K+</div>
                <div className="text-xs text-zinc-500 font-medium mt-0.5">Happy Users</div>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-zinc-200/70 shadow-2xs">
                <div className="text-2xl font-black text-zinc-950 font-mono">2,500+</div>
                <div className="text-xs text-zinc-500 font-medium mt-0.5">Pickups Completed</div>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-zinc-200/70 shadow-2xs">
                <div className="text-2xl font-black text-zinc-950 font-mono">1,200+</div>
                <div className="text-xs text-zinc-500 font-medium mt-0.5">Tons Recycled</div>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-zinc-200/70 shadow-2xs">
                <div className="text-2xl font-black text-zinc-950 font-mono">5,600+</div>
                <div className="text-xs text-zinc-500 font-medium mt-0.5">KG CO₂ Saved</div>
              </div>
            </div>
          </div>

          {/* Right Hero: High-Fidelity 3D Circular Ecosystem Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-forest-900 to-teal-950 p-6 sm:p-8 border border-emerald-500/30 shadow-2xl min-h-[500px] flex flex-col justify-between text-white">
              {/* Radial Glowing Background & Eco Skyline Graphic */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
              <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

              {/* Central Dynamic Orbit Rings SVG */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <svg width="460" height="460" viewBox="0 0 460 460" className="animate-spin-slow">
                  <circle cx="230" cy="230" r="190" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="8 8" />
                  <circle cx="230" cy="230" r="140" fill="none" stroke="#34d399" strokeWidth="2" strokeDasharray="4 6" />
                  <circle cx="230" cy="230" r="90" fill="none" stroke="#6ee7b7" strokeWidth="1" />
                </svg>
              </div>

              {/* Top Row: Households Node (Top Left) */}
              <div className="relative z-10 self-start bg-white/95 backdrop-blur-md text-zinc-950 rounded-2xl p-4 shadow-xl border border-white/60 max-w-[230px] transform hover:scale-105 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs">
                    <Home className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-zinc-950 leading-tight">Households</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Sort & Book Scrap</div>
                    <div className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                      Instant Doorstep Cash
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Row: Collectors Node (Right Center) */}
              <div className="relative z-10 self-end bg-white/95 backdrop-blur-md text-zinc-950 rounded-2xl p-4 shadow-xl border border-white/60 max-w-[240px] transform hover:scale-105 transition-all -mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-forest-900 flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-zinc-950 leading-tight">Collectors (Kabadiwalas)</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Pick & Earn Daily</div>
                    <div className="text-[9px] font-bold text-forest-900 bg-emerald-100 px-1.5 py-0.5 rounded mt-1 inline-block">
                      Optimized EV Routing
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Node: Recyclers Node (Left Center) */}
              <div className="relative z-10 self-start bg-white/95 backdrop-blur-md text-zinc-950 rounded-2xl p-4 shadow-xl border border-white/60 max-w-[250px] transform hover:scale-105 transition-all -mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs">
                    <Factory className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-zinc-950 leading-tight">Recyclers & Mills</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Process & Transform</div>
                    <div className="text-[9px] font-bold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                      CPCB EPR Credits
                    </div>
                  </div>
                </div>
              </div>

              {/* Organic Green Flow Ribbon (Bottom Banner) */}
              <div className="relative z-10 mt-6 bg-gradient-to-r from-emerald-900/90 via-emerald-800/90 to-teal-900/90 backdrop-blur-md text-white rounded-2xl p-4 flex items-center justify-between border border-emerald-400/30 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-400/20 flex items-center justify-center">
                    <Recycle className="w-4 h-4 text-emerald-300 animate-spin-slow" />
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-wide block">A Cleaner Greener India</span>
                    <span className="text-[10px] text-emerald-200">Zero Landfill Circular Protocol</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-400/30">
                    100% Traceable Loop
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SWITCH ROLE (DEMO MODE) - Exact Match to Master Board Top-Right */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-lg p-6 sm:p-8 space-y-6">
          {/* Header Sub-bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Interactive Evaluation Gateway
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                  1-Click Instant Login
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mt-1">Switch Role (Demo Mode)</h2>
            </div>

            {/* Horizontal Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['HOUSEHOLD', 'BUSINESS', 'COLLECTOR', 'RECYCLER', 'ADMIN'] as UserRole[]).map((r) => {
                const isSel = selectedRoleTab === r;
                const labels: Record<UserRole, string> = {
                  HOUSEHOLD: 'Household',
                  BUSINESS: 'Business',
                  COLLECTOR: 'Collector',
                  RECYCLER: 'Recycler',
                  ADMIN: 'Admin',
                };
                return (
                  <button
                    key={r}
                    onClick={() => setSelectedRoleTab(r)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSel
                        ? 'bg-forest-900 text-white shadow-xs scale-105'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {labels[r]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid of 5 Role Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {roleCards.map((card) => {
              const Icon = card.icon;
              const isCurrent = selectedRoleTab === card.role;
              return (
                <div
                  key={card.role}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isCurrent
                      ? 'bg-emerald-50/50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-zinc-50 border-zinc-200/90 hover:border-emerald-400 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center font-bold shadow-2xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-500 bg-white px-2 py-0.5 rounded-md border border-zinc-200">
                        {card.badge}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-zinc-950">{card.title}</h3>
                      <p className="text-[11px] text-zinc-500 leading-snug mt-1">{card.desc}</p>
                    </div>
                  </div>

                  <Link
                    href={card.link}
                    onClick={() => demoLoginAs(card.role)}
                    className="text-xs font-extrabold text-forest-900 hover:text-emerald-700 flex items-center justify-between pt-3 border-t border-zinc-200/60 group"
                  >
                    <span>{card.linkLabel}</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. ROW 3 SHOWCASE: THE 6 CIRCULAR INTELLIGENCE WORKFLOWS (Active & Interactive) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
            Core Technology Suite
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
            Six Specialized Circular Intelligence Engines
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600">
            Fully functional interactive modules replicating the master product specifications.
          </p>
        </div>

        {/* 6 Engine Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. ScrapVision AI Detection */}
          <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 shadow-md space-y-4 hover:shadow-lg transition-all flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-forest-900 flex items-center justify-center font-bold">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950">
                      ScrapVision – AI Material Detection
                    </h3>
                    <span className="text-[10px] text-zinc-500">Computer Vision Classifier</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-300">
                  Active Model
                </Badge>
              </div>

              {/* Sample Switcher Pills */}
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <button
                  onClick={() => setVisionSample('PET')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${visionSample === 'PET' ? 'bg-forest-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}
                >
                  PET Bottles
                </button>
                <button
                  onClick={() => setVisionSample('METAL')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${visionSample === 'METAL' ? 'bg-forest-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}
                >
                  Copper & Al
                </button>
                <button
                  onClick={() => setVisionSample('EWASTE')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${visionSample === 'EWASTE' ? 'bg-forest-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}
                >
                  E-Waste PCB
                </button>
              </div>

              {/* Visual detection mock with bounding boxes */}
              <div className="bg-zinc-950 rounded-2xl p-3 relative overflow-hidden text-white min-h-[160px] flex flex-col justify-between">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/40 via-zinc-950 to-zinc-950" />
                
                {/* SVG Bounding Boxes Simulation */}
                <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                  <span>[SCANNING REGION 1]</span>
                  <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] text-emerald-300">
                    {visionSample === 'PET' ? 'CONF: 94.2%' : visionSample === 'METAL' ? 'CONF: 96.8%' : 'CONF: 97.5%'}
                  </span>
                </div>

                <div className="relative z-10 my-2 p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-300">
                      {visionSample === 'PET' ? 'Plastic (PET)' : visionSample === 'METAL' ? 'Copper Wiring' : 'Printed Circuit Board'}
                    </span>
                    <span className="font-mono font-bold text-white">
                      {visionSample === 'PET' ? '72%' : visionSample === 'METAL' ? '68%' : '54%'}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: visionSample === 'PET' ? '72%' : visionSample === 'METAL' ? '68%' : '54%' }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-300">
                    <span>Secondary: {visionSample === 'PET' ? 'Aluminium (18%)' : visionSample === 'METAL' ? 'Aluminium (24%)' : 'ABS Plastic (28%)'}</span>
                    <span>Rate: {visionSample === 'PET' ? '₹35/kg' : visionSample === 'METAL' ? '₹680/kg' : '₹110/kg'}</span>
                  </div>
                </div>

                <div className="relative z-10 text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {visionSample === 'PET'
                      ? '✓ High Confidence: Clean Beverage PET'
                      : visionSample === 'METAL'
                      ? '✓ High Value Non-Ferrous Metal'
                      : '✓ Hazardous E-Waste Schedule I'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link href="/household" className="text-xs font-bold text-forest-900 hover:text-emerald-700 flex items-center gap-1">
                <span>Test in Household Portal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Badge variant="outline" className="text-[10px]">Gemini Vision API</Badge>
            </div>
          </div>

          {/* 2. EcoRoute Smart Route Planning */}
          <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 shadow-md space-y-4 hover:shadow-lg transition-all flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-forest-900 flex items-center justify-center font-bold">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950">
                      EcoRoute – Smart Route Planning
                    </h3>
                    <span className="text-[10px] text-zinc-500">Fleet Dispatch & Fuel Optimization</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-800 border-blue-200">
                  4 Stops Active
                </Badge>
              </div>

              {/* Route Summary */}
              <div className="bg-zinc-50 rounded-2xl p-3.5 border border-zinc-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-zinc-950">Total Loop: 12.5 km (~2h 10m)</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                    38% Fuel Saved
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  {[
                    { id: 1, title: '1. Pickup - Green Park', dist: '2.1 km', weight: '~15 kg' },
                    { id: 2, title: '2. Pickup - Tech Park', dist: '3.4 km', weight: '~40 kg' },
                    { id: 3, title: '3. Pickup - Sunrise Apt', dist: '5.2 km', weight: '~12 kg' },
                    { id: 4, title: '4. Drop - Recycler Facility', dist: '1.8 km', weight: 'Intake' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedRouteStop(s.id)}
                      className={`w-full text-left p-1.5 rounded-lg text-[11px] transition-all flex items-center justify-between ${
                        selectedRouteStop === s.id
                          ? 'bg-forest-900 text-white font-bold'
                          : 'bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-100'
                      }`}
                    >
                      <span>{s.title}</span>
                      <span className="font-mono text-[10px] opacity-80">{s.dist} • {s.weight}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center text-[11px] font-bold text-zinc-700">
                  <span>Vehicle Load (Tata Ace):</span>
                  <span className="font-mono text-forest-900">320 / 500 kg (64%)</span>
                </div>
                <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-forest-900 h-full w-[64%] rounded-full" />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Button
                size="sm"
                onClick={() => setNavStarted(!navStarted)}
                className={`text-xs font-bold ${navStarted ? 'bg-emerald-700' : 'bg-forest-900'} text-white`}
              >
                {navStarted ? '✓ Navigating Stop #' + selectedRouteStop : 'Start Navigation'}
              </Button>
              <Link href="/collector" className="text-xs font-bold text-forest-900 hover:underline">
                Collector Map →
              </Link>
            </div>
          </div>

          {/* 3. ScrapRate Live Market Pricing */}
          <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 shadow-md space-y-4 hover:shadow-lg transition-all flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-forest-900 flex items-center justify-center font-bold">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950">
                      ScrapRate – Live Market Pricing
                    </h3>
                    <span className="text-[10px] text-zinc-500">Mandi Rate Aggregator</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-300">
                  Live Today
                </Badge>
              </div>

              {/* Price Rows */}
              <div className="space-y-2 text-xs">
                <div
                  onClick={() => { setScrapRateCategory('PET'); setScrapRateKg(30); }}
                  className={`flex justify-between items-center p-2 rounded-xl cursor-pointer border transition-all ${
                    scrapRateCategory === 'PET' ? 'bg-emerald-50 border-emerald-400' : 'bg-zinc-50 border-zinc-200/70 hover:bg-zinc-100'
                  }`}
                >
                  <div className="font-bold text-zinc-900">Plastic (PET Bottles)</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-forest-900">₹25 - 45/kg</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">+12%</span>
                  </div>
                </div>

                <div
                  onClick={() => { setScrapRateCategory('CARDBOARD'); setScrapRateKg(45); }}
                  className={`flex justify-between items-center p-2 rounded-xl cursor-pointer border transition-all ${
                    scrapRateCategory === 'CARDBOARD' ? 'bg-emerald-50 border-emerald-400' : 'bg-zinc-50 border-zinc-200/70 hover:bg-zinc-100'
                  }`}
                >
                  <div className="font-bold text-zinc-900">Cardboard (Raddi / Gatta)</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-forest-900">₹10 - 20/kg</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">+5%</span>
                  </div>
                </div>

                <div
                  onClick={() => { setScrapRateCategory('COPPER'); setScrapRateKg(8); }}
                  className={`flex justify-between items-center p-2 rounded-xl cursor-pointer border transition-all ${
                    scrapRateCategory === 'COPPER' ? 'bg-emerald-50 border-emerald-400' : 'bg-zinc-50 border-zinc-200/70 hover:bg-zinc-100'
                  }`}
                >
                  <div className="font-bold text-zinc-900">Copper Wiring</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-forest-900">₹650 - 710/kg</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">+8%</span>
                  </div>
                </div>
              </div>

              {/* Instant Earnings Estimator */}
              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-zinc-600">
                  <span>Quick Estimate: {scrapRateCategory} ({scrapRateKg} kg)</span>
                  <span className="text-forest-900 font-mono font-extrabold">
                    ≈ ₹{scrapRateCategory === 'PET' ? scrapRateKg * 35 : scrapRateCategory === 'CARDBOARD' ? scrapRateKg * 15 : scrapRateKg * 680}
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={scrapRateKg}
                  onChange={(e) => setScrapRateKg(Number(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-500">
              <span>Source: Mandi Daily Benchmark</span>
              <Link href="/rates" className="font-bold text-forest-900 hover:underline">
                Full Rate Board →
              </Link>
            </div>
          </div>

          {/* 4. Waste Passport – Material Traceability */}
          <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 shadow-md space-y-4 hover:shadow-lg transition-all flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-forest-900 flex items-center justify-center font-bold">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950">
                      Waste Passport Traceability
                    </h3>
                    <span className="text-[10px] text-zinc-500">SHA-256 Provenance Chain</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  WP-2024-00124
                </span>
              </div>

              {/* Scannable Lifecycle */}
              <div className="space-y-2 text-xs relative pl-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-400">
                <div className="relative">
                  <div className="font-extrabold text-zinc-950">Booked by Household</div>
                  <div className="text-[10px] text-zinc-500">12 Jun 2024 - 10:00 AM • 15.0 kg</div>
                </div>
                <div className="relative">
                  <div className="font-extrabold text-zinc-950">Collected by Ramesh (RS01)</div>
                  <div className="text-[10px] text-zinc-500">12 Jun 2024 - 02:15 PM • Handover Sealed</div>
                </div>
                <div className="relative">
                  <div className="font-extrabold text-zinc-950">Received at GreenTech Recycler</div>
                  <div className="text-[10px] text-zinc-500">12 Jun 2024 - 05:30 PM • 14.8 kg (Tolerance 1.3%)</div>
                </div>
                <div className="relative">
                  <div className="font-extrabold text-zinc-950">Recycled into New Product</div>
                  <div className="text-[10px] text-emerald-700 font-bold">20 Jun 2024 - CPCB Audit Completed ✓</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link href="/passport/WP-2024-00124">
                <Button size="sm" variant="outline" className="text-xs font-bold border-zinc-300">
                  <QrCode className="w-3.5 h-3.5 mr-1" />
                  <span>Inspect Passport</span>
                </Button>
              </Link>
              <span className="text-[10px] font-mono font-bold text-zinc-400">CPCB/EPR/2024/091</span>
            </div>
          </div>

          {/* 5. TrustWeigh – Transaction */}
          <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 shadow-md space-y-4 hover:shadow-lg transition-all flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-forest-900 flex items-center justify-center font-bold">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950">
                      TrustWeigh – Transaction
                    </h3>
                    <span className="text-[10px] text-zinc-500">Digital Weighbridge Settlement</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-300">
                  Zero Tampering
                </Badge>
              </div>

              {/* Calculator Inputs */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <div className="text-[10px] text-zinc-500 font-bold">Weight (kg)</div>
                  <input
                    type="number"
                    value={trustWeightKg}
                    onChange={(e) => setTrustWeightKg(Number(e.target.value))}
                    className="w-full text-center font-mono font-bold text-zinc-950 bg-white border border-zinc-200 rounded mt-1 py-0.5 text-xs"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <div className="text-[10px] text-zinc-500 font-bold">Rate/kg</div>
                  <input
                    type="number"
                    value={trustRatePerKg}
                    onChange={(e) => setTrustRatePerKg(Number(e.target.value))}
                    className="w-full text-center font-mono font-bold text-zinc-950 bg-white border border-zinc-200 rounded mt-1 py-0.5 text-xs"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-100/70 border border-emerald-300">
                  <div className="text-[10px] text-forest-900 font-bold">Total Amount</div>
                  <div className="font-mono font-black text-forest-900 mt-1 text-sm">
                    ₹{(trustWeightKg * trustRatePerKg - trustAdjustment).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Final Settlement Display */}
              <div className="p-3 bg-forest-950 text-white rounded-2xl flex items-center justify-between text-xs shadow-inner">
                <div>
                  <div className="text-[10px] text-zinc-400">Immediate Digital Payout</div>
                  <div className="font-mono font-black text-emerald-300 text-sm">
                    ₹{(trustWeightKg * trustRatePerKg - trustAdjustment).toFixed(2)} UPI Settled
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsReceiptGenerated(true)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold h-7"
                >
                  {isReceiptGenerated ? '✓ Receipt #8902' : 'Generate'}
                </Button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-500">
              <span>Automatic Moisture/Impurity Lock</span>
              <span className="font-bold text-emerald-800">Direct to UPI Bank</span>
            </div>
          </div>

          {/* 6. GreenLedger – Environmental Impact */}
          <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 shadow-md space-y-4 hover:shadow-lg transition-all flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-forest-900 flex items-center justify-center font-bold">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950">
                      GreenLedger – Impact
                    </h3>
                    <span className="text-[10px] text-zinc-500">Verified ESG Metric Accounting</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-300">
                  Verified ESG
                </Badge>
              </div>

              {/* 4 Impact Squares */}
              <div className="grid grid-cols-2 gap-2.5 text-center text-xs">
                <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                  <div className="text-base font-black font-mono text-forest-900">125.6 Tons</div>
                  <div className="text-[10px] text-zinc-600 mt-0.5">Tons Recycled</div>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                  <div className="text-base font-black font-mono text-forest-900">8,920 KG</div>
                  <div className="text-[10px] text-zinc-600 mt-0.5">CO₂ Saved</div>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                  <div className="text-base font-black font-mono text-forest-900">450</div>
                  <div className="text-[10px] text-zinc-600 mt-0.5">Trees Equivalent</div>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                  <div className="text-base font-black font-mono text-forest-900">2,100</div>
                  <div className="text-[10px] text-zinc-600 mt-0.5">Households Served</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link href="/impact" className="text-xs font-bold text-forest-900 hover:underline flex items-center gap-1">
                <span>View Full ESG Audit Report</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-[10px] text-zinc-400">BRSR Aligned</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MAJOR NEW FEATURE SPOTLIGHT: AI PHOTO MATCHING & KYC VERIFICATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PhotoMatchingVerificationWorkspace />
      </section>

      {/* 5. ORIGINAL MASTER DESIGN BOARD LIGHTBOX MODAL */}
      <Dialog open={isDesignBoardModalOpen} onOpenChange={setIsDesignBoardModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-6 bg-white rounded-3xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-black text-zinc-950 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-700" />
                  <span>ScrapSetu 2.0 Master Product Architecture Board</span>
                </DialogTitle>
                <p className="text-xs text-zinc-500 mt-1">
                  Full reference art direction uploaded by the project owner (`media_1791919730762_74d15632.jpg`).
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-4 rounded-2xl overflow-hidden border border-zinc-200 shadow-md bg-zinc-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/master-design-board.jpg"
              alt="ScrapSetu Master Design Board"
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="mt-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-1">
            <div className="font-bold text-zinc-900">Implemented Screen Parity:</div>
            <div>✓ Top-Left: Hero Section with Circular City Ecosystem & 4 KPI counters</div>
            <div>✓ Top-Middle: Auth & Onboarding Flow with Aadhaar & Mobile login</div>
            <div>✓ Top-Right: Switch Role Demo Gateway with 5 Role Portals</div>
            <div>✓ Middle Row: Household, Collector, Recycler, and Admin Role Dashboards</div>
            <div>✓ Bottom Row: ScrapVision, EcoRoute, ScrapRate, Waste Passport, TrustWeigh, GreenLedger</div>
            <div>✓ Advanced Innovation: AI Photo Matching (Aadhaar/DL vs Live Selfie) & Voice Kabadiwala Mode</div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 6. VIDEO EXPLAINER WALKTHROUGH MODAL */}
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="max-w-3xl p-6 bg-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-zinc-950 flex items-center gap-2">
              <Play className="w-5 h-5 text-emerald-700 fill-emerald-700" />
              <span>ScrapSetu Platform Walkthrough & Interactive Demo</span>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-3 aspect-video rounded-2xl bg-zinc-950 overflow-hidden relative flex flex-col items-center justify-center p-6 text-white text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-600/30 border-2 border-emerald-400 flex items-center justify-center">
              <Play className="w-8 h-8 fill-emerald-300 text-emerald-300 ml-1" />
            </div>
            <div>
              <h4 className="text-base font-black">How ScrapSetu Transforms Circular Economy in India</h4>
              <p className="text-xs text-zinc-300 max-w-md mx-auto mt-1">
                From AI material detection at doorstep to cooperative scrap pooling, tamper-proof QR passports, and verified face-matched collectors.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <Link href="/household">
                <Button size="sm" className="bg-forest-900 hover:bg-forest-950 text-white font-bold text-xs">
                  Try Household Demo
                </Button>
              </Link>
              <Link href="/collector">
                <Button size="sm" variant="outline" className="bg-white/10 text-white border-white/20 text-xs font-bold hover:bg-white/20">
                  Try Collector Demo
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
