import { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { WhatsAppFloat } from '@/app/components/WhatsAppFloat';
import { HomePage } from '@/app/pages/HomePage';
import { CollectionsPage } from '@/app/pages/CollectionsPage';
import { ProductDetailPage } from '@/app/pages/ProductDetailPage';
import { OemOdmPage } from '@/app/pages/OemOdmPage';
import { FactoryPage } from '@/app/pages/FactoryPage';
import { CasesPage } from '@/app/pages/CasesPage';
import { AboutPage } from '@/app/pages/AboutPage';
import { ContactPage } from '@/app/pages/ContactPage';

type Page = 'home' | 'collections' | 'product-detail' | 'oem-odm' | 'factory' | 'cases' | 'about' | 'contact';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [collectionCategory, setCollectionCategory] = useState<string>('All');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const handleNavigate = (page: string, options?: { category?: string; anchor?: string; productId?: string }) => {
    setCurrentPage(page as Page);
    
    if (page === 'collections' && !options?.category) {
      setCollectionCategory('All');
    } else if (options?.category) {
      setCollectionCategory(options.category);
    }
    
    if (options?.productId) {
      setSelectedProductId(options.productId);
    }
    
    if (options?.anchor) {
      setTimeout(() => {
        const element = document.getElementById(options.anchor);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Navigation */}
      {currentPage !== 'product-detail' && (
        <>
          <Header currentPage={currentPage} onNavigate={handleNavigate} />
        </>
      )}
      
      {/* Product Detail Page - Navigation without sticky */}
      {currentPage === 'product-detail' && (
        <>
          <Header currentPage={currentPage} onNavigate={handleNavigate} sticky={false} />
        </>
      )}
      
      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'collections' && <CollectionsPage onNavigate={handleNavigate} category={collectionCategory} />}
        {currentPage === 'product-detail' && <ProductDetailPage onNavigate={handleNavigate} productId={selectedProductId} />}
        {currentPage === 'oem-odm' && <OemOdmPage onNavigate={handleNavigate} />}
        {currentPage === 'factory' && <FactoryPage onNavigate={handleNavigate} />}
        {currentPage === 'cases' && <CasesPage onNavigate={handleNavigate} />}
        {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {currentPage === 'contact' && <ContactPage onNavigate={handleNavigate} />}
      </main>

      <Footer onNavigate={handleNavigate} />
      <WhatsAppFloat />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}