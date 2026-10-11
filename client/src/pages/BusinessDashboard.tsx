import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { PickupRequest, Address } from '../types';
import {
  Building2,
  Repeat,
  MapPin,
  Plus,
  ArrowRight,
  FileCheck2,
  Calendar,
  Layers,
  TrendingUp,
} from 'lucide-react';
import { ReceiptModal } from '../components/receipts/ReceiptModal';

interface BusinessDashboardProps {
  setCurrentTab: (tab: string) => void;
  setSelectedPickupId: (id: string) => void;
}

export const BusinessDashboard: React.FC<BusinessDashboardProps> = ({
  setCurrentTab,
  setSelectedPickupId,
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [receiptData, setReceiptData] = useState<any | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);
  const [newAddressLabel, setNewAddressLabel] = useState<string>('');
  const [newStreetAddress, setNewStreetAddress] = useState<string>('');
  const [isAddAddressOpen, setIsAddAddressOpen] = useState<boolean>(false);

  const fetchBusinessData = async () => {
    const [pRes, meRes] = await Promise.all([api.listPickups(), api.getMe()]);
    if (pRes.success && pRes.pickups) setPickups(pRes.pickups);
    if (meRes.success && meRes.user?.addresses) setAddresses(meRes.user.addresses);
  };

  useEffect(() => {
    fetchBusinessData();
  }, []);

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreetAddress) return;
    const res = await api.addAddress({
      label: newAddressLabel || 'Branch Office',
      streetAddress: newStreetAddress,
      city: 'Jaipur',
      pincode: '302022',
    });
    if (res.success) {
      setIsAddAddressOpen(false);
      setNewAddressLabel('');
      setNewStreetAddress('');
      fetchBusinessData();
    }
  };

  const openReceipt = async (receiptNum: string) => {
    const res = await api.getReceipt(receiptNum);
    if (res.success && res.receipt) {
      setReceiptData(res.receipt);
      setIsReceiptModalOpen(true);
    }
  };

  const totalTonnageKg = pickups
    .filter((p) => p.status === 'COMPLETED')
    .reduce((acc, p) => acc + (p.transaction?.totalWeightKg || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>Commercial Waste Generator Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.profile?.businessName || user?.name || 'GreenLeaf Logistics'}
          </h1>
          <p className="text-xs text-stone-300">
            GSTIN: {user?.profile?.gstNumber || '08AAACG1234F1Z8'} • Bulk Packaging & Industrial Scrap Disposal
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('create-pickup')}
            className="px-5 py-3 rounded-2xl font-semibold text-white bg-emerald-700 hover:bg-emerald-600 shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Schedule Bulk Intake</span>
          </button>
        </div>
      </div>

      {/* Commercial Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-stone-500 text-xs font-semibold uppercase">Total Commercial Volume</span>
          <div className="text-3xl font-extrabold text-stone-900 mt-1">{totalTonnageKg} kg</div>
          <span className="text-[11px] text-emerald-700 font-medium">100% Circular Diversion</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-stone-500 text-xs font-semibold uppercase">Verified Operating Hubs</span>
          <div className="text-3xl font-extrabold text-stone-900 mt-1">{addresses.length} Facilities</div>
          <span className="text-[11px] text-stone-400">Jaipur & Sitapura Industrial Hubs</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-stone-500 text-xs font-semibold uppercase">Recurring Subscriptions</span>
          <div className="text-3xl font-extrabold text-emerald-800 mt-1">Weekly</div>
          <span className="text-[11px] text-emerald-700 font-medium">Automatic Collector Dispatch</span>
        </div>
      </div>

      {/* Facilities / Addresses Management */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-base">Commercial Dispatch Locations</h3>
            <p className="text-xs text-stone-500">Manage industrial bays, warehouses, and corporate outlets</p>
          </div>
          <button
            onClick={() => setIsAddAddressOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200"
          >
            + Add Warehouse
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {addresses.map((a) => (
            <div key={a.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-stone-900">{a.label}</span>
                {a.isDefault && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    Primary Hub
                  </span>
                )}
              </div>
              <div className="text-stone-600">{a.streetAddress}</div>
              <div className="text-stone-400">{a.city} - {a.pincode}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Address Form Modal */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <form onSubmit={handleAddLocation} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-stone-900 text-lg">Add Commercial Location</h3>
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Facility Name / Label</label>
              <input
                type="text"
                value={newAddressLabel}
                onChange={(e) => setNewAddressLabel(e.target.value)}
                placeholder="e.g. Sitapura Warehouse Bay 4"
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Street Address</label>
              <input
                type="text"
                value={newStreetAddress}
                onChange={(e) => setNewStreetAddress(e.target.value)}
                placeholder="e.g. Plot 14, RIICO Industrial Area"
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddAddressOpen(false)}
                className="px-4 py-2 text-xs font-medium text-stone-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-xl"
              >
                Save Facility
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Commercial Pickups Ledger */}
      <div className="space-y-4">
        <h3 className="font-bold text-stone-900 text-lg">Pickups & GST Transaction Slips</h3>
        <div className="bg-white rounded-3xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-xs text-xs">
          {pickups.map((p) => (
            <div key={p.id} className="p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 text-sm">
                    {p.items.map((i) => i.category?.name).join(', ')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold text-[10px]">
                    {p.status}
                  </span>
                </div>
                <div className="text-stone-500 mt-0.5">
                  Location: {p.address.label} • Weight: {p.estimatedTotalWeightKg} kg • Scheduled: {p.preferredDate}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-extrabold text-stone-900 text-sm">
                  ₹{p.transaction?.totalAmount || p.estimatedTotalValue}
                </span>

                <button
                  onClick={() => {
                    setSelectedPickupId(p.id);
                    setCurrentTab('track-pickup');
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl"
                >
                  Track
                </button>

                {p.transaction?.receiptNumber && (
                  <button
                    onClick={() => openReceipt(p.transaction!.receiptNumber)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl flex items-center gap-1"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Receipt</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ReceiptModal
        receipt={receiptData}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />
    </div>
  );
};
