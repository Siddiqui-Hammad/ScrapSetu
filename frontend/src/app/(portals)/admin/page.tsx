'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  Scale,
  Database,
  FileText,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  Users,
  Package,
  Leaf,
  BarChart3,
  DollarSign,
  Settings,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KycDossierInspector } from '@/components/workflows/KycDossierInspector';
import { PhotoMatchingVerificationWorkspace } from '@/components/workflows/PhotoMatchingVerificationWorkspace';
import { formatINR, formatKg } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export default function AdminPortalPage() {
  const { user } = useAuthStore();
  const [activeNav, setActiveNav] = useState<'overview' | 'verifications' | 'pricing' | 'transactions' | 'analytics' | 'settings'>('overview');
  const [selectedKycForReview, setSelectedKycForReview] = useState<any>(null);

  // Exact 4 Platform Overview Metrics matching Mockup Row 2 Panel 4
  const platformStats = [
    {
      label: 'Total Users',
      value: '12,485',
      trend: '+18% MoM',
      icon: Users,
      color: 'bg-emerald-50 text-forest-900 border-emerald-200',
    },
    {
      label: 'Bookings Completed',
      value: '3,240',
      trend: '+12% MoM',
      icon: Package,
      color: 'bg-blue-50 text-blue-900 border-blue-200',
    },
    {
      label: 'Tons Recycled',
      value: '125.6 Tons',
      trend: '+24% MoM',
      icon: Scale,
      color: 'bg-amber-50 text-amber-900 border-amber-200',
    },
    {
      label: 'KG CO₂ Saved',
      value: '8,920 KG',
      trend: '+30% MoM',
      icon: Leaf,
      color: 'bg-teal-50 text-teal-900 border-teal-200',
    },
  ];

  // Exact Verification Queue (12) matching Mockup Row 2 Panel 4
  const [verificationQueue, setVerificationQueue] = useState([
    {
      id: 'KYC-001',
      name: 'Ramesh Kumar',
      category: 'Kabadiwala License & Aadhaar',
      location: 'Indiranagar, Bangalore',
      submittedDate: 'Today, 10:15 AM',
      status: 'Pending',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      id: 'KYC-002',
      name: 'Sunita Sharma',
      category: 'Self-Help Waste Group Lead',
      location: 'Whitefield, Bangalore',
      submittedDate: 'Today, 09:30 AM',
      status: 'Pending',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      id: 'KYC-003',
      name: 'GreenTech Solutions Pvt Ltd',
      category: 'Commercial Generator GST',
      location: 'Electronic City, Bangalore',
      submittedDate: 'Yesterday',
      status: 'Pending',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      id: 'KYC-004',
      name: 'EcoPlast Recyclers',
      category: 'CPCB Waste Handling License',
      location: 'Peenya Industrial Area',
      submittedDate: 'Oct 12, 2026',
      status: 'Approved',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
  ]);

  // Bookings Trend (Jan to Jun)
  const monthlyTrends = [
    { month: 'Jan', bookings: 320, tons: 14.2 },
    { month: 'Feb', bookings: 450, tons: 18.5 },
    { month: 'Mar', bookings: 580, tons: 22.1 },
    { month: 'Apr', bookings: 690, tons: 28.4 },
    { month: 'May', bookings: 840, tons: 34.0 },
    { month: 'Jun', bookings: 1050, tons: 42.5 },
  ];

  const handleReviewAction = (item: any) => {
    setSelectedKycForReview(item);
  };

  const handleApproveKyc = (id: string) => {
    setVerificationQueue((prev) =>
      prev.map((k) =>
        k.id === id
          ? {
              ...k,
              status: 'Approved',
              statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            }
          : k
      )
    );
    setSelectedKycForReview(null);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex">
      {/* 1. Left Dark Forest Sidebar - Exact Match to Mockup Row 2 Panel 4 */}
      <aside className="w-64 bg-forest-900 text-white shrink-0 hidden lg:flex flex-col justify-between p-5 border-r border-forest-950">
        <div className="space-y-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-forest-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-white leading-tight">
                ScrapSetu
              </div>
              <div className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">
                Admin Console
              </div>
            </div>
          </Link>

          <nav className="space-y-1.5">
            {[
              { id: 'overview', label: 'Platform Overview', icon: Activity },
              { id: 'verifications', label: 'Verification Queue (12)', icon: UserCheck },
              { id: 'pricing', label: 'Mandi Benchmarks', icon: DollarSign },
              { id: 'transactions', label: 'Transactions & Passports', icon: FileText },
              { id: 'analytics', label: 'National Impact Audit', icon: BarChart3 },
              { id: 'settings', label: 'System Configuration', icon: Settings },
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

        {/* Admin Identity Card */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-400 text-forest-950 font-black flex items-center justify-center text-xs">
            CP
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-extrabold text-white truncate">
              {user?.name || 'CPCB SuperAdmin'}
            </div>
            <div className="text-[10px] text-zinc-400">Governance &amp; Audit Level 4</div>
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
                National Governance &amp; Traceability Oversight
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
              Platform Overview
            </h1>
            <p className="text-xs text-zinc-500 font-medium">
              Real-time monitoring of circular transactions, KYC verifications, and EPR metrics across India.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              className="bg-white border-zinc-300 text-zinc-700 font-bold text-xs px-3 shadow-2xs"
              onClick={() => alert('Exporting platform audit log...')}
            >
              <FileText className="w-4 h-4 mr-1.5" />
              <span>Export Audit Log</span>
            </Button>
          </div>
        </div>

        {activeNav === 'verifications' ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            <PhotoMatchingVerificationWorkspace />
            <KycDossierInspector />
          </div>
        ) : (
          <>
            {/* 4 Platform Overview Metric Cards - Exact Match to Mockup */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {platformStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-5 shadow-lg border border-zinc-200/80 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    {stat.label}
                  </div>
                  <div className="text-2xl font-black text-zinc-950 font-mono mt-0.5">
                    {stat.value}
                  </div>
                  <div className="text-[11px] font-bold text-emerald-700 mt-1">
                    {stat.trend}
                  </div>
                </div>

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Central Visualization Grid: Bookings Trend Chart & Material Distribution Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Bookings Trend Chart (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-xl border border-zinc-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-zinc-950 tracking-tight">
                  Bookings &amp; Tonnage Trend
                </h2>
                <p className="text-xs text-zinc-500">
                  Monthly platform volume progression (Jan - Jun).
                </p>
              </div>
              <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                +240% Growth
              </span>
            </div>

            {/* Custom Bar Visualizer */}
            <div className="pt-6 pb-2">
              <div className="grid grid-cols-6 gap-3 items-end h-48 border-b border-zinc-200 pb-2">
                {monthlyTrends.map((item, idx) => {
                  const heightPct = Math.round((item.bookings / 1100) * 100);
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="text-[10px] font-mono font-bold text-zinc-500 group-hover:text-forest-900 transition-colors">
                        {item.bookings}
                      </div>
                      <div className="w-full bg-zinc-100 rounded-t-xl overflow-hidden flex items-end h-36">
                        <div
                          className="w-full bg-forest-900 group-hover:bg-emerald-600 transition-all rounded-t-xl"
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-zinc-700 mt-1">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
              <span>Average pickup fulfillment time: <strong>42 mins</strong></span>
              <span>Platform SLA: <strong>99.4%</strong></span>
            </div>
          </div>

          {/* Right: Material Distribution Donut Chart (5 cols) - Exact Match to Mockup */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-xl border border-zinc-200/80 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-zinc-950 tracking-tight">
                  Material Distribution
                </h2>
                <span className="text-xs text-zinc-400">125.6 Tons Total</span>
              </div>
              <p className="text-xs text-zinc-500">
                Aggregated scrap material breakdown across all states.
              </p>
            </div>

            {/* Donut Graphic Representation with Center Tonnage */}
            <div className="relative flex items-center justify-center my-2">
              <div className="w-44 h-44 rounded-full border-12 border-emerald-600 border-t-amber-500 border-r-orange-500 border-b-purple-500 flex items-center justify-center bg-zinc-50 shadow-inner">
                <div className="text-center">
                  <div className="text-xl font-black text-zinc-950 font-mono">125.6 T</div>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase">Total Recycled</div>
                </div>
              </div>
            </div>

            {/* Slices / Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600" />
                  <span className="font-bold text-zinc-800">Plastic (PET / HDPE)</span>
                </div>
                <span className="font-mono font-bold text-zinc-600">35% (43.9 T)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="font-bold text-zinc-800">Paper &amp; Cardboard</span>
                </div>
                <span className="font-mono font-bold text-zinc-600">25% (31.4 T)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="font-bold text-zinc-800">Metal (Copper &amp; Al)</span>
                </div>
                <span className="font-mono font-bold text-zinc-600">18% (22.6 T)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="font-bold text-zinc-800">E-Waste &amp; Circuit Boards</span>
                </div>
                <span className="font-mono font-bold text-zinc-600">12% (15.1 T)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-teal-500" />
                  <span className="font-bold text-zinc-800">Glass Bottles</span>
                </div>
                <span className="font-mono font-bold text-zinc-600">10% (12.6 T)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Queue (12) - Exact Match to Mockup */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-zinc-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-zinc-950 tracking-tight">
                  Verification Queue (12 Pending)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Kabadiwala, recycler and enterprise compliance dossiers awaiting officer review.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search dossiers..."
                className="px-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 uppercase text-[10px] font-black border-y border-zinc-200">
                <tr>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Verification Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/80">
                {verificationQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3 px-4 font-extrabold text-zinc-950">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 font-semibold text-zinc-700">
                      {item.category}
                    </td>
                    <td className="py-3 px-4 text-zinc-500 font-medium">
                      {item.location}
                    </td>
                    <td className="py-3 px-4 text-zinc-400 font-mono">
                      {item.submittedDate}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.statusColor}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {item.status === 'Pending' ? (
                        <button
                          onClick={() => handleReviewAction(item)}
                          className="px-3 py-1 rounded-lg bg-forest-900 text-white font-bold text-xs hover:bg-forest-950 transition-colors"
                        >
                          Review KYC
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-bold flex items-center justify-end gap-1 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </>
        )}
      </main>

      {/* Review Modal Dialog */}
      {selectedKycForReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h3 className="text-base font-black text-zinc-950">
                KYC Dossier Review: {selectedKycForReview.name}
              </h3>
              <button
                onClick={() => setSelectedKycForReview(null)}
                className="text-zinc-400 hover:text-zinc-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                <div className="font-bold text-zinc-900">Application Category</div>
                <div className="text-zinc-600">{selectedKycForReview.category}</div>
                <div className="text-zinc-400 font-mono text-[11px]">{selectedKycForReview.location}</div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>UIDAI Aadhaar Masked Verification: Passed (99.4%)</span>
                </div>
                <div className="text-emerald-800 text-[11px]">
                  DL &amp; Commercial Vehicle Registration verified with State Transport database.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedKycForReview(null)}
                className="text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => handleApproveKyc(selectedKycForReview.id)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4"
              >
                Approve &amp; Issue Certificate
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
