'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface ChartProps {
  monthlyData?: Array<{ month: string; weightKg: number; co2SavedKg: number }>;
  categoryData?: Array<{ name: string; value: number; color: string }>;
}

const DEFAULT_MONTHLY = [
  { month: 'May', weightKg: 1250, co2SavedKg: 1875 },
  { month: 'Jun', weightKg: 1980, co2SavedKg: 2970 },
  { month: 'Jul', weightKg: 2450, co2SavedKg: 3675 },
  { month: 'Aug', weightKg: 3100, co2SavedKg: 4650 },
  { month: 'Sep', weightKg: 4200, co2SavedKg: 6300 },
  { month: 'Oct', weightKg: 5480, co2SavedKg: 8220 },
];

const DEFAULT_CATEGORIES = [
  { name: 'Cardboard & Paper', value: 2450, color: '#047857' },
  { name: 'Rigid Plastics (PET)', value: 1620, color: '#10b981' },
  { name: 'Ferrous Metals (Iron)', value: 980, color: '#0f766e' },
  { name: 'Non-Ferrous (Copper)', value: 280, color: '#f59e0b' },
  { name: 'E-Waste', value: 150, color: '#6366f1' },
];

export const GreenLedgerCharts: React.FC<ChartProps> = ({
  monthlyData = DEFAULT_MONTHLY,
  categoryData = DEFAULT_CATEGORIES,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Diverted Weight & CO2 Abatement */}
      <div className="p-6 bg-white rounded-3xl border border-stone-200/90 shadow-card-subtle space-y-4">
        <div>
          <h4 className="font-bold text-stone-900 text-base">Monthly Landfill Diversion Trend</h4>
          <p className="text-xs text-stone-500 font-medium">
            Kilograms of segregated scrap channeled to accredited recycling mills
          </p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="weightKg" name="Scrap Diverted (kg)" fill="#059669" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Circular Material Composition Donut */}
      <div className="p-6 bg-white rounded-3xl border border-stone-200/90 shadow-card-subtle space-y-4">
        <div>
          <h4 className="font-bold text-stone-900 text-base">Circular Material Stream Share</h4>
          <p className="text-xs text-stone-500 font-medium">
            Breakdown of collected volume across verified material streams
          </p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
