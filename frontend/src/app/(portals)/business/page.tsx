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
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { formatINR, formatKg, formatDate } from '../../../lib/utils';
import { useAuthStore } from '../../../store/authStore';

export default function BusinessPortalPage() {
  const { user } = useAuthStore();
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

  // Scheduled pickup form state
  const [selectedFacility, setSelectedFacility] = useState('Okhla Phase-III Central Logistics Bay 7');
  const [estLoad, setEstLoad] = useState(250);
  const [isRecurring, setIsRecurring] = useState(true);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header & ESG Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
              Commercial Generator & EPR Registry
            </span>
          </div>
          <h1 className="text-2xl font-black text-zinc-950 tracking-tight mt-1">
            {user?.name || 'GreenTech Enterprises Ltd'}
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            GSTIN: <span className="font-mono font-bold text-zinc-700">07AAAAA0000A1Z5</span> • Multi-Facility Bulk Contract
          </p>
        </div>

        <div className="flex items-center gap-6 shrink-0 bg-zinc-50 p-3 rounded-xl border border-zinc-200 text-xs">
          <div>
            <div className="text-[10px] uppercase font-bold text-zinc-400">Total Commercial Tonnage</div>
            <div className="font-mono font-bold text-forest-900">1,840 kg Diverted</div>
          </div>
          <div className="border-l border-zinc-200 pl-4">
            <div className="text-[10px] uppercase font-bold text-zinc-400">Annual EPR Obligation</div>
            <div className="font-mono font-bold text-emerald-700">122% Achieved ✓</div>
          </div>
          <div className="border-l border-zinc-200 pl-4">
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsScheduleOpen(true)}
              className="font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Schedule Bulk Dispatch
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Schedule Bulk Dispatch Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                <Truck className="w-4 h-4 text-forest-900" />
                Schedule Commercial Heavy Dispatch
              </h3>
              <button
                onClick={() => setIsScheduleOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSchedulePickup} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Select Facility Dispatch Bay</label>
                <select
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-xl"
                >
                  {facilities.map((f) => (
                    <option key={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Estimated Bulk Load (kg)</label>
                <input
                  type="number"
                  min="50"
                  step="10"
                  value={estLoad}
                  onChange={(e) => setEstLoad(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-xl font-mono"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <input
                  type="checkbox"
                  id="rec"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded text-forest-900 accent-forest-900"
                />
                <label htmlFor="rec" className="font-semibold text-zinc-800">
                  Set as recurring weekly commercial contract
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsScheduleOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="font-bold">
                  Confirm Dispatch Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Facility Dispatch Bays Table */}
      <div className="circular-card p-6 bg-white space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-zinc-950">Active Commercial Dispatch Locations</h2>
            <p className="text-xs text-zinc-500">Warehouse loading docks linked to automated pickup schedules</p>
          </div>
          <span className="text-xs font-mono font-bold text-zinc-500">{facilities.length} Bays Registered</span>
        </div>

        <table className="ops-table">
          <thead>
            <tr>
              <th>Facility Dock / Bay</th>
              <th>Waste Stream Specification</th>
              <th>Weekly Avg Tonnage</th>
              <th>Dispatch Schedule</th>
            </tr>
          </thead>
          <tbody>
            {facilities.map((fac) => (
              <tr key={fac.id}>
                <td className="font-bold text-zinc-950">{fac.name}</td>
                <td className="text-zinc-600">{fac.type}</td>
                <td className="font-mono font-semibold text-forest-900">{fac.weeklyAvg}</td>
                <td>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-forest-900">
                    {fac.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. GST Tax Invoices & CPCB EPR Credit Certificates */}
      <div className="circular-card p-6 bg-white space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-zinc-950">GST E-Invoices & EPR Compliance Certificates</h2>
            <p className="text-xs text-zinc-500">
              Audited transaction records compliant with Central Pollution Control Board guidelines
            </p>
          </div>
          <Button size="sm" variant="outline" className="font-bold text-xs">
            <Download className="w-3.5 h-3.5 mr-1" />
            Download Annual ESG Audit Pack (PDF)
          </Button>
        </div>

        <table className="ops-table">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Facility Origin</th>
              <th>Material Category</th>
              <th>Net Weight</th>
              <th>Settled Amount</th>
              <th>EPR Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.invoiceNo}>
                <td className="font-mono font-bold text-zinc-950">{inv.invoiceNo}</td>
                <td>{inv.facility}</td>
                <td className="font-semibold text-zinc-800">{inv.material}</td>
                <td className="font-mono font-bold">{inv.netWeight} kg</td>
                <td className="font-mono font-black text-forest-900">{formatINR(inv.totalAmount)}</td>
                <td>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-forest-900 font-mono">
                    {inv.eprStatus}
                  </span>
                </td>
                <td className="text-zinc-500 text-[11px]">{inv.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
