'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  MapPin,
  Truck,
  CheckCircle2,
  AlertCircle,
  Scale,
  Sparkles,
  ArrowRight,
  Filter,
  Layers,
  ChevronDown,
  Building2,
  Factory,
  Info,
  DollarSign,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { formatINR, formatKg } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';
import { BuyerMatchOffer, SmartBuyerMatchResponse, MaterialCategory } from '@/types';

interface Props {
  initialCategoryId?: string;
  initialWeightKg?: number;
  lotId?: string;
  onBuyerSelected?: (offer: BuyerMatchOffer) => void;
}

export const SmartBuyerMatchingWorkspace: React.FC<Props> = ({
  initialCategoryId,
  initialWeightKg = 50,
  lotId,
  onBuyerSelected,
}) => {
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryId || '');
  const [weightKg, setWeightKg] = useState<number>(initialWeightKg);
  const [vehicleType, setVehicleType] = useState<string>('THREE_WHEELER');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(30);
  const [minNetPrice, setMinNetPrice] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SmartBuyerMatchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [selectingOfferId, setSelectingOfferId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/pricing/categories');
        const json = await res.json();
        if (json.success && json.categories.length > 0) {
          setCategories(json.categories);
          if (!selectedCategory) {
            setSelectedCategory(json.categories[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch match offers whenever category, weight, or vehicle changes
  useEffect(() => {
    if (!selectedCategory || weightKg <= 0) return;

    let isMounted = true;
    async function fetchMatches() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.buyerMatching.getOffers({
          categoryId: selectedCategory,
          weightKg,
          vehicleType,
          lotId,
        });

        if (isMounted) {
          if (res.success) {
            setData(res);
          } else {
            setError((res as any).message || 'Failed to retrieve buyer offers.');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Error connecting to smart buyer matching service.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    const timer = setTimeout(fetchMatches, 250);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, weightKg, vehicleType, lotId]);

  const handleSelectBuyer = async (offer: BuyerMatchOffer) => {
    setSelectingOfferId(offer.offerId);
    setSuccessMessage(null);
    try {
      if (lotId) {
        const res = await apiClient.buyerMatching.selectBuyer(lotId, offer.offerId);
        if (res.success) {
          setSuccessMessage(`✓ Selected ${offer.facilityName}! Gate pass and route directions dispatched.`);
          if (onBuyerSelected) onBuyerSelected(offer);
        }
      } else {
        // Direct simulation / selection for unattached lot
        setSuccessMessage(`✓ Selected ${offer.facilityName}! Estimated net proceeds: ${formatINR(offer.netProceeds)}`);
        if (onBuyerSelected) onBuyerSelected(offer);
      }
    } catch (err: any) {
      alert(`Error selecting buyer: ${err.message}`);
    } finally {
      setSelectingOfferId(null);
    }
  };

  // Filter eligible offers by client-side distance and min net proceeds
  const filteredEligible = data?.eligibleBuyers.filter((b) => {
    return b.distanceKm <= maxDistanceKm && b.effectiveRatePerKg >= minNetPrice;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Smart Net-Return Optimization
            </div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight mt-1">
              Smart Buyer Matching Engine
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              Ranked by net proceeds after vehicle transit costs. Transparent rate comparison.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500">Vehicle Type:</span>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="text-xs font-bold bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
            >
              <option value="THREE_WHEELER">Three-Wheeler / Auto (₹50 base + ₹12/km)</option>
              <option value="MINI_TRUCK">Mini Truck / Tempo (₹90 base + ₹18/km)</option>
              <option value="CYCLE_RICKSHAW">Cycle Rickshaw (₹25 base + ₹6/km)</option>
            </select>
          </div>
        </div>

        {/* Input Parameters Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-stone-100">
          <div>
            <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
              Material Stream
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs font-semibold bg-stone-50 border border-stone-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-700"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.hindiName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
              Available Lot Weight (kg)
            </label>
            <div className="relative">
              <input
                type="number"
                min="5"
                max="5000"
                step="5"
                value={weightKg}
                onChange={(e) => setWeightKg(Math.max(1, Number(e.target.value)))}
                className="w-full text-xs font-bold bg-stone-50 border border-stone-200 rounded-lg p-2 pr-8 focus:ring-2 focus:ring-emerald-700"
              />
              <span className="absolute right-2.5 top-2 text-xs font-semibold text-stone-400">kg</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
              Max Transit Radius: {maxDistanceKm} km
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              className="w-full accent-emerald-800 mt-2"
            />
          </div>

          <div className="flex items-end">
            <div className="w-full bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 text-center">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Total Declared Weight
              </span>
              <span className="text-base font-black text-emerald-950">{formatKg(weightKg)}</span>
            </div>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-100/80 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center justify-between">
          <span>{successMessage}</span>
          <Button size="sm" variant="outline" onClick={() => setSuccessMessage(null)} className="h-7 text-xs">
            Dismiss
          </Button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* TOP RECOMMENDED BUYER SPOTLIGHT */}
      {data?.recommendedBuyer && (
        <div className="relative overflow-hidden bg-radial from-emerald-900 to-forest-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/50">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-extrabold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                Rank #1 Top Net Return Recommendation
              </div>
              <div className="text-xs text-emerald-200 font-mono">
                Source: Calibrated Mandi & RIICO Industrial Registry
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {data.recommendedBuyer.facilityName}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-200 font-medium">
                  <span className="flex items-center gap-1">
                    <Factory className="w-3.5 h-3.5 text-emerald-300" />
                    {data.recommendedBuyer.recyclerName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                    {data.recommendedBuyer.distanceKm} km away
                  </span>
                  <span>•</span>
                  <span>Min {formatKg(data.recommendedBuyer.minQuantityKg)}</span>
                </div>
                <p className="text-xs text-emerald-100 font-medium pt-1 max-w-xl">
                  {data.recommendedBuyer.recommendationReason}
                </p>
              </div>

              {/* Payout Breakdown Card */}
              <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-3">
                <div className="flex justify-between items-center text-xs text-emerald-100 border-b border-white/10 pb-2">
                  <span>Gross Value ({formatKg(weightKg)} @ ₹{data.recommendedBuyer.buyingPricePerKg}/kg):</span>
                  <span className="font-bold text-white font-mono">{formatINR(data.recommendedBuyer.grossValue)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-emerald-100 border-b border-white/10 pb-2">
                  <span>
                    Estimated Transport ({data.recommendedBuyer.distanceKm} km {vehicleType.toLowerCase()}):
                  </span>
                  <span className="font-bold text-amber-300 font-mono">
                    - {formatINR(data.recommendedBuyer.transportEstimate.totalTransportCost)}
                  </span>
                </div>
                {data.recommendedBuyer.handlingFeeTotal > 0 && (
                  <div className="flex justify-between items-center text-xs text-emerald-100 border-b border-white/10 pb-2">
                    <span>Handling / Unloading Fee:</span>
                    <span className="font-bold text-amber-300 font-mono">
                      - {formatINR(data.recommendedBuyer.handlingFeeTotal)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-1">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-emerald-300 block">
                      Estimated Net Proceeds
                    </span>
                    <span className="text-xs text-emerald-200 font-bold">
                      Effective: ₹{data.recommendedBuyer.effectiveRatePerKg}/kg net
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {formatINR(data.recommendedBuyer.netProceeds)}
                  </div>
                </div>

                <Button
                  onClick={() => handleSelectBuyer(data.recommendedBuyer!)}
                  disabled={selectingOfferId === data.recommendedBuyer.offerId}
                  className="w-full bg-emerald-400 hover:bg-emerald-300 text-forest-950 font-black text-xs py-2.5 rounded-xl shadow-lg transition-transform active:scale-95"
                >
                  {selectingOfferId === data.recommendedBuyer.offerId ? 'Confirming...' : 'Select This Buyer →'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPARABLE BUYER ROWS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <span>Comparable Buyer Offers</span>
            <Badge variant="outline" className="text-[10px]">
              {filteredEligible.length} Eligible
            </Badge>
          </h4>
          <span className="text-[11px] text-stone-400 font-medium">Sorted by Net Proceeds (High to Low)</span>
        </div>

        {loading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
            <RotateCcw className="w-6 h-6 animate-spin text-emerald-700 mx-auto mb-2" />
            <p className="text-xs font-bold text-stone-600">Calculating real-time route costs and buyer rates...</p>
          </div>
        ) : filteredEligible.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 space-y-2">
            <Info className="w-6 h-6 text-stone-400 mx-auto" />
            <p className="text-xs font-bold text-stone-700">No compatible buyers found matching current filters.</p>
            <p className="text-[11px] text-stone-500">
              Try increasing transit radius or adjusting declared lot weight.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredEligible.map((offer) => {
              const isTop = offer.offerId === data?.recommendedBuyer?.offerId;
              return (
                <div
                  key={offer.offerId}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isTop
                      ? 'bg-emerald-50/40 border-emerald-300 shadow-2xs'
                      : 'bg-white border-stone-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Facility & Location Info */}
                    <div className="md:col-span-5 space-y-1">
                      <div className="flex items-center gap-2">
                        {offer.recommendationRank && (
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                              offer.recommendationRank === 1
                                ? 'bg-emerald-800 text-white'
                                : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            #{offer.recommendationRank}
                          </span>
                        )}
                        <h5 className="font-extrabold text-stone-900 text-sm">{offer.facilityName}</h5>
                      </div>
                      <p className="text-xs text-stone-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        {offer.facilityAddress} ({offer.distanceKm} km away)
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-stone-600">
                        <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Advertised: ₹{offer.buyingPricePerKg}/kg
                        </span>
                        <span>•</span>
                        <span>Min: {formatKg(offer.minQuantityKg)}</span>
                        <span>•</span>
                        <span>Cap: {formatKg(offer.availableCapacityKg)} avail</span>
                      </div>
                    </div>

                    {/* Financial Economics Breakdown */}
                    <div className="md:col-span-4 bg-stone-50 rounded-xl p-3 border border-stone-100 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-stone-500">Gross Sale:</span>
                        <span className="font-bold text-stone-800 font-mono">{formatINR(offer.grossValue)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-stone-500">Est. Transport:</span>
                        <span className="font-bold text-amber-700 font-mono">
                          - {formatINR(offer.transportEstimate.totalTransportCost)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs border-t border-stone-200 pt-1 font-bold">
                        <span className="text-emerald-900">Net Proceeds:</span>
                        <span className="text-emerald-800 font-mono text-sm">{formatINR(offer.netProceeds)}</span>
                      </div>
                      <div className="text-[10px] text-stone-400 text-right">
                        Net ₹{offer.effectiveRatePerKg}/kg effective
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="md:col-span-3 flex flex-col justify-center items-end gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSelectBuyer(offer)}
                        disabled={selectingOfferId === offer.offerId}
                        className={`w-full sm:w-auto text-xs font-bold px-4 ${
                          isTop
                            ? 'bg-forest-900 hover:bg-forest-800 text-white'
                            : 'bg-stone-900 hover:bg-stone-800 text-white'
                        }`}
                      >
                        {selectingOfferId === offer.offerId ? 'Confirming...' : 'Select Buyer →'}
                      </Button>
                      <span className="text-[10px] font-medium text-stone-400">
                        {offer.paymentTerms.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* INCOMPATIBLE BUYERS AUDIT PANEL */}
      {data && data.incompatibleBuyers.length > 0 && (
        <div className="bg-stone-100/70 rounded-2xl p-5 border border-stone-200/80 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-stone-500" />
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Incompatible / Unavailable Facilities ({data.incompatibleBuyers.length})
            </h4>
          </div>
          <p className="text-xs text-stone-500">
            These buyers do not currently meet the requirements of your scrap lot.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {data.incompatibleBuyers.map((ib) => (
              <div key={ib.offerId} className="bg-white rounded-xl p-3 border border-stone-200 text-xs space-y-1">
                <div className="flex justify-between items-start">
                  <span className="font-extrabold text-stone-800">{ib.facilityName}</span>
                  <span className="text-stone-400 font-mono text-[11px]">{ib.distanceKm} km</span>
                </div>
                <div className="text-[11px] text-red-600 font-medium flex items-start gap-1">
                  <span>⚠️</span>
                  <span>{ib.disqualificationReason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
