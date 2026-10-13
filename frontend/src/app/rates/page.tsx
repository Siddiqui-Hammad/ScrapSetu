'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Calculator,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Building2,
  Sparkles,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatINR } from '@/lib/utils';

interface MandiRateItem {
  id: string;
  name: string;
  category: 'Metals' | 'Plastics' | 'Paper' | 'E-Waste';
  ratePerKg: number;
  changePercent: number;
  highRate: number;
  lowRate: number;
  grade: string;
  unit: string;
}

const MANDI_DATA: MandiRateItem[] = [
  // Metals
  { id: 'cu-1', name: 'Copper Wire (Armoured Clean)', category: 'Metals', ratePerKg: 685, changePercent: 2.4, highRate: 700, lowRate: 670, grade: 'Millberry 99.9%', unit: 'kg' },
  { id: 'br-1', name: 'Brass / Pital (Heavy Utensils)', category: 'Metals', ratePerKg: 460, changePercent: 1.1, highRate: 475, lowRate: 450, grade: 'Honey Grade', unit: 'kg' },
  { id: 'al-1', name: 'Aluminium Section & Utensils', category: 'Metals', ratePerKg: 165, changePercent: -0.8, highRate: 172, lowRate: 160, grade: 'Extrusion 6063', unit: 'kg' },
  { id: 'fe-1', name: 'Heavy Structural Iron (Loha)', category: 'Metals', ratePerKg: 34, changePercent: 0.5, highRate: 36, lowRate: 32, grade: 'HMS 1/2', unit: 'kg' },
  { id: 'ss-1', name: 'Stainless Steel (SS 304)', category: 'Metals', ratePerKg: 125, changePercent: 1.5, highRate: 130, lowRate: 120, grade: 'Food Grade 304', unit: 'kg' },

  // Plastics
  { id: 'pet-1', name: 'PET Bottles (Baled Clean)', category: 'Plastics', ratePerKg: 28, changePercent: 3.2, highRate: 30, lowRate: 25, grade: 'Clear Optical', unit: 'kg' },
  { id: 'hdpe-1', name: 'HDPE Rigid Drums & Canisters', category: 'Plastics', ratePerKg: 42, changePercent: 0.9, highRate: 45, lowRate: 40, grade: 'Blow Molding', unit: 'kg' },
  { id: 'ldpe-1', name: 'LDPE Clean Packaging Film', category: 'Plastics', ratePerKg: 32, changePercent: -1.2, highRate: 35, lowRate: 30, grade: 'Grade 100/0', unit: 'kg' },
  { id: 'pp-1', name: 'Polypropylene (PP Chairs/Buckets)', category: 'Plastics', ratePerKg: 36, changePercent: 1.8, highRate: 38, lowRate: 34, grade: 'Injection Homopolymer', unit: 'kg' },
  { id: 'mlp-1', name: 'Multi-Layer Plastics (Snack Wrappers)', category: 'Plastics', ratePerKg: 9, changePercent: 0.0, highRate: 10, lowRate: 8, grade: 'RDF Co-processing', unit: 'kg' },

  // Paper
  { id: 'cb-1', name: 'Corrugated Carton / Kraft Gatta', category: 'Paper', ratePerKg: 15.5, changePercent: 1.3, highRate: 17, lowRate: 14, grade: 'Kraft Mill Stock', unit: 'kg' },
  { id: 'wp-1', name: 'White Office Ledger / Records', category: 'Paper', ratePerKg: 19, changePercent: 0.0, highRate: 20, lowRate: 18, grade: 'Deinking Grade', unit: 'kg' },
  { id: 'np-1', name: 'Old Newspaper (Raddi)', category: 'Paper', ratePerKg: 16.5, changePercent: -0.5, highRate: 18, lowRate: 15, grade: 'ONP Standard', unit: 'kg' },

  // E-Waste
  { id: 'ew-1', name: 'Computer Server Motherboards', category: 'E-Waste', ratePerKg: 310, changePercent: 4.5, highRate: 330, lowRate: 290, grade: 'Gold Plated Contact', unit: 'kg' },
  { id: 'ew-2', name: 'Lithium-ion Battery Modules', category: 'E-Waste', ratePerKg: 135, changePercent: 2.1, highRate: 145, lowRate: 125, grade: 'NMC / LFP Sorted', unit: 'kg' },
  { id: 'ew-3', name: 'Mixed Small Appliances (WEEE)', category: 'E-Waste', ratePerKg: 48, changePercent: 0.6, highRate: 52, lowRate: 44, grade: 'Shredder Ready', unit: 'kg' },
];

