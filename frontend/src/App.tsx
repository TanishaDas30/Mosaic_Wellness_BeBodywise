import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { ExperienceTrackerPage } from './pages/ExperienceTrackerPage';
import { AddProductPage } from './pages/AddProductPage';
import { RoutineCheckerPage } from './pages/RoutineCheckerPage';
import { RoutinePlannerPage } from './pages/RoutinePlannerPage';
import { ReviewIntelligencePage } from './pages/ReviewIntelligencePage';
import { TimelinePage } from './pages/TimelinePage';
import { AssistantPage } from './pages/AssistantPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('landing');

  // Handle default routing
  React.useEffect(() => {
    if (!loading) {
      if (isAuthenticated && currentPage === 'landing') {
        setCurrentPage('dashboard');
      }
    }
  }, [isAuthenticated, loading]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-3 border-sage-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
            SkinSense Be Bodywise
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-ivory-50 text-charcoal-900 font-sans selection:bg-sage-200">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage
            onGetStarted={() => handleNavigate('auth')}
            onExploreDemo={() => handleNavigate('dashboard')}
          />
        )}

        {currentPage === 'auth' && (
          <AuthPage onSuccess={() => handleNavigate('dashboard')} />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'profile' && (
          <ProfilePage />
        )}

        {currentPage === 'experience' && (
          <ExperienceTrackerPage />
        )}

        {currentPage === 'add-product' && (
          <AddProductPage onSuccess={() => handleNavigate('dashboard')} />
        )}

        {currentPage === 'routine' && (
          <RoutineCheckerPage
            onNavigateToPlanner={() => handleNavigate('planner')}
            onNavigateToAddProduct={() => handleNavigate('add-product')}
          />
        )}

        {currentPage === 'planner' && (
          <RoutinePlannerPage />
        )}

        {currentPage === 'reviews' && (
          <ReviewIntelligencePage />
        )}

        {currentPage === 'timeline' && (
          <TimelinePage />
        )}

        {currentPage === 'assistant' && (
          <AssistantPage />
        )}

        {currentPage === 'admin' && (
          <AdminDashboardPage />
        )}
      </main>

      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
