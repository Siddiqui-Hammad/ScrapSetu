import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { PickupRequest } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Plus,
  Scale,
  Leaf,
  CheckCircle2,
  FileCheck2,
  RefreshCw,
} from 'lucide-react';
import { ReceiptModal } from '../components/receipts/ReceiptModal';

interface HouseholdDashboardProps {
  setCurrentTab: (tab: string) => void;
  setSelectedPickupId: (id: string) => void;
}

export const HouseholdDashboard: React.FC<HouseholdDashboardProps> = ({
  setCurrentTab,
  setSelectedPickupId,
}) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [myImpact, setMyImpact] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [receiptData, setReceiptData] = useState<any | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [pickupsRes, impactRes] = await Promise.all([
        api.listPickups(),
        api.getMyImpact(),
      ]);
      if (pickupsRes.success && pickupsRes.pickups) {
        setPickups(pickupsRes.pickups);
      }
      if (impactRes.success && impactRes.personalImpact) {
        setMyImpact(impactRes.personalImpact);
      }
    } catch (err) {
      console.error('Error fetching household dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const openReceipt = async (receiptNum: string) => {
    const res = await api.getReceipt(receiptNum);
    if (res.success && res.receipt) {
      setReceiptData(res.receipt);
      setIsReceiptModalOpen(true);
    }
  };

  const activePickups = pickups.filter((p) =>
    ['OPEN', 'ACCEPTED', 'IN_PROGRESS'].includes(p.status)
  );
  const completedPickups = pickups.filter((p) => p.status === 'COMPLETED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-emerald-800 to-forest-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
        <div>
          <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider block">
            {language === 'hi' ? 'घरेलू उपभोक्ता पोर्टल' : 'Household Recycling Hub'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Welcome back, {user?.name || 'Resident'}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
            {language === 'hi'
              ? 'आपके घर का कबाड़ सीधे प्रमाणित कबाड़ीवालों और रीसाइक्लिंग मिलों तक पहुंचाया जा रहा है।'
              : 'Your doorstep recyclables are channeled directly to verified local kabadiwalas and circular processing mills.'}
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('create-pickup')}
          className="px-6 py-3 rounded-2xl font-semibold text-emerald-950 bg-emerald-300 hover:bg-emerald-200 shadow-md transition-all flex items-center gap-2 hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5" />
          <span>{t.bookPickupBtn}</span>
        </button>
      </div>

      {/* Personal Eco Footprint Counter */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-stone-500 text-xs font-medium">Recycled Material</div>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">
            {myImpact?.verifiedTotals?.totalMaterialCollectedKg || 0} kg
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">Verified on scales</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-stone-500 text-xs font-medium">CO₂ Averted</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">
            {myImpact?.ecologicalSavings?.co2EquivalentOffsetKg || 0} kg
          </div>
          <div className="text-[11px] text-stone-400 mt-1">EPA WARM model</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-stone-500 text-xs font-medium">Total Cash/UPI Earned</div>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">
            ₹{myImpact?.verifiedTotals?.totalCollectorPayoutsInr || 0}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">Direct to wallet</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-stone-500 text-xs font-medium">Completed Pickups</div>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">
            {completedPickups.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">100% receipt verified</div>
        </div>
      </div>

      {/* Active Scheduled Pickups */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900">Active Scheduled Pickups</h2>
          <span className="text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 font-semibold">
            {activePickups.length} In Progress
          </span>
        </div>

        {activePickups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePickups.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedPickupId(p.id);
                  setCurrentTab('track-pickup');
                }}
                className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 uppercase">
                    {p.status}
                  </span>
                  <span className="text-xs text-stone-500">
                    Est. Value: <b className="text-stone-900">₹{p.estimatedTotalValue}</b>
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 text-base">
                    {p.items.map((i) => i.category?.name).join(', ')}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Est. Weight: {p.estimatedTotalWeightKg} kg • Preferred Slot: {p.preferredTimeSlot}
                  </p>
                </div>

                <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{p.address.streetAddress}</span>
                  </div>
                  <span className="text-emerald-700 font-bold shrink-0 flex items-center gap-1">
                    <span>Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-stone-800 text-base">No active pickup requests</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Have scrap paper, bottles, or old utensils lying around? Schedule a doorstep pickup with certified scales in 30 seconds.
            </p>
            <button
              onClick={() => setCurrentTab('create-pickup')}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors"
            >
              Book Scrap Pickup Now
            </button>
          </div>
        )}
      </div>

      {/* Completed History & Receipts */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Past Completed Pickups & Receipts</h2>
        {completedPickups.length > 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-stone-100 text-xs">
              {completedPickups.map((p) => (
                <div
                  key={p.id}
                  className="p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">
                        {p.items.map((i) => i.category?.name).join(', ')}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        COMPLETED
                      </span>
                    </div>
                    <div className="text-stone-500">
                      Date: {p.preferredDate} • Scale Weight: {p.transaction?.totalWeightKg || p.estimatedTotalWeightKg} kg
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-base font-extrabold text-stone-900 block">
                        ₹{p.transaction?.totalAmount || p.estimatedTotalValue}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        Paid via {p.transaction?.paymentMode || 'UPI'}
                      </span>
                    </div>

                    {p.transaction?.receiptNumber && (
                      <button
                        onClick={() => openReceipt(p.transaction!.receiptNumber)}
                        className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl flex items-center gap-1.5 transition-colors border border-emerald-200"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Receipt</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-xs text-stone-500 p-6 bg-stone-50 rounded-2xl text-center">
            No completed transactions yet.
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        receipt={receiptData}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />
    </div>
  );
};
