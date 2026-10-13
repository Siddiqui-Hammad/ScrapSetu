'use client';

import React from 'react';
import { CheckCircle2, Clock, QrCode, ShieldCheck, Factory, Truck, Home, Sparkles, Layers } from 'lucide-react';
import { truncateHash, formatINR, formatKg, formatDateTime } from '../../lib/utils';
import { DigitalReceipt } from '../../types';

interface WastePassportProps {
  receipt?: DigitalReceipt | null;
  receiptNumber: string;
}

export const WastePassportTimeline: React.FC<WastePassportProps> = ({
  receipt,
  receiptNumber,
}) => {
  // Exact 5-step milestone timeline matching Mockup Row 3 Panel 4:
  // 1. Sorted at Source -> 2. Collected by Ramesh -> 3. Aggregated at Hub -> 4. Shipped to Recycler -> 5. Baled & Pelleted
  const steps = [
    {
      stage: '1. Sorted at Source',
      actor: 'Priya Sharma (Household Generator)',
      icon: Home,
      status: 'COMPLETED',
      time: 'Today, 09:30 AM',
      description: 'Material segregated into clean optical PET streams at Indiranagar residence.',
    },
    {
      stage: '2. Collected by Ramesh',
      actor: 'Ramesh Kumar (Kavach Verified #DL1ER4921)',
      icon: Truck,
      status: 'COMPLETED',
      time: 'Today, 10:45 AM',
      description: 'Doorstep digital scale weighment recorded: 15.0 kg net. Payout of ₹375 settled via instant UPI.',
    },
    {
      stage: '3. Aggregated at Hub',
      actor: 'Indiranagar Circular Recovery Facility #BLR-MRF-02',
      icon: Layers,
      status: 'COMPLETED',
      time: 'Today, 01:15 PM',
      description: 'Quality inspection passed (4.2% moisture deduction). Aggregated into bulk dispatch lot.',
    },
    {
      stage: '4. Shipped to Recycler',
      actor: 'EcoTransform Recycling Facility #BLR-04',
      icon: Factory,
      status: 'COMPLETED',
      time: 'Today, 03:30 PM',
      description: 'Intake at 50T digital weighbridge slip #LOT001. State Pollution Control Board gate pass verified.',
    },
    {
      stage: '5. Baled & Pelleted',
      actor: 'EcoTransform Pelletizing Line 2',
      icon: Sparkles,
      status: 'VERIFIED',
      time: 'Today, 04:45 PM',
      description: 'Shredded, hot-washed, and extruded into Grade A rPET circular pellets. CPCB EPR Certificate issued.',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <h3 className="text-xl font-black text-zinc-950 tracking-tight">
              Waste Passport™ Traceability Lifecycle
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Chain of Custody Verified
            </span>
          </div>
          <p className="text-xs text-zinc-500 font-mono mt-1 font-bold">
            Passport ID: {receiptNumber || 'WP-2024-00124'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span className="font-mono text-emerald-900 font-bold">
            SHA-256: 9e7b28fc083a...0058
          </span>
        </div>
      </div>

      {/* 5-Step Visual Milestone Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-300">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div key={idx} className="relative group">
              <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-forest-900 text-emerald-400 flex items-center justify-center shadow-md border-2 border-white text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>

              <div className="p-4 sm:p-5 bg-zinc-50 hover:bg-white rounded-2xl border border-zinc-200/80 space-y-1.5 transition-all shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-extrabold text-zinc-950 text-sm flex items-center gap-2">
                    <Icon className="w-4 h-4 text-emerald-700" />
                    {st.stage}
                  </h4>
                  <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    {st.time}
                  </span>
                </div>
                <div className="text-xs font-semibold text-zinc-700">Actor: {st.actor}</div>
                <p className="text-xs text-zinc-500 leading-relaxed">{st.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
