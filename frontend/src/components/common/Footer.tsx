'use client';

import React from 'react';
import Link from 'next/link';
import { Recycle, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-white border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight">ScrapSetu</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              India's Digital Recycling Bridge — empowering informal kabadiwalas, verifying recyclers, and transparently diverting landfill waste into circular value.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">User Portals</h4>
            <ul className="space-y-1.5 text-stone-300">
              <li><Link href="/household" className="hover:text-white transition-colors">🏠 Household Portal</Link></li>
              <li><Link href="/collector" className="hover:text-white transition-colors">🛺 Kabadiwala Terminal</Link></li>
              <li><Link href="/business" className="hover:text-white transition-colors">🏢 Commercial Bulk Waste</Link></li>
              <li><Link href="/recycler" className="hover:text-white transition-colors">🏭 Recycler Weighbridge</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">🛡️ Governance Console</Link></li>
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">Workflows & Tools</h4>
            <ul className="space-y-1.5 text-stone-300">
              <li><Link href="/rates" className="hover:text-white transition-colors">📈 Live Mandi Benchmark Rates</Link></li>
              <li><Link href="/impact" className="hover:text-white transition-colors">🌱 GreenLedger ESG Analytics</Link></li>
              <li><Link href="/passport/REC-2026-JP-00192" className="hover:text-white transition-colors">📜 Waste Passport™ Tracker</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">⚖️ TrustWeigh Protocol</Link></li>
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">Compliance & Standards</h4>
            <p className="text-stone-400 leading-relaxed text-[11px]">
              Compliant with Ministry of Environment, Forest and Climate Change (MoEFCC) Plastic Waste & E-Waste Management Rules (2026).
            </p>
            <div className="pt-2 text-stone-400 flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SHA-256 Tamper-Evident Ledger</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © 2026 <b>ScrapSetu Platform</b>. Built for Smart India Hackathon & Sustainable Circular Economy.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-stone-400">Deployed on Next.js 14 App Router + Node Express</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
