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
          {/* Role Pill Selector */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1.5">Select Role</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { r: 'HOUSEHOLD', label: '🏠 Household' },
                { r: 'BUSINESS', label: '🏢 Business' },
                { r: 'COLLECTOR', label: '🛺 Kabadiwala' },
                { r: 'RECYCLER', label: '🏭 Recycler' },
              ].map((item) => (
                <button
                  key={item.r}
                  type="button"
                  onClick={() => setRole(item.r as UserRole)}
                  className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                    role === item.r
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Kumar"
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Phone Number</label>
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

          {(role === 'BUSINESS' || role === 'RECYCLER') && (
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Company / Organization Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. GreenLeaf Logistics Pvt Ltd"
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-emerald-500"
                required
              />
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
