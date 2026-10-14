'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Recycle,
  User,
  Truck,
  Building2,
  Factory,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Languages,
} from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { UserRole } from '../../types';
import { BilingualText } from './BilingualText';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, demoLoginAs } = useAuthStore();
  const { language, setLanguage } = useAppStore();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [langHovered, setLangHovered] = useState<string | null>(null);

  const rolesList: { role: UserRole; label: string; icon: any; route: string; desc: string }[] = [
    { role: 'HOUSEHOLD', label: 'Household', icon: User, route: '/household', desc: 'Doorstep pickup & AI ScrapVision' },
    { role: 'COLLECTOR', label: 'Kabadiwala', icon: Truck, route: '/collector', desc: 'Mobile terminal & EcoRoute TSP' },
    { role: 'BUSINESS', label: 'Enterprise', icon: Building2, route: '/business', desc: 'Bulk dispatch & EPR reports' },
    { role: 'RECYCLER', label: 'Recycler Mill', icon: Factory, route: '/recycler', desc: 'Weighbridge intake & rate sheet' },
    { role: 'ADMIN', label: 'Administrator', icon: ShieldCheck, route: '/admin', desc: '3-Point KYC & platform controls' },
  ];

  const handleRoleSwitch = (r: UserRole, route: string) => {
    demoLoginAs(r);
    setRoleMenuOpen(false);
    router.push(route);
  };

  const currentRoleObj = rolesList.find((r) => r.role === user?.role) || rolesList[0];
  const CurrentIcon = currentRoleObj.icon;

  return (
    <header className="sticky top-0 z-50 bg-[#070D0A]/90 backdrop-blur-md border-b border-[#14261C] text-zinc-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-3 select-none group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-forest-950 flex items-center justify-center text-emerald-300 shadow-lg border border-emerald-500/40 transition-transform group-hover:scale-105">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block leading-tight">
                ScrapSetu
              </span>
              <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase block">
                {language === 'hi' ? 'सर्कुलर इंटेलिजेंस' : 'Circular Intelligence'}
              </span>
            </div>
          </Link>

          {/* Center Navigation Links with Bilingual Hover Tooltips */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pathname === '/'
                  ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 shadow-xs'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BilingualText en="Home" hi="होम" />
            </Link>
            <Link
              href="/rates"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pathname === '/rates'
                  ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 shadow-xs'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BilingualText en="Rates" hi="दर सूची (Mandi)" />
            </Link>
            <Link
              href="/impact"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pathname === '/impact'
                  ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 shadow-xs'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BilingualText en="Impact" hi="पर्यावरणीय प्रभाव" />
            </Link>
            <Link
              href="/passport/RCP-2026-DEL-0894"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pathname.startsWith('/passport')
                  ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 shadow-xs'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BilingualText en="Passport" hi="कबाड़ पासपोर्ट" />
            </Link>
            <Link
              href="/how-it-works"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pathname === '/how-it-works'
                  ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 shadow-xs'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BilingualText en="How It Works" hi="यह कैसे काम करता है" />
            </Link>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Interactive Bilingual Indicator with Hover Tooltip */}
            <div className="relative">
              <div className="flex items-center rounded-xl border border-emerald-500/30 bg-[#0F1914] p-0.5 text-[11px] shadow-sm">
                <button
                  onClick={() => setLanguage('en')}
                  onMouseEnter={() => setLangHovered('en')}
                  onMouseLeave={() => setLangHovered(null)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    language === 'en'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  onMouseEnter={() => setLangHovered('hi')}
                  onMouseLeave={() => setLangHovered(null)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    language === 'hi'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  हिंदी
                </button>
              </div>

              {/* Hover Tooltip telling meaning in other language */}
              {langHovered && (
                <div className="absolute right-0 top-full mt-2 w-64 p-2.5 rounded-xl bg-zinc-950/95 border border-emerald-500/50 shadow-2xl backdrop-blur-md text-[11px] z-50 animate-in fade-in zoom-in-95 pointer-events-none">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-0.5">
                    <Languages className="w-3.5 h-3.5" />
                    <span>
                      {langHovered === 'en'
                        ? 'भाषा विकल्प: English'
                        : 'Language: Hindi (हिंदी)'}
                    </span>
                  </div>
                  <div className="text-zinc-300">
                    {langHovered === 'en'
                      ? 'वर्तमान में अंग्रेजी चयनित है। हिंदी अनुवाद देखने के लिए कर्सर ऊपर रखें या "हिंदी" चुनें।'
                      : 'Hindi selected. Hovering over any element will show its English equivalent.'}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Role Switcher Pill (Dark Theme) */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-[#0F1914] hover:bg-[#15231C] shadow-sm text-xs font-bold text-white transition-all"
              >
                <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CurrentIcon className="w-3.5 h-3.5" />
                </div>
                <span className="hidden sm:inline">{currentRoleObj.label}</span>
                <span className="sm:hidden">{user?.role || 'Role'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {/* Role Switcher Dropdown Menu */}
              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0D1612] rounded-2xl shadow-2xl border border-emerald-500/30 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                      Switch Role Dashboard
                    </span>
                    <span className="text-xs text-zinc-400">Simulate tailored portal workflows</span>
                  </div>
                  <div className="py-1 space-y-0.5">
                    {rolesList.map((item) => {
                      const Icon = item.icon;
                      const isCurrent = user?.role === item.role;
                      return (
                        <button
                          key={item.role}
                          onClick={() => handleRoleSwitch(item.role, item.route)}
                          className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs transition-colors ${
                            isCurrent
                              ? 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-500/40'
                              : 'text-zinc-300 hover:bg-white/5'
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                              isCurrent
                                ? 'bg-emerald-600 text-white'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold flex items-center gap-1.5 text-white">
                              <span>{item.label}</span>
                              {isCurrent && (
                                <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1.5 rounded font-mono">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-zinc-400 leading-tight">
                              {item.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {user ? (
              <Button
                size="sm"
                variant="outline"
                onClick={logout}
                className="text-xs font-bold border-zinc-700 bg-white/5 text-zinc-200 hover:bg-white/10 h-8"
              >
                <LogOut className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button size="sm" variant="ghost" className="text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/5 h-8">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-8 shadow-sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
