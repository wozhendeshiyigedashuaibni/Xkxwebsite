import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage, type LanguageCode } from '@/contexts/LanguageContext';
import { CONTACT_CONFIG } from '@/config/contact';

interface HeaderProps {
  currentPage: string;
  sticky?: boolean;
}

export function Header({ currentPage, sticky = true }: HeaderProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { currentLanguage, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const languages: Array<{ code: LanguageCode; name: string; flag: string }> = [
    { code: 'EN', name: 'English', flag: '🇬🇧' },
    { code: 'ES', name: 'Español', flag: '🇪🇸' },
    { code: 'FR', name: 'Français', flag: '🇫🇷' },
    { code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'PT', name: 'Português', flag: '🇵🇹' },
    { code: 'IT', name: 'Italiano', flag: '🇮🇹' },
    { code: 'RU', name: 'Русский', flag: '🇷🇺' },
    { code: 'AR', name: 'العربية', flag: '🇸🇦' },
    { code: 'TR', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'JA', name: '日本語', flag: '🇯🇵' },
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const collectionsItems = [
    t('nav.dropdown.dresses'),
    t('nav.dropdown.womensets'),
    t('nav.dropdown.skirts'),
    t('nav.dropdown.hoodies'),
    t('nav.dropdown.tshirts'),
    t('nav.dropdown.denim'),
  ];

  const collectionsItemsSlugs = [
    'Dresses',
    'Women Sets',
    'Skirts',
    'Hoodies',
    'T-Shirts',
    'Denim & Bottoms',
  ];

  // Helper function to convert category name to URL-safe slug
  const toUrlSlug = (text: string) => {
    return encodeURIComponent(text.replace(/\s+/g, '-').toLowerCase());
  };

  const oemOdmItems = [
    { label: t('nav.dropdown.services'), value: 'services' },
    { label: t('nav.dropdown.sampling'), value: 'sampling' },
    { label: t('nav.dropdown.moq'), value: 'moq' },
    { label: t('nav.dropdown.process'), value: 'process' },
    { label: t('nav.dropdown.techpack'), value: 'techpack', download: true },
  ];

  return (
    <header className={`bg-white border-b border-gray-200 ${sticky ? 'sticky top-0 z-50' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity"
          >
            XIKAIXI GARMENT
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className={`hover:opacity-60 transition-opacity ${
                currentPage === 'home' ? 'opacity-100' : 'opacity-80'
              }`}
            >
              {t('nav.home')}
            </Link>

            {/* Collections Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('collections')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                to="/collections"
                className={`flex items-center gap-1 hover:opacity-60 transition-opacity ${
                  currentPage === 'collections' ? 'opacity-100' : 'opacity-80'
                }`}
              >
                {t('nav.collections')}
                <ChevronDown className="w-4 h-4" />
              </Link>
              {openDropdown === 'collections' && (
                <div className="absolute top-full left-0 pt-2">
                  <div className="w-56 bg-white border border-gray-200 shadow-lg rounded-md py-2">
                    {collectionsItems.map((item, index) => (
                      <Link
                        key={item}
                        to={`/collections/${toUrlSlug(collectionsItemsSlugs[index])}`}
                        onClick={() => setOpenDropdown(null)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* OEM/ODM Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('oem')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                to="/oem-odm"
                className={`flex items-center gap-1 hover:opacity-60 transition-opacity ${
                  currentPage === 'oem-odm' ? 'opacity-100' : 'opacity-80'
                }`}
              >
                {t('nav.oem')}
                <ChevronDown className="w-4 h-4" />
              </Link>
              {openDropdown === 'oem' && (
                <div className="absolute top-full left-0 pt-2">
                  <div className="w-56 bg-white border border-gray-200 shadow-lg rounded-md py-2">
                    {oemOdmItems.map((item) => (
                      <Link
                        key={item.value}
                        to={`/oem-odm#${item.value}`}
                        onClick={() => {
                          if (item.download) {
                            // Handle download
                            alert('Tech Pack Template download would start here');
                          }
                          setOpenDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        {item.label}
                        {item.download && (
                          <span className="text-xs text-gray-500 ml-2">{t('header.resources.download')}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/factory"
              className={`hover:opacity-60 transition-opacity ${
                currentPage === 'factory' ? 'opacity-100' : 'opacity-80'
              }`}
            >
              {t('nav.factory')}
            </Link>

            <Link
              to="/cases"
              className={`hover:opacity-60 transition-opacity ${
                currentPage === 'cases' ? 'opacity-100' : 'opacity-80'
              }`}
            >
              {t('nav.cases')}
            </Link>

            <Link
              to="/about"
              className={`hover:opacity-60 transition-opacity ${
                currentPage === 'about' ? 'opacity-100' : 'opacity-80'
              }`}
            >
              {t('nav.about')}
            </Link>

            <Link
              to="/contact"
              className={`hover:opacity-60 transition-opacity ${
                currentPage === 'contact' ? 'opacity-100' : 'opacity-80'
              }`}
            >
              {t('nav.contact')}
            </Link>
          </nav>

          {/* CTA Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('language')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <span className="text-xl">{currentLang.flag}</span>
                <span className="hidden xl:inline">{currentLang.name}</span>
                <span className="xl:hidden">{currentLang.code}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {openDropdown === 'language' && (
                <div className="absolute right-0 top-full pt-2 z-50">
                  <div className="w-56 bg-white border border-gray-200 shadow-lg rounded-md py-2 max-h-96 overflow-y-auto">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setOpenDropdown(null);
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                          currentLanguage === lang.code ? 'bg-gray-50 font-semibold' : ''
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="flex-1">{lang.name}</span>
                        <span className="text-gray-400 text-xs">{lang.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <Link
                to="/"
                className={`text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                  currentPage === 'home' ? 'font-semibold' : ''
                }`}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/collections"
                className={`text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                  currentPage === 'collections' ? 'font-semibold' : ''
                }`}
              >
                {t('nav.collections')}
              </Link>
              <Link
                to="/oem-odm"
                className={`text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                  currentPage === 'oem-odm' ? 'font-semibold' : ''
                }`}
              >
                {t('nav.oem')}
              </Link>
              <Link
                to="/factory"
                className={`text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                  currentPage === 'factory' ? 'font-semibold' : ''
                }`}
              >
                {t('nav.factory')}
              </Link>
              <Link
                to="/cases"
                className={`text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                  currentPage === 'cases' ? 'font-semibold' : ''
                }`}
              >
                {t('nav.cases')}
              </Link>
              <Link
                to="/about"
                className={`text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                  currentPage === 'about' ? 'font-semibold' : ''
                }`}
              >
                {t('nav.about')}
              </Link>
              <Link
                to="/contact"
                className={`text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                  currentPage === 'contact' ? 'font-semibold' : ''
                }`}
              >
                {t('nav.contact')}
              </Link>
              
              {/* Mobile Language Switcher */}
              <div className="px-4 py-2">
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-500 mb-2">Language / 语言</p>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                        }}
                        className={`px-3 py-2 border rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                          currentLanguage === lang.code ? 'bg-gray-50 border-gray-400 font-semibold' : 'border-gray-200'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="text-sm">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-2 flex flex-col gap-2">
                <Link
                  to="/contact"
                  className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  {t('nav.quote')}
                </Link>
                <a
                  href={CONTACT_CONFIG.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-center"
                >
                  {t('nav.whatsapp')}
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}