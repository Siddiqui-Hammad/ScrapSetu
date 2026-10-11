import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Recycle,
  CheckCircle2,
  Scale,
  FileCheck2,
  ShieldCheck,
  Truck,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface HowItWorksPageProps {
  setCurrentTab: (tab: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ setCurrentTab }) => {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          The ScrapSetu Operational Model
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
          How ScrapSetu Transforms India's Informal Recycling Sector
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          Over 90% of India's post-consumer recyclables are gathered by informal kabadiwalas. ScrapSetu bridges the trust and technology gap without displacing traditional livelihoods.
        </p>
      </div>

      {/* 4 Deep Dive Pillars */}
      <div className="space-y-8">
        {/* Pillar 1 */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-extrabold text-2xl shrink-0">
            1
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-stone-900">
              Household Booking & AI Material Classification
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Users schedule door-step scrap pickups by selecting items or uploading a photo. ScrapSetu's AI Vision Classifier predicts material categories with confidence ratings and baseline indicative mandi valuations, preventing lowballing before the collector even arrives.
            </p>
            <div className="text-xs text-blue-700 font-semibold flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Full address privacy protection until an authorized collector accepts.</span>
            </div>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-2xl shrink-0">
            2
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-stone-900">
              Smart Geolocation Matching & Route Optimization
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Instead of middleman cartels, pickups are broadcasted to verified local collectors within an 8km perimeter. Our transparent scoring engine evaluates proximity, vehicle capacity, and reliability rating. Accepted pickups are automatically sequenced using evaluated Traveling Salesperson (TSP) algorithms, saving travel distance and fuel.
            </p>
            <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Low-literacy mobile terminal with Hindi voice/visual prompts.</span>
            </div>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-extrabold text-2xl shrink-0">
            3
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-stone-900">
              Calibrated Digital Scales & Mutual Verification
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Traditional faulty mechanical scales are replaced by certified digital scale entry. The collector and household mutually confirm the net kilogram weight and agreed rate per item on-site.
            </p>
            <div className="text-xs text-amber-700 font-semibold flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Controlled state machine prevents double acceptance or skipped weighing steps.</span>
            </div>
          </div>
        </div>

        {/* Pillar 4 */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-extrabold text-2xl shrink-0">
            4
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-stone-900">
              Tamper-Proof Receipts & Recycler Inbound Traceability
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Every completed transaction generates a digital receipt secured with an immutable SHA-256 cryptographic hash. The recovered scrap is aggregated and delivered to accredited recycling facilities with weightbridge intake slips, closing the circular loop.
            </p>
            <div className="text-xs text-purple-700 font-semibold flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Automated environmental impact accounting (CO₂e, Trees, Water).</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-8 bg-emerald-900 text-white rounded-3xl text-center space-y-4">
        <h3 className="text-2xl font-bold">Ready to Experience ScrapSetu?</h3>
        <p className="text-xs sm:text-sm text-emerald-200 max-w-xl mx-auto">
          Start as a household recycler or test collector operations using our 1-click College Demo switcher at the top of the screen.
        </p>
        <button
          onClick={() => setCurrentTab('rates')}
          className="px-6 py-3 bg-white text-emerald-950 font-semibold rounded-xl hover:bg-emerald-100 transition-colors text-xs"
        >
          Explore Live Mandi Benchmark Rates →
        </button>
      </div>
    </div>
  );
};
