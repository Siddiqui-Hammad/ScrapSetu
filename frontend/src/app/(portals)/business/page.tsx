'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Calendar,
  Download,
  FileText,
  Truck,
  Plus,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  BarChart2,
  Leaf,
  Layers,
  Recycle,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatINR, formatKg, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export default function BusinessPortalPage() {
  const { user } = useAuthStore();
  const [activeNav, setActiveNav] = useState<'facilities' | 'schedule' | 'invoices' | 'epr' | 'credits'>('facilities');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // Commercial Facilities
  const facilities = [
    { id: 'fac-1', name: 'Okhla Phase-III Central Logistics Bay 7', type: 'Industrial Pallets & Cartons', weeklyAvg: '450 kg', status: 'Active Primary' },
    { id: 'fac-2', name: 'Saket District Centre Mall Outlet', type: 'Retail Packaging & Plastic', weeklyAvg: '180 kg', status: 'Active Branch' },
    { id: 'fac-3', name: 'Gurugram Tech Park Data Center', type: 'E-Waste & Server Racks', weeklyAvg: '95 kg', status: 'Quarterly Pickup' },
  ];

  // Commercial Invoices & EPR Certificates
  const [invoices, setInvoices] = useState([
    {
      invoiceNo: 'GST-2026-DEL-0894',
      facility: 'Okhla Central Bay 7',
      material: 'Baled Corrugated Cartons (Kraft)',
      netWeight: 175.0,
      gstin: '07AAAAA0000A1Z5',
      hsnCode: 'HSN-4707',
      totalAmount: 6895.0,
      eprStatus: 'CPCB CAT-I VERIFIED',
      date: '2026-10-10',
    },
    {
      invoiceNo: 'GST-2026-DEL-0712',
      facility: 'Saket Mall Outlet',
      material: 'Clean Rigid PET Packaging',
      netWeight: 210.0,
      gstin: '07AAAAA0000A1Z5',
      hsnCode: 'HSN-3915',
      totalAmount: 8120.0,
      eprStatus: 'CPCB CAT-II VERIFIED',
      date: '2026-09-28',
    },
  ]);

  const [selectedFacility, setSelectedFacility] = useState('Okhla Phase-III Central Logistics Bay 7');
  const [estLoad, setEstLoad] = useState(250);

  const handleSchedulePickup = (e: React.FormEvent) => {
    e.preventDefault();
    const newInv = {
      invoiceNo: `GST-2026-DEL-${Math.floor(1000 + Math.random() * 9000)}`,
      facility: selectedFacility,
      material: 'Industrial Secondary Packaging & Scrap',
      netWeight: estLoad,
      gstin: '07AAAAA0000A1Z5',
      hsnCode: 'HSN-4707',
      totalAmount: estLoad * 17.5,
      eprStatus: 'PROCESSING',
      date: 'Scheduled Tomorrow',
    };
    setInvoices([newInv, ...invoices]);
    setIsScheduleOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex">
      {/* 1. Left Dark Forest Sidebar */}
      <aside className="w-64 bg-forest-900 text-white shrink-0 hidden lg:flex flex-col justify-between p-5 border-r border-forest-950">
        <div className="space-y-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-white leading-tight">
                ScrapSetu
              </div>
              <div className="text-[10px] font-bold text-blue-300 tracking-wider uppercase">
                Enterprise Portal
              </div>
            </div>
          </Link>

          <nav className="space-y-1.5">
            {[
              { id: 'facilities', label: 'Commercial Facilities', icon: Building2 },
              { id: 'schedule', label: 'Bulk Dispatch', icon: Truck },
              { id: 'invoices', label: 'GST Invoices', icon: FileText },
              { id: 'epr', label: 'CPCB EPR Certificates', icon: ShieldCheck },
              { id: 'credits', label: 'ESG Reporting', icon: Leaf },
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

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-500 text-white font-black flex items-center justify-center text-xs">
            GT
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-extrabold text-white truncate">
              GreenTech Solutions
            </div>
            <div className="text-[10px] text-zinc-400">GSTIN: 07AAAAA0000A1Z5</div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                Commercial Waste Generator Terminal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
              Enterprise ESG &amp; Bulk Dispatch
            </h1>
            <p className="text-xs text-zinc-500 font-medium">
              Multi-facility scheduled pickup • Automated B2B GST Invoicing • CPCB EPR Compliance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="bg-forest-900 hover:bg-forest-950 text-white font-bold text-xs px-4"
              onClick={() => setIsScheduleOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Schedule Bulk Pickup</span>
            </Button>
          </div>
        </div>

        {/* Top 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-5 shadow-lg border border-zinc-200/80 space-y-2">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Total Recycled to Date
            </div>
            <div className="text-2xl font-black text-zinc-950 font-mono">
              38.5 Tons
            </div>
            <div className="text-xs text-emerald-700 font-bold">+18% vs Last Quarter</div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-lg border border-zinc-200/80 space-y-2">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              EPR Credits Accrued
            </div>
            <div className="text-2xl font-black text-blue-900 font-mono">
              385 Credits
            </div>
            <div className="text-xs text-zinc-500">CPCB Portal Sync Active ✓</div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-lg border border-zinc-200/80 space-y-2">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Carbon Mitigated
            </div>
            <div className="text-2xl font-black text-emerald-800 font-mono">
              63.5 Tons CO₂
            </div>
            <div className="text-xs text-zinc-500">Audited by Bureau Veritas standard</div>
          </div>
        </div>

        {/* Facilities List & Invoices */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-xl border border-zinc-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-zinc-950 tracking-tight">
                Active Facilities &amp; Warehouses
              </h2>
              <span className="text-xs text-zinc-400">3 Registered</span>
            </div>

            <div className="space-y-3">
              {facilities.map((fac) => (
                <div
                  key={fac.id}
                  className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 hover:bg-white transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-zinc-950">{fac.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {fac.status}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500">{fac.type}</div>
                  <div className="text-[11px] font-mono text-forest-900 font-bold pt-1">
                    Weekly Average: {fac.weeklyAvg}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-xl border border-zinc-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-zinc-950 tracking-tight">
                Recent GST Dispatch Invoices
              </h2>
              <span className="text-xs text-zinc-400">Download Tax Invoices</span>
            </div>

            <div className="space-y-3">
              {invoices.map((inv) => (
                <div
                  key={inv.invoiceNo}
                  className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 hover:bg-white transition-all flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="font-mono font-black text-xs text-zinc-950">
                      {inv.invoiceNo}
                    </div>
                    <div className="text-xs text-zinc-700 font-semibold">{inv.material}</div>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      {inv.netWeight} kg • {inv.date}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-black text-forest-900 font-mono">
                      {formatINR(inv.totalAmount)}
                    </div>
                    <span className="inline-block mt-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                      {inv.eprStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Schedule Bulk Dialog */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h3 className="text-base font-black text-zinc-950">Schedule Commercial Bulk Pickup</h3>
              <button onClick={() => setIsScheduleOpen(false)} className="text-zinc-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleSchedulePickup} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Origin Facility</label>
                <select
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl font-bold"
                >
                  {facilities.map((f) => (
                    <option key={f.id} value={f.name}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Estimated Load (kg)</label>
                <input
                  type="number"
                  value={estLoad}
                  onChange={(e) => setEstLoad(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl font-mono font-bold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-200">
                <Button variant="outline" size="sm" onClick={() => setIsScheduleOpen(false)}>Cancel</Button>
                <Button size="sm" type="submit" className="bg-forest-900 text-white font-bold">Dispatch Truck</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
