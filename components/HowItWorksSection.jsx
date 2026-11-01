'use client';

import React from 'react';
import { MapPin, Search, CreditCard, Bike, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const HowItWorksSection = () => {
  const { setIsLocationModalOpen, setActiveTab } = useApp();

  const steps = [
    {
      step: '01',
      title: 'Enter Your Location',
      description: 'Share your GPS location or enter your 6-digit PIN code to connect to nearby partner pharmacies with instant inventory.',
      icon: MapPin,
      color: '#059669',
      bg: '#ecfdf5',
      actionText: 'Set Location',
      onClick: () => setIsLocationModalOpen(true)
    },
    {
      step: '02',
      title: 'Choose Medicines',
      description: 'Search from thousands of authentic OTC and chronic medicines, or easily upload your doctor’s prescription in seconds.',
      icon: Search,
      color: '#0284c7',
      bg: '#e0f2fe',
      actionText: 'Browse Medicines',
      onClick: () => setActiveTab('medicines')
    },
    {
      step: '03',
      title: 'Place Your Order',
      description: 'Review your items and place your order with Cash on Delivery. Prescription medicines need pharmacist approval before checkout.',
      icon: CreditCard,
      color: '#8b5cf6',
      bg: '#f5f3ff',
      actionText: 'View Cart',
      onClick: () => setActiveTab('medicines')
    },
    {
      step: '04',
      title: 'Get It Delivered',
      description: 'Follow order progress as the pharmacy prepares and dispatches your medicines. Confirm handover with your one-time delivery code.',
      icon: Bike,
      color: '#f97316',
      bg: '#fff7ed',
      actionText: 'Track Orders',
      onClick: () => setActiveTab('track')
    }
  ];

  return (
    <section className="how-it-works-section" style={{ padding: '60px 0', background: 'white', borderBottom: '1px solid var(--border-color)' }}>
      <style>{`
        @media (max-width: 767px) {
          .how-it-works-section {
            padding: 36px 0 !important;
          }
          .how-it-works-header {
            margin-bottom: 28px !important;
          }
          .how-it-works-header h2 {
            font-size: 1.6rem !important;
          }
          .how-it-works-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .step-card {
            padding: 20px 18px !important;
          }
        }
      `}</style>
      <div className="container">
        {/* Section Header */}
        <div className="how-it-works-header" style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 44px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'var(--primary-light)', color: 'var(--primary-dark)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px' }}>
            <CheckCircle2 size={14} /> SIMPLE 4-STEP PROCESS
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px', marginBottom: '12px' }}>
            How Med-in-Minutes Works
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
            We redesigned medicine procurement from the ground up to get urgent health supplies to your doorstep in minutes, not days.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="how-it-works-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="step-card"
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-lg)',
                  padding: '32px 24px',
                  border: '1.5px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  e.currentTarget.style.borderColor = item.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                {/* Step badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      background: item.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.color
                    }}
                  >
                    <Icon size={28} />
                  </div>
                  <span
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-heading)',
                      color: '#cbd5e1'
                    }}
                  >
                    {item.step}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, flexGrow: 1, marginBottom: '20px' }}>
                  {item.description}
                </p>

                <button
                  type="button"
                  onClick={item.onClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: item.color,
                    background: 'transparent',
                    padding: 0,
                    textAlign: 'left'
                  }}
                >
                  {item.actionText} <ArrowRight size={15} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
