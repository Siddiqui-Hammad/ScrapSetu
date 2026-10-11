import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PickupRequest } from '../types';
import { PickupStatusTimeline } from '../components/common/PickupStatusTimeline';
import { PickupMap } from '../components/maps/PickupMap';
import { ReceiptModal } from '../components/receipts/ReceiptModal';
import {
  MapPin,
  Clock,
  Phone,
  Truck,
  FileCheck2,
  AlertTriangle,
  XCircle,
  Calendar,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface TrackPickupPageProps {
  pickupId: string;
  setCurrentTab: (tab: string) => void;
}

export const TrackPickupPage: React.FC<TrackPickupPageProps> = ({ pickupId, setCurrentTab }) => {
  const { user } = useAuth();
  const [pickup, setPickup] = useState<PickupRequest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [receiptData, setReceiptData] = useState<any | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState<boolean>(false);
  const [disputeSubject, setDisputeSubject] = useState<string>('');
  const [disputeDesc, setDisputeDesc] = useState<string>('');
  const [actionMsg, setActionMsg] = useState<string>('');

  const fetchPickup = async () => {
    setIsLoading(true);
    try {
      const res = await api.getPickupById(pickupId);
      if (res.success && res.pickup) {
        setPickup(res.pickup);
      }
    } catch (err) {
      console.error('Error fetching pickup:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (pickupId) {
      fetchPickup();
    }
  }, [pickupId]);

  const handleCancel = async () => {
    if (!pickup) return;
    const res = await api.cancelPickup(pickup.id, cancelReason);
    if (res.success) {
      setIsCancelModalOpen(false);
      fetchPickup();
    }
  };

  const handleDispute = async () => {
    if (!pickup || !disputeSubject || !disputeDesc) return;
    const res = await api.disputePickup(pickup.id, disputeSubject, disputeDesc);
    if (res.success) {
      setIsDisputeModalOpen(false);
      fetchPickup();
    }
  };

  const handleOpenReceipt = async () => {
    if (pickup?.transaction?.receiptNumber) {
      const res = await api.getReceipt(pickup.transaction.receiptNumber);
      if (res.success && res.receipt) {
        setReceiptData(res.receipt);
        setIsReceiptModalOpen(true);
      }
    }
  };

  if (isLoading || !pickup) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-stone-500">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
        <p className="text-sm">Loading pickup tracking details...</p>
      </div>
    );
  }

  const assignedCollector = pickup.assignments?.[0]?.collector;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Request #{pickup.id.slice(0, 8)}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950">
            Track Scrap Pickup
          </h1>
          <div className="text-xs text-stone-500 mt-0.5">
            Created on {new Date(pickup.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchPickup}
            className="p-2 text-stone-600 hover:text-stone-900 border border-stone-200 rounded-xl bg-white shadow-xs"
            title="Refresh Status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {pickup.status === 'COMPLETED' && pickup.transaction && (
            <button
              onClick={handleOpenReceipt}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>View Digital Receipt</span>
            </button>
          )}

          {['OPEN', 'ACCEPTED'].includes(pickup.status) && (
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-xl"
            >
              Cancel Request
            </button>
          )}

          {['IN_PROGRESS', 'COMPLETED'].includes(pickup.status) && pickup.status !== 'DISPUTED' && (
            <button
              onClick={() => setIsDisputeModalOpen(true)}
              className="px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 border border-purple-200 rounded-xl"
            >
              Raise Dispute
            </button>
          )}
        </div>
      </div>

      {/* Controlled State Machine Stepper */}
      <PickupStatusTimeline status={pickup.status} statusHistory={pickup.statusHistory} />

      {/* Main Grid: Details + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Collector & Item Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Assigned Collector Card */}
          {assignedCollector ? (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Assigned Collector (Kabadiwala)
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                  Verified Partner ✓
                </span>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-xl">
                  🛺
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-base">{assignedCollector.name}</h4>
                  <div className="text-xs text-stone-500">
                    Vehicle: {assignedCollector.profile?.vehicleType?.replace('_', ' ') || '3-Wheeler'} (RJ 14 TB 4921)
                  </div>
                  <div className="text-xs text-emerald-700 font-medium">
                    {assignedCollector.profile?.reliabilityRating || 4.8}★ Rating ({assignedCollector.profile?.totalPickupsCompleted || 88} Pickups)
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
                <span className="text-stone-500">Contact Number:</span>
                <a
                  href={`tel:${assignedCollector.phone}`}
                  className="font-bold text-emerald-800 flex items-center gap-1 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{assignedCollector.phone}</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center mx-auto">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <h4 className="font-bold text-stone-800 text-sm">Matching Nearest Verified Collector</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Your request has been broadcasted to verified collectors within 6km of your location. You will receive an alert once accepted.
              </p>
            </div>
          )}

          {/* Requested Items Card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h4 className="font-bold text-stone-900 text-base">Requested Items & Estimated Value</h4>
            <div className="divide-y divide-stone-100">
              {pickup.items.map((item, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-stone-900 block">
                      {item.category?.name || 'Material'}
                    </span>
                    <span className="text-stone-500">{item.gradeNotes || 'Standard Grade'}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-stone-900 block">
                      {item.estimatedQty} {item.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between text-xs font-bold text-stone-900">
              <span>Estimated Total Valuation</span>
              <span className="text-emerald-800 text-sm">₹{pickup.estimatedTotalValue} ({pickup.estimatedTotalWeightKg} kg)</span>
            </div>
          </div>

          {/* Actual Weighed Breakdown (If completed) */}
          {pickup.actualCollected && pickup.actualCollected.length > 0 && (
            <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>On-Site Scale Weighed Measurements</span>
              </div>
              <div className="divide-y divide-emerald-200/60">
                {pickup.actualCollected.map((item, i) => (
                  <div key={i} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-emerald-950 block">{item.category?.name}</span>
                      <span className="text-emerald-700 text-[10px]">{item.gradeRecorded}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-950">
                        {item.actualQty} kg × ₹{item.agreedPricePerUnit}
                      </span>
                      <span className="text-emerald-800 font-extrabold block">= ₹{item.itemTotal}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-emerald-300 flex justify-between font-extrabold text-sm text-emerald-950">
                <span>Final Settled Payout</span>
                <span>₹{pickup.transaction?.totalAmount}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Location Map & Pickup Address */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h4 className="font-bold text-stone-900 text-base">Pickup Location</h4>
            <div className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="font-bold">{pickup.address.label}</div>
              <div className="mt-0.5">{pickup.address.streetAddress}</div>
              <div className="text-stone-500">{pickup.address.city} - {pickup.address.pincode}</div>
            </div>

            {/* Leaflet Map */}
            <PickupMap
              centerLat={pickup.address.lat}
              centerLng={pickup.address.lng}
              zoom={14}
              height="280px"
              points={[
                {
                  id: pickup.id,
                  lat: pickup.address.lat,
                  lng: pickup.address.lng,
                  title: `${pickup.address.label} Pickup`,
                  subtitle: `${pickup.estimatedTotalWeightKg} kg scrap`,
                  isFuzzedForPrivacy: pickup.address.isFuzzedForPrivacy,
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-stone-900 text-lg">Cancel Pickup Request</h3>
            <p className="text-xs text-stone-500">
              Please let us know the reason for cancellation so we can improve platform reliability.
            </p>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Schedule conflict, already disposed scrap..."
              className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-stone-600"
              >
                Keep Request
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {isDisputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-stone-900 text-lg">Raise Dispute with Administrator</h3>
            <p className="text-xs text-stone-500">
              An authorized administrator will review scale calibration, transaction logs, and communicate with both parties.
            </p>
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Subject</label>
              <input
                type="text"
                value={disputeSubject}
                onChange={(e) => setDisputeSubject(e.target.value)}
                placeholder="e.g. Scale measurement discrepancy"
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-stone-50"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Description</label>
              <textarea
                rows={3}
                value={disputeDesc}
                onChange={(e) => setDisputeDesc(e.target.value)}
                placeholder="Provide specific details..."
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsDisputeModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-stone-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDispute}
                className="px-4 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-xl"
              >
                Submit Dispute
              </button>
            </div>
          </div>
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
