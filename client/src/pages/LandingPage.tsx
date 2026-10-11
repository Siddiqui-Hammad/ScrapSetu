import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Recycle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Scale,
  FileCheck2,
  TrendingUp,
  MapPin,
  Leaf,
  Users,
  CheckCircle2,
} from 'lucide-react';

interface LandingPageProps {
  setCurrentTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setCurrentTab }) => {
  const { t, language } = useLanguage();
  const { user, demoLoginAs } = useAuth();
  const [impactStats, setImpactStats] = useState<any>(null);

  useEffect(() => {
    api.getPublicImpact().then((res) => {
      if (res.success && res.impact) {
        setImpactStats(res.impact);
      }
    });
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-stone-50 to-stone-50 pt-12 pb-16 md:pt-20 md:pb-24 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/90 text-emerald-900 text-xs font-semibold border border-emerald-200">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>SDG 11 & 12 • Digital Circular Economy Ecosystem</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-950 tracking-tight leading-tight">
                {t.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t.heroSubtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => {
                    if (!user) demoLoginAs('HOUSEHOLD');
                    setCurrentTab('create-pickup');
                  }}
                  className="px-6 py-3.5 rounded-xl font-semibold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-900/10 flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <span>{t.bookPickupBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentTab('rates')}
                  className="px-5 py-3.5 rounded-xl font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 shadow-xs transition-colors flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <span>{t.viewMandiRatesBtn}</span>
                </button>

                <button
                  onClick={() => {
                    demoLoginAs('COLLECTOR');
                    setCurrentTab('collector-dash');
                  }}
                  className="px-5 py-3.5 rounded-xl font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300/60 shadow-xs transition-colors flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-emerald-800" />
                  <span>{t.joinAsCollectorBtn}</span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-stone-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Certified Digital Scales</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Instant UPI or Cash Settlement</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tamper-Proof Digital Receipts</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Card Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-stone-200 relative">
                <div className="absolute -top-3 -right-3 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI-Assisted Engine</span>
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                  Live Scrap Estimation Engine
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-4">
                  Instant Household Scrap Valuation
                </h3>

                <div className="space-y-3">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-stone-900 block">Paper & Cardboard (Raddi)</span>
                      <span className="text-stone-500">Old newspapers & Amazon cartons</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-700">₹14.00 / kg</span>
                      <span className="text-[10px] text-stone-400 block">Mandi Benchmark</span>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-stone-900 block">Rigid Plastics (PET / HDPE)</span>
                      <span className="text-stone-500">Water bottles & beverage jars</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-700">₹18.00 / kg</span>
                      <span className="text-[10px] text-stone-400 block">MRAI Index</span>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-stone-900 block">Scrap Iron & Steel (Loha)</span>
                      <span className="text-stone-500">Old cookware & structural cutoffs</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-700">₹28.00 / kg</span>
                      <span className="text-[10px] text-stone-400 block">Industrial Rate</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-500 block">Est. 25kg Bundle Payout</span>
                    <span className="text-xl font-extrabold text-stone-900">₹445.00</span>
                  </div>
                  <button
                    onClick={() => {
                      if (!user) demoLoginAs('HOUSEHOLD');
                      setCurrentTab('create-pickup');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors"
                  >
                    Schedule Pickup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Impact Counter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-900 text-white rounded-3xl p-8 shadow-xl shadow-emerald-950/20">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Verified Platform Impact</h2>
            <p className="text-emerald-200 text-xs mt-1">
              Real-time numbers aggregated strictly from physical weight slips and digital receipts.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-800/60">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300">
                {impactStats?.verifiedTotals?.totalMaterialCollectedKg || '187.5'} kg
              </div>
              <div className="text-xs text-emerald-100 font-medium mt-1">{t.totalRecycled}</div>
            </div>

            <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-800/60">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300">
                {impactStats?.ecologicalSavings?.co2EquivalentOffsetKg || '265.4'} kg
              </div>
              <div className="text-xs text-emerald-100 font-medium mt-1">{t.co2Averted}</div>
            </div>

            <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-800/60">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300">
                ₹{impactStats?.verifiedTotals?.totalCollectorPayoutsInr || '3,442.50'}
              </div>
              <div className="text-xs text-emerald-100 font-medium mt-1">{t.fairPayouts}</div>
            </div>

            <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-800/60">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300">
                {impactStats?.verifiedTotals?.activeCollectorsCount || '2'}
              </div>
              <div className="text-xs text-emerald-100 font-medium mt-1">{t.activeKabadiwalas}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step How It Works Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
            Complete Circular Loop
          </span>
          <h2 className="text-3xl font-extrabold text-stone-950">How ScrapSetu Works</h2>
          <p className="text-stone-600 text-sm mt-2">
            Solving unfair rates, unreliable pickups, and lack of digital records with a transparent 4-stage pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h4 className="font-bold text-stone-900 text-base">{t.step1Title}</h4>
            <p className="text-xs text-stone-600 leading-relaxed">{t.step1Desc}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h4 className="font-bold text-stone-900 text-base">{t.step2Title}</h4>
            <p className="text-xs text-stone-600 leading-relaxed">{t.step2Desc}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h4 className="font-bold text-stone-900 text-base">{t.step3Title}</h4>
            <p className="text-xs text-stone-600 leading-relaxed">{t.step3Desc}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-lg">
              4
            </div>
            <h4 className="font-bold text-stone-900 text-base">{t.step4Title}</h4>
            <p className="text-xs text-stone-600 leading-relaxed">{t.step4Desc}</p>
          </div>
        </div>
      </section>

      {/* Role Personas Quick Exploration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-100 rounded-3xl p-8 border border-stone-200">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-2xl font-bold text-stone-900">Built for All Stakeholders</h3>
            <p className="text-xs text-stone-600 mt-1">
              Explore dedicated role dashboards built specifically for each user group.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => {
                demoLoginAs('HOUSEHOLD');
                setCurrentTab('household-dash');
              }}
              className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-500 cursor-pointer transition-all shadow-xs hover:shadow-md"
            >
              <div className="text-2xl mb-2">🏠</div>
              <h5 className="font-bold text-stone-900 text-sm">Household User</h5>
              <p className="text-xs text-stone-500 mt-1">
                Schedule door-step pickups, track collector live on map, earn fair value.
              </p>
              <span className="text-xs font-semibold text-emerald-700 mt-3 inline-block">
                Open Dashboard →
              </span>
            </div>

            <div
              onClick={() => {
                demoLoginAs('BUSINESS');
                setCurrentTab('business-dash');
              }}
              className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-500 cursor-pointer transition-all shadow-xs hover:shadow-md"
            >
              <div className="text-2xl mb-2">🏢</div>
              <h5 className="font-bold text-stone-900 text-sm">Commercial Generator</h5>
              <p className="text-xs text-stone-500 mt-1">
                Bulk recurring collections, GST invoices, multi-warehouse management.
              </p>
              <span className="text-xs font-semibold text-emerald-700 mt-3 inline-block">
                Open Dashboard →
              </span>
            </div>

            <div
              onClick={() => {
                demoLoginAs('COLLECTOR');
                setCurrentTab('collector-dash');
              }}
              className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-500 cursor-pointer transition-all shadow-xs hover:shadow-md"
            >
              <div className="text-2xl mb-2">🛺</div>
              <h5 className="font-bold text-stone-900 text-sm">Kabadiwala Terminal</h5>
              <p className="text-xs text-stone-500 mt-1">
                Mobile-first Hindi/English board, digital scale entry, daily ledger.
              </p>
              <span className="text-xs font-semibold text-emerald-700 mt-3 inline-block font-hindi">
                टर्मिनल खोलें →
              </span>
            </div>

            <div
              onClick={() => {
                demoLoginAs('RECYCLER');
                setCurrentTab('recycler-dash');
              }}
              className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-500 cursor-pointer transition-all shadow-xs hover:shadow-md"
            >
              <div className="text-2xl mb-2">🏭</div>
              <h5 className="font-bold text-stone-900 text-sm">Recycling Mill</h5>
              <p className="text-xs text-stone-500 mt-1">
                Post buying rate sheets, issue intake weight slips, ESG traceability.
              </p>
              <span className="text-xs font-semibold text-emerald-700 mt-3 inline-block">
                Open Dashboard →
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
