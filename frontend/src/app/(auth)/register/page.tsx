'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Recycle,
  ShieldCheck,
  UploadCloud,
  Camera,
  FileText,
  CreditCard,
  Building,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const { demoLoginAs } = useAuthStore();

  // Primary form state
  const [role, setRole] = useState<UserRole>('HOUSEHOLD');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [pincode, setPincode] = useState('110001');
  const [password, setPassword] = useState('');

  // Role-specific state
  // Collector fields
  const [vehicleType, setVehicleType] = useState('E_RICKSHAW');
  const [dailyCapacityKg, setDailyCapacityKg] = useState('350');
  const [upiId, setUpiId] = useState('');

  // Business fields
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [industrySector, setIndustrySector] = useState('COMMERCIAL_TECH');

  // Recycler fields
  const [facilityName, setFacilityName] = useState('');
  const [cpcbLicenseNumber, setCpcbLicenseNumber] = useState('');
  const [weighbridgeTonnage, setWeighbridgeTonnage] = useState('50');

  // 3-Point KYC state
  const [aadhaarFile, setAadhaarFile] = useState<string | null>(null);
  const [licenseFile, setLicenseFile] = useState<string | null>(null);
  const [selfieFile, setSelfieFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Simulated file upload handlers
  const handleAadhaarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAadhaarFile(e.target.files[0].name);
    } else {
      setAadhaarFile('aadhaar_card_front_back.pdf');
    }
  };

  const handleLicenseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLicenseFile(e.target.files[0].name);
    } else {
      setLicenseFile('driving_license_valid.pdf');
    }
  };

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelfieFile(e.target.files[0].name);
    } else {
      setSelfieFile('live_selfie_liveness_verified.jpg');
    }
  };

  // Quick autofill KYC for testing
  const autofillKycDocs = () => {
    setAadhaarFile('aadhaar_verified_masked.pdf');
    setLicenseFile('driving_licence_dl042023.pdf');
    setSelfieFile('live_face_liveness_pass.jpg');
    if (!fullName) setFullName('Ramesh Kumar');
    if (!phone) setPhone('9810123456');
    if (!email) setEmail('ramesh@scrapsetuexample.in');
  };

  const kycCount = [aadhaarFile, licenseFile, selfieFile].filter(Boolean).length;
  const kycPercent = Math.round((kycCount / 3) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate registration and log in with the selected role
      await demoLoginAs(role);
      setSuccessMessage('Registration & 3-Point KYC uploaded successfully! Redirecting...');

      setTimeout(() => {
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
      }, 1000);
    } catch (err: any) {
      alert('Registration error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-forest-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Recycle className="w-6 h-6 animate-spin-slow" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-emerald-950">
              ScrapSetu
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Create Verified Circular Account
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Dynamic registration with 3-Point KYC verification (Aadhaar, Driving Licence & Live Selfie)
          </p>
        </div>

        {/* Registration Card */}
        <Card className="shadow-xl border-stone-200">
          <CardHeader className="bg-gradient-to-r from-emerald-900 via-forest-900 to-emerald-950 text-white rounded-t-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg text-white font-black flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Select Your Platform Role
                </CardTitle>
                <CardDescription className="text-emerald-200 text-xs mt-0.5">
                  Your dashboard tools, compliance reports, and workflows configure dynamically
                </CardDescription>
              </div>

              {/* Dynamic Role Dropdown */}
              <div className="w-full sm:w-64">
                <label className="block text-[10px] font-bold uppercase text-emerald-300 tracking-wider mb-1">
                  Registering As:
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full text-xs font-bold px-3 py-2 bg-emerald-800 text-white border border-emerald-600 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                >
                  <option value="HOUSEHOLD">🏠 Household / Citizen Resident</option>
                  <option value="COLLECTOR">🛺 Informal Collector / Kabadiwala</option>
                  <option value="BUSINESS">🏢 Commercial Generator / Bulk Producer</option>
                  <option value="RECYCLER">🏭 Authorized Material Recycler Plant</option>
                  <option value="ADMIN">🛡️ Platform Administrator / Inspector</option>
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {successMessage && (
              <div className="mb-6 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: Basic Identity Information */}
              <div>
                <h3 className="text-sm font-black text-stone-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-700" />
                  1. Basic Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Mobile Number (WhatsApp linked)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                      <input
                        type="tel"
                        required
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                      <input
                        type="email"
                        required
                        placeholder="user@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Create Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                      <input
                        type="password"
                        required
                        placeholder="Min 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Operating City / Region</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. New Delhi / Noida"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Postal Pincode</label>
                    <input
                      type="text"
                      required
                      placeholder="110001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 2: Role-Specific Dynamic Fields */}
              <div className="border-t border-stone-200 pt-4">
                <h3 className="text-sm font-black text-stone-900 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  2. Role Specific Verification Details ({role})
                </h3>

                {/* For Collector / Kabadiwala */}
                {role === 'COLLECTOR' && (
                  <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-3 text-xs">
                    <div className="flex items-center gap-2 font-bold text-amber-900">
                      <Truck className="w-4 h-4 text-amber-700" />
                      Kabadiwala Fleet & Payout Information
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Vehicle Type</label>
                        <select
                          value={vehicleType}
                          onChange={(e) => setVehicleType(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                        >
                          <option value="TRICYCLE">Manual Cycle Rickshaw</option>
                          <option value="E_RICKSHAW">E-Rickshaw Loader</option>
                          <option value="MINI_TRUCK">Tata Ace / Mini Truck</option>
                          <option value="TWO_WHEELER">Modified Scooter / Bike</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Daily Capacity (kg)</label>
                        <input
                          type="number"
                          value={dailyCapacityKg}
                          onChange={(e) => setDailyCapacityKg(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Instant Payout UPI VPA</label>
                        <input
                          type="text"
                          placeholder="ramu@okaxis / 9876543210@paytm"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* For Business / Corporate */}
                {role === 'BUSINESS' && (
                  <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-3 text-xs">
                    <div className="flex items-center gap-2 font-bold text-blue-900">
                      <Building className="w-4 h-4 text-blue-700" />
                      Commercial Entity & EPR Profile
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Company Legal Name</label>
                        <input
                          type="text"
                          placeholder="GreenTech Enterprises Ltd"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">GSTIN Number (15 Digits)</label>
                        <input
                          type="text"
                          placeholder="07AAAAA0000A1Z5"
                          value={gstin}
                          onChange={(e) => setGstin(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-mono uppercase"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Industry Sector</label>
                        <select
                          value={industrySector}
                          onChange={(e) => setIndustrySector(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                        >
                          <option value="COMMERCIAL_TECH">IT Park & Tech Facility</option>
                          <option value="MANUFACTURING">Industrial Manufacturing</option>
                          <option value="HOSPITALITY">Hotel & Restaurant Chain</option>
                          <option value="RETAIL_MALL">Commercial Retail Mall</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* For Recycler */}
                {role === 'RECYCLER' && (
                  <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 space-y-3 text-xs">
                    <div className="flex items-center gap-2 font-bold text-purple-900">
                      <Recycle className="w-4 h-4 text-purple-700" />
                      State Pollution Control Board (SPCB) & CPCB Credentials
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Plant / Facility Name</label>
                        <input
                          type="text"
                          placeholder="EcoPlast Reclaimers Pvt Ltd"
                          value={facilityName}
                          onChange={(e) => setFacilityName(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">CPCB Registration Number</label>
                        <input
                          type="text"
                          placeholder="CPCB/PWM/DEL-2024/092"
                          value={cpcbLicenseNumber}
                          onChange={(e) => setCpcbLicenseNumber(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Weighbridge Capacity</label>
                        <select
                          value={weighbridgeTonnage}
                          onChange={(e) => setWeighbridgeTonnage(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                        >
                          <option value="20">20 Metric Tonnes</option>
                          <option value="50">50 Metric Tonnes</option>
                          <option value="100">100 Metric Tonnes</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* For Household */}
                {role === 'HOUSEHOLD' && (
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-900">
                    <p className="font-semibold">
                      🏡 Individual resident accounts receive doorstep zero-charge scrap pickups, live
                      ScrapVision AI pricing estimates, and digital eco-rewards upon weighing.
                    </p>
                  </div>
                )}

                {/* For Admin */}
                {role === 'ADMIN' && (
                  <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 text-xs text-amber-950 font-medium">
                    🛡️ Administrator accounts undergo multi-factor cryptographic hardware token and CPCB department sign-off before permission escalation.
                  </div>
                )}
              </div>

              {/* STEP 3: 3-POINT KYC DOSSIER UPLOAD (Aadhaar + Driving Licence + Live Selfie) */}
              <div className="border-t border-stone-200 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      3. Mandatory 3-Point KYC Verification Dossier
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Upload your Aadhaar Card, Driving Licence, and Live Camera Selfie for instant AI liveness & fraud check
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={autofillKycDocs}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 w-fit"
                  >
                    ⚡ Fast Autofill Demo Docs
                  </button>
                </div>

                {/* KYC Progress Indicator */}
                <div className="bg-stone-100 rounded-xl p-2.5 mb-4">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-stone-700">KYC Dossier Readiness:</span>
                    <span className={kycPercent === 100 ? 'text-emerald-700' : 'text-amber-700'}>
                      {kycCount}/3 Documents Ready ({kycPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        kycPercent === 100 ? 'bg-emerald-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${kycPercent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Doc 1: Aadhaar Card */}
                  <div
                    className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
                      aadhaarFile
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-stone-300 hover:border-emerald-500 bg-white'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-emerald-700 mb-2">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-stone-800">1. Aadhaar Card</div>
                    <div className="text-[10px] text-stone-500 mb-3">Front & Back (Masked)</div>

                    {aadhaarFile ? (
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Uploaded
                      </div>
                    ) : (
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl">
                        <UploadCloud className="w-3.5 h-3.5" />
                        Browse PDF/JPG
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleAadhaarUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Doc 2: Driving Licence */}
                  <div
                    className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
                      licenseFile
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-stone-300 hover:border-emerald-500 bg-white'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-emerald-700 mb-2">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-stone-800">2. Driving Licence</div>
                    <div className="text-[10px] text-stone-500 mb-3">State Transport Auth</div>

                    {licenseFile ? (
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Uploaded
                      </div>
                    ) : (
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl">
                        <UploadCloud className="w-3.5 h-3.5" />
                        Browse DL
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleLicenseUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Doc 3: Live Selfie */}
                  <div
                    className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
                      selfieFile
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-stone-300 hover:border-emerald-500 bg-white'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-emerald-700 mb-2">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-stone-800">3. Live Selfie Check</div>
                    <div className="text-[10px] text-stone-500 mb-3">Instant Liveness Match</div>

                    {selfieFile ? (
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Selfie Verified
                      </div>
                    ) : (
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl">
                        <Camera className="w-3.5 h-3.5" />
                        Capture / Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSelfieUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full font-bold shadow-lg text-sm"
                >
                  {isSubmitting ? (
                    'Creating Verified Account...'
                  ) : (
                    <>
                      Complete 3-Point Registration & Enter Portal
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-5 text-center text-xs text-stone-600 border-t border-stone-100 pt-4">
              Already have a ScrapSetu account?{' '}
              <Link href="/login" className="font-bold text-emerald-700 hover:text-emerald-800 underline">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
