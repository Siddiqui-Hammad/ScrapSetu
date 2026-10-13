'use client';

import React, { useState } from 'react';
import { Scale, CheckCircle2, QrCode, ShieldCheck, X, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { formatINR } from '../../lib/utils';

interface TrustWeighModalProps {
  jobContext?: any;
  pickup?: any;
  isOpen: boolean;
  onClose: () => void;
  onCompleteWeigh?: () => void;
  onSuccess?: (receiptNumber: string) => void;
}

export const TrustWeighModal: React.FC<TrustWeighModalProps> = ({
  jobContext,
  pickup,
  isOpen,
  onClose,
  onCompleteWeigh,
  onSuccess,
}) => {
  const job = jobContext || pickup || {};

  // Exact 3 blocks matching Mockup Row 3 Panel 5:
  // Actual Weight 15.0 kg, Rate per kg ₹25, Total Amount ₹375
  const [actualWeight, setActualWeight] = useState(15.0);
  const [ratePerKg, setRatePerKg] = useState(25.0);
  const [deductionKg, setDeductionKg] = useState(0.0);
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'CASH'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const netWeight = Math.max(0, actualWeight - deductionKg);
  const totalAmount = netWeight * ratePerKg;

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onCompleteWeigh) onCompleteWeigh();
      if (onSuccess) onSuccess('WP-2024-00124');
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 space-y-5 animate-in fade-in-0 zoom-in-95">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-forest-900 text-emerald-400 flex items-center justify-center font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-zinc-950 text-base">TrustWeigh™ Anti-Fraud Weighment</h3>
              <p className="text-[11px] text-zinc-500 font-medium">
                Customer: {job.customer || 'Priya Sharma (Indiranagar)'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Metric Blocks - Exact Match to Mockup */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-50 rounded-2xl p-3.5 border border-zinc-200 text-center">
            <div className="text-[10px] uppercase font-bold text-zinc-400">Actual Weight</div>
            <div className="text-xl font-black text-zinc-950 font-mono mt-1">
              {actualWeight.toFixed(1)} kg
            </div>
            <div className="text-[9px] text-emerald-700 font-semibold mt-0.5">Scale Synced ✓</div>
          </div>

          <div className="bg-zinc-50 rounded-2xl p-3.5 border border-zinc-200 text-center">
            <div className="text-[10px] uppercase font-bold text-zinc-400">Rate per kg</div>
            <div className="text-xl font-black text-zinc-950 font-mono mt-1">
              ₹{ratePerKg.toFixed(0)}
            </div>
            <div className="text-[9px] text-zinc-500 font-semibold mt-0.5">Mandi Indexed</div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200 text-center">
            <div className="text-[10px] uppercase font-bold text-emerald-800">Total Amount</div>
            <div className="text-xl font-black text-forest-900 font-mono mt-1">
              ₹{totalAmount.toFixed(0)}
            </div>
            <div className="text-[9px] text-emerald-700 font-semibold mt-0.5">Instant UPI</div>
          </div>
        </div>

        {/* Adjustments & Deductions */}
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3 text-xs">
          <div className="flex items-center justify-between font-bold text-zinc-800">
            <span>Deductions / Moisture Adjustment:</span>
            <span className="font-mono text-zinc-500">{deductionKg.toFixed(1)} kg</span>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
            <span>Payment Method:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPaymentMode('UPI')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  paymentMode === 'UPI'
                    ? 'bg-forest-900 text-white'
                    : 'bg-zinc-200 text-zinc-700'
                }`}
              >
                Instant UPI
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode('CASH')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  paymentMode === 'CASH'
                    ? 'bg-forest-900 text-white'
                    : 'bg-zinc-200 text-zinc-700'
                }`}
              >
                Cash
              </button>
            </div>
          </div>
        </div>

        {/* Final Amount Callout */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-forest-900 text-white shadow-md">
          <div>
            <div className="text-xs text-emerald-300 font-bold uppercase">Final Settlement Amount</div>
            <div className="text-2xl font-black font-mono">₹{totalAmount.toFixed(0)}</div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            Zero-Discrepancy Lock
          </span>
        </div>

        {/* Action Button: Confirm & Generate Receipt - Exact Match to Mockup */}
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={handleConfirm}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-black h-12 rounded-2xl shadow-lg text-xs flex items-center justify-center gap-2"
        >
          <span>{isSubmitting ? 'Locking Blockchain Block...' : 'Confirm & Generate Digital Receipt'}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
