
import React, { useState, useEffect } from 'react';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/ErrorBoundary';
import { LanguageProvider } from './i18n/LanguageProvider';
import { getCurrentUser, logout } from './services/authService';
import type { User } from './types';


type Tab = 'home' | 'history' | 'profile' | 'admin';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const handleSignOut = () => {
    logout();
    setCurrentUser(null);
    setActiveTab('home'); 
  };
  
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'history':
        return <HistoryPage />;
      case 'profile':
        return <ProfilePage user={currentUser!} onSignOut={handleSignOut} />;
      case 'admin':
        if (currentUser?.role !== 'admin' && currentUser?.role !== 'manager') {
            // Redirect non-admins/non-managers trying to access the admin page
            setActiveTab('home');
            return <HomePage currentUser={currentUser!} onUserUpdate={handleUserUpdate} />;
        }
        return <AdminPage currentUser={currentUser} />;
      case 'home':
      default:
        return <HomePage currentUser={currentUser!} onUserUpdate={handleUserUpdate} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        {/* You can add a spinner here */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <Toaster position="top-center" richColors />
      <main className="container mx-auto px-4 py-8 md:py-12">
        {!currentUser ? (
          <AuthPage onAuthSuccess={handleAuthSuccess} />
        ) : (
          <MainLayout activeTab={activeTab} setActiveTab={setActiveTab} currentUser={currentUser}>
            {renderContent()}
          </MainLayout>
        )}
      </main>
    </div>
  );
};


const App: React.FC = () => (
    <LanguageProvider>
        <ErrorBoundary>
            <AppContent />
        </ErrorBoundary>
    </LanguageProvider>
);

export default App;