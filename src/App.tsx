import { useEffect, useState } from 'react';
import { AdminPanel } from './components/AdminPanel';
import { BlogSection } from './components/BlogSection';
import { BookingSection } from './components/BookingSection';
import { ContactSection } from './components/ContactSection';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { PortfolioSection } from './components/PortfolioSection';
import { ServicesSection } from './components/ServicesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { testFirestoreConnection } from './lib/firebase';

export default function App() {
  const [view, setView] = useState<'landing' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#admin' || window.location.pathname === '/admin'
        ? 'admin'
        : 'landing';
    }
    return 'landing';
  });

  useEffect(() => {
    testFirestoreConnection();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        setView('admin');
      } else {
        setView('landing');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openAdmin = () => {
    window.location.hash = 'admin';
    setView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToSite = () => {
    if (window.location.pathname === '/admin') {
      window.history.pushState(null, '', '/');
    } else {
      window.location.hash = '';
    }
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ErrorBoundary>
      {view === 'admin' ? (
        <AdminPanel onBackToSite={backToSite} />
      ) : (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
          <Navbar onOpenAdmin={openAdmin} />
          <main className="flex-1">
            <HeroSection />
            <ServicesSection />
            <PortfolioSection />
            <BookingSection />
            <TestimonialsSection />
            <BlogSection />
            <FaqSection />
            <ContactSection />
          </main>
          <Footer onOpenAdmin={openAdmin} />
          <WhatsAppFloat />
        </div>
      )}
    </ErrorBoundary>
  );
}
