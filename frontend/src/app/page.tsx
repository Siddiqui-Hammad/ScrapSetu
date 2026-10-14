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
import { BilingualText } from '../components/common/BilingualText';
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
      iconBg: 'bg-amber-950/50 text-amber-300 border border-amber-500/30',
      badge: 'Earn GreenKarma',
      link: '/household',
      linkLabel: 'Switch to Household →',
    },
    {
      role: 'BUSINESS' as UserRole,
      title: 'Business',
      desc: 'Manage bulk commercial scrap and download EPR/ESG reports.',
      icon: Building2,
      iconBg: 'bg-blue-950/50 text-blue-300 border border-blue-500/30',
      badge: 'ESG Compliance',
      link: '/business',
      linkLabel: 'Switch to Business →',
    },
    {
      role: 'COLLECTOR' as UserRole,
      title: 'Collector (Kabadiwala)',
      desc: 'Find high-paying nearby jobs, optimize routes and earn more.',
      icon: Truck,
      iconBg: 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/30',
      badge: '+25% Pooled Rates',
      link: '/collector',
      linkLabel: 'Switch to Collector →',
    },
    {
      role: 'RECYCLER' as UserRole,
      title: 'Recycler Facility',
      desc: 'Manage intake, set live buying rates and track transformation.',
      icon: Factory,
      iconBg: 'bg-purple-950/50 text-purple-300 border border-purple-500/30',
      badge: 'EPR Fulfilment',
      link: '/recycler',
      linkLabel: 'Switch to Recycler →',
    },
    {
      role: 'ADMIN' as UserRole,
      title: 'Admin Control',
      desc: 'Platform governance, KYC verification queue and impact telemetry.',
      icon: ShieldCheck,
      iconBg: 'bg-zinc-900 text-zinc-300 border border-zinc-700',
      badge: 'Full Telemetry',
      link: '/admin',
      linkLabel: 'Switch to Admin →',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-24 bg-[#070D0A] text-[#F4FDF8] relative overflow-hidden">
      {/* Top Ambient Light Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/12 via-teal-900/5 to-transparent pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <BilingualText en="🌿 India's Circular Economy Platform" hi="🌿 भारत का परिपत्र अर्थव्यवस्था मंच" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-white leading-[1.10]">
              <BilingualText
                en="Turning Waste into a Greener Tomorrow"
                hi="कचरे को एक हरित भविष्य में बदलना"
              />
            </h1>

            <p className="text-base text-zinc-400 max-w-lg font-normal leading-relaxed">
              <BilingualText
                en="Connecting households, collectors, businesses and recyclers through technology for a cleaner, greener India."
                hi="स्वच्छ, हरित भारत के लिए प्रौद्योगिकी द्वारा परिवारों, कबाड़ीवालों, व्यवसायों और पुनर्चक्रणकर्ताओं को जोड़ना।"
              />
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/register">
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-black px-7 h-12 shadow-lg shadow-emerald-950/60 transition-all">
                  <BilingualText en="Get Started" hi="शुरू करें" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsVideoModalOpen(true)}
                className="bg-white/5 border border-emerald-500/30 text-white font-bold px-6 h-12 hover:bg-white/10 flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                <BilingualText en="Watch Video" hi="वीडियो देखें" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => setIsDesignBoardModalOpen(true)}
                className="text-emerald-400 hover:bg-emerald-950/40 font-bold px-4 h-12 flex items-center gap-1.5 text-xs"
              >
                <Eye className="w-4 h-4 text-emerald-400" />
                <BilingualText en="View Design Board" hi="डिज़ाइन बोर्ड देखें" />
              </Button>
            </div>

            {/* Bottom 4 Counters */}
            <div className="pt-6 border-t border-emerald-500/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-[#0B1510] rounded-2xl border border-emerald-500/20 shadow-md">
                <div className="text-2xl font-black text-emerald-400 font-mono">50K+</div>
                <div className="text-xs text-zinc-400 font-medium mt-0.5">
                  <BilingualText en="Happy Users" hi="संतुष्ट उपयोगकर्ता" />
                </div>
              </div>
              <div className="p-3 bg-[#0B1510] rounded-2xl border border-emerald-500/20 shadow-md">
                <div className="text-2xl font-black text-emerald-400 font-mono">2,500+</div>
                <div className="text-xs text-zinc-400 font-medium mt-0.5">
                  <BilingualText en="Pickups Done" hi="पिकअप पूर्ण" />
                </div>
              </div>
              <div className="p-3 bg-[#0B1510] rounded-2xl border border-emerald-500/20 shadow-md">
                <div className="text-2xl font-black text-emerald-400 font-mono">1,200+</div>
                <div className="text-xs text-zinc-400 font-medium mt-0.5">
                  <BilingualText en="Tons Recycled" hi="टन पुनर्चक्रित" />
                </div>
              </div>
              <div className="p-3 bg-[#0B1510] rounded-2xl border border-emerald-500/20 shadow-md">
                <div className="text-2xl font-black text-emerald-400 font-mono">5,600+</div>
                <div className="text-xs text-zinc-400 font-medium mt-0.5">
                  <BilingualText en="KG CO₂ Saved" hi="किग्रा CO₂ बचत" />
                </div>
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
              <div className="relative z-10 self-start bg-[#070D0A]/90 backdrop-blur-md text-white rounded-2xl p-4 shadow-xl border border-emerald-500/30 max-w-[230px] transform hover:scale-105 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-950/60 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs">
                    <Home className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-white leading-tight">
                      <BilingualText en="Households" hi="घर / परिवार" />
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">
                      <BilingualText en="Sort & Book Scrap" hi="कचरा छाँटें व बुक करें" />
                    </div>
                    <div className="text-[9px] font-bold text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded mt-1 inline-block border border-emerald-500/30">
                      Instant Doorstep Cash
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Row: Collectors Node (Right Center) */}
              <div className="relative z-10 self-end bg-[#070D0A]/90 backdrop-blur-md text-white rounded-2xl p-4 shadow-xl border border-emerald-500/30 max-w-[240px] transform hover:scale-105 transition-all -mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-white leading-tight">
                      <BilingualText en="Collectors (Kabadiwalas)" hi="कबाड़ीवाले (संग्राहक)" />
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">
                      <BilingualText en="Pick & Earn Daily" hi="दैनिक पिकअप व कमाई" />
                    </div>
                    <div className="text-[9px] font-bold text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded mt-1 inline-block border border-emerald-500/30">
                      Optimized EV Routing
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Node: Recyclers Node (Left Center) */}
              <div className="relative z-10 self-start bg-[#070D0A]/90 backdrop-blur-md text-white rounded-2xl p-4 shadow-xl border border-emerald-500/30 max-w-[250px] transform hover:scale-105 transition-all -mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-purple-950/60 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs">
                    <Factory className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-white leading-tight">
                      <BilingualText en="Recyclers & Mills" hi="पुनर्चक्रण मिलें" />
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">
                      <BilingualText en="Process & Transform" hi="प्रसंस्करण व रूपांतरण" />
                    </div>
                    <div className="text-[9px] font-bold text-purple-300 bg-purple-950/80 px-1.5 py-0.5 rounded mt-1 inline-block border border-purple-500/30">
                      CPCB EPR Credits
                    </div>
                  </div>
                </div>
              </div>

              {/* Organic Green Flow Ribbon (Bottom Banner) */}
              <div className="relative z-10 mt-6 bg-gradient-to-r from-emerald-950/90 via-emerald-900/90 to-teal-950/90 backdrop-blur-md text-white rounded-2xl p-4 flex items-center justify-between border border-emerald-400/30 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-400/20 flex items-center justify-center">
                    <Recycle className="w-4 h-4 text-emerald-300 animate-spin-slow" />
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-wide block">A Cleaner Greener India</span>
                    <span className="text-[10px] text-emerald-300">Zero Landfill Circular Protocol</span>
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

      {/* 2. SWITCH ROLE (DEMO MODE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B1510] rounded-3xl border border-emerald-500/25 shadow-2xl p-6 sm:p-8 space-y-6 text-zinc-100">
          {/* Header Sub-bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/15 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <BilingualText en="Interactive Evaluation Gateway" hi="इंटरैक्टिव मूल्यांकन गेटवे" />
                </span>
                <span className="text-[10px] bg-emerald-950/80 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  1-Click Instant Login
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                <BilingualText en="Switch Role (Demo Mode)" hi="भूमिका बदलें (डेमो मोड)" />
              </h2>
            </div>

            {/* Horizontal Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['HOUSEHOLD', 'BUSINESS', 'COLLECTOR', 'RECYCLER', 'ADMIN'] as UserRole[]).map((r) => {
                const isSel = selectedRoleTab === r;
                const labels: Record<UserRole, { en: string; hi: string }> = {
                  HOUSEHOLD: { en: 'Household', hi: 'परिवार' },
                  BUSINESS: { en: 'Business', hi: 'व्यवसाय' },
                  COLLECTOR: { en: 'Collector', hi: 'कबाड़ीवाला' },
                  RECYCLER: { en: 'Recycler', hi: 'पुनर्चक्रक' },
                  ADMIN: { en: 'Admin', hi: 'प्रशासक' },
                };
                return (
                  <button
                    key={r}
                    onClick={() => setSelectedRoleTab(r)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSel
                        ? 'bg-emerald-500 text-forest-950 font-black shadow-md scale-105'
                        : 'bg-[#070D0A] text-zinc-400 hover:bg-emerald-950/50 hover:text-white border border-emerald-500/15'
                    }`}
                  >
                    <BilingualText en={labels[r].en} hi={labels[r].hi} />
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
                      ? 'bg-emerald-950/40 border-emerald-400 shadow-xl ring-2 ring-emerald-500/30'
                      : 'bg-[#0E1D16] border-emerald-500/20 hover:border-emerald-400/50 hover:bg-[#13251C]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center font-bold shadow-2xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-[#070D0A] px-2 py-0.5 rounded-md border border-emerald-500/30">
                        {card.badge}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white">{card.title}</h3>
                      <p className="text-[11px] text-zinc-400 leading-snug mt-1">{card.desc}</p>
                    </div>
                  </div>

                  <Link
                    href={card.link}
                    onClick={() => demoLoginAs(card.role)}
                    className="text-xs font-extrabold text-emerald-400 hover:text-emerald-300 flex items-center justify-between pt-3 border-t border-emerald-500/15 group"
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

      {/* 3. ROW 3 SHOWCASE: THE 6 CIRCULAR INTELLIGENCE WORKFLOWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
            <BilingualText en="Core Technology Suite" hi="मुख्य प्रौद्योगिकी सुइट" />
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            <BilingualText
              en="Six Specialized Circular Intelligence Engines"
              hi="छह विशेष परिपत्र बुद्धिमत्ता इंजन"
            />
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            <BilingualText
              en="Fully functional interactive modules replicating the master product specifications."
              hi="मास्टर उत्पाद विनिर्देशों को दोहराने वाले पूर्णतः कार्यात्मक इंटरैक्टिव मॉड्यूल।"
            />
          </p>
        </div>

        {/* 6 Engine Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. ScrapVision AI Detection */}
          <div className="bg-[#0B1510] rounded-3xl border border-emerald-500/25 p-6 shadow-xl space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between text-zinc-100">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-emerald-500/15 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      ScrapVision – AI Material Detection
                    </h3>
                    <span className="text-[10px] text-zinc-400">Computer Vision Classifier & Volumetric Weight</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] bg-emerald-950/80 text-emerald-300 border-emerald-500/30">
                  Active Model
                </Badge>
              </div>

              {/* Sample Switcher Pills */}
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <button
                  onClick={() => setVisionSample('PET')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${visionSample === 'PET' ? 'bg-emerald-500 text-forest-950 font-black' : 'bg-[#070D0A] text-zinc-400 border border-emerald-500/15'}`}
                >
                  PET Bottles
                </button>
                <button
                  onClick={() => setVisionSample('METAL')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${visionSample === 'METAL' ? 'bg-emerald-500 text-forest-950 font-black' : 'bg-[#070D0A] text-zinc-400 border border-emerald-500/15'}`}
                >
                  Copper & Al
                </button>
                <button
                  onClick={() => setVisionSample('EWASTE')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${visionSample === 'EWASTE' ? 'bg-emerald-500 text-forest-950 font-black' : 'bg-[#070D0A] text-zinc-400 border border-emerald-500/15'}`}
                >
                  E-Waste PCB
                </button>
              </div>

              {/* Visual detection mock with bounding boxes */}
              <div className="bg-[#070D0A] rounded-2xl p-3.5 relative overflow-hidden text-white min-h-[175px] flex flex-col justify-between border border-emerald-500/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-950/40 via-[#070D0A] to-[#070D0A]" />
                
                {/* SVG Bounding Boxes Simulation */}
                <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                  <span>[SCANNING REGION 1]</span>
                  <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] text-emerald-300 border border-emerald-500/30">
                    {visionSample === 'PET' ? 'CONF: 94.2%' : visionSample === 'METAL' ? 'CONF: 96.8%' : 'CONF: 97.5%'}
                  </span>
                </div>

                <div className="relative z-10 my-2 p-2.5 rounded-xl bg-white/5 backdrop-blur-md border border-emerald-500/20 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-300">
                      {visionSample === 'PET' ? 'Plastic (PET)' : visionSample === 'METAL' ? 'Copper Wiring' : 'Printed Circuit Board'}
                    </span>
                    <span className="font-mono font-bold text-white">
                      {visionSample === 'PET' ? '72%' : visionSample === 'METAL' ? '68%' : '54%'}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: visionSample === 'PET' ? '72%' : visionSample === 'METAL' ? '68%' : '54%' }}
                    />
                  </div>
                  {/* Natural language AI Scene Observation */}
                  <div className="text-[10px] text-zinc-300 italic pt-1 border-t border-white/10 leading-tight">
                    &ldquo;
                    {visionSample === 'PET'
                      ? 'I can see 14 clean PET beverage bottles, uncompressed transparent polymer. Grade A sorting.'
                      : visionSample === 'METAL'
                      ? 'I can see stripped copper core electrical wiring and clean aluminum beverage cans.'
                      : 'I can see dual-layer printed circuit boards (PCBs) with integrated microchips.'}
                    &rdquo;
                  </div>
                  {/* Calculated Volumetric Weight */}
                  <div className="flex items-center justify-between text-[10px] text-emerald-300 font-mono font-bold pt-0.5">
                    <span>Est. Vol. Weight: {visionSample === 'PET' ? '5.2 kg ± 0.4 kg' : visionSample === 'METAL' ? '8.4 kg ± 0.3 kg' : '3.1 kg ± 0.2 kg'}</span>
                    <span>Payout: {visionSample === 'PET' ? '₹182.00' : visionSample === 'METAL' ? '₹5,712.00' : '₹341.00'}</span>
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
              <Link href="/household" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                <span>Test in Household Portal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Badge variant="outline" className="text-[10px] bg-emerald-950/60 text-emerald-300 border-emerald-500/20">Gemini Vision API</Badge>
            </div>
          </div>

          {/* 2. EcoRoute Smart Route Planning */}
          <div className="bg-[#0B1510] rounded-3xl border border-emerald-500/25 p-6 shadow-xl space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between text-zinc-100">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-emerald-500/15 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      EcoRoute – Smart Route Planning
                    </h3>
                    <span className="text-[10px] text-zinc-400">Fleet Dispatch & Fuel Optimization</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] bg-teal-950/80 text-teal-300 border-teal-500/30">
                  4 Stops Active
                </Badge>
              </div>

              {/* Route Summary */}
              <div className="bg-[#0E1D16] rounded-2xl p-3.5 border border-emerald-500/20 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white">Total Loop: 12.5 km (~2h 10m)</span>
                  <span className="text-emerald-300 font-bold bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px]">
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
                          ? 'bg-emerald-500 text-forest-950 font-black'
                          : 'bg-[#070D0A] hover:bg-[#13251C] text-zinc-300 border border-emerald-500/15'
                      }`}
                    >
                      <span>{s.title}</span>
                      <span className="font-mono text-[10px] opacity-80">{s.dist} • {s.weight}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center text-[11px] font-bold text-zinc-300">
                  <span>Vehicle Load (Tata Ace):</span>
                  <span className="font-mono text-emerald-400">320 / 500 kg (64%)</span>
                </div>
                <div className="w-full bg-[#070D0A] h-2 rounded-full overflow-hidden border border-emerald-500/20">
                  <div className="bg-emerald-500 h-full w-[64%] rounded-full" />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Button
                size="sm"
                onClick={() => setNavStarted(!navStarted)}
                className={`text-xs font-bold ${navStarted ? 'bg-emerald-600' : 'bg-emerald-500'} text-forest-950 font-black`}
              >
                {navStarted ? '✓ Navigating Stop #' + selectedRouteStop : 'Start Navigation'}
              </Button>
              <Link href="/collector" className="text-xs font-bold text-emerald-400 hover:underline">
                Collector Map →
              </Link>
            </div>
          </div>

          {/* 3. ScrapRate Live Market Pricing */}
          <div className="bg-[#0B1510] rounded-3xl border border-emerald-500/25 p-6 shadow-xl space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between text-zinc-100">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-emerald-500/15 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      ScrapRate – Live Market Pricing
                    </h3>
                    <span className="text-[10px] text-zinc-400">Mandi Rate Aggregator</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] bg-emerald-950/80 text-emerald-300 border-emerald-500/30">
                  Live Today
                </Badge>
              </div>

              {/* Price Rows */}
              <div className="space-y-2 text-xs">
                <div
                  onClick={() => { setScrapRateCategory('PET'); setScrapRateKg(30); }}
                  className={`flex justify-between items-center p-2 rounded-xl cursor-pointer border transition-all ${
                    scrapRateCategory === 'PET' ? 'bg-emerald-950/50 border-emerald-400 text-white' : 'bg-[#0E1D16] border-emerald-500/20 text-zinc-300 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="font-bold">Plastic (PET Bottles)</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-emerald-400">₹25 - 45/kg</span>
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">+12%</span>
                  </div>
                </div>

                <div
                  onClick={() => { setScrapRateCategory('CARDBOARD'); setScrapRateKg(45); }}
                  className={`flex justify-between items-center p-2 rounded-xl cursor-pointer border transition-all ${
                    scrapRateCategory === 'CARDBOARD' ? 'bg-emerald-950/50 border-emerald-400 text-white' : 'bg-[#0E1D16] border-emerald-500/20 text-zinc-300 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="font-bold">Cardboard (Raddi / Gatta)</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-emerald-400">₹10 - 20/kg</span>
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">+5%</span>
                  </div>
                </div>

                <div
                  onClick={() => { setScrapRateCategory('COPPER'); setScrapRateKg(8); }}
                  className={`flex justify-between items-center p-2 rounded-xl cursor-pointer border transition-all ${
                    scrapRateCategory === 'COPPER' ? 'bg-emerald-950/50 border-emerald-400 text-white' : 'bg-[#0E1D16] border-emerald-500/20 text-zinc-300 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="font-bold">Copper Wiring</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-emerald-400">₹650 - 710/kg</span>
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">+8%</span>
                  </div>
                </div>
              </div>

              {/* Instant Earnings Estimator */}
              <div className="p-3 bg-[#070D0A] rounded-2xl border border-emerald-500/20 text-xs space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-zinc-300">
                  <span>Quick Estimate: {scrapRateCategory} ({scrapRateKg} kg)</span>
                  <span className="text-emerald-400 font-mono font-extrabold">
                    ≈ ₹{scrapRateCategory === 'PET' ? scrapRateKg * 35 : scrapRateCategory === 'CARDBOARD' ? scrapRateKg * 15 : scrapRateKg * 680}
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={scrapRateKg}
                  onChange={(e) => setScrapRateKg(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-400">
              <span>Source: Mandi Daily Benchmark</span>
              <Link href="/rates" className="font-bold text-emerald-400 hover:underline">
                Full Rate Board →
              </Link>
            </div>
          </div>

          {/* 4. Waste Passport – Material Traceability */}
          <div className="bg-[#0B1510] rounded-3xl border border-emerald-500/25 p-6 shadow-xl space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between text-zinc-100">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-emerald-500/15 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      Waste Passport Traceability
                    </h3>
                    <span className="text-[10px] text-zinc-400">SHA-256 Provenance Chain</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  WP-2024-00124
                </span>
              </div>

              {/* Scannable Lifecycle */}
              <div className="space-y-2 text-xs relative pl-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-500">
                <div className="relative">
                  <div className="font-extrabold text-white">Booked by Household</div>
                  <div className="text-[10px] text-zinc-400">12 Jun 2024 - 10:00 AM • 15.0 kg</div>
                </div>
                <div className="relative">
                  <div className="font-extrabold text-white">Collected by Ramesh (RS01)</div>
                  <div className="text-[10px] text-zinc-400">12 Jun 2024 - 02:15 PM • Handover Sealed</div>
                </div>
                <div className="relative">
                  <div className="font-extrabold text-white">Received at GreenTech Recycler</div>
                  <div className="text-[10px] text-zinc-400">12 Jun 2024 - 05:30 PM • 14.8 kg (Tolerance 1.3%)</div>
                </div>
                <div className="relative">
                  <div className="font-extrabold text-white">Recycled into New Product</div>
                  <div className="text-[10px] text-emerald-300 font-bold">20 Jun 2024 - CPCB Audit Completed ✓</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link href="/passport/WP-2024-00124">
                <Button size="sm" variant="outline" className="text-xs font-bold bg-white/5 border-emerald-500/30 text-white hover:bg-white/10">
                  <QrCode className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  <span>Inspect Passport</span>
                </Button>
              </Link>
              <span className="text-[10px] font-mono font-bold text-zinc-400">CPCB/EPR/2024/091</span>
            </div>
          </div>

          {/* 5. TrustWeigh – Transaction */}
          <div className="bg-[#0B1510] rounded-3xl border border-emerald-500/25 p-6 shadow-xl space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between text-zinc-100">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-emerald-500/15 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      TrustWeigh – Transaction
                    </h3>
                    <span className="text-[10px] text-zinc-400">Digital Weighbridge Settlement</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] bg-emerald-950/80 text-emerald-300 border-emerald-500/30">
                  Zero Tampering
                </Badge>
              </div>

              {/* Calculator Inputs */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-[#070D0A] border border-emerald-500/20">
                  <div className="text-[10px] text-zinc-400 font-bold">Weight (kg)</div>
                  <input
                    type="number"
                    value={trustWeightKg}
                    onChange={(e) => setTrustWeightKg(Number(e.target.value))}
                    className="w-full text-center font-mono font-bold text-white bg-[#0E1D16] border border-emerald-500/25 rounded mt-1 py-0.5 text-xs"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-[#070D0A] border border-emerald-500/20">
                  <div className="text-[10px] text-zinc-400 font-bold">Rate/kg</div>
                  <input
                    type="number"
                    value={trustRatePerKg}
                    onChange={(e) => setTrustRatePerKg(Number(e.target.value))}
                    className="w-full text-center font-mono font-bold text-white bg-[#0E1D16] border border-emerald-500/25 rounded mt-1 py-0.5 text-xs"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30">
                  <div className="text-[10px] text-emerald-300 font-bold">Total Amount</div>
                  <div className="font-mono font-black text-emerald-300 mt-1 text-sm">
                    ₹{(trustWeightKg * trustRatePerKg - trustAdjustment).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Final Settlement Display */}
              <div className="p-3 bg-[#070D0A] text-white rounded-2xl flex items-center justify-between text-xs border border-emerald-500/30">
                <div>
                  <div className="text-[10px] text-zinc-400">Immediate Digital Payout</div>
                  <div className="font-mono font-black text-emerald-400 text-sm">
                    ₹{(trustWeightKg * trustRatePerKg - trustAdjustment).toFixed(2)} UPI Settled
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsReceiptGenerated(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-forest-950 text-xs font-black h-7"
                >
                  {isReceiptGenerated ? '✓ Receipt #8902' : 'Generate'}
                </Button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-400">
              <span>Automatic Moisture/Impurity Lock</span>
              <span className="font-bold text-emerald-400">Direct to UPI Bank</span>
            </div>
          </div>

          {/* 6. GreenLedger – Environmental Impact */}
          <div className="bg-[#0B1510] rounded-3xl border border-emerald-500/25 p-6 shadow-xl space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between text-zinc-100">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-emerald-500/15 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      GreenLedger – Impact
                    </h3>
                    <span className="text-[10px] text-zinc-400">Verified ESG Metric Accounting</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] bg-emerald-950/80 text-emerald-300 border-emerald-500/30">
                  Verified ESG
                </Badge>
              </div>

              {/* 4 Impact Squares */}
              <div className="grid grid-cols-2 gap-2.5 text-center text-xs">
                <div className="p-3 rounded-2xl bg-[#0E1D16] border border-emerald-500/20">
                  <div className="text-base font-black font-mono text-emerald-400">125.6 Tons</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Tons Recycled</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#0E1D16] border border-emerald-500/20">
                  <div className="text-base font-black font-mono text-emerald-400">8,920 KG</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">CO₂ Saved</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#0E1D16] border border-emerald-500/20">
                  <div className="text-base font-black font-mono text-emerald-400">450</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Trees Equivalent</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#0E1D16] border border-emerald-500/20">
                  <div className="text-base font-black font-mono text-emerald-400">2,100</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Households Served</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link href="/impact" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
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
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-6 bg-[#0B1510] border border-emerald-500/30 text-white rounded-3xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-black text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <span>ScrapSetu 2.0 Master Product Architecture Board</span>
                </DialogTitle>
                <p className="text-xs text-zinc-400 mt-1">
                  Full reference art direction uploaded by the project owner (`media_1791919730762_74d15632.jpg`).
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-4 rounded-2xl overflow-hidden border border-emerald-500/20 shadow-md bg-zinc-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/master-design-board.jpg"
              alt="ScrapSetu Master Design Board"
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="mt-4 p-4 rounded-xl bg-[#0E1D16] border border-emerald-500/20 text-xs text-zinc-300 space-y-1">
            <div className="font-bold text-white">Implemented Screen Parity:</div>
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
        <DialogContent className="max-w-3xl p-6 bg-[#0B1510] border border-emerald-500/30 text-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-emerald-400 fill-emerald-400" />
              <span>ScrapSetu Platform Walkthrough & Interactive Demo</span>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-3 aspect-video rounded-2xl bg-[#070D0A] border border-emerald-500/20 overflow-hidden relative flex flex-col items-center justify-center p-6 text-white text-center space-y-4">
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
                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-black text-xs">
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
