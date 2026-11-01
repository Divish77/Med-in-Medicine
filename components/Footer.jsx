'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, PhoneCall, Mail } from 'lucide-react';
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
    <footer className="site-footer" style={{ background: '#0f172a', color: '#94a3b8', padding: '60px 0 30px', borderTop: '1px solid #1e293b' }}>
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
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '36px', marginBottom: '40px' }}>
          {/* Brand Info */}
          <div>
            <div style={{ marginBottom: '14px' }}>
              <img
                src="/logo.png"
                alt="Med-in-Minutes"
                style={{ height: '52px', objectFit: 'contain', background: 'white', padding: '4px 10px', borderRadius: '10px', cursor: 'pointer' }}
                onClick={() => handleQuickNav('home')}
              />
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '16px', color: '#cbd5e1' }}>
              Making healthcare accessible in 10 minutes by connecting nearby verified pharmacies to doorstep delivery partners.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
              <ShieldCheck size={16} /> Licensed Pharmacy Fulfillment Network
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', marginBottom: '16px' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <li>
                <button onClick={() => handleQuickNav('home')} style={{ background: 'transparent', color: '#cbd5e1', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleQuickNav('medicines')} style={{ background: 'transparent', color: '#cbd5e1', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
                  Order Medicines
                </button>
              </li>
              <li>
                <button onClick={() => setIsPrescriptionModalOpen(true)} style={{ background: 'transparent', color: '#cbd5e1', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
                  Upload Prescription
                </button>
              </li>
              <li>
                <button onClick={() => handleQuickNav('track')} style={{ background: 'transparent', color: '#cbd5e1', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
                  Track Active Order
                </button>
              </li>
              <li>
                <button onClick={() => setIsLocationModalOpen(true)} style={{ background: 'transparent', color: '#cbd5e1', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
                  Change Delivery Location
                </button>
              </li>
              <li>
                <button onClick={() => handleQuickNav('admin')} style={{ background: 'transparent', color: '#cbd5e1', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
                  Admin Sign In
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', marginBottom: '16px' }}>
              Medicine Categories
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <li>Pain Relief &amp; Fever (Dolo, Crocin)</li>
              <li>Antibiotics (Azithral, Augmentin)</li>
              <li>Stomach Care &amp; Antacids (Pan 40)</li>
              <li>Diabetes &amp; Cardiac Care</li>
              <li>Vitamins &amp; Calcium Supplements</li>
              <li>First Aid &amp; Emergency Devices</li>
            </ul>
          </div>

          {/* Medical Disclaimer & Emergency */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', marginBottom: '16px' }}>
              Medical Disclaimer
            </h4>
            <p style={{ fontSize: '0.75rem', lineHeight: 1.6, color: '#94a3b8', marginBottom: '12px' }}>
              Med-in-Minutes is an on-demand medical logistics and pharmacy aggregator platform. Schedule H and X prescription drugs require a valid doctor&apos;s prescription verified before dispensing. Do not self-medicate.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
              <div style={{ color: '#fef08a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <PhoneCall size={14} /> Helpline: <strong>1800-633-646</strong> (24x7)
              </div>
              <div style={{ color: '#7dd3fc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} /> Support: <strong>care@medinminutes.com</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Navigation Bar */}
        <div className="footer-bottom" style={{ borderTop: '1px solid #1e293b', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.785rem' }}>
          <div>
            &copy; {CURRENT_YEAR} Med-in-Minutes Healthcare Technologies Pvt Ltd. All rights reserved.
          </div>
          <div className="footer-legal-links" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            {legalLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: isActive ? '#10b981' : '#cbd5e1',
                    fontWeight: isActive ? 700 : 500,
                    textDecoration: 'none',
                    borderBottom: isActive ? '2px solid #10b981' : '1px solid transparent',
                    paddingBottom: '2px',
                    transition: 'all 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#38bdf8';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#cbd5e1';
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
