'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  MapPin,
  ShoppingBag,
  Upload,
  User,
  Menu,
  X,
  PhoneCall,
  ChevronDown,
  Clock,
  Settings
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    activeTab,
    setActiveTab,
    deliveryLocation,
    setIsLocationModalOpen,
    setIsPrescriptionModalOpen,
    setIsCartOpen,
    setIsAuthModalOpen,
    cart,
    user
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'medicines', label: 'Medicines' },
    { id: 'upload-rx', label: 'Upload Prescription', isAction: true },
    { id: 'track', label: user && user.role !== 'admin' ? 'My Orders' : 'Track Order' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' }
  ];

  const handleNavClick = (link) => {
    if (link.isAction) {
      setIsPrescriptionModalOpen(true);
    } else {
      setActiveTab(link.id);
      if (pathname !== '/') {
        router.push('/');
      }
    }
    setMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    setActiveTab('home');
    if (pathname !== '/') {
      router.push('/');
    }
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
      {/* Top Emergency & Express Banner */}
      <div style={{ background: 'linear-gradient(90deg, #064e3b 0%, #059669 50%, #0284c7 100%)', color: 'white', padding: '6px 0', fontSize: '0.785rem', fontWeight: 600 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge" style={{ background: '#f59e0b', color: '#0f172a', padding: '2px 8px', fontSize: '0.7rem' }}>
              ⚡ 10-MIN EXPRESS
            </span>
            <span>Connecting nearest licensed pharmacies directly to your doorstep.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} /> 24x7 Night Delivery Active
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <PhoneCall size={13} /> Helpline: 1800-633-646
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px', gap: '16px' }}>
        {/* Brand Logo */}
        <div
          onClick={handleLogoClick}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', textDecoration: 'none' }}
        >
          <img
            src="/logo.png"
            alt="Med-in-Minutes"
            style={{ height: '52px', objectFit: 'contain', display: 'block' }}
          />
        </div>

        {/* Location Selector Chip */}
        <button
          onClick={() => setIsLocationModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            background: 'var(--primary-light)',
            border: '1.5px solid var(--primary-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--primary-dark)',
            fontSize: '0.825rem',
            fontWeight: 600,
            cursor: 'pointer',
            maxWidth: '280px',
            textAlign: 'left'
          }}
          title="Click to change delivery location"
          suppressHydrationWarning
        >
          <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} suppressHydrationWarning>
            <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }} suppressHydrationWarning>
              {deliveryLocation.serviceable ? `DELIVERY ${deliveryLocation.etaLabel || `IN ${deliveryLocation.etaMinutes || 10} MINS`}` : 'UNAVAILABLE ZONE'}
            </div>
            <div style={{ color: 'var(--text-main)', fontSize: '0.825rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} suppressHydrationWarning>
              {deliveryLocation.area || 'Set Location'}, {deliveryLocation.pincode}
            </div>
          </div>
          <ChevronDown size={14} color="var(--primary)" style={{ flexShrink: 0, marginLeft: 'auto' }} />
        </button>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '6px' }} className="desktop-nav">
          <style>{`
            @media (min-width: 1024px) {
              .desktop-nav { display: flex !important; }
              .mobile-toggle { display: none !important; }
            }
          `}</style>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: activeTab === link.id ? 700 : 600,
                color: activeTab === link.id ? 'var(--primary)' : 'var(--text-muted)',
                background: activeTab === link.id ? 'var(--primary-light)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s'
              }}
            >
              {link.id === 'upload-rx' && <Upload size={15} color="var(--primary)" />}
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Actions: Auth & Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user?.role === 'admin' && (
            <button
              onClick={() => {
                setActiveTab(activeTab === 'admin' ? 'home' : 'admin');
                if (pathname !== '/') router.push('/');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: activeTab === 'admin' ? '1.5px solid #0f766e' : '1px solid #99f6e4',
                background: activeTab === 'admin' ? '#ccfbf1' : '#f0fdfa',
                fontSize: '0.825rem',
                fontWeight: 700,
                color: '#0f766e'
              }}
              title="Open website administration"
            >
              <Settings size={15} />
              <span style={{ display: 'none' }} className="admin-toggle-span">
                <style>{`@media (min-width: 768px) { .admin-toggle-span { display: inline !important; } }`}</style>
                {activeTab === 'admin' ? 'Customer Store' : 'Admin Panel'}
              </span>
            </button>
          )}

          {/* User Profile / Login */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: user?.role === 'admin' ? '1.5px solid #0f766e' : '1px solid var(--border-color)',
              background: user?.role === 'admin' ? '#f0fdfa' : 'white',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: user?.role === 'admin' ? '#0f766e' : 'var(--text-main)'
            }}
          >
            {user?.role === 'admin' ? <Settings size={16} color="#0f766e" /> : <User size={16} color="var(--primary)" />}
            <span style={{ display: 'none' }} className="user-name-span">
              <style>{`@media (min-width: 640px) { .user-name-span { display: inline !important; } }`}</style>
              {user ? (user.role === 'admin' ? `${user.name.split(' ')[0]} (Admin)` : user.name.split(' ')[0]) : 'Login'}
            </span>
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
              position: 'relative'
            }}
          >
            <ShoppingBag size={18} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span
                style={{
                  background: '#f97316',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              padding: '8px',
              borderRadius: '8px',
              background: '#f1f5f9',
              color: 'var(--text-main)'
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{ background: 'white', borderTop: '1px solid var(--border-color)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '12px 14px',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: activeTab === link.id ? 700 : 600,
                color: activeTab === link.id ? 'var(--primary)' : 'var(--text-main)',
                background: activeTab === link.id ? 'var(--primary-light)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              {link.id === 'upload-rx' && <Upload size={18} color="var(--primary)" />}
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
