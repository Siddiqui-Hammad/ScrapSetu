import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { MaterialCategory, RecyclerOffer } from '../types';
import {
  Factory,
  Plus,
  Scale,
  FileText,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  PackageCheck,
} from 'lucide-react';

export const RecyclerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [metrics, setMetrics] = useState<any | null>(null);
  const [activeOffers, setActiveOffers] = useState<RecyclerOffer[]>([]);
  const [recentIntakes, setRecentIntakes] = useState<any[]>([]);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState<boolean>(false);
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState<boolean>(false);

  // New Offer Form state
  const [offerCatId, setOfferCatId] = useState<string>('');
  const [offerFacilityName, setOfferFacilityName] = useState<string>('Aravalli Processing Plant 1');
  const [offerFacilityAddress, setOfferFacilityAddress] = useState<string>('Plot E-42, RIICO Mansarovar');
  const [offerPrice, setOfferPrice] = useState<number>(12.5);
  const [offerMinQty, setOfferMinQty] = useState<number>(50);
  const [offerGrade, setOfferGrade] = useState<string>('Baled clean scrap');

  // Intake Slip Form state
  const [intakeSupplier, setIntakeSupplier] = useState<string>('Mohammad Farooq (Verified Collector)');
  const [intakeGrade, setIntakeGrade] = useState<string>('Sorted Industrial Paper Flute A');
  const [intakeWeight, setIntakeWeight] = useState<number>(120);
  const [intakeRate, setIntakeRate] = useState<number>(11.5);

  const fetchRecyclerData = async () => {
    const [ratesRes, dashRes] = await Promise.all([
      api.getRates(),
      api.getRecyclerDashboard(),
    ]);

    if (ratesRes.success && ratesRes.categories) {
      setCategories(ratesRes.categories);
      if (ratesRes.categories[0]) setOfferCatId(ratesRes.categories[0].id);
    }

    if (dashRes.success) {
      setMetrics(dashRes.metrics);
      setActiveOffers(dashRes.activeOffers || []);
      setRecentIntakes(dashRes.recentIntakes || []);
    }
  };

  useEffect(() => {
    fetchRecyclerData();
  }, []);

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.createRecyclerOffer({
      categoryId: offerCatId,
      facilityName: offerFacilityName,
      facilityAddress: offerFacilityAddress,
      buyingPricePerKg: offerPrice,
      minQuantityKg: offerMinQty,
      gradeAccepted: offerGrade,
    });
    if (res.success) {
      setIsOfferModalOpen(false);
      fetchRecyclerData();
    }
  };

  const handleCreateIntake = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.createIntakeSlip({
      supplierName: intakeSupplier,
      materialGrade: intakeGrade,
      netWeightKg: intakeWeight,
      purchaseRatePerKg: intakeRate,
    });
    if (res.success) {
      setIsIntakeModalOpen(false);
      fetchRecyclerData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Recycler Header */}
      <div className="bg-gradient-to-r from-emerald-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Factory className="w-3.5 h-3.5" />
            <span>Authorized Recycler & Smelter Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            {user?.name || 'Aravalli Ecocycle Mills'}
          </h1>
          <p className="text-xs text-stone-300 mt-1">
            CPCB Registration: RJ/PWM/2026/0491 • RIICO Industrial Area, Mansarovar
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOfferModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-emerald-950 bg-emerald-300 hover:bg-emerald-200 shadow-sm transition-colors"
          >
            + Post Buying Rate
          </button>
          <button
            onClick={() => setIsIntakeModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 shadow-sm transition-colors"
          >
            + Record Intake Slip
          </button>
        </div>
      </div>

      {/* Recycler KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-stone-500 text-xs font-semibold uppercase">Total Inbound Material</span>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">{metrics?.totalIntakeKg || '187.5'} kg</div>
          <span className="text-[11px] text-emerald-700 font-medium">Weighbridge Certified</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-stone-500 text-xs font-semibold uppercase">Raw Material Outlay</span>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">₹{metrics?.totalSpendInr || '3,656.25'}</div>
          <span className="text-[11px] text-stone-400">Direct to collectors</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-stone-500 text-xs font-semibold uppercase">Active Mandi Buying Offers</span>
          <div className="text-2xl font-extrabold text-emerald-800 mt-1">{activeOffers.length} Live Rates</div>
          <span className="text-[11px] text-stone-400">Open for collector deliveries</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-stone-500 text-xs font-semibold uppercase">Verification Status</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">CPCB Approved ✓</div>
          <span className="text-[11px] text-stone-400">Zero Landfill Compliance</span>
        </div>
      </div>

      {/* Active Buying Offers Sheet */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-stone-900 text-base">Published Material Buying Rate Sheet</h3>
          <span className="text-xs text-stone-500">Updated in real-time on public mandi board</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeOffers.map((o) => (
            <div key={o.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <span className="font-bold text-stone-900 text-sm">{o.category?.name}</span>
                <span className="font-extrabold text-emerald-700 text-base">₹{o.buyingPricePerKg}/kg</span>
              </div>
              <div className="text-stone-600">Facility: {o.facilityName}</div>
              <div className="text-stone-500">Min Lot Size: <b>{o.minQuantityKg} kg</b></div>
              <div className="text-[11px] text-emerald-800 font-medium bg-emerald-50 p-1.5 rounded">
                Grade: {o.gradeAccepted}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gate Inbound Weight Slips */}
      <div className="space-y-4">
        <h3 className="font-bold text-stone-900 text-base">Inbound Intake Slips & Weighbridge Audit</h3>
        <div className="bg-white rounded-3xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-xs text-xs">
          {recentIntakes.map((intake) => (
            <div key={intake.id} className="p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="font-bold text-stone-900 text-sm">{intake.intakeSlipNumber}</div>
                <div className="text-stone-500">
                  Supplier: <b>{intake.supplierName}</b> • Grade: {intake.materialGrade}
                </div>
              </div>

              <div className="text-right">
                <span className="font-extrabold text-stone-900 text-sm block">
                  {intake.netWeightKg} kg @ ₹{intake.purchaseRatePerKg}/kg = ₹{intake.totalPurchaseAmount}
                </span>
                <span className="font-mono text-[10px] text-stone-400">
                  Hash: {intake.receiptHash.slice(0, 16)}...
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Offer Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <form onSubmit={handleCreateOffer} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-stone-900 text-lg">Publish Factory Buying Rate</h3>
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Material Category</label>
              <select
                value={offerCatId}
                onChange={(e) => setOfferCatId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Buying Price (₹/kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Min Quantity (kg)</label>
                <input
                  type="number"
                  value={offerMinQty}
                  onChange={(e) => setOfferMinQty(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsOfferModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-stone-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-xl"
              >
                Publish Rate
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Intake Slip Modal */}
      {isIntakeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <form onSubmit={handleCreateIntake} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-stone-900 text-lg">Generate Weighbridge Intake Slip</h3>
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Supplier / Collector Name</label>
              <input
                type="text"
                value={intakeSupplier}
                onChange={(e) => setIntakeSupplier(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Net Scale Weight (kg)</label>
                <input
                  type="number"
                  value={intakeWeight}
                  onChange={(e) => setIntakeWeight(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Purchase Rate (₹/kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={intakeRate}
                  onChange={(e) => setIntakeRate(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsIntakeModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-stone-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-xl"
              >
                Save Weight Slip
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
