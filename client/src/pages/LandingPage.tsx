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
  Zap,
  Droplets,
  TreePine,
  ShieldAlert,
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
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-forest-900 to-stone-950 pt-16 pb-20 md:pt-24 md:pb-28 text-white">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <Leaf className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>SDG 11 & 12 • Smart India Hackathon Live Platform</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                {t.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                {t.heroSubtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => {
                    if (!user) demoLoginAs('HOUSEHOLD');
                    setCurrentTab('create-pickup');
                  }}
                  className="px-6 py-4 rounded-2xl font-bold text-emerald-950 bg-emerald-300 hover:bg-emerald-200 shadow-lg shadow-emerald-950/40 flex items-center gap-2.5 transition-all hover:scale-[1.02]"
                >
                  <span>{t.bookPickupBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentTab('rates')}
                  className="px-5 py-4 rounded-2xl font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-300" />
                  <span>{t.viewMandiRatesBtn}</span>
                </button>

                <button
                  onClick={() => {
                    demoLoginAs('COLLECTOR');
                    setCurrentTab('collector-dash');
                  }}
                  className="px-5 py-4 rounded-2xl font-semibold text-emerald-200 bg-emerald-800/80 hover:bg-emerald-800 border border-emerald-700/60 transition-all flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-emerald-300" />
                  <span className="font-hindi">{t.joinAsCollectorBtn}</span>
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-emerald-200/80">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Certified Digital Spring Scales</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Instant UPI / Cash Payout</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>SHA-256 Tamper-Proof Receipts</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Card Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/20 text-stone-900 relative">
                <div className="absolute -top-3 -right-3 bg-emerald-600 text-white text-[11px] font-extrabold px-3.5 py-1 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Valuation Engine</span>
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                  Doorstep Scrap Valuation Preview
                </div>
                <h3 className="text-lg font-bold text-stone-950 mb-4">
                  Verified Mandi Rates (Jaipur Hub)
                </h3>

                <div className="space-y-3">
                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between text-xs hover:border-emerald-500 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📦</span>
                      <div>
                        <span className="font-bold text-stone-900 block">Paper & Cardboard (Raddi)</span>
                        <span className="text-stone-500">Newspapers & packaging</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-emerald-700 text-sm">₹14.00 / kg</span>
                      <span className="text-[10px] text-stone-400 block">Mandi Benchmark</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between text-xs hover:border-emerald-500 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🧴</span>
                      <div>
                        <span className="font-bold text-stone-900 block">Rigid Plastics (PET / HDPE)</span>
                        <span className="text-stone-500">Water bottles & jars</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-emerald-700 text-sm">₹18.00 / kg</span>
                      <span className="text-[10px] text-stone-400 block">Plastics Federation</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between text-xs hover:border-emerald-500 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🔩</span>
                      <div>
                        <span className="font-bold text-stone-900 block">Scrap Iron (Loha Heavy)</span>
                        <span className="text-stone-500">Pipes, rods & utensils</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-emerald-700 text-sm">₹28.00 / kg</span>
                      <span className="text-[10px] text-stone-400 block">Industrial Scrap</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-500 block font-medium">Est. 25kg Bundle Value</span>
                    <span className="text-2xl font-extrabold text-stone-950">₹445.00</span>
                  </div>
                  <button
                    onClick={() => {
                      if (!user) demoLoginAs('HOUSEHOLD');
                      setCurrentTab('create-pickup');
                    }}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-md"
                  >
                    Schedule Pickup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Telemetry Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 sm:divide-x divide-stone-100">
            <div className="p-2 space-y-1">
              <span className="text-stone-400 text-xs font-bold uppercase tracking-wider block">Total Recycled</span>
              <div className="text-3xl font-extrabold text-stone-900">
                {impactStats?.verifiedTotals?.totalMaterialCollectedKg || '187.5'} kg
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                Scale Verified ✓
              </span>
            </div>

            <div className="p-2 space-y-1">
              <span className="text-stone-400 text-xs font-bold uppercase tracking-wider block">CO₂ Averted</span>
              <div className="text-3xl font-extrabold text-emerald-700">
                {impactStats?.ecologicalSavings?.co2EquivalentOffsetKg || '265.4'} kg
              </div>
              <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-full inline-block">
                CPCB Lifecycle Factor
              </span>
            </div>

            <div className="p-2 space-y-1">
              <span className="text-stone-400 text-xs font-bold uppercase tracking-wider block">Fair Direct Payouts</span>
              <div className="text-3xl font-extrabold text-stone-900">
                ₹{impactStats?.verifiedTotals?.totalCollectorPayoutsInr || '3,442.50'}
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                Direct to Wallet
              </span>
            </div>

            <div className="p-2 space-y-1">
              <span className="text-stone-400 text-xs font-bold uppercase tracking-wider block">Verified Collectors</span>
              <div className="text-3xl font-extrabold text-stone-900">
                {impactStats?.verifiedTotals?.activeCollectorsCount || '2'}
              </div>
              <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded-full inline-block">
                KYC Registered
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Interactive Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            End-to-End Traceability
          </span>
          <h2 className="text-3xl font-extrabold text-stone-950">How ScrapSetu Operates</h2>
          <p className="text-stone-600 text-sm">
            Replacing exploitative middlemen with a transparent, privacy-protected 4-step pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3 hover:border-emerald-500 transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-extrabold text-xl">
              1
            </div>
            <h4 className="font-bold text-stone-900 text-base">{t.step1Title}</h4>
            <p className="text-xs text-stone-600 leading-relaxed">{t.step1Desc}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3 hover:border-emerald-500 transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-xl">
              2
            </div>
            <h4 className="font-bold text-stone-900 text-base">{t.step2Title}</h4>
            <p className="text-xs text-stone-600 leading-relaxed">{t.step2Desc}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3 hover:border-emerald-500 transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-extrabold text-xl">
              3
            </div>
            <h4 className="font-bold text-stone-900 text-base">{t.step3Title}</h4>
            <p className="text-xs text-stone-600 leading-relaxed">{t.step3Desc}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3 hover:border-emerald-500 transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-extrabold text-xl">
              4
            </div>
            <h4 className="font-bold text-stone-900 text-base">{t.step4Title}</h4>
            <p className="text-xs text-stone-600 leading-relaxed">{t.step4Desc}</p>
          </div>
        </div>
      </section>

      {/* Role Launchers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-stone-100 to-stone-200/70 rounded-3xl p-8 border border-stone-300/80">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
            <h3 className="text-2xl font-extrabold text-stone-950">Tailored Dashboards for Every Stakeholder</h3>
            <p className="text-xs text-stone-600">
              Select your persona below to experience live customized tooling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => {
                demoLoginAs('HOUSEHOLD');
                setCurrentTab('household-dash');
              }}
              className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-500 cursor-pointer transition-all shadow-xs hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-2">🏠</div>
              <h5 className="font-bold text-stone-900 text-sm">Household Resident</h5>
              <p className="text-xs text-stone-500 mt-1">
                Book pickups, track arrivals live, view digital receipts & carbon footprint.
              </p>
              <span className="text-xs font-bold text-emerald-700 mt-3 inline-block">
                Launch Portal →
              </span>
            </div>

            <div
              onClick={() => {
                demoLoginAs('BUSINESS');
                setCurrentTab('business-dash');
              }}
              className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-500 cursor-pointer transition-all shadow-xs hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-2">🏢</div>
              <h5 className="font-bold text-stone-900 text-sm">Commercial Generator</h5>
              <p className="text-xs text-stone-500 mt-1">
                Recurring weekly schedules, multi-warehouse bays, GST transaction slips.
              </p>
              <span className="text-xs font-bold text-emerald-700 mt-3 inline-block">
                Launch Portal →
              </span>
            </div>

            <div
              onClick={() => {
                demoLoginAs('COLLECTOR');
                setCurrentTab('collector-dash');
              }}
              className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-500 cursor-pointer transition-all shadow-xs hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-2">🛺</div>
              <h5 className="font-bold text-stone-900 text-sm">Kabadiwala Terminal</h5>
              <p className="text-xs text-stone-500 mt-1">
                Mobile-first Hindi/English terminal, 1-tap accept, digital scale entry, TSP route planner.
              </p>
              <span className="text-xs font-bold text-emerald-700 mt-3 inline-block font-hindi">
                टर्मिनल खोलें →
              </span>
            </div>

            <div
              onClick={() => {
                demoLoginAs('RECYCLER');
                setCurrentTab('recycler-dash');
              }}
              className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-500 cursor-pointer transition-all shadow-xs hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-2">🏭</div>
              <h5 className="font-bold text-stone-900 text-sm">Recycling Processing Mill</h5>
              <p className="text-xs text-stone-500 mt-1">
                Post buying rate sheets, issue weighbridge intake slips, circular traceability.
              </p>
              <span className="text-xs font-bold text-emerald-700 mt-3 inline-block">
                Launch Portal →
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
