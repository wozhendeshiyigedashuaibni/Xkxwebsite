import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/i18n/translations';

export function useTranslation() {
  const { currentLanguage } = useLanguage();

  const t = (key: string): string => {
    const byLang = translations[currentLanguage]?.[key];
    if (byLang) return byLang;

    const byEn = translations.EN?.[key];
    if (byEn) return byEn;

    return key;
  };

  return { t, currentLanguage };
}
