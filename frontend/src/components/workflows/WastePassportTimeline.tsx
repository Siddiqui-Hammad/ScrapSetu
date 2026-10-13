'use client';

import React from 'react';
import { CheckCircle2, Clock, QrCode, ShieldCheck, Factory, Truck, Home, Sparkles } from 'lucide-react';
import { Badge } from '../ui/badge';
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
  const steps = [
    {
      stage: '1. Source Generation & Segregation',
      actor: receipt?.requester?.name || 'Household Generator (Pooja Verma)',
      icon: Home,
      status: 'COMPLETED',
      time: receipt?.transactionDate ? formatDateTime(receipt.transactionDate) : '2026-10-11 09:30 AM',
      description: 'Clean segregation into designated material streams verified at residence doorstep.',
    },
    {
      stage: '2. Doorstep Weighing & Custody Handover',
      actor: receipt?.collector?.name || 'Verified Collector (Ramkishan Sahu)',
      icon: Truck,
      status: 'COMPLETED',
      time: receipt?.transactionDate ? formatDateTime(receipt.transactionDate) : '2026-10-11 10:45 AM',
      description: `Net weight ${formatKg(receipt?.totalWeightKg || 42.5)} confirmed via Bluetooth scale. Settlement: ${formatINR(receipt?.totalAmount || 1450.5)}.`,
    },
    {
      stage: '3. Industrial Weighbridge Gate Intake',
      actor: 'Aravalli Ecocycle Mills (CPCB RJ/PWM/2026/0491)',
      icon: Factory,
      status: 'COMPLETED',
      time: '2026-10-11 02:15 PM',
      description: 'Gross & tare weighbridge slip #INT-2026-0921 recorded. Lot inspected for purity compliance.',
    },
    {
      stage: '4. Circular Reprocessing & Abatement',
      actor: 'Accredited Pulp & Smelting Mills',
      icon: Sparkles,
      status: 'VERIFIED',
      time: '2026-10-12 11:00 AM',
      description: 'Diverted from landfill into virgin raw-material substitution. Green karma certificate issued.',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-card-subtle space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <h3 className="text-xl font-extrabold text-stone-900 tracking-tight">
              Waste Passport™ Circular Lifecycle
            </h3>
            <Badge variant="kyc">Verified Provenance</Badge>
          </div>
          <p className="text-xs text-stone-500 font-medium mt-1 font-mono">
            Passport ID: {receiptNumber}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span className="font-mono text-emerald-900 font-semibold">
            SHA-256: {truncateHash(receipt?.receiptHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')}
          </span>
        </div>
      </div>

      {/* 4-Step Visual Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-200">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div key={idx} className="relative group">
              <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-md border-2 border-white text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>

              <div className="p-4 sm:p-5 bg-stone-50/70 hover:bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1.5 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <Icon className="w-4 h-4 text-emerald-700" />
                    {st.stage}
                  </h4>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    {st.time}
                  </span>
                </div>
                <div className="text-xs font-semibold text-stone-700">Entity: {st.actor}</div>
                <p className="text-xs text-stone-500 leading-relaxed">{st.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-500 flex items-center justify-between">
        <span>Publicly verifiable circular passport under India E-Waste & Plastic Waste Management Rules (2026).</span>
        <span className="font-bold text-emerald-800">ScrapSetu Certified ✓</span>
      </div>
    </div>
  );
};
