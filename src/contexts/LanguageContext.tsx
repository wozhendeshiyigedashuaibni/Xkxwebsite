import { createContext, useContext, useState, ReactNode } from 'react';

export type LanguageCode = 'EN' | 'ES' | 'FR' | 'DE' | 'PT' | 'IT' | 'RU' | 'AR' | 'TR' | 'JA';

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'EN',
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('EN');

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  return context;
}