

import React from 'react';
import Header from '../Header';
import TabNavigation from './TabNavigation';
import type { User } from '../../types';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: 'home' | 'history' | 'profile' | 'admin';
  setActiveTab: (tab: 'home' | 'history' | 'profile' | 'admin') => void;
  currentUser: User | null;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, activeTab, setActiveTab, currentUser }) => {
  return (
    <>
      <Header />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} currentUser={currentUser} />
      <div className="mt-8 md:mt-12">
        {children}
      </div>
    </>
  );
};

export default MainLayout;