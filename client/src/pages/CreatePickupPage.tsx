import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { MaterialCategory, Address } from '../types';
import { WasteClassifierModal } from '../components/ai/WasteClassifierModal';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Repeat,
  ArrowRight,
  Info,
} from 'lucide-react';

interface CreatePickupPageProps {
  setCurrentTab: (tab: string) => void;
  setSelectedPickupId: (id: string) => void;
}

export const CreatePickupPage: React.FC<CreatePickupPageProps> = ({
  setCurrentTab,
  setSelectedPickupId,
}) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<string>('Morning (9 AM - 12 PM)');
  const [notes, setNotes] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'WEEKLY' | 'BIWEEKLY' | 'MONTHLY'>('WEEKLY');

  // Items
  const [items, setItems] = useState<
    Array<{
      categoryId: string;
      estimatedQty: number;
      unit: string;
      gradeNotes: string;
      aiPredictedCategory?: string;
      aiConfidence?: number;
    }>
  >([{ categoryId: '', estimatedQty: 15, unit: 'kg', gradeNotes: '' }]);

  // Valuation
  const [valuation, setValuation] = useState<any>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiItemTargetIndex, setAiItemTargetIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    // Fetch categories and user addresses
    api.getRates().then((res) => {
      if (res.success && res.categories) {
        setCategories(res.categories);
        if (res.categories[0]) {
          setItems((prev) => [{ ...prev[0], categoryId: res.categories[0].id }]);
        }
      }
    });

    api.getMe().then((res) => {
      if (res.success && res.user?.addresses) {
        setAddresses(res.user.addresses);
        const def = res.user.addresses.find((a: Address) => a.isDefault) || res.user.addresses[0];
        if (def) setSelectedAddressId(def.id);
      }
    });
  }, []);

  // Update live valuation whenever items change
  useEffect(() => {
    const validItems = items.filter((i) => i.categoryId && i.estimatedQty > 0);
    if (validItems.length > 0) {
      api.estimatePrice(validItems).then((res) => {
        if (res.success) setValuation(res.valuation);
      });
    }
  }, [items]);

  const handleAddItem = () => {
    if (categories.length === 0) return;
    setItems((prev) => [
      ...prev,
      { categoryId: categories[0].id, estimatedQty: 10, unit: 'kg', gradeNotes: '' },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleAiConfirm = (
    categoryId: string,
    aiData: { predictedCategory: string; confidence: number }
  ) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === aiItemTargetIndex
          ? {
              ...item,
              categoryId,
              aiPredictedCategory: aiData.predictedCategory,
              aiConfidence: aiData.confidence,
              gradeNotes: `AI Detected (${Math.round(aiData.confidence * 100)}% conf)`,
            }
          : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedAddressId) {
      setErrorMsg('Please select a pickup address.');
      return;
    }

    if (items.some((i) => !i.categoryId || i.estimatedQty <= 0)) {
      setErrorMsg('Please specify valid categories and quantities.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        addressId: selectedAddressId,
        preferredDate,
        preferredTimeSlot,
        notes,
        isRecurring,
        recurringFrequency: isRecurring ? recurringFrequency : undefined,
        items,
      };

      const res = await api.createPickup(payload);
      if (res.success && res.pickup) {
        setSelectedPickupId(res.pickup.id);
        setCurrentTab('track-pickup');
      } else {
        setErrorMsg(res.message || 'Failed to create pickup request.');
      }
    } catch (err: any) {
      setErrorMsg('An error occurred while creating your pickup.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight">
          {t.createPickupTitle}
        </h1>
        <p className="text-sm text-stone-600 mt-1">{t.createPickupSubtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Address Selection */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">{t.pickupAddress}</h3>
              <p className="text-xs text-stone-500">
                Exact house number remains confidential until accepted by an authorized collector.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {addresses.map((addr) => (
              <label
                key={addr.id}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedAddressId === addr.id
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-200'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs uppercase tracking-wider text-emerald-800">
                    {addr.label}
                  </span>
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="accent-emerald-600"
                  />
                </div>
                <div className="text-xs text-stone-800 font-medium">{addr.streetAddress}</div>
                <div className="text-xs text-stone-500">
                  {addr.city} - {addr.pincode}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Step 2: Date and Time Slot */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Schedule Preferred Time</h3>
              <p className="text-xs text-stone-500">Choose when the collector should arrive</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                {t.preferredDate}
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                {t.preferredTimeSlot}
              </label>
              <select
                value={preferredTimeSlot}
                onChange={(e) => setPreferredTimeSlot(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Morning (9 AM - 12 PM)">Morning (9:00 AM - 12:00 PM)</option>
                <option value="Afternoon (12 PM - 3 PM)">Afternoon (12:00 PM - 3:00 PM)</option>
                <option value="Evening (3 PM - 6 PM)">Evening (3:00 PM - 6:00 PM)</option>
              </select>
            </div>
          </div>

          {/* Business Recurring Option */}
          {user?.role === 'BUSINESS' && (
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                  <Repeat className="w-4 h-4 text-emerald-700" />
                  <span>Setup Recurring Commercial Pickup Schedule</span>
                </div>
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="accent-emerald-600 w-4 h-4"
                />
              </div>

              {isRecurring && (
                <div className="pt-2 border-t border-stone-200 flex items-center gap-4 text-xs">
                  <label className="font-medium text-stone-600">Frequency:</label>
                  {(['WEEKLY', 'BIWEEKLY', 'MONTHLY'] as const).map((freq) => (
                    <label key={freq} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="frequency"
                        checked={recurringFrequency === freq}
                        onChange={() => setRecurringFrequency(freq)}
                        className="accent-emerald-600"
                      />
                      <span>{freq.toLowerCase()}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 3: Material Items & AI Classifier */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">{t.materialsList}</h3>
                <p className="text-xs text-stone-500">Add materials and estimated weights</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl flex items-center gap-1 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addMaterial}</span>
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="p-4 bg-stone-50 rounded-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
              >
                {/* Category Select */}
                <div className="sm:col-span-5">
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    Material Category
                  </label>
                  <select
                    value={item.categoryId}
                    onChange={(e) => handleItemChange(index, 'categoryId', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.hindiName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Estimated Qty */}
                <div className="sm:col-span-3">
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    Est. Qty (kg)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={item.estimatedQty}
                    onChange={(e) =>
                      handleItemChange(index, 'estimatedQty', Math.max(1, Number(e.target.value)))
                    }
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                  />
                </div>

                {/* AI Classifier Trigger & Delete */}
                <div className="sm:col-span-4 flex items-center gap-2 pt-4 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      setAiItemTargetIndex(index);
                      setIsAiModalOpen(true);
                    }}
                    className="flex-1 py-2 px-2 text-xs font-semibold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 rounded-xl flex items-center justify-center gap-1 transition-colors"
                    title="Run image vision classifier"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>AI Vision</span>
                  </button>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-2 text-stone-400 hover:text-red-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {item.gradeNotes && (
                  <div className="sm:col-span-12 text-[11px] text-emerald-700 font-medium">
                    ✓ {item.gradeNotes}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Pickup Instructions / Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Bundles kept near garage, please ring calling bell twice..."
              className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Live Indicative Valuation Summary */}
        {valuation && (
          <div className="bg-emerald-900 text-white rounded-3xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 block">
                  Indicative Valuation Preview
                </span>
                <h4 className="text-xl font-bold">
                  Estimated Total: ₹{valuation.totalEstimatedValue} ({valuation.totalEstimatedWeightKg} kg)
                </h4>
              </div>
              <span className="text-xs bg-emerald-800 px-3 py-1 rounded-full text-emerald-200 font-medium">
                Fair Market Mandi Benchmark
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-emerald-950/40 p-4 rounded-2xl border border-emerald-800">
              {valuation.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-emerald-800/40">
                  <span>
                    {item.categoryName} ({item.estimatedQty} kg):
                  </span>
                  <span className="font-bold text-emerald-300">
                    ₹{item.indicativeEstimatedValue} (₹{item.effectiveRatePerUnit}/kg)
                  </span>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-emerald-200/90 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{t.rateDisclaimer}</span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-700 text-xs rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setCurrentTab('household-dash')}
            className="px-5 py-3 text-xs font-medium text-stone-600 hover:text-stone-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-2xl shadow-md transition-all flex items-center gap-2"
          >
            <span>{isSubmitting ? 'Confirming Booking...' : t.submitPickupBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* AI Vision Modal */}
      <WasteClassifierModal
        categories={categories}
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onConfirmCategory={handleAiConfirm}
      />
    </div>
  );
};
