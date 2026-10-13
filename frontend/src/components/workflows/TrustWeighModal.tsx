'use client';

import React, { useState } from 'react';
import { Scale, CheckCircle2, QrCode, ShieldCheck, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { formatINR, formatKg } from '../../lib/utils';
import { apiClient } from '../../lib/api-client';

interface TrustWeighModalProps {
  pickup: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (receiptNumber: string) => void;
}

export const TrustWeighModal: React.FC<TrustWeighModalProps> = ({
  pickup,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [items, setItems] = useState<Array<{ categoryName: string; categoryId: string; actualQty: number; agreedPricePerUnit: number }>>([
    {
      categoryName: pickup?.items?.[0]?.categoryName || 'Paper & Cardboard',
      categoryId: pickup?.items?.[0]?.categoryId || 'cat-paper',
      actualQty: pickup?.estimatedTotalWeightKg || 25.0,
      agreedPricePerUnit: 14.0,
    },
  ]);
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'CASH' | 'BANK_TRANSFER'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !pickup) return null;

  const totalAmount = items.reduce((acc, it) => acc + it.actualQty * it.agreedPricePerUnit, 0);
  const totalWeight = items.reduce((acc, it) => acc + it.actualQty, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        paymentMode,
        notes: 'Doorstep weighing verified with digital Bluetooth scale',
        items: items.map((it) => ({
          categoryId: it.categoryId,
          actualQty: it.actualQty,
          agreedPricePerUnit: it.agreedPricePerUnit,
          gradeRecorded: 'Clean Sorted Grade',
        })),
      };

      const res = await apiClient.collector.completeWeighing(pickup.id, payload);
      if (res.success && res.receiptNumber) {
        onSuccess(res.receiptNumber);
      }
    } catch (err) {
      console.error('TrustWeigh error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in-0 zoom-in-95 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">TrustWeigh™ Digital Scale Entry</h3>
              <p className="text-[11px] text-stone-500 font-medium">
                Customer: {pickup.requesterName || 'Household User'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Item Rows */}
        <div className="space-y-3">
          {items.map((it, idx) => (
            <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-stone-800">
                <span>{it.categoryName}</span>
                <span className="text-emerald-800">{formatINR(it.actualQty * it.agreedPricePerUnit)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    Actual Scale Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={it.actualQty}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, actualQty: val } : item)));
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    Agreed Rate (₹/kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={it.agreedPricePerUnit}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, agreedPricePerUnit: val } : item)));
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500 font-bold"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Mode Selector */}
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1.5">
            Agreed Payment Method
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {(['UPI', 'CASH', 'BANK_TRANSFER'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPaymentMode(mode)}
                className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                  paymentMode === mode
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Payout Summary Box */}
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-emerald-800 font-semibold">Total Measured Weight</div>
            <div className="text-base font-extrabold text-stone-900">{formatKg(totalWeight)}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-emerald-800 font-semibold">Total Cash Settlement</div>
            <div className="text-xl font-extrabold text-emerald-950">{formatINR(totalAmount)}</div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 text-xs font-bold"
        >
          {isSubmitting ? 'Recording Tamper-Proof Transaction...' : 'Confirm Weighing & Issue SHA-256 Receipt'}
        </Button>
      </form>
    </div>
  );
};
