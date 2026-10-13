'use client';

import React, { useState } from 'react';
import { Camera, Sparkles, Upload, CheckCircle2, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { apiClient } from '../../lib/api-client';
import { ScrapVisionPrediction } from '../../types';

interface ScrapVisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCategory?: (prediction: ScrapVisionPrediction) => void;
  onConfirmPrediction?: (prediction: ScrapVisionPrediction) => void;
}

export const ScrapVisionModal: React.FC<ScrapVisionModalProps> = ({
  isOpen,
  onClose,
  onConfirmCategory,
  onConfirmPrediction,
}) => {
  const [selectedSample, setSelectedSample] = useState<string>('cardboard-boxes.jpg');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<ScrapVisionPrediction | null>(null);

  if (!isOpen) return null;

  const sampleScraps = [
    { label: '📦 Cardboard & Packaging', filename: 'carton-packaging-cardboard.jpg', slug: 'paper-cardboard' },
    { label: '🍾 Crushed PET Bottles', filename: 'plastic-water-bottles.jpg', slug: 'rigid-plastics' },
    { label: '🔩 Heavy Scrap Iron', filename: 'rusty-steel-iron-angle.jpg', slug: 'ferrous-metals' },
    { label: '🔌 Copper Cables / Wire', filename: 'copper-cable-wire-strands.jpg', slug: 'non-ferrous-metals' },
    { label: '💻 Motherboard / E-Waste', filename: 'electronic-pcb-e-waste.jpg', slug: 'e-waste' },
  ];

  const handleRunAnalysis = async (filename: string) => {
    setSelectedSample(filename);
    setIsAnalyzing(true);
    setPrediction(null);

    try {
      const res = await apiClient.ai.classifySample(filename);
      if (res.success && res.classification) {
        setPrediction(res.classification);
      }
    } catch (err) {
      console.error('ScrapVision analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in-0 zoom-in-95">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">ScrapVision™ AI Classifier</h3>
              <p className="text-[11px] text-stone-500 font-medium">
                Dual-tier optical material identification with live mandi valuation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Upload or Sample Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-stone-700 block">
            Choose Sample Scrap Photo to Identify:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sampleScraps.map((s) => (
              <button
                key={s.filename}
                type="button"
                onClick={() => handleRunAnalysis(s.filename)}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                  selectedSample === s.filename
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500'
                    : 'bg-stone-50/70 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {isAnalyzing && (
          <div className="p-8 text-center space-y-2 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
            <div className="w-8 h-8 rounded-full border-3 border-emerald-600 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-bold text-stone-700">Analyzing scrap optical characteristics...</p>
            <p className="text-[11px] text-stone-500">Checking polymer density, metallic sheen & Mandi index</p>
          </div>
        )}

        {/* AI Result Card */}
        {prediction && !isAnalyzing && (
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Predicted Category
              </span>
              <Badge variant="success">
                {(prediction.confidence * 100).toFixed(0)}% AI Confidence
              </Badge>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <h4 className="text-lg font-extrabold text-stone-900">{prediction.categoryName}</h4>
                <p className="text-xs text-stone-600 font-hindi">{prediction.hindiName}</p>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-emerald-900">
                  ₹{prediction.estimatedPriceRange.min} - ₹{prediction.estimatedPriceRange.max} / {prediction.estimatedPriceRange.unit}
                </div>
                <div className="text-[10px] text-stone-500">Indicative Mandi Benchmark</div>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed bg-white/80 p-2.5 rounded-xl border border-emerald-100">
              💡 <b>Explanation:</b> {prediction.explanation}
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-stone-500">Grade: {prediction.suggestedGrade}</span>
              <Button
                size="sm"
                variant="default"
                onClick={() => {
                  if (onConfirmPrediction) onConfirmPrediction(prediction);
                  if (onConfirmCategory) onConfirmCategory(prediction);
                  onClose();
                }}
              >
                <span>Accept & Add to Booking</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}

        <div className="text-center">
          <p className="text-[10px] text-stone-400">
            ⚠️ AI predictions are assistive estimations. Requesters can manually adjust categories anytime.
          </p>
        </div>
      </div>
    </div>
  );
};
