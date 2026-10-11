import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { RatesPage } from './pages/RatesPage';
import { EnvironmentalImpactPage } from './pages/EnvironmentalImpactPage';
import { CreatePickupPage } from './pages/CreatePickupPage';
import { TrackPickupPage } from './pages/TrackPickupPage';
import { HouseholdDashboard } from './pages/HouseholdDashboard';
import { BusinessDashboard } from './pages/BusinessDashboard';
import { CollectorDashboard } from './pages/CollectorDashboard';
import { RecyclerDashboard } from './pages/RecyclerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SafetyPage, PrivacyPage, HelpPage } from './pages/StaticPages';

export const App: React.FC = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [selectedPickupId, setSelectedPickupId] = useState<string>('');

  const renderContent = () => {
    switch (currentTab) {
      case 'landing':
        return <LandingPage setCurrentTab={setCurrentTab} />;
      case 'how-it-works':
        return <HowItWorksPage setCurrentTab={setCurrentTab} />;
      case 'rates':
        return <RatesPage />;
      case 'impact':
        return <EnvironmentalImpactPage />;
      case 'create-pickup':
        return (
          <CreatePickupPage
            setCurrentTab={setCurrentTab}
            setSelectedPickupId={setSelectedPickupId}
          />
        );
      case 'track-pickup':
        return (
          <TrackPickupPage
            pickupId={selectedPickupId || 'sample'}
            setCurrentTab={setCurrentTab}
          />
        );
      case 'household-dash':
        return (
          <HouseholdDashboard
            setCurrentTab={setCurrentTab}
            setSelectedPickupId={setSelectedPickupId}
          />
        );
      case 'business-dash':
        return (
          <BusinessDashboard
            setCurrentTab={setCurrentTab}
            setSelectedPickupId={setSelectedPickupId}
          />
        );
      case 'collector-dash':
        return (
          <CollectorDashboard
            setCurrentTab={setCurrentTab}
            setSelectedPickupId={setSelectedPickupId}
          />
        );
      case 'recycler-dash':
        return <RecyclerDashboard />;
      case 'admin-dash':
        return <AdminDashboard />;
      case 'login':
        return <LoginPage setCurrentTab={setCurrentTab} />;
      case 'register':
        return <RegisterPage setCurrentTab={setCurrentTab} />;
      case 'safety':
        return <SafetyPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'help':
        return <HelpPage />;
      default:
        return <LandingPage setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <main className="flex-1">{renderContent()}</main>
      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
};

export default App;
