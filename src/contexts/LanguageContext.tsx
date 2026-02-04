import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

export type LanguageCode = 'EN' | 'ES' | 'FR' | 'DE' | 'PT' | 'IT' | 'RU' | 'AR' | 'TR' | 'JA';

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('EN');

  const value = useMemo(
    () => ({
      currentLanguage,
      setLanguage: (lang: LanguageCode) => setCurrentLanguage(lang),
    }),
    [currentLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}