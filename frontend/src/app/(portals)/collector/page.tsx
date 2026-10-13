'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  Scale,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  QrCode,
  ArrowRight,
  FileText,
  CreditCard,
  Map as MapIcon,
  List as ListIcon,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { MapLibreMap } from '../../../components/maps/MapLibreMap';
import { TrustWeighModal } from '../../../components/workflows/TrustWeighModal';
import { formatINR, formatKg, formatDate } from '../../../lib/utils';
import { useAuthStore } from '../../../store/authStore';

export default function CollectorPortalPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'jobs' | 'route' | 'weigh' | 'kyc'>('jobs');
  const [isWeighModalOpen, setIsWeighModalOpen] = useState(false);
  const [selectedJobForWeigh, setSelectedJobForWeigh] = useState<any>(null);

  // Operational Jobs State
  const [jobs, setJobs] = useState([
    {
      id: 'REQ-101',
      customer: 'Pooja Verma',
      address: 'South Extension II, Block C, New Delhi',
      materials: 'Kraft Carton & Paper (25kg), PET Bottles (10kg)',
      estWeight: 35.0,
      estVal: 667.5,
      distanceKm: 1.2,
      timeSlot: 'Morning (9 AM - 12 PM)',
      phone: '+91 98290 12345',
      status: 'OPEN', // OPEN, ACCEPTED, COMPLETED
    },
    {
      id: 'REQ-103',
      customer: 'Metro Food Hub & Cafe',
      address: 'Saket District Centre, New Delhi',
      materials: 'Rigid Plastics (45kg), Beverage Cans (18kg)',
      estWeight: 63.0,
      estVal: 4230.0,
      distanceKm: 2.8,
      timeSlot: 'Morning (9 AM - 12 PM)',
      phone: '+91 98110 77007',
      status: 'ACCEPTED',
    },
    {
      id: 'RCP-2026-DEL-0894',
      customer: 'GreenTech Enterprises Ltd',
      address: 'Okhla Industrial Area Phase-III',
      materials: 'Corrugated Cartons (140kg), Server E-Waste (35kg)',
      estWeight: 175.0,
      estVal: 6895.0,
      distanceKm: 4.1,
      timeSlot: 'Completed at 11:30 AM',
      phone: '+91 98110 44004',
      status: 'COMPLETED',
      receiptNumber: 'RCP-2026-DEL-0894',
    },
  ]);

  // Vehicle Capacity
  const vehicleMaxCapacity = 250;
  const currentVehicleLoad = 187.5;
  const capacityPercent = Math.round((currentVehicleLoad / vehicleMaxCapacity) * 100);

  const handleAcceptJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'ACCEPTED' } : j))
    );
  };

  const handleOpenWeigh = (job: any) => {
    setSelectedJobForWeigh(job);
    setIsWeighModalOpen(true);
  };

  const handleCompleteWeigh = () => {
    if (selectedJobForWeigh) {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === selectedJobForWeigh.id
            ? { ...j, status: 'COMPLETED', receiptNumber: `RCP-2026-DEL-${Math.floor(1000 + Math.random() * 9000)}` }
            : j
        )
      );
    }
    setIsWeighModalOpen(false);
  };

  const openJobs = jobs.filter((j) => j.status === 'OPEN');
  const acceptedJobs = jobs.filter((j) => j.status === 'ACCEPTED');
  const completedJobs = jobs.filter((j) => j.status === 'COMPLETED');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* 1. High-Contrast Mobile Status Bar */}
      <div className="bg-forest-950 text-white rounded-2xl p-5 shadow-lg border border-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              Active Collector Terminal
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
            {user?.name || 'Ramu Paswan'}
          </h1>
          <p className="text-xs text-zinc-300">
            E-Rickshaw Loader DL 1 ER 4921 • 3-Point KYC Verified ✓
          </p>
        </div>

        {/* Daily Capacity Gauge */}
        <div className="bg-black/40 border border-emerald-500/20 rounded-xl p-3 sm:w-64">
          <div className="flex justify-between items-center text-xs font-bold mb-1">
            <span className="text-zinc-300">Vehicle Capacity:</span>
            <span className="text-emerald-400 font-mono">
              {currentVehicleLoad} / {vehicleMaxCapacity} kg ({capacityPercent}%)
            </span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                capacityPercent > 85 ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Operational Tab Bar (Touch Targets > 48px) */}
      <div className="grid grid-cols-4 gap-2 p-1 bg-zinc-200/80 rounded-2xl text-xs font-bold">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'jobs'
              ? 'bg-white text-forest-900 shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <ListIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Jobs</span>
          <span className="bg-forest-900 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
            {openJobs.length + acceptedJobs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('route')}
          className={`py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'route'
              ? 'bg-white text-forest-900 shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          <span>EcoRoute</span>
        </button>

        <button
          onClick={() => setActiveTab('weigh')}
          className={`py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'weigh'
              ? 'bg-white text-forest-900 shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>TrustWeigh</span>
        </button>

        <button
          onClick={() => setActiveTab('kyc')}
          className={`py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'kyc'
              ? 'bg-white text-forest-900 shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>KYC ID</span>
        </button>
      </div>

      {/* 3. TAB 1: OPERATIONAL JOBS LIST */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {/* In-Progress / Accepted Orders Requiring Weighing */}
          {acceptedJobs.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
                Accepted — Ready for Weighing ({acceptedJobs.length})
              </span>
              {acceptedJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-5 rounded-2xl bg-amber-50/60 border border-amber-300 shadow-2xs space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                          In Progress
                        </span>
                        <span className="text-xs font-mono font-bold text-zinc-500">{job.id}</span>
                      </div>
                      <h3 className="text-base font-bold text-zinc-950 mt-1">{job.customer}</h3>
                      <p className="text-xs text-zinc-600 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        {job.address}
                      </p>
                    </div>

                    <a
                      href={`tel:${job.phone}`}
                      className="p-2.5 rounded-xl bg-white border border-amber-300 text-amber-900 shadow-2xs hover:bg-amber-100 flex items-center gap-1 text-xs font-bold"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="hidden sm:inline">Call Customer</span>
                    </a>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-zinc-800">{job.materials}</span>
                      <div className="text-[11px] text-zinc-500">Estimated Weight: ~{job.estWeight} kg</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black font-mono text-forest-900">
                        {formatINR(job.estVal)}
                      </div>
                      <div className="text-[10px] text-zinc-400">Est. Payout</div>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => handleOpenWeigh(job)}
                    className="w-full font-bold text-sm shadow-md flex items-center justify-center gap-2"
                  >
                    <Scale className="w-4 h-4" />
                    <span>Open TrustWeigh Scale Entry & Issue Receipt</span>
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Open Nearby Pickups Feed */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
              Nearby Open Pickups ({openJobs.length})
            </span>
            {openJobs.map((job) => (
              <div
                key={job.id}
                className="circular-card p-5 space-y-4 hover:border-emerald-500"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-forest-900 font-mono">
                        {job.distanceKm} km away
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">{job.id}</span>
                    </div>
                    <h3 className="text-base font-bold text-zinc-950 mt-1">{job.customer}</h3>
                    <p className="text-xs text-zinc-600 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      {job.address}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-lg font-black font-mono text-forest-900">
                      {formatINR(job.estVal)}
                    </div>
                    <div className="text-[10px] text-zinc-500">~{job.estWeight} kg expected</div>
                  </div>
                </div>

                <div className="p-2.5 bg-zinc-50 rounded-xl text-xs text-zinc-700 font-medium border border-zinc-200/80">
                  {job.materials}
                </div>

                <Button
                  variant="default"
                  size="default"
                  onClick={() => handleAcceptJob(job.id)}
                  className="w-full font-bold shadow-sm"
                >
                  Accept Pickup Order
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB 2: ECOROUTE TSP OPTIMIZATION */}
      {activeTab === 'route' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="circular-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-950">EcoRoute TSP Trip Planner</h3>
                <p className="text-xs text-zinc-500">
                  Travelling Salesperson algorithm optimized sequence saves 38% fuel transit
                </p>
              </div>
              <span className="text-xs font-bold bg-emerald-100 text-forest-900 px-3 py-1 rounded-full">
                Optimal Sequence
              </span>
            </div>

            {/* Stops Sequence List */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs">
                <span className="w-6 h-6 rounded-full bg-forest-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  1
                </span>
                <div className="flex-1">
                  <div className="font-bold text-zinc-950">South Extension II (REQ-101)</div>
                  <div className="text-[11px] text-zinc-500">1.2 km • ~35 kg Kraft Paper & Plastic</div>
                </div>
                <span className="font-mono font-bold text-forest-900">₹667.50</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-zinc-200 text-xs">
                <span className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                  2
                </span>
                <div className="flex-1">
                  <div className="font-bold text-zinc-950">Saket District Centre (REQ-103)</div>
                  <div className="text-[11px] text-zinc-500">2.8 km • ~63 kg Beverage Cans & PET</div>
                </div>
                <span className="font-mono font-bold text-forest-900">₹4,230.00</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50/60 border border-purple-200 text-xs">
                <span className="w-6 h-6 rounded-full bg-purple-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  3
                </span>
                <div className="flex-1">
                  <div className="font-bold text-zinc-950">EcoPlast Reclaimers (Weighbridge Unload)</div>
                  <div className="text-[11px] text-zinc-500">Okhla Industrial Area • Factory Unload</div>
                </div>
                <span className="text-[11px] font-bold text-purple-700">Intake Hub</span>
              </div>
            </div>

            <div className="h-64 rounded-xl overflow-hidden border border-zinc-200">
              <MapLibreMap height="100%" />
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: TRUSTWEIGH DIGITAL SCALE TERMINAL */}
      {activeTab === 'weigh' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="circular-card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-zinc-950">TrustWeigh Calibrated Terminal</h3>
                <p className="text-xs text-zinc-500">Bluetooth scale integration with tare deduction & SHA-256 seal</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                SCALE BT: CONNECTED (±0.05kg)
              </span>
            </div>

            {acceptedJobs.length > 0 ? (
              <div className="space-y-4">
                <p className="text-xs text-zinc-600">Select an in-progress job to weigh:</p>
                {acceptedJobs.map((j) => (
                  <div
                    key={j.id}
                    className="p-4 rounded-xl border border-zinc-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-zinc-950">{j.customer}</div>
                      <div className="text-[11px] text-zinc-500">{j.materials}</div>
                    </div>
                    <Button size="sm" variant="primary" onClick={() => handleOpenWeigh(j)} className="font-bold text-xs">
                      Weigh Now →
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-500 text-xs space-y-2">
                <Scale className="w-8 h-8 text-zinc-300 mx-auto" />
                <p>No active accepted jobs to weigh right now.</p>
                <Button size="sm" variant="outline" onClick={() => setActiveTab('jobs')}>
                  Browse Open Pickups
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. TAB 4: 3-POINT KYC VERIFICATION STATUS */}
      {activeTab === 'kyc' && (
        <div className="circular-card p-6 space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-zinc-950">Collector 3-Point KYC Identity</h3>
              <p className="text-xs text-zinc-500">Aadhaar, Driving Licence, and Live Biometric Selfie verification</p>
            </div>
            <span className="text-xs font-bold bg-emerald-100 text-forest-900 px-3 py-1 rounded-full">
              ACTIVE & VERIFIED ✓
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400">1. Aadhaar Card</span>
              <div className="font-mono font-bold text-zinc-950">5482-9182-4912</div>
              <div className="text-emerald-700 font-semibold text-[11px]">UIDAI Masked ✓</div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400">2. Driving Licence</span>
              <div className="font-mono font-bold text-zinc-950">DL-04-2019-00291</div>
              <div className="text-emerald-700 font-semibold text-[11px]">Commercial Transport ✓</div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400">3. Live Selfie</span>
              <div className="font-bold text-zinc-950">Biometric Match: 98.4%</div>
              <div className="text-emerald-700 font-semibold text-[11px]">Anti-Spoofing Verified ✓</div>
            </div>
          </div>
        </div>
      )}

      {/* TrustWeigh Modal Integration */}
      {selectedJobForWeigh && (
        <TrustWeighModal
          pickup={selectedJobForWeigh}
          isOpen={isWeighModalOpen}
          onClose={() => setIsWeighModalOpen(false)}
          onSuccess={handleCompleteWeigh}
        />
      )}
    </div>
  );
}
