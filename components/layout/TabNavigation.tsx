
import React from 'react';
import { Home, History, User, Shield, Briefcase } from 'lucide-react';
import type { User as UserType } from '../../types';
import { useTranslations } from '../../i18n/useTranslations';

type Tab = 'home' | 'history' | 'profile' | 'admin';

interface TabNavigationProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  currentUser: UserType | null;
}

const TabButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
    const baseClasses = "flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500";
    const activeClasses = "bg-blue-600 text-white shadow-md shadow-blue-900/50";
    const inactiveClasses = "text-slate-300 bg-slate-800/60 hover:bg-slate-700/80";

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            aria-current={isActive ? 'page' : undefined}
        >
            <span className="me-2">{icon}</span>
            {label}
        </button>
    );
};

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab, currentUser }) => {
  const { t } = useTranslations();
  
  const baseTabs: { id: Tab, labelKey: string, icon: React.ReactNode }[] = [
    { id: 'home', labelKey: 'tabHome', icon: <Home size={16} /> },
    { id: 'history', labelKey: 'tabHistory', icon: <History size={16} /> },
    { id: 'profile', labelKey: 'tabProfile', icon: <User size={16} /> },
  ];

  if (currentUser?.role === 'admin') {
      baseTabs.push({ id: 'admin', labelKey: 'tabAdmin', icon: <Shield size={16} /> });
  } else if (currentUser?.role === 'manager') {
      baseTabs.push({ id: 'admin', labelKey: 'tabManager', icon: <Briefcase size={16} /> });
  }

  return (
    <nav className={`p-1.5 bg-slate-900/70 border border-slate-800 rounded-lg grid grid-cols-${baseTabs.length} gap-2 max-w-md mx-auto`}>
      {baseTabs.map(tab => (
         <TabButton 
            key={tab.id}
            icon={tab.icon}
            label={t(tab.labelKey)}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
        />
      ))}
    </nav>
  );
};

export default TabNavigation;