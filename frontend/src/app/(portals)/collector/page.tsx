'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  Scale,
  MapPin,
  CheckCircle2,
  Navigation,
  Compass,
  Phone,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import { MapLibreMap } from '../../../components/maps/MapLibreMap';
import { TrustWeighModal } from '../../../components/workflows/TrustWeighModal';
import { formatINR, formatKg } from '../../../lib/utils';
import { useAuthStore } from '../../../store/authStore';

export default function CollectorPortalPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'jobs' | 'weigh' | 'route' | 'kyc'>('jobs');
  const [selectedWeighPickup, setSelectedWeighPickup] = useState<any | null>(null);
  const [isWeighModalOpen, setIsWeighModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Capacity
  const currentLoadKg = 187.5;
  const maxCapacityKg = 250.0;
  const loadPercentage = Math.round((currentLoadKg / maxCapacityKg) * 100);

  // Open & Accepted Jobs
  const [jobs, setJobs] = useState([
    {
      id: 'REQ-101',
      requesterName: 'Pooja Verma (Verified)',
      phone: '+91 98290 12345',
      address: 'B-142, Malviya Nagar Sector 3',
      materials: 'Paper & Cardboard (25kg), PET Plastics (10kg)',
      estWeight: 35.0,
      estVal: 535.0,
      distanceKm: 0.8,
      status: 'OPEN',
      lat: 26.8524,
      lng: 75.8173,
    },
    {
      id: 'REQ-103',
      requesterName: 'City Bakery & Outlet',
      phone: '+91 98290 77007',
      address: 'Crystal Court Mall, Malviya Nagar',
      materials: 'Rigid Plastics (45kg), Beverage Cans (20kg)',
      estWeight: 65.0,
      estVal: 1450.0,
      distanceKm: 1.4,
      status: 'ACCEPTED',
      lat: 26.8533,
      lng: 75.8190,
    },
  ]);

  const handleAcceptJob = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: 'ACCEPTED' } : j))
    );
    setToastMsg(`पिकअप #${id} स्वीकार कर लिया गया! ग्राहक का फोन व पता अनलॉक हुआ।`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleOpenWeigh = (job: any) => {
    setSelectedWeighPickup(job);
    setIsWeighModalOpen(true);
  };

  const handleWeighComplete = (receiptNumber: string) => {
    setIsWeighModalOpen(false);
    setJobs((prev) =>
      prev.map((j) =>
        j.id === selectedWeighPickup?.id ? { ...j, status: 'COMPLETED' } : j
      )
    );
    setToastMsg(`रसीद #${receiptNumber} जारी हुई! लेनदेन पूरा हुआ।`);
    setTimeout(() => setToastMsg(''), 5000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 select-none">
      {/* High-Contrast Mobile Terminal Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-forest-950 text-white p-5 sm:p-7 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4 border border-emerald-800">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-800 border border-emerald-600 flex items-center justify-center text-3xl shadow-md">
            🛺
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight font-hindi">
                {user?.name || 'रामकिशन साहु'}
              </h1>
              <Badge variant="kyc">सत्यापित साथी ✓</Badge>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5 font-hindi">
              वाहन: ई-रिक्शा लोडर (RJ 14 TB 4921) • दैनिक क्षमता: 250 किग्रा
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-black text-amber-300">₹3,442.50</div>
          <div className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider">
            आज की कुल कमाई (Today's Earnings)
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-emerald-950 text-xs font-bold flex items-center gap-2 animate-in fade-in-0">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Daily Capacity Meter Card */}
      <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-card-subtle space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-stone-800">
          <span>वाहन क्षमता (Daily Vehicle Payload):</span>
          <span className="text-emerald-900">{formatKg(currentLoadKg)} / {formatKg(maxCapacityKg)} ({loadPercentage}%)</span>
        </div>
        <Progress value={loadPercentage} />
      </div>

      {/* Touch-Friendly Tab Bar for Low Digital Literacy */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
        {[
          { key: 'jobs', label: '📍 नजदीकी पिकअप', sub: `${jobs.filter((j) => j.status === 'OPEN').length} Open Jobs` },
          { key: 'weigh', label: '⚖️ तौल व रसीद', sub: `${jobs.filter((j) => j.status === 'ACCEPTED').length} Active` },
          { key: 'route', label: '🗺️ स्मार्ट रूट TSP', sub: 'EcoRoute Navigation' },
          { key: 'kyc', label: '🪪 KYC सत्यापन', sub: 'Aadhaar + DL + Selfie' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`p-3.5 rounded-2xl text-center transition-all border ${
              activeTab === t.key
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <div className="text-sm font-hindi">{t.label}</div>
            <div className="text-[10px] opacity-80 mt-0.5">{t.sub}</div>
          </button>
        ))}
      </div>

      {/* TAB 1: NEARBY OPEN JOBS */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-stone-900 text-base font-hindi">नजदीकी खुले पिकअप ऑर्डर्स</h3>
            <span className="text-xs text-stone-500 font-medium">8 किमी कार्यक्षेत्र के भीतर</span>
          </div>

          <div className="space-y-3">
            {jobs.filter((j) => j.status === 'OPEN').map((job) => (
              <div
                key={job.id}
                className="p-5 bg-white rounded-3xl border border-stone-200/90 shadow-card-subtle space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">{job.materials}</span>
                    <Badge variant="secondary">{job.distanceKm} किमी दूरी</Badge>
                  </div>
                  <span className="text-base font-extrabold text-emerald-900">
                    अनुमानित: {formatINR(job.estVal)}
                  </span>
                </div>

                <div className="text-xs text-stone-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>स्थान: {job.address}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="text-xs text-stone-600 font-hindi">वजन: {formatKg(job.estWeight)}</span>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleAcceptJob(job.id)}
                  >
                    <span>पिकअप स्वीकार करें (Accept Job)</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE JOBS FOR WEIGHING */}
      {activeTab === 'weigh' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-stone-900 text-base font-hindi">चालू ऑर्डर्स एवं डिजिटल तौल</h3>
            <span className="text-xs text-stone-500 font-medium">तौल दर्ज कर रसीद बनाएं</span>
          </div>

          <div className="space-y-3">
            {jobs.filter((j) => j.status === 'ACCEPTED').map((job) => (
              <div
                key={job.id}
                className="p-5 bg-white rounded-3xl border border-stone-200/90 shadow-card-subtle space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{job.requesterName}</h4>
                    <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{job.phone}</span>
                    </p>
                  </div>
                  <Badge variant="warning">पिकअप चालू (Accepted)</Badge>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-700 font-medium">
                  सामग्री: {job.materials} • अनुमानित वजन: {formatKg(job.estWeight)}
                </div>

                <Button
                  size="sm"
                  variant="gold"
                  onClick={() => handleOpenWeigh(job)}
                  className="w-full text-xs font-bold"
                >
                  <Scale className="w-4 h-4 mr-1.5" />
                  <span>⚖️ तौल दर्ज करें व डिजिटल रसीद बनाएं (Open Digital Scale)</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SMART ROUTE TSP */}
      {activeTab === 'route' && (
        <div className="space-y-4">
          <div className="p-5 bg-white rounded-3xl border border-stone-200/90 shadow-card-subtle space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-stone-900 text-base font-hindi">
                  EcoRoute™ TSP मल्टी-स्टॉप नेविगेशन
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  ईंधन व समय बचाने हेतु सबसे नजदीकी क्रम में स्टॉप्स व्यवस्थित
                </p>
              </div>
              <Badge variant="success">1.8 किमी की बचत ✓</Badge>
            </div>

            <MapLibreMap
              center={[26.8501, 75.8155]}
              pickups={jobs.map((j) => ({
                id: j.id,
                lat: j.lat,
                lng: j.lng,
                title: j.materials,
                weightKg: j.estWeight,
                status: j.status,
                distanceKm: j.distanceKm,
              }))}
              routeStops={jobs.map((j, idx) => ({
                pickupId: j.id,
                requesterName: j.requesterName,
                addressLabel: j.address,
                streetAddress: j.address,
                lat: j.lat,
                lng: j.lng,
                preferredTimeSlot: 'Morning',
                estimatedWeightKg: j.estWeight,
                estimatedValue: j.estVal,
                stopSequenceIndex: idx + 1,
              }))}
              className="h-72 rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* TAB 4: 3-POINT KYC STATUS */}
      {activeTab === 'kyc' && (
        <div className="p-6 bg-white rounded-3xl border border-stone-200/90 shadow-card-subtle space-y-5 text-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-bold text-stone-900 text-base font-hindi">
                🪪 3-पॉइंट पहचान सत्यापन (3-Point KYC Verification)
              </h3>
              <p className="text-stone-500 text-xs">
                आधार कार्ड, ड्राइविंग लाइसेंस, और लाइव सेल्फी स्थिति
              </p>
            </div>
            <Badge variant="kyc">APPROVED ✓</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <span className="text-2xl">📄</span>
              <div className="font-bold text-stone-900 text-xs">Aadhaar Card (आधार)</div>
              <div className="font-mono text-stone-500 text-[11px]">UID: 5482-XXXX-4912</div>
              <div className="text-emerald-700 font-bold text-[11px]">UIDAI Verified ✓</div>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <span className="text-2xl">🪪</span>
              <div className="font-bold text-stone-900 text-xs">Driving Licence (DL)</div>
              <div className="font-mono text-stone-500 text-[11px]">DL: RJ-14-2019-00291</div>
              <div className="text-emerald-700 font-bold text-[11px]">Commercial LMV-TR ✓</div>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <span className="text-2xl">🤳</span>
              <div className="font-bold text-stone-900 text-xs">Live Selfie (फेस मैच)</div>
              <div className="font-mono text-stone-500 text-[11px]">Biometric Liveness</div>
              <div className="text-emerald-700 font-bold text-[11px]">Match: 98.4% ✓</div>
            </div>
          </div>
        </div>
      )}

      {/* TrustWeigh Modal */}
      <TrustWeighModal
        pickup={selectedWeighPickup}
        isOpen={isWeighModalOpen}
        onClose={() => setIsWeighModalOpen(false)}
        onSuccess={handleWeighComplete}
      />
    </div>
  );
}
