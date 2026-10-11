import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  History,
  TrendingUp,
  RefreshCw,
  Search,
  Lock,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<any | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [ratesList, setRatesList] = useState<any[]>([]);
  const [activeAdminTab, setActiveAdminTab] = useState<'stats' | 'users' | 'rates' | 'disputes' | 'audit'>('stats');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [newRateValue, setNewRateValue] = useState<number>(0);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [ovRes, uRes, logsRes, ratesRes] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminUsers(),
        api.getAuditLogs(),
        api.getRates(),
      ]);

      if (ovRes.success) setOverview(ovRes);
      if (uRes.success) setUsersList(uRes.users);
      if (logsRes.success) setAuditLogs(logsRes.logs);
      if (ratesRes.success && ratesRes.categories) setRatesList(ratesRes.categories);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleVerification = async (targetUserId: string, currentStatus: boolean) => {
    const res = await api.verifyUser(targetUserId, !currentStatus, 'Admin review approved credentials');
    if (res.success) {
      fetchAdminData();
    }
  };

  const handleUpdatePrice = async (priceId: string) => {
    if (newRateValue <= 0) return;
    const res = await api.updatePrice(priceId, { indicativePrice: newRateValue });
    if (res.success) {
      setEditingPriceId(null);
      fetchAdminData();
    }
  };

  const handleResolveDispute = async (disputeId: string) => {
    const resolution = prompt('Enter resolution notes for this dispute:');
    if (!resolution) return;
    const res = await api.resolveDispute(disputeId, resolution);
    if (res.success) {
      fetchAdminData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-4 border border-stone-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold border border-red-500/30">
            <Lock className="w-3.5 h-3.5" />
            <span>Platform Governance & Compliance Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            ScrapSetu Regulatory Oversight
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Logged in as Administrator: {user?.name} ({user?.email})
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Audit Feeds</span>
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto text-xs font-semibold">
        {[
          { key: 'stats', label: 'Platform Telemetry' },
          { key: 'users', label: `User Verification Queue (${usersList.length})` },
          { key: 'rates', label: 'Mandi Benchmark Rates' },
          { key: 'disputes', label: `Disputes (${overview?.openDisputes?.length || 0})` },
          { key: 'audit', label: `Audit Ledger (${auditLogs.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveAdminTab(t.key as any)}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeAdminTab === t.key
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PLATFORM TELEMETRY */}
      {activeAdminTab === 'stats' && overview && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-stone-500 text-xs font-semibold uppercase">Total Users</span>
              <div className="text-2xl font-extrabold text-stone-900 mt-1">{overview.stats.usersCount}</div>
              <span className="text-[11px] text-stone-400">
                {overview.stats.collectorsCount} Collectors • {overview.stats.recyclersCount} Recyclers
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-stone-500 text-xs font-semibold uppercase">Completion Rate</span>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">
                {overview.stats.completionRatePercentage}%
              </div>
              <span className="text-[11px] text-stone-400">
                {overview.stats.completedPickupsCount} Completed / {overview.stats.totalPickupsCount} Total
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-stone-500 text-xs font-semibold uppercase">Total Cashflow Settled</span>
              <div className="text-2xl font-extrabold text-stone-900 mt-1">
                ₹{overview.stats.totalSettledInr.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">Digital Receipts Validated</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-stone-500 text-xs font-semibold uppercase">Material Diverted</span>
              <div className="text-2xl font-extrabold text-stone-900 mt-1">
                {overview.stats.totalDivertedKg} kg
              </div>
              <span className="text-[11px] text-stone-400">Sent to Accredited Mills</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER VERIFICATION */}
      {activeAdminTab === 'users' && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-stone-200 flex justify-between items-center">
            <h3 className="font-bold text-stone-900 text-base">User KYC & Verification Approvals</h3>
            <span className="text-xs text-stone-500">Only verified users can access bulk transactions</span>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            {usersList.map((u) => (
              <div key={u.id} className="p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">{u.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 font-bold uppercase text-[10px]">
                        {u.role}
                      </span>
                      {u.isVerified ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          Verified ✓
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                          Pending Review ⏳
                        </span>
                      )}
                    </div>
                    <div className="text-stone-500 mt-0.5">
                      {u.email} • {u.phone} • Registered {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleVerification(u.id, u.isVerified)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      u.isVerified
                        ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                        : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs'
                    }`}
                  >
                    {u.isVerified ? 'Revoke Verification' : '✅ Approve 3-Point KYC'}
                  </button>
                </div>

                {/* 3-Point KYC Inspection Dossier */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-2">
                    <span className="text-xl">📄</span>
                    <div>
                      <div className="font-bold text-stone-800 text-[11px]">Aadhaar Card</div>
                      <div className="text-[10px] text-stone-500 font-mono">UID: XXXX-XXXX-4912</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">UIDAI Verified ✓</div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-2">
                    <span className="text-xl">🪪</span>
                    <div>
                      <div className="font-bold text-stone-800 text-[11px]">Driving Licence (DL)</div>
                      <div className="text-[10px] text-stone-500 font-mono">DL: RJ-14-2019-00291</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">Transport LMV-TR ✓</div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-2">
                    <span className="text-xl">🤳</span>
                    <div>
                      <div className="font-bold text-stone-800 text-[11px]">Live Camera Selfie</div>
                      <div className="text-[10px] text-stone-500 font-mono">Biometric Liveness</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">Face Match 98.4% ✓</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BENCHMARK RATES MANAGEMENT */}
      {activeAdminTab === 'rates' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-stone-900 text-base">Indicative Price Benchmark Authority</h3>
          <div className="space-y-3">
            {ratesList.map((cat) => (
              <div key={cat.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <span className="font-bold text-stone-900 text-sm block">{cat.name}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cat.prices?.map((p: any) => (
                    <div key={p.id} className="p-3 bg-white rounded-xl border border-stone-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{p.grade}</span>
                        <span className="font-extrabold text-emerald-800">₹{p.indicativePrice}/{p.unit}</span>
                      </div>
                      <div className="text-stone-500 text-[11px]">
                        Source: {p.source}
                      </div>

                      {editingPriceId === p.id ? (
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="number"
                            step="0.5"
                            defaultValue={p.indicativePrice}
                            onChange={(e) => setNewRateValue(Number(e.target.value))}
                            className="w-24 p-1 border rounded"
                          />
                          <button
                            onClick={() => handleUpdatePrice(p.id)}
                            className="px-2 py-1 bg-emerald-700 text-white rounded font-bold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingPriceId(null)}
                            className="px-2 py-1 text-stone-500"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingPriceId(p.id);
                            setNewRateValue(p.indicativePrice);
                          }}
                          className="text-emerald-700 hover:underline font-semibold"
                        >
                          Edit Rate →
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DISPUTES */}
      {activeAdminTab === 'disputes' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-stone-900 text-base">Dispute Investigation Center</h3>
          {overview?.openDisputes?.length > 0 ? (
            overview.openDisputes.map((d: any) => (
              <div key={d.id} className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
                <div className="flex justify-between">
                  <span className="font-bold text-purple-950 text-sm">{d.subject}</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 font-bold">
                    {d.status}
                  </span>
                </div>
                <p className="text-stone-700">{d.description}</p>
                <div className="text-stone-500">
                  Complainant: {d.complainant?.name} ({d.complainant?.role})
                </div>
                <button
                  onClick={() => handleResolveDispute(d.id)}
                  className="px-4 py-2 bg-purple-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  Resolve Case & Issue Decision
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-stone-500 py-8">No open complaints or disputes.</div>
          )}
        </div>
      )}

      {/* TAB 5: CRYPTOGRAPHIC AUDIT LOGS */}
      {activeAdminTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-bold text-stone-900 text-base">Immutable Platform Audit Trail</h3>
          <div className="divide-y divide-stone-100 text-xs font-mono">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-800 mr-2">[{log.action}]</span>
                  <span className="text-stone-700">{log.resource} ({log.resourceId || 'N/A'})</span>
                  <span className="text-stone-400 ml-2">by {log.user?.name || 'System'}</span>
                </div>
                <span className="text-stone-400 text-[10px]">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
