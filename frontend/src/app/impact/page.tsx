'use client';

import React from 'react';
import Link from 'next/link';
import {
  Leaf,
  Droplets,
  Trees,
  TrendingUp,
  ShieldCheck,
  Download,
  Building2,
  Globe2,
  Recycle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GreenLedgerECharts } from '@/components/charts/GreenLedgerECharts';
import { formatKg, formatINR } from '@/lib/utils';

export default function GreenImpactPage() {
  const globalImpact = {
    totalWasteDivertedKg: 2845920,
    co2AvoidedTons: 4268,
    treesPreserved: 38420,
    waterSavedLiters: '14.2M',
    informalLivelihoodsEnabled: 1420,
    directPayoutDisbursed: 54982400,
  };

  const sdgGoals = [
    { number: '11', title: 'Sustainable Cities & Communities', desc: 'Eliminating illegal dumpsites and open burning in urban wards' },
    { number: '12', title: 'Responsible Consumption & Production', desc: 'Promoting closed-loop material recycling and EPR compliance' },
    { number: '13', title: 'Climate Action', desc: 'Direct greenhouse gas mitigation verified against virgin raw material lifecycle' },
    { number: '8', title: 'Decent Work & Economic Growth', desc: 'Formalizing informal waste pickers with digital identity, safety & fair pay' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Globe2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>GreenLedger National Sustainability Telemetry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Measurable Environmental & Circular Impact
          </h1>
          <p className="text-sm text-stone-600">
            Real-time, audited ecological metrics tracking carbon offset, landfill diversion, and socio-economic inclusion across India.
          </p>
        </div>

        {/* Global Impact Counter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border-emerald-200 bg-gradient-to-br from-emerald-900 to-forest-950 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <Recycle className="w-4 h-4 text-emerald-400" />
                  Landfill Diversion
                </span>
                <Badge variant="emerald" className="text-[10px]">Audited</Badge>
              </div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-emerald-100">
                2,845.9 MT
              </div>
              <p className="text-xs text-emerald-300 mt-2">
                2,845,920 kg of solid dry recyclables successfully redirected to verified recycling facilities.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-900 to-sky-950 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-xs font-bold text-blue-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-blue-400" />
                  CO₂e Emissions Prevented
                </span>
                <Badge variant="blue" className="text-[10px]">IPCC Model</Badge>
              </div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-blue-100">
                4,268 MT
              </div>
              <p className="text-xs text-blue-300 mt-2">
                Avoided greenhouse gases calculated vs virgin polymer and primary bauxite/iron smelting.
              </p>
            </CardContent>
          </Card>

          <Card className="border-teal-200 bg-gradient-to-br from-teal-900 to-stone-900 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-xs font-bold text-teal-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <Trees className="w-4 h-4 text-teal-400" />
                  Mature Trees Preserved
                </span>
                <Badge variant="teal" className="text-[10px]">Paper Circularity</Badge>
              </div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-teal-100">
                38,420 Trees
              </div>
              <p className="text-xs text-teal-300 mt-2">
                Conserved forest cover through corrugated carton and white paper recovery loops.
              </p>
            </CardContent>
          </Card>

          <Card className="border-cyan-200 bg-white shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-600 mb-1">
                <Droplets className="w-4 h-4 text-cyan-600" />
                <span>Industrial Water Conserved</span>
              </div>
              <div className="text-2xl font-black text-stone-900 font-mono">
                {globalImpact.waterSavedLiters} Litres
              </div>
              <div className="text-xs text-stone-500 mt-1">
                Saved compared to pulp milling and plastic synthesis
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-white shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-600 mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Informal Livelihoods Formalized</span>
              </div>
              <div className="text-2xl font-black text-stone-900 font-mono">
                1,420 Kabadiwalas
              </div>
              <div className="text-xs text-stone-500 mt-1">
                Equipped with TrustWeigh hardware, UPI payout, and health coverage
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-white shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-600 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Direct Citizen & SME Payouts</span>
              </div>
              <div className="text-2xl font-black text-emerald-950 font-mono">
                {formatINR(globalImpact.directPayoutDisbursed)}
              </div>
              <div className="text-xs text-stone-500 mt-1">
                100% digital instant payments without commission deductions
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive GreenLedger ECharts Visualizations */}
        <GreenLedgerECharts />

        {/* Corporate EPR & ESG Audit Section */}
        <Card className="border-stone-200 bg-stone-900 text-white overflow-hidden shadow-xl">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <Badge variant="emerald" className="text-xs font-bold">
                  Corporate ESG & EPR Portal
                </Badge>
                <h3 className="text-2xl font-black text-white">
                  Need Extended Producer Responsibility (EPR) Credit Certificates?
                </h3>
                <p className="text-xs text-stone-300">
                  ScrapSetu produces tamper-proof, CPCB-audited recycling credit certificates for
                  plastic packaging (Cat I, II, III, IV), e-waste, and battery waste compliance.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link href="/business">
                  <Button variant="outline" className="text-white border-stone-600 hover:bg-stone-800 text-xs w-full sm:w-auto font-bold">
                    View Enterprise Dashboard
                  </Button>
                </Link>
                <Button className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold w-full sm:w-auto shadow-md">
                  <Download className="w-4 h-4 mr-1.5" />
                  Download Sample ESG Audit Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* UN SDG Alignment Grid */}
        <div>
          <div className="text-center mb-6">
            <h2 className="text-xl font-black text-stone-900">
              Aligned with United Nations Sustainable Development Goals
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Driving India&apos;s circular commitments through digital traceability
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sdgGoals.map((sdg) => (
              <Card key={sdg.number} className="border-stone-200">
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-black text-sm mb-3">
                    SDG {sdg.number}
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 leading-tight mb-1.5">
                    {sdg.title}
                  </h4>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {sdg.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
