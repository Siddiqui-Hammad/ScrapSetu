'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, ArrowRight, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { EcoShieldAnomaly } from '../../types';

interface EcoShieldProps {
  anomalies?: EcoShieldAnomaly[];
  onResolve?: (id: string) => void;
}

const DEFAULT_ANOMALIES: EcoShieldAnomaly[] = [
  {
    id: 'ANOM-101',
    type: 'WEIGHT_MISMATCH',
    severity: 'MEDIUM',
    pickupId: 'REQ-102',
    userName: 'GreenLeaf Logistics',
    description: 'Actual scale weight (187.5 kg) exceeded user estimate (120 kg) by +56%. Flagged for weighbridge verification.',
    timestamp: '2026-10-12 14:10',
    status: 'PENDING',
  },
  {
    id: 'ANOM-102',
    type: 'PRICE_DEVIATION',
    severity: 'LOW',
    pickupId: 'REQ-103',
    userName: 'City Bakery',
    description: 'Agreed rate for PET plastics (₹22.0/kg) was 22% higher than Mandi baseline (₹18.0/kg). Within acceptable premium lot range.',
    timestamp: '2026-10-11 16:30',
    status: 'PENDING',
  },
];

export const EcoShieldAuditCard: React.FC<EcoShieldProps> = ({
  anomalies = DEFAULT_ANOMALIES,
  onResolve,
}) => {
  const [items, setItems] = useState<EcoShieldAnomaly[]>(anomalies);

  const handleResolve = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: 'RESOLVED' } : it))
    );
    if (onResolve) onResolve(id);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-card-subtle space-y-5">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">EcoShield™ Anomaly & Fraud Sentinel</h3>
            <p className="text-xs text-stone-500 font-medium">
              Automated heuristics flagging suspicious weight discrepancies and rate manipulation
            </p>
          </div>
        </div>
        <Badge variant={items.some((i) => i.status === 'PENDING') ? 'warning' : 'success'}>
          {items.filter((i) => i.status === 'PENDING').length} Unresolved Alerts
        </Badge>
      </div>

      <div className="space-y-3">
        {items.map((anom) => (
          <div
            key={anom.id}
            className="p-4 rounded-2xl border border-stone-200/90 bg-stone-50/70 hover:bg-stone-50 transition-colors space-y-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-stone-900">{anom.type.replace('_', ' ')}</span>
                <span className="text-[10px] font-mono text-stone-400">({anom.id})</span>
                <Badge variant={anom.severity === 'HIGH' ? 'danger' : 'warning'}>
                  {anom.severity} Priority
                </Badge>
              </div>
              <span className="text-[11px] text-stone-400">{anom.timestamp}</span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">{anom.description}</p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-stone-500 font-medium">Subject: {anom.userName}</span>
              {anom.status === 'PENDING' ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleResolve(anom.id)}
                >
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  <span>Mark Investigated & Verified</span>
                </Button>
              ) : (
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Resolved & Logged
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
