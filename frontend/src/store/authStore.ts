import { create } from 'zustand';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  demoLoginAs: (role: UserRole) => void;
}

export const DEMO_USERS: Record<UserRole, User> = {
  HOUSEHOLD: {
    id: 'demo-household-01',
    name: 'Pooja Verma',
    email: 'household@scrapsetu.in',
    phone: '+91 98290 12345',
    role: 'HOUSEHOLD',
    languagePref: 'hi',
    isVerified: true,
    createdAt: new Date().toISOString(),
    addresses: [
      {
        id: 'addr-hh-01',
        userId: 'demo-household-01',
        label: 'Home',
        streetAddress: 'B-142, Malviya Nagar Sector 3',
        area: 'Malviya Nagar',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302017',
        lat: 26.8524,
        lng: 75.8173,
        isDefault: true,
      },
    ],
  },
  BUSINESS: {
    id: 'demo-business-01',
    name: 'GreenLeaf Logistics & Cafe',
    email: 'business@scrapsetu.in',
    phone: '+91 98290 33003',
    role: 'BUSINESS',
    languagePref: 'en',
    isVerified: true,
    createdAt: new Date().toISOString(),
    profile: {
      id: 'prof-b-01',
      userId: 'demo-business-01',
      businessName: 'GreenLeaf Logistics & Hospitality Pvt Ltd',
      gstNumber: '08AAAAA1234A1Z5',
      serviceAreaRadiusKm: 15.0,
      dailyCapacityKg: 500.0,
      isAvailable: true,
      totalPickupsCompleted: 34,
      reliabilityRating: 4.9,
    },
    addresses: [
      {
        id: 'addr-b-01',
        userId: 'demo-business-01',
        label: 'Central Hub',
        streetAddress: 'Industrial Bay 7, Sitapura',
        area: 'Sitapura Industrial Area',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302022',
        lat: 26.7725,
        lng: 75.8521,
        isDefault: true,
      },
    ],
  },
  COLLECTOR: {
    id: 'demo-collector-01',
    name: 'Ramkishan Sahu',
    email: 'collector@scrapsetu.in',
    phone: '+91 98290 11001',
    role: 'COLLECTOR',
    languagePref: 'hi',
    isVerified: true,
    createdAt: new Date().toISOString(),
    profile: {
      id: 'prof-c-01',
      userId: 'demo-collector-01',
      vehicleType: 'THREE_WHEELER',
      vehicleNumber: 'RJ 14 TB 4921',
      serviceAreaRadiusKm: 8.0,
      dailyCapacityKg: 250.0,
      acceptedCategories: JSON.stringify(['paper-cardboard', 'rigid-plastics', 'ferrous-metals']),
      isAvailable: true,
      totalPickupsCompleted: 87,
      reliabilityRating: 4.8,
    },
    addresses: [
      {
        id: 'addr-c-01',
        userId: 'demo-collector-01',
        label: 'Base Station',
        streetAddress: 'Shop 14, Sanganer Mandi Road',
        area: 'Sanganer',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302029',
        lat: 26.8501,
        lng: 75.8155,
        isDefault: true,
      },
    ],
  },
  RECYCLER: {
    id: 'demo-recycler-01',
    name: 'Aravalli Ecocycle Mills',
    email: 'recycler@scrapsetu.in',
    phone: '+91 98290 55005',
    role: 'RECYCLER',
    languagePref: 'en',
    isVerified: true,
    createdAt: new Date().toISOString(),
    profile: {
      id: 'prof-r-01',
      userId: 'demo-recycler-01',
      businessName: 'Aravalli Ecocycle Processing Ltd',
      gstNumber: '08BBBCC5678B1Z2',
      serviceAreaRadiusKm: 50.0,
      dailyCapacityKg: 5000.0,
      isAvailable: true,
      totalPickupsCompleted: 142,
      reliabilityRating: 5.0,
    },
    addresses: [
      {
        id: 'addr-r-01',
        userId: 'demo-recycler-01',
        label: 'Smelter & Pulp Plant',
        streetAddress: 'Plot 42-45, RIICO Industrial Zone',
        area: 'Mansarovar RIICO',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302020',
        lat: 26.8585,
        lng: 75.7645,
        isDefault: true,
      },
    ],
  },
  ADMIN: {
    id: 'demo-admin-01',
    name: 'Vikramaditya Sharma',
    email: 'admin@scrapsetu.in',
    phone: '+91 98290 99999',
    role: 'ADMIN',
    languagePref: 'en',
    isVerified: true,
    createdAt: new Date().toISOString(),
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: typeof window !== 'undefined' && localStorage.getItem('scrapsetu_user')
    ? JSON.parse(localStorage.getItem('scrapsetu_user')!)
    : DEMO_USERS.HOUSEHOLD,
  token: typeof window !== 'undefined' ? localStorage.getItem('scrapsetu_token') : 'demo_token_2026',
  isAuthenticated: true,
  isLoading: false,

  setAuth: (token, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('scrapsetu_token', token);
      localStorage.setItem('scrapsetu_user', JSON.stringify(user));
    }
    set({ token, user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('scrapsetu_token');
      localStorage.removeItem('scrapsetu_user');
    }
    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('scrapsetu_user', JSON.stringify(user));
    }
    set({ user });
  },

  demoLoginAs: (role) => {
    const demoUser = DEMO_USERS[role];
    if (typeof window !== 'undefined') {
      localStorage.setItem('scrapsetu_token', `demo_token_${role.toLowerCase()}`);
      localStorage.setItem('scrapsetu_user', JSON.stringify(demoUser));
    }
    set({ user: demoUser, token: `demo_token_${role.toLowerCase()}`, isAuthenticated: true });
  },
}));
