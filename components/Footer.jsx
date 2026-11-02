'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, PhoneCall, Mail, MapPin, Clock, ArrowRight, Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { setActiveTab, setIsPrescriptionModalOpen, setIsLocationModalOpen } = useApp();

  const handleQuickNav = (tabId) => {
    setActiveTab(tabId);
    if (pathname !== '/') {
      router.push('/');
    }
  };

  const legalLinks = [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-of-service', label: 'Terms of Service' },
    { href: '/pharmacy-standards', label: 'Pharmacy Standards' }
  ];

  return (
    <footer className="site-footer" style={{ background: 'var(--dark-navy)', color: '#CBD5E1', padding: '68px 0 32px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <style>{`
        @media (max-width: 767px) {
          .site-footer {
            padding: 40px 0 96px !important;
          }
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          .footer-bottom {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
          .footer-legal-links {
            gap: 14px 20px !important;
          }
        }
      `}</style>

      <div className="container">
        {/* Main Footer Columns - Newbay Medical Structured Layout */}
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px', marginBottom: '44px' }}>
          
          {/* Column 1: About Med-in-Minutes */}
          <div style={{ minWidth: '220px' }}>
            <div style={{ marginBottom: '14px' }}>
              <img
                src="/logo.png"
                alt="Med-in-Minutes"
                style={{ height: '48px', objectFit: 'contain', background: 'white', padding: '4px 10px', borderRadius: '10px', cursor: 'pointer' }}
                onClick={() => handleQuickNav('home')}
              />
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '16px', color: '#E9EFF2' }}>
              Medicines at Your Doorstep in Just 10 Minutes! Hyperlocal express pharmacy fulfillment network delivering genuine medications, sterile surgicals, and wellness aids safely.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--health-green)', fontWeight: 700 }}>
              <ShieldCheck size={16} /> Certified Clinical Partner Network
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', marginBottom: '16px', letterSpacing: '0.2px' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <li>
                <button onClick={() => handleQuickNav('home')} style={{ background: 'transparent', color: '#E9EFF2', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleQuickNav('medicines')} style={{ background: 'transparent', color: '#E9EFF2', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
                  Order Medicines
                </button>
              </li>
              <li>
                <button onClick={() => setIsPrescriptionModalOpen(true)} style={{ background: 'transparent', color: '#E9EFF2', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
                  Upload Prescription
                </button>
              </li>
              <li>
                <button onClick={() => handleQuickNav('track')} style={{ background: 'transparent', color: '#E9EFF2', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
                  Track Order
                </button>
              </li>
              <li>
                <button onClick={() => setIsLocationModalOpen(true)} style={{ background: 'transparent', color: '#E9EFF2', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
                  Delivery Locations
                </button>
              </li>
              <li>
                <button onClick={() => handleQuickNav('admin')} style={{ background: 'transparent', color: '#E9EFF2', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Medicine Categories */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', marginBottom: '16px', letterSpacing: '0.2px' }}>
              Medicine Categories
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <li>
                <button onClick={() => handleQuickNav('medicines')} style={{ background: 'transparent', color: '#E9EFF2', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
                  Fever &amp; Pain Relief
                </button>
              </li>
              <li>
                <button onClick={() => handleQuickNav('medicines')} style={{ background: 'transparent', color: '#E9EFF2', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
                  Antibiotics &amp; Infection
                </button>
              </li>
              <li>
                <button onClick={() => handleQuickNav('medicines')} style={{ background: 'transparent', color: '#E9EFF2', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
                  Digestion &amp; Acidity
                </button>
              </li>
              <li>
                <button onClick={() => handleQuickNav('medicines')} style={{ background: 'transparent', color: '#E9EFF2', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
                  Cardiac &amp; Diabetes Care
                </button>
              </li>
              <li>
                <button onClick={() => handleQuickNav('medicines')} style={{ background: 'transparent', color: '#E9EFF2', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
                  Vitamins &amp; Immunity
                </button>
              </li>
              <li>
                <button onClick={() => handleQuickNav('medicines')} style={{ background: 'transparent', color: '#E9EFF2', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
                  First Aid &amp; Surgical
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Support */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', marginBottom: '16px', letterSpacing: '0.2px' }}>
              Customer Support
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <li>
                <button onClick={() => handleQuickNav('about')} style={{ background: 'transparent', color: '#E9EFF2', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleQuickNav('contact')} style={{ background: 'transparent', color: '#E9EFF2', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
                  Contact Us
                </button>
              </li>
              <li>
                <Link href="/privacy-policy" style={{ color: '#E9EFF2', textDecoration: 'none' }}>
                  Patient Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" style={{ color: '#E9EFF2', textDecoration: 'none' }}>
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/pharmacy-standards" style={{ color: '#E9EFF2', textDecoration: 'none' }}>
                  Pharmacy Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact Information */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', marginBottom: '16px', letterSpacing: '0.2px' }}>
              Contact Information
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.825rem', color: '#E9EFF2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PhoneCall size={15} color="var(--health-green)" />
                <span>24x7 Helpline: <strong>1800-633-646</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} color="var(--medical-blue)" />
                <span>Email: <strong>care@medinminutes.com</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Clock size={15} color="var(--health-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Hours: <strong>24 Hours, 7 Days a Week</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={15} color="var(--medical-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Express Hubs: Connaught Place, South Ext, Bandra &amp; Indirapuram</span>
              </div>
            </div>
          </div>

          {/* Column 6: Social Media & Compliance */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', marginBottom: '16px', letterSpacing: '0.2px' }}>
              Connect &amp; Social
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '12px', lineHeight: 1.5 }}>
              Follow updates on seasonal vaccines, health tips, and rapid delivery zone expansions.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map((network) => (
                <span
                  key={network}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: 'white',
                    padding: '5px 9px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {network}
                </span>
              ))}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
              DL No: DL-PH-2024-88421 • Registered under State Pharmacy Council
            </div>
          </div>

        </div>

        {/* Bottom Legal Navigation Bar */}
        <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.785rem' }}>
          <div>
            &copy; {CURRENT_YEAR} Med-in-Minutes Healthcare Technologies Pvt Ltd. All rights reserved.
          </div>
          <div className="footer-legal-links" style={{ display: 'flex', gap: '22px', flexWrap: 'wrap', alignItems: 'center' }}>
            {legalLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: isActive ? 'var(--health-green)' : '#E9EFF2',
                    fontWeight: isActive ? 700 : 500,
                    textDecoration: 'none',
                    borderBottom: isActive ? '2px solid var(--health-green)' : '1px solid transparent',
                    paddingBottom: '2px',
                    transition: 'all 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};
