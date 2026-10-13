'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, FileText, UserCheck, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { KycDossier } from '../../types';

interface KycDossierProps {
  candidates?: KycDossier[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const DEFAULT_DOSSIERS: KycDossier[] = [
  {
    id: 'KYC-001',
    name: 'Shyam Sundar',
    role: 'COLLECTOR',
    phone: '+91 98290 88008',
    vehicle: 'E-Rickshaw Loader RJ 14 ER 7721',
    aadhaarNum: '4129-6638-6621',
    dlNum: 'RJ-14-2022-00455',
    aadhaarStatus: 'Uploaded (UIDAI verified format)',
    dlStatus: 'Uploaded (Commercial E-Cart)',
    selfieStatus: 'Live Camera Selfie Captured',
    status: 'PENDING',
    appliedDate: '2026-10-13 11:30',
  },
  {
    id: 'KYC-002',
    name: 'Ramkishan Sahu',
    role: 'COLLECTOR',
    phone: '+91 98290 11001',
    vehicle: '3-Wheeler Tempo RJ 14 TB 4921',
    aadhaarNum: '5482-9182-4912',
    dlNum: 'RJ-14-2019-00291',
    aadhaarStatus: 'Verified UIDAI ✓',
    dlStatus: 'Verified LMV-TR (Transport) ✓',
    selfieStatus: 'Biometric Face Match 98.4% ✓',
    status: 'APPROVED',
    appliedDate: '2026-10-10 14:15',
    reviewedBy: 'Vikramaditya Sharma (Admin)',
  },
];

export const KycDossierInspector: React.FC<KycDossierProps> = ({
  candidates = DEFAULT_DOSSIERS,
  onApprove,
  onReject,
}) => {
  const [dossiers, setDossiers] = useState<KycDossier[]>(candidates);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const current = dossiers[selectedIdx] || dossiers[0];

  const handleApprove = (id: string) => {
    setDossiers((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: 'APPROVED',
              aadhaarStatus: 'Verified UIDAI ✓',
              dlStatus: 'Verified Transport RTO ✓',
              selfieStatus: 'Biometric Face Match 99.1% ✓',
            }
          : d
      )
    );
    if (onApprove) onApprove(id);
  };

  const handleReject = (id: string) => {
    setDossiers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'REJECTED' } : d))
    );
    if (onReject) onReject(id);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-card-subtle space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-700" />
            3-Point KYC Verification Queue
          </h3>
          <p className="text-xs text-stone-500 font-medium">
            Inspect Government Aadhaar, Driving Licence, and Live Biometric Selfie before granting collection rights
          </p>
        </div>

        {/* Applicant Switcher */}
        <div className="flex items-center gap-2">
          {dossiers.map((d, idx) => (
            <button
              key={d.id}
              onClick={() => setSelectedIdx(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedIdx === idx
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {d.name} {d.status === 'APPROVED' ? '✓' : '⏳'}
            </button>
          ))}
        </div>
      </div>

      {current && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
            <div>
              <div className="font-extrabold text-stone-900 text-base">{current.name}</div>
              <div className="text-xs text-stone-500">
                {current.phone} • Vehicle: {current.vehicle || 'Three-Wheeler'}
              </div>
            </div>
            <Badge variant={current.status === 'APPROVED' ? 'kyc' : 'warning'}>
              {current.status === 'APPROVED' ? 'Active Verified Partner' : 'Pending Administrative Review'}
            </Badge>
          </div>

          {/* 3-Card Inspection View */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Aadhaar */}
            <div className="p-5 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-3">
              <div className="text-2xl">📄</div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">Government Aadhaar Card</h4>
                <p className="text-[11px] text-stone-500 font-medium">UIDAI Resident Identity</p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-xs font-mono font-bold text-stone-800">
                UID: {current.aadhaarNum}
              </div>
              <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{current.aadhaarStatus}</span>
              </div>
            </div>

            {/* Card 2: Driving Licence */}
            <div className="p-5 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-3">
              <div className="text-2xl">🪪</div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">Commercial Driving Licence</h4>
                <p className="text-[11px] text-stone-500 font-medium">Ministry of Road Transport (Parivahan)</p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-xs font-mono font-bold text-stone-800">
                DL: {current.dlNum}
              </div>
              <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{current.dlStatus}</span>
              </div>
            </div>

            {/* Card 3: Live Selfie */}
            <div className="p-5 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-3">
              <div className="text-2xl">🤳</div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">Live Biometric Selfie</h4>
                <p className="text-[11px] text-stone-500 font-medium">Live Camera Anti-Spoofing Match</p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-xs font-mono font-bold text-stone-800">
                Face Match Score: 98.4%
              </div>
              <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{current.selfieStatus}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            {current.status !== 'APPROVED' ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReject(current.id)}
                >
                  <XCircle className="w-4 h-4 mr-1 text-red-600" />
                  <span>Request Document Re-upload</span>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleApprove(current.id)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  <span>Approve KYC & Activate Doorstep Privileges</span>
                </Button>
              </>
            ) : (
              <div className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Partner verified and authorized for doorstep collections.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
