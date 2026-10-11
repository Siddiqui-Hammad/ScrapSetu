import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { PickupRequest } from '../types';
import { PickupMap } from '../components/maps/PickupMap';
import { ReceiptModal } from '../components/receipts/ReceiptModal';
import {
  Truck,
  Scale,
  MapPin,
  CheckCircle,
  Phone,
  Clock,
  ArrowRight,
  TrendingUp,
  Navigation,
  Shield,
  FileCheck,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface CollectorDashboardProps {
  setCurrentTab: (tab: string) => void;
  setSelectedPickupId: (id: string) => void;
}

export const CollectorDashboard: React.FC<CollectorDashboardProps> = ({
  setCurrentTab,
  setSelectedPickupId,
}) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'nearby' | 'my-jobs' | 'route' | 'earnings' | 'kyc' | 'safety'>('nearby');
  const [nearbyPickups, setNearbyPickups] = useState<any[]>([]);
  const [myPickups, setMyPickups] = useState<PickupRequest[]>([]);
  const [earnings, setEarnings] = useState<any | null>(null);
  const [routePlan, setRoutePlan] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>('');

  // Weighing & Completion Modal
  const [weighingPickup, setWeighingPickup] = useState<PickupRequest | null>(null);
  const [weighedItems, setWeighedItems] = useState<Array<{ categoryId: string; actualQty: number; agreedPricePerUnit: number }>>([]);
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'UPI' | 'BANK_TRANSFER'>('UPI');
  const [receiptData, setReceiptData] = useState<any | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);

  const fetchCollectorData = async () => {
    setIsLoading(true);
    setActionSuccessMsg('');
    try {
      const [nearbyRes, myJobsRes, earnRes, routeRes] = await Promise.all([
        api.getNearbyPickups(),
        api.listPickups(),
        api.getCollectorEarnings(),
        api.getCollectorRoutePlan(),
      ]);

      if (nearbyRes.success && nearbyRes.pickups) setNearbyPickups(nearbyRes.pickups);
      if (myJobsRes.success && myJobsRes.pickups) setMyPickups(myJobsRes.pickups);
      if (earnRes.success && earnRes.summary) setEarnings(earnRes.summary);
      if (routeRes.success && routeRes.route) setRoutePlan(routeRes.route);
    } catch (err) {
      console.error('Collector dashboard fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectorData();
  }, []);

  const handleAcceptPickup = async (id: string) => {
    const res = await api.acceptPickup(id);
    if (res.success) {
      setActionSuccessMsg('पिकअप सफलतापूर्वक स्वीकार किया गया! पता अनलॉक हो गया है। (Pickup Accepted!)');
      fetchCollectorData();
      setActiveTab('my-jobs');
    } else {
      alert(res.message || 'Could not accept pickup.');
    }
  };

  const handleMarkArrived = async (id: string) => {
    const res = await api.updatePickupStatus(id, 'IN_PROGRESS', 'Collector reached on-site with scale');
    if (res.success) {
      fetchCollectorData();
    }
  };

  const handleOpenWeighingModal = (p: PickupRequest) => {
    setWeighingPickup(p);
    // Initialize item inputs based on requested items
    const initialItems = p.items.map((item) => ({
      categoryId: item.categoryId,
      actualQty: item.estimatedQty,
      agreedPricePerUnit: 14.0, // fallback baseline
    }));
    setWeighedItems(initialItems);
  };

  const handleCompleteWeighing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weighingPickup) return;

    const payload = {
      paymentMode,
      items: weighedItems,
      notes: 'Weighed on certified calibrated digital spring scale. Mutually approved.',
    };

    const res = await api.completePickupWithWeighing(weighingPickup.id, payload);
    if (res.success && res.receiptNumber) {
      setWeighingPickup(null);
      // Fetch and show digital receipt
      const receiptRes = await api.getReceipt(res.receiptNumber);
      if (receiptRes.success && receiptRes.receipt) {
        setReceiptData(receiptRes.receipt);
        setIsReceiptModalOpen(true);
      }
      fetchCollectorData();
    } else {
      alert(res.message || 'Error settling transaction.');
    }
  };

  const activeAssignedJobs = myPickups.filter((p) =>
    ['ACCEPTED', 'IN_PROGRESS'].includes(p.status) && p.assignedCollectorId === user?.id
  );

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Mobile-Friendly Profile & Vehicle Header */}
      <div className="bg-emerald-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-800 border border-emerald-700 flex items-center justify-center text-3xl shadow-xs">
            🛺
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                {user?.name || 'रामकिशन साहु'}
              </h1>
              <span className="text-[11px] bg-emerald-700/80 px-2 py-0.5 rounded-full font-bold">
                प्रमाणित ✓
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5 font-hindi">
              वाहन: {user?.profile?.vehicleType || 'Three-Wheeler'} (RJ 14 TB 4921) • क्षमता: 250 kg/दिन
            </p>
          </div>
        </div>

        <button
          onClick={fetchCollectorData}
          className="p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="font-hindi">रिफ्रेश (Refresh)</span>
        </button>
      </div>

      {/* Large Touch Tab Navigation Bar (Low Digital Literacy UX) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 select-none">
        <button
          onClick={() => setActiveTab('nearby')}
          className={`p-3.5 rounded-2xl text-center font-bold text-xs sm:text-sm transition-all border ${
            activeTab === 'nearby'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <div className="text-lg mb-1">📍</div>
          <div>नजदीकी कबाड़</div>
          <div className="text-[10px] opacity-80">({nearbyPickups.length} Nearby Jobs)</div>
        </button>

        <button
          onClick={() => setActiveTab('my-jobs')}
          className={`p-3.5 rounded-2xl text-center font-bold text-xs sm:text-sm transition-all border ${
            activeTab === 'my-jobs'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <div className="text-lg mb-1">🛺</div>
          <div>चालू पिकअप</div>
          <div className="text-[10px] opacity-80">({activeAssignedJobs.length} Active)</div>
        </button>

        <button
          onClick={() => setActiveTab('route')}
          className={`p-3.5 rounded-2xl text-center font-bold text-xs sm:text-sm transition-all border ${
            activeTab === 'route'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <div className="text-lg mb-1">🗺️</div>
          <div>स्मार्ट रूट</div>
          <div className="text-[10px] opacity-80">Route Planner</div>
        </button>

        <button
          onClick={() => setActiveTab('earnings')}
          className={`p-3.5 rounded-2xl text-center font-bold text-xs sm:text-sm transition-all border ${
            activeTab === 'earnings'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <div className="text-lg mb-1">💰</div>
          <div>मेरी कमाई</div>
          <div className="text-[10px] opacity-80">₹{earnings?.todayPayouts || 0} Today</div>
        </button>

        <button
          onClick={() => setActiveTab('kyc')}
          className={`p-3.5 rounded-2xl text-center font-bold text-xs sm:text-sm transition-all border ${
            activeTab === 'kyc'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <div className="text-lg mb-1">🪪</div>
          <div>KYC सत्यापन</div>
          <div className="text-[10px] opacity-80">Aadhaar + DL + Selfie</div>
        </button>

        <button
          onClick={() => setActiveTab('safety')}
          className={`p-3.5 rounded-2xl text-center font-bold text-xs sm:text-sm transition-all border ${
            activeTab === 'safety'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <div className="text-lg mb-1">🛡️</div>
          <div>सुरक्षा निर्देश</div>
          <div className="text-[10px] opacity-80">Safety & Rules</div>
        </button>
      </div>

      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* TAB 1: NEARBY OPEN JOBS */}
      {activeTab === 'nearby' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-base font-hindi">
              आपके इलाके में उपलब्ध कबाड़ पिकअप ({nearbyPickups.length})
            </h3>
            <span className="text-xs text-stone-500">Service Radius: ~8 km</span>
          </div>

          {nearbyPickups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nearbyPickups.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4 hover:border-emerald-500 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block mb-1">
                        दूरी: {p.distanceKm} किमी (Approx {p.distanceKm} km away)
                      </span>
                      <h4 className="font-bold text-stone-900 text-base">
                        {p.items.map((i: any) => i.categoryName).join(' + ')}
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5 font-hindi">
                        इलाका: <b>{p.area}</b> ({p.city})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-extrabold text-stone-900 block">
                        ₹{p.estimatedTotalValue}
                      </span>
                      <span className="text-xs font-semibold text-emerald-700">
                        {p.estimatedTotalWeightKg} kg
                      </span>
                    </div>
                  </div>

                  {p.notes && (
                    <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100 italic">
                      "{p.notes}"
                    </div>
                  )}

                  <div className="text-xs text-stone-500 flex justify-between">
                    <span>समय: {p.preferredTimeSlot}</span>
                    <span>तारीख: {p.preferredDate}</span>
                  </div>

                  <button
                    onClick={() => handleAcceptPickup(p.id)}
                    className="w-full py-3.5 text-center font-bold text-sm text-white bg-emerald-700 hover:bg-emerald-800 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>पिकअप स्वीकार करें (Accept Pickup)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200 text-center space-y-2">
              <div className="text-3xl">📭</div>
              <h4 className="font-bold text-stone-800 text-sm font-hindi">
                वर्तमान में कोई खुला पिकअप नहीं है
              </h4>
              <p className="text-xs text-stone-500">
                जैसे ही आपके इलाके में कोई नया कबाड़ बुक करेगा, आपको तुरंत यहां सूचना मिलेगी।
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY ACTIVE JOBS */}
      {activeTab === 'my-jobs' && (
        <div className="space-y-4">
          <h3 className="font-bold text-stone-900 text-base font-hindi">
            आपके स्वीकृत चालू पिकअप ({activeAssignedJobs.length})
          </h3>

          {activeAssignedJobs.length > 0 ? (
            <div className="space-y-4">
              {activeAssignedJobs.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl p-5 border border-emerald-300 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 uppercase">
                        {p.status}
                      </span>
                      <h4 className="text-base font-bold text-stone-900 mt-1">
                        {p.requester?.name || 'Customer'}
                      </h4>
                    </div>

                    <a
                      href={`tel:${p.requester?.phone || ''}`}
                      className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1.5 border border-emerald-200"
                    >
                      <Phone className="w-4 h-4" />
                      <span>कॉल करें ({p.requester?.phone || 'Call'})</span>
                    </a>
                  </div>

                  {/* Unlocked Precise Address */}
                  <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-stone-700 block uppercase text-[10px]">
                      ग्राहक का पूरा पता (Unlocked Pickup Address):
                    </span>
                    <div className="text-sm font-bold text-stone-900">{p.address.streetAddress}</div>
                    <div className="text-stone-500">
                      {p.address.city} - {p.address.pincode}
                    </div>
                  </div>

                  {/* Action Buttons for Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {p.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleMarkArrived(p.id)}
                        className="w-full py-3 text-center font-bold text-xs sm:text-sm text-stone-900 bg-amber-200 hover:bg-amber-300 rounded-xl shadow-xs"
                      >
                        📍 पते पर पहुंच गए (Mark Arrived)
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenWeighingModal(p)}
                      className="w-full py-3 text-center font-bold text-xs sm:text-sm text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Scale className="w-4 h-4" />
                      <span>⚖️ तौल दर्ज करें व रसीद बनाएं</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200 text-center text-xs text-stone-500">
              कोई चालू पिकअप नहीं है। ऊपर "नजदीकी कबाड़" टैब से नया पिकअप स्वीकार करें।
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SMART ROUTE PLANNER */}
      {activeTab === 'route' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-base font-hindi">
                दैनिक सुगम मार्ग प्लानर (TSP Route Optimizer)
              </h3>
              <p className="text-xs text-stone-500">
                Algorithm: {routePlan?.algorithmUsed || 'Nearest Neighbor TSP'}
              </p>
            </div>
            {routePlan && (
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                बचत: {routePlan.distanceSavedKm} किमी Saved
              </span>
            )}
          </div>

          {routePlan && routePlan.orderedStops?.length > 0 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-emerald-50 rounded-2xl text-xs border border-emerald-200 text-emerald-950 font-medium">
                <div>कुल यात्रा: <b>{routePlan.totalDistanceKm} किमी</b></div>
                <div>अनुमानित समय: <b>{routePlan.estimatedDrivingTimeMinutes} मिनट</b></div>
                <div>कुल स्टॉप्स: <b>{routePlan.orderedStops.length}</b></div>
              </div>

              <div className="space-y-2 pt-2">
                {routePlan.orderedStops.map((stop: any, idx: number) => (
                  <div
                    key={stop.pickupId}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-stone-900">{stop.requesterName}</div>
                        <div className="text-stone-500">{stop.streetAddress}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-800">{stop.estimatedWeightKg} kg</span>
                      <span className="text-[10px] text-stone-400 block">{stop.preferredTimeSlot}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-xs text-stone-500 text-center py-8">
              मार्ग अनुकूलन के लिए कम से कम 1 या अधिक चालू पिकअप आवश्यक हैं।
            </div>
          )}
        </div>
      )}

      {/* TAB 4: EARNINGS & LEDGER */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-stone-500 text-xs font-semibold uppercase">आज की कमाई (Today)</span>
              <div className="text-3xl font-extrabold text-emerald-800 mt-1">₹{earnings?.todayPayouts || 0}</div>
              <span className="text-[11px] text-stone-400">Recorded on Receipts</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-stone-500 text-xs font-semibold uppercase">इस सप्ताह (Week)</span>
              <div className="text-3xl font-extrabold text-stone-900 mt-1">₹{earnings?.weekPayouts || 0}</div>
              <span className="text-[11px] text-emerald-700 font-medium">Direct Settlement</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-stone-500 text-xs font-semibold uppercase">कुल संचित वजन (Collected)</span>
              <div className="text-3xl font-extrabold text-stone-900 mt-1">{earnings?.totalCollectedKg || 0} kg</div>
              <span className="text-[11px] text-stone-400">Total Diversion</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SAFETY & SEGREGATION GUIDELINES */}
      {activeTab === 'safety' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 text-xs leading-relaxed">
          <h3 className="text-base font-bold text-stone-900 font-hindi">
            कबाड़ संकलन सुरक्षा एवं पृथक्करण नियम (Safety & Waste Rules)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <span className="font-bold text-emerald-950 block text-sm">✅ सुरक्षित पृथक्करण</span>
              <p>• रद्दी कागज़ को सूखे गत्ते के साथ अलग बांधें।</p>
              <p>• प्लास्टिक की बोतलों (PET) के ढक्कन अलग रखें।</p>
              <p>• तांबे और एल्युमिनियम को भारी लोहे से अलग तौलें (भाव का अंतर)।</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
              <span className="font-bold text-amber-950 block text-sm">⚠️ व्यक्तिगत सुरक्षा</span>
              <p>• नुकीले लोहे या कांच उठाते समय हमेशा चमड़े के दस्ताने पहनें।</p>
              <p>• रासायनिक कंटेनर या बायोमेडिकल अपशिष्ट स्वीकार न करें।</p>
              <p>• डिजिटल कांटे को हर सुबह 1 किग्रा के मानक बाट से जांचें।</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: 3-POINT KYC VERIFICATION */}
      {activeTab === 'kyc' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6 text-xs leading-relaxed">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-stone-900 font-hindi">
                🪪 पहचान एवं ड्राइविंग लाइसेंस सत्यापन (3-Point KYC Verification)
              </h3>
              <p className="text-stone-500 text-xs">
                To guarantee resident safety and legal vehicle operation, your Aadhaar, Commercial DL, and Live Selfie are verified.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              प्रमाणित साथी (Verified Partner ✓)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="text-2xl">📄</div>
              <div className="font-bold text-stone-900 text-sm">Aadhaar Card (आधार कार्ड)</div>
              <div className="text-stone-500 text-xs font-mono">UID: 5482-XXXX-4912</div>
              <div className="text-emerald-700 font-semibold text-[11px]">UIDAI Format Verified ✓</div>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="text-2xl">🪪</div>
              <div className="font-bold text-stone-900 text-sm">Driving Licence (ड्राइविंग लाइसेंस)</div>
              <div className="text-stone-500 text-xs font-mono">DL: RJ-14-2019-00291</div>
              <div className="text-emerald-700 font-semibold text-[11px]">Commercial Transport (LMV-TR) ✓</div>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="text-2xl">🤳</div>
              <div className="font-bold text-stone-900 text-sm">Live Face Selfie (लाइव सेल्फी)</div>
              <div className="text-stone-500 text-xs font-mono">Biometric Liveness Match</div>
              <div className="text-emerald-700 font-semibold text-[11px]">Face Match Score: 98.4% ✓</div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 space-y-2">
            <span className="font-bold block text-sm">🔒 क्यों जरूरी है 3-पॉइंट सत्यापन? (Why 3-Point KYC Matters)</span>
            <p>1. <b>सुरक्षा (Safety):</b> घरों में घुसते समय गृहणियां और परिवार सुरक्षित महसूस करते हैं।</p>
            <p>2. <b>कानूनी वैधता (Legality):</b> माल वाहक रिक्शा या मिनी-ट्रक चलाने हेतु वैध ड्राइविंग लाइसेंस आवश्यक है।</p>
            <p>3. <b>एंटी-फ्रॉड (Face Match):</b> लाइव सेल्फी सुनिश्चित करती है कि पंजीकृत कबाड़ीवाला ही मौके पर उपस्थित है।</p>
          </div>
        </div>
      )}

      {/* IN-FIELD WEIGHING & TRANSACTION ENTRY MODAL */}
      {weighingPickup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <form
            onSubmit={handleCompleteWeighing}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-bold text-stone-900 text-lg font-hindi">
                  कांटे की सही तौल दर्ज करें (Enter Final Weight)
                </h3>
                <p className="text-xs text-stone-500">
                  Customer: {weighingPickup.requester?.name || 'Resident'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWeighingPickup(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {weighedItems.map((item, idx) => (
                <div key={idx} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                  <div className="font-bold text-stone-800">
                    आइटम #{idx + 1}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-stone-600 font-semibold block mb-1">
                        वास्तविक वजन (kg)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        value={item.actualQty}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setWeighedItems((prev) =>
                            prev.map((it, i) => (i === idx ? { ...it, actualQty: val } : it))
                          );
                        }}
                        className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-600 font-semibold block mb-1">
                        सहमति दर (₹/kg)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        value={item.agreedPricePerUnit}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setWeighedItems((prev) =>
                            prev.map((it, i) => (i === idx ? { ...it, agreedPricePerUnit: val } : it))
                          );
                        }}
                        className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="text-right text-xs font-bold text-emerald-800">
                    योग: ₹{Math.round(item.actualQty * item.agreedPricePerUnit * 100) / 100}
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                भुगतान माध्यम (Payment Mode)
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['UPI', 'CASH', 'BANK_TRANSFER'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`p-2.5 rounded-xl border text-center font-bold ${
                      paymentMode === mode
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-stone-50 border-stone-200 text-stone-700'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl text-xs font-bold text-emerald-950 flex justify-between">
              <span>कुल देय राशि (Total Payout):</span>
              <span>
                ₹
                {weighedItems.reduce(
                  (acc, it) => acc + Math.round(it.actualQty * it.agreedPricePerUnit * 100) / 100,
                  0
                )}
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setWeighingPickup(null)}
                className="px-4 py-2 text-xs font-medium text-stone-600"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md"
              >
                रसीद जारी करें व पूरा करें (Issue Receipt)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Digital Receipt Modal */}
      <ReceiptModal
        receipt={receiptData}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />
    </div>
  );
};
