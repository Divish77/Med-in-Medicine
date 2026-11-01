'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Clock, Heart, Send } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const AboutPage = () => {
  return (
    <div style={{ padding: '60px 0 80px', background: 'var(--bg-main)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-express" style={{ marginBottom: '12px' }}>
            ABOUT MED IN MINUTES
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px' }}>
            Making Healthcare Accessible in 10 Minutes
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Med in Minutes was founded on a simple medical premise: healthcare emergencies and critical prescriptions should never have to wait days for courier delivery.
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '36px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '14px', color: 'var(--text-main)' }}>
            The 10-Minute Hyperlocal Network
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '20px' }}>
            Traditional medicine delivery platforms rely on central warehouses situated far outside city limits, resulting in delivery timelines ranging from 24 to 72 hours. Med in Minutes completely re-engineers this model by digitally connecting local licensed retail pharmacies located within 1.5 to 2 kilometers of your home.
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            By maintaining live real-time API integrations with pharmacy inventories and dispatching dedicated electric scooter delivery partners, we ensure that medicines reach patients within an average of 9.8 minutes.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <ShieldCheck size={32} color="#059669" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>100% Genuine Medicine</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              All medicines are sourced exclusively from licensed authorized distributor pharmacies with authentic batch numbers.
            </p>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <Clock size={32} color="#0284c7" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>24x7 Night Availability</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Our network includes 24x7 registered night pharmacies to deliver urgent fever, pain, and pediatric care at 2 AM.
            </p>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <Heart size={32} color="#f43f5e" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Sterile Cold Chain</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
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
      <div className="container" style={{ maxWidth: '840px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-express" style={{ marginBottom: '12px' }}>
            24x7 MEDICAL HELPLINE
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>
            We’re Here When You Need Us
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
            Contact our emergency pharmacist desk, rider dispatch team, or customer care.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          {/* Contact Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={20} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: '1rem' }}>Toll-Free Emergency Line</h4>
                  <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>1800-633-646</p>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Dedicated 24x7 line for urgent medicine requests and hospital transfers.
              </p>
            </div>

            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: '1rem' }}>Email Support</h4>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0284c7' }}>care@medinminutes.com</p>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Response time: under 15 minutes for order inquiries.
              </p>
            </div>

            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: '1rem' }}>Headquarters</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Med in Minutes Healthcare Pvt Ltd, Inner Circle, Connaught Place, New Delhi - 110001
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ background: 'white', padding: '28px', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Send Us a Message</h3>
            {submitted ? (
              <div style={{ padding: '20px', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0', textAlign: 'center' }}>
                <ShieldCheck size={36} color="#059669" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ fontWeight: 800, color: '#064e3b' }}>Message Received!</h4>
                <p style={{ fontSize: '0.85rem', color: '#047857', marginTop: '4px' }}>
                  Our pharmacist desk has been notified. We will call you within 10 minutes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.785rem', fontWeight: 700, marginBottom: '4px' }}>Your Name</label>
                  <input type="text" required placeholder="Customer" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.785rem', fontWeight: 700, marginBottom: '4px' }}>Phone / WhatsApp Number</label>
                  <input type="text" required placeholder="+91 98765 43210" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.785rem', fontWeight: 700, marginBottom: '4px' }}>Your Inquiry / Medicine Request</label>
                  <textarea rows={4} required placeholder="Tell us how we can assist you..." style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '6px' }}>
                  <Send size={15} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
