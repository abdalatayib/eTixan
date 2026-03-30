export const appLocales = {
  en: 'English',
  es: 'Español',
  ar: 'العربية',
  so: 'Soomaali',
};

export const examGenerationLanguages = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  so: 'Somali',
  ar: 'Arabic',
};

export type AppLocale = keyof typeof appLocales;
export type ExamLocale = keyof typeof examGenerationLanguages;