'use client';

import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  FileText,
  Download,
  Plus,
  ShieldCheck,
  TrendingUp,
  Truck,
  Leaf,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent } from '../../../components/ui/card';
import { formatINR, formatKg, formatDate } from '../../../lib/utils';
import { useAuthStore } from '../../../store/authStore';

export default function BusinessPortalPage() {
  const { user } = useAuthStore();
  const [successMsg, setSuccessMsg] = useState('');

  const [invoices, setInvoices] = useState([
    {
      invoiceNo: 'INV-2026-JP-00192',
      branch: 'Sitapura Industrial Bay 7',
      materials: 'Packaging Cardboard (105kg), Scrap Iron (82.5kg)',
      weightKg: 187.5,
      amount: 3442.5,
      date: '2026-10-09',
      payment: 'UPI Verified',
      gstin: '08AAAAA1234A1Z5',
    },
    {
      invoiceNo: 'INV-2026-JP-00114',
      branch: 'Sitapura Industrial Bay 7',
      materials: 'Office Paper Shreds (210kg)',
      weightKg: 210.0,
      amount: 4120.0,
      date: '2026-09-28',
      payment: 'Bank Transfer',
      gstin: '08AAAAA1234A1Z5',
    },
  ]);

  const handleBookDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('Bulk commercial dispatch scheduled! Assigned to heavy mini-truck carrier.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleExportEprReport = () => {
    alert('Generating Verified ESG / EPR Extended Producer Responsibility Audit Certificate (PDF)...');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Enterprise Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>Commercial Bulk Generator Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.name || 'GreenLeaf Logistics & Hospitality'}
          </h1>
          <p className="text-xs text-slate-300 font-medium">
            GSTIN: 08AAAAA1234A1Z5 • Operating Hub: Sitapura Industrial Area, Jaipur
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={handleExportEprReport}
          className="text-xs font-bold shadow-sm"
        >
          <Download className="w-4 h-4 mr-1.5" />
          <span>Download CPCB EPR Certificate</span>
        </Button>
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
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Tonnage</div>
          <div className="text-2xl font-black text-stone-900 mt-1">397.5 kg</div>
          <span className="text-[11px] text-emerald-700 font-semibold">100% Circular Diversion</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-card-subtle">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Scrap Revenue</div>
          <div className="text-2xl font-black text-stone-900 mt-1">{formatINR(7562.5)}</div>
          <span className="text-[11px] text-stone-400">Direct Account Settlement</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-card-subtle">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Dispatches</div>
          <div className="text-2xl font-black text-stone-900 mt-1">2 Shipments</div>
          <span className="text-[11px] text-emerald-700 font-semibold">Weekly Recurring Active</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-card-subtle">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">EPR Compliance</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">100% Verified</div>
          <span className="text-[11px] text-stone-400">Audit-Ready Ledger</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Commercial Bulk Scheduler */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-5">
              <div>
                <h3 className="font-bold text-stone-900 text-base">Schedule Commercial Bulk Dispatch</h3>
                <p className="text-xs text-stone-500 font-medium">
                  Dispatch heavy packaging, scrap iron, or commercial electronic waste
                </p>
              </div>

              <form onSubmit={handleBookDispatch} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Facility / Branch Location</label>
                  <select className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium">
                    <option>Central Warehouse — Sitapura Bay 7</option>
                    <option>City Hospitality Outlet — Malviya Nagar</option>
                    <option>Distribution Hub — Mansarovar RIICO</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Primary Material Stream</label>
                    <select className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium">
                      <option>Cardboard & Packaging</option>
                      <option>Industrial Metals (Iron/Steel)</option>
                      <option>Commercial E-Waste</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Estimated Load (kg)</label>
                    <input
                      type="number"
                      defaultValue={150}
                      min={50}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-bold"
                    />
                  </div>
                </div>

                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 flex items-center gap-2 text-blue-900 font-semibold">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span>Set as recurring weekly commercial subscription</span>
                </div>

                <Button type="submit" className="w-full text-xs font-bold py-3.5">
                  Book Commercial Mini-Truck Dispatch
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: GST Invoices & Weighbridge Records */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-stone-900 text-base">GST Invoices & Weighbridge Slips</h3>
                  <p className="text-xs text-stone-500 font-medium">
                    Cryptographically hashed digital transaction receipts
                  </p>
                </div>
                <Badge variant="outline">{invoices.length} Invoices</Badge>
              </div>

              <div className="space-y-3">
                {invoices.map((inv) => (
                  <div
                    key={inv.invoiceNo}
                    className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-extrabold text-stone-900 font-mono">{inv.invoiceNo}</span>
                      <span className="font-black text-emerald-900 text-sm">{formatINR(inv.amount)}</span>
                    </div>

                    <div className="font-medium text-stone-700">{inv.materials}</div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500 pt-1 border-t border-stone-200/60">
                      <span>{inv.branch} • {inv.date}</span>
                      <Badge variant="success">{inv.payment}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
