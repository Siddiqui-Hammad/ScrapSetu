'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Recycle,
  Lock,
  Phone,
  Mail,
  User,
  Building2,
  Truck,
  Factory,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { demoLoginAs } = useAuthStore();
  const [authMode, setAuthMode] = useState<'phone' | 'aadhaar'>('phone');
  const [identifier, setIdentifier] = useState('9876543210');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('HOUSEHOLD');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const redirectToRole = (role: UserRole) => {
    switch (role) {
      case 'COLLECTOR':
        router.push('/collector');
        break;
      case 'BUSINESS':
        router.push('/business');
        break;
      case 'RECYCLER':
        router.push('/recycler');
        break;
      case 'ADMIN':
        router.push('/admin');
        break;
      case 'HOUSEHOLD':
      default:
        router.push('/household');
        break;
    }
  };

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      await demoLoginAs(selectedRole);
      redirectToRole(selectedRole);
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    setSelectedRole(role);
    demoLoginAs(role);
    redirectToRole(role);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-5xl w-full mx-auto space-y-6">
        {/* Switch Role (Demo Mode) Bar - Exact Match to Mockup Row 1 Center/Right */}
        <div className="bg-forest-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Instant Sandbox Access
              </div>
              <div className="text-sm font-extrabold text-white">
                SWITCH ROLE (DEMO MODE)
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { role: 'HOUSEHOLD' as UserRole, label: 'Household', icon: User },
                { role: 'BUSINESS' as UserRole, label: 'Business', icon: Building2 },
                { role: 'COLLECTOR' as UserRole, label: 'Collector', icon: Truck },
                { role: 'RECYCLER' as UserRole, label: 'Recycler', icon: Factory },
                { role: 'ADMIN' as UserRole, label: 'Admin', icon: ShieldCheck },
              ]
            ).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.role}
                  onClick={() => handleQuickDemo(item.role)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    selectedRole === item.role
                      ? 'bg-emerald-500 text-forest-950 shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dual Panel Auth Container - Exact Match to Mockup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-zinc-200/80">
          {/* Left Panel: Welcome Back */}
          <div className="space-y-6 md:pr-6 md:border-r md:border-zinc-200/80">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold mb-2">
                <span>Secure Member Login</span>
              </div>
              <h2 className="text-2xl font-black text-zinc-950 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Access your pickups, earnings, verified batches, and digital passports.
              </p>
            </div>

            {/* Email/Mobile vs Aadhaar Tab */}
            <div className="flex rounded-xl bg-zinc-100 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAuthMode('phone')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  authMode === 'phone'
                    ? 'bg-white text-forest-900 shadow-2xs font-extrabold'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Email / Mobile
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('aadhaar')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  authMode === 'aadhaar'
                    ? 'bg-white text-forest-900 shadow-2xs font-extrabold'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Aadhaar (UIDAI OTP)
              </button>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleStandardLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  {authMode === 'phone' ? 'Email or Mobile Number' : '12-Digit Aadhaar Number'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                    {authMode === 'phone' ? <Phone className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={authMode === 'phone' ? '9876543210 or user@example.in' : 'XXXX-XXXX-XXXX'}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-forest-900 focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-forest-900 focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-forest-900 focus:ring-forest-900 border-zinc-300"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" className="font-bold text-forest-900 hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-forest-900 hover:bg-forest-950 text-white font-bold py-2.5 rounded-xl shadow-md text-xs"
              >
                {loading ? 'Authenticating...' : 'Login'}
              </Button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200" />
                </div>
                <span className="relative bg-white px-3 text-[11px] text-zinc-400 font-semibold uppercase">
                  or
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleQuickDemo('HOUSEHOLD')}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 border border-zinc-300 rounded-xl text-xs font-bold text-zinc-700 bg-white hover:bg-zinc-50 transition-colors shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.39 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.61 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>
          </div>

          {/* Right Panel: Create Your Account */}
          <div className="space-y-6 md:pl-6 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold mb-2">
                <span>New to ScrapSetu?</span>
              </div>
              <h2 className="text-2xl font-black text-zinc-950 tracking-tight">
                Create Your Account
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Join India&apos;s leading platform for circular resource recovery.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                redirectToRole(selectedRole);
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  defaultValue="Priya Sharma"
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-forest-900 focus:outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    defaultValue="9876543210"
                    placeholder="98765 43210"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-forest-900 focus:outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    defaultValue="priya@example.in"
                    placeholder="priya@example.in"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-forest-900 focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Register As
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-forest-900 focus:outline-hidden font-bold text-zinc-800"
                >
                  <option value="HOUSEHOLD">Household (Doorstep Scrap Seller)</option>
                  <option value="BUSINESS">Business (Bulk Waste Generator)</option>
                  <option value="COLLECTOR">Kabadiwala (Waste Collector)</option>
                  <option value="RECYCLER">Recycler Facility (Mill Processor)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  defaultValue="password123"
                  placeholder="Create a strong password"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-forest-900 focus:outline-hidden font-medium"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-600 pt-1">
                <input
                  type="checkbox"
                  defaultChecked
                  required
                  className="w-4 h-4 rounded text-forest-900 focus:ring-forest-900 border-zinc-300"
                />
                <span>
                  I agree to the{' '}
                  <a href="#" className="font-bold text-forest-900 hover:underline">
                    Terms &amp; Conditions
                  </a>
                </span>
              </div>

              <Button
                type="submit"
                className="w-full bg-forest-900 hover:bg-forest-950 text-white font-bold py-2.5 rounded-xl shadow-md text-xs"
              >
                Create Account
              </Button>
            </form>

            <div className="pt-2 text-center text-xs text-zinc-500">
              Already have verified credentials?{' '}
              <span className="font-bold text-forest-900">Sign in on the left</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
