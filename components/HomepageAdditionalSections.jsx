'use client';

import React, { useState, useEffect } from 'react';
import {
  Zap,
  Store,
  Upload,
  CreditCard,
  Navigation,
  Home,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Bike,
  Package,
  FileCheck,
  ShieldCheck,
  Clock,
  Plus,
  ShoppingBag,
  ArrowRight,
  Heart,
  Pill,
  Star,
  Activity,
  Award,
  Sparkles
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';

export const HomepageAdditionalSections = () => {
  const { setActiveTab, setIsPrescriptionModalOpen, addToCart, updateDeliveryLocation, showToast } = useApp();

  // Featured Medicines State (Loaded directly from database API)
  const [featuredMeds, setFeaturedMeds] = useState([]);
  const [loadingMeds, setLoadingMeds] = useState(true);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Serviceability Checker State
  const [checkerPincode, setCheckerPincode] = useState('');
  const [checking, setChecking] = useState(false);
  const [checkerResult, setCheckerResult] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadFeatured() {
      try {
        const res = await api.getMedicines({ limit: 8 });
        if (isMounted && res.success && res.medicines) {
          setFeaturedMeds(res.medicines.slice(0, 8));
        }
      } catch (err) {
        console.error('Error loading featured medicines', err);
      } finally {
        if (isMounted) setLoadingMeds(false);
      }
    }
    loadFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

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
    } catch {
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
    showToast(`Delivery location set to ${res.area || res.pincode}`);
  };

  // Healthcare Services / Categories (Newbay Medical Inspired)
  const healthcareCategories = [
    {
      title: 'Fever & Pain Relief',
      desc: 'Paracetamol, ibuprofen, analgesic balms and temperature care essentials for sudden discomfort.',
      icon: Pill,
      badge: 'Essential',
      color: 'var(--medical-blue)',
      bg: 'var(--medical-blue-light)'
    },
    {
      title: 'Antibiotics & Prescription Care',
      desc: 'Certified Schedule H formulations dispensed strictly against verified doctor prescriptions.',
      icon: ShieldCheck,
      badge: 'Rx Verified',
      color: 'var(--health-green)',
      bg: 'var(--health-green-light)'
    },
    {
      title: 'Heart & Blood Pressure',
      desc: 'Vital chronic cardiac and hypertension management medications for regular uninterrupted therapy.',
      icon: Heart,
      badge: 'Daily Care',
      color: '#e11d48',
      bg: '#ffe4e6'
    },
    {
      title: 'Digestion & Gastric Wellness',
      desc: 'Antacids, PPIs, digestive enzymes, and probiotics for swift relief from acidity and reflux.',
      icon: Activity,
      badge: 'Fast Acting',
      color: '#0284c7',
      bg: '#e0f2fe'
    },
    {
      title: 'First Aid & Surgical Care',
      desc: 'Sterile bandages, antiseptic solutions, cotton gauze, and emergency wound-dressing supplies.',
      icon: Award,
      badge: 'Immediate',
      color: '#d97706',
      bg: '#fef3c7'
    },
    {
      title: 'Vitamins & Immunity',
      desc: 'Multivitamins, zinc, vitamin C chewables, and nutritional supplements for daily wellness.',
      icon: Sparkles,
      badge: 'OTC Wellness',
      color: '#7c3aed',
      bg: '#ede9fe'
    }
  ];

  // Why Choose Features (Exact 6 features required)
  const whyChooseFeatures = [
    {
      title: 'Fast Medicine Delivery',
      desc: 'Direct connection to neighborhood pharmacies ensures rapid 10-minute dispatch for critical needs.',
      icon: Zap,
      color: 'var(--medical-blue)',
      bg: 'var(--medical-blue-light)'
    },
    {
      title: 'Easy Prescription Upload',
      desc: 'Snap a photo or upload a PDF of your doctor’s prescription for immediate digital review.',
      icon: Upload,
      color: 'var(--health-green)',
      bg: 'var(--health-green-light)'
    },
    {
      title: 'Nearby Pharmacy Network',
      desc: 'Partnered with over 250+ certified neighborhood retail pharmacies with 100% genuine inventory.',
      icon: Store,
      color: '#0284c7',
      bg: '#e0f2fe'
    },
    {
      title: 'Secure Payments',
      desc: 'Multiple encrypted digital payment options including Instant UPI, Cards, NetBanking, and Cash on Delivery.',
      icon: CreditCard,
      color: '#f59e0b',
      bg: '#fffbeb'
    },
    {
      title: 'Real-Time Order Tracking',
      desc: 'Live interactive GPS map tracking your rider from pharmacy shelf packing to your doorstep.',
      icon: Navigation,
      color: '#ec4899',
      bg: '#fdf2f8'
    },
    {
      title: 'Convenient Doorstep Delivery',
      desc: 'Tamper-evident, temperature-controlled insulated packaging ensuring sterile medication integrity.',
      icon: Home,
      color: '#10b981',
      bg: '#f0fdf4'
    }
  ];

  // Customer Reviews (Newbay Medical Patient Testimonials)
  const customerReviews = [
    {
      name: 'Dr. Priya Sharma',
      role: 'Family Physician & Patient',
      rating: 5,
      comment: 'Med-in-Minutes is a lifesaver for my elderly patients who cannot travel to the chemist at night. The prescription review process is thorough, professional, and remarkably swift.',
      location: 'South Extension, New Delhi'
    },
    {
      name: 'Rajesh Mehra',
      role: 'Verified Customer',
      rating: 5,
      comment: 'Ordered fever medicine for my 5-year-old daughter at 11:30 PM. The package was delivered with cold-chain packaging in exactly 9 minutes! Incredible service and genuine medicine.',
      location: 'Indirapuram, Ghaziabad'
    },
    {
      name: 'Ananya Deshmukh',
      role: 'Chronic Care Patient',
      rating: 5,
      comment: 'I rely on Med-in-Minutes for my parents’ blood pressure and diabetes medicines every month. The invoice is accurate and the delivery partner verification code ensures total peace of mind.',
      location: 'Bandra West, Mumbai'
    }
  ];

  // FAQs
  const faqs = [
    {
      q: 'How does 10-minute medicine delivery work?',
      a: 'Med-in-Minutes utilizes a hyperlocal pharmacy fulfillment network. When you enter your PIN code, we connect your order to the nearest licensed pharmacy within 1.5 km of your location. A dedicated delivery partner is assigned in under 60 seconds, collects the sealed medical pouch, and delivers it via electric scooter in 10 minutes.'
    },
    {
      q: 'Can I upload a prescription?',
      a: 'Yes, absolutely! For all Schedule H and prescription-only medications (indicated with an Rx badge), you can upload a photo or PDF of your doctor’s prescription. Our on-duty licensed pharmacist reviews the dosage and validates the order before dispatch.'
    },
    {
      q: 'How do I track my order?',
      a: 'Every order receives a unique Order ID. You can visit the "Track Order" page in the navigation bar to see real-time fulfillment status updates and view rider location on the interactive map.'
    },
    {
      q: 'What if my location is not serviceable?',
      a: 'If your PIN code is not currently in our 10-minute express zone, our platform informs you immediately and prevents checkout to avoid false promises. You can change your delivery address or sign up for notifications as we expand.'
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
      <style>{`
        @media (max-width: 767px) {
          .home-section-pad {
            padding: 36px 0 !important;
          }
          .services-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
          .about-split-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .why-choose-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
          .featured-meds-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }
          .reviews-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
          .pincode-checker-card {
            padding: 24px 16px !important;
            border-radius: 18px !important;
          }
          .pincode-form {
            flex-direction: column !important;
          }
          .pincode-input {
            width: 100% !important;
            min-width: 100% !important;
          }
          .pincode-btn {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>

      {/* SECTION C: HEALTHCARE SERVICES / CATEGORIES (NEWBAY MEDICAL STYLE) */}
      <section className="home-section-pad" style={{ padding: '72px 0', background: 'white', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
            <span className="badge" style={{ background: 'var(--medical-blue-light)', color: 'var(--medical-blue)', fontWeight: 700, marginBottom: '12px' }}>
              🏥 HEALTHCARE CATEGORIES
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', fontWeight: 800, color: 'var(--dark-navy)', letterSpacing: '-0.5px', marginBottom: '12px' }}>
              Our Pharmaceutical Services & Categories
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Carefully organized therapeutic ranges to ensure rapid access to verified medications when you need them most.
            </p>
          </div>

          <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
            {healthcareCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.title}
                  style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: '28px 24px',
                    border: '1.5px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.borderColor = 'var(--medical-blue)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        background: cat.bg,
                        color: cat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, background: 'var(--bg-main)', color: 'var(--dark-navy)', padding: '3px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
                      {cat.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--dark-navy)', marginBottom: '8px' }}>
                    {cat.title}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, flexGrow: 1, marginBottom: '20px' }}>
                    {cat.desc}
                  </p>

                  <button
                    onClick={() => setActiveTab('medicines')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--medical-blue)',
                      background: 'transparent',
                      padding: 0,
                      textAlign: 'left'
                    }}
                  >
                    Explore Medicines <ArrowRight size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION D: ABOUT MED-IN-MINUTES (IMAGE & TEXT SPLIT SECTION) */}
      <section className="home-section-pad" style={{ padding: '76px 0', background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="about-split-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '48px', alignItems: 'center' }}>
            {/* Left Column: Clinical Content */}
            <div>
              <span className="badge" style={{ background: 'var(--health-green-light)', color: 'var(--health-green)', fontWeight: 700, marginBottom: '14px' }}>
                🤝 PATIENT-FIRST HEALTHCARE
              </span>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--dark-navy)', letterSpacing: '-0.5px', marginBottom: '18px', lineHeight: 1.2 }}>
                Making Healthcare More Accessible, One Delivery at a Time.
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '16px' }}>
                At Med-in-Minutes, we believe no patient should endure painful delays, closed pharmacies, or long travel when urgent health supplies are needed.
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '26px' }}>
                We bridge the critical gap between patients and licensed neighbourhood pharmacies. Through intelligent inventory routing and rapid cold-chain transport, we bring authentic prescription drugs, infant nutrition, and emergency wellness aids straight to your doorstep in just 10 minutes.
              </p>

              {/* Clinical Assurance Pillars */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} color="var(--health-green)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--dark-navy)', display: 'block' }}>100% Genuine Supplies</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sourced only from licensed retail chemists.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} color="var(--health-green)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--dark-navy)', display: 'block' }}>Cold-Chain Integrity</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Insulated bags maintain temperature stability.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} color="var(--health-green)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--dark-navy)', display: 'block' }}>Pharmacist Verification</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rigorous clinical safety checks on every Rx item.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} color="var(--health-green)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--dark-navy)', display: 'block' }}>Safe Handover Code</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unique OTP ensures verified customer receipt.</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <button
                  onClick={() => setActiveTab('medicines')}
                  className="btn btn-primary"
                  style={{ padding: '12px 24px', fontSize: '0.95rem' }}
                >
                  <ShoppingBag size={18} /> Browse Pharmacy
                </button>
                <button
                  onClick={() => setIsPrescriptionModalOpen(true)}
                  className="btn btn-secondary"
                  style={{ padding: '12px 24px', fontSize: '0.95rem' }}
                >
                  <Upload size={18} color="var(--medical-blue)" /> Upload Doctor’s Rx
                </button>
              </div>
            </div>

            {/* Right Column: High Quality Clinical & Medicine Imagery */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xl)',
                  border: '5px solid white',
                  background: 'white'
                }}
              >
                <img
                  src="/delivery_hero.jpg"
                  alt="Doctor and licensed pharmacist reviewing prescription for Med-in-Minutes"
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                />
              </div>

              {/* Clinical Trust Stat Overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: '-16px',
                  right: '-16px',
                  background: 'var(--dark-navy)',
                  color: 'white',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-lg)',
                  border: '2px solid white'
                }}
              >
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--health-green)' }}>9.8 Mins</div>
                <div style={{ fontSize: '0.75rem', color: '#E9EFF2' }}>Avg. Handover Speed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION E: WHY CHOOSE MED-IN-MINUTES? (3 OR 4 COLUMN FEATURE LAYOUT) */}
      <section className="home-section-pad" style={{ padding: '72px 0', background: 'white', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 44px' }}>
            <span className="badge" style={{ background: 'var(--medical-blue-light)', color: 'var(--medical-blue)', fontWeight: 700, marginBottom: '12px' }}>
              ⭐ CLINICAL EXCELLENCE
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', fontWeight: 800, color: 'var(--dark-navy)', letterSpacing: '-0.5px', marginBottom: '12px' }}>
              Why Choose Med-in-Minutes?
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Built specifically for health emergencies, elderly care, and urgent family wellness needs.
            </p>
          </div>

          <div className="why-choose-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '22px' }}>
            {whyChooseFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  style={{
                    background: 'var(--bg-main)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '28px 24px',
                    border: '1.5px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    gap: '18px',
                    alignItems: 'flex-start',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.borderColor = 'var(--medical-blue)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
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
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--dark-navy)', marginBottom: '8px' }}>
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

      {/* SECTION G: FEATURED MEDICINES (REAL PRODUCTS LOADED FROM DATABASE) */}
      <section className="home-section-pad" style={{ padding: '72px 0', background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '36px' }}>
            <div>
              <span className="badge" style={{ background: 'var(--health-green-light)', color: 'var(--health-green)', fontWeight: 700, marginBottom: '8px' }}>
                💊 PHARMACY CATALOG
              </span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', fontWeight: 800, color: 'var(--dark-navy)', letterSpacing: '-0.5px' }}>
                Featured Essential Medicines
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Verified therapeutic formulations available for immediate 10-minute dispatch.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('medicines')}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              View Full Catalog ({featuredMeds.length}+ items) <ArrowRight size={15} />
            </button>
          </div>

          {/* Medicines Grid */}
          <div className="featured-meds-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {featuredMeds.map((med) => (
              <div
                key={med._id || med.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  border: '1.5px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.borderColor = 'var(--medical-blue)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                {/* Product Image Frame (Matches Medicine Section) */}
                <div
                  className="med-card-img-wrap"
                  onClick={() => setActiveTab('medicines')}
                  style={{ height: '160px', position: 'relative', overflow: 'hidden', background: '#f8fafc', cursor: 'pointer' }}
                >
                  <img
                    src={med.image || med.imageUrl || '/hero.png'}
                    alt={med.name}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.src = '/hero.png';
                    }}
                  />

                  {/* Badges */}
                  <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {med.prescriptionRequired ? (
                      <span className="badge badge-rx" style={{ fontSize: '0.62rem', padding: '2px 6px', fontWeight: 800 }}>
                        Rx
                      </span>
                    ) : (
                      <span className="badge badge-otc" style={{ fontSize: '0.62rem', padding: '2px 6px', fontWeight: 800 }}>
                        OTC
                      </span>
                    )}
                  </div>

                  <span className="badge badge-express" style={{ position: 'absolute', bottom: '8px', right: '8px', fontSize: '0.62rem', padding: '2px 6px' }}>
                    ⚡ 10m
                  </span>

                  {med.discountPercent > 0 && (
                    <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--accent-orange)', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                      {med.discountPercent}% OFF
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="med-card-body" style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--medical-blue)', textTransform: 'uppercase', marginBottom: '2px' }}>
                    {med.brand || 'Licensed Chemist'}
                  </div>

                  <h3
                    className="med-card-title"
                    onClick={() => setActiveTab('medicines')}
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      color: 'var(--dark-navy)',
                      cursor: 'pointer',
                      lineHeight: 1.35,
                      marginBottom: '4px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '36px'
                    }}
                    title={med.name}
                  >
                    {med.name}
                  </h3>

                  <div className="med-card-pack" style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '10px' }}>
                    Pack: <strong>{med.packSize || 'Standard Pack'}</strong>
                  </div>

                  {/* Price & Add to Cart */}
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '10px', gap: '6px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span className="med-card-price" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                          ₹{med.price}
                        </span>
                        {med.mrp > med.price && (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                            ₹{med.mrp}
                          </span>
                        )}
                      </div>
                      {med.discountPercent > 0 && (
                        <span style={{ fontSize: '0.65rem', color: 'var(--health-green)', fontWeight: 800 }}>
                          {med.discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        addToCart(med, 1);
                        showToast(`Added ${med.name} to cart`);
                      }}
                      className="btn btn-primary"
                      style={{
                        padding: '7px 14px',
                        fontSize: '0.8rem',
                        borderRadius: '8px',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION H: DELIVERY AND ORDER TRACKING CTA */}
      <section className="home-section-pad" style={{ padding: '72px 0', background: 'white', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge" style={{ background: 'var(--medical-blue-light)', color: 'var(--medical-blue)', fontWeight: 700, marginBottom: '12px' }}>
              ⚡ HYPERLOCAL DISPATCH
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: 'var(--dark-navy)', letterSpacing: '-0.5px', marginBottom: '14px' }}>
              Your Medicines Are Just Minutes Away.
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
              Experience seamless doorstep medicine dispatch with real-time GPS tracking and live status updates. Enter your PIN code below to confirm immediate 10-minute delivery.
            </p>

            {/* Pincode Availability Checker */}
            <div className="pincode-checker-card" style={{ background: 'var(--bg-main)', borderRadius: '24px', padding: '36px 32px', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <form onSubmit={handleCheckArea} className="pincode-form" style={{ display: 'flex', gap: '12px', maxWidth: '480px', margin: '0 auto 16px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  className="pincode-input"
                  placeholder="Enter 6-digit PIN code (e.g. 110001)"
                  value={checkerPincode}
                  onChange={(e) => setCheckerPincode(e.target.value.replace(/\D/g, ''))}
                  style={{
                    flex: 1,
                    minWidth: '220px',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border-color)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--dark-navy)',
                    background: 'white'
                  }}
                />
                <button
                  type="submit"
                  disabled={checking}
                  className="btn btn-primary pincode-btn"
                  style={{ padding: '14px 26px', borderRadius: '12px' }}
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
                    background: checkerResult.serviceable ? 'var(--health-green-light)' : '#fef2f2',
                    border: `1.5px solid ${checkerResult.serviceable ? 'var(--health-green-border)' : '#fecaca'}`,
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div>
                      <h4 style={{ fontWeight: 800, fontSize: '1rem', color: checkerResult.serviceable ? 'var(--dark-navy)' : '#991b1b', marginBottom: '4px' }}>
                        {checkerResult.serviceable ? (checkerResult.expressEligible ? '⚡ 10-Minute Express Delivery Active!' : '⏱️ Standard Delivery (18 mins) Available') : 'Delivery Not Available Yet'}
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: checkerResult.serviceable ? 'var(--health-green-hover)' : '#b91c1c' }}>
                        {checkerResult.message}
                      </p>
                      {checkerResult.serviceable && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--dark-navy)', marginTop: '6px' }}>
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
                        Set Delivery Location
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Tracking CTA Button */}
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Already placed an order?</span>
                <button
                  onClick={() => setActiveTab('track')}
                  className="btn btn-navy"
                  style={{ padding: '10px 20px', fontSize: '0.875rem' }}
                >
                  <Navigation size={16} /> Track Your Order Now
                </button>
              </div>
            </div>
          </div>

          {/* 7-Step Live Order Progress Preview */}
          <div style={{ background: 'var(--bg-main)', border: '1.5px solid var(--border-color)', borderRadius: '20px', padding: '28px 24px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--medical-blue)', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center' }}>
              Full Order Tracking Workflow
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
              {[
                { label: '1. Placed', icon: CheckCircle2 },
                { label: '2. Pharmacy accepted', icon: Store },
                { label: '3. Prescription checked', icon: FileCheck },
                { label: '4. Packing', icon: Package },
                { label: '5. Rider assigned', icon: Bike },
                { label: '6. Out for delivery', icon: Navigation },
                { label: '7. Delivered (OTP)', icon: Home }
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.label}
                    style={{
                      background: 'white',
                      border: '1.5px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '12px 10px',
                      textAlign: 'center',
                      color: 'var(--dark-navy)'
                    }}
                  >
                    <Icon size={18} color="var(--medical-blue)" style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>{step.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION I: CUSTOMER REVIEWS (NEWBAY MEDICAL PATIENT TESTIMONIALS) */}
      <section className="home-section-pad" style={{ padding: '72px 0', background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <span className="badge" style={{ background: 'var(--health-green-light)', color: 'var(--health-green)', fontWeight: 700, marginBottom: '12px' }}>
              💬 PATIENT TRUST
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', fontWeight: 800, color: 'var(--dark-navy)', letterSpacing: '-0.5px', marginBottom: '12px' }}>
              What Our Patients & Doctors Say
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
              Real experiences from families and healthcare professionals who trust Med-in-Minutes every day.
            </p>
          </div>

          <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {customerReviews.map((rev) => (
              <div
                key={rev.name}
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-lg)',
                  padding: '32px 26px',
                  border: '1.5px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* 5 Stars */}
                <div style={{ display: 'flex', gap: '4px', color: '#f59e0b', marginBottom: '14px' }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={17} fill="currentColor" />
                  ))}
                </div>

                <p style={{ fontSize: '0.925rem', color: 'var(--text-body)', lineHeight: 1.65, fontStyle: 'italic', flexGrow: 1, marginBottom: '20px' }}>
                  "{rev.comment}"
                </p>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                      {rev.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {rev.role} • {rev.location}
                    </div>
                  </div>
                  <span className="badge badge-otc" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION J: FINAL CTA SECTION (NEWBAY MEDICAL HEALTHCARE CTA) */}
      <section style={{ padding: '80px 0', background: 'var(--dark-navy)', color: 'white', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle background glow */}
        <div style={{ position: 'absolute', top: '-20%', left: '10%', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(8, 126, 139, 0.25) 0%, rgba(18,59,93,0) 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '10%', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(32, 184, 106, 0.2) 0%, rgba(18,59,93,0) 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '720px' }}>
          <span className="badge" style={{ background: 'var(--health-green)', color: 'white', fontWeight: 800, marginBottom: '16px' }}>
            🏥 24x7 EMERGENCY DISPENSING ACTIVE
          </span>
          <h2 style={{ fontSize: 'clamp(2.1rem, 4vw, 3rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', marginBottom: '16px', lineHeight: 1.2 }}>
            Need Medicines? We're Here to Help.
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#E9EFF2', lineHeight: 1.6, marginBottom: '32px' }}>
            Connect with verified neighbourhood pharmacies for instant 10-minute medicine delivery, or securely upload your prescription for immediate licensed pharmacist verification.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('medicines')}
              className="btn btn-green"
              style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: '12px' }}
            >
              <ShoppingBag size={19} /> Shop Medicines
            </button>

            <button
              onClick={() => setIsPrescriptionModalOpen(true)}
              className="btn btn-secondary"
              style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: '12px', background: 'white', color: 'var(--dark-navy)', border: 'none' }}
            >
              <Upload size={19} color="var(--medical-blue)" /> Upload Prescription
            </button>
          </div>
        </div>
      </section>

      {/* SECTION K: FREQUENTLY ASKED QUESTIONS */}
      <section style={{ padding: '72px 0', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <span className="badge" style={{ background: 'var(--medical-blue-light)', color: 'var(--medical-blue)', fontWeight: 700, marginBottom: '12px' }}>
              ❓ CLARITY & TRANSPARENCY
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', fontWeight: 800, color: 'var(--dark-navy)', letterSpacing: '-0.5px', marginBottom: '12px' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
              Everything you need to know about compliant 10-minute medicine delivery.
            </p>
          </div>

          <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  style={{
                    background: isOpen ? 'var(--bg-main)' : 'white',
                    border: '1.5px solid',
                    borderColor: isOpen ? 'var(--medical-blue)' : 'var(--border-color)',
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
                      color: isOpen ? 'var(--dark-navy)' : 'var(--text-body)'
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={20} color="var(--medical-blue)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 24px 20px', fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.6, borderTop: '1px solid var(--border-light)', paddingTop: '14px' }}>
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
