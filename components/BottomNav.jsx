'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Pill, Upload, ShoppingBag, Package } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    activeTab,
    setActiveTab,
    setIsPrescriptionModalOpen,
    setIsCartOpen,
    cart,
    user
  } = useApp();

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (pathname !== '/') {
      router.push('/');
    }
  };

  return (
    <nav
      className="mobile-bottom-nav"
      aria-label="Mobile Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        background: 'rgba(255, 255, 255, 0.97)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid #e2e8f0',
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.06)',
        display: 'none',
        height: '64px',
        padding: '0 8px',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <style>{`
        @media (max-width: 767px) {
          .mobile-bottom-nav {
            display: flex !important;
          }
        }
      `}</style>

      {/* 1. Home */}
      <button
        onClick={() => handleTabClick('home')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          color: activeTab === 'home' && pathname === '/' ? 'var(--medical-blue)' : '#64748b',
          fontSize: '0.7rem',
          fontWeight: activeTab === 'home' && pathname === '/' ? 800 : 600,
          flex: 1,
          height: '100%',
          gap: '3px'
        }}
      >
        <Home size={20} strokeWidth={activeTab === 'home' && pathname === '/' ? 2.5 : 2} />
        <span>Home</span>
      </button>

      {/* 2. Medicines Catalog */}
      <button
        onClick={() => handleTabClick('medicines')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          color: activeTab === 'medicines' && pathname === '/' ? 'var(--medical-blue)' : '#64748b',
          fontSize: '0.7rem',
          fontWeight: activeTab === 'medicines' && pathname === '/' ? 800 : 600,
          flex: 1,
          height: '100%',
          gap: '3px'
        }}
      >
        <Pill size={20} strokeWidth={activeTab === 'medicines' && pathname === '/' ? 2.5 : 2} />
        <span>Medicines</span>
      </button>

      {/* 3. Center Elevated Action: Upload Rx */}
      <button
        onClick={() => setIsPrescriptionModalOpen(true)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          color: '#ffffff',
          position: 'relative',
          top: '-12px',
          flex: 1
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--medical-blue) 0%, var(--health-green) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(8, 126, 139, 0.45)',
            border: '3px solid white'
          }}
        >
          <Upload size={22} color="white" />
        </div>
        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--medical-blue)', marginTop: '2px' }}>
          Upload Rx
        </span>
      </button>

      {/* 4. Orders / Tracking */}
      <button
        onClick={() => handleTabClick('track')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          color: activeTab === 'track' && pathname === '/' ? 'var(--medical-blue)' : '#64748b',
          fontSize: '0.7rem',
          fontWeight: activeTab === 'track' && pathname === '/' ? 800 : 600,
          flex: 1,
          height: '100%',
          gap: '3px'
        }}
      >
        <Package size={20} strokeWidth={activeTab === 'track' && pathname === '/' ? 2.5 : 2} />
        <span>{user ? 'Orders' : 'Track'}</span>
      </button>

      {/* 5. Cart */}
      <button
        onClick={() => setIsCartOpen(true)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          color: '#64748b',
          fontSize: '0.7rem',
          fontWeight: 600,
          flex: 1,
          height: '100%',
          gap: '3px',
          position: 'relative'
        }}
      >
        <div style={{ position: 'relative' }}>
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-8px',
                background: '#f97316',
                color: 'white',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                fontWeight: 800
              }}
            >
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>
    </nav>
  );
};

