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

        {/* Exact 4 GreenLedger Metric Cards - Mockup Row 3 Panel 6 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-emerald-200 bg-white rounded-3xl p-5 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Recycle className="w-4 h-4 text-emerald-600" />
                Total Recycled
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded-full">Audited</span>
            </div>
            <div className="text-3xl font-black tracking-tight font-mono text-zinc-950">
              125.6 Tons
            </div>
            <div className="text-xs text-emerald-700 font-bold">+24% MoM Diversion</div>
            <p className="text-[11px] text-zinc-500">
              Redirected from municipal landfills into circular industrial mills.
            </p>
          </Card>

          <Card className="border-blue-200 bg-white rounded-3xl p-5 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-blue-600" />
                Carbon Prevented
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-mono font-bold px-2 py-0.5 rounded-full">IPCC Model</span>
            </div>
            <div className="text-3xl font-black tracking-tight font-mono text-zinc-950">
              8,920 KG CO₂
            </div>
            <div className="text-xs text-blue-700 font-bold">+30% Net Carbon Offset</div>
            <p className="text-[11px] text-zinc-500">
              Greenhouse gas abatement vs primary raw virgin bauxite and crude resin.
            </p>
          </Card>

          <Card className="border-teal-200 bg-white rounded-3xl p-5 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Trees className="w-4 h-4 text-teal-600" />
                Forest Preserved
              </span>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-mono font-bold px-2 py-0.5 rounded-full">Circularity</span>
            </div>
            <div className="text-3xl font-black tracking-tight font-mono text-zinc-950">
              450 Trees
            </div>
            <div className="text-xs text-teal-700 font-bold">Paper Recycled Equivalent</div>
            <p className="text-[11px] text-zinc-500">
              Saved through closed-loop corrugated kraft and white office paper recycling.
            </p>
          </Card>

          <Card className="border-amber-200 bg-white rounded-3xl p-5 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Active Households
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-mono font-bold px-2 py-0.5 rounded-full">GreenKarma</span>
            </div>
            <div className="text-3xl font-black tracking-tight font-mono text-zinc-950">
              2,100 Homes
            </div>
            <div className="text-xs text-amber-700 font-bold">Verified Doorstep Participants</div>
            <p className="text-[11px] text-zinc-500">
              Earning instant digital UPI settlements and GreenKarma ecological points.
            </p>
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
