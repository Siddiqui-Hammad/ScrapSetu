import React, { useState } from 'react';
import { useAuth, DEMO_CREDENTIALS } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole } from '../../types';
import {
  Recycle,
  User as UserIcon,
  Globe,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Leaf,
  CalendarCheck,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, logout, demoLoginAs, isLoading } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleRoleSwitch = async (role: UserRole) => {
    await demoLoginAs(role);
    setDemoMenuOpen(false);
    // Route to appropriate dashboard
    if (role === 'COLLECTOR') setCurrentTab('collector-dash');
    else if (role === 'RECYCLER') setCurrentTab('recycler-dash');
    else if (role === 'ADMIN') setCurrentTab('admin-dash');
    else if (role === 'BUSINESS') setCurrentTab('business-dash');
    else setCurrentTab('household-dash');
  };

  const getDashboardTabForRole = () => {
    if (!user) return 'login';
    switch (user.role) {
      case 'COLLECTOR':
        return 'collector-dash';
      case 'RECYCLER':
        return 'recycler-dash';
      case 'ADMIN':
        return 'admin-dash';
      case 'BUSINESS':
        return 'business-dash';
      default:
        return 'household-dash';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* College Demonstration Quick Switcher Bar */}
      <div className="bg-emerald-950 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-emerald-200">⚡ SIH Demo Mode:</span>
            <span className="hidden sm:inline text-stone-300">Instant Role Switcher:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {(['HOUSEHOLD', 'BUSINESS', 'COLLECTOR', 'RECYCLER', 'ADMIN'] as UserRole[]).map((r) => {
              const isCurrent = user?.role === r;
              const labelMap: Record<UserRole, string> = {
                HOUSEHOLD: '🏠 Household',
                BUSINESS: '🏢 Business',
                COLLECTOR: '🛺 Kabadiwala',
                RECYCLER: '🏭 Recycler',
                ADMIN: '🛡️ Admin',
              };
              return (
                <button
                  key={r}
                  onClick={() => handleRoleSwitch(r)}
                  disabled={isLoading}
                  className={`px-2.5 py-0.5 rounded text-xs transition-all font-medium ${
                    isCurrent
                      ? 'bg-emerald-500 text-white font-bold ring-2 ring-emerald-300'
                      : 'bg-emerald-900/80 text-emerald-100 hover:bg-emerald-800'
                  }`}
                  title={DEMO_CREDENTIALS[r].desc}
                >
                  {labelMap[r]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => setCurrentTab('landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-forest-800 flex items-center justify-center shadow-md shadow-emerald-900/10 text-white">
              <Recycle className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-emerald-950 block leading-tight">
                ScrapSetu
              </span>
              <span className="text-[10px] font-medium text-emerald-700 tracking-wider uppercase block">
                {language === 'hi' ? 'स्क्रैपसेतु डिजिटल' : 'Digital Recycling Bridge'}
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('landing')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'landing' ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-stone-600 hover:text-emerald-700'
              }`}
            >
              {t.home}
            </button>
            <button
              onClick={() => setCurrentTab('how-it-works')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'how-it-works' ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-stone-600 hover:text-emerald-700'
              }`}
            >
              {t.howItWorks}
            </button>
            <button
              onClick={() => setCurrentTab('rates')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'rates' ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-stone-600 hover:text-emerald-700'
              }`}
            >
              {t.scrapRates}
            </button>
            <button
              onClick={() => setCurrentTab('impact')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'impact' ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-stone-600 hover:text-emerald-700'
              }`}
            >
              {t.impact}
            </button>

            {user && (
              <button
                onClick={() => setCurrentTab(getDashboardTabForRole())}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentTab.includes('dash') ? 'text-white bg-emerald-700 shadow-sm' : 'text-emerald-800 bg-emerald-100 hover:bg-emerald-200'
                }`}
              >
                <span>{t.dashboard}</span>
                <span className="text-[11px] bg-white/20 px-1.5 py-0.2 rounded font-semibold uppercase">
                  {user.role}
                </span>
              </button>
            )}
          </nav>

          {/* Right Actions: Language + Auth Profile */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center rounded-lg border border-stone-200 bg-stone-50 p-0.5 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  language === 'en' ? 'bg-white shadow-xs text-emerald-800 font-semibold' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  language === 'hi' ? 'bg-white shadow-xs text-emerald-800 font-semibold font-hindi' : 'text-stone-500 hover:text-stone-800 font-hindi'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* User Session */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                <div className="text-right">
                  <div className="text-sm font-semibold text-stone-900 leading-tight">
                    {user.name.split(' ')[0]}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium">
                    {user.role} {user.isVerified && '✓'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setCurrentTab('landing');
                  }}
                  className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title={t.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab('login')}
                  className="px-3.5 py-2 text-sm font-medium text-emerald-800 hover:text-emerald-950 transition-colors"
                >
                  {t.login}
                </button>
                <button
                  onClick={() => setCurrentTab('register')}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors"
                >
                  {t.register}
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="p-1.5 rounded-lg border border-stone-200 text-xs font-semibold text-emerald-800"
            >
              {language === 'en' ? 'HI' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-2 pb-6 space-y-2">
          <button
            onClick={() => {
              setCurrentTab('landing');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-100"
          >
            {t.home}
          </button>
          <button
            onClick={() => {
              setCurrentTab('how-it-works');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-100"
          >
            {t.howItWorks}
          </button>
          <button
            onClick={() => {
              setCurrentTab('rates');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-100"
          >
            {t.scrapRates}
          </button>
          <button
            onClick={() => {
              setCurrentTab('impact');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-100"
          >
            {t.impact}
          </button>

          {user && (
            <button
              onClick={() => {
                setCurrentTab(getDashboardTabForRole());
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-base font-semibold text-emerald-800 bg-emerald-50"
            >
              {t.dashboard} ({user.role})
            </button>
          )}

          <div className="pt-3 border-t border-stone-200">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setCurrentTab('landing');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-red-600 font-medium"
              >
                {t.logout} ({user.name})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setCurrentTab('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-sm font-medium border border-stone-300 rounded-lg"
                >
                  {t.login}
                </button>
                <button
                  onClick={() => {
                    setCurrentTab('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-sm font-medium text-white bg-emerald-700 rounded-lg"
                >
                  {t.register}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
