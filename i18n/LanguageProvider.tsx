import React, { useState, useEffect, useCallback, type ReactNode } from 'react';
import { translations } from './translations';
import { appLocales, type AppLocale } from './locales';
import { LanguageContext } from './context';

const LANGUAGE_KEY = 'app_language';
const DEFAULT_LANGUAGE: AppLocale = 'en';

const getNestedTranslation = (obj: Record<string, unknown>, path: string): string | undefined => {
  return path.split('.').reduce((o: unknown, i) => (o ? (o as Record<string, unknown>)[i] : undefined), obj) as string | undefined;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLocale>(() => {
    try {
      const storedLang = localStorage.getItem(LANGUAGE_KEY);
      return storedLang && storedLang in appLocales ? (storedLang as AppLocale) : DEFAULT_LANGUAGE;
    } catch {
      return DEFAULT_LANGUAGE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_KEY, language);
      const isRtl = language === 'ar';
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    } catch (error) {
      console.error("Failed to save language or set direction", error);
    }
  }, [language]);

  const setLanguage = (lang: AppLocale) => {
    if (lang in appLocales) {
      setLanguageState(lang);
    }
  };

  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
    const langTranslations = translations[language] || translations[DEFAULT_LANGUAGE];
    const defaultTranslations = translations[DEFAULT_LANGUAGE];

    let translation = getNestedTranslation(langTranslations, key) || getNestedTranslation(defaultTranslations, key);

    if (translation === undefined) {
      console.warn(`Translation key "${key}" not found.`);
      return key;
    }

    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        translation = translation!.replace(`{{${placeholder}}}`, String(replacements[placeholder]));
      });
    }

    return translation;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
