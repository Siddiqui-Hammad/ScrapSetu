'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { formatINR, formatKg, formatDate } from '../../../lib/utils';
import { useAuthStore } from '../../../store/authStore';

export default function AdminPortalPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'kyc' | 'rates' | 'anomalies' | 'db' | 'audit'>('kyc');

  // KYC Dossiers Queue
  const [kycQueue, setKycQueue] = useState([
    {
      id: 'KYC-COL-003',
      name: 'Shyam Sundar',
      role: 'COLLECTOR',
      phone: '+91 98765 88008',
      vehicle: 'Tricycle Rickshaw DL 1 TR 7721',
      aadhaarNo: '4129-6638-6621',
      aadhaarStatus: 'Uploaded (Masked UIDAI Document)',
      dlNo: 'DL-04-2022-00455',
      dlStatus: 'Uploaded (State Transport Authority)',
      selfieStatus: 'Live Camera Selfie Captured',
      biometricScore: 98.4,
      status: 'PENDING_REVIEW', // PENDING_REVIEW, APPROVED, REJECTED
      appliedAt: 'Today, 11:30 AM',
    },
    {
      id: 'KYC-COL-001',
      name: 'Ramu Paswan',
      role: 'COLLECTOR',
      phone: '+91 98765 11001',
      vehicle: 'E-Rickshaw Loader DL 1 ER 4921',
      aadhaarNo: '5482-9182-4912',
      aadhaarStatus: 'Verified UIDAI Masked ✓',
      dlNo: 'DL-04-2019-00291',
      dlStatus: 'Verified Commercial Transport ✓',
      selfieStatus: 'Live Biometric Match 99.2% ✓',
      biometricScore: 99.2,
      status: 'APPROVED',
      appliedAt: 'Oct 10, 2026',
    },
    {
      id: 'KYC-COL-002',
      name: 'Mohammad Farooq',
      role: 'COLLECTOR',
      phone: '+91 98765 22002',
      vehicle: 'Mini Truck DL 1 GA 1182',
      aadhaarNo: '7821-3391-9182',
      aadhaarStatus: 'Verified UIDAI Masked ✓',
      dlNo: 'DL-04-2016-00812',
      dlStatus: 'Verified Heavy Commercial ✓',
      selfieStatus: 'Live Biometric Match 98.9% ✓',
      biometricScore: 98.9,
      status: 'APPROVED',
      appliedAt: 'Oct 09, 2026',
    },
  ]);

  const [selectedKycId, setSelectedKycId] = useState('KYC-COL-003');
  const selectedDossier = kycQueue.find((k) => k.id === selectedKycId) || kycQueue[0];

  // Mandi Benchmark Rates State
  const [mandiRates, setMandiRates] = useState([
    { id: 'mr-1', category: 'Copper Wire (Millberry 99.9%)', currentRate: 685.0, changePercent: 2.4, low: 670, high: 700 },
    { id: 'mr-2', category: 'Brass / Pital Heavy Utensils', currentRate: 460.0, changePercent: 1.1, low: 450, high: 475 },
    { id: 'mr-3', category: 'Aluminium Section 6063', currentRate: 165.0, changePercent: -0.8, low: 160, high: 172 },
    { id: 'mr-4', category: 'Rigid Plastics (PET Optical Clean)', currentRate: 28.0, changePercent: 3.2, low: 25, high: 30 },
    { id: 'mr-5', category: 'Kraft Corrugated Carton (Gatta)', currentRate: 15.5, changePercent: 1.3, low: 14, high: 17 },
    { id: 'mr-6', category: 'Heavy Structural Iron (HMS 1/2)', currentRate: 34.0, changePercent: 0.5, low: 32, high: 36 },
  ]);

  // Free Cloud Database Bus State
  const [dbProvider, setDbProvider] = useState('Supabase PostgreSQL (Free 500MB Tier)');
  const [dbUri, setDbUri] = useState('postgresql://postgres.scrapsetu:demo_pass_2026@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require');
  const [dbSyncCount, setDbSyncCount] = useState(64);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleApproveKyc = (id: string) => {
    setKycQueue((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: 'APPROVED' } : k))
    );
  };

  const handleRejectKyc = (id: string) => {
    setKycQueue((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: 'REJECTED' } : k))
    );
  };

  const handleRateChange = (id: string, newRate: number) => {
    setMandiRates((prev) =>
      prev.map((r) => (r.id === id ? { ...r, currentRate: newRate } : r))
    );
  };

  const handleSyncCloudDb = () => {
    setDbSyncCount((prev) => prev + 12);
    setSyncFeedback('Successfully synchronized 12 records with cloud database cluster!');
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header: Calm Operational Control Center */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-zinc-900 text-white shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Regulatory Control Console
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mt-1">
            National Circular Operations Hub
          </h1>
          <p className="text-xs text-zinc-300 mt-0.5">
            CPCB Authority Governance • 3-Point KYC Queue • Live Benchmark Spreads
          </p>
        </div>

        {/* Compact Operational KPIs */}
        <div className="flex items-center gap-6 shrink-0 bg-zinc-800/80 p-3 rounded-xl border border-zinc-700 text-xs">
          <div>
            <div className="text-[10px] uppercase font-bold text-zinc-400">Pending KYC</div>
            <div className="font-mono font-bold text-amber-400">
              {kycQueue.filter((k) => k.status === 'PENDING_REVIEW').length} Dossiers
            </div>
          </div>
          <div className="border-l border-zinc-700 pl-4">
            <div className="text-[10px] uppercase font-bold text-zinc-400">Database Bus</div>
            <div className="font-mono font-bold text-emerald-400">ONLINE (34ms)</div>
          </div>
          <div className="border-l border-zinc-700 pl-4">
            <div className="text-[10px] uppercase font-bold text-zinc-400">Disputes</div>
            <div className="font-mono font-bold text-white">0 Active</div>
          </div>
        </div>
      </div>

      {/* 2. Operational Navigation Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-zinc-200/80 rounded-2xl text-xs font-bold w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab('kyc')}
          className={`py-2 px-3.5 rounded-xl transition-all ${
            activeTab === 'kyc' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-600 hover:text-zinc-950'
          }`}
        >
          3-Point KYC Queue
        </button>
        <button
          onClick={() => setActiveTab('rates')}
          className={`py-2 px-3.5 rounded-xl transition-all ${
            activeTab === 'rates' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-600 hover:text-zinc-950'
          }`}
        >
          Mandi Rate Authority
        </button>
        <button
          onClick={() => setActiveTab('anomalies')}
          className={`py-2 px-3.5 rounded-xl transition-all ${
            activeTab === 'anomalies' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-600 hover:text-zinc-950'
          }`}
        >
          EcoShield Anomaly Audit
        </button>
        <button
          onClick={() => setActiveTab('db')}
          className={`py-2 px-3.5 rounded-xl transition-all ${
            activeTab === 'db' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-600 hover:text-zinc-950'
          }`}
        >
          Free Cloud DB Bus
        </button>
      </div>

      {/* 3. TAB 1: 3-POINT KYC DOSSIER QUEUE & SPLIT INSPECTION VIEW */}
      {activeTab === 'kyc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Queue List */}
          <div className="lg:col-span-5 circular-card p-5 bg-white space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-sm font-bold text-zinc-950">Applicant Queue</h3>
              <span className="text-[11px] text-zinc-500 font-mono">
                {kycQueue.length} Total Partners
              </span>
            </div>

            <div className="space-y-2.5">
              {kycQueue.map((applicant) => {
                const isSelected = applicant.id === selectedKycId;
                const isPending = applicant.status === 'PENDING_REVIEW';
                return (
                  <button
                    key={applicant.id}
                    onClick={() => setSelectedKycId(applicant.id)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 ring-1 ring-emerald-500 shadow-2xs'
                        : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-xs text-zinc-950">{applicant.name}</div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">{applicant.vehicle}</div>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${
                          isPending
                            ? 'bg-amber-100 text-amber-900'
                            : applicant.status === 'APPROVED'
                            ? 'bg-emerald-100 text-forest-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}
                      >
                        {applicant.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-2 pt-2 border-t border-zinc-100">
                      <span>Face Match: {applicant.biometricScore}%</span>
                      <span>{applicant.appliedAt}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: 3-Card Inspection Dossier */}
          <div className="lg:col-span-7 circular-card p-6 bg-white space-y-6">
            <div className="flex items-start justify-between border-b border-zinc-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Dossier Inspector
                </span>
                <h2 className="text-lg font-black text-zinc-950 mt-0.5">
                  {selectedDossier.name} ({selectedDossier.id})
                </h2>
                <p className="text-xs text-zinc-500">
                  Phone: {selectedDossier.phone} • Vehicle: {selectedDossier.vehicle}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {selectedDossier.status === 'PENDING_REVIEW' ? (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApproveKyc(selectedDossier.id)}
                      className="font-bold text-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Approve 3-Point KYC
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRejectKyc(selectedDossier.id)}
                      className="text-xs text-rose-600 hover:text-rose-700"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" />
                      Reject
                    </Button>
                  </>
                ) : (
                  <span className="text-xs font-bold bg-emerald-100 text-forest-900 px-3 py-1 rounded-full">
                    {selectedDossier.status} ✓
                  </span>
                )}
              </div>
            </div>

            {/* 3-Point Document Inspection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Document 1: Aadhaar */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  1. Aadhaar Card
                </span>
                <div className="font-mono font-bold text-zinc-950">{selectedDossier.aadhaarNo}</div>
                <div className="text-[11px] text-emerald-700 font-semibold">
                  {selectedDossier.aadhaarStatus}
                </div>
                <div className="text-[10px] text-zinc-400">UIDAI API Gateway Verified</div>
              </div>

              {/* Document 2: Driving Licence */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  2. Driving Licence
                </span>
                <div className="font-mono font-bold text-zinc-950">{selectedDossier.dlNo}</div>
                <div className="text-[11px] text-emerald-700 font-semibold">
                  {selectedDossier.dlStatus}
                </div>
                <div className="text-[10px] text-zinc-400">Parivahan Transport Badge</div>
              </div>

              {/* Document 3: Live Selfie Face Match */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  3. Live Camera Selfie
                </span>
                <div className="font-bold text-zinc-950">
                  Match: {selectedDossier.biometricScore}%
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold">
                  {selectedDossier.selfieStatus}
                </div>
                <div className="text-[10px] text-zinc-400">Anti-Spoofing Passed</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: MANDI RATE AUTHORITY */}
      {activeTab === 'rates' && (
        <div className="circular-card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-zinc-950">Mandi Benchmark Rate Governance</h2>
              <p className="text-xs text-zinc-500">
                Official wholesale benchmark prices broadcast daily across Indian recycling clusters
              </p>
            </div>
            <Button size="sm" variant="primary" className="font-bold text-xs">
              Broadcast Updated Rates
            </Button>
          </div>

          <table className="ops-table">
            <thead>
              <tr>
                <th>Category Specification</th>
                <th>Current Benchmark (₹/kg)</th>
                <th>24h Trend %</th>
                <th>Wholesale Spread Range</th>
                <th>Inline Rate Edit</th>
              </tr>
            </thead>
            <tbody>
              {mandiRates.map((mr) => (
                <tr key={mr.id}>
                  <td className="font-bold text-zinc-950">{mr.category}</td>
                  <td>
                    <span className="font-mono font-black text-forest-900 text-sm">
                      ₹{mr.currentRate.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`text-[11px] font-bold ${
                        mr.changePercent >= 0 ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {mr.changePercent >= 0 ? '+' : ''}
                      {mr.changePercent}%
                    </span>
                  </td>
                  <td className="font-mono text-zinc-500">
                    ₹{mr.low} - ₹{mr.high}
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.5"
                      value={mr.currentRate}
                      onChange={(e) => handleRateChange(mr.id, Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-zinc-50 border border-zinc-300 rounded-lg font-mono text-xs font-bold text-zinc-900"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. TAB 3: ECOSHIELD ANOMALY QUEUE */}
      {activeTab === 'anomalies' && (
        <div className="circular-card p-6 bg-white space-y-4">
          <div className="border-b border-zinc-100 pb-3">
            <h2 className="text-base font-bold text-zinc-950">EcoShield Anomaly & Anti-Fraud Queue</h2>
            <p className="text-xs text-zinc-500">Automated transaction monitoring flagging suspicious volume spikes</p>
          </div>

          <table className="ops-table">
            <thead>
              <tr>
                <th>Anomaly Reference</th>
                <th>Entity / Account</th>
                <th>Triggered Rule</th>
                <th>Severity</th>
                <th>Resolution Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-mono font-bold text-zinc-950">ANM-2026-081</td>
                <td>Domestic Account #482</td>
                <td>Weight spike: 320 kg for domestic apartment</td>
                <td>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    MEDIUM
                  </span>
                </td>
                <td className="text-emerald-700 font-bold text-[11px]">RESOLVED (Renovation scrap)</td>
              </tr>
              <tr>
                <td className="font-mono font-bold text-zinc-950">ANM-2026-082</td>
                <td>Collector Ramu Paswan</td>
                <td>Copper price spread +14% above Mandi</td>
                <td>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">
                    LOW
                  </span>
                </td>
                <td className="text-emerald-700 font-bold text-[11px]">CLEARED (Grade 1 Millberry)</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* 6. TAB 4: FREE CLOUD DATABASE BUS */}
      {activeTab === 'db' && (
        <div className="circular-card p-6 bg-white space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-zinc-950">Free Cloud Database Connectivity Bus</h2>
              <p className="text-xs text-zinc-500">
                Persistent storage across deployments with Supabase, MongoDB Atlas, or Neon
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {dbSyncCount} Records Synced ✓
            </span>
          </div>

          {syncFeedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-forest-900 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{syncFeedback}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Active Cloud Provider</label>
              <select
                value={dbProvider}
                onChange={(e) => setDbProvider(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-xl bg-white font-semibold"
              >
                <option>Supabase PostgreSQL (Free 500MB Tier)</option>
                <option>MongoDB Atlas (Free M0 512MB Sandbox)</option>
                <option>Neon Serverless Postgres (Free 500MB)</option>
                <option>Local SQLite Database (Embedded dev.db)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Connection URI String</label>
              <input
                type="text"
                value={dbUri}
                onChange={(e) => setDbUri(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-xl bg-white font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" onClick={handleSyncCloudDb} className="font-bold text-xs">
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Force Immediate Cloud Sync
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
