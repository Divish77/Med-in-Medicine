'use client';

import React, { Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { LocationModal } from '@/components/LocationModal';
import { PrescriptionModal } from '@/components/PrescriptionModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { DeliverySuccessModal } from '@/components/DeliverySuccessModal';
import { InvoiceModal } from '@/components/InvoiceModal';
import { AuthModal } from '@/components/AuthModal';
import { AiChatbot } from '@/components/AiChatbot';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const HomepageAdditionalSections = dynamic(() => import('@/components/HomepageAdditionalSections').then((m) => m.HomepageAdditionalSections), { ssr: false });
const MedicinesPage = dynamic(() => import('@/components/MedicinesPage').then((m) => m.MedicinesPage), { ssr: false });
const OrderTrackingPage = dynamic(() => import('@/components/OrderTrackingPage').then((m) => m.OrderTrackingPage), { ssr: false });
const AboutPage = dynamic(() => import('@/components/AboutAndContact').then((m) => m.AboutPage), { ssr: false });
const ContactPage = dynamic(() => import('@/components/AboutAndContact').then((m) => m.ContactPage), { ssr: false });
const AdminPanel = dynamic(() => import('@/components/AdminPanel').then((m) => m.AdminPanel), { ssr: false });

export default function HomePage() {
  const {
    activeTab,
    setIsLocationModalOpen,
    toast
  } = useApp();

  // Automatic Location Popup on initial website open
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
        <Suspense fallback={<div className="container" role="status" style={{ padding: '48px 16px', color: 'var(--text-muted)' }}>Loading Med-in-Minutes…</div>}>
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
      <AiChatbot />

      {/* Footer */}
      <Footer />

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}

