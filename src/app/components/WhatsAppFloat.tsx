import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Backdrop - Transparent */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110"
        aria-label="WhatsApp"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Popup Menu */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 bg-white border border-gray-200 rounded-lg shadow-xl w-80 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="p-4 bg-green-500 text-white rounded-t-lg">
            <h3 className="font-semibold">Chat with our team</h3>
          </div>
          <div className="p-4 space-y-4">
            <a
              href="https://wa.me/8618692498415"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                  J
                </div>
                <div>
                  <div className="font-semibold">Jenny (Owner)</div>
                  <div className="text-sm text-gray-600">Sales Manager</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                MOQ / quote / categories / new projects
              </div>
            </a>
            <a
              href="https://wa.me/8615013374476"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                  J
                </div>
                <div>
                  <div className="font-semibold">Jedd</div>
                  <div className="text-sm text-gray-600">Production Coordinator</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                timeline / production / shipment / bulk orders
              </div>
            </a>
          </div>
        </div>
      )}
    </>
  );
}