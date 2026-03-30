


import React, { useState } from 'react';
import { login, signInWithGoogle } from '../services/authService';
import type { User } from '../types';
import { Mail, Lock } from 'lucide-react';
import { useTranslations } from '../i18n/useTranslations';

interface LoginFormProps {
  onAuthSuccess: (user: User) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onAuthSuccess }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const user = await login(emailOrUsername, password);
      onAuthSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-blue-900/20">
      <h2 className="text-2xl font-bold text-center text-white mb-6">{t('signInTitle')}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="p-3 bg-red-900/40 text-red-300 border border-red-800 rounded-md text-sm">{error}</div>}
        
        <div>
          <label htmlFor="emailOrUsername" className="block text-sm font-medium text-slate-300 mb-2">{t('emailOrUsername')}</label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"><Mail size={16} className="text-slate-500" /></span>
            <input
              type="text"
              id="emailOrUsername"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-md ps-10 pe-4 py-2 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">{t('password')}</label>
           <div className="relative">
             <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"><Lock size={16} className="text-slate-500" /></span>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-800 border border-slate-700 rounded-md ps-10 pe-4 py-2 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
           </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg shadow-blue-600/40 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 disabled:bg-slate-700 disabled:shadow-none disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? t('signingIn') : t('signIn')}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-900 text-slate-400">{t('orContinueWith')}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={async () => {
            setIsLoading(true);
            try {
              const user = await signInWithGoogle();
              onAuthSuccess(user);
            } catch (err) {
              console.error("Google Sign-In Error:", err);
              setError(err instanceof Error ? err.message : 'Google Sign-In failed.');
            } finally {
              setIsLoading(false);
            }
          }}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-700 rounded-md text-slate-200 bg-slate-800 hover:bg-slate-700 transition-all font-medium"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          {t('signInWithGoogle')}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;