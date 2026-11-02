'use client';

import React from 'react';
import { MapPin, Search, CreditCard, Bike, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const HowItWorksSection = () => {
  const { setIsLocationModalOpen, setIsPrescriptionModalOpen, setActiveTab } = useApp();

  const steps = [
    {
      step: '01',
      title: 'Select your location',
      description: 'Enter your 6-digit PIN code or detect your location to link instantly with nearby licensed retail pharmacies.',
      icon: MapPin,
      color: 'var(--medical-blue)',
      bg: 'var(--medical-blue-light)',
      actionText: 'Choose Location',
      onClick: () => setIsLocationModalOpen(true)
    },
    {
      step: '02',
      title: 'Search or upload your prescription',
      description: 'Find required medicines from verified pharmacy inventory, or securely upload your doctor’s prescription for rapid validation.',
      icon: Search,
      color: 'var(--health-green)',
      bg: 'var(--health-green-light)',
      actionText: 'Upload or Browse',
      onClick: () => setIsPrescriptionModalOpen(true)
    },
    {
      step: '03',
      title: 'Place your order',
      description: 'Review genuine medicines, cold-chain handling, and choose from Instant UPI, Card, NetBanking, or Cash on Delivery.',
      icon: CreditCard,
      color: '#0284c7',
      bg: '#e0f2fe',
      actionText: 'View Medicines',
      onClick: () => setActiveTab('medicines')
    },
    {
      step: '04',
      title: 'Track and receive your medicines',
      description: 'Watch live delivery progress on an interactive GPS map and confirm tamper-evident handover with your secure delivery code.',
      icon: Bike,
      color: '#d97706',
      bg: '#fef3c7',
      actionText: 'Track Delivery',
      onClick: () => setActiveTab('track')
    }
  ];

  return (
    <section className="how-it-works-section" style={{ padding: '64px 0', background: 'white', borderBottom: '1px solid var(--border-color)' }}>
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
        {/* Section Header - Newbay Medical Style */}
        <div className="how-it-works-header" style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', background: 'var(--medical-blue-light)', color: 'var(--medical-blue)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px' }}>
            <CheckCircle2 size={14} color="var(--medical-blue)" /> SIMPLE 4-STEP PROCESS
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', fontWeight: 800, color: 'var(--dark-navy)', letterSpacing: '-0.5px', marginBottom: '14px' }}>
            How Med-in-Minutes Works
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            A transparent and compliant healthcare delivery workflow connecting licensed pharmacists to your doorstep in minutes.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="how-it-works-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
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
                  e.currentTarget.style.borderColor = 'var(--medical-blue)';
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
                      width: '54px',
                      height: '54px',
                      borderRadius: '14px',
                      background: item.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.color
                    }}
                  >
                    <Icon size={26} />
                  </div>
                  <span
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-heading)',
                      color: '#cbd5e1'
                    }}
                  >
                    {item.step}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '10px' }}>
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
