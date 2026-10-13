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
} from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, demoLoginAs } = useAuthStore();
  const { language, setLanguage } = useAppStore();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-3 select-none group">
            <div className="w-9 h-9 rounded-xl bg-forest-900 flex items-center justify-center text-emerald-400 shadow-sm transition-transform group-hover:scale-105">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-zinc-950 block leading-tight">
                ScrapSetu
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 tracking-wider uppercase block">
                {language === 'hi' ? 'सर्कुलर इंटेलिजेंस' : 'Circular Intelligence'}
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                pathname === '/'
                  ? 'text-forest-900 bg-emerald-50/80 font-bold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
              }`}
            >
              Overview
            </Link>
            <Link
              href="/how-it-works"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                pathname === '/how-it-works'
                  ? 'text-forest-900 bg-emerald-50/80 font-bold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
              }`}
            >
              How It Works
            </Link>
            <Link
              href="/rates"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                pathname === '/rates'
                  ? 'text-forest-900 bg-emerald-50/80 font-bold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
              }`}
            >
              Mandi Benchmark
            </Link>
            <Link
              href="/impact"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                pathname === '/impact'
                  ? 'text-forest-900 bg-emerald-50/80 font-bold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
              }`}
            >
              GreenLedger Impact
            </Link>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* Language Toggle Micro-Pill */}
            <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-50/80 p-0.5 text-[11px]">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                  language === 'en'
                    ? 'bg-white shadow-2xs text-forest-900'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                  language === 'hi'
                    ? 'bg-white shadow-2xs text-forest-900'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Quick Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200/90 bg-white hover:bg-zinc-50 shadow-2xs text-xs font-semibold text-zinc-900 transition-all"
              >
                <div className="w-5 h-5 rounded-md bg-emerald-100 text-forest-900 flex items-center justify-center">
                  <CurrentIcon className="w-3.5 h-3.5" />
                </div>
                <span className="hidden sm:inline font-bold">{currentRoleObj.label}</span>
                <span className="sm:hidden font-bold">{user?.role || 'Role'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {/* Role Switcher Dropdown Menu */}
              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-zinc-200/80 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-zinc-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Switch Role Dashboard
                    </span>
                    <span className="text-xs text-zinc-600">Simulate tailored portal workflows</span>
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
                              ? 'bg-emerald-50 text-forest-900 font-bold'
                              : 'text-zinc-700 hover:bg-zinc-50'
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                              isCurrent
                                ? 'bg-forest-900 text-white'
                                : 'bg-zinc-100 text-zinc-600'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold flex items-center gap-1.5">
                              <span>{item.label}</span>
                              {isCurrent && (
                                <span className="text-[9px] bg-emerald-200/80 text-forest-950 px-1.5 rounded font-mono">
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

            {/* Direct Dashboard or Auth Action */}
            {user ? (
              <div className="flex items-center gap-1.5 pl-1.5 border-l border-zinc-200">
                <Link href={currentRoleObj.route}>
                  <Button size="sm" variant="primary" className="text-xs font-bold px-3">
                    Open Portal
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-xs font-semibold">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" variant="primary" className="text-xs font-bold">
                    Get Started
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
