'use client';

import React from 'react';
import { ShoppingBag, Upload, ShieldCheck, Zap, Clock, Store, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const HeroSection = () => {
  const { setActiveTab, setIsPrescriptionModalOpen, setIsLocationModalOpen, deliveryLocation } = useApp();

  return (
    <section className="hero-section" style={{ position: 'relative', overflow: 'hidden', padding: '56px 0 44px', background: 'linear-gradient(180deg, #F5F9FA 0%, #FFFFFF 100%)' }}>
      <style>{`
        @media (max-width: 767px) {
          .hero-section {
            padding: 28px 0 24px !important;
          }
          .hero-buttons {
            flex-direction: column !important;
            gap: 10px !important;
            margin-bottom: 24px !important;
          }
          .hero-btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 13px 20px !important;
            font-size: 0.95rem !important;
          }
          .hero-pills {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .hero-image-wrap {
            margin-top: 14px !important;
            max-width: 100% !important;
          }
        }
        @media (max-width: 380px) {
          .hero-pills {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Decorative clinical subtle glows */}
      <div style={{ position: 'absolute', top: '-8%', right: '5%', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(8, 126, 139, 0.08) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '0', left: '2%', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(32, 184, 106, 0.08) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px', alignItems: 'center' }} className="hero-grid">
          <style>{`
            @media (min-width: 992px) {
              .hero-grid { grid-template-columns: 1.15fr 0.85fr !important; }
            }
          `}</style>

          {/* Left Hero Content - Newbay Medical Clinical Layout */}
          <div>
            {/* Express Clinical Badge with Location Hook */}
            <div
              onClick={() => setIsLocationModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                background: 'white',
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '18px',
                cursor: 'pointer',
                maxWidth: '100%',
                transition: 'all 0.15s ease'
              }}
              title="Click to check or change delivery location"
            >
              <span className="badge badge-express" style={{ fontSize: '0.72rem', padding: '3px 9px', flexShrink: 0 }}>
                <Zap size={12} fill="currentColor" /> 10 MINUTES
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--dark-navy)', display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <MapPin size={13} color="var(--medical-blue)" />
                {deliveryLocation.serviceable
                  ? `Delivering to ${deliveryLocation.area || deliveryLocation.pincode} (${deliveryLocation.etaLabel || '10 mins'})`
                  : 'Check Nearby Pharmacy Network'}
              </span>
              <ChevronRight size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            </div>

            {/* Exact Required Main Heading */}
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.3rem)', fontWeight: 800, color: 'var(--dark-navy)', letterSpacing: '-0.5px', marginBottom: '16px', lineHeight: 1.16 }}>
              Your Health Essentials, Delivered in <span style={{ color: 'var(--medical-blue)' }}>Just 10 Minutes.</span>
            </h1>

            {/* Exact Required Supporting Text */}
            <p style={{ fontSize: 'clamp(1rem, 2.2vw, 1.15rem)', fontWeight: 500, color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '28px', maxWidth: '600px' }}>
              Get your essential medicines and healthcare products delivered to your doorstep. Discover nearby pharmacy availability, upload prescriptions, and track every order with Med-in-Minutes.
            </p>

            {/* Two Prominent Action Buttons */}
            <div className="hero-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '36px' }}>
              <button
                onClick={() => setActiveTab('medicines')}
                className="btn btn-primary hero-btn"
                style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: '12px' }}
              >
                <ShoppingBag size={19} /> Order Medicines
              </button>

              <button
                onClick={() => setIsPrescriptionModalOpen(true)}
                className="btn btn-secondary hero-btn"
                style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: '12px', background: 'white', color: 'var(--dark-navy)', border: '1.5px solid var(--border-color)' }}
              >
                <Upload size={19} color="var(--medical-blue)" /> Upload Prescription
              </button>
            </div>

            {/* Healthcare Assurance Guarantee Pills */}
            <div className="hero-pills" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--medical-blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--medical-blue)', flexShrink: 0 }}>
                  <Clock size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--dark-navy)' }}>10-Min Express</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Hyperlocal radius</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--health-green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--health-green)', flexShrink: 0 }}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--dark-navy)' }}>100% Genuine</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Licensed chemists</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', flexShrink: 0 }}>
                  <Store size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--dark-navy)' }}>250+ Pharmacies</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Real-time stock</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Illustration - Clean Healthcare Presentation */}
          <div className="hero-image-wrap" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', maxWidth: '490px', width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 45px -10px rgba(18, 59, 93, 0.16)', border: '4px solid white', background: 'white' }}>
              <img
                src="/delivery_hero.jpg"
                alt="Med-in-Minutes healthcare delivery partner with sealed medicine pouch"
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />

              {/* Floating Clinical Status Tag */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  background: 'rgba(255, 255, 255, 0.96)',
                  backdropFilter: 'blur(8px)',
                  padding: '12px 18px',
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(18, 59, 93, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1.5px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--health-green)', boxShadow: '0 0 10px var(--health-green)', animation: 'pulse-express 1.5s infinite' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                      Fulfillment Partner Active
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Insulated & Tamper-Sealed Medical Delivery
                    </div>
                  </div>
                </div>
                <span className="badge badge-express" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                  ⚡ 10 MINS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
