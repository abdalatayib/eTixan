

import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import type { User } from '../types';
import Header from '../components/Header';
import { useTranslations } from '../i18n/useTranslations';

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { t } = useTranslations();

  return (
    <>
      <Header />
      <div className="max-w-md mx-auto mt-8">
        {isLoginView ? (
          <LoginForm onAuthSuccess={onAuthSuccess} />
        ) : (
          <RegisterForm onAuthSuccess={onAuthSuccess} />
        )}
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            {isLoginView
              ? t('dontHaveAccount')
              : t('alreadyHaveAccount')}
          </button>
        </div>
      </div>
    </>
  );
};

export default AuthPage;