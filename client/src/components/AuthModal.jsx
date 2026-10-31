import React, { useState } from 'react';
import { User, Mail, Lock, Phone, MapPin, X, Check, Home, Briefcase, Plus, Trash2, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    user,
    setUser,
    savedAddresses,
    deleteAddress,
    setIsLocationModalOpen,
    setActiveTab,
    showToast
  } = useApp();

  const [mode, setMode] = useState(user ? 'profile' : 'login'); // 'login', 'register', 'profile'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.success && res.user) {
        setUser(res.user);
        setMode('profile');
        showToast('Logged in successfully!');
      } else {
        showToast(res.message || 'Login failed', 'error');
      }
    } catch (err) {
      // Demo fallback login
      const demoUser = {
        id: 'usr_' + Date.now(),
        name: email.split('@')[0] || 'Customer',
        email,
        phone: '+91 98765 43210'
      };
      setUser(demoUser);
      setMode('profile');
      showToast('Logged in as ' + demoUser.name);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.register({ name, email, password, phone });
      if (res.success && res.user) {
        setUser(res.user);
        setMode('profile');
        showToast('Account registered successfully!');
      } else {
        showToast(res.message || 'Registration failed', 'error');
      }
    } catch (err) {
      const newUser = { id: 'usr_' + Date.now(), name, email, phone };
      setUser(newUser);
      setMode('profile');
      showToast('Account created!');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setMode('login');
    showToast('Logged out');
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '28px', maxWidth: '480px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {mode === 'profile' ? 'Customer Profile & Addresses' : mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              {mode === 'profile' ? 'Manage your saved addresses and active deliveries' : 'Access ultra-fast 10-minute medicine delivery'}
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            style={{ background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} color="var(--text-muted)" />
          </button>
        </div>

        {/* PROFILE VIEW */}
        {mode === 'profile' && user && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', background: '#f8fafc', borderRadius: '14px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
                {user.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>{user.name}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.phone || '+91 98765 43210'}</div>
              </div>
              <button
                onClick={handleLogout}
                style={{ background: 'transparent', padding: '6px', color: '#dc2626' }}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>

            {/* Saved Addresses Section */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  Saved Addresses ({savedAddresses.length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    setIsLocationModalOpen(true);
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  <Plus size={13} /> Add Address
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    style={{
                      padding: '10px 12px',
                      background: 'white',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.825rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ color: 'var(--primary)', marginTop: '2px' }}>
                        {addr.label === 'Home' && <Home size={15} />}
                        {addr.label === 'Work' && <Briefcase size={15} />}
                        {addr.label === 'Other' && <MapPin size={15} />}
                      </div>
                      <div>
                        <strong>{addr.label}</strong> ({addr.pincode})
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{addr.fullAddress}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteAddress(addr.id)}
                      style={{ background: 'transparent', padding: '4px', color: '#94a3b8' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsAuthModalOpen(false);
                setActiveTab('track');
              }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
            >
              View Order Tracking & History
            </button>
          </div>
        )}

        {/* LOGIN VIEW */}
        {mode === 'login' && (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="priya.sharma@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginBottom: '14px' }}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                style={{ background: 'transparent', color: 'var(--primary)', fontWeight: 700 }}
              >
                Sign Up
              </button>
            </div>
          </form>
        )}

        {/* REGISTER VIEW */}
        {mode === 'register' && (
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="priya.sharma@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                  Mobile Phone
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginBottom: '14px' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{ background: 'transparent', color: 'var(--primary)', fontWeight: 700 }}
              >
                Log In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
