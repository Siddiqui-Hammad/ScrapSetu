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
  UploadCloud,
  Scan,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';
import { PhotoMatchingVerificationWorkspace } from '@/components/workflows/PhotoMatchingVerificationWorkspace';

export default function RegisterPage() {
  const router = useRouter();
  const { demoLoginAs } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>('HOUSEHOLD');
  const [fullName, setFullName] = useState('Priya Sharma');
  const [phone, setPhone] = useState('9876543210');
  const [email, setEmail] = useState('priya@example.in');
  const [password, setPassword] = useState('password123');
  const [agreed, setAgreed] = useState(true);
  const [showKycVerification, setShowKycVerification] = useState(false);

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await demoLoginAs(selectedRole);
    redirectToRole(selectedRole);
  };

  const handleQuickDemo = (role: UserRole) => {
    setSelectedRole(role);
    demoLoginAs(role);
    redirectToRole(role);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-5xl w-full mx-auto space-y-6">
        {/* Switch Role (Demo Mode) Bar - Exact Match to Mockup */}
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

        {/* Dual Panel Auth Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-zinc-200/80">
          {/* Left Panel: Create Account Form */}
          <div className="space-y-6 md:pr-6 md:border-r md:border-zinc-200/80">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold mb-2">
                <span>Join India&apos;s Circular Network</span>
              </div>
              <h2 className="text-2xl font-black text-zinc-950 tracking-tight">
                Create Your Account
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Direct market rates, verified weighment, and traceable waste passports.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Priya Sharma"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-forest-900 focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-forest-900 focus:outline-hidden font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="priya@example.in"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-forest-900 focus:outline-hidden font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Register As
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2.5 text-xs bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-forest-900 focus:outline-hidden font-bold text-zinc-800"
                >
                  <option value="HOUSEHOLD">Household (Doorstep Scrap Seller)</option>
                  <option value="BUSINESS">Business (Bulk Waste Generator)</option>
                  <option value="COLLECTOR">Kabadiwala (Waste Collector)</option>
                  <option value="RECYCLER">Recycler Facility (Mill Processor)</option>
                </select>
              </div>

              {(selectedRole === 'COLLECTOR' || selectedRole === 'RECYCLER') && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scan className="w-4 h-4 text-forest-900" />
                      <span className="text-xs font-bold text-forest-900">AI Biometric Fast-Track KYC</span>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-200/80 text-forest-900 px-2 py-0.5 rounded-full">
                      Instant Clearance
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600">
                    Upload your Aadhaar Card / DL and capture a live selfie for immediate door-to-door verification.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowKycVerification(!showKycVerification)}
                    className="w-full text-xs font-bold bg-white border-emerald-300 text-forest-900 hover:bg-emerald-100"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                    <span>{showKycVerification ? 'Hide Biometric Verification' : 'Open Aadhaar/DL Photo Match'}</span>
                  </Button>
                </div>
              )}

              {showKycVerification && (
                <div className="pt-2">
                  <PhotoMatchingVerificationWorkspace />
                </div>
              )}

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

              <div className="flex items-center gap-2 text-xs text-zinc-600">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
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
          </div>

          {/* Right Panel: Role Benefits & Instant Login Link */}
          <div className="space-y-6 md:pl-6 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold mb-2">
                <span>Verified Circular Benefits</span>
              </div>
              <h3 className="text-xl font-black text-zinc-950 tracking-tight">
                Why Join ScrapSetu?
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Transforming waste disposal into an empowering economic and environmental opportunity.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-forest-900 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">Digital Weighing &amp; UPI Payout</div>
                  <div className="text-[11px] text-zinc-500">Zero fraud with certified Bluetooth digital scales and instant bank transfer.</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">Doorstep Collection on Demand</div>
                  <div className="text-[11px] text-zinc-500">Schedule at your convenience. Verified local kabadiwalas at your doorstep.</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">GreenKarma Rewards &amp; EPR Credits</div>
                  <div className="text-[11px] text-zinc-500">Track carbon savings, earn reward points, and receive government-compliant waste passports.</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200/80 flex items-center justify-between text-xs">
              <span className="text-zinc-500">Already registered?</span>
              <Link href="/login" className="font-extrabold text-forest-900 hover:underline flex items-center gap-1">
                <span>Sign in here</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
