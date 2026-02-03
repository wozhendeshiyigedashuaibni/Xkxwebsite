import { Mail, MessageCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="mb-4">Dongguan Xikaixi Garment Co.,Ltd.</h3>
            <p className="text-sm text-gray-400 mb-4">
              Professional OEM/ODM women's apparel manufacturer for growing fashion brands.
            </p>
            <p className="text-sm text-gray-400 mb-3">
              3rd Floor, No. 5 Pedestrian Street, Second Industrial Zone, Humen Town, Dongguan, Guangdong, China
            </p>
            <p className="text-sm text-red-400">B2B only / No retail</p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button
                  onClick={() => onNavigate('collections')}
                  className="hover:text-white transition-colors"
                >
                  Dresses
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('collections')}
                  className="hover:text-white transition-colors"
                >
                  Women Sets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('collections')}
                  className="hover:text-white transition-colors"
                >
                  Skirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('collections')}
                  className="hover:text-white transition-colors"
                >
                  Hoodies
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('collections')}
                  className="hover:text-white transition-colors"
                >
                  T-Shirts & Tops
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button
                  onClick={() => onNavigate('oem-odm')}
                  className="hover:text-white transition-colors"
                >
                  OEM/ODM
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('factory')}
                  className="hover:text-white transition-colors"
                >
                  Factory & Quality
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cases')}
                  className="hover:text-white transition-colors"
                >
                  Cases
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:garment1@xikaixijenny.com"
                  className="hover:text-white transition-colors"
                >
                  garment1@xikaixijenny.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <a
                  href="https://wa.me/8618692498415"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: +86 186 9249 8415
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>© 2026 Dongguan Xikaixi Garment Co.,Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}