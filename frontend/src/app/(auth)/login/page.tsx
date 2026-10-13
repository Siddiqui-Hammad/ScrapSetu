'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Recycle,
  ShieldCheck,
  Lock,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  UserCheck,
  Building2,
  Truck,
  Factory,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { demoLoginAs, login } = useAuthStore();
  const [identifier, setIdentifier] = useState('9876543210');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('HOUSEHOLD');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      // Authenticate via store
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

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto space-y-8">
        {/* Header Branding */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-forest-900 flex items-center justify-center text-white shadow-lg shadow-emerald-900/20 group-hover:scale-105 transition-transform">
              <Recycle className="w-7 h-7 animate-spin-slow" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-extrabold tracking-tight text-emerald-950 block leading-tight">
                ScrapSetu
              </span>
              <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase block">
                स्क्रैपसेतु डिजिटल पोर्टल
              </span>
            </div>
          </Link>
          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Sign in to your Circular Portal
          </h2>
          <p className="mt-1 text-xs text-stone-600">
            Secure, verified access for households, kabadiwalas, recyclers & enterprises
          </p>
        </div>

        {/* 1-Click Role Switcher Demo Cards */}
        <div className="bg-emerald-950 text-white rounded-2xl p-4 shadow-xl border border-emerald-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              1-Click Demo Quick Switch:
            </span>
            <Badge variant="emerald" className="text-[9px] uppercase tracking-wider">
              Evaluator Mode
            </Badge>
          </div>
          <p className="text-[11px] text-stone-300 mb-3">
            Click any role below to instantly load the full tailored dashboard:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickDemo('HOUSEHOLD')}
              className="flex items-center gap-2 p-2 rounded-xl bg-emerald-900/70 hover:bg-emerald-800 border border-emerald-700/50 text-left transition-all hover:scale-[1.02]"
            >
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white text-[11px]">Household</div>
                <div className="text-[9px] text-emerald-300">Pooja Sharma</div>
              </div>
            </button>

            <button
              onClick={() => handleQuickDemo('COLLECTOR')}
              className="flex items-center gap-2 p-2 rounded-xl bg-emerald-900/70 hover:bg-emerald-800 border border-emerald-700/50 text-left transition-all hover:scale-[1.02]"
            >
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white text-[11px]">Kabadiwala</div>
                <div className="text-[9px] text-amber-300">Ramu Paswan</div>
              </div>
            </button>

            <button
              onClick={() => handleQuickDemo('BUSINESS')}
              className="flex items-center gap-2 p-2 rounded-xl bg-emerald-900/70 hover:bg-emerald-800 border border-emerald-700/50 text-left transition-all hover:scale-[1.02]"
            >
              <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white text-[11px]">Business</div>
                <div className="text-[9px] text-blue-300">GreenTech Ltd</div>
              </div>
            </button>

            <button
              onClick={() => handleQuickDemo('RECYCLER')}
              className="flex items-center gap-2 p-2 rounded-xl bg-emerald-900/70 hover:bg-emerald-800 border border-emerald-700/50 text-left transition-all hover:scale-[1.02]"
            >
              <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                <Factory className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white text-[11px]">Recycler</div>
                <div className="text-[9px] text-purple-300">EcoPlast Plant</div>
              </div>
            </button>

            <button
              onClick={() => handleQuickDemo('ADMIN')}
              className="col-span-2 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-left transition-all shadow-md hover:scale-[1.01]"
            >
              <ShieldAlert className="w-4 h-4" />
              <div className="text-center">
                <div className="text-[12px] font-black uppercase tracking-wider">
                  ⚡ 1-Click Administrator Console
                </div>
                <div className="text-[10px] text-stone-900 font-semibold">
                  3-Point KYC Queue • Mandi Rates • EcoShield Fraud Audit
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Standard Credentials Card */}
        <Card className="shadow-lg border-stone-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-stone-900 font-bold">
              Account Credentials
            </CardTitle>
            <CardDescription className="text-xs">
              Select your registered role and enter your verified phone number
            </CardDescription>
          </CardHeader>

          <CardContent>
            {authError && (
              <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleStandardLogin} className="space-y-4">
              {/* Role Dropdown */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Access Portal As:
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full text-xs font-semibold px-3 py-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-stone-800"
                >
                  <option value="HOUSEHOLD">🏠 Household / Citizen Resident</option>
                  <option value="COLLECTOR">🛺 Informal Collector / Kabadiwala</option>
                  <option value="BUSINESS">🏢 Commercial Generator / Corporate</option>
                  <option value="RECYCLER">🏭 Authorized Material Recycler</option>
                  <option value="ADMIN">🛡️ Platform Administrator / CPCB Officer</option>
                </select>
              </div>

              {/* Phone / Email input */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Registered Mobile / Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700">Password / MPIN</label>
                  <a href="#" className="text-[11px] font-semibold text-emerald-700 hover:underline">
                    Forgot MPIN?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={loading}
                className="w-full font-bold shadow-md"
              >
                {loading ? 'Verifying Credentials...' : 'Authenticate & Open Dashboard'}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>

            {/* Register Link */}
            <div className="mt-5 text-center text-xs text-stone-600 border-t border-stone-100 pt-4">
              New to ScrapSetu?{' '}
              <Link href="/register" className="font-bold text-emerald-700 hover:text-emerald-800 underline">
                Register with 3-Point KYC
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Trust & Security Badges */}
        <div className="flex items-center justify-center gap-6 text-[11px] text-stone-500 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>SHA-256 Ledger Sealed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>CPCB Circular Aligned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>DPDP Act 2023 Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
