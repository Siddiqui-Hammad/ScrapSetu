import React, { useState } from 'react';
import { api } from '../../services/api';
import { MaterialCategory } from '../../types';
import {
  Sparkles,
  Upload,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Camera,
  X,
  ArrowRight,
} from 'lucide-react';

interface WasteClassifierModalProps {
  categories: MaterialCategory[];
  isOpen: boolean;
  onClose: () => void;
  onConfirmCategory: (categoryId: string, aiData: { predictedCategory: string; confidence: number }) => void;
}

export const WasteClassifierModal: React.FC<WasteClassifierModalProps> = ({
  categories,
  isOpen,
  onClose,
  onConfirmCategory,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sampleDescriptor, setSampleDescriptor] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [confirmedSlug, setConfirmedSlug] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleClassify = async (overrideDescriptor?: string) => {
    setIsLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const descriptorToUse = overrideDescriptor || sampleDescriptor;
      let res;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('wasteImage', selectedFile);
        res = await api.classifyWaste(formData);
      } else if (descriptorToUse) {
        res = await api.classifyWaste({ sampleName: descriptorToUse });
      } else {
        setErrorMsg('Please select an image file or choose one of the sample test materials.');
        setIsLoading(false);
        return;
      }

      if (res.success && res.classification) {
        setResult(res.classification);
        setConfirmedSlug(res.classification.categorySlug);
      } else {
        setErrorMsg(res.message || 'Classification service failed. Please choose category manually.');
      }
    } catch (err: any) {
      setErrorMsg('Classification service unavailable. Please select your category manually.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!confirmedSlug) return;
    const cat = categories.find((c) => c.slug === confirmedSlug);
    if (cat) {
      onConfirmCategory(cat.id, {
        predictedCategory: result?.categoryName || cat.name,
        confidence: result?.confidence || 0.9,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900">AI Material Vision Classifier</h3>
            <p className="text-xs text-stone-500">
              Explainable neural vision model with explicit confirmation safeguard.
            </p>
          </div>
        </div>

        {/* Quick Demo Pre-sets */}
        <div className="mt-4 mb-3">
          <label className="text-xs font-semibold text-stone-700 block mb-1.5">
            College Demo: Instant Visual Samples
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'PET Water Bottles', query: 'plastic pet water bottles' },
              { label: 'Cardboard & Old Raddi', query: 'newspaper and cardboard raddi boxes' },
              { label: 'Iron Rods & Utensils', query: 'heavy scrap iron rods and steel' },
              { label: 'Copper Wire & Cables', query: 'copper wire stripping and brass fittings' },
              { label: 'Broken Laptop & PCB', query: 'computer circuit board and charger e-waste' },
            ].map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => {
                  setSampleDescriptor(sample.query);
                  setSelectedFile(null);
                  handleClassify(sample.query);
                }}
                className="text-xs px-2.5 py-1 rounded-full bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 text-stone-700 border border-stone-200 transition-colors"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* File Upload Box */}
        <div className="my-3">
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Or upload photo from camera / storage:
          </label>
          <label className="border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-stone-50 transition-colors">
            <Camera className="w-6 h-6 text-stone-400 mb-1" />
            <span className="text-xs text-stone-600 font-medium">
              {selectedFile ? selectedFile.name : 'Click to snap photo or select file'}
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5">JPEG, PNG, WebP (Max 8MB)</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setSelectedFile(e.target.files[0]);
                  setSampleDescriptor('');
                }
              }}
            />
          </label>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-start gap-2 mb-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Classification Result Card */}
        {result && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Predicted Category
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                {Math.round(result.confidence * 100)}% Confidence
              </span>
            </div>

            <div className="text-base font-bold text-emerald-950">
              {result.categoryName}{' '}
              <span className="text-xs font-normal text-emerald-700 font-hindi">
                ({result.hindiName})
              </span>
            </div>

            <p className="text-xs text-stone-600 italic bg-white/70 p-2 rounded-lg border border-emerald-100">
              "{result.explanation}"
            </p>

            <div className="text-xs text-stone-700 flex justify-between pt-1 border-t border-emerald-200/60">
              <span>Suggested Grade: <b>{result.suggestedGrade}</b></span>
              <span>
                Benchmark: ₹{result.estimatedPriceRange.min} - ₹{result.estimatedPriceRange.max} /{' '}
                {result.estimatedPriceRange.unit}
              </span>
            </div>

            {/* Mandatory User Confirmation Safeguard */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-stone-800 block mb-1">
                Confirm or Override Category:
              </label>
              <select
                value={confirmedSlug}
                onChange={(e) => setConfirmedSlug(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-emerald-300 bg-white text-stone-900 font-medium focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name} ({c.hindiName})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
          >
            Cancel
          </button>

          {!result ? (
            <button
              type="button"
              disabled={isLoading || (!selectedFile && !sampleDescriptor)}
              onClick={() => handleClassify()}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Analyzing Materials...' : 'Run Vision Classifier'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>Accept & Apply to Request</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
