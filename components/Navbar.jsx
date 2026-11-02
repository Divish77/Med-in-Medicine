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
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(18, 59, 93, 0.04)' }}>
      {/* Top Clinical & Emergency Banner - Newbay Medical Style */}
      <div style={{ background: 'var(--dark-navy)', color: 'white', padding: '6px 0', fontSize: '0.75rem', fontWeight: 600 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge" style={{ background: 'var(--health-green)', color: 'white', padding: '2px 8px', fontSize: '0.68rem', fontWeight: 800 }}>
              ⚡ 10-MIN EXPRESS
            </span>
            <span className="banner-subtext" style={{ color: '#E9EFF2' }}>Connecting verified neighbourhood pharmacies to your doorstep.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.72rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#E9EFF2' }}>
              <Clock size={12} color="var(--health-green)" /> 24x7 Night Dispensing
            </span>
            <a href="tel:1800633646" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#E9EFF2', textDecoration: 'none', fontWeight: 700 }}>
              <PhoneCall size={12} color="var(--health-green)" /> 1800-633-646
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px', gap: '12px' }}>
        {/* Left: Brand Logo */}
        <div
          onClick={handleLogoClick}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', textDecoration: 'none', flexShrink: 0 }}
        >
          <img
            src="/logo.png"
            alt="Med-in-Minutes"
            style={{ height: '44px', maxWidth: '145px', objectFit: 'contain', display: 'block' }}
          />
        </div>

        {/* Center: Location Selector Chip */}
        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="location-chip"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            background: 'var(--medical-blue-light)',
            border: '1.5px solid var(--medical-blue-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--dark-navy)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            maxWidth: '230px',
            textAlign: 'left',
            minHeight: '40px',
            transition: 'all 0.15s ease'
          }}
          title="Click to change delivery location"
          suppressHydrationWarning
        >
          <MapPin size={16} color="var(--medical-blue)" style={{ flexShrink: 0 }} />
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }} suppressHydrationWarning>
            <div style={{ fontSize: '0.65rem', color: 'var(--medical-blue)', fontWeight: 800, textTransform: 'uppercase' }} suppressHydrationWarning>
              {deliveryLocation.serviceable ? (deliveryLocation.etaLabel || `10 MINS`) : 'UNAVAILABLE'}
            </div>
            <div style={{ color: 'var(--dark-navy)', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} suppressHydrationWarning>
              {deliveryLocation.pincode ? `${deliveryLocation.area || 'Location'}, ${deliveryLocation.pincode}` : 'Select PIN'}
            </div>
          </div>
          <ChevronDown size={13} color="var(--medical-blue)" style={{ flexShrink: 0, marginLeft: 'auto' }} />
        </button>

        {/* Desktop Navigation Links - Newbay Medical Style */}
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
                  padding: '8px 13px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? 'var(--medical-blue)' : 'var(--dark-navy)',
                  background: isActive ? 'var(--medical-blue-light)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s'
                }}
              >
                {link.id === 'upload-rx' && <Upload size={14} color="var(--medical-blue)" />}
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
                border: activeTab === 'admin' ? '1.5px solid var(--medical-blue)' : '1px solid var(--medical-blue-border)',
                background: activeTab === 'admin' ? 'var(--medical-blue-light)' : '#f0fdfa',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--medical-blue)',
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
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-color)',
              background: 'white',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--dark-navy)',
              minHeight: '38px',
              cursor: 'pointer'
            }}
            title={user ? `Signed in as ${user.name}` : 'Sign in to account'}
          >
            <User size={16} color="var(--medical-blue)" />
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
              gap: '7px',
              padding: '7px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #087E8B 0%, #066570 100%)',
              color: 'white',
              fontSize: '0.825rem',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(8, 126, 139, 0.25)',
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
                  background: 'var(--health-green)',
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
              background: 'var(--border-light)',
              color: 'var(--dark-navy)',
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
            background: 'rgba(18, 59, 93, 0.55)',
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
              boxShadow: '-8px 0 30px rgba(18, 59, 93, 0.25)',
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
                background: 'var(--dark-navy)',
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
                    background: 'rgba(255, 255, 255, 0.15)',
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
                  <div style={{ fontSize: '0.72rem', color: '#E9EFF2' }}>
                    {user ? user.email : 'Sign in for faster 10-min delivery'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <div style={{ padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '0 8px 8px' }}>
                Navigation
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = activeTab === link.id && pathname === '/';
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: isActive ? 'var(--medical-blue-light)' : 'transparent',
                        color: isActive ? 'var(--medical-blue)' : 'var(--dark-navy)',
                        fontWeight: isActive ? 700 : 600,
                        fontSize: '0.9rem',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Icon size={18} color={isActive ? 'var(--medical-blue)' : 'var(--dark-navy)'} />
                        <span>{link.label}</span>
                      </div>
                      {link.isAction && (
                        <span className="badge" style={{ background: 'var(--health-green)', color: 'white', fontSize: '0.65rem', padding: '2px 6px' }}>
                          Rx
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Emergency Call Box */}
              <div style={{ marginTop: '24px', padding: '16px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--dark-navy)', fontWeight: 800, fontSize: '0.85rem', marginBottom: '4px' }}>
                  <ShieldCheck size={16} color="var(--medical-blue)" /> 24x7 Patient Care
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  Need urgent pharmaceutical support or order assistance?
                </p>
                <a
                  href="tel:1800633646"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    background: 'var(--dark-navy)',
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  <PhoneCall size={14} color="var(--health-green)" /> Call 1800-633-646
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
