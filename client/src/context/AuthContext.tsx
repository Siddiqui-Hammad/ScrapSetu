import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  demoLoginAs: (role: UserRole) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_CREDENTIALS: Record<UserRole, { email: string; name: string; desc: string }> = {
  HOUSEHOLD: {
    email: 'household@scrapsetu.in',
    name: 'Pooja Verma',
    desc: 'Household Resident (Malviya Nagar, Jaipur)',
  },
  BUSINESS: {
    email: 'business@scrapsetu.in',
    name: 'Rohan Mehra',
    desc: 'GreenLeaf Logistics & Cafe (Bulk Waste Generator)',
  },
  COLLECTOR: {
    email: 'collector@scrapsetu.in',
    name: 'Ramkishan Sahu',
    desc: 'Verified Kabadiwala (Three-Wheeler Tempo RJ 14 TB 4921)',
  },
  RECYCLER: {
    email: 'recycler@scrapsetu.in',
    name: 'Aravalli Ecocycle',
    desc: 'Authorized Processing Plant (RIICO Industrial Area)',
  },
  ADMIN: {
    email: 'admin@scrapsetu.in',
    name: 'Vikramaditya Sharma',
    desc: 'ScrapSetu Regulatory Oversight & Compliance Admin',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('scrapsetu_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const savedToken = localStorage.getItem('scrapsetu_token');
    if (!savedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Session validation error:', err);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('scrapsetu_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('scrapsetu_token');
    setToken(null);
    setUser(null);
  };

  const demoLoginAs = async (role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      const creds = DEMO_CREDENTIALS[role];
      const res = await api.login({ email: creds.email, password: 'Demo@12345' });
      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Demo login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        refreshUser,
        demoLoginAs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
