import React, { useState } from 'react';
import {
  Zap,
  Store,
  Upload,
  CreditCard,
  Navigation,
  Home,
  CheckCircle2,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  MapPin,
  Bike,
  Package,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

export const HomepageAdditionalSections = () => {
  const { setActiveTab, setIsLocationModalOpen, setIsPrescriptionModalOpen, updateDeliveryLocation, showToast } = useApp();

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Serviceability Checker State
  const [checkerPincode, setCheckerPincode] = useState('');
  const [checking, setChecking] = useState(false);
  const [checkerResult, setCheckerResult] = useState(null);

  const handleCheckArea = async (e) => {
    e.preventDefault();
    if (!checkerPincode || checkerPincode.trim().length !== 6) {
      showToast('Please enter a valid 6-digit PIN code', 'error');
      return;
    }

    setChecking(true);
    try {
      const res = await api.checkServiceability(checkerPincode.trim());
      setCheckerResult(res);
      if (res.serviceable) {
        showToast(res.message);
      }
    } catch  {
      showToast('Error checking serviceability', 'error');
    } finally {
      setChecking(false);
    }
  };

  const applyPincode = (res) => {
    updateDeliveryLocation({
      pincode: res.pincode,
      area: res.area,
      city: res.city,
      fullAddress: `${res.area}, ${res.city} - ${res.pincode}`,
      label: 'Home',
      lat: 28.6315,
      lng: 77.2167,
      expressEligible: res.expressEligible,
      etaMinutes: res.etaMinutes,
      etaLabel: res.etaLabel || (res.etaMinutes ? `${res.etaMinutes} minutes` : '2–5 business days'),
      serviceable: res.serviceable,
      pharmacyName: res.pharmacyName
    });
  };

  const whyChooseFeatures = [
    {
      title: 'Medicine Delivery Across India',
      desc: 'Choose a delivery address anywhere in India. Standard delivery estimates are shown at checkout.',
      icon: Zap,
      color: '#059669',
      bg: '#ecfdf5'
    },
    {
      title: 'Nearby Pharmacy Network',
      desc: 'Connected to over 250+ licensed local pharmacies with 100% verified authentic stock.',
      icon: Store,
      color: '#0284c7',
      bg: '#e0f2fe'
    },
    {
      title: 'Easy Prescription Upload',
      desc: 'Simply snap a photo of your doctor’s prescription. Our certified pharmacists verify it instantly.',
      icon: Upload,
      color: '#8b5cf6',
      bg: '#f5f3ff'
    },
    {
      title: 'Secure Online Payments',
      desc: 'Multiple secure digital payment methods: Instant UPI, Cards, NetBanking, and Cash on Delivery.',
      icon: CreditCard,
      color: '#f59e0b',
      bg: '#fffbeb'
    },
    {
      title: 'Real-Time Order Tracking',
      desc: 'Live interactive GPS map tracking your rider from store packing to your doorstep.',
      icon: Navigation,
      color: '#ec4899',
      bg: '#fdf2f8'
    },
    {
      title: 'Convenient Doorstep Delivery',
      desc: 'Contactless, tamper-proof insulated medical packaging ensuring sterile medicine integrity.',
      icon: Home,
      color: '#10b981',
      bg: '#f0fdf4'
    }
  ];

  const faqs = [
    {
      q: 'How does 10-minute medicine delivery work?',
      a: 'Med in Minutes utilizes a proprietary hyperlocal fulfillment network. When you enter your PIN code, we connect your order to the nearest licensed pharmacy within 1.5 km of your location. A dedicated delivery partner is assigned in under 60 seconds, picks up the sealed medical pouch, and delivers it via electric scooter in 10 minutes.'
    },
    {
      q: 'Can I upload a prescription?',
      a: 'Yes, absolutely! For all Schedule H and prescription-only medications (indicated with an Rx badge), you can upload a photo or PDF of your doctor’s prescription. Our on-duty licensed pharmacist reviews the dosage and approves the order in real time before dispatch.'
    },
    {
      q: 'How do I track my order?',
      a: 'Every order receives a unique Order ID (the Order ID shown in your confirmation). You can visit the "Track Order" page in the navigation bar to see fulfillment status updates as the pharmacy processes your order.'
    },
    {
      q: 'What if my location is not serviceable?',
      a: 'If your PIN code is not currently in our 10-minute express zone, our platform informs you immediately and prevents checkout to avoid false promises. You can change your delivery address or sign up for notifications as we expand to new neighborhoods weekly.'
    },
    {
      q: 'Can I cancel an order?',
      a: 'Orders can be cancelled before the pharmacy accepts and packs your medicines (Stages 1–3). Once packed or out for delivery, cancellations are restricted to ensure strict pharmaceutical cold-chain integrity.'
    },
    {
      q: 'What payment methods are available?',
      a: 'We accept all major payment modes including Instant UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay), NetBanking, and Cash on Delivery (COD) for eligible non-restricted items.'
    }
  ];

  return (
    <>
      {/* SECTION A: WHY CHOOSE MED IN MINUTES? */}
      <section style={{ padding: '70px 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <span className="badge badge-express" style={{ marginBottom: '12px' }}>
              🌟 WHY CHOOSE US
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px', marginBottom: '12px' }}>
              Why Choose Med in Minutes?
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
              Built specifically for health emergencies, elderly care, and urgent family wellness needs.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {whyChooseFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: '28px',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    gap: '18px',
                    alignItems: 'flex-start',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: feat.bg,
                      color: feat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                      {feat.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION B: OUR DELIVERY PROMISE */}
      <section style={{ padding: '70px 0', background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #065f46 100%)', color: 'white' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px', alignItems: 'center' }} className="promise-grid">
            <style>{`
              @media (min-width: 900px) {
                .promise-grid { gridTemplateColumns: 1.1fr 0.9fr !important; }
              }
            `}</style>
            <div>
              <span className="badge" style={{ background: '#f59e0b', color: '#0f172a', fontWeight: 700, marginBottom: '16px' }}>
                🤝 OUR SACRED COMMITMENT
              </span>
              {/* Exact heading requirement */}
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', marginBottom: '18px', lineHeight: 1.2 }}>
                Healthcare Should Never Have to Wait.
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#a7f3d0', lineHeight: 1.6, marginBottom: '16px' }}>
                When a child has a sudden 103°F fever at midnight or an elderly parent runs out of critical blood pressure medicine, a 2-day delivery window simply isn’t good enough.
              </p>
              <p style={{ fontSize: '0.95rem', color: '#ecfdf5', lineHeight: 1.6, marginBottom: '28px' }}>
                Med in Minutes directly connects customers to neighborhood licensed pharmacies and rapid-response electric scooter riders within a 2-kilometer micro-radius. By keeping travel distances ultra-short and automating pharmacist inventory checks, we reduce critical waiting time from hours to just 10 minutes.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', padding: '14px 20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fef08a' }}>9.8 Mins</div>
                  <div style={{ fontSize: '0.8rem', color: '#ecfdf5' }}>Average Express Fulfillment</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', padding: '14px 20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fef08a' }}>250+</div>
                  <div style={{ fontSize: '0.8rem', color: '#ecfdf5' }}>Licensed Local Pharmacies</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', padding: '14px 20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fef08a' }}>100%</div>
                  <div style={{ fontSize: '0.8rem', color: '#ecfdf5' }}>Tamper-Evident Seals</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '28px', border: '1px solid rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(12px)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
                Our Delivery Ethics
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.9rem', color: '#ecfdf5' }}>
                    <strong>Zero False Promises:</strong> If weather, inventory, or distance exceeds 10 minutes, we provide transparent real-time arrival estimates.
                  </span>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.9rem', color: '#ecfdf5' }}>
                    <strong>Prescription Rigor:</strong> Scheduled medicines are strictly vetted by on-duty certified pharmacists before release.
                  </span>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.9rem', color: '#ecfdf5' }}>
                    <strong>Safe Rider Standards:</strong> Rapid delivery is achieved through proximity and smart hub density, never by reckless driving.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: ORDER TRACKING PREVIEW */}
      <section style={{ padding: '70px 0', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <span className="badge badge-express" style={{ marginBottom: '12px' }}>
              📡 LIVE TRANSPARENCY
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px', marginBottom: '12px' }}>
              Order Tracking Preview
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
              Follow your medicines every single step of the way—from licensed pharmacy shelf to your front door.
            </p>
          </div>

          {/* Interactive Illustrated Timeline Preview */}
          <div style={{ background: 'var(--bg-main)', border: '1.5px solid var(--border-color)', borderRadius: '20px', padding: '32px 24px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '28px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                    How order tracking works
                  </span>

                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Progress updates appear here after your order is placed. • Arriving in 4 Mins
                </p>
              </div>

              <button
                onClick={() => setActiveTab('track')}
                className="btn btn-primary"
                style={{ fontSize: '0.875rem', padding: '8px 16px' }}
              >
                Open Full Tracking Dashboard →
              </button>
            </div>

            {/* Order progress preview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
              {[
                { label: '1. Placed', icon: CheckCircle2 },
                { label: '2. Pharmacy accepted', icon: Store },
                { label: '3. Prescription checked', icon: FileCheck },
                { label: '4. Packing', icon: Package },
                { label: '5. Rider assigned', icon: Bike },
                { label: '6. Out for delivery', icon: Navigation },
                { label: '7. Delivered', icon: Home }
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.label}
                    style={{
                      background: 'white',
                      border: '1.5px solid',
                      borderColor: '#e2e8f0',
                      borderRadius: '12px',
                      padding: '12px 10px',
                      textAlign: 'center',
                      color: 'var(--text-main)',
                      boxShadow: 'none'
                    }}
                  >
                    <Icon size={18} style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>{step.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION D: SERVICE AVAILABILITY (PIN CODE CHECKER) */}
      <section style={{ padding: '70px 0', background: 'linear-gradient(180deg, #f8fafc 0%, #ecfdf5 100%)' }}>
        <div className="container">
          <div style={{ maxWidth: '680px', margin: '0 auto', background: 'white', borderRadius: '24px', padding: '40px 32px', boxShadow: 'var(--shadow-lg)', border: '1.5px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <MapPin size={28} />
            </div>

            {/* Mandatory exact heading */}
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
              Service Availability
            </h2>

            {/* Mandatory exact text */}
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Check whether Med in Minutes delivers to your area.
            </p>

            <form onSubmit={handleCheckArea} style={{ display: 'flex', gap: '10px', maxWidth: '460px', margin: '0 auto 20px', flexWrap: 'wrap' }}>
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit PIN code (e.g. 110001)"
                value={checkerPincode}
                onChange={(e) => setCheckerPincode(e.target.value.replace(/\D/g, ''))}
                style={{
                  flex: 1,
                  minWidth: '220px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-color)',
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              />
              <button
                type="submit"
                disabled={checking}
                className="btn btn-primary"
                style={{ padding: '12px 24px', borderRadius: '12px' }}
              >
                {checking ? 'Checking...' : 'Check Availability'}
              </button>
            </form>

            {/* Result display */}
            {checkerResult && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  background: checkerResult.serviceable ? '#ecfdf5' : '#fef2f2',
                  border: `1.5px solid ${checkerResult.serviceable ? '#a7f3d0' : '#fecaca'}`,
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div>
                    <h4 style={{ fontWeight: 800, fontSize: '1rem', color: checkerResult.serviceable ? '#064e3b' : '#991b1b', marginBottom: '4px' }}>
                      {checkerResult.serviceable ? (checkerResult.expressEligible ? '⚡ 10-Minute Express Delivery Available!' : '⏱️ Standard Delivery (18 mins) Available') : 'Delivery Not Available Yet'}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: checkerResult.serviceable ? '#047857' : '#b91c1c' }}>
                      {checkerResult.message}
                    </p>
                    {checkerResult.serviceable && (
                      <p style={{ fontSize: '0.8rem', color: '#065f46', marginTop: '6px' }}>
                        Nearest Store: <strong>{checkerResult.pharmacyName}</strong> • Delivery Fee: <strong>{checkerResult.deliveryFee === 0 ? 'FREE' : `₹${checkerResult.deliveryFee}`}</strong>
                      </p>
                    )}
                  </div>
                  {checkerResult.serviceable && (
                    <button
                      type="button"
                      onClick={() => applyPincode(checkerResult)}
                      className="btn btn-primary"
                      style={{ fontSize: '0.8rem', padding: '8px 14px', flexShrink: 0 }}
                    >
                      Set Location
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION E: FREQUENTLY ASKED QUESTIONS */}
      <section style={{ padding: '70px 0', background: 'white', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <span className="badge badge-express" style={{ marginBottom: '12px' }}>
              ❓ CLARITY & TRANSPARENCY
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px', marginBottom: '12px' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
              Everything you need to know about rapid 10-minute medicine delivery.
            </p>
          </div>

          <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  style={{
                    background: isOpen ? '#f8fafc' : 'white',
                    border: '1.5px solid',
                    borderColor: isOpen ? 'var(--primary)' : 'var(--border-color)',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    transition: 'all 0.2s'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'transparent',
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      color: isOpen ? 'var(--primary-dark)' : 'var(--text-main)'
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={20} color="var(--primary)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 24px 20px', fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.6, borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};
