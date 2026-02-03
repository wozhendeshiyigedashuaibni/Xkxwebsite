import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/i18n/translations';

export function useTranslation() {
  const { currentLanguage } = useLanguage();
  
  const t = (key: string): string => {
    return translations[currentLanguage][key] || key;
  };
  
  return { t, currentLanguage };
}