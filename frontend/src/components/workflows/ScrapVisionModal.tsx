'use client';

import React, { useState } from 'react';
import { Camera, Sparkles, Upload, CheckCircle2, AlertTriangle, ArrowRight, X, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { apiClient } from '../../lib/api-client';
import { ScrapVisionPrediction } from '../../types';

interface ScrapVisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptPrediction?: (prediction: ScrapVisionPrediction) => void;
  onConfirmCategory?: (prediction: ScrapVisionPrediction) => void;
  onConfirmPrediction?: (prediction: ScrapVisionPrediction) => void;
}

export const ScrapVisionModal: React.FC<ScrapVisionModalProps> = ({
  isOpen,
  onClose,
  onAcceptPrediction,
  onConfirmCategory,
  onConfirmPrediction,
}) => {
  const [selectedSample, setSelectedSample] = useState<string>('plastic-bottles.jpg');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Exact breakdown matching Mockup Row 3 Panel 1:
  // Plastic 72%, Aluminium 18%, Paper 7%, Others 3%
  const [breakdown, setBreakdown] = useState([
    { name: 'Plastic', pct: 72, color: 'bg-emerald-500' },
    { name: 'Aluminium', pct: 18, color: 'bg-blue-500' },
    { name: 'Paper', pct: 7, color: 'bg-amber-500' },
    { name: 'Others', pct: 3, color: 'bg-zinc-400' },
  ]);

  const [prediction, setPrediction] = useState<ScrapVisionPrediction>({
    categorySlug: 'rigid-plastics',
    categoryName: 'Plastic (Grade A PET)',
    hindiName: 'प्लास्टिक की बोतलें',
    confidence: 0.72,
    suggestedGrade: 'Grade A Optical Clear',
    estimatedPriceRange: { min: 25, max: 45, unit: 'kg' },
    explanation: 'High transparency polymer detected with characteristic resin code 1. Clean condition suitable for direct pelletizing.',
    isExternalAiUsed: false,
    requiresUserConfirmation: true,
  });

  if (!isOpen) return null;

  const handleRetake = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 600);
  };

  const handleUseResult = () => {
    if (onAcceptPrediction) onAcceptPrediction(prediction);
    if (onConfirmPrediction) onConfirmPrediction(prediction);
    if (onConfirmCategory) onConfirmCategory(prediction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-5 animate-in fade-in-0 zoom-in-95">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-forest-900 text-emerald-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-zinc-950 text-base">ScrapVision™ AI</h3>
              <p className="text-[11px] text-zinc-500 font-medium">
                Deep neural material classification &amp; purity estimation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera / Image Scan Preview Box - Exact Match to Mockup */}
        <div className="relative rounded-2xl overflow-hidden bg-zinc-900 h-44 border border-zinc-800 flex items-center justify-center group">
          {/* Decorative Optical Target Overlay */}
          <div className="absolute inset-4 border-2 border-dashed border-emerald-400/60 rounded-xl pointer-events-none flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-emerald-400 rounded-lg flex items-center justify-center bg-emerald-500/10">
              <Camera className="w-6 h-6 text-emerald-400" />
            </div>
          </div>

          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-emerald-300 font-bold border border-emerald-500/30">
            SCANNING FRAME: 1080P RGB
          </div>

          <div className="absolute bottom-3 right-3 bg-emerald-500 text-forest-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            High Confidence
          </div>
        </div>

        {/* Breakdown Progress Bars - Exact Match to Mockup: Plastic 72%, Aluminium 18%, Paper 7%, Others 3% */}
        <div className="space-y-2.5 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
            <span>Material Composition Breakdown</span>
            <span className="text-forest-900 font-mono">Top: Plastic (72%)</span>
          </div>

          <div className="space-y-2">
            {breakdown.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-zinc-600">
                  <span>{item.name}</span>
                  <span className="font-mono font-bold">{item.pct}%</span>
                </div>
                <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-500`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & Purity Callout */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
          <div>
            <div className="font-extrabold text-emerald-950">Grade A PET (Clean Optical)</div>
            <div className="text-[11px] text-emerald-800">Est. Mandi Rate: ₹25 - ₹45 / kg</div>
          </div>
          <div className="text-right font-mono font-bold text-emerald-900 text-sm">
            ₹35.00 avg
          </div>
        </div>

        {/* Action Buttons: Retake & Use This Result - Exact Match to Mockup */}
        <div className="flex items-center gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={handleRetake}
            className="flex-1 border-zinc-300 text-zinc-700 font-bold text-xs h-11 rounded-xl"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>Retake</span>
          </Button>

          <Button
            type="button"
            onClick={handleUseResult}
            className="flex-1 bg-forest-900 hover:bg-forest-950 text-white font-black text-xs h-11 rounded-xl shadow-md"
          >
            <span>Use This Result</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
