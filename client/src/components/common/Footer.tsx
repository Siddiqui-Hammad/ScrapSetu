import React from 'react';
import { Recycle, Heart, Shield, FileText, HelpCircle, PhoneCall } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  const { language } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">ScrapSetu</span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              {language === 'hi'
                ? 'टिकाऊ पुनर्चक्रण का डिजिटल सेतु। अनौपचारिक कबाड़ीवालों और रीसाइक्लिंग उद्योग को सशक्त बनाना।'
                : 'A Digital Bridge to Sustainable Recycling. Empowering informal waste collectors and building a transparent circular economy.'}
            </p>
            <div className="text-xs text-emerald-400 font-medium">
              Made with precision for Smart India Hackathon & Sustainable Development Goals (SDG 11 & 12).
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-3">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setCurrentTab('landing')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('how-it-works')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('rates')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Indicative Scrap Rates
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('impact')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Environmental Impact
                </button>
              </li>
            </ul>
          </div>

          {/* User Guides */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-3">Workflows</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setCurrentTab('household-dash')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Household Pickups
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('business-dash')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Commercial Bulk Waste
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('collector-dash')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Kabadiwala Partner Terminal
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('recycler-dash')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Recycling Facility Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Regulatory & Safety */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-3">Trust & Safety</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setCurrentTab('safety')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Waste Segregation & Safety</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('privacy')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Geolocation & Data Privacy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('help')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Disputes & Help Desk</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 ScrapSetu. All rights reserved. Registered under Sustainable Circular Economy Framework.</p>
          <div className="flex items-center gap-4">
            <span className="text-emerald-500">Live Pilot: Jaipur & North NCR Mandis</span>
            <span>•</span>
            <span>Version 1.0.0-PROD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
