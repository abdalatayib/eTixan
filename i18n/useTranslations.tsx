import { useContext } from 'react';
import { LanguageContext, type LanguageContextType } from './context';

export const useTranslations = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslations must be used within a LanguageProvider');
  }
  return context;
};
