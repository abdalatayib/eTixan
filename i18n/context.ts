import { createContext } from 'react';
import { type AppLocale } from './locales';

export interface LanguageContextType {
  language: AppLocale;
  setLanguage: (language: AppLocale) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
