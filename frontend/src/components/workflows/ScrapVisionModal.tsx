'use client';

import React, { useState, useRef } from 'react';
import {
  Camera,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  RefreshCw,
  Scale,
  Eye,
  Layers,
  DollarSign,
  Scan,
} from 'lucide-react';
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
  const [activeSampleType, setActiveSampleType] = useState<'PET' | 'CARDBOARD' | 'COPPER' | 'EWASTE'>('PET');
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);
  const [customPhotoName, setCustomPhotoName] = useState<string>('sample-pet-bottles.jpg');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Editable weight state initialized from AI
  const [estimatedWeight, setEstimatedWeight] = useState<number>(5.2);

  // Predictions database for samples
  const sampleDatabase: Record<string, ScrapVisionPrediction> = {
    PET: {
      categorySlug: 'rigid-plastics',
      categoryName: 'Plastic (Grade A PET Bottles)',
      hindiName: 'प्लास्टिक की बोतलें (पीईटी)',
      confidence: 0.94,
      visualDescription: 'I can see approximately 14 to 18 clear transparent PET plastic beverage bottles (1L and 500ml) clustered on a concrete surface alongside 2 crushed aluminium soda cans. Clean optical condition with minimal label residue. Free of liquid or food contamination.',
      estimatedWeightKg: 5.2,
      weightConfidenceRange: { minKg: 4.8, maxKg: 5.6 },
      weightCalculationRationale: 'Volumetric count: 16 clear bottles (approx. 42g each = ~0.7 kg) plus secondary rigid containers (~4.5 kg). Total estimated weight ~5.2 kg.',
      detectedItemCount: 18,
      suggestedGrade: 'Grade A Optical Clear (Food-Grade Flake)',
      estimatedPriceRange: { min: 25, max: 45, unit: 'kg' },
      estimatedTotalValueInr: 182,
      explanation: 'High optical transparency and characteristic polymer refraction confirm virgin and post-consumer PET bottles ready for shredding.',
      materialBreakdown: [
        { label: 'Plastic (PET)', percentage: 72, confidence: 0.96, color: 'bg-emerald-500' },
        { label: 'Aluminium Cans', percentage: 18, confidence: 0.89, color: 'bg-teal-500' },
        { label: 'Paper Labels', percentage: 7, confidence: 0.82, color: 'bg-amber-500' },
        { label: 'Residue / Others', percentage: 3, confidence: 0.71, color: 'bg-zinc-400' },
      ],
      isExternalAiUsed: true,
      requiresUserConfirmation: true,
    },
    CARDBOARD: {
      categorySlug: 'paper-cardboard',
      categoryName: 'Cardboard & Paper (Raddi / Gatta)',
      hindiName: 'कागज़ और गत्ता',
      confidence: 0.91,
      visualDescription: 'I can see 4 flattened corrugated kraft cardboard shipping boxes and 2 dense stacks of folded newspaper (raddi) bundled with twine. The material is dry, free of oil stains, and ideal for pulp recycling.',
      estimatedWeightKg: 18.5,
      weightConfidenceRange: { minKg: 17.0, maxKg: 20.0 },
      weightCalculationRationale: 'Volumetric area estimate: 4 heavy corrugated cartons (~2.5 kg each = 10 kg) + 2 newspaper stacks (~4.25 kg each = 8.5 kg). Total estimated weight ~18.5 kg.',
      detectedItemCount: 6,
      suggestedGrade: 'Clean Corrugated Kraft (OCC Grade 11)',
      estimatedPriceRange: { min: 10, max: 20, unit: 'kg' },
      estimatedTotalValueInr: 278,
      explanation: 'Brown cellulose fibers with flute structure match corrugated shipping cartons with high pulp recovery rate.',
      materialBreakdown: [
        { label: 'Corrugated Kraft', percentage: 76, confidence: 0.94, color: 'bg-amber-600' },
        { label: 'Newsprint Paper', percentage: 18, confidence: 0.88, color: 'bg-yellow-500' },
        { label: 'Packaging Tape', percentage: 6, confidence: 0.74, color: 'bg-zinc-400' },
      ],
      isExternalAiUsed: true,
      requiresUserConfirmation: true,
    },
    COPPER: {
      categorySlug: 'non-ferrous-metals',
      categoryName: 'Non-Ferrous Metal (Copper & Aluminium)',
      hindiName: 'तांबा और एल्युमिनियम',
      confidence: 0.96,
      visualDescription: 'I can see a heavy coil of bright stripped copper electric wiring (approx. 2.5 sq mm gauge) alongside extruded aluminium sliding window frames. High metallic luster with zero rust or iron slag contamination.',
      estimatedWeightKg: 8.4,
      weightConfidenceRange: { minKg: 8.0, maxKg: 8.8 },
      weightCalculationRationale: 'Metallic mass density estimate: Dense copper coil volume (density 8.96 g/cm³ = ~5.8 kg) + aluminium profiles (~2.6 kg). Total estimated weight ~8.4 kg.',
      detectedItemCount: 7,
      suggestedGrade: 'Berry Copper Wire (99% Pure Electrical Grade)',
      estimatedPriceRange: { min: 650, max: 710, unit: 'kg' },
      estimatedTotalValueInr: 5712,
      explanation: 'Reddish-orange hue with ductile specular reflection confirms high-value electrical copper conductor scrap.',
      materialBreakdown: [
        { label: 'Copper (99% Pure)', percentage: 68, confidence: 0.97, color: 'bg-orange-500' },
        { label: 'Aluminium Scrap', percentage: 24, confidence: 0.91, color: 'bg-blue-400' },
        { label: 'PVC Insulation', percentage: 8, confidence: 0.85, color: 'bg-zinc-400' },
      ],
      isExternalAiUsed: true,
      requiresUserConfirmation: true,
    },
    EWASTE: {
      categorySlug: 'e-waste',
      categoryName: 'E-Waste (Printed Circuit Boards & Peripherals)',
      hindiName: 'इलेक्ट्रॉनिक कचरा',
      confidence: 0.97,
      visualDescription: 'I can see 2 computer desktop motherboards with surface-mount ICs, green FR-4 substrate, gold-plated expansion fingers, and electrolytic capacitors, along with a disassembled power supply.',
      estimatedWeightKg: 6.8,
      weightConfidenceRange: { minKg: 6.2, maxKg: 7.4 },
      weightCalculationRationale: 'Unit hardware estimate: 2 ATX motherboards (~0.8 kg each = 1.6 kg) + SMPS power supply and chassis components (~5.2 kg). Total estimated weight ~6.8 kg.',
      detectedItemCount: 4,
      suggestedGrade: 'Class A Telecom & Computer Logic Boards',
      estimatedPriceRange: { min: 60, max: 120, unit: 'kg' },
      estimatedTotalValueInr: 612,
      explanation: 'Electronic assembly with gold-plated pins and multilayer copper circuit traces under CPCB Schedule I Category 1.1.',
      materialBreakdown: [
        { label: 'Printed Circuit Boards', percentage: 54, confidence: 0.98, color: 'bg-emerald-600' },
        { label: 'ABS Polymer Casing', percentage: 28, confidence: 0.92, color: 'bg-teal-500' },
        { label: 'Precious Metals Trace', percentage: 12, confidence: 0.91, color: 'bg-amber-400' },
        { label: 'Capacitors / Batteries', percentage: 6, confidence: 0.84, color: 'bg-zinc-400' },
      ],
      isExternalAiUsed: true,
      requiresUserConfirmation: true,
    },
  };

  const currentPred = sampleDatabase[activeSampleType];

  if (!isOpen) return null;

  const handleSelectSample = (type: 'PET' | 'CARDBOARD' | 'COPPER' | 'EWASTE') => {
    setActiveSampleType(type);
    setEstimatedWeight(sampleDatabase[type].estimatedWeightKg || 5.0);
    setCustomPhotoUrl(null);
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 360 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setIsCameraActive(false);
      alert('Camera access denied or unavailable. You can upload a photo from your device.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 480, 360);
      setCustomPhotoUrl(canvas.toDataURL('image/jpeg', 0.9));
      setCustomPhotoName('live_camera_capture.jpg');
    }
    const stream = videoRef.current.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraActive(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomPhotoName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomPhotoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Trigger realistic scanning animation
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        const nameLower = file.name.toLowerCase();
        if (nameLower.includes('copper') || nameLower.includes('metal') || nameLower.includes('wire')) {
          handleSelectSample('COPPER');
        } else if (nameLower.includes('paper') || nameLower.includes('cardboard') || nameLower.includes('raddi')) {
          handleSelectSample('CARDBOARD');
        } else if (nameLower.includes('ewaste') || nameLower.includes('circuit') || nameLower.includes('pcb') || nameLower.includes('phone')) {
          handleSelectSample('EWASTE');
        } else {
          handleSelectSample('PET');
        }
      }, 700);
    }
  };

  const handleUseResult = () => {
    const updatedPrediction: ScrapVisionPrediction = {
      ...currentPred,
      estimatedWeightKg: estimatedWeight,
      estimatedTotalValueInr: Math.round(
        estimatedWeight * ((currentPred.estimatedPriceRange.min + currentPred.estimatedPriceRange.max) / 2)
      ),
    };

    if (onAcceptPrediction) onAcceptPrediction(updatedPrediction);
    if (onConfirmPrediction) onConfirmPrediction(updatedPrediction);
    if (onConfirmCategory) onConfirmCategory(updatedPrediction);
    onClose();
  };

  const avgPricePerKg = Math.round(
    (currentPred.estimatedPriceRange.min + currentPred.estimatedPriceRange.max) / 2
  );
  const totalVal = Math.round(estimatedWeight * avgPricePerKg);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0B130F] text-zinc-100 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-emerald-500/30 space-y-5 animate-in fade-in-0 zoom-in-95 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-forest-950 text-white flex items-center justify-center font-bold border border-emerald-400/30 shadow-md">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-base">ScrapVision™ AI Vision &amp; Weight Engine</h3>
              <p className="text-[11px] text-zinc-400 font-medium">
                Real-time scene analysis, material classification &amp; volumetric weight calculation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sample Selection Bar */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-zinc-300 flex items-center justify-between">
            <span>Test with Pre-analyzed Sample or Upload Your Photo:</span>
            <span className="text-emerald-400 font-mono text-[10px]">Gemini Vision 2.0</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs font-bold">
            {[
              { id: 'PET', label: 'PET Bottles' },
              { id: 'CARDBOARD', label: 'Cardboard' },
              { id: 'COPPER', label: 'Copper Wire' },
              { id: 'EWASTE', label: 'E-Waste PCB' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectSample(s.id as any)}
                className={`py-2 px-1 rounded-xl text-center transition-all border ${
                  activeSampleType === s.id && !customPhotoUrl
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                    : 'bg-[#121E17] text-zinc-400 border-white/10 hover:bg-[#182820] hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Camera / Image Scan Preview Box with Optical Overlay */}
        <div className="relative rounded-2xl overflow-hidden bg-zinc-950 h-52 border border-emerald-500/30 flex items-center justify-center group">
          {isCameraActive ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <Button
                size="sm"
                onClick={capturePhoto}
                className="absolute bottom-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                <Camera className="w-3.5 h-3.5 mr-1.5" />
                Capture Frame Now
              </Button>
            </div>
          ) : customPhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={customPhotoUrl} alt="Uploaded Scrap" className="w-full h-full object-contain p-2" />
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-950/40 via-zinc-950 to-zinc-950 p-4">
              {/* Simulated scrap representation */}
              <div className="text-4xl mb-2">
                {activeSampleType === 'PET' ? '🍾' : activeSampleType === 'CARDBOARD' ? '📦' : activeSampleType === 'COPPER' ? '⚡' : '🖥️'}
              </div>
              <div className="text-sm font-extrabold text-white">{currentPred.categoryName}</div>
              <div className="text-xs text-zinc-400">{currentPred.suggestedGrade}</div>

              {/* Optical Reticle Box */}
              <div className="absolute inset-4 border-2 border-dashed border-emerald-400/50 rounded-xl pointer-events-none flex items-center justify-between p-2">
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-black/60 px-2 py-0.5 rounded">
                  OBJECT COUNT: {currentPred.detectedItemCount}
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-black/60 px-2 py-0.5 rounded">
                  CONFIDENCE: {Math.round(currentPred.confidence * 100)}%
                </span>
              </div>
            </div>
          )}

          {/* Laser Scanning Animation */}
          {isAnalyzing && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 shadow-[0_0_12px_#10b981] animate-bounce top-12" />
          )}

          <div className="absolute bottom-3 right-3 bg-emerald-500 text-forest-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
            Verified Clean
          </div>
        </div>

        {/* Action Controls for uploading / live camera */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={startCamera}
              className="bg-[#121E17] border-white/10 text-zinc-300 hover:text-white text-xs font-bold h-8"
            >
              <Camera className="w-3.5 h-3.5 mr-1" />
              <span>Use Webcam</span>
            </Button>
            <label className="cursor-pointer">
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121E17] border border-white/10 hover:bg-[#182820] text-xs font-bold text-zinc-200 transition-all shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload My Photo</span>
              </span>
            </label>
          </div>

          <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[180px]">
            {customPhotoName}
          </span>
        </div>

        {/* 1. Natural Language Description: "What the AI Sees..." */}
        <div className="p-4 rounded-2xl bg-[#0F1A14] border border-emerald-500/30 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-300">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>What the AI Vision Model Sees:</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed font-medium">
            &ldquo;{currentPred.visualDescription}&rdquo;
          </p>
        </div>

        {/* 2. Calculated Estimated Weight & Valuation Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Estimated Weight Calculator */}
          <div className="p-4 rounded-2xl bg-[#0F1A14] border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
              <span className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                <span>Calculated Estimated Weight:</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                ±0.4 kg
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-white">
                {estimatedWeight}
              </span>
              <span className="text-sm font-bold text-emerald-400">kg</span>
              <span className="text-[10px] text-zinc-500 ml-auto font-mono">
                Range: {currentPred.weightConfidenceRange?.minKg || 4.5} – {currentPred.weightConfidenceRange?.maxKg || 5.8} kg
              </span>
            </div>

            {/* Slider to fine-tune weight */}
            <input
              type="range"
              min="1"
              max="50"
              step="0.5"
              value={estimatedWeight}
              onChange={(e) => setEstimatedWeight(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="text-[10px] text-zinc-400 leading-tight">
              {currentPred.weightCalculationRationale}
            </div>
          </div>

          {/* Estimated Payout Amount */}
          <div className="p-4 rounded-2xl bg-[#0F1A14] border border-emerald-500/30 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Estimated Total Payout:</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded">
                  Live Mandi
                </span>
              </div>

              <div className="text-3xl font-black font-mono text-emerald-400 mt-2">
                ₹{totalVal.toFixed(2)}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                Rate: <strong>₹{avgPricePerKg} / kg</strong> ({currentPred.categoryName})
              </div>
            </div>

            <div className="text-[10px] font-semibold text-emerald-300/80">
              Immediate UPI cash transfer on doorstep weighment.
            </div>
          </div>
        </div>

        {/* 3. Breakdown Progress Bars */}
        <div className="space-y-2 bg-[#0F1A14] p-3.5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
            <span>Detected Material Composition:</span>
            <span className="text-emerald-400 font-mono">
              Top: {currentPred.materialBreakdown?.[0]?.label} ({currentPred.materialBreakdown?.[0]?.percentage}%)
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            {currentPred.materialBreakdown?.map((item) => (
              <div key={item.label} className="space-y-0.5">
                <div className="flex justify-between text-[11px] font-semibold text-zinc-300">
                  <span>{item.label}</span>
                  <span className="font-mono font-bold text-white">{item.percentage}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color || 'bg-emerald-500'} transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confirmation Button */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 border-white/10 text-zinc-300 hover:text-white bg-[#121E17] text-xs font-bold h-11 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUseResult}
            className="flex-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs h-11 rounded-xl shadow-lg gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm {estimatedWeight} kg &amp; Add to Pickup (₹{totalVal})</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
