'use client';

import React, { useState } from 'react';
import {
  Factory,
  Scale,
  Plus,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent } from '../../../components/ui/card';
import { formatINR, formatKg } from '../../../lib/utils';
import { useAuthStore } from '../../../store/authStore';

export default function RecyclerPortalPage() {
  const { user } = useAuthStore();
  const [successMsg, setSuccessMsg] = useState('');

  // Rate sheet
  const [offers, setOffers] = useState([
    { cat: 'Paper & Cardboard', rate: 11.5, minLot: 50, location: 'Mansarovar RIICO' },
    { cat: 'Rigid Plastics (PET / HDPE)', rate: 20.5, minLot: 30, location: 'Mansarovar RIICO' },
    { cat: 'Ferrous Metals (Iron & Steel)', rate: 30.0, minLot: 100, location: 'Mansarovar RIICO' },
  ]);

  // Form states
  const [newCat, setNewCat] = useState('Paper & Cardboard');
  const [newRate, setNewRate] = useState(13.0);
  const [newLot, setNewLot] = useState(50);

  // Intake Slip Form states
  const [slipSupplier, setSlipSupplier] = useState('Mohammad Farooq (Verified Collector)');
  const [slipWeight, setSlipWeight] = useState(187.5);
  const [slipRate, setSlipRate] = useState(19.5);

  const handlePublishRate = (e: React.FormEvent) => {
    e.preventDefault();
    setOffers((prev) => [
      ...prev,
      { cat: newCat, rate: newRate, minLot: newLot, location: 'Mansarovar RIICO' },
    ]);
    setSuccessMsg('New buying rate offer published live across regional collector terminals!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleGenerateSlip = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('Weighbridge intake slip generated and linked to collector ledger!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Recycler Plant Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
            <Factory className="w-3.5 h-3.5" />
            <span>Industrial Recycling Facility Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.name || 'Aravalli Ecocycle Processing Mills'}
          </h1>
          <p className="text-xs text-slate-300 font-medium">
            CPCB Registration: RJ/PWM/2026/0491 • Facility: Mansarovar RIICO Industrial Area
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
          <div className="text-xl font-extrabold text-emerald-400">CPCB Verified ✓</div>
          <div className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">
            Licence Active
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-card-subtle">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Inbound Weight</div>
          <div className="text-2xl font-black text-stone-900 mt-1">187.5 kg</div>
          <span className="text-[11px] text-emerald-700 font-semibold">Today's Intake</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-card-subtle">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Material Outlay</div>
          <div className="text-2xl font-black text-stone-900 mt-1">{formatINR(3656.25)}</div>
          <span className="text-[11px] text-stone-400">Direct Mill Settlement</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-card-subtle">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Published Rates</div>
          <div className="text-2xl font-black text-stone-900 mt-1">{offers.length} Active</div>
          <span className="text-[11px] text-emerald-700 font-semibold">Broadcasting to Mandi</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-card-subtle">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Monthly Capacity</div>
          <div className="text-2xl font-black text-purple-900 mt-1">500 T</div>
          <span className="text-[11px] text-stone-400">Industrial Processing</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Published Factory Buying Rates */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-bold text-stone-900 text-base">Published Factory Buying Rates</h3>
                  <p className="text-xs text-stone-500 font-medium">
                    Broadcasted to local kabadiwalas and collection hubs
                  </p>
                </div>
                <Badge variant="outline">{offers.length} Streams</Badge>
              </div>

              <div className="space-y-2.5">
                {offers.map((off, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-stone-900">{off.cat}</div>
                      <div className="text-[11px] text-stone-500 font-medium">Min lot: {off.minLot} kg</div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-extrabold text-emerald-900">₹{off.rate}/kg</div>
                      <div className="text-[10px] text-stone-400">{off.location}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form to add rate */}
              <form onSubmit={handlePublishRate} className="pt-2 border-t border-stone-100 space-y-3 text-xs">
                <span className="font-bold text-stone-800 block">+ Post New Buying Offer</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-600 block mb-1">Category</label>
                    <select
                      value={newCat}
                      onChange={(e) => setNewCat(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                    >
                      <option>Paper & Cardboard</option>
                      <option>Rigid Plastics (PET / HDPE)</option>
                      <option>Ferrous Metals (Iron & Steel)</option>
                      <option>Copper & Aluminium</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-stone-600 block mb-1">Buying Rate (₹/kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newRate}
                      onChange={(e) => setNewRate(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-bold"
                    />
                  </div>
                </div>

                <Button type="submit" size="sm" variant="default" className="w-full">
                  Publish Rate to Regional Mandi Terminals
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Weighbridge Gate Intake Slip Generator */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-5">
              <div>
                <h3 className="font-bold text-stone-900 text-base">Weighbridge Gate Intake Slip</h3>
                <p className="text-xs text-stone-500 font-medium">
                  Record industrial scale intake and link to collector transaction
                </p>
              </div>

              <form onSubmit={handleGenerateSlip} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Supplier / Collector Name</label>
                  <input
                    type="text"
                    value={slipSupplier}
                    onChange={(e) => setSlipSupplier(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Scale Net Weight (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={slipWeight}
                      onChange={(e) => setSlipWeight(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Purchase Rate (₹/kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={slipRate}
                      onChange={(e) => setSlipRate(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-950">Total Settlement Outlay:</span>
                  <span className="text-lg font-black text-purple-950">{formatINR(slipWeight * slipRate)}</span>
                </div>

                <Button type="submit" variant="default" className="w-full text-xs font-bold py-3.5">
                  Record Weighbridge Slip & Issue QR Receipt
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
