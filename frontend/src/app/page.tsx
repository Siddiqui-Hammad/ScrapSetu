'use client';

import React from 'react';
import Link from 'next/link';
import {
  Recycle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Scale,
  MapPin,
  TrendingUp,
  Leaf,
  CheckCircle2,
  Truck,
  Building,
  Factory,
  Home,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { formatINR } from '../lib/utils';
import { useAuthStore } from '../store/authStore';

export default function HomePage() {
  const { demoLoginAs } = useAuthStore();

  const mandiTicker = [
    { cat: 'Paper & Cardboard', hindi: 'कागज़ और रद्दी', rate: '₹14.00/kg', trend: '+₹1.20', isUp: true },
    { cat: 'Rigid Plastics (PET)', hindi: 'प्लास्टिक की बोतलें', rate: '₹18.50/kg', trend: '+₹0.80', isUp: true },
    { cat: 'Ferrous Metals (Iron)', hindi: 'लोहा और स्टील', rate: '₹30.00/kg', trend: '-₹0.50', isUp: false },
    { cat: 'Copper Wiring', hindi: 'तांबा और केबल', rate: '₹550.00/kg', trend: '+₹15.00', isUp: true },
    { cat: 'E-Waste (Motherboard)', hindi: 'ई-कचरा / इलेक्ट्रॉनिक्स', rate: '₹45.00/kg', trend: '+₹3.50', isUp: true },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-forest-900 to-forest-950 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="max-w-7xl mx-auto relative z-10 space-y-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Empowering India's Informal Recycling Ecosystem with AI & Web3 Ledger</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                A Digital Bridge to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-mint-200 to-emerald-200">
                  Sustainable Recycling
                </span>
              </h1>
              <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl font-normal leading-relaxed">
                ScrapSetu connects households, bulk waste commercial generators, informal kabadiwalas, and authorized recycling plants with transparent Mandi pricing, AI waste vision, and tamper-proof SHA-256 receipts.
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                <Link href="/household">
                  <Button size="lg" variant="default" className="text-sm font-bold shadow-glow-emerald">
                    <span>Schedule Scrap Pickup</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
                <Link href="/rates">
                  <Button size="lg" variant="secondary" className="text-sm font-bold">
                    <span>Explore Live Mandi Rates</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-emerald-800/80 flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs text-emerald-200/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>3-Point KYC Verified Kabadiwalas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  <span>TrustWeigh™ Digital Accuracy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  <span>CPCB EPR & ESG Compliant</span>
                </div>
              </div>
            </div>

            {/* Quick Hero Floating Metric Card */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Live Circular Network Pulse
                  </span>
                  <Badge variant="success">Rajasthan & NCR</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-700/50">
                    <div className="text-2xl font-extrabold text-white">5,480 kg</div>
                    <div className="text-xs text-emerald-300 font-medium">Diverted from Landfills</div>
                  </div>
                  <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-700/50">
                    <div className="text-2xl font-extrabold text-white">₹78,450</div>
                    <div className="text-xs text-emerald-300 font-medium">Cash Paid to Citizens</div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-700/40 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-emerald-200">
                    <span>Greenhouse Gas Abatement:</span>
                    <span className="font-bold text-white">8,220 kg CO₂e Saved</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-200">
                    <span>Equivalent Trees Saved:</span>
                    <span className="font-bold text-white">94 Mature Trees 🌲</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Mandi Benchmark Rates Ticker */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-card-subtle flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-900 shrink-0">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>Mandi Scrap Index (North India):</span>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto text-xs py-1">
            {mandiTicker.map((m, idx) => (
              <div key={idx} className="flex items-center gap-2 whitespace-nowrap">
                <span className="font-bold text-stone-800">{m.cat}</span>
                <span className="text-emerald-900 font-extrabold">{m.rate}</span>
                <span className={`text-[10px] font-bold ${m.isUp ? 'text-emerald-600' : 'text-stone-400'}`}>
                  {m.trend}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Dedicated Role Portals Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="secondary">Tailored SaaS Dashboards</Badge>
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            Designed for Every Stakeholder in the Circular Chain
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-medium">
            No one-size-fits-all forms. Each role has a specialized operational terminal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Household */}
          <Card className="hover:border-emerald-500/60 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shadow-xs">
                🏠
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Household Generator</h3>
                <p className="text-xs text-stone-500 font-medium mt-1">
                  Book doorstep pickups, snap photos with ScrapVision AI, and earn fair Mandi cash.
                </p>
              </div>
              <ul className="text-xs text-stone-600 space-y-1.5 pt-2 border-t border-stone-100">
                <li className="flex items-center gap-1.5">✓ ScrapVision™ Auto-detection</li>
                <li className="flex items-center gap-1.5">✓ Real-time collector ETA radar</li>
                <li className="flex items-center gap-1.5">✓ Green Karma eco-points</li>
              </ul>
              <Link href="/household" className="block pt-2">
                <Button variant="secondary" size="sm" className="w-full">
                  Launch Household Portal
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card 2: Collector */}
          <Card className="hover:border-emerald-500/60 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-xl shadow-xs">
                🛺
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Kabadiwala Terminal</h3>
                <p className="text-xs text-stone-500 font-medium mt-1">
                  Mobile-first, high-contrast, bilingual terminal with daily capacity meter & TSP route planner.
                </p>
              </div>
              <ul className="text-xs text-stone-600 space-y-1.5 pt-2 border-t border-stone-100">
                <li className="flex items-center gap-1.5">✓ EcoRoute™ TSP Multi-stop planner</li>
                <li className="flex items-center gap-1.5">✓ TrustWeigh™ Digital scale entry</li>
                <li className="flex items-center gap-1.5">✓ Daily earnings & Mandi comparison</li>
              </ul>
              <Link href="/collector" className="block pt-2">
                <Button variant="secondary" size="sm" className="w-full">
                  Launch Collector Terminal
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card 3: Business */}
          <Card className="hover:border-emerald-500/60 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center text-xl shadow-xs">
                🏢
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Commercial Generator</h3>
                <p className="text-xs text-stone-500 font-medium mt-1">
                  Manage recurring warehouse & corporate pickups, multi-branch dispatch, and EPR audits.
                </p>
              </div>
              <ul className="text-xs text-stone-600 space-y-1.5 pt-2 border-t border-stone-100">
                <li className="flex items-center gap-1.5">✓ Multi-branch dispatch scheduling</li>
                <li className="flex items-center gap-1.5">✓ GST invoices & weighbridge logs</li>
                <li className="flex items-center gap-1.5">✓ Exportable ESG & EPR certificates</li>
              </ul>
              <Link href="/business" className="block pt-2">
                <Button variant="secondary" size="sm" className="w-full">
                  Launch Business Portal
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card 4: Recycler */}
          <Card className="hover:border-emerald-500/60 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center text-xl shadow-xs">
                🏭
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Authorized Recycler</h3>
                <p className="text-xs text-stone-500 font-medium mt-1">
                  Publish factory buying rates, record weighbridge gate slips, and track circular processing.
                </p>
              </div>
              <ul className="text-xs text-stone-600 space-y-1.5 pt-2 border-t border-stone-100">
                <li className="flex items-center gap-1.5">✓ Live buying rate sheet publisher</li>
                <li className="flex items-center gap-1.5">✓ Weighbridge gross/tare slip maker</li>
                <li className="flex items-center gap-1.5">✓ CPCB environmental licensing status</li>
              </ul>
              <Link href="/recycler" className="block pt-2">
                <Button variant="secondary" size="sm" className="w-full">
                  Launch Recycler Portal
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4-Step Interactive Workflow */}
      <section className="bg-stone-100/80 py-16 px-4 sm:px-6 lg:px-8 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              End-to-End Circular Recycling in 4 Steps
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              From household doorstep to verified factory smelting with cryptographic audit trail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-stone-200/90 shadow-card-subtle space-y-3">
              <span className="text-2xl font-black text-emerald-700">01</span>
              <h3 className="font-bold text-stone-900 text-sm">Create Pickup & AI Scan</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                User selects scrap items or snaps an image with ScrapVision AI for instant category & Mandi estimation.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-stone-200/90 shadow-card-subtle space-y-3">
              <span className="text-2xl font-black text-emerald-700">02</span>
              <h3 className="font-bold text-stone-900 text-sm">Smart Collector Matching</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Nearest verified kabadiwala receives the job via EcoRoute TSP, accepting with ETA and fuzzed privacy.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-stone-200/90 shadow-card-subtle space-y-3">
              <span className="text-2xl font-black text-emerald-700">03</span>
              <h3 className="font-bold text-stone-900 text-sm">TrustWeigh™ & Receipt</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Net weight is confirmed, agreed rate settled, and a tamper-evident SHA-256 digital receipt is chained.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-stone-200/90 shadow-card-subtle space-y-3">
              <span className="text-2xl font-black text-emerald-700">04</span>
              <h3 className="font-bold text-stone-900 text-sm">Waste Passport™ & EPR</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Scrap batch arrives at CPCB authorized mill for weighbridge intake, closing the circular loop with ESG points.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
