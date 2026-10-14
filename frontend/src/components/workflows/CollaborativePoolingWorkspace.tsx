'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Scale,
  Clock,
  MapPin,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
  ChevronDown,
  Layers,
  DollarSign,
  Truck,
  RotateCcw,
  X,
  Award,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { formatINR, formatKg, formatDate } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';
import { ScrapPoolItem, PoolDetailResponse, PoolParticipantPledge, MaterialCategory } from '@/types';
import { useAuthStore } from '@/store/authStore';

interface Props {
  onSelectPool?: (pool: ScrapPoolItem) => void;
}

export const CollaborativePoolingWorkspace: React.FC<Props> = ({ onSelectPool }) => {
  const { user } = useAuthStore();
  const [pools, setPools] = useState<ScrapPoolItem[]>([]);
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);
  const [poolDetail, setPoolDetail] = useState<PoolDetailResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState(false);

  // Create Pool Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategorySlug, setNewCategorySlug] = useState('rigid-plastics');
  const [newTargetWeightKg, setNewTargetWeightKg] = useState(500);
  const [newTargetPrice, setNewTargetPrice] = useState(34);
  const [newDeadlineDays, setNewDeadlineDays] = useState(3);
  const [newHubName, setNewHubName] = useState('Indiranagar Circular Recovery Hub');
  const [newHubAddress, setNewHubAddress] = useState('12th Main Road, Indiranagar, Bangalore');
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // Pledge Form State
  const [pledgeWeightKg, setPledgeWeightKg] = useState<number>(50);
  const [pledgeSubmitting, setPledgeSubmitting] = useState(false);
  const [pledgeSuccess, setPledgeSuccess] = useState<string | null>(null);

  // Categories list
  const categoryOptions = [
    { slug: 'rigid-plastics', name: 'Plastic (PET/HDPE)', baseline: 28, target: 34, icon: '🥤' },
    { slug: 'paper-cardboard', name: 'Paper & Cardboard', baseline: 14, target: 18.5, icon: '📄' },
    { slug: 'ferrous-metals', name: 'Metal & Iron', baseline: 32, target: 38, icon: '🥫' },
    { slug: 'e-waste', name: 'E-Waste & Circuit Boards', baseline: 80, target: 110, icon: '💻' },
  ];

  // Fetch pools
  const fetchPools = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.pooling.list({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        search: searchTerm || undefined,
      });
      if (res.success) {
        setPools(res.pools);
        if (res.pools.length > 0 && !selectedPoolId) {
          setSelectedPoolId(res.pools[0].id);
        }
      }
    } catch (err: any) {
      console.error('Failed to load pools', err);
      // Fallback seed pools if server is offline or empty
      setPools([
        {
          id: 'pool-mock-01',
          poolCode: 'POOL-2026-PLAS-001',
          title: 'Indiranagar PET Plastic Consolidation Drive',
          description: 'Combining clean PET bottles to supply EcoTransform Mill #04 at bulk tier.',
          category: { id: 'c1', name: 'Plastic (PET / HDPE)', hindiName: 'प्लास्टिक', slug: 'rigid-plastics' },
          targetWeightKg: 1000,
          currentPledgedKg: 640,
          remainingKg: 360,
          progressPercentage: 64,
          targetPricePerKg: 34,
          baselinePricePerKg: 28,
          premiumSpreadPerKg: 6,
          estimatedTotalBulkValue: 34000,
          collectionDeadline: new Date(Date.now() + 86400000 * 2).toISOString(),
          status: 'OPEN',
          hubLocationName: 'Indiranagar Recovery Facility #02',
          hubAddress: '12th Main Road, Indiranagar, Bangalore',
          hubLat: 12.9716,
          hubLng: 77.6412,
          distanceKm: 2.1,
          creatorName: 'Ramesh Kumar (Kabadiwala #DL1ER4921)',
          participantsCount: 4,
          disbursementStatus: 'PENDING_SALE',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'pool-mock-02',
          poolCode: 'POOL-2026-PAPR-002',
          title: 'Koramangala Cardboard & Gatta Mega Batch',
          description: 'Commercial and doorstep cardboard aggregation for South India Paper Mills.',
          category: { id: 'c2', name: 'Paper & Cardboard', hindiName: 'कागज़ और गत्ता', slug: 'paper-cardboard' },
          targetWeightKg: 2000,
          currentPledgedKg: 1750,
          remainingKg: 250,
          progressPercentage: 87.5,
          targetPricePerKg: 18.5,
          baselinePricePerKg: 14.0,
          premiumSpreadPerKg: 4.5,
          estimatedTotalBulkValue: 37000,
          collectionDeadline: new Date(Date.now() + 86400000).toISOString(),
          status: 'OPEN',
          hubLocationName: 'Koramangala 4th Block Aggregation Yard',
          hubAddress: '80 Feet Road, Koramangala, Bangalore',
          hubLat: 12.9352,
          hubLng: 77.6245,
          distanceKm: 4.3,
          creatorName: 'Suresh Yadav (Mini Truck DL1GA1182)',
          participantsCount: 6,
          disbursementStatus: 'PENDING_SALE',
          createdAt: new Date().toISOString(),
        },
      ]);
      if (!selectedPoolId) setSelectedPoolId('pool-mock-01');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();
  }, [statusFilter]);

  // Fetch pool details when selected
  useEffect(() => {
    if (!selectedPoolId) return;

    let isMounted = true;
    async function loadDetails() {
      setDetailLoading(true);
      try {
        const res = await apiClient.pooling.getById(selectedPoolId!);
        if (isMounted && res.success) {
          setPoolDetail(res);
        }
      } catch (err) {
        // Fallback mock detail
        const selected = pools.find((p) => p.id === selectedPoolId);
        if (selected && isMounted) {
          setPoolDetail({
            pool: selected,
            participantsBreakdown: [
              {
                pledgeId: 'pl-1',
                collectorId: 'c-1',
                collectorName: 'Ramesh Kumar',
                vehicleType: 'E-Rickshaw Loader',
                pledgedWeightKg: 280,
                sharePercentage: 43.8,
                estGrossPayout: 280 * selected.targetPricePerKg,
                poolingAdvantageInr: 280 * (selected.premiumSpreadPerKg || 5),
                status: 'PLEDGED',
                pledgedAt: 'Today, 09:30 AM',
                lotNumber: 'LOT-2026-PET-8821',
              },
              {
                pledgeId: 'pl-2',
                collectorId: 'c-2',
                collectorName: 'Mohammad Farooq',
                vehicleType: 'Mini Truck',
                pledgedWeightKg: 190,
                sharePercentage: 29.7,
                estGrossPayout: 190 * selected.targetPricePerKg,
                poolingAdvantageInr: 190 * (selected.premiumSpreadPerKg || 5),
                status: 'PLEDGED',
                pledgedAt: 'Today, 11:15 AM',
                lotNumber: 'LOT-2026-PET-8822',
              },
              {
                pledgeId: 'pl-3',
                collectorId: 'c-3',
                collectorName: 'Shyam Sundar',
                vehicleType: 'Tricycle Rickshaw',
                pledgedWeightKg: 170,
                sharePercentage: 26.5,
                estGrossPayout: 170 * selected.targetPricePerKg,
                poolingAdvantageInr: 170 * (selected.premiumSpreadPerKg || 5),
                status: 'PLEDGED',
                pledgedAt: 'Today, 01:00 PM',
                lotNumber: 'LOT-2026-PET-8823',
              },
            ],
            activities: [
              {
                id: 'act-1',
                actorName: 'Ramesh Kumar',
                action: 'CREATED_POOL',
                details: 'Initialized PET consolidation target at 1,000 kg with ₹34/kg bulk pricing.',
                timestamp: 'Yesterday, 04:00 PM',
              },
              {
                id: 'act-2',
                actorName: 'Mohammad Farooq',
                action: 'PLEDGED_LOT',
                details: 'Pledged 190 kg clean PET lot #LOT-2026-PET-8822.',
                timestamp: 'Today, 11:15 AM',
              },
              {
                id: 'act-3',
                actorName: 'Shyam Sundar',
                action: 'PLEDGED_LOT',
                details: 'Pledged 170 kg sorted bottles. Pool reached 64% completion.',
                timestamp: 'Today, 01:00 PM',
              },
            ],
          });
        }
      } finally {
        if (isMounted) setDetailLoading(false);
      }
    }
    loadDetails();
    return () => {
      isMounted = false;
    };
  }, [selectedPoolId, pools]);

  // Handle Create Pool
  const handleCreatePool = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateSubmitting(true);
    try {
      const deadline = new Date(Date.now() + newDeadlineDays * 86400000).toISOString();
      const res = await apiClient.pooling.create({
        title: newTitle,
        description: newDescription,
        categorySlug: newCategorySlug,
        targetWeightKg: newTargetWeightKg,
        targetPricePerKg: newTargetPrice,
        collectionDeadline: deadline,
        hubLocationName: newHubName,
        hubAddress: newHubAddress,
      });

      if (res.success) {
        setIsCreateModalOpen(false);
        fetchPools();
        setSelectedPoolId(res.pool.id);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create pooling group.');
    } finally {
      setCreateSubmitting(false);
    }
  };

  // Handle Pledge
  const handlePledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPoolId || pledgeWeightKg <= 0) return;
    setPledgeSubmitting(true);
    setPledgeSuccess(null);
    try {
      const res = await apiClient.pooling.pledge(selectedPoolId, {
        pledgedWeightKg: pledgeWeightKg,
      });

      if (res.success) {
        setPledgeSuccess(`Successfully pledged ${pledgeWeightKg} kg to this collaborative pool!`);
        setTimeout(() => {
          setIsPledgeModalOpen(false);
          setPledgeSuccess(null);
        }, 1800);
        fetchPools();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to pledge scrap to pool.');
    } finally {
      setPledgeSubmitting(false);
    }
  };

  // Handle Withdraw
  const handleWithdraw = async (pledgeId: string) => {
    if (!confirm('Are you sure you want to withdraw this pledge from the active pool?')) return;
    try {
      const res = await apiClient.pooling.withdraw(pledgeId);
      if (res.success) {
        alert('Pledge successfully withdrawn.');
        fetchPools();
      }
    } catch (err: any) {
      alert(err.message || 'Could not withdraw pledge.');
    }
  };

  const selectedPool = pools.find((p) => p.id === selectedPoolId) || pools[0];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Actions */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-emerald-950 text-white rounded-3xl p-6 shadow-xl border border-emerald-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300">
              Collaborative Micro-Consolidation
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
              Bulk Price Unlock: +15% to +25%
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Collaborative Scrap Pooling</span>
            <Users className="w-6 h-6 text-emerald-400" />
          </h2>
          <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
            Individual kabadiwalas can combine scrap loads to bypass minimum mill requirements,
            unlock bulk tier pricing, and eliminate middleman price cuts.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-black text-xs px-4 h-11 rounded-xl shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Pool</span>
          </Button>
        </div>
      </div>

      {/* 2. Workspace Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-zinc-200/90 shadow-2xs text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'OPEN', 'TARGET_REACHED', 'MATCHED', 'SETTLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === st
                  ? 'bg-forest-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              {st === 'ALL' ? 'All Pools' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by area, material, or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium"
          />
        </div>
      </div>

      {/* 3. Main Workspace Grid: Left Pools List, Right Pool Deep-Dive & Contribution Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pool Cards Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase px-1">
            <span>Nearby Active Pools ({pools.length})</span>
            <span>Sorted by Completion</span>
          </div>

          <div className="space-y-3">
            {pools.map((pool) => {
              const isSelected = pool.id === selectedPoolId;
              const isFull = pool.progressPercentage >= 100;

              return (
                <div
                  key={pool.id}
                  onClick={() => setSelectedPoolId(pool.id)}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all text-left ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-forest-950">
                          {pool.poolCode}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            pool.status === 'OPEN'
                              ? 'bg-emerald-100 text-emerald-800'
                              : pool.status === 'TARGET_REACHED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          {pool.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-zinc-950 leading-tight">
                        {pool.title}
                      </h4>
                      <div className="text-xs text-zinc-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{pool.hubLocationName}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-emerald-800 font-mono">
                        ₹{pool.targetPricePerKg}/kg
                      </div>
                      <div className="text-[10px] text-zinc-400 line-through">
                        ₹{pool.baselinePricePerKg}/kg solo
                      </div>
                    </div>
                  </div>

                  {/* Quantity Progress Bar */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-zinc-600">
                        {pool.currentPledgedKg} / {pool.targetWeightKg} kg
                      </span>
                      <span className="font-mono text-emerald-800 font-black">
                        {pool.progressPercentage}%
                      </span>
                    </div>

                    <div className="w-full bg-zinc-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFull ? 'bg-blue-600' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, pool.progressPercentage)}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                    <div className="flex items-center gap-1 font-semibold">
                      <Users className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{pool.participantsCount} Contributors</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-800 font-bold">
                      <Clock className="w-3 h-3" />
                      <span>Closes {formatDate(pool.collectionDeadline)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Pool Deep-Dive & Participant Allocation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedPool ? (
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-zinc-200 space-y-6">
              {/* Pool Header & KPI Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                      {selectedPool.poolCode}
                    </span>
                    <span className="text-xs text-zinc-400 font-semibold">
                      Created by {selectedPool.creatorName}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-zinc-950 tracking-tight mt-1">
                    {selectedPool.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {selectedPool.description || 'Collaborative bulk consignment pooled at verified city aggregation hub.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setIsPledgeModalOpen(true)}
                    disabled={selectedPool.status !== 'OPEN'}
                    className="bg-forest-900 hover:bg-forest-950 text-white font-black text-xs px-4 h-10 rounded-xl shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    <span>Pledge My Scrap</span>
                  </Button>
                </div>
              </div>

              {/* 3 Metric Cards: Target Value, Premium Spread, Remaining */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-zinc-50 rounded-2xl p-3.5 border border-zinc-200/90 text-center">
                  <div className="text-[10px] uppercase font-bold text-zinc-400">Target Bulk Value</div>
                  <div className="text-lg font-black text-zinc-950 font-mono mt-0.5">
                    {formatINR(selectedPool.estimatedTotalBulkValue)}
                  </div>
                  <div className="text-[9px] text-zinc-500 font-semibold">
                    At ₹{selectedPool.targetPricePerKg}/kg negotiated
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200 text-center">
                  <div className="text-[10px] uppercase font-bold text-emerald-800">Pooling Advantage</div>
                  <div className="text-lg font-black text-forest-900 font-mono mt-0.5">
                    +₹{selectedPool.premiumSpreadPerKg || 6}/kg
                  </div>
                  <div className="text-[9px] text-emerald-700 font-bold">Above Solo Mandi Rate</div>
                </div>

                <div className="bg-zinc-50 rounded-2xl p-3.5 border border-zinc-200/90 text-center">
                  <div className="text-[10px] uppercase font-bold text-zinc-400">Needed to Complete</div>
                  <div className="text-lg font-black text-amber-700 font-mono mt-0.5">
                    {selectedPool.remainingKg} kg
                  </div>
                  <div className="text-[9px] text-zinc-500 font-semibold">
                    {selectedPool.progressPercentage}% pledged
                  </div>
                </div>
              </div>

              {/* Drop-off Hub Location Information */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-forest-900 text-emerald-400 flex items-center justify-center font-bold">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-zinc-900">{selectedPool.hubLocationName}</div>
                    <div className="text-[11px] text-zinc-500">{selectedPool.hubAddress}</div>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-emerald-700 font-bold bg-white px-2.5 py-1 rounded-lg border border-zinc-200">
                  Calibrated 5T Weighbridge
                </span>
              </div>

              {/* Participant Contribution Breakdown Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-zinc-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-forest-900" />
                    <span>Participant Contribution Ledger &amp; Payout Allocation</span>
                  </h4>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    Zero-Conflict Pro-Rata Math
                  </span>
                </div>

                <div className="overflow-x-auto border border-zinc-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 text-zinc-500 uppercase text-[10px] font-black border-b border-zinc-200">
                      <tr>
                        <th className="py-2.5 px-3">Collector</th>
                        <th className="py-2.5 px-3">Vehicle</th>
                        <th className="py-2.5 px-3">Pledged (kg)</th>
                        <th className="py-2.5 px-3">Pool Share</th>
                        <th className="py-2.5 px-3">Bulk Payout</th>
                        <th className="py-2.5 px-3">Bonus Earned</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {poolDetail?.participantsBreakdown && poolDetail.participantsBreakdown.length > 0 ? (
                        poolDetail.participantsBreakdown.map((part) => (
                          <tr key={part.pledgeId} className="hover:bg-zinc-50/80 transition-colors">
                            <td className="py-2.5 px-3 font-extrabold text-zinc-950">
                              {part.collectorName}
                              {part.lotNumber && (
                                <div className="text-[9px] font-mono text-zinc-400">
                                  {part.lotNumber}
                                </div>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-zinc-600 font-medium">
                              {part.vehicleType}
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-zinc-900">
                              {part.pledgedWeightKg} kg
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                              {part.sharePercentage}%
                            </td>
                            <td className="py-2.5 px-3 font-mono font-black text-forest-900">
                              {formatINR(part.estGrossPayout)}
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                              +{formatINR(part.poolingAdvantageInr)}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              {selectedPool.status === 'OPEN' ? (
                                <button
                                  onClick={() => handleWithdraw(part.pledgeId)}
                                  className="text-[10px] text-red-600 hover:text-red-800 font-bold hover:underline"
                                >
                                  Withdraw
                                </button>
                              ) : (
                                <span className="text-[10px] font-bold text-zinc-400">Locked</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center py-6 text-zinc-400 font-semibold">
                            No pledges yet. Be the first collector to contribute to this pool!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pool Activity Timeline */}
              <div className="space-y-2.5 pt-2 border-t border-zinc-100">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                  <span>Transparent Group Activity History</span>
                  <span className="text-[10px] text-zinc-400 font-mono">Append-Only Audit</span>
                </div>

                <div className="space-y-2">
                  {poolDetail?.activities && poolDetail.activities.length > 0 ? (
                    poolDetail.activities.map((act) => (
                      <div
                        key={act.id}
                        className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-start justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="font-extrabold text-zinc-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{act.actorName}</span>
                            <span className="text-[10px] font-mono text-zinc-400">({act.action})</span>
                          </div>
                          <div className="text-[11px] text-zinc-600">{act.details}</div>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono shrink-0">
                          {act.timestamp}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-zinc-400">No activity recorded yet.</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-zinc-400 border border-zinc-200">
              Select a pool from the left to view target quantities, contributor shares, and bulk buyer match.
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Create New Scrap Pool */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-zinc-200 animate-in fade-in-0 zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-base font-black text-zinc-950">
                  Launch Collaborative Scrap Pool
                </h3>
                <p className="text-xs text-zinc-500">
                  Consolidate with peer collectors to meet bulk recycler quotas.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePool} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Pool Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Indiranagar PET Bottles Mega Lot 1,000kg"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Target Material Stream</label>
                <div className="grid grid-cols-2 gap-2">
                  {categoryOptions.map((opt) => (
                    <div
                      key={opt.slug}
                      onClick={() => {
                        setNewCategorySlug(opt.slug);
                        setNewTargetPrice(opt.target);
                      }}
                      className={`cursor-pointer p-2.5 rounded-xl border text-left transition-all ${
                        newCategorySlug === opt.slug
                          ? 'bg-emerald-50 border-emerald-500 font-bold text-forest-950 ring-1 ring-emerald-500'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                      }`}
                    >
                      <div className="text-base">{opt.icon}</div>
                      <div className="text-xs font-bold">{opt.name}</div>
                      <div className="text-[10px] text-zinc-400">Target: ₹{opt.target}/kg</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Target Weight (kg)</label>
                  <input
                    type="number"
                    required
                    min={100}
                    step={50}
                    value={newTargetWeightKg}
                    onChange={(e) => setNewTargetWeightKg(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Bulk Price (₹/kg)</label>
                  <input
                    type="number"
                    required
                    step={0.5}
                    value={newTargetPrice}
                    onChange={(e) => setNewTargetPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl font-mono font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Collection Deadline</label>
                <select
                  value={newDeadlineDays}
                  onChange={(e) => setNewDeadlineDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl font-bold"
                >
                  <option value={1}>24 Hours (Urgent Bulk Dispatch)</option>
                  <option value={3}>3 Days (Standard Consolidation)</option>
                  <option value={7}>7 Days (Weekly Regional Lot)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Consolidation Hub / Yard</label>
                <input
                  type="text"
                  required
                  value={newHubName}
                  onChange={(e) => setNewHubName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createSubmitting}
                  size="sm"
                  className="bg-forest-900 text-white font-bold px-4"
                >
                  {createSubmitting ? 'Creating...' : 'Launch Pool Group'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Pledge Scrap to Selected Pool */}
      {isPledgeModalOpen && selectedPool && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-zinc-200 animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-base font-black text-zinc-950">
                  Pledge Scrap to Pool
                </h3>
                <p className="text-xs text-zinc-500 font-mono">
                  {selectedPool.poolCode} • {selectedPool.category.name}
                </p>
              </div>
              <button
                onClick={() => setIsPledgeModalOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {pledgeSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="text-xs font-bold text-emerald-950">{pledgeSuccess}</div>
              </div>
            ) : (
              <form onSubmit={handlePledge} className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-zinc-700">Quantity to Pledge (kg)</label>
                    <span className="font-mono text-emerald-700 font-bold">
                      {pledgeWeightKg} kg
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={Math.min(500, selectedPool.remainingKg || 500)}
                    step={5}
                    value={pledgeWeightKg}
                    onChange={(e) => setPledgeWeightKg(Number(e.target.value))}
                    className="w-full accent-forest-900 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 mt-0.5">
                    <span>10 kg</span>
                    <span>Max {selectedPool.remainingKg} kg needed</span>
                  </div>
                </div>

                {/* Live Payout & Share Calculation */}
                <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-2">
                  <div className="flex justify-between text-zinc-600">
                    <span>Bulk Negotiated Rate:</span>
                    <span className="font-mono font-bold text-zinc-900">₹{selectedPool.targetPricePerKg}/kg</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Your Estimated Payout:</span>
                    <span className="font-mono font-black text-forest-900 text-sm">
                      {formatINR(pledgeWeightKg * selectedPool.targetPricePerKg)}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold pt-1 border-t border-zinc-200/80">
                    <span>Extra Bulk Bonus:</span>
                    <span className="font-mono">
                      +{formatINR(pledgeWeightKg * (selectedPool.premiumSpreadPerKg || 6))}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <b>Fairness Guarantee:</b> Your pledge reserves your pro-rata share. You may withdraw anytime before the pool reaches 100% target.
                  </span>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPledgeModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={pledgeSubmitting}
                    size="sm"
                    className="bg-forest-900 text-white font-bold px-4"
                  >
                    {pledgeSubmitting ? 'Confirming...' : 'Lock My Pledge'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
