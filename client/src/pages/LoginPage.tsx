import React, { useState } from 'react';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { UserRole } from '../types';
import { Recycle, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

interface LoginPageProps {
  setCurrentTab: (tab: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setCurrentTab }) => {
  const { login, demoLoginAs } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await api.login({ email, password });
      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        if (res.user.role === 'COLLECTOR') setCurrentTab('collector-dash');
        else if (res.user.role === 'RECYCLER') setCurrentTab('recycler-dash');
        else if (res.user.role === 'ADMIN') setCurrentTab('admin-dash');
        else if (res.user.role === 'BUSINESS') setCurrentTab('business-dash');
        else setCurrentTab('household-dash');
      } else {
        setErrorMsg(res.message || 'Invalid login credentials.');
      }
    } catch (err: any) {
      setErrorMsg('Server connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (role: UserRole) => {
    setIsLoading(true);
    const success = await demoLoginAs(role);
    if (success) {
      if (role === 'COLLECTOR') setCurrentTab('collector-dash');
      else if (role === 'RECYCLER') setCurrentTab('recycler-dash');
      else if (role === 'ADMIN') setCurrentTab('admin-dash');
      else if (role === 'BUSINESS') setCurrentTab('business-dash');
      else setCurrentTab('household-dash');
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xl space-y-6">
        {/* Logo & Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-md">
            <Recycle className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900">Sign in to ScrapSetu</h2>
          <p className="text-xs text-stone-500">
            A Digital Bridge to Sustainable Recycling
          </p>
        </div>

        {/* 1-Click Demo Accounts Box */}
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>SIH Evaluation Quick Login</span>
          </span>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => handleQuickDemo('HOUSEHOLD')}
              className="p-2 text-xs font-semibold bg-white hover:bg-emerald-100 rounded-xl border border-emerald-200 text-stone-800 text-left"
            >
              🏠 Household
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('BUSINESS')}
              className="p-2 text-xs font-semibold bg-white hover:bg-emerald-100 rounded-xl border border-emerald-200 text-stone-800 text-left"
            >
              🏢 Business
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('COLLECTOR')}
              className="p-2 text-xs font-semibold bg-white hover:bg-emerald-100 rounded-xl border border-emerald-200 text-stone-800 text-left"
            >
              🛺 Kabadiwala
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('RECYCLER')}
              className="p-2 text-xs font-semibold bg-white hover:bg-emerald-100 rounded-xl border border-emerald-200 text-stone-800 text-left"
            >
              🏭 Recycler Mill
            </button>
          </div>
          <button
            type="button"
            onClick={() => handleQuickDemo('ADMIN')}
            className="w-full p-2 text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-center"
          >
            🛡️ Administrator Console
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-200">
          Don't have an account yet?{' '}
          <button
            onClick={() => setCurrentTab('register')}
            className="text-emerald-700 font-bold hover:underline"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};
