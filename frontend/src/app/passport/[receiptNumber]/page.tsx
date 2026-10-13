'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Recycle,
  ShieldCheck,
  QrCode,
  ArrowLeft,
  CheckCircle2,
  Download,
  Share2,
  Calendar,
  MapPin,
  Scale,
  Factory,
  Leaf,
  FileText,
  Lock,
  ExternalLink,
  Printer,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WastePassportTimeline } from '@/components/workflows/WastePassportTimeline';
import { formatINR, formatKg, formatDate, truncateHash } from '@/lib/utils';

export default function WastePassportDetailPage() {
  const params = useParams();
  const receiptNumber = (params?.receiptNumber as string) || 'RCP-2026-DEL-0894';
  const [copied, setCopied] = useState(false);

  // Mock passport record for demo verification
  const passportData = {
    receiptNumber: receiptNumber,
    materialCategory: 'Rigid Plastics (PET / HDPE)',
    weightKg: 24.8,
    payoutAmount: 644.8,
    sha256Hash: '9e7b28fc083a3d5b0018a1a310bb2447d25e0a9437d8fca02d13bb22283a0058',
    generatedAt: '2026-10-12T14:45:00Z',
    status: 'TRANSFERRED_TO_RECYCLER',
    carbonSavedKg: 37.2,
    treesEquivalent: 1.8,
    waterSavedLiters: 124,
    generator: {
      type: 'HOUSEHOLD',
      name: 'Pooja Sharma',
      location: 'South Extension II, New Delhi - 110049',
    },
    collector: {
      name: 'Ramu Paswan (Kavach Certified)',
      scaleModel: 'TrustWeigh BT-Scale v2.1 (Calibrated)',
      scaleTolerance: '± 0.05 kg',
    },
    recycler: {
      name: 'EcoPlast Reclaimers Pvt Ltd',
      cpcbLicense: 'CPCB/PWM/DEL-2024/092',
      facilityLocation: 'Okhla Industrial Area Phase-I, New Delhi',
      outputGrade: 'Grade A rPET Flakes (Food Contact Grade)',
      batchLotNumber: 'LOT-2026-OCT-7712',
    },
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Platform Home
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare} className="text-xs">
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              {copied ? 'Link Copied!' : 'Share Passport'}
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs">
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print / Save PDF
            </Button>
          </div>
        </div>

        {/* Certificate Header Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-forest-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 to-transparent pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-3 border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Ministry of Environment & CPCB Traceable</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Digital Waste Passport
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-xl">
                Cryptographically sealed cradle-to-gate circular chain of custody verification.
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
                <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl font-mono text-emerald-300 border border-emerald-500/30">
                  <span className="text-stone-400">PASSPORT ID:</span>
                  <span className="font-black">{passportData.receiptNumber}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl text-stone-200">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{formatDate(passportData.generatedAt)}</span>
                </div>
              </div>
            </div>

            {/* QR Code Seal */}
            <div className="bg-white p-3.5 rounded-2xl shadow-lg border border-emerald-800 text-center shrink-0 w-36 sm:w-40">
              <div className="w-28 h-28 mx-auto bg-stone-100 rounded-xl flex items-center justify-center p-1.5 border border-stone-200 relative">
                <QrCode className="w-24 h-24 text-stone-900" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-md bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                    <Recycle className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="text-[10px] font-black text-stone-900 mt-1.5">
                SCAN TO VERIFY
              </div>
              <div className="text-[9px] text-stone-500 font-mono">
                CPCB Batch QR
              </div>
            </div>
          </div>
        </div>

        {/* Impact Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="border-emerald-200 bg-emerald-50/60 p-4">
            <div className="text-[11px] font-bold text-emerald-800">Net Weight Diverted</div>
            <div className="text-xl font-black text-emerald-950 mt-1">
              {formatKg(passportData.weightKg)}
            </div>
            <div className="text-[10px] text-emerald-700 mt-0.5">{passportData.materialCategory}</div>
          </Card>

          <Card className="border-blue-200 bg-blue-50/60 p-4">
            <div className="text-[11px] font-bold text-blue-800">CO₂ Avoided</div>
            <div className="text-xl font-black text-blue-950 mt-1">
              {passportData.carbonSavedKg} kg
            </div>
            <div className="text-[10px] text-blue-700 mt-0.5">Calculated vs Virgin Feedstock</div>
          </Card>

          <Card className="border-teal-200 bg-teal-50/60 p-4">
            <div className="text-[11px] font-bold text-teal-800">Trees Protected</div>
            <div className="text-xl font-black text-teal-950 mt-1">
              {passportData.treesEquivalent} Trees
            </div>
            <div className="text-[10px] text-teal-700 mt-0.5">Forestry Offset Index</div>
          </Card>

          <Card className="border-amber-200 bg-amber-50/60 p-4">
            <div className="text-[11px] font-bold text-amber-800">Generator Payout</div>
            <div className="text-xl font-black text-amber-950 mt-1">
              {formatINR(passportData.payoutAmount)}
            </div>
            <div className="text-[10px] text-amber-700 mt-0.5">Instant Direct UPI Settled</div>
          </Card>
        </div>

        {/* 4-Stage Cradle-to-Gate Circular Chain of Custody */}
        <Card className="border-stone-200 shadow-sm">
          <CardHeader className="pb-3 border-b border-stone-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Recycle className="w-5 h-5 text-emerald-700" />
                  Cradle-to-Gate Traceability Journey
                </CardTitle>
                <CardDescription className="text-xs">
                  Full physical journey of collected material from citizen doorstep to recycled granulate
                </CardDescription>
              </div>
              <Badge variant="emerald" className="text-xs">
                Verified Circular
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-300">
              {/* Stage 1: Origin */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                      Stage 1: Origin & Segregation (Citizen Doorstep)
                    </span>
                    <span className="text-[11px] text-stone-500">Oct 12, 2026 • 11:30 AM</span>
                  </div>
                  <div className="text-sm font-bold text-stone-900 mt-0.5">
                    {passportData.generator.name} ({passportData.generator.type})
                  </div>
                  <p className="text-xs text-stone-600 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {passportData.generator.location}
                  </p>
                  <div className="mt-2 text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-200 inline-block">
                    <span className="font-bold text-stone-700">ScrapVision AI Scan: </span>
                    <span className="text-emerald-700 font-semibold">96.4% confidence (PET bottles & HDPE jars)</span>
                  </div>
                </div>
              </div>

              {/* Stage 2: Collector Pickup */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                      Stage 2: TrustWeigh Calibrated Intake
                    </span>
                    <span className="text-[11px] text-stone-500">Oct 12, 2026 • 12:15 PM</span>
                  </div>
                  <div className="text-sm font-bold text-stone-900 mt-0.5">
                    {passportData.collector.name}
                  </div>
                  <p className="text-xs text-stone-600 flex items-center gap-1.5 mt-0.5">
                    <Scale className="w-3.5 h-3.5 text-stone-400" />
                    Hardware: {passportData.collector.scaleModel} ({passportData.collector.scaleTolerance})
                  </p>
                  <div className="mt-2 text-xs bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-900">
                    Gross Weight: <span className="font-bold">25.0 kg</span> • Tare Weight:{' '}
                    <span className="font-bold">0.2 kg</span> • Verified Net Weight:{' '}
                    <span className="font-black text-emerald-950">24.8 kg</span>
                  </div>
                </div>
              </div>

              {/* Stage 3: Aggregation & Hub Dispatch */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                      Stage 3: Aggregation Hub Gate Pass & Compacting
                    </span>
                    <span className="text-[11px] text-stone-500">Oct 13, 2026 • 09:20 AM</span>
                  </div>
                  <div className="text-sm font-bold text-stone-900 mt-0.5">
                    Central Delhi Circular Resource Recovery Facility (MRF #4)
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Baled & QR Tagged • Batch Container #{passportData.recycler.batchLotNumber}
                  </p>
                </div>
              </div>

              {/* Stage 4: Recycler Processing */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                      Stage 4: Authorized CPCB Recycling & Pelleting
                    </span>
                    <span className="text-[11px] text-stone-500">Oct 13, 2026 • 03:45 PM</span>
                  </div>
                  <div className="text-sm font-bold text-stone-900 mt-0.5">
                    {passportData.recycler.name}
                  </div>
                  <p className="text-xs text-stone-600 flex items-center gap-1.5 mt-0.5">
                    <Factory className="w-3.5 h-3.5 text-stone-400" />
                    License: {passportData.recycler.cpcbLicense} ({passportData.recycler.facilityLocation})
                  </p>
                  <div className="mt-2 text-xs bg-purple-50 p-2.5 rounded-xl border border-purple-200 text-purple-900 font-semibold">
                    Final Output Material: <span className="font-black">{passportData.recycler.outputGrade}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cryptographic SHA-256 Proof */}
        <Card className="border-stone-200 bg-stone-900 text-white">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Lock className="w-4 h-4" />
                  <span>SHA-256 Cryptographic Audit Seal</span>
                </div>
                <div className="font-mono text-xs text-stone-300 mt-1 break-all bg-black/40 p-2 rounded-lg border border-stone-800">
                  {passportData.sha256Hash}
                </div>
                <p className="text-[10px] text-stone-400 mt-1">
                  Merkle Tree Block #184920 • Timestamped with Digital India Public Key Infrastructure
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <Badge variant="emerald" className="font-mono text-xs py-1 px-3">
                  SEAL VALID
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
