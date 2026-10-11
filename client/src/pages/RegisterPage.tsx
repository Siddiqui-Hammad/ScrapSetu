import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { UserRole } from '../types';
import { Recycle, Lock, Mail, User, Phone, ArrowRight, AlertCircle, Building, Truck } from 'lucide-react';

interface RegisterPageProps {
  setCurrentTab: (tab: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ setCurrentTab }) => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('HOUSEHOLD');
  const [businessName, setBusinessName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('Jaipur');
  const [pincode, setPincode] = useState('302017');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        phone,
        role,
        businessName: role === 'BUSINESS' || role === 'RECYCLER' ? businessName : undefined,
        streetAddress,
        city,
        pincode,
      };

      const res = await api.register(payload);
      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        if (role === 'COLLECTOR') setCurrentTab('collector-dash');
        else if (role === 'RECYCLER') setCurrentTab('recycler-dash');
        else if (role === 'BUSINESS') setCurrentTab('business-dash');
        else setCurrentTab('household-dash');
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } catch (err) {
      setErrorMsg('Server connection failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-md">
            <Recycle className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900">Join ScrapSetu Platform</h2>
          <p className="text-xs text-stone-500">
            Select your role to connect to India's circular recycling ecosystem
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dynamic Role Dropdown Selector */}
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80">
            <label className="text-xs font-bold text-emerald-950 block mb-1.5">
              Register As (Select Role from Dropdown):
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full text-sm font-semibold p-3 rounded-xl border border-emerald-300 bg-white text-stone-900 focus:ring-2 focus:ring-emerald-500 shadow-xs cursor-pointer"
            >
              <option value="HOUSEHOLD">🏠 Household / Individual Generator</option>
              <option value="BUSINESS">🏢 Commercial Business / Bulk Waste Generator</option>
              <option value="COLLECTOR">🛺 Informal Waste Collector (Kabadiwala)</option>
              <option value="RECYCLER">🏭 Authorized Recycling Facility / Processor</option>
            </select>
            <p className="text-[11px] text-emerald-700 mt-1 font-medium">
              {role === 'HOUSEHOLD' && 'Ideal for residential scrap pickups, door-step weighing & digital receipts.'}
              {role === 'BUSINESS' && 'For corporate offices, factories & shops needing GST invoices & EPR audit logs.'}
              {role === 'COLLECTOR' && 'Mobile-optimized dashboard for daily routes, mandi pricing & instant payments.'}
              {role === 'RECYCLER' && 'Industrial intake, weighbridge logs & CPCB authorized recycling certificates.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                {role === 'COLLECTOR' ? 'Collector Full Name' : 'Full Name / Contact Person'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'COLLECTOR' ? 'e.g. Ramesh Kumar' : 'e.g. Aditi Sharma'}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Mobile Number (WhatsApp Enabled)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98290 00000"
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {/* Dynamic Role-Specific Fields */}
          {role === 'BUSINESS' && (
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-3">
              <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
                🏢 Business Registration Details
              </span>
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Company / Enterprise Legal Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. TechCorp Solutions Pvt Ltd"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">GSTIN (Optional)</label>
                  <input
                    type="text"
                    placeholder="08AAAAA0000A1Z5"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Primary Waste Generated</label>
                  <select className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white">
                    <option>Cardboard & Packaging</option>
                    <option>Electronic Waste (IT)</option>
                    <option>Office Paper & Shreds</option>
                    <option>Industrial Metals</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {role === 'COLLECTOR' && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                🛺 Collector Vehicle & Operational Info
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Collection Vehicle Type</label>
                  <select className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white">
                    <option>E-Rickshaw Loader (500 kg)</option>
                    <option>Manual Cycle Rickshaw (200 kg)</option>
                    <option>Mini Commercial Truck / Tata Ace (1000 kg)</option>
                    <option>Handcart (100 kg)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Operating Ward / Zone</label>
                  <input
                    type="text"
                    placeholder="e.g. Malviya Nagar & Mansarovar"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {role === 'RECYCLER' && (
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
              <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider block">
                🏭 Industrial Recycling Facility Credentials
              </span>
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Recycling Facility Legal Entity Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. EcoCycle Smelting & Pulp Mills Ltd"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">CPCB / SPCB License Reg No</label>
                  <input
                    type="text"
                    placeholder="e.g. CPCB/EPR/2026/0921"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Processing Capacity (Monthly)</label>
                  <select className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white">
                    <option>50 - 200 Tonnes / month</option>
                    <option>200 - 1,000 Tonnes / month</option>
                    <option>1,000+ Tonnes / month (Industrial)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh@example.com"
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">Pickup / Operating Address</label>
            <input
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="Plot No., Street, Colony"
              className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-200">
          Already registered?{' '}
          <button
            onClick={() => setCurrentTab('login')}
            className="text-emerald-700 font-bold hover:underline"
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
};
