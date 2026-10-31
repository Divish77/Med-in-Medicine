import React from 'react';
import { ShoppingBag, Upload, ShieldCheck, Zap, Clock, Store, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeroSection = () => {
  const { setActiveTab, setIsPrescriptionModalOpen, deliveryLocation } = useApp();

  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: '56px 0 40px', background: 'linear-gradient(180deg, #ecfdf5 0%, #f8fafc 100%)' }}>
      {/* Decorative background glow circles */}
      <div style={{ position: 'absolute', top: '-10%', right: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '0', left: '2%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(2, 132, 199, 0.1) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px', alignItems: 'center' }} className="hero-grid">
          <style>{`
            @media (min-width: 992px) {
              .hero-grid { gridTemplateColumns: 1.15fr 0.85fr !important; }
            }
          `}</style>

          {/* Left Hero Content */}
          <div>
            {/* Express Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'white', borderRadius: 'var(--radius-full)', border: '1.5px solid var(--primary-border)', boxShadow: 'var(--shadow-sm)', marginBottom: '20px' }}>
              <span className="badge badge-express" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                <Zap size={13} fill="currentColor" /> 10 MINUTES
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                {deliveryLocation.serviceable && deliveryLocation.expressEligible
                  ? `⚡ Express Delivery Active in ${deliveryLocation.area || deliveryLocation.pincode}`
                  : 'Hyperlocal Pharmacy Fulfillment Network'}
              </span>
            </div>

            {/* Main Heading (Mandatory exact requirement) */}
            <h1 style={{ fontSize: 'clamp(2.2rem, 4.2vw, 3.4rem)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-1px', marginBottom: '16px', lineHeight: 1.15 }}>
              Medicines at Your Doorstep in <span style={{ background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Just 10 Minutes!</span>
            </h1>

            {/* Subheading (Mandatory exact requirement) */}
            <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#334155', lineHeight: 1.5, marginBottom: '14px' }}>
              Med in Minutes makes healthcare more accessible by connecting customers with nearby pharmacies and delivering essential medicines and healthcare products quickly and conveniently.
            </p>

            {/* Supporting Text (Mandatory exact requirement) */}
            <p style={{ fontSize: '0.975rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px', maxWidth: '580px' }}>
              Forgot to refill your medicines? Need essential healthcare products urgently? Simply search for your medicines, upload your prescription when required, place your order, and get it delivered to your doorstep.
            </p>

            {/* Two Prominent Action Buttons (Mandatory exact requirement) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '36px' }}>
              <button
                onClick={() => setActiveTab('medicines')}
                className="btn btn-primary"
                style={{ padding: '14px 28px', fontSize: '1.05rem', borderRadius: '12px' }}
              >
                <ShoppingBag size={20} /> Order Medicines
              </button>

              <button
                onClick={() => setIsPrescriptionModalOpen(true)}
                className="btn btn-secondary"
                style={{ padding: '14px 28px', fontSize: '1.05rem', borderRadius: '12px' }}
              >
                <Upload size={20} color="var(--primary)" /> Upload Prescription
              </button>
            </div>

            {/* Guarantee Pill Highlights */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', borderTop: '1px solid #cbd5e1', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                  <Clock size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>10-Min Delivery</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From nearby store</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', flexShrink: 0 }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>100% Genuine</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pharmacist certified</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', flexShrink: 0 }}>
                  <Store size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Local Pharmacies</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified inventory</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Illustration (Delivery partner with medicine package) */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', maxWidth: '480px', width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px -10px rgba(5, 150, 105, 0.25)', border: '4px solid white', background: 'white' }}>
              <img
                src="/delivery_hero.jpg"
                alt="Med in Minutes Delivery Partner carrying emergency medicine package"
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />

              {/* Floating Express Rider Status Tag */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981', animation: 'pulse-express 1.5s infinite' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      Delivery partner not assigned • Express Rider
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Temperature-Controlled Medical Pouch Sealed
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