export default function MandiRatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculator State
  const [calcItemId, setCalcItemId] = useState('cu-1');
  const [calcWeight, setCalcWeight] = useState(25);

  const filteredItems = MANDI_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.grade.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedCalcItem = MANDI_DATA.find((i) => i.id === calcItemId) || MANDI_DATA[0];
  const estimatedEarnings = selectedCalcItem.ratePerKg * calcWeight;

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>Live Mandi Index • Updated Today at 08:00 AM IST</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            National Scrap Mandi Rates & Benchmark Index
          </h1>
          <p className="text-sm text-stone-600">
            Transparent, real-time recycling commodity rates across Delhi-NCR, Mumbai, and pan-India
            industrial hubs. No middlemen exploitation.
          </p>
        </div>

        {/* Live Scrap Value Calculator Widget */}
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-900 via-forest-900 to-emerald-950 text-white shadow-xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <span>Instant Scrap Value Calculator</span>
                </div>
                <h2 className="text-2xl font-black tracking-tight text-white">
                  Estimate Your Doorstep Scrap Earnings
                </h2>
                <p className="text-xs text-stone-300 max-w-lg">
                  Select your scrap category and drag the weight slider to see transparent live
                  benchmark earnings before scheduling a pickup.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-emerald-200 mb-1.5">
                      Select Material:
                    </label>
                    <select
                      value={calcItemId}
                      onChange={(e) => setCalcItemId(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2.5 bg-emerald-800 text-white border border-emerald-600 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    >
                      {MANDI_DATA.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} (₹{item.ratePerKg}/{item.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5 text-xs font-bold text-emerald-200">
                      <span>Quantity / Weight:</span>
                      <span className="font-mono text-emerald-300">{calcWeight} kg</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="200"
                      value={calcWeight}
                      onChange={(e) => setCalcWeight(Number(e.target.value))}
                      className="w-full accent-emerald-400 h-2 bg-emerald-800 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                      <span>1 kg</span>
                      <span>100 kg</span>
                      <span>200 kg+</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Earnings Output Display */}
              <div className="lg:col-span-5 bg-black/40 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                  Total Estimated Doorstep Payout
                </span>
                <div className="text-4xl sm:text-5xl font-black text-amber-400 tracking-tight font-mono">
                  {formatINR(estimatedEarnings)}
                </div>
                <div className="text-xs text-stone-300">
                  Calculated at{' '}
                  <span className="font-bold text-white">
                    ₹{selectedCalcItem.ratePerKg}/kg
                  </span>{' '}
                  for {calcWeight} kg {selectedCalcItem.name}
                </div>

                <div className="pt-2">
                  <Link href="/household">
                    <Button
                      size="default"
                      className="w-full font-bold bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-md"
                    >
                      Book Free Doorstep Pickup Now
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['All', 'Metals', 'Plastics', 'Paper', 'E-Waste'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search material or grade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Mandi Rate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isPositive = item.changePercent >= 0;
            return (
              <Card
                key={item.id}
                className="hover:border-emerald-400 hover:shadow-md transition-all duration-200"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold mb-1">
                        {item.category}
                      </Badge>
                      <h3 className="text-sm font-bold text-stone-900 leading-snug">{item.name}</h3>
                      <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                        Grade: {item.grade}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xl font-black text-emerald-950 font-mono">
                        ₹{item.ratePerKg}
                        <span className="text-xs font-normal text-stone-500">/{item.unit}</span>
                      </div>
                      <div
                        className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${
                          isPositive ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>
                          {isPositive ? '+' : ''}
                          {item.changePercent}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <div>
                      Range: <span className="font-semibold text-stone-700">₹{item.lowRate}</span> -{' '}
                      <span className="font-semibold text-stone-700">₹{item.highRate}</span>
                    </div>
                    <button
                      onClick={() => {
                        setCalcItemId(item.id);
                        window.scrollTo({ top: 180, behavior: 'smooth' });
                      }}
                      className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline"
                    >
                      Calculate →
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Regulatory & Trade Transparency Note */}
        <div className="bg-stone-100 rounded-2xl p-4 text-xs text-stone-600 flex items-start gap-3 border border-stone-200">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-stone-800">ScrapSetu Fair Trade Mandi Policy:</span>{' '}
            Prices reflect weighted average wholesale spot rates compiled daily from CPCB registered
            recycling clusters in Mayapuri (Delhi), Mundka, Mandi Gobindgarh (Punjab), and Taloja
            (Maharashtra). Doorstep pickup collectors receive certified digital weighing margins.
          </div>
        </div>
      </div>
    </div>
  );
}
