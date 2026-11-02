'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Printer
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';

const LocationModal = dynamic(() => import('@/components/LocationModal').then(m => m.LocationModal), { ssr: false });
const PrescriptionModal = dynamic(() => import('@/components/PrescriptionModal').then(m => m.PrescriptionModal), { ssr: false });
const CartDrawer = dynamic(() => import('@/components/CartDrawer').then(m => m.CartDrawer), { ssr: false });
const CheckoutModal = dynamic(() => import('@/components/CheckoutModal').then(m => m.CheckoutModal), { ssr: false });
const DeliverySuccessModal = dynamic(() => import('@/components/DeliverySuccessModal').then(m => m.DeliverySuccessModal), { ssr: false });
const InvoiceModal = dynamic(() => import('@/components/InvoiceModal').then(m => m.InvoiceModal), { ssr: false });
const AuthModal = dynamic(() => import('@/components/AuthModal').then(m => m.AuthModal), { ssr: false });
const AiChatbot = dynamic(() => import('@/components/AiChatbot').then(m => m.AiChatbot), { ssr: false });

export const LegalPageLayout = ({
  title,
  badgeText,
  badgeIcon: BadgeIcon = ShieldCheck,
  subtitle,
  lastUpdated = 'November 1, 2026',
  highlights = [],
  toc = [],
  children
}) => {
  const router = useRouter();
  const { setActiveTab } = useApp();
  const [activeSection, setActiveSection] = useState(toc[0]?.id || '');

  // Handle active TOC section highlight on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (let i = toc.length - 1; i >= 0; i--) {
        const section = document.getElementById(toc[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(toc[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  const handleBackToHome = () => {
    setActiveTab('home');
    router.push('/');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '80px' }}>
        {/* Breadcrumb & Navigation Bar */}
        <div style={{ background: 'white', borderBottom: '1px solid var(--border-color)', padding: '14px 0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              <button
                onClick={handleBackToHome}
                style={{
                  background: 'transparent',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }}
              >
                <ArrowLeft size={14} /> Back to Home
              </button>
              <ChevronRight size={14} color="#94a3b8" />
              <span>Legal &amp; Compliance</span>
              <ChevronRight size={14} color="#94a3b8" />
              <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{title}</span>
            </div>

            {/* Quick Actions (Print / Helpline) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handlePrint}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.785rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Printer size={13} /> Print Document
              </button>
            </div>
          </div>
        </div>

        {/* Hero Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--dark-navy) 0%, #0d2c47 60%, var(--medical-blue) 100%)',
            color: 'white',
            padding: '48px 0 40px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ maxWidth: '820px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(8px)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.785rem',
                  fontWeight: 700,
                  color: 'var(--health-green)',
                  marginBottom: '16px',
                  letterSpacing: '0.05em'
                }}
              >
                <BadgeIcon size={15} />
                <span>{badgeText}</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: 'white', marginBottom: '14px', lineHeight: 1.2 }}>
                {title}
              </h1>
              <p style={{ fontSize: '1.05rem', color: '#E9EFF2', lineHeight: 1.6, marginBottom: '20px' }}>
                {subtitle}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', fontSize: '0.8rem', color: '#E9EFF2' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} color="var(--health-green)" /> Last Updated: {lastUpdated}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} color="var(--health-green)" /> Verified for Med-in-Minutes Platform
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Highlights Row */}
        {highlights.length > 0 && (
          <div className="container" style={{ marginTop: '-24px', position: 'relative', zIndex: 3, marginBottom: '36px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {highlights.map((h, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-md)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: h.bgColor || '#ecfdf5',
                      color: h.iconColor || '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {h.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                      {h.title}
                    </h4>
                    <p style={{ fontSize: '0.785rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                      {h.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Document Content Area: 2-Column Responsive Layout */}
        <div className="container" style={{ marginTop: highlights.length > 0 ? '0' : '36px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '36px' }} className="legal-grid">
            <style jsx>{`
              .legal-grid {
                grid-template-columns: 1fr;
              }
              @media (min-width: 992px) {
                .legal-grid {
                  grid-template-columns: 280px minmax(0, 1fr) !important;
                }
              }
              @media (max-width: 767px) {
                .legal-article {
                  padding: 22px 16px !important;
                  border-radius: 16px !important;
                }
              }
            `}</style>

            {/* Left Sticky Table of Contents & Sidebar */}
            {toc.length > 0 && (
              <aside style={{ position: 'sticky', top: '96px', alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Table of Contents Card */}
                <div
                  style={{
                    background: 'white',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Table of Contents
                  </h3>
                  <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {toc.map((item) => {
                      const isActive = activeSection === item.id;
                      return (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            const elem = document.getElementById(item.id);
                            if (elem) {
                              const offset = 100;
                              const bodyRect = document.body.getBoundingClientRect().top;
                              const elementRect = elem.getBoundingClientRect().top;
                              const elementPosition = elementRect - bodyRect;
                              const offsetPosition = elementPosition - offset;
                              window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                              });
                              setActiveSection(item.id);
                            }
                          }}
                          style={{
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.825rem',
                            fontWeight: isActive ? 700 : 500,
                            color: isActive ? '#059669' : '#475569',
                            background: isActive ? '#ecfdf5' : 'transparent',
                            borderLeft: isActive ? '3px solid #059669' : '3px solid transparent',
                            textDecoration: 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {item.label}
                        </a>
                      );
                    })}
                  </nav>
                </div>

                {/* 24x7 Support Box in Sidebar */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    border: '1px solid #a7f3d0'
                  }}
                >
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#064e3b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} color="#059669" /> Have Questions?
                  </h4>
                  <p style={{ fontSize: '0.785rem', color: '#047857', lineHeight: 1.5, marginBottom: '14px' }}>
                    Our medical compliance and pharmacist desk is available 24x7 to assist you.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.785rem' }}>
                    <a
                      href="tel:1800633646"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#064e3b',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      <PhoneCall size={14} color="#059669" /> 1800-633-646 (Toll-Free)
                    </a>
                    <a
                      href="mailto:care@medinminutes.com"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#0284c7',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      <Mail size={14} color="#0284c7" /> care@medinminutes.com
                    </a>
                  </div>
                </div>
              </aside>
            )}

            {/* Right Main Content Body */}
            <article
              className="legal-article"
              style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '36px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                lineHeight: 1.7,
                color: '#334155'
              }}
            >
              {children}
            </article>
          </div>
        </div>
      </main>

      {/* Global Modals Mounted for Continuous Interaction */}
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
};
