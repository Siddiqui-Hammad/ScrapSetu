import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { MaterialCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { TrendingUp, Calculator, ShieldCheck, Info, Sparkles, Filter } from 'lucide-react';

export const RatesPage: React.FC = () => {
  const { language } = useLanguage();
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [calcCategory, setCalcCategory] = useState<string>('');
  const [calcQty, setCalcQty] = useState<number>(20);
  const [calcGrade, setCalcGrade] = useState<string>('clean');
  const [calcEstimate, setCalcEstimate] = useState<any>(null);

  useEffect(() => {
    api.getRates().then((res) => {
      if (res.success && res.categories) {
        setCategories(res.categories);
        if (res.categories[0]) {
          setCalcCategory(res.categories[0].id);
        }
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (calcCategory && calcQty > 0) {
      api.estimatePrice([{ categoryId: calcCategory, estimatedQty: calcQty, grade: calcGrade }]).then(
        (res) => {
          if (res.success) setCalcEstimate(res.valuation);
        }
      );
    }
  }, [calcCategory, calcQty, calcGrade]);

  const filteredCategories =
    selectedCategory === 'all'
      ? categories
      : categories.filter((c) => c.slug === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>Transparent Mandi Scrap Index</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-950 tracking-tight">
          {language === 'hi' ? 'दैनिक कबाड़ सांकेतिक मंडी भाव' : 'Indicative Scrap Benchmark Rates'}
        </h1>
        <p className="text-sm text-stone-600 max-w-3xl mt-1">
          ScrapSetu aggregates wholesale mandi benchmarks across North India. Demonstrating transparent baseline prices to prevent informal exploitation and ensure fair payments.
        </p>
      </div>

      {/* Demonstration Data Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Methodology & Demonstration Notice:</span>
          Rates presented are verified demonstration benchmarks based on the Material Recycling Association of India (MRAI) and Delhi-NCR wholesale mandi transactions. Final rates on-site are mutually established after physical sorting and digital spring-scale weighing.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Rates Table */}
        <div className="lg:col-span-8 space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              All Categories ({categories.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.slug
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Cards of Categories */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="p-8 text-center text-stone-500 text-sm">Loading verified rate sheet...</div>
            ) : (
              filteredCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-stone-900 text-base">
                        {cat.name}{' '}
                        <span className="text-xs font-normal text-emerald-700 font-hindi">
                          ({cat.hindiName})
                        </span>
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">{cat.description}</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                      Standard Unit: /{cat.defaultUnit}
                    </span>
                  </div>

                  {/* Benchmark Records */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {cat.prices && cat.prices.length > 0 ? (
                      cat.prices.map((price) => (
                        <div
                          key={price.id}
                          className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-stone-800">{price.grade}</span>
                            <span className="text-base font-extrabold text-emerald-700">
                              ₹{price.indicativePrice}/{price.unit}
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-500 flex justify-between">
                            <span>Expected Range: ₹{price.minPrice} - ₹{price.maxPrice}</span>
                            <span className="text-emerald-700 font-medium">Demonstration</span>
                          </div>
                          <div className="text-[10px] text-stone-400 truncate">
                            Source: {price.source}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-stone-400">No active price benchmark configured.</div>
                    )}
                  </div>

                  {/* Environmental factor pill */}
                  <div className="flex flex-wrap gap-2 text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                    <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium">
                      🌱 {cat.carbonFactorKg} kg CO₂ saved / kg
                    </span>
                    <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-medium">
                      💧 {cat.waterFactorL}L water saved / kg
                    </span>
                    <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-medium">
                      ⚡ {cat.energyFactorKwh} kWh energy saved / kg
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Live Transparent Estimator Widget */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md sticky top-24 space-y-5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Instant Value Calculator</h3>
                <span className="text-xs text-stone-500">Calculate fair estimated payout</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Select Scrap</label>
                <select
                  value={calcCategory}
                  onChange={(e) => setCalcCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-emerald-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.hindiName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Estimated Quantity (kg): <span className="font-bold text-emerald-800">{calcQty} kg</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="200"
                  value={calcQty}
                  onChange={(e) => setCalcQty(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Condition / Segregation</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setCalcGrade('clean')}
                    className={`p-2 rounded-xl border text-center font-medium transition-colors ${
                      calcGrade === 'clean'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}
                  >
                    Clean / Segregated (+8%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcGrade('mixed')}
                    className={`p-2 rounded-xl border text-center font-medium transition-colors ${
                      calcGrade === 'mixed'
                        ? 'bg-amber-50 border-amber-500 text-amber-800 font-bold'
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}
                  >
                    Mixed / Unsorted (-10%)
                  </button>
                </div>
              </div>
            </div>

            {/* Live Calculation Output */}
            {calcEstimate && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <div className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">
                  Estimated Doorstep Payout
                </div>
                <div className="text-3xl font-extrabold text-emerald-950">
                  ₹{calcEstimate.totalEstimatedValue}
                </div>
                <div className="text-xs text-stone-600">
                  Range: ₹{calcEstimate.items[0]?.minEstimatedValue} - ₹{calcEstimate.items[0]?.maxEstimatedValue}
                </div>
                <div className="text-[10px] text-stone-500 pt-2 border-t border-emerald-200">
                  Formula: {calcEstimate.formulaExplanation}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
