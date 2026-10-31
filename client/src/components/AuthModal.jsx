import React, { useEffect, useState } from 'react';
import { Home, LogOut, Plus, Trash2, UserRound, X } from 'lucide-react';
import { api } from '../api';
import { supabaseAuth } from '../supabase';
import { useApp } from '../context/AppContext';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => setMode(user ? 'profile' : 'login'), [user, isAuthModalOpen]);
  if (!isAuthModalOpen) return null;

  const close = () => setIsAuthModalOpen(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      // A Vercel-hosted frontend cannot reach the local Express default at
      // localhost:5000. Use that API only in development or when explicitly configured.
      if (!import.meta.env.PROD || import.meta.env.VITE_API_URL) {
        let response;
        try { response = await api.login({ email, password }); } catch { response = null; }
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
            <div style={{ color: 'var(--primary)', fontSize: '.72rem', fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase' }}>Med in Minutes</div>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '9px' }}><strong style={{ color: '#0f172a' }}>Saved addresses</strong><button onClick={() => { close(); setIsLocationModalOpen(true); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', border: 0, background: 'transparent', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}><Plus size={15} /> Add</button></div>
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
            {mode === 'register' && <label style={{ display: 'grid', gap: '5px', marginBottom: '12px', color: '#334155', fontWeight: 700, fontSize: '.83rem' }}>Full name<input required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" style={fieldStyle} /></label>}
            <label style={{ display: 'grid', gap: '5px', marginBottom: '12px', color: '#334155', fontWeight: 700, fontSize: '.83rem' }}>Email address<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" style={fieldStyle} /></label>
            {mode === 'register' && <label style={{ display: 'grid', gap: '5px', marginBottom: '12px', color: '#334155', fontWeight: 700, fontSize: '.83rem' }}>Phone number <span style={{ fontWeight: 400, color: '#64748b' }}>(optional)</span><input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" style={fieldStyle} /></label>}
            <label style={{ display: 'grid', gap: '5px', marginBottom: '18px', color: '#334155', fontWeight: 700, fontSize: '.83rem' }}>Password<input required type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} style={fieldStyle} /></label>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '11px', marginBottom: '10px' }}>{loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create customer account'}</button>
            {mode === 'login' && (
              <button type="button" onClick={handleResendConfirmation} style={{ width: '100%', marginBottom: '12px', padding: '9px', border: '1px dashed #94a3b8', borderRadius: '9px', background: 'transparent', color: '#64748b', fontSize: '.83rem', cursor: 'pointer' }}>
                Resend confirmation email
              </button>
            )}
            <div style={{ textAlign: 'center', fontSize: '.84rem', color: '#64748b' }}>{mode === 'login' ? 'New to Med in Minutes?' : 'Already have an account?'}{' '}<button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ border: 0, padding: 0, background: 'transparent', color: 'var(--primary)', fontWeight: 750, cursor: 'pointer' }}>{mode === 'login' ? 'Create account' : 'Sign in'}</button></div>
          </form>
        )}
      </section>
    </div>
  );
};

const fieldStyle = { width: '100%', padding: '10px 12px', borderRadius: '9px', border: '1px solid var(--border-color)', fontSize: '.9rem' };
