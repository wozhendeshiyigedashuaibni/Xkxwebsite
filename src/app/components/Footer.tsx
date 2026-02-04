import { Link } from 'react-router-dom';
import { Mail, MessageCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { CONTACT_CONFIG } from '@/config/contact';

export function Footer() {
  const { t } = useTranslation();

  const categories: Array<{ labelKey: string; categoryName: string }> = [
    { labelKey: 'nav.dropdown.dresses', categoryName: 'Dresses' },
    { labelKey: 'nav.dropdown.womensets', categoryName: 'Women Sets' },
    { labelKey: 'nav.dropdown.skirts', categoryName: 'Skirts' },
    { labelKey: 'nav.dropdown.hoodies', categoryName: 'Hoodies' },
    { labelKey: 'nav.dropdown.tshirts', categoryName: 'T-Shirts' },
  ];

  const services: Array<{ labelKey: string; page: string }> = [
    { labelKey: 'nav.oem', page: '/oem-odm' },
    { labelKey: 'nav.factory', page: '/factory' },
    { labelKey: 'nav.cases', page: '/cases' },
    { labelKey: 'nav.about', page: '/about' },
    { labelKey: 'nav.contact', page: '/contact' },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="mb-4">{t('footer.companyName')}</h3>
            <p className="text-sm text-gray-400 mb-4">{t('footer.description')}</p>
            <p className="text-sm text-gray-400 mb-3">{t('footer.address.full')}</p>
            <p className="text-sm text-red-400">{t('footer.b2bOnly')}</p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-4">{t('footer.categories')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {categories.map((c) => (
                <li key={c.categoryName}>
                  <Link
                    to={`/collections/${c.categoryName}`}
                    className="hover:text-white transition-colors"
                  >
                    {t(c.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4">{t('footer.services')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {services.map((s) => (
                <li key={s.page}>
                  <Link
                    to={s.page}
                    className="hover:text-white transition-colors"
                  >
                    {t(s.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4">{t('footer.contact.title')}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a
                  href={`mailto:${CONTACT_CONFIG.salesEmail}`}
                  className="hover:text-white transition-colors"
                >
                  {CONTACT_CONFIG.salesEmail}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <a
                  href={CONTACT_CONFIG.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {t('footer.whatsappLabel')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>{t('footer.copyright')}</p>
          {/* Hidden Admin Link */}
          <Link 
            to="/admin-login" 
            className="inline-block mt-2 opacity-20 hover:opacity-100 transition-opacity text-xs"
            title="Admin Panel"
          >
            •
          </Link>
        </div>
      </div>
    </footer>
  );
}