'use client';

import React, { useEffect, useState } from 'react';
import { Home, LogOut, Plus, Trash2, UserRound, X, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';
import { supabaseAuth } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';

export const AuthModal = () => {
  const {
    isAuthModalOpen, setIsAuthModalOpen, user, setUser, savedAddresses,
    deleteAddress, setIsLocationModalOpen, setActiveTab, setActiveOrderId, showToast
  } = useApp();
  const [mode, setMode] = useState(user ? 'profile' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => setMode(user ? 'profile' : 'login'), [user, isAuthModalOpen]);
  if (!isAuthModalOpen) return null;

  const close = () => setIsAuthModalOpen(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      let response;
      try { 
        response = await api.login({ email, password }); 
      } catch { 
        response = null; 
      }
      
      if (response?.success && response.user) {
        if (response.user.role === 'admin') {
          showToast('Admin accounts sign in from the separate Admin Panel.', 'info');
          return;
        }
        const signedInUser = { ...response.user, role: 'buyer' };
        if (response.token) localStorage.setItem('mim_token', response.token);
        setUser(signedInUser);
        setIsAuthModalOpen(false);
        showToast('Signed in successfully.');
        return;
      }

      const data = await supabaseAuth.signIn({ email, password });
      if (!data?.user || !data.session) throw new Error('Sign-in did not return an active session. Check your account and try again.');
      localStorage.setItem('mim_token', data.session.access_token);
      setUser({
        id: data.user.id,
        name: data.user.user_metadata?.full_name || email.split('@')[0],
        email: data.user.email,
        phone: data.user.user_metadata?.phone || '',
        role: 'buyer'
      });
      close();
      showToast('Signed in successfully.');
    } catch (error) {
      if (error.message?.toLowerCase().includes('email not confirmed')) {
        showToast('Please confirm your email address before logging in. Check your inbox — or use the resend button below.', 'info');
      } else {
        showToast(error.message || 'Sign in failed.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      try {
        const data = await supabaseAuth.signUp({ email, password, name, phone, role: 'buyer' });
        if (data?.user && !data.session) {
          setMode('login');
          setPassword('');
          showToast('Check your email to confirm your account before signing in.', 'info');
          return;
        }
        if (data?.user && data.session) {
          localStorage.setItem('mim_token', data.session.access_token);
          setUser({ id: data.user.id, name, email: data.user.email || email, phone, role: 'buyer' });
          close();
          showToast('Customer account created.');
          return;
        }
      } catch (supabaseError) {
        const response = await api.register({ name, email, password, phone, role: 'buyer' });
        if (!response.success || !response.user) throw new Error(response.message || supabaseError.message);
        if (response.token) localStorage.setItem('mim_token', response.token);
        setUser({ ...response.user, role: 'buyer' });
        close();
        showToast('Customer account created.');
        return;
      }
      throw new Error('Could not create your account.');
    } catch (error) {
      showToast(error.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) { showToast('Enter your email address first.', 'info'); return; }
    try {
      await supabaseAuth.resendConfirmation(email);
      showToast('Confirmation email resent! Check your inbox.', 'info');
    } catch {
      showToast('Could not resend confirmation email.', 'error');
    }
  };

  const handleLogout = async () => {
    try { await supabaseAuth.signOut(); } catch { /* Local accounts do not have a Supabase session. */ }
    localStorage.removeItem('mim_admin_token');
    localStorage.removeItem('mim_token');
    localStorage.removeItem('mim_active_order');
    setActiveOrderId('');
    setUser(null);
    setActiveTab('home');
    setMode('login');
    close();
    showToast('Signed out.');
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="auth-title" onClick={(event) => event.stopPropagation()} style={{ padding: '26px', maxWidth: '470px', width: 'calc(100% - 28px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <div style={{ color: 'var(--primary)', fontSize: '.72rem', fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase' }}>Med-in-Minutes</div>
            <h2 id="auth-title" style={{ margin: '4px 0 0', fontSize: '1.35rem', color: 'var(--text-main)' }}>{mode === 'profile' ? 'Your account' : mode === 'register' ? 'Create customer account' : 'Customer sign in'}</h2>
          </div>
          <button onClick={close} aria-label="Close" style={{ border: 0, background: '#f1f5f9', borderRadius: '9px', padding: '8px', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        {mode === 'profile' && user ? (
          <>
            <div style={{ padding: '15px', borderRadius: '13px', background: '#f8fafc', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ width: '44px', height: '44px', display: 'grid', placeItems: 'center', borderRadius: '50%', color: 'white', background: user.role === 'admin' ? '#0f766e' : 'var(--primary)' }}>{user.role === 'admin' ? 'A' : <UserRound size={21} />}</div>
              <div style={{ minWidth: 0, flex: 1 }}><strong style={{ display: 'block', color: '#0f172a' }}>{user.name}</strong><span style={{ color: '#64748b', fontSize: '.84rem', overflowWrap: 'anywhere' }}>{user.email}</span>{user.role === 'admin' && <small style={{ display: 'block', marginTop: '3px', color: '#0f766e', fontWeight: 700 }}>Website administrator</small>}</div>
              <button onClick={handleLogout} aria-label="Sign out" title="Sign out" style={{ border: 0, background: 'transparent', color: '#dc2626', cursor: 'pointer', padding: '7px' }}><LogOut size={18} /></button>
            </div>
            {user.role === 'admin' && <button onClick={() => { setActiveTab('admin'); close(); }} style={{ width: '100%', border: 0, borderRadius: '10px', padding: '11px', marginBottom: '16px', background: '#0f766e', color: 'white', fontWeight: 750, cursor: 'pointer' }}>Open website admin panel</button>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '9px' }}><strong style={{ color: '#0f172a' }}>Saved addresses</strong><button onClick={() => { close(); setIsLocationModalOpen(true); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', border: 0, background: 'transparent', color: 'var(--primary)', fontWeight: 750, cursor: 'pointer' }}><Plus size={15} /> Add</button></div>
            {savedAddresses.length ? savedAddresses.map((address) => (
              <div key={address.id} style={{ display: 'flex', alignItems: 'center', gap: '9px', borderTop: '1px solid #eef2f5', padding: '11px 2px' }}>
                <Home size={17} color="var(--primary)" />
                <div style={{ flex: 1, minWidth: 0 }}><strong style={{ fontSize: '.86rem' }}>{address.label}</strong><div style={{ color: '#64748b', fontSize: '.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{address.fullAddress || address.street}</div></div>
                <button onClick={() => deleteAddress(address.id)} aria-label={`Delete ${address.label} address`} style={{ border: 0, background: 'transparent', color: '#dc2626', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </div>
            )) : <p style={{ margin: 0, borderTop: '1px solid #eef2f5', padding: '14px 2px', color: '#64748b', fontSize: '.85rem' }}>No saved addresses yet.</p>}
          </>
        ) : (
          <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
            {mode === 'register' && (
              <label style={{ display: 'grid', gap: '6px', marginBottom: '14px', color: '#334155', fontWeight: 700, fontSize: '.85rem' }}>
                Full name
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  placeholder="e.g. Rahul Sharma"
                  style={fieldStyle}
                />
              </label>
            )}
            <label style={{ display: 'grid', gap: '6px', marginBottom: '14px', color: '#334155', fontWeight: 700, fontSize: '.85rem' }}>
              Email address
              <input
                required
                type="email"
                inputMode="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                style={fieldStyle}
              />
            </label>
            {mode === 'register' && (
              <label style={{ display: 'grid', gap: '6px', marginBottom: '14px', color: '#334155', fontWeight: 700, fontSize: '.85rem' }}>
                Phone number <span style={{ fontWeight: 400, color: '#64748b' }}>(optional)</span>
                <input
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  style={fieldStyle}
                />
              </label>
            )}
            <label style={{ display: 'grid', gap: '6px', marginBottom: '18px', color: '#334155', fontWeight: 700, fontSize: '.85rem' }}>
              Password
              <div style={{ position: 'relative' }}>
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  placeholder="At least 6 characters"
                  style={{ ...fieldStyle, paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', minHeight: '44px', padding: '12px', marginBottom: '12px', fontSize: '0.95rem' }}
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create customer account'}
            </button>
            {mode === 'login' && (
              <button
                type="button"
                onClick={handleResendConfirmation}
                style={{ width: '100%', marginBottom: '14px', minHeight: '40px', padding: '10px', border: '1px dashed #94a3b8', borderRadius: '9px', background: 'transparent', color: '#64748b', fontSize: '.83rem', cursor: 'pointer' }}
              >
                Resend confirmation email
              </button>
            )}
            <div style={{ textAlign: 'center', fontSize: '.86rem', color: '#64748b' }}>
              {mode === 'login' ? 'New to Med-in-Minutes?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                style={{ border: 0, padding: 0, background: 'transparent', color: 'var(--primary)', fontWeight: 750, cursor: 'pointer', textDecoration: 'underline' }}
              >
                {mode === 'login' ? 'Create account' : 'Sign in'}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};

const fieldStyle = {
  width: '100%',
  minHeight: '44px',
  padding: '11px 14px',
  borderRadius: '10px',
  border: '1.5px solid var(--border-color)',
  fontSize: '16px'
};
