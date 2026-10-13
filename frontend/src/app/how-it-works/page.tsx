'use client';

import React from 'react';
import Link from 'next/link';
import {
  Recycle,
  Sparkles,
  MapPin,
  Scale,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  Truck,
  Building2,
  Factory,
  Database,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HowItWorksPage() {
  const steps = [
    {
      step: '01',
      title: 'ScrapVision AI Recognition & Instant Mandi Estimate',
      desc: 'Snap a smartphone photo of your scrap pile. Our deep neural vision model detects material categories (e.g. Copper, PET, Brass, Kraft Gatta), estimates density, and calculates instant payout based on today’s live Mandi benchmark.',
      icon: Sparkles,
      color: 'bg-emerald-600',
    },
    {
      step: '02',
      title: 'EcoRoute Smart Pickup Dispatch & TSP Optimization',
      desc: 'Your request is grouped into optimized vehicle route clusters using the Travelling Salesperson Problem (TSP). Verified neighborhood kabadiwalas receive fuel-efficient route orders on their mobile terminal.',
      icon: MapPin,
      color: 'bg-amber-600',
    },
    {
      step: '03',
      title: 'TrustWeigh Calibrated Scale & SHA-256 Tamper-Proof Seal',
      desc: 'The collector weighs the scrap on a certified digital scale. Gross weight, tare weight, and deductions are locked cryptographically with an unalterable SHA-256 hash. Generator receives direct UPI payout immediately.',
      icon: Scale,
      color: 'bg-blue-600',
    },
    {
      step: '04',
      title: 'Digital Waste Passport & Recycler Cradle-to-Gate Batching',
      desc: 'The sorted material is delivered to CPCB registered recyclers with a unique batch QR code. The passport traces the complete journey from citizen doorstep to recycled granulate, issuing audited EPR credits.',
      icon: QrCode,
      color: 'bg-purple-600',
    },
  ];

  const roleWalkthroughs = [
    {
      role: 'Households & Citizens',
      icon: UserCheck,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      bullets: [
        'Zero-charge doorstep collection for paper, plastics, metals, appliances',
        'ScrapVision AI photo valuation so you know exact fair price before pickup',
        'No rigged spring scales; verified digital weighbridge readings',
        'Instant UPI payments straight to PhonePe, Google Pay, or Paytm',
      ],
      ctaLink: '/household',
      ctaText: 'Explore Household Portal',
    },
    {
      role: 'Kabadiwalas & Micro-Collectors',
      icon: Truck,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      bullets: [
        'Bilingual mobile interface in Hindi (हिंदी) and English',
        'Guaranteed daily collection routes reducing empty travel by 38%',
        'Transparent wholesale margins when unloading at certified recycling plants',
        'Formal credit history and micro-insurance eligibility via verified KYC',
      ],
      ctaLink: '/collector',
      ctaText: 'Explore Kabadiwala Terminal',
    },
    {
      role: 'Enterprises & Bulk Generators',
      icon: Building2,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      bullets: [
        'Scheduled bulk pickups for IT hardware, corrugated packaging, and metals',
        'GST-compliant digital invoices and destruction certificates',
        'Automated ESG and Scope 3 greenhouse gas avoidance telemetry',
        'Direct EPR credit compliance tracking for annual sustainability audits',
      ],
      ctaLink: '/business',
      ctaText: 'Explore Enterprise Portal',
    },
    {
      role: 'Authorized Recyclers',
      icon: Factory,
      color: 'text-purple-700 bg-purple-50 border-purple-200',
      bullets: [
        'Continuous, pre-segregated raw material supply without informal middlemen markups',
        'Automated weighbridge slip generation with gross, tare, and net weights',
        'Dynamic buying rate sheet manager broadcast to all regional collectors',
        'Audit-ready CPCB compliance records linked to Digital Waste Passports',
      ],
      ctaLink: '/recycler',
      ctaText: 'Explore Recycler Dashboard',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="emerald" className="text-xs font-bold px-3 py-1">
            End-to-End Circular Architecture
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            How ScrapSetu 2.0 Works
          </h1>
          <p className="text-sm text-stone-600">
            A trusted digital infrastructure transforming India’s $14B informal recycling sector
            with artificial intelligence, transparent pricing, and cryptographic verification.
          </p>
        </div>

        {/* 4 Pillars Progression Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.step} className="border-stone-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-stone-300">
                      {s.step}
                    </span>
                    <div className={`w-10 h-10 rounded-xl ${s.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 leading-snug mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Role by Role Tailored Workflows */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-stone-900">
              Tailored Experiences for Every Stakeholder
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Four specialized portals connected in a synchronized, transparent loop
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roleWalkthroughs.map((rw) => {
              const Icon = rw.icon;
              return (
                <Card key={rw.role} className={`border ${rw.color} shadow-sm`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white shadow-xs">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold text-stone-900">
                          {rw.role}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Dedicated portal & custom tools
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-2">
                    <ul className="space-y-2 text-xs text-stone-700">
                      {rw.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2">
                      <Link href={rw.ctaLink}>
                        <Button variant="outline" size="sm" className="w-full text-xs font-bold hover:bg-stone-100">
                          {rw.ctaText}
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Security, Free Database & Compliance Transparency Card */}
        <Card className="border-stone-200 bg-emerald-950 text-white rounded-3xl p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>3-Point KYC Verification</span>
              </div>
              <h3 className="text-base font-bold text-white">
                Aadhaar + DL + Live Selfie
              </h3>
              <p className="text-xs text-stone-300">
                Every collector and recycler undergoes multi-point identity verification and live face
                matching before receiving collection orders.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Lock className="w-4 h-4" />
                <span>Cryptographic SHA-256 Ledger</span>
              </div>
              <h3 className="text-base font-bold text-white">
                Tamper-Proof Weight Records
              </h3>
              <p className="text-xs text-stone-300">
                Weights and payouts are cryptographically signed upon scale confirmation, preventing
                after-the-fact rate tampering or weight skimming.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <Database className="w-4 h-4" />
                <span>Free Cloud Database Connectivity</span>
              </div>
              <h3 className="text-base font-bold text-white">
                MongoDB Atlas / Supabase / Neon
              </h3>
              <p className="text-xs text-stone-300">
                Zero infrastructure cost for production deployment. Seamless 1-click cloud sync with
                free-tier PostgreSQL, SQLite, or MongoDB Atlas data buses.
              </p>
            </div>
          </div>
        </Card>

        {/* Bottom CTA */}
        <div className="text-center bg-stone-100 rounded-3xl p-8 border border-stone-200 space-y-4">
          <h2 className="text-2xl font-black text-stone-900">
            Ready to Join the Circular Economy?
          </h2>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            Sign up in less than 2 minutes and experience fair pricing, smart pickup scheduling, and verified environmental impact.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="font-bold shadow-md">
                Register as Citizen or Business
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="font-bold">
                Sign In to Existing Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
