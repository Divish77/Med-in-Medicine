import React, { lazy, Suspense, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { LocationModal } from './components/LocationModal';
import { PrescriptionModal } from './components/PrescriptionModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { DeliverySuccessModal } from './components/DeliverySuccessModal';
import { InvoiceModal } from './components/InvoiceModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const HomepageAdditionalSections = lazy(() => import('./components/HomepageAdditionalSections').then((module) => ({ default: module.HomepageAdditionalSections })));
const MedicinesPage = lazy(() => import('./components/MedicinesPage').then((module) => ({ default: module.MedicinesPage })));
const OrderTrackingPage = lazy(() => import('./components/OrderTrackingPage').then((module) => ({ default: module.OrderTrackingPage })));
const AboutPage = lazy(() => import('./components/AboutAndContact').then((module) => ({ default: module.AboutPage })));
const ContactPage = lazy(() => import('./components/AboutAndContact').then((module) => ({ default: module.ContactPage })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then((module) => ({ default: module.AdminPanel })));

export function AppContent() {
  const {
    activeTab,
    isLocationModalOpen,
    setIsLocationModalOpen,
    toast
  } = useApp();

  // Automatic Location Popup on initial website open (Mandatory Requirement 3)
  useEffect(() => {
    const hasSeenLocationPrompt = sessionStorage.getItem('mim_location_prompt_seen');
    if (!hasSeenLocationPrompt) {
      const timer = setTimeout(() => {
        setIsLocationModalOpen(true);
        sessionStorage.setItem('mim_location_prompt_seen', 'true');
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [setIsLocationModalOpen]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification Container */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            background: toast.type === 'error' ? '#dc2626' : toast.type === 'info' ? '#0284c7' : '#059669',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            fontWeight: 600,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {toast.type === 'error' ? (
            <AlertCircle size={20} />
          ) : toast.type === 'info' ? (
            <Info size={20} />
          ) : (
            <CheckCircle2 size={20} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar />

      {/* Dynamic Main Body Content */}
      <main style={{ flex: 1 }}>
        <Suspense fallback={<div className="container" role="status" style={{ padding: '48px 16px', color: 'var(--text-muted)' }}>Loading page…</div>}>
          {activeTab === 'home' && (
            <>
              <HeroSection />
              <HowItWorksSection />
              <HomepageAdditionalSections />
            </>
          )}

          {activeTab === 'medicines' && <MedicinesPage />}
          {activeTab === 'track' && <OrderTrackingPage />}
          {activeTab === 'admin' && <AdminPanel />}
          {activeTab === 'about' && <AboutPage />}
          {activeTab === 'contact' && <ContactPage />}
        </Suspense>
      </main>

      {/* Modals & Overlays */}
      <LocationModal />
      <PrescriptionModal />
      <CartDrawer />
      <CheckoutModal />
      <DeliverySuccessModal />
      <InvoiceModal />
      <AuthModal />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
