

import React from 'react';
import { useTranslations } from '../i18n/useTranslations';

const Header: React.FC = () => {
  const { t } = useTranslations();
  return (
    <header className="text-center mb-10 md:mb-16">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text">
        eTixan
      </h1>
      <p className="mt-2 text-lg md:text-xl text-slate-400">{t('headerSubtitle')}</p>
    </header>
  );
};


export default Header;