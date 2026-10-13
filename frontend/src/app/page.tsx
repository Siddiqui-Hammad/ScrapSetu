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
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';

export default function HomePage() {
  const { demoLoginAs } = useAuthStore();
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>('HOUSEHOLD');

  const roleCards = [
    {
      role: 'HOUSEHOLD' as UserRole,
      title: 'Household',
      desc: 'Book pickups, track collections and earn Green Karma.',
      icon: Home,
      iconBg: 'bg-emerald-50 text-forest-900',
      link: '/household',
      linkLabel: 'Switch to Household →',
    },
    {
      role: 'BUSINESS' as UserRole,
      title: 'Business',
      desc: 'Manage bulk waste and get ESG reports.',
      icon: Building2,
      iconBg: 'bg-blue-50 text-blue-800',
      link: '/business',
      linkLabel: 'Switch to Business →',
    },
    {
      role: 'COLLECTOR' as UserRole,
      title: 'Collector',
      desc: 'Find nearby jobs and earn more.',
      icon: Truck,
      iconBg: 'bg-amber-50 text-amber-800',
      link: '/collector',
      linkLabel: 'Switch to Collector →',
    },
    {
      role: 'RECYCLER' as UserRole,
      title: 'Recycler',
      desc: 'Manage intake, set rates and track processing.',
      icon: Factory,
      iconBg: 'bg-purple-50 text-purple-800',
      link: '/recycler',
      linkLabel: 'Switch to Recycler →',
    },
    {
      role: 'ADMIN' as UserRole,
      title: 'Admin',
      desc: 'Monitor platform, verify users and view impact.',
      icon: ShieldCheck,
      iconBg: 'bg-zinc-100 text-zinc-900',
      link: '/admin',
      linkLabel: 'Switch to Admin →',
    },
  ];

  return (
    <div className="space-y-20 pb-20 bg-[#f8f9fa]">
      {/* 1. HERO SECTION (Exact Match to Mockup Top-Left) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <span>🌿 India&apos;s Circular Economy Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-black tracking-tight text-zinc-950 leading-[1.12]">
              Turning Waste into a Greener Tomorrow
            </h1>

            <p className="text-base text-zinc-600 max-w-lg font-normal leading-relaxed">
              Connecting households, collectors, businesses and recyclers through technology for a cleaner, greener India.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/register">
                <Button size="lg" className="bg-forest-900 hover:bg-forest-950 text-white font-bold px-7 h-12 shadow-md">
                  Get Started
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="bg-white border-zinc-300 text-zinc-800 font-bold px-6 h-12 shadow-2xs hover:bg-zinc-50 flex items-center gap-2">
                  <Play className="w-4 h-4 fill-zinc-800" />
                  <span>Watch Video</span>
                </Button>
              </Link>
            </div>

            {/* Bottom 4 Counters */}
            <div className="pt-6 border-t border-zinc-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-black text-zinc-950 font-mono">50K+</div>
                <div className="text-xs text-zinc-500 font-medium mt-0.5">Happy Users</div>
              </div>
              <div>
                <div className="text-2xl font-black text-zinc-950 font-mono">2,500+</div>
                <div className="text-xs text-zinc-500 font-medium mt-0.5">Pickups Completed</div>
              </div>
              <div>
                <div className="text-2xl font-black text-zinc-950 font-mono">1,200+</div>
                <div className="text-xs text-zinc-500 font-medium mt-0.5">Tons Recycled</div>
              </div>
              <div>
                <div className="text-2xl font-black text-zinc-950 font-mono">5,600+</div>
                <div className="text-xs text-zinc-500 font-medium mt-0.5">KG CO₂ Saved</div>
              </div>
            </div>
          </div>

          {/* Right Hero: Circular City Ecosystem Graphic with Floating Nodes */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-100 p-8 border border-emerald-200/80 shadow-xl min-h-[460px] flex flex-col justify-between">
              {/* Decorative Nature Skyline Backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/80 via-transparent to-transparent pointer-events-none" />

              {/* Node 1: Households (Top Left) */}
              <div className="relative z-10 self-start bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-emerald-100 max-w-[210px] transform hover:scale-105 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-lg shrink-0">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-zinc-950 leading-tight">Households</div>
                    <div className="text-[10px] text-zinc-500">Sort & Book Scrap</div>
                  </div>
                </div>
              </div>

              {/* Node 2: Collectors (Top Right) */}
              <div className="relative z-10 self-end bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-emerald-100 max-w-[210px] transform hover:scale-105 transition-transform mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-forest-900 flex items-center justify-center font-bold text-lg shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-zinc-950 leading-tight">Collectors</div>
                    <div className="text-[10px] text-zinc-500">Pick & Earn Daily</div>
                  </div>
                </div>
              </div>

              {/* Node 3: Recyclers (Center Bottom) */}
              <div className="relative z-10 self-center bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-emerald-100 max-w-[230px] transform hover:scale-105 transition-transform mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-lg shrink-0">
                    <Factory className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-zinc-950 leading-tight">Recyclers</div>
                    <div className="text-[10px] text-zinc-500">Process & Transform</div>
                  </div>
                </div>
              </div>

              {/* Organic Green Flow Ribbon (Bottom Banner) */}
              <div className="relative z-10 mt-6 bg-gradient-to-r from-forest-950 via-forest-900 to-emerald-900 text-white rounded-2xl p-3.5 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <Recycle className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold tracking-wide">A Cleaner Greener India</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-300">100% Traceable Loop</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SWITCH ROLE (DEMO MODE) - Exact Match to Mockup Top-Right */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-md p-6 sm:p-8 space-y-6">
          {/* Header Sub-bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Evaluation Gateway
              </span>
              <h2 className="text-xl font-black text-zinc-950">Switch Role (Demo Mode)</h2>
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
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      isSel
                        ? 'bg-forest-900 text-white shadow-2xs'
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
              return (
                <div
                  key={card.role}
                  className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-emerald-500 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center font-bold`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-zinc-950">{card.title}</h3>
                      <p className="text-[11px] text-zinc-500 leading-snug mt-1">{card.desc}</p>
                    </div>
                  </div>

                  <Link
                    href={card.link}
                    onClick={() => demoLoginAs(card.role)}
                    className="text-xs font-bold text-forest-900 hover:text-emerald-700 flex items-center gap-1 pt-2 border-t border-zinc-200/60"
                  >
                    <span>{card.linkLabel}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. ROW 3 SHOWCASE: THE 6 CIRCULAR INTELLIGENCE WORKFLOWS (Exact Match to Mockup Bottom Row) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
            Core Technology Suite
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
            Six Specialized Circular Intelligence Engines
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600">
            From computer vision material detection to cryptographic waste passports and real-time weighbridge settlements.
          </p>
        </div>

        {/* 6 Engine Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. ScrapVision AI Detection */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-2.5">
              <Camera className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950">
                ScrapVision – AI Material Detection
              </h3>
            </div>
            {/* Visual detection mock */}
            <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-200/80 space-y-2 text-xs">
              <div className="text-[11px] font-bold text-zinc-700">AI Analysis Result</div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold">Plastic (PET)</span>
                  <span className="font-mono font-bold text-forest-900">72%</span>
                </div>
                <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[72%]" />
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold">Aluminium</span>
                  <span className="font-mono font-bold text-forest-900">18%</span>
                </div>
                <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[18%]" />
                </div>
              </div>
            </div>
            <div className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
              ✓ High Confidence: This looks like PET plastic bottles
            </div>
          </div>

          {/* 2. EcoRoute Smart Route Planning */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-2.5">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950">
                EcoRoute – Smart Route Planning
              </h3>
            </div>
            <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-200/80 text-xs space-y-2">
              <div className="font-bold text-zinc-800">Optimal Route: 4 stops • 12.5 km (~2h 10m)</div>
              <div className="space-y-1 text-[11px] text-zinc-600 font-medium">
                <div>1. Pickup - Green Park (2.1 km • ~15 kg)</div>
                <div>2. Pickup - Tech Park (3.4 km • ~40 kg)</div>
                <div>3. Drop - Recycler Facility (1.8 km)</div>
              </div>
            </div>
            <div className="flex justify-between items-center text-[11px] font-bold text-zinc-700">
              <span>Vehicle Load: 320 / 500 kg</span>
              <span className="text-emerald-700">38% Fuel Saved</span>
            </div>
          </div>

          {/* 3. ScrapRate Live Market Pricing */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-2.5">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950">
                ScrapRate – Live Market Pricing
              </h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-1.5 rounded-lg bg-zinc-50 border border-zinc-100">
                <span className="font-bold text-zinc-800">Plastic (PET)</span>
                <span className="font-mono font-bold text-forest-900">₹25 - 45/kg</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 rounded">+12%</span>
              </div>
              <div className="flex justify-between items-center p-1.5 rounded-lg bg-zinc-50 border border-zinc-100">
                <span className="font-bold text-zinc-800">Cardboard (Gatta)</span>
                <span className="font-mono font-bold text-forest-900">₹10 - 20/kg</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 rounded">+5%</span>
              </div>
              <div className="flex justify-between items-center p-1.5 rounded-lg bg-zinc-50 border border-zinc-100">
                <span className="font-bold text-zinc-800">Copper Wire</span>
                <span className="font-mono font-bold text-forest-900">₹650 - 710/kg</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 rounded">+8%</span>
              </div>
            </div>
            <div className="text-[10px] text-zinc-400">Rate Last Updated: Today, 10:30 AM IST</div>
          </div>

          {/* 4. Waste Passport – Material Traceability */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950">
                  Waste Passport Traceability
                </h3>
              </div>
              <span className="font-mono text-[10px] font-bold text-zinc-400">WP-2024-00124</span>
            </div>
            <div className="space-y-2 text-xs relative pl-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-300">
              <div className="relative">
                <div className="font-bold text-zinc-950">Booked by Household</div>
                <div className="text-[10px] text-zinc-500">12 Jun 2024 - 10:00 AM</div>
              </div>
              <div className="relative">
                <div className="font-bold text-zinc-950">Collected by Ramesh (RS01)</div>
                <div className="text-[10px] text-zinc-500">12 Jun 2024 - 02:15 PM • 15 kg</div>
              </div>
              <div className="relative">
                <div className="font-bold text-zinc-950">Recycled into New Product</div>
                <div className="text-[10px] text-emerald-700 font-semibold">20 Jun 2024 - Completed ✓</div>
              </div>
            </div>
          </div>

          {/* 5. TrustWeigh – Transaction */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-2.5">
              <Scale className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950">
                TrustWeigh – Transaction
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200/80">
                <div className="text-[10px] text-zinc-500">Actual Weight</div>
                <div className="font-mono font-bold text-zinc-950 mt-0.5">15.0 kg</div>
              </div>
              <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200/80">
                <div className="text-[10px] text-zinc-500">Rate per kg</div>
                <div className="font-mono font-bold text-zinc-950 mt-0.5">₹25</div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-100/70 border border-emerald-300">
                <div className="text-[10px] text-forest-900 font-bold">Total Amount</div>
                <div className="font-mono font-black text-forest-900 mt-0.5">₹375</div>
              </div>
            </div>
            <div className="p-2.5 bg-forest-950 text-white rounded-xl flex items-center justify-between text-xs">
              <span>Final Settlement:</span>
              <span className="font-mono font-black text-emerald-300 text-sm">₹375.00 Settled</span>
            </div>
          </div>

          {/* 6. GreenLedger – Environmental Impact */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-2.5">
              <Leaf className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950">
                GreenLedger – Impact
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200">
                <div className="text-sm font-black font-mono text-forest-900">125.6 Tons</div>
                <div className="text-[10px] text-zinc-600 mt-0.5">Tons Recycled</div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200">
                <div className="text-sm font-black font-mono text-forest-900">8,920 KG</div>
                <div className="text-[10px] text-zinc-600 mt-0.5">CO₂ Saved</div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200">
                <div className="text-sm font-black font-mono text-forest-900">450</div>
                <div className="text-[10px] text-zinc-600 mt-0.5">Trees Equivalent</div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200">
                <div className="text-sm font-black font-mono text-forest-900">2,100</div>
                <div className="text-[10px] text-zinc-600 mt-0.5">Households Served</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
