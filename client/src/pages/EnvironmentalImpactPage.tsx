import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { EnvironmentalImpactSummary } from '../types';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Leaf, Droplets, Zap, TreePine, ShieldCheck, Info } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ea580c', '#06b6d4', '#8b5cf6'];

export const EnvironmentalImpactPage: React.FC = () => {
  const [impact, setImpact] = useState<EnvironmentalImpactSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getPublicImpact().then((res) => {
      if (res.success && res.impact) {
        setImpact(res.impact);
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !impact) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-stone-500">
        Loading verified environmental impact analytics...
      </div>
    );
  }

  const pieData = impact.materialBreakdown.map((item) => ({
    name: item.categoryName,
    value: item.totalKg,
  }));

  const barData = impact.materialBreakdown.map((item) => ({
    name: item.categoryName.split(' ')[0],
    kg: item.totalKg,
    co2: item.co2SavedKg,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
          <Leaf className="w-3.5 h-3.5 text-emerald-600" />
          <span>Circular Economy ESG Transparency</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-950 tracking-tight">
          Environmental Impact & Diversion Analytics
        </h1>
        <p className="text-sm text-stone-600 max-w-3xl mt-1">
          ScrapSetu strictly isolates verified physical weighing transactions from projected estimates, ensuring real auditability for corporate ESG and municipal reporting.
        </p>
      </div>

      {/* Main Verified Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span>CO₂ Equivalent Offset</span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-800">
            {impact.ecologicalSavings.co2EquivalentOffsetKg} kg
          </div>
          <div className="text-[11px] text-stone-400">CPCB & EPA WARM Factors</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase">
            <TreePine className="w-4 h-4 text-green-600" />
            <span>Mature Trees Saved</span>
          </div>
          <div className="text-3xl font-extrabold text-stone-900">
            {impact.ecologicalSavings.treesSavedCount} Trees
          </div>
          <div className="text-[11px] text-stone-400">Virgin pulp substitution</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase">
            <Droplets className="w-4 h-4 text-blue-600" />
            <span>Water Conserved</span>
          </div>
          <div className="text-3xl font-extrabold text-blue-800">
            {impact.ecologicalSavings.waterConservedLitres} L
          </div>
          <div className="text-[11px] text-stone-400">Industrial process savings</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Energy Saved</span>
          </div>
          <div className="text-3xl font-extrabold text-amber-800">
            {impact.ecologicalSavings.energySavedKwh} kWh
          </div>
          <div className="text-[11px] text-stone-400">Grid electricity offset</div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart: Material Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-bold text-stone-900 text-base">
            Material Segregation Distribution (by Weight)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Weight vs CO2 Saved */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-bold text-stone-900 text-base">
            Recovered Weight (kg) vs. Averted Carbon (kg CO₂e)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#78716c" fontSize={11} />
                <YAxis stroke="#78716c" fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar dataKey="kg" name="Weight Diverted (kg)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="co2" name="CO₂ Offset (kg)" fill="#064e3b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Documented Methodology Section */}
      <div className="bg-stone-50 rounded-3xl p-6 sm:p-8 border border-stone-200 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-emerald-700" />
          <h3 className="font-bold text-stone-900 text-base">
            Scientific Calculation Methodology & Life Cycle Assumptions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-600 leading-relaxed">
          <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1">
            <span className="font-bold text-stone-900 block">Carbon Accounting Model</span>
            <p>{impact.methodologyNotes.carbonFactorSource}</p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1">
            <span className="font-bold text-stone-900 block">Forestry Equivalence</span>
            <p>{impact.methodologyNotes.treesCalculationFormula}</p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1">
            <span className="font-bold text-stone-900 block">Verification Guardrail</span>
            <p>{impact.methodologyNotes.verificationDistinction}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
