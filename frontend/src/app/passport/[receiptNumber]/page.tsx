'use client';

import React, { useState, useEffect } from 'react';
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
  AlertTriangle,
  Eye,
  EyeOff,
  Truck,
  Layers,
  ChevronRight,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatINR, formatKg, formatDate, truncateHash } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

export default function WastePassportDetailPage() {
  const params = useParams();
  const rawParam = params?.receiptNumber as string;
  const receiptNumber = rawParam && rawParam !== 'default' ? rawParam : 'WP-2024-00124';

  const [copied, setCopied] = useState(false);
  const [isDetailView, setIsDetailView] = useState(true);

  // Live Passport State
  const [passport, setPassport] = useState<any>({
    lotNumber: receiptNumber,
    qrCodeData: `/passport/${receiptNumber}`,
    status: 'RECEIVED', // Default to RECEIVED with discrepancy or PROCESSING_CONFIRMED
    category: {
      name: 'Plastic (Grade A PET)',
      hindiName: 'प्लास्टिक की बोतलें',
      icon: '🥤',
    },
    grade: 'Optical Clean PET Flakes (Food Contact Grade)',
    declaredWeightKg: 60.0,
    collectedWeightKg: 60.0,
    receivedWeightKg: 56.5,
    weightDiscrepancyKg: -3.5,
    discrepancyPercentage: -5.8,
    hasDiscrepancy: true,
    isDisputed: true,
    disputeReason: 'Moisture loss & dust deduction verified at recycler digital weighbridge',
    agreedRatePerKg: 34.0,
    estimatedGrossValue: 2040.0,
    estimatedTransportCost: 170.0,
    estimatedNetProceeds: 1870.0,
    processingMethod: 'SHREDDED_AND_PELLETIZED',
    processingBatchNumber: 'LOT-2026-OCT-001',
    cpcbComplianceRef: 'CPCB/PWM/BLR-2024/092',
    currentHashSha256: '9e7b28fc083a3d5b0018a1a310bb2447d25e0a9437d8fca02d13bb22283a0058',
    generatedAt: '2026-10-14T09:30:00Z',
    generator: {
      name: 'Priya Sharma',
      originLocation: '12th Main Road, Indiranagar, Bangalore - 560038',
    },
    collector: {
      name: 'Ramesh Kumar (Kavach Certified #DL1ER4921)',
      vehicleType: 'E-Rickshaw Loader',
      phone: '+91 98765 43210',
    },
    buyer: {
      name: 'EcoTransform Recycling Facility #BLR-04',
      address: 'Plot 42, Peenya Industrial Area Phase 2, Bangalore',
      phone: '+91 98450 11223',
    },
  });

  // Action states for Recycler actions
  const [isConfirmingIntake, setIsConfirmingIntake] = useState(false);
  const [isConfirmingProcessing, setIsConfirmingProcessing] = useState(false);

  // Fetch actual lot if available from API
  useEffect(() => {
    async function loadData() {
      try {
        const res = await apiClient.passport.get(receiptNumber);
        if (res.success && res.passport) {
          setPassport(res.passport);
        }
      } catch (err) {
        console.warn('Loaded simulated tamper-evident passport');
      }
    }
    loadData();
  }, [receiptNumber]);

  // 8-stage lifecycle sequence
  const stages = [
    { key: 'GENERATED', label: '1. Generated', desc: 'Identified at Source' },
    { key: 'BOOKED', label: '2. Booked', desc: 'Doorstep Pickup Slot' },
    { key: 'COLLECTED', label: '3. Collected', desc: 'Loaded on Vehicle' },
    { key: 'WEIGHED', label: '4. Weighed', desc: 'TrustWeigh Certified' },
    { key: 'BUYER_SELECTED', label: '5. Buyer Matched', desc: 'Best Net Return' },
    { key: 'HANDED_OVER', label: '6. Handed Over', desc: 'In Transit to Mill' },
    { key: 'RECEIVED', label: '7. Received', desc: 'Weighbridge Intake' },
    { key: 'PROCESSING_CONFIRMED', label: '8. Processed', desc: 'Pelletized & Recycled' },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === passport.status);
  const activeIndex = currentStageIndex >= 0 ? currentStageIndex : 6; // default received

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

  const handleConfirmIntake = () => {
    setPassport((prev: any) => ({
      ...prev,
      status: 'RECEIVED',
      hasDiscrepancy: false,
      receivedWeightKg: 60.0,
      weightDiscrepancyKg: 0,
      discrepancyPercentage: 0,
    }));
    setIsConfirmingIntake(false);
    alert('Weighbridge intake confirmed. Weight verified at 60.0 kg.');
  };

  const handleConfirmProcessing = () => {
    setPassport((prev: any) => ({
      ...prev,
      status: 'PROCESSING_CONFIRMED',
      processingConfirmedAt: new Date().toISOString(),
      processingMethod: 'SHREDDED_AND_PELLETIZED',
      processingBatchNumber: 'BATCH-2026-BLR-881',
      cpcbComplianceRef: 'CPCB/PWM/BLR-2024/092',
    }));
    setIsConfirmingProcessing(false);
    alert('Circular processing confirmed. CPCB EPR Certificate generated.');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Breadcrumb & View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-forest-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to ScrapSetu Platform</span>
          </Link>

          <div className="flex items-center gap-2.5">
            {/* Public vs Detail View Toggle */}
            <button
              onClick={() => setIsDetailView(!isDetailView)}
              className="px-3 py-1.5 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-800 flex items-center gap-1.5 shadow-2xs"
            >
              {isDetailView ? <EyeOff className="w-3.5 h-3.5 text-forest-900" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isDetailView ? 'Mask Personal PII (Public View)' : 'Show Full Audit View'}</span>
            </button>

            <Button variant="outline" size="sm" onClick={handleShare} className="text-xs font-bold">
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </Button>

            <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs font-bold">
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              <span>Print Manifest</span>
            </Button>
          </div>
        </div>

        {/* Certificate Header Banner */}
        <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 to-transparent pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>CPCB &amp; MoEFCC Digital Waste Passport</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Scrap Passport™ Traceability Certificate
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200 max-w-xl">
                Cryptographically sealed cradle-to-gate circular chain of custody verification.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl font-mono text-emerald-300 border border-emerald-500/30 font-bold">
                  <span>LOT ID:</span>
                  <span>{passport.lotNumber}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl font-mono text-zinc-300 border border-white/10">
                  <span className="text-zinc-400">SHA-256:</span>
                  <span>{truncateHash(passport.currentHashSha256)}</span>
                </div>
              </div>
            </div>

            {/* High-Contrast Scannable QR Code */}
            <div className="bg-white p-3.5 rounded-2xl shadow-2xl border-2 border-emerald-500 text-center shrink-0 w-36 sm:w-40">
              <div className="w-28 h-28 mx-auto bg-zinc-100 rounded-xl flex items-center justify-center p-1.5 border border-zinc-200 relative">
                <QrCode className="w-24 h-24 text-zinc-950" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-6 h-6 rounded-md bg-forest-900 text-emerald-400 flex items-center justify-center shadow-xs">
                    <Recycle className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="text-[10px] font-black text-zinc-950 mt-1.5">
                SCAN TO VERIFY
              </div>
              <div className="text-[9px] text-zinc-500 font-mono">
                CPCB Batch QR
              </div>
            </div>
          </div>
        </div>

        {/* Full 8-Stage Lifecycle Progress Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-zinc-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-zinc-950 tracking-tight">
                8-Stage Circular Lifecycle Sequence
              </h2>
              <p className="text-xs text-zinc-500">
                End-to-end chain of custody from household segregation to secondary raw material output.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
              Current: {passport.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {stages.map((st, idx) => {
              const isPast = idx < activeIndex;
              const isCurrent = idx === activeIndex;

              return (
                <div
                  key={st.key}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                      : isPast
                      ? 'bg-zinc-50 border-emerald-200'
                      : 'bg-zinc-50/50 border-zinc-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-center mb-1">
                    {isPast || isCurrent ? (
                      <CheckCircle2
                        className={`w-4 h-4 ${isCurrent ? 'text-forest-900' : 'text-emerald-600'}`}
                      />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-zinc-300 text-[10px] font-bold text-zinc-400 flex items-center justify-center">
                        {idx + 1}
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-[11px] font-extrabold truncate ${
                      isCurrent ? 'text-forest-900 font-black' : 'text-zinc-800'
                    }`}
                  >
                    {st.label}
                  </div>
                  <div className="text-[9px] text-zinc-400 mt-0.5 truncate">{st.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Discrepancy Warning Alert Banner (if origin vs receiving differs) */}
        {passport.hasDiscrepancy && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
              <h3 className="font-black text-amber-950 text-sm">
                Weighbridge Weight Discrepancy Detected (-3.5 kg / -5.8%)
              </h3>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed pl-7">
              Collector dispatched <b>{passport.collectedWeightKg} kg</b> at Indiranagar. Receiving weighbridge recorded{' '}
              <b>{passport.receivedWeightKg} kg</b> at EcoTransform Mill #04. Discrepancy logged as:{' '}
              <i>&quot;{passport.disputeReason}&quot;</i>. Settlement automatically adjusted to net weight.
            </p>
          </div>
        )}

        {/* Central Manifest Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Material & Settlement Ledger */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="text-sm font-black text-zinc-950 uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-forest-900" />
                <span>Material &amp; Weighment Ledger</span>
              </h3>
              <span className="text-xs font-bold text-emerald-700">Verified Scale</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Material Category:</span>
                <span className="font-extrabold text-zinc-900">{passport.category.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Commercial Grade:</span>
                <span className="font-bold text-zinc-800">{passport.grade}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Collector Dispatch Weight:</span>
                <span className="font-mono font-bold text-zinc-900">{passport.collectedWeightKg} kg</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Mill Intake Net Weight:</span>
                <span className="font-mono font-black text-emerald-800">{passport.receivedWeightKg} kg</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Agreed Buying Rate:</span>
                <span className="font-mono font-bold text-zinc-900">₹{passport.agreedRatePerKg}/kg</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500 font-bold">Net Payout to Collector:</span>
                <span className="font-mono font-black text-forest-900 text-sm">
                  {formatINR((passport.receivedWeightKg || 60) * (passport.agreedRatePerKg || 34))}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Chain of Custody Actors */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="text-sm font-black text-zinc-950 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-forest-900" />
                <span>Chain of Custody Provenance</span>
              </h3>
              <span className="text-xs font-mono text-zinc-400">CPCB Audit Trail</span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                <div className="text-[10px] uppercase font-bold text-zinc-400">Origin Generator (Household)</div>
                <div className="font-extrabold text-zinc-900 mt-0.5">
                  {isDetailView ? passport.generator.name : 'Priya S*** (Verified Citizen)'}
                </div>
                <div className="text-[11px] text-zinc-500">
                  {isDetailView ? passport.generator.originLocation : 'Indiranagar, Bangalore (Address Masked for Privacy)'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                <div className="text-[10px] uppercase font-bold text-zinc-400">Assigned Collector</div>
                <div className="font-extrabold text-zinc-900 mt-0.5">
                  {passport.collector.name}
                </div>
                <div className="text-[11px] text-zinc-500">
                  Vehicle: {passport.collector.vehicleType} • Phone:{' '}
                  {isDetailView ? passport.collector.phone : 'Masked in Public View'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="text-[10px] uppercase font-bold text-emerald-800">Receiving Processor</div>
                <div className="font-extrabold text-forest-950 mt-0.5">
                  {passport.buyer.name}
                </div>
                <div className="text-[11px] text-emerald-900">
                  {passport.buyer.address} • CPCB Reg: {passport.cpcbComplianceRef}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recycler Facility Action Controls (Intake Confirmation & Processing Confirmation) */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-zinc-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-zinc-950 uppercase tracking-wider flex items-center gap-2">
                <Factory className="w-4 h-4 text-forest-900" />
                <span>Authorized Recycler Facility Actions</span>
              </h3>
              <p className="text-xs text-zinc-500">
                Update verifiable custody milestones as material arrives and gets remanufactured.
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold">
              Facility Auth Level 3
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <Button
              onClick={handleConfirmIntake}
              className="bg-forest-900 hover:bg-forest-950 text-white font-bold text-xs h-12 rounded-xl flex items-center justify-center gap-2"
            >
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>Confirm Weighbridge Intake (Clear Discrepancy)</span>
            </Button>

            <Button
              onClick={handleConfirmProcessing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-12 rounded-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Confirm Circular Processing (Issue EPR Seal)</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
