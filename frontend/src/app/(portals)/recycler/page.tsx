'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Factory,
  Scale,
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileText,
  TrendingUp,
  Download,
  Filter,
  Search,
  ArrowRight,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { formatINR, formatKg, formatDate } from '../../../lib/utils';
import { useAuthStore } from '../../../store/authStore';

export default function RecyclerPortalPage() {
  const { user } = useAuthStore();

  // Inbound Lots Data (Table-centric)
  const [inboundLots, setInboundLots] = useState([
    {
      lotId: 'LOT-2026-OCT-7712',
      supplier: 'Ramu Paswan (Kavach Certified)',
      material: 'Rigid Plastics (PET Clear Optical)',
      grossKg: 182.5,
      tareKg: 7.5,
      netKg: 175.0,
      moisturePercent: 1.2,
      agreedRate: 31.5,
      status: 'PENDING_INSPECTION', // PENDING_INSPECTION, ACCEPTED, PROCESSED, FLAGGED
      discrepancy: 'None (Matches Origin Slip)',
      time: '11:45 AM Today',
    },
    {
      lotId: 'LOT-2026-OCT-7709',
      supplier: 'Mohammad Farooq (Mini Truck)',
      material: 'Kraft Corrugated Carton (Gatta)',
      grossKg: 520.0,
      tareKg: 15.0,
      netKg: 505.0,
      moisturePercent: 3.5,
      agreedRate: 17.0,
      status: 'ACCEPTED',
      discrepancy: 'Moisture -2% Adjusted',
      time: '09:30 AM Today',
    },
    {
      lotId: 'LOT-2026-OCT-7698',
      supplier: 'GreenTech Commercial Logistics',
      material: 'Server Motherboards & Mixed PCBs',
      grossKg: 65.0,
      tareKg: 2.0,
      netKg: 63.0,
      moisturePercent: 0.0,
      agreedRate: 135.0,
      status: 'PROCESSED',
      discrepancy: 'None',
      time: 'Yesterday',
    },
  ]);

  // Buying Rate Sheet Data
  const [buyingRates, setBuyingRates] = useState([
    { id: 'br-1', category: 'Rigid Plastics (PET / HDPE)', grade: 'Optical Clean / Food Contact', ratePerKg: 31.5, minLotKg: 50, dailyIntakeCapKg: 1500, active: true },
    { id: 'br-2', category: 'Paper & Cardboard (Gatta)', grade: 'Kraft Mill Grade A', ratePerKg: 17.0, minLotKg: 100, dailyIntakeCapKg: 3000, active: true },
    { id: 'br-3', category: 'Copper Wire (Millberry)', grade: 'Electrolytic 99.9%', ratePerKg: 695.0, minLotKg: 20, dailyIntakeCapKg: 500, active: true },
    { id: 'br-4', category: 'Heavy Structural Iron', grade: 'HMS 1/2 Melting Quality', ratePerKg: 35.5, minLotKg: 150, dailyIntakeCapKg: 5000, active: true },
  ]);

  const [filterText, setFilterText] = useState('');
  const [isNewSlipOpen, setIsNewSlipOpen] = useState(false);

  // New slip form state
  const [slipSupplier, setSlipSupplier] = useState('');
  const [slipMaterial, setSlipMaterial] = useState('Rigid Plastics (PET / HDPE)');
  const [slipGross, setSlipGross] = useState(250.0);
  const [slipTare, setSlipTare] = useState(10.0);
  const [slipRate, setSlipRate] = useState(31.5);

  const handleCreateSlip = (e: React.FormEvent) => {
    e.preventDefault();
    const net = Math.max(0, slipGross - slipTare);
    const newLot = {
      lotId: `LOT-2026-OCT-${Math.floor(7700 + Math.random() * 900)}`,
      supplier: slipSupplier || 'Verified Doorstep Collector',
      material: slipMaterial,
      grossKg: slipGross,
      tareKg: slipTare,
      netKg: net,
      moisturePercent: 1.0,
      agreedRate: slipRate,
      status: 'ACCEPTED',
      discrepancy: 'None',
      time: 'Just now',
    };
    setInboundLots([newLot, ...inboundLots]);
    setIsNewSlipOpen(false);
  };

  const handleAcceptLot = (lotId: string) => {
    setInboundLots((prev) =>
      prev.map((l) => (l.lotId === lotId ? { ...l, status: 'ACCEPTED' } : l))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Industrial Plant Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              State Pollution Control Board Registered Facility
            </span>
          </div>
          <h1 className="text-2xl font-black text-zinc-950 tracking-tight mt-1">
            {user?.name || 'EcoPlast Reclaimers Pvt Ltd'}
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            CPCB Registration: <span className="font-mono font-bold text-zinc-700">CPCB/PWM/DEL-2024/092</span> • Okhla Industrial Cluster
          </p>
        </div>

        <div className="flex items-center gap-6 shrink-0 bg-zinc-50 p-3 rounded-xl border border-zinc-200 text-xs">
          <div>
            <div className="text-[10px] uppercase font-bold text-zinc-400">Weighbridge Status</div>
            <div className="font-mono font-bold text-forest-900">50T Digital (Calibrated)</div>
          </div>
          <div className="border-l border-zinc-200 pl-4">
            <div className="text-[10px] uppercase font-bold text-zinc-400">Today Inbound</div>
            <div className="font-mono font-bold text-emerald-700">743.0 kg Net</div>
          </div>
          <div className="border-l border-zinc-200 pl-4">
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsNewSlipOpen(true)}
              className="font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              New Weighbridge Slip
            </Button>
          </div>
        </div>
      </div>

      {/* 2. New Slip Modal */}
      {isNewSlipOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                <Scale className="w-4 h-4 text-forest-900" />
                Issue Weighbridge Gate Intake Slip
              </h3>
              <button
                onClick={() => setIsNewSlipOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSlip} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Supplier / Collector Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramu Paswan (Kavach Certified)"
                  value={slipSupplier}
                  onChange={(e) => setSlipSupplier(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Material Category</label>
                <select
                  value={slipMaterial}
                  onChange={(e) => setSlipMaterial(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-xl"
                >
                  <option>Rigid Plastics (PET / HDPE)</option>
                  <option>Kraft Corrugated Carton (Gatta)</option>
                  <option>Copper Wire (Millberry)</option>
                  <option>Heavy Structural Iron (HMS)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Gross Truck Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={slipGross}
                    onChange={(e) => setSlipGross(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Tare Container Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={slipTare}
                    onChange={(e) => setSlipTare(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex justify-between items-center">
                <span>Calculated Net Weight:</span>
                <span className="font-mono font-bold text-forest-900 text-sm">
                  {Math.max(0, slipGross - slipTare)} kg
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsNewSlipOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="font-bold">
                  Confirm Intake & Generate QR Pass
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Inbound Material Deliveries (High-Density Operational Data Table) */}
      <div className="circular-card p-6 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-zinc-950">Inbound Material Gate Intakes</h2>
            <p className="text-xs text-zinc-500">Live weighbridge passes awaiting QC inspection and hopper unloading</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search Lot ID or Supplier..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Compact Table */}
        <div className="overflow-x-auto">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Lot Identifier</th>
                <th>Supplier Partner</th>
                <th>Material Category</th>
                <th>Gross / Tare</th>
                <th>Net Weight</th>
                <th>Agreed Rate</th>
                <th>Discrepancy Status</th>
                <th>Inspection Action</th>
              </tr>
            </thead>
            <tbody>
              {inboundLots
                .filter((l) => l.lotId.toLowerCase().includes(filterText.toLowerCase()) || l.supplier.toLowerCase().includes(filterText.toLowerCase()))
                .map((lot) => {
                  const isPending = lot.status === 'PENDING_INSPECTION';
                  return (
                    <tr key={lot.lotId}>
                      <td className="font-mono font-bold text-zinc-950">{lot.lotId}</td>
                      <td>
                        <div className="font-bold">{lot.supplier}</div>
                        <div className="text-[10px] text-zinc-400">{lot.time}</div>
                      </td>
                      <td className="font-semibold text-zinc-800">{lot.material}</td>
                      <td className="font-mono text-zinc-500">
                        {lot.grossKg} / {lot.tareKg} kg
                      </td>
                      <td className="font-mono font-black text-forest-900 text-sm">
                        {lot.netKg} kg
                      </td>
                      <td className="font-mono font-semibold">₹{lot.agreedRate}/kg</td>
                      <td>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            lot.discrepancy.includes('None')
                              ? 'bg-emerald-100 text-forest-900'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {lot.discrepancy}
                        </span>
                      </td>
                      <td>
                        {isPending ? (
                          <button
                            onClick={() => handleAcceptLot(lot.lotId)}
                            className="px-2.5 py-1 rounded-lg bg-forest-900 text-white font-bold text-[11px] hover:bg-forest-950 transition-colors shadow-2xs"
                          >
                            Accept & Unload
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Unloaded
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Factory Buying Rate Sheet Manager */}
      <div className="circular-card p-6 bg-white space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-zinc-950">Published Buying Rate Sheet</h2>
            <p className="text-xs text-zinc-500">
              Wholesale procurement rates broadcasted daily to all certified regional collectors
            </p>
          </div>
          <Button size="sm" variant="outline" className="font-bold text-xs">
            Broadcast Updated Rates to Mandis
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Specifications / Grade</th>
                <th>Buying Rate (₹/kg)</th>
                <th>Min Lot Size</th>
                <th>Daily Intake Target</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {buyingRates.map((br) => (
                <tr key={br.id}>
                  <td className="font-bold text-zinc-950">{br.category}</td>
                  <td className="text-zinc-600">{br.grade}</td>
                  <td>
                    <span className="font-mono font-black text-forest-900 text-sm">
                      ₹{br.ratePerKg.toFixed(2)}
                    </span>
                  </td>
                  <td className="font-mono text-zinc-600">{br.minLotKg} kg</td>
                  <td className="font-mono text-zinc-600">{br.dailyIntakeCapKg} kg / day</td>
                  <td>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-forest-900">
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
