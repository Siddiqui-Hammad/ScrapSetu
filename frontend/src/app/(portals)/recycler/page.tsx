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
  Layers,
  DollarSign,
  Truck,
  RotateCcw,
  BarChart3,
  Settings,
  Recycle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatINR, formatKg } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export default function RecyclerPortalPage() {
  const { user } = useAuthStore();
  const [activeNav, setActiveNav] = useState<'lots' | 'rates' | 'inventory' | 'dispatches' | 'analytics'>('lots');
  const [lotFilter, setLotFilter] = useState<'all' | 'pending' | 'in_process' | 'completed'>('all');

  // Exact 5 Incoming Material Lots matching Mockup Row 2 Panel 3
  const [incomingLots, setIncomingLots] = useState([
    {
      id: '#LOT001',
      supplier: 'Ramesh Kumar',
      material: 'Mixed Plastic PET',
      grossKg: 320,
      impurityPct: 4.2,
      netKg: 306.5,
      status: 'Pending',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      id: '#LOT002',
      supplier: 'Suresh Yadav',
      material: 'Old Corrugated Cardboard',
      grossKg: 540,
      impurityPct: 2.1,
      netKg: 528.6,
      status: 'In Process',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      id: '#LOT003',
      supplier: 'City Solid Waste',
      material: 'Mixed Aluminium Cans',
      grossKg: 180,
      impurityPct: 1.0,
      netKg: 178.2,
      status: 'In Process',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      id: '#LOT004',
      supplier: 'GreenLogistics',
      material: 'E-Waste PCB Boards',
      grossKg: 95,
      impurityPct: 0.5,
      netKg: 94.5,
      status: 'Completed',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      id: '#LOT005',
      supplier: 'Mahesh Verma',
      material: 'Glass Bottles',
      grossKg: 410,
      impurityPct: 3.5,
      netKg: 395.6,
      status: 'Pending',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
  ]);

  // Exact 4 Current Buying Rates matching Mockup Row 2 Panel 3
  const buyingRates = [
    {
      material: 'Plastic (PET/HDPE)',
      range: '₹25 - ₹45 / kg',
      trend: '+5%',
      up: true,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      material: 'Cardboard (OCC)',
      range: '₹10 - ₹20 / kg',
      trend: '+2%',
      up: true,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      material: 'Aluminium Cans',
      range: '₹120 - ₹160 / kg',
      trend: '+12%',
      up: true,
      color: 'text-orange-700 bg-orange-50 border-orange-200',
    },
    {
      material: 'E-Waste (PCBs)',
      range: '₹50 - ₹120 / kg',
      trend: '+8%',
      up: true,
      color: 'text-purple-700 bg-purple-50 border-purple-200',
    },
  ];

  const handleUpdateStatus = (lotId: string, newStatus: string) => {
    setIncomingLots((prev) =>
      prev.map((lot) =>
        lot.id === lotId
          ? {
              ...lot,
              status: newStatus,
              statusColor:
                newStatus === 'Completed'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-blue-100 text-blue-800 border-blue-200',
            }
          : lot
      )
    );
  };

  const filteredLots = incomingLots.filter((lot) => {
    if (lotFilter === 'pending') return lot.status === 'Pending';
    if (lotFilter === 'in_process') return lot.status === 'In Process';
    if (lotFilter === 'completed') return lot.status === 'Completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex">
      {/* 1. Left Dark Forest Sidebar - Exact Match to Mockup Row 2 Panel 3 */}
      <aside className="w-64 bg-forest-900 text-white shrink-0 hidden lg:flex flex-col justify-between p-5 border-r border-forest-950">
        <div className="space-y-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-forest-950 flex items-center justify-center font-bold">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-white leading-tight">
                ScrapSetu
              </div>
              <div className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">
                Recycler Facility
              </div>
            </div>
          </Link>

          <nav className="space-y-1.5">
            {[
              { id: 'lots', label: 'Incoming Lots', icon: Package },
              { id: 'rates', label: 'Rate Sheet & Mandi', icon: DollarSign },
              { id: 'inventory', label: 'Baled Inventory', icon: Layers },
              { id: 'dispatches', label: 'Truck Dispatches', icon: Truck },
              { id: 'analytics', label: 'EPR Accounting', icon: BarChart3 },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-forest-950 shadow-md font-extrabold'
                      : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Facility Card in Sidebar */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-400 text-forest-950 font-black flex items-center justify-center text-xs">
            ET
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-extrabold text-white truncate">
              EcoTransform Mill #04
            </div>
            <div className="text-[10px] text-zinc-400">CPCB Reg: #BLR-CPCB-04</div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Registered Recycling &amp; Pelletizing Facility
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
              EcoTransform Operations Terminal
            </h1>
            <p className="text-xs text-zinc-500 font-medium">
              Weighbridge Intake • Moisture &amp; Quality Deduction • EPR Traceability Passports
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="bg-forest-900 hover:bg-forest-950 text-white font-bold text-xs px-4"
              onClick={() => alert('New digital weighbridge slip created.')}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>New Weighbridge Slip</span>
            </Button>
          </div>
        </div>

        {/* Current Buying Rates (4 Cards) - Exact Match to Mockup */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Current Buying Rates (Live Market)
            </h3>
            <span className="text-xs text-emerald-700 font-bold">Updated 10m ago</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {buyingRates.map((br, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-sm flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-extrabold text-zinc-900">{br.material}</div>
                  <div className="text-sm font-black text-forest-900 font-mono mt-0.5">
                    {br.range}
                  </div>
                </div>
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  ↑ {br.trend}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Incoming Material Lots Table - Exact Match to Mockup */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-zinc-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-zinc-950 tracking-tight">
                Incoming Material Lots
              </h2>
              <p className="text-xs text-zinc-500">
                Calibrated weighbridge receipts awaiting processing and quality grading.
              </p>
            </div>

            {/* Tabs matching mockup: All, Pending, In Process, Completed */}
            <div className="flex items-center rounded-xl bg-zinc-100 p-1 text-xs font-bold">
              {[
                { id: 'all', label: 'All Lots (5)' },
                { id: 'pending', label: 'Pending (2)' },
                { id: 'in_process', label: 'In Process (2)' },
                { id: 'completed', label: 'Completed (1)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setLotFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    lotFilter === tab.id
                      ? 'bg-white text-forest-900 shadow-2xs font-extrabold'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 uppercase text-[10px] font-black border-y border-zinc-200">
                <tr>
                  <th className="py-3 px-4">Lot ID</th>
                  <th className="py-3 px-4">Collector / Source</th>
                  <th className="py-3 px-4">Material Type</th>
                  <th className="py-3 px-4">Gross Weight</th>
                  <th className="py-3 px-4">Deduction</th>
                  <th className="py-3 px-4">Net Weight</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/80">
                {filteredLots.map((lot) => (
                  <tr key={lot.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-black text-zinc-950">
                      {lot.id}
                    </td>
                    <td className="py-3 px-4 font-bold text-zinc-800">
                      {lot.supplier}
                    </td>
                    <td className="py-3 px-4 font-semibold text-zinc-600">
                      {lot.material}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-zinc-700">
                      {lot.grossKg} kg
                    </td>
                    <td className="py-3 px-4 font-mono text-amber-700">
                      {lot.impurityPct}%
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                      {lot.netKg} kg
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${lot.statusColor}`}
                      >
                        {lot.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {lot.status === 'Pending' ? (
                        <button
                          onClick={() => handleUpdateStatus(lot.id, 'In Process')}
                          className="px-2.5 py-1 rounded-lg bg-forest-900 text-white font-bold text-[11px] hover:bg-forest-950 transition-colors"
                        >
                          Inspect / Grade
                        </button>
                      ) : lot.status === 'In Process' ? (
                        <button
                          onClick={() => handleUpdateStatus(lot.id, 'Completed')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition-colors"
                        >
                          Process Batch
                        </button>
                      ) : (
                        <Link
                          href="/passport/RCP-2026-DEL-0894"
                          className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-800 font-bold text-[11px] hover:bg-zinc-200 transition-colors inline-block"
                        >
                          View Passport
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Processing Capacity & Environmental Output Row - Exact Match to Mockup */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-5 shadow-lg border border-zinc-200/80 space-y-2">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Processing Capacity
            </div>
            <div className="text-2xl font-black text-zinc-950 font-mono">
              320 / 500 tons (64%)
            </div>
            <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '64%' }} />
            </div>
            <div className="text-[11px] text-zinc-400">180 tons spare hydraulic capacity</div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-lg border border-zinc-200/80 space-y-2">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Received This Month
            </div>
            <div className="text-2xl font-black text-emerald-800 font-mono">
              245 tons
            </div>
            <div className="text-xs text-zinc-500">
              Aggregated from 14 verified local kabadiwala hubs.
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-lg border border-zinc-200/80 space-y-2">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Dispatched Bales
            </div>
            <div className="text-2xl font-black text-blue-900 font-mono">
              190 tons
            </div>
            <div className="text-xs text-zinc-500">
              Shipped to FMCG brand partners under EPR compliance.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
