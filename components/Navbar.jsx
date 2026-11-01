'use client';

import React, { useState, useEffect } from 'react';
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
  Settings,
  Home,
  Pill,
  Package,
  Info,
  HelpCircle,
  ShieldCheck,
  Search
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

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'medicines', label: 'Medicines', icon: Pill },
    { id: 'upload-rx', label: 'Upload Prescription', icon: Upload, isAction: true },
    { id: 'track', label: user && user.role !== 'admin' ? 'My Orders' : 'Track Order', icon: Package },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'contact', label: 'Contact Us', icon: HelpCircle }
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
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
      {/* Top Emergency & Express Banner */}
      <div style={{ background: 'linear-gradient(90deg, #064e3b 0%, #059669 50%, #0284c7 100%)', color: 'white', padding: '5px 0', fontSize: '0.75rem', fontWeight: 600 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="badge" style={{ background: '#f59e0b', color: '#0f172a', padding: '2px 7px', fontSize: '0.68rem', fontWeight: 800 }}>
              ⚡ 10-MIN EXPRESS
            </span>
            <span className="banner-subtext">Connecting nearby verified pharmacies to your doorstep.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.72rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} /> 24x7 Night Delivery
            </span>
            <a href="tel:1800633646" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'white', textDecoration: 'none' }}>
              <PhoneCall size={12} /> 1800-633-646
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', gap: '10px' }}>
        {/* Left: Brand Logo */}
        <div
          onClick={handleLogoClick}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', textDecoration: 'none', flexShrink: 0 }}
        >
          <img
            src="/logo.png"
            alt="Med-in-Minutes"
            style={{ height: '42px', maxWidth: '140px', objectFit: 'contain', display: 'block' }}
          />
        </div>

        {/* Center: Location Selector Chip */}
        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="location-chip"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 10px',
            background: 'var(--primary-light)',
            border: '1.5px solid var(--primary-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--primary-dark)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            maxWidth: '220px',
            textAlign: 'left',
            minHeight: '38px'
          }}
          title="Click to change delivery location"
          suppressHydrationWarning
        >
          <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }} suppressHydrationWarning>
            <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase' }} suppressHydrationWarning>
              {deliveryLocation.serviceable ? (deliveryLocation.etaLabel || `10 MINS`) : 'UNAVAILABLE'}
            </div>
            <div style={{ color: 'var(--text-main)', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} suppressHydrationWarning>
              {deliveryLocation.pincode ? `${deliveryLocation.area || 'Location'}, ${deliveryLocation.pincode}` : 'Select PIN'}
            </div>
          </div>
          <ChevronDown size={13} color="var(--primary)" style={{ flexShrink: 0, marginLeft: 'auto' }} />
        </button>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '4px' }} className="desktop-nav">
          <style>{`
            @media (min-width: 1024px) {
              .desktop-nav { display: flex !important; }
              .mobile-toggle { display: none !important; }
            }
            @media (max-width: 640px) {
              .banner-subtext { display: none !important; }
              .location-chip { max-width: 140px !important; }
            }
            @media (max-width: 380px) {
              .location-chip { max-width: 105px !important; padding: 4px 6px !important; }
            }
          `}</style>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id && pathname === '/';
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s'
                }}
              >
                {link.id === 'upload-rx' && <Upload size={14} color="var(--primary)" />}
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Auth, Cart & Mobile Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Admin toggle if admin */}
          {user?.role === 'admin' && (
            <button
              onClick={() => {
                setActiveTab(activeTab === 'admin' ? 'home' : 'admin');
                if (pathname !== '/') router.push('/');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-md)',
                border: activeTab === 'admin' ? '1.5px solid #0f766e' : '1px solid #99f6e4',
                background: activeTab === 'admin' ? '#ccfbf1' : '#f0fdfa',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#0f766e',
                minHeight: '38px'
              }}
              title="Open website administration"
            >
              <Settings size={14} />
              <span className="desktop-only">Admin</span>
            </button>
          )}

          {/* User Profile / Login */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'white',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              minHeight: '38px',
              cursor: 'pointer'
            }}
            title={user ? `Signed in as ${user.name}` : 'Sign in to account'}
          >
            <User size={16} color="var(--primary)" />
            <span style={{ display: 'none' }} className="user-name-span">
              <style>{`@media (min-width: 640px) { .user-name-span { display: inline !important; } }`}</style>
              {user ? user.name.split(' ')[0] : 'Sign in'}
            </span>
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: 'white',
              fontSize: '0.825rem',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
              minHeight: '38px',
              cursor: 'pointer'
            }}
          >
            <ShoppingBag size={16} />
            <span style={{ display: 'none' }} className="cart-text-span">
              <style>{`@media (min-width: 480px) { .cart-text-span { display: inline !important; } }`}</style>
              Cart
            </span>
            {cartCount > 0 && (
              <span
                style={{
                  background: '#f97316',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="mobile-toggle"
            aria-label="Open mobile navigation menu"
            style={{
              padding: '8px',
              borderRadius: '8px',
              background: '#f1f5f9',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '38px',
              minWidth: '38px',
              cursor: 'pointer'
            }}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Slide-in Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div
            className="drawer-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '85%',
              maxWidth: '340px',
              height: '100%',
              background: 'white',
              boxShadow: '-8px 0 30px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <style>{`
              @keyframes slideInRight {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
            `}</style>

            {/* Drawer Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
                color: 'white',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                >
                  <User size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>
                    {user ? user.name : 'Welcome Patient'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>
                    {user ? user.email : 'Sign in for faster 10-min delivery'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* User Quick Action */}
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', background: '#f8fafc' }}>
              {!user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                >
                  Sign In / Register
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    style={{ background: 'transparent', color: 'var(--primary)', fontWeight: 700, fontSize: '0.825rem', padding: 0 }}
                  >
                    View Account &amp; Addresses &rarr;
                  </button>
                  {user.role === 'admin' && (
                    <span style={{ fontSize: '0.7rem', background: '#ccfbf1', color: '#0f766e', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      Admin
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeTab === link.id && pathname === '/';
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 700 : 600,
                      color: isActive ? 'var(--primary)' : 'var(--text-main)',
                      background: isActive ? 'var(--primary-light)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <Icon size={18} color={isActive ? 'var(--primary)' : '#64748b'} />
                    <span>{link.label}</span>
                    {link.id === 'upload-rx' && (
                      <span className="badge badge-express" style={{ marginLeft: 'auto', fontSize: '0.65rem', padding: '2px 6px' }}>
                        AI OCR
                      </span>
                    )}
                  </button>
                );
              })}

              {user?.role === 'admin' && (
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    if (pathname !== '/') router.push('/');
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#0f766e',
                    background: '#f0fdfa',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginTop: '8px'
                  }}
                >
                  <Settings size={18} color="#0f766e" />
                  <span>Admin Control Panel</span>
                </button>
              )}
            </div>

            {/* Drawer Footer / 24x7 Emergency Contact */}
            <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', background: '#f8fafc' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                24x7 MEDICAL EMERGENCY DESK
              </div>
              <a
                href="tel:1800633646"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--primary)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  padding: '8px 12px',
                  background: 'white',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}
              >
                <PhoneCall size={16} color="var(--primary)" />
                <span>1800-633-646 (Toll-Free)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
