'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Clock, Heart, Send, CheckCircle2, Award, Stethoscope } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const AboutPage = () => {
  return (
    <div className="about-page" style={{ padding: '54px 0 80px', background: 'var(--bg-main)' }}>
      <style>{`
        @media (max-width: 767px) {
          .about-page {
            padding: 24px 0 50px !important;
          }
          .about-card {
            padding: 22px 18px !important;
            border-radius: 16px !important;
          }
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .contact-form-card {
            padding: 22px 18px !important;
            border-radius: 16px !important;
          }
        }
      `}</style>
      <div className="container" style={{ maxWidth: '920px' }}>
        {/* Header - Newbay Medical Style */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="badge" style={{ background: 'var(--medical-blue-light)', color: 'var(--medical-blue)', fontWeight: 700, marginBottom: '12px' }}>
            🏥 ABOUT MED-IN-MINUTES
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.7rem)', fontWeight: 800, color: 'var(--dark-navy)', letterSpacing: '-0.5px', marginBottom: '14px' }}>
            Making Healthcare Accessible in 10 Minutes
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '720px', margin: '0 auto' }}>
            Med-in-Minutes was founded on a simple medical premise: healthcare emergencies and critical prescriptions should never have to wait days for courier delivery.
          </p>
        </div>

        {/* Main Mission Card */}
        <div className="about-card" style={{ background: 'white', borderRadius: '24px', padding: '40px 36px', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '16px', color: 'var(--dark-navy)' }}>
            The 10-Minute Hyperlocal Healthcare Network
          </h2>
          <p style={{ fontSize: '0.975rem', color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '20px' }}>
            Traditional medicine delivery platforms rely on central warehouses situated far outside city limits, resulting in delivery timelines ranging from 24 to 72 hours. Med-in-Minutes completely re-engineers this model by digitally connecting local licensed retail pharmacies located within 1.5 to 2 kilometers of your home.
          </p>
          <p style={{ fontSize: '0.975rem', color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '24px' }}>
            By maintaining live real-time API integrations with pharmacy inventories and dispatching dedicated electric scooter delivery partners, we ensure that medicines reach patients within an average of 9.8 minutes.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--medical-blue)' }}>9.8 Mins</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average Delivery Speed</div>
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--health-green)' }}>250+</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Licensed Chemists Connected</div>
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--dark-navy)' }}>100%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Genuine Certified Batches</div>
            </div>
          </div>
        </div>

        {/* Clinical Assurance Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' }}>
          <div style={{ background: 'white', padding: '28px 24px', borderRadius: '18px', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--health-green-light)', color: 'var(--health-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <ShieldCheck size={26} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--dark-navy)', marginBottom: '8px' }}>100% Genuine Medicine</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              All medicines are sourced exclusively from licensed authorized distributor pharmacies with authentic manufacturer batch numbers.
            </p>
          </div>

          <div style={{ background: 'white', padding: '28px 24px', borderRadius: '18px', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--medical-blue-light)', color: 'var(--medical-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Clock size={26} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--dark-navy)', marginBottom: '8px' }}>24x7 Night Availability</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Our network includes 24x7 registered night pharmacies to deliver urgent fever, pain, and pediatric care at 2 AM.
            </p>
          </div>

          <div style={{ background: 'white', padding: '28px 24px', borderRadius: '18px', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ffe4e6', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Heart size={26} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--dark-navy)', marginBottom: '8px' }}>Sterile Cold Chain</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Insulins, eye drops, and temperature-sensitive antibiotics are transported in certified insulated thermal pouches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactPage = () => {
  const { showToast } = useApp();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been sent to our medical dispatch team!');
  };

  return (
    <div style={{ padding: '60px 0 80px', background: 'var(--bg-main)' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span className="badge" style={{ background: 'var(--medical-blue-light)', color: 'var(--medical-blue)', fontWeight: 700, marginBottom: '12px' }}>
            🏥 24x7 MEDICAL HELPLINE
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 800, color: 'var(--dark-navy)', letterSpacing: '-0.5px', marginBottom: '12px' }}>
            We’re Here When You Need Us
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
            Contact our emergency pharmacist desk, rider dispatch team, or patient care coordinators.
          </p>
        </div>

        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '26px' }}>
          {/* Contact Details Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'white', padding: '24px', borderRadius: '18px', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--medical-blue-light)', color: 'var(--medical-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={22} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--dark-navy)' }}>Toll-Free Emergency Line</h4>
                  <p style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--medical-blue)' }}>1800-633-646</p>
                </div>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Dedicated 24x7 line for urgent medicine requests and hospital transfers.
              </p>
            </div>

            <div style={{ background: 'white', padding: '24px', borderRadius: '18px', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--health-green-light)', color: 'var(--health-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--dark-navy)' }}>Email Support</h4>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--health-green-hover)' }}>care@medinminutes.com</p>
                </div>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Average response time: under 15 minutes for order inquiries.
              </p>
            </div>

            <div style={{ background: 'white', padding: '24px', borderRadius: '18px', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--dark-navy)' }}>Headquarters</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Med-in-Minutes Healthcare Pvt Ltd, Inner Circle, Connaught Place, New Delhi - 110001
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="contact-form-card" style={{ background: 'white', padding: '32px 28px', borderRadius: '22px', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dark-navy)', marginBottom: '18px' }}>Send Us a Message</h3>
            {submitted ? (
              <div style={{ padding: '24px 20px', background: 'var(--health-green-light)', borderRadius: '14px', border: '1.5px solid var(--health-green-border)', textAlign: 'center' }}>
                <CheckCircle2 size={40} color="var(--health-green)" style={{ margin: '0 auto 10px' }} />
                <h4 style={{ fontWeight: 800, color: 'var(--dark-navy)', fontSize: '1.1rem' }}>Message Received!</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', marginTop: '6px' }}>
                  Our pharmacist desk has been notified. A licensed team member will reach out within 10 minutes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '5px' }}>Your Name</label>
                  <input type="text" required placeholder="Patient / Doctor name" style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid var(--border-color)', fontSize: '0.9rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '5px' }}>Phone / WhatsApp Number</label>
                  <input type="text" required placeholder="+91 98765 43210" style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid var(--border-color)', fontSize: '0.9rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '5px' }}>Inquiry / Medicine Request</label>
                  <textarea rows={4} required placeholder="Describe your medicine or pharmacy inquiry..." style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid var(--border-color)', fontSize: '0.9rem', outline: 'none' }} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px', marginTop: '6px', borderRadius: '10px' }}>
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
