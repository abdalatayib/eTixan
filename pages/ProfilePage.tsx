
import React from 'react';
import { User as UserIcon, LogOut, Info } from 'lucide-react';
import type { User } from '../types';
import { useTranslations } from '../i18n/useTranslations';
import { appLocales, type AppLocale } from '../i18n/locales';

interface ProfilePageProps {
  user: User;
  onSignOut: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onSignOut }) => {
  const { t, language, setLanguage } = useTranslations();
  
  const examsLeft = user.examLimit - user.examsGenerated;
  const percentageUsed = (user.role === 'admin' || user.role === 'manager') ? 0 : Math.min((user.examsGenerated / user.examLimit) * 100, 100);

  const renderContactAdminMessage = () => {
    const message = t('contactAdmin');
    const parts = message.split(/<1>|<\/1>/);
    return (
      <p>
        {parts[0]}
        <a href="https://wa.me/252771641609" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-400 hover:underline">
          {parts[1]}
        </a>
        {parts[2]}
      </p>
    );
  };

  return (
    <div className="max-w-md mx-auto mt-10 text-center">
        <UserIcon size={64} className="text-slate-500 mb-4 mx-auto" />
        <h2 className="text-3xl font-bold text-white">{user.username}</h2>
        <p className="text-slate-400 mt-2">{user.email}</p>

        <div className="mt-8 text-start p-5 bg-slate-900 border border-slate-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">{t('appLanguage')}</h3>
            <div className="flex gap-2">
                {Object.entries(appLocales).map(([key, name]) => (
                    <button
                        key={key}
                        onClick={() => setLanguage(key as AppLocale)}
                        className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 ${
                            language === key
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                    >
                        {name}
                    </button>
                ))}
            </div>
        </div>

        <div className="mt-8 text-start p-5 bg-slate-900 border border-slate-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">{t('examStatus')}</h3>
            {user.role === 'admin' || user.role === 'manager' ? (
                <p className="text-teal-400">{t('unlimited')}</p>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-1 text-sm text-slate-300">
                        <span>{user.examsGenerated} / {user.examLimit} {t('used')}</span>
                        <span className="font-bold text-blue-400">{examsLeft} {t('left')}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${percentageUsed}%` }}></div>
                    </div>
                </>
            )}
        </div>

        {user.role !== 'admin' && user.role !== 'manager' && (
            <div className="mt-6 text-sm text-slate-400 bg-slate-800/50 p-4 rounded-lg flex items-start gap-3 text-start">
                <Info size={24} className="flex-shrink-0 mt-0.5 text-blue-400" />
                {renderContactAdminMessage()}
            </div>
        )}
        
        <div className="mt-8 border-t border-slate-800 my-6"></div>

        <button
          onClick={onSignOut}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-slate-900 transition-colors"
        >
          <LogOut size={20} className="me-2" />
          {t('signOut')}
        </button>
    </div>
  );
};

export default ProfilePage;
