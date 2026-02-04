import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { DevModeBanner } from './components/DevModeBanner';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { FactoryPage } from './pages/FactoryPage';
import { OemOdmPage } from './pages/OemOdmPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CasesPage } from './pages/CasesPage';
import { ContactPage } from './pages/ContactPage';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminContentPage from './pages/AdminContentPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';

// Scroll to top on route change
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function AppContent() {
  const { currentLanguage } = useLanguage();
  const location = useLocation();

  // Get current page from location for Header active state
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/collections')) return 'collections';
    if (path.startsWith('/product/')) return 'product-detail';
    if (path === '/oem-odm') return 'oem-odm';
    if (path === '/factory') return 'factory';
    if (path === '/cases') return 'cases';
    if (path === '/about') return 'about';
    if (path === '/contact') return 'contact';
    return 'home';
  };

  const currentPage = getCurrentPage();
  const isProductDetail = currentPage === 'product-detail';
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div dir={currentLanguage === 'AR' ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col">
      <ScrollToTop />
      
      {/* Development Mode Banner */}
      {!isAdminRoute && <DevModeBanner />}
      
      {/* Header - not shown on admin routes */}
      {!isAdminRoute && <Header currentPage={currentPage} sticky={!isProductDetail} />}
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:category" element={<CollectionsPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/oem-odm" element={<OemOdmPage />} />
          <Route path="/factory" element={<FactoryPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin/products" element={<ProtectedRoute><AdminProductsPage /></ProtectedRoute>} />
          <Route path="/admin/content" element={<ProtectedRoute><AdminContentPage /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
        </Routes>
      </main>

      {/* Footer - not shown on admin routes */}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppFloat />}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AdminAuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AdminAuthProvider>
    </LanguageProvider>
  );
}