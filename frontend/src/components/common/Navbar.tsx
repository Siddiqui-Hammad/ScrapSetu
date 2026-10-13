'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Recycle, User as UserIcon, Globe, LogOut, ShieldCheck, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, demoLoginAs } = useAuthStore();
  const { language, setLanguage } = useAppStore();

  const handleRoleSwitch = (role: UserRole) => {
    demoLoginAs(role);
    if (role === 'HOUSEHOLD') router.push('/household');
    else if (role === 'BUSINESS') router.push('/business');
    else if (role === 'COLLECTOR') router.push('/collector');
    else if (role === 'RECYCLER') router.push('/recycler');
    else if (role === 'ADMIN') router.push('/admin');
  };

  const getDashboardHref = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'COLLECTOR':
        return '/collector';
      case 'RECYCLER':
        return '/recycler';
      case 'ADMIN':
        return '/admin';
      case 'BUSINESS':
        return '/business';
      default:
        return '/household';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200/80">
      {/* SIH / National Evaluation Demo Quick Switcher Bar */}
      <div className="bg-emerald-950 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-emerald-200">⚡ Live Demo Mode:</span>
            <span className="hidden sm:inline text-stone-300">Instant Role Switcher:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {(['HOUSEHOLD', 'BUSINESS', 'COLLECTOR', 'RECYCLER', 'ADMIN'] as UserRole[]).map((r) => {
              const isCurrent = user?.role === r;
              const isAdmin = r === 'ADMIN';
              const labels: Record<UserRole, string> = {
                HOUSEHOLD: '🏠 Household',
                BUSINESS: '🏢 Business',
                COLLECTOR: '🛺 Kabadiwala',
                RECYCLER: '🏭 Recycler',
                ADMIN: '⚡ 1-Click Admin Console',
              };

              return (
                <button
                  key={r}
                  onClick={() => handleRoleSwitch(r)}
                  className={`px-2.5 py-0.5 rounded text-xs transition-all font-semibold ${
                    isAdmin
                      ? isCurrent
                        ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-300 font-extrabold shadow-sm'
                        : 'bg-amber-500 text-stone-950 hover:bg-amber-400 font-bold shadow-xs'
                      : isCurrent
                      ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 font-bold'
                      : 'bg-emerald-900/80 text-emerald-100 hover:bg-emerald-800'
                  }`}
                >
                  {labels[r]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 select-none group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-forest-900 flex items-center justify-center shadow-md shadow-emerald-900/15 text-white transition-transform group-hover:scale-105">
              <Recycle className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-emerald-950 block leading-tight">
                ScrapSetu
              </span>
              <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase block">
                {language === 'hi' ? 'स्क्रैपसेतु डिजिटल' : 'Digital Recycling Bridge'}
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                pathname === '/' ? 'text-emerald-800 bg-emerald-50' : 'text-stone-600 hover:text-emerald-800'
              }`}
            >
              Home
            </Link>
            <Link
              href="/how-it-works"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                pathname === '/how-it-works' ? 'text-emerald-800 bg-emerald-50' : 'text-stone-600 hover:text-emerald-800'
              }`}
            >
              How It Works
            </Link>
            <Link
              href="/rates"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                pathname === '/rates' ? 'text-emerald-800 bg-emerald-50' : 'text-stone-600 hover:text-emerald-800'
              }`}
            >
              Mandi Rates
            </Link>
            <Link
              href="/impact"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                pathname === '/impact' ? 'text-emerald-800 bg-emerald-50' : 'text-stone-600 hover:text-emerald-800'
              }`}
            >
              Green Impact
            </Link>

            {user && (
              <Link
                href={getDashboardHref()}
                className="ml-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm flex items-center gap-1.5"
              >
                <span>My Portal</span>
                <span className="bg-white/20 text-[10px] px-1.5 py-0.2 rounded font-mono uppercase">
                  {user.role}
                </span>
              </Link>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50 p-0.5 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg transition-all font-bold ${
                  language === 'en' ? 'bg-white shadow-xs text-emerald-800' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-lg transition-all font-bold font-hindi ${
                  language === 'hi' ? 'bg-white shadow-xs text-emerald-800' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Profile / Auth Button */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-stone-900 leading-tight">
                    {user.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold">
                    {user.role} {user.isVerified && '✓'}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-stone-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="default" size="sm">
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
