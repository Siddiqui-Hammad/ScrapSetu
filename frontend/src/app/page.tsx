'use client';

import React, { useState } from 'react';
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
  Building2,
  Factory,
  Home,
  QrCode,
  Calculator,
  ChevronRight,
  BarChart3,
  Award,
  Globe2,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { formatINR } from '../lib/utils';
import { useAuthStore } from '../store/authStore';

export default function HomePage() {
  const { demoLoginAs } = useAuthStore();

  // Calculator State
  const [calcMaterial, setCalcMaterial] = useState<'paper' | 'plastic' | 'copper' | 'iron'>('paper');
  const [calcWeight, setCalcWeight] = useState(30);

  const materialRates = {
    paper: { name: 'Kraft Carton & Paper', rate: 15.5, co2PerKg: 1.35, unit: 'kg' },
    plastic: { name: 'Rigid Plastics (PET/HDPE)', rate: 28.0, co2PerKg: 1.80, unit: 'kg' },
    copper: { name: 'Copper Wire (Millberry)', rate: 685.0, co2PerKg: 9.10, unit: 'kg' },
    iron: { name: 'Heavy Structural Iron', rate: 34.0, co2PerKg: 1.50, unit: 'kg' },
  };

  const currentMat = materialRates[calcMaterial];
  const calculatedEarnings = currentMat.rate * calcWeight;
  const calculatedCo2 = (currentMat.co2PerKg * calcWeight).toFixed(1);

  const mandiTicker = [
    { name: 'Copper Wire (Millberry)', rate: '₹685/kg', trend: '+2.4%', isUp: true },
    { name: 'Brass / Pital Utensils', rate: '₹460/kg', trend: '+1.1%', isUp: true },
    { name: 'Aluminium Extrusions', rate: '₹165/kg', trend: '-0.8%', isUp: false },
    { name: 'PET Bottles (Clean Optical)', rate: '₹28/kg', trend: '+3.2%', isUp: true },
    { name: 'Kraft Corrugated Carton', rate: '₹15.5/kg', trend: '+1.3%', isUp: true },
    { name: 'Heavy Structural Iron (HMS)', rate: '₹34/kg', trend: '+0.5%', isUp: true },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Live Commodity Mandi Ticker Bar */}
      <section className="bg-zinc-900 text-zinc-300 border-b border-zinc-800 text-xs py-2 px-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 whitespace-nowrap">
          <div className="flex items-center gap-2 font-bold text-emerald-400 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="uppercase tracking-wider text-[11px]">National Mandi Benchmark:</span>
          </div>
          <div className="flex items-center gap-6 overflow-x-auto text-[11px]">
            {mandiTicker.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 font-medium">
                <span className="text-zinc-400">{item.name}</span>
                <span className="font-bold text-white font-mono">{item.rate}</span>
                <span className={item.isUp ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                  {item.trend}
                </span>
              </div>
            ))}
          </div>
          <Link href="/rates" className="text-emerald-400 hover:text-emerald-300 font-semibold shrink-0 text-[11px] underline">
            Full Index →
          </Link>
        </div>
      </section>

      {/* 2. Hero Section: Editorial & Bold */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-forest-900 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>National Circular Economy Logistics Network</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 leading-[1.08]">
              Transforming India&apos;s scrap economy with{' '}
              <span className="text-forest-900 underline decoration-emerald-400 decoration-wavy decoration-2">
                circular intelligence.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 max-w-xl font-normal leading-relaxed">
              ScrapSetu bridges households, commercial generators, informal kabadiwalas, and authorized recycling facilities with transparent wholesale pricing, AI material identification, and cryptographically verified digital weighbridges.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/household">
                <Button size="lg" variant="primary" className="font-bold shadow-md">
                  Book Doorstep Pickup
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="font-bold">
                  Explore Circular Architecture
                </Button>
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-6 border-t border-zinc-200/80 flex flex-wrap items-center gap-6 text-xs text-zinc-600 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-forest-900" />
                <span>3-Point KYC Partners</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-forest-900" />
                <span>TrustWeigh™ Calibrated Scales</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-forest-900" />
                <span>CPCB Traceable Credits</span>
              </div>
            </div>
          </div>

          {/* Hero Interactive Calculator Widget */}
          <div className="lg:col-span-5">
            <div className="circular-card p-6 sm:p-7 bg-white relative overflow-hidden border border-zinc-200 shadow-lg">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-forest-900" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Instant Scrap Valuation
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-forest-900 px-2 py-0.5 rounded-full">
                  Live Mandi
                </span>
              </div>

              <div className="space-y-5 pt-4">
                {/* Material Selectors */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-2">Select Scrap Category:</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(['paper', 'plastic', 'copper', 'iron'] as const).map((key) => {
                      const isSel = calcMaterial === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setCalcMaterial(key)}
                          className={`p-2 rounded-xl text-left font-bold transition-all border ${
                            isSel
                              ? 'bg-emerald-50 border-emerald-500 text-forest-900 ring-1 ring-emerald-400'
                              : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                          }`}
                        >
                          <div className="text-[11px] truncate">{materialRates[key].name}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">₹{materialRates[key].rate}/kg</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Weight Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-zinc-700 mb-1.5">
                    <span>Estimated Weight:</span>
                    <span className="font-mono text-forest-900 text-sm font-black">{calcWeight} kg</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="150"
                    step="5"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(Number(e.target.value))}
                    className="w-full accent-forest-900 h-2 bg-zinc-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                    <span>5 kg</span>
                    <span>75 kg</span>
                    <span>150 kg+</span>
                  </div>
                </div>

                {/* Result Box */}
                <div className="bg-forest-950 text-white rounded-2xl p-4 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-emerald-200">Doorstep Cash Payout:</span>
                    <span className="text-3xl font-black font-mono text-emerald-300">
                      {formatINR(calculatedEarnings)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-300 pt-1 border-t border-emerald-900/60">
                    <span>Greenhouse Gas Mitigated:</span>
                    <span className="font-bold text-emerald-400">{calculatedCo2} kg CO₂e</span>
                  </div>
                </div>

                <Link href="/household" className="block">
                  <Button variant="default" className="w-full font-bold shadow-sm">
                    Book Doorstep Pickup for This Scrap
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Cradle-to-Gate Recyclable Journey */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
            End-to-End Traceability
          </span>
          <h2 className="text-3xl font-black text-zinc-950 tracking-tight">
            How Material Flows Through ScrapSetu
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600">
            Four synchronized touchpoints ensuring transparent pricing, fuel efficiency, and CPCB audit compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="circular-card p-6 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-forest-900 flex items-center justify-center font-black text-sm">
              01
            </div>
            <h3 className="text-sm font-bold text-zinc-950">AI ScrapVision Scan</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Citizens or businesses take a quick photo. Deep learning classifies polymers and alloys, estimating weight and fair Mandi price.
            </p>
          </div>

          {/* Step 2 */}
          <div className="circular-card p-6 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-forest-900 flex items-center justify-center font-black text-sm">
              02
            </div>
            <h3 className="text-sm font-bold text-zinc-950">EcoRoute TSP Dispatch</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Requests are clustered into optimal collector routes using Travelling Salesperson algorithms, eliminating 38% of empty mileage.
            </p>
          </div>

          {/* Step 3 */}
          <div className="circular-card p-6 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-forest-900 flex items-center justify-center font-black text-sm">
              03
            </div>
            <h3 className="text-sm font-bold text-zinc-950">TrustWeigh Digital Seal</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Collector weighs on a calibrated digital scale. Tare and gross weights are sealed cryptographically with SHA-256 for instant UPI payout.
            </p>
          </div>

          {/* Step 4 */}
          <div className="circular-card p-6 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-forest-900 flex items-center justify-center font-black text-sm">
              04
            </div>
            <h3 className="text-sm font-bold text-zinc-950">Recycler Waste Passport</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Aggregated lots are transferred to authorized CPCB recycling plants with batch QR passports, generating traceable EPR credits.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Five Distinct Portals Showcase (Asymmetric Architectural Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
            Tailored Experiences
          </span>
          <h2 className="text-3xl font-black text-zinc-950 tracking-tight">
            Specialized Portals for Every Stakeholder
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600">
            Each role interacts through an interface purpose-built for their actual working environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Household Portal */}
          <div className="circular-card p-6 flex flex-col justify-between hover:border-emerald-500">
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-forest-900 w-fit">
                <Home className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-950">Households & Citizens</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Zero-charge doorstep collection, ScrapVision photo estimation, live neighborhood collector tracking, and instant digital payments.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/household">
                <Button variant="outline" size="sm" className="w-full font-bold">
                  Open Household Portal →
                </Button>
              </Link>
            </div>
          </div>

          {/* Kabadiwala Terminal */}
          <div className="circular-card p-6 flex flex-col justify-between hover:border-emerald-500 bg-emerald-50/30">
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-forest-900 text-white w-fit">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-950">Kabadiwala Terminal</h3>
                <span className="text-[10px] bg-forest-900 text-white px-2 py-0.5 rounded font-bold">Mobile-First</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                High-contrast operational terminal in Hindi and English with daily capacity gauges, 1-tap accept, and TrustWeigh digital weighing slips.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/collector">
                <Button variant="primary" size="sm" className="w-full font-bold">
                  Open Collector Terminal →
                </Button>
              </Link>
            </div>
          </div>

          {/* Commercial Business */}
          <div className="circular-card p-6 flex flex-col justify-between hover:border-emerald-500">
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-800 w-fit">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-950">Commercial Bulk Generators</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Scheduled warehouse dispatch, recurring subscriptions, GST tax invoices, and automated Scope 3 ESG greenhouse gas compliance export.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/business">
                <Button variant="outline" size="sm" className="w-full font-bold">
                  Open Enterprise Portal →
                </Button>
              </Link>
            </div>
          </div>

          {/* Recycler Mill */}
          <div className="circular-card p-6 flex flex-col justify-between hover:border-emerald-500">
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-800 w-fit">
                <Factory className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-950">Authorized Recycler Facilities</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Wholesale buying rate sheet manager, industrial weighbridge intake passes, output granulate batching, and CPCB license synchronization.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/recycler">
                <Button variant="outline" size="sm" className="w-full font-bold">
                  Open Recycler Desk →
                </Button>
              </Link>
            </div>
          </div>

          {/* Administrator Console */}
          <div className="circular-card p-6 flex flex-col justify-between lg:col-span-2 bg-zinc-900 text-white">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 w-fit">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Platform Governance
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Administrator Regulatory Console</h3>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-lg">
                Calm, high-density operational control center featuring 3-Point KYC inspection queue (Aadhaar, DL, Live Selfie), live Mandi price governance, EcoShield fraud review, and free cloud database connectivity.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/admin">
                <Button variant="gold" size="sm" className="font-bold">
                  Open Administrator Console →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Verified Climate Impact Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              National Sustainability Telemetry
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Measurable ecological impact across Indian urban wards.
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200">
              Every scrap intake is validated against virgin feedstock substitution lifecycle models (IPCC 2024 Guidelines).
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-emerald-900/80 mt-8">
            <div>
              <div className="text-3xl font-black font-mono text-emerald-300">2,845.9 MT</div>
              <div className="text-xs text-emerald-200 mt-1">Dry Recyclables Diverted</div>
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-emerald-300">4,268 MT</div>
              <div className="text-xs text-emerald-200 mt-1">CO₂e Emissions Avoided</div>
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-emerald-300">38,420</div>
              <div className="text-xs text-emerald-200 mt-1">Forest Trees Preserved</div>
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-emerald-300">₹5.49 Cr</div>
              <div className="text-xs text-emerald-200 mt-1">Direct Citizen & SME Payouts</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
