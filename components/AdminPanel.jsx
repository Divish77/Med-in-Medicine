'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, Check, ImagePlus, LoaderCircle, PackagePlus, Pencil, Plus, Search, ShieldCheck, Trash2, X, Truck } from 'lucide-react';
import { api } from '@/lib/api';
import { supabaseAuth } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';

const categories = [
  'Pain Relief & Fever', 'Antibiotics', 'Stomach Care & Antacid', 'Cough & Cold',
  'Diabetes Care', 'Cardiac & BP', 'Vitamins & Supplements', 'First Aid & Wellness', 'Healthcare Devices'
];
const deliveryStages = ['Order Placed', 'Order Accepted by Pharmacy', 'Prescription Verification', 'Medicines Being Packed', 'Delivery Partner Assigned', 'Out for Delivery', 'Successfully Delivered'];

const blankMedicine = () => ({
  name: '', brand: '', genericName: '', category: categories[0], price: '', mrp: '', stock: '1',
  packSize: '', benefits: '', description: '', image: '', prescriptionRequired: false
});

const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"' && quoted && text[index + 1] === '"') { cell += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(cell.trim()); cell = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[index + 1] === '\n') index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = []; cell = '';
    } else cell += char;
  }
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  if (rows.length < 2) throw new Error('The CSV must include a header row and at least one medicine.');
  const headers = rows[0].map((header) => header.replace(/^\uFEFF/, '').toLowerCase());
  return rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] || ''])));
};

const inputStyle = { width: '100%', padding: '11px 12px', borderRadius: '10px', border: '1px solid #dbe4ee', background: '#fff', font: 'inherit', fontSize: '0.9rem', color: '#0f172a' };

export const AdminPanel = () => {
  const { user, setUser, setActiveTab, showToast } = useApp();
  const [medicines, setMedicines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderOtps, setOrderOtps] = useState({});
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [importing, setImporting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(blankMedicine);

  const loadOrders = useCallback(async () => {
    try {
      const response = await api.getOrders();
      if (!response.success) throw new Error(response.message || 'Could not load orders.');
      setOrders(response.orders || []);
    } catch (error) {
      showToast(error.message || 'Could not load orders.', 'error');
    }
  }, [showToast]);

  const updateOrderStage = async (order) => {
    setUpdatingOrderId(order.orderId);
    try {
      const matchedStageIndex = deliveryStages.indexOf(order.status);
      const currentIndex = matchedStageIndex >= 0 ? matchedStageIndex : Math.max(0, Number(order.stageIndex || 0));
      const nextIndex = Math.min(currentIndex + 1, deliveryStages.length - 2); // never jump to Delivered this way
      const response = await api.advanceOrderStage(order.orderId, nextIndex, order);
      if (!response.success || !response.order) throw new Error(response.message || 'Could not update order status.');
      setOrders((current) => current.map((item) => item.orderId === order.orderId ? response.order : item));
      showToast(`Order ${order.orderId} updated to ${response.order.status}.`);
    } catch (error) {
      showToast(error.message || 'Could not update order status.', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const cancelOrder = async (order) => {
    if (!window.confirm(`Cancel order ${order.orderId}? Any reserved stock will be returned to the catalog.`)) return;
    setUpdatingOrderId(order.orderId);
    try {
      const response = await api.cancelOrder(order.orderId, 'Cancelled by website administrator', order);
      if (!response.success || !response.order) throw new Error(response.message || 'Could not cancel order.');
      setOrders((current) => current.map((item) => item.orderId === order.orderId ? response.order : item));
      showToast(`Order ${order.orderId} cancelled. Payment status: ${response.order.paymentStatus}.`);
      await loadMedicines();
    } catch (error) {
      showToast(error.message || 'Could not cancel order.', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const confirmOrderDelivery = async (order) => {
    setUpdatingOrderId(order.orderId);
    try {
      const otpValue = orderOtps[order.orderId]?.trim() || order.deliveryConfirmationOtp || '';
      const response = await api.confirmOrderDelivery(order.orderId, otpValue, order);
      if (!response.success || !response.order) throw new Error(response.message || 'Could not confirm delivery.');
      setOrders((current) => current.map((item) => item.orderId === order.orderId ? response.order : item));
      setOrderOtps((current) => ({ ...current, [order.orderId]: '' }));
      showToast(`✅ Delivery confirmed for order ${order.orderId}.`);
    } catch (error) {
      showToast(error.message || 'Could not confirm delivery.', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Admin login state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    setLoginLoading(true);
    try {
      let adminUser = null;
      let adminToken = null;

      // 1. Authenticate with Supabase Auth
      try {
        const supabaseRes = await supabaseAuth.signIn({
          email: adminEmail.trim(),
          password: adminPassword
        });
        if (supabaseRes?.user && supabaseRes?.session) {
          const suUser = supabaseRes.user;
          const isAdmin = 
            suUser.email?.toLowerCase() === 'admin@example.com' ||
            suUser.email?.toLowerCase() === 'divishbansal77@gmail.com' ||
            suUser.user_metadata?.role === 'admin' ||
            suUser.app_metadata?.role === 'admin';

          if (!isAdmin) {
            throw new Error('This Supabase account is not authorized for website administration.');
          }

          adminUser = {
            id: suUser.id,
            name: suUser.user_metadata?.full_name || 'Website Administrator',
            email: suUser.email,
            role: 'admin'
          };
          adminToken = supabaseRes.session.access_token;
        }
      } catch (supabaseErr) {
        if (supabaseErr.message?.includes('not authorized')) throw supabaseErr;
      }

      // 2. Fallback to API login if Supabase auth was bypassed or offline
      if (!adminUser) {
        const response = await api.login({ email: adminEmail.trim(), password: adminPassword });
        if (!response?.success) throw new Error(response?.message || 'Admin sign in failed.');
        if (response.user?.role !== 'admin') throw new Error('This account is not authorized for website administration.');
        adminUser = { ...response.user, role: 'admin' };
        adminToken = response.token;
      }

      if (!adminToken) throw new Error('Could not obtain an administrator session token.');

      localStorage.setItem('mim_admin_token', adminToken);
      localStorage.removeItem('mim_token');
      setUser(adminUser);
      showToast('Administrator signed in successfully via Supabase.');
    } catch (error) {
      showToast(error.message || 'Admin sign in failed.', 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  const loadMedicines = useCallback(async () => {
    try {
      const response = await api.getMedicines({ limit: 500 });
      if (!response.success) throw new Error(response.message || 'Could not load the medicine catalog.');
      setMedicines(response.medicines || []);
    } catch (error) {
      showToast(error.message || 'Could not load the medicine catalog.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { if (user?.role === 'admin') { loadMedicines(); loadOrders(); } }, [user?.id, user?.role, loadMedicines, loadOrders]);

  const visibleMedicines = useMemo(() => medicines.filter((medicine) =>
    `${medicine.name} ${medicine.genericName || ''} ${medicine.brand || ''}`.toLowerCase().includes(query.trim().toLowerCase())
  ), [medicines, query]);

  const openNewMedicine = () => { setEditingId(null); setForm(blankMedicine()); setModalOpen(true); };
  const openEditMedicine = (medicine) => {
    setEditingId(medicine._id);
    setForm({ ...blankMedicine(), ...medicine, stock: String(medicine.stock ?? 0), price: String(medicine.price ?? ''), mrp: String(medicine.mrp ?? '') });
    setModalOpen(true);
  };

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast('Choose a JPG, PNG, or WebP image.', 'error');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Medicine images must be 5 MB or smaller.', 'error');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, image: String(reader.result || '') }));
    reader.onerror = () => showToast('Could not read that image.', 'error');
    reader.readAsDataURL(file);
  };

  const saveMedicine = async (event) => {
    event.preventDefault();
    if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < (editingId ? 0 : 1)) return showToast('New medicines need at least 1 item in stock so customers can purchase them.', 'error');
    if (!form.image) return showToast('Add a medicine image before saving.', 'error');
    if (!form.benefits.trim()) return showToast('Add the medicine benefits before saving.', 'error');
    setSaving(true);
    try {
      const payload = { ...form, stock: Number(form.stock), price: Number(form.price), mrp: form.mrp === '' ? Number(form.price) : Number(form.mrp) };
      const response = editingId
        ? await api.updateMedicine(editingId, payload)
        : await api.createMedicine(payload);
      if (!response.success || !response.medicine) throw new Error(response.message || 'Could not save this medicine.');
      setMedicines((current) => editingId
        ? current.map((medicine) => medicine._id === editingId ? response.medicine : medicine)
        : [response.medicine, ...current]);
      setModalOpen(false);
      showToast(editingId ? 'Medicine details updated.' : 'Medicine added to the company catalog.');
    } catch (error) {
      showToast(error.message || 'Could not save this medicine.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const importMedicinesCsv = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setImporting(true);
    try {
      const rows = parseCsv(await file.text());
      let imported = 0;
      const failures = [];
      for (const [index, row] of rows.entries()) {
        const name = String(row.name || '').trim();
        const price = Number(row.price);
        const stock = Number(row.stock);
        if (!name || !Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 1 || !row.image?.trim() || !row.benefits?.trim()) {
          failures.push(`Row ${index + 2}: requires name, valid price, stock above 0, image URL, and benefits.`);
          continue;
        }
        const mrp = row.mrp ? Number(row.mrp) : price;
        const payload = {
          name, price, mrp, stock,
          brand: row.brand || '', genericName: row.genericname || '',
          category: row.category || categories[0], packSize: row.packsize || '',
          benefits: row.benefits, image: row.image,
          prescriptionRequired: ['true', 'yes', '1'].includes(String(row.prescriptionrequired || '').toLowerCase())
        };
        try {
          const response = await api.createMedicine(payload);
          if (!response.success || !response.medicine) throw new Error(response.message || 'Rejected by server');
          imported += 1;
          setMedicines((current) => [response.medicine, ...current]);
        } catch (error) {
          failures.push(`Row ${index + 2} (${name}): ${error.message || 'Import failed.'}`);
        }
      }
      showToast(`${imported} medicine${imported === 1 ? '' : 's'} imported${failures.length ? `; ${failures.length} row${failures.length === 1 ? '' : 's'} need attention` : '.'}`, failures.length ? 'info' : 'success');
      if (failures.length) console.warn('Medicine CSV import issues:', failures);
    } catch (error) {
      showToast(error.message || 'Could not import this CSV file.', 'error');
    } finally {
      setImporting(false);
    }
  };

  const downloadCsvTemplate = () => {
    const csv = 'name,brand,genericName,category,price,mrp,stock,packSize,benefits,image,prescriptionRequired\n';
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'medicine-catalog-template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const deleteMedicine = async (medicine) => {
    if (!window.confirm(`Remove ${medicine.name} from the catalog?`)) return;
    try {
      const response = await api.deleteMedicine(medicine._id);
      if (!response.success) throw new Error(response.message || 'Could not remove this medicine.');
      setMedicines((current) => current.filter((item) => item._id !== medicine._id));
      showToast('Medicine removed from the catalog.');
    } catch (error) {
      showToast(error.message || 'Could not remove this medicine.', 'error');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <main style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: '32px 16px', background: '#f5f8f7' }}>
        <section style={{ maxWidth: '480px', textAlign: 'center', padding: '38px', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)' }}>
          <div style={{ width: '58px', height: '58px', display: 'grid', placeItems: 'center', borderRadius: '18px', background: '#e8f7f1', color: '#059669', margin: '0 auto 16px' }}><ShieldCheck size={28} /></div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#ecfdf5', color: '#047857', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 700, marginBottom: '10px' }}>
            <span>⚡ Supabase Auth Protected</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', margin: '0 0 8px', color: '#0f172a' }}>Admin sign in</h1>
          <p style={{ color: '#64748b', lineHeight: 1.6, margin: '0 0 22px' }}>Sign in with an authorized Supabase administrator account to manage the medicine catalog and live delivery fleet.</p>
          <form onSubmit={handleAdminLogin} style={{ display: 'grid', gap: '12px', textAlign: 'left' }}>
            <label style={{ display: 'grid', gap: '6px', color: '#334155', fontWeight: 700, fontSize: '.85rem' }}>Admin email<input required type="email" autoComplete="username" value={adminEmail} onChange={(event) => setAdminEmail(event.target.value)} style={inputStyle} /></label>
            <label style={{ display: 'grid', gap: '6px', color: '#334155', fontWeight: 700, fontSize: '.85rem' }}>Password<input required type="password" autoComplete="current-password" value={adminPassword} onChange={(event) => setAdminPassword(event.target.value)} style={inputStyle} /></label>
            <button type="submit" disabled={loginLoading} style={{ border: 0, borderRadius: '11px', background: '#059669', color: 'white', padding: '12px 18px', fontWeight: 750, cursor: loginLoading ? 'wait' : 'pointer' }}>{loginLoading ? 'Signing in…' : 'Sign in to Admin Panel'}</button>
          </form>
          <button onClick={() => setActiveTab('home')} style={{ border: 0, background: 'transparent', color: '#059669', marginTop: '16px', cursor: 'pointer', fontWeight: 700 }}>Back to customer storefront</button>
        </section>
      </main>
    );
  }

  return (
    <main style={{ minHeight: 'calc(100vh - 80px)', background: '#f5f8f7', padding: '36px 0 64px' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap', marginBottom: '26px' }}>
          <div>
            <button onClick={() => setActiveTab('home')} style={{ border: 0, background: 'transparent', color: '#059669', padding: 0, marginBottom: '12px', cursor: 'pointer', fontWeight: 700 }}>← Customer storefront</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#059669', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}><Activity size={16} /> 10 MN Company</div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', margin: '8px 0', color: '#10251e', letterSpacing: '-0.04em' }}>Website admin panel</h1>
            <p style={{ margin: 0, color: '#64748b', maxWidth: '620px', lineHeight: 1.6 }}>Manage the customer-facing medicine catalog. Add product photos, benefits, price, and stock details for each listing.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flexWrap: 'wrap' }}>
            <input id="medicine-csv-upload" type="file" accept=".csv,text/csv" onChange={importMedicinesCsv} disabled={importing} style={{ display: 'none' }} />
            <button onClick={downloadCsvTemplate} style={{ border: '1px solid #cbd5e1', borderRadius: '11px', padding: '12px 14px', background: 'white', color: '#334155', fontWeight: 700, cursor: 'pointer' }}>CSV template</button>
            <label htmlFor="medicine-csv-upload" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid #a7f3d0', borderRadius: '11px', padding: '12px 14px', background: '#ecfdf5', color: '#047857', fontWeight: 750, cursor: importing ? 'wait' : 'pointer' }}>{importing ? <LoaderCircle size={17} className="spin" /> : <PackagePlus size={17} />} {importing ? 'Importing…' : 'Import CSV'}</label>
            <button onClick={openNewMedicine} style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', border: 0, borderRadius: '12px', padding: '13px 18px', background: '#059669', color: 'white', fontWeight: 750, cursor: 'pointer', boxShadow: '0 8px 20px rgba(5,150,105,.2)' }}><Plus size={19} /> Add medicine</button>
          </div>
        </div>

        <style>{`
          @media (max-width: 767px) {
            .admin-order-article {
              grid-template-columns: 1fr !important;
              gap: 14px !important;
            }
          }
        `}</style>
        <section style={{ margin: '6px 0 30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div><h2 style={{ margin: 0, color: '#10251e', fontSize: '1.35rem' }}>Order delivery control</h2><p style={{ margin: '5px 0 0', color: '#64748b', fontSize: '.88rem' }}>Update each order as it is prepared and delivered. Delivery confirmation requires the customer handover code.</p></div>
            <button onClick={loadOrders} style={{ border: '1px solid #cbd5e1', borderRadius: '9px', background: 'white', padding: '9px 12px', color: '#334155', fontWeight: 700, cursor: 'pointer' }}>Refresh orders</button>
          </div>
          {orders.length === 0 ? <div style={{ padding: '25px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', color: '#64748b' }}>No customer orders yet.</div> : <div style={{ display: 'grid', gap: '12px' }}>
            {orders.map((order) => {
              const matchedStageIndex = deliveryStages.indexOf(order.status);
              const stageIndex = matchedStageIndex >= 0 ? matchedStageIndex : order.status === 'Payment Confirmed' ? 0 : Math.max(0, Number(order.stageIndex || 0));
              const delivered = order.status === 'Successfully Delivered';
              const cancelled = order.status === 'Cancelled';
              const readyToConfirm = stageIndex >= deliveryStages.length - 2 && !delivered && !cancelled;
              return <article key={order.orderId} className="admin-order-article" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: '16px', alignItems: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '17px', boxShadow: '0 5px 18px rgba(15,23,42,.03)' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flexWrap: 'wrap' }}>
                    <strong style={{ color: '#0f172a' }}>#{order.orderId}</strong>
                    <span style={{ padding: '4px 8px', borderRadius: '999px', background: cancelled ? '#fee2e2' : delivered ? '#dcfce7' : '#ecfdf5', color: cancelled ? '#b91c1c' : '#047857', fontSize: '.76rem', fontWeight: 750 }}>{order.status}</span>
                    {order.deliveryConfirmationOtp && !delivered && !cancelled && (
                      <span style={{ padding: '3px 8px', borderRadius: '6px', background: '#fef3c7', color: '#b45309', fontSize: '.76rem', fontWeight: 800 }}>
                        OTP: {order.deliveryConfirmationOtp}
                      </span>
                    )}
                  </div>
                  <div style={{ marginTop: '6px', color: '#475569', fontSize: '.87rem' }}>{order.customerName} · {order.customerPhone} · ₹{Number(order.totalAmount || 0).toFixed(2)}</div>
                  <div style={{ marginTop: '4px', color: '#64748b', fontSize: '.82rem' }}>{(order.items || []).map((item) => `${item.name} × ${item.quantity}`).join(', ')}</div>
                  <div style={{ marginTop: '5px', color: '#64748b', fontSize: '.8rem' }}>{order.deliveryAddress?.fullAddress || order.deliveryAddress?.street || order.deliveryAddress?.pincode || 'Address unavailable'}</div>
                  <div style={{ marginTop: '8px', color: '#0f766e', fontSize: '.8rem', fontWeight: 700 }}>Stage {Math.min(stageIndex + 1, deliveryStages.length)} of {deliveryStages.length}: {cancelled ? 'Cancelled' : deliveryStages[stageIndex] || order.status}</div>
                  {order.paymentStatus && <div style={{ marginTop: '4px', color: order.paymentStatus === 'Refund Pending' ? '#b45309' : '#64748b', fontSize: '.8rem' }}>Payment: {order.paymentStatus}</div>}
                </div>
                {delivered ? <strong style={{ color: '#047857', display: 'inline-flex', alignItems: 'center', gap: '7px' }}><Check size={17} /> Delivered</strong> : cancelled ? <strong style={{ color: '#b91c1c' }}>Cancelled</strong> : <div style={{ display: 'flex', gap: '7px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {stageIndex < deliveryStages.length - 2 && (
                    <button disabled={updatingOrderId === order.orderId} onClick={() => updateOrderStage(order)} style={{ border: 0, borderRadius: '9px', background: '#0f766e', color: 'white', padding: '10px 12px', fontWeight: 750, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                      {updatingOrderId === order.orderId ? <LoaderCircle className="spin" size={16} /> : <Truck size={16} />} Advance
                    </button>
                  )}
                  <input aria-label={`Handover code for ${order.orderId}`} inputMode="numeric" maxLength={4} placeholder={order.deliveryConfirmationOtp ? `OTP: ${order.deliveryConfirmationOtp}` : '4-digit code'} value={orderOtps[order.orderId] || ''} onChange={(event) => setOrderOtps((current) => ({ ...current, [order.orderId]: event.target.value.replace(/\D/g, '').slice(0, 4) }))} style={{ ...inputStyle, width: '110px', padding: '9px 10px', fontSize: '.84rem' }} />
                  <button disabled={updatingOrderId === order.orderId} onClick={() => confirmOrderDelivery(order)} style={{ border: 0, borderRadius: '9px', background: '#059669', color: 'white', padding: '10px 12px', fontWeight: 750, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={16} /> Confirm delivery
                  </button>
                  <button disabled={updatingOrderId === order.orderId} onClick={() => cancelOrder(order)} style={{ border: '1px solid #fecaca', borderRadius: '9px', background: '#fff7f7', color: '#b91c1c', padding: '10px 12px', fontWeight: 750, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <X size={16} /> Cancel
                  </button>
                </div>}
              </article>;
            })}
          </div>}
        </section>

        <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '18px', flexWrap: 'wrap', background: 'white', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '16px 18px', marginBottom: '20px' }}>
          <div style={{ color: '#475569', fontSize: '0.9rem' }}><strong style={{ color: '#0f172a' }}>{medicines.length}</strong> {medicines.length === 1 ? 'medicine' : 'medicines'} in the company catalog</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '9px', width: 'min(100%, 340px)', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '11px', padding: '9px 12px', color: '#64748b' }}><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search medicines" style={{ border: 0, outline: 0, background: 'transparent', width: '100%', font: 'inherit' }} /></label>
        </section>

        {loading ? <div style={{ display: 'grid', placeItems: 'center', padding: '80px 16px', color: '#64748b' }}><LoaderCircle className="spin" size={28} /> Loading medicine catalog…</div>
          : visibleMedicines.length === 0 ? (
            <section style={{ textAlign: 'center', background: 'white', border: '1px dashed #b8ccc3', borderRadius: '20px', padding: '58px 20px' }}>
              <div style={{ width: '58px', height: '58px', borderRadius: '18px', display: 'grid', placeItems: 'center', background: '#e8f7f1', color: '#059669', margin: '0 auto 16px' }}><PackagePlus size={28} /></div>
              <h2 style={{ margin: '0 0 8px', color: '#0f172a', fontSize: '1.25rem' }}>{query ? 'No medicines match that search' : 'Your catalog is ready for its first medicine'}</h2>
              <p style={{ margin: '0 auto 20px', color: '#64748b', maxWidth: '440px', lineHeight: 1.6 }}>{query ? 'Try a different name or generic ingredient.' : 'Add a medicine name, photo, price, and benefits. It will appear in the customer medicine catalog.'}</p>
              {!query && <button onClick={openNewMedicine} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: 0, borderRadius: '10px', background: '#059669', color: 'white', padding: '11px 16px', cursor: 'pointer', fontWeight: 750 }}><Plus size={17} /> Add first medicine</button>}
            </section>
          ) : (
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '18px' }}>
              {visibleMedicines.map((medicine) => (
                <article key={medicine._id} style={{ background: 'white', borderRadius: '18px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 8px 24px rgba(15,23,42,.04)' }}>
                  <div style={{ height: '190px', background: '#f1f5f9' }}>{medicine.image && <img src={medicine.image} alt={medicine.name} style={{ height: '100%', width: '100%', objectFit: 'cover' }} />}</div>
                  <div style={{ padding: '17px' }}>
                    <div style={{ color: '#059669', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 800 }}>{medicine.category}</div>
                    <h2 style={{ fontSize: '1.15rem', margin: '6px 0 4px', color: '#10251e' }}>{medicine.name}</h2>
                    <p style={{ margin: '0 0 10px', color: '#64748b', fontSize: '0.85rem' }}>{medicine.genericName || medicine.brand || 'Medicine'}</p>
                    <p style={{ margin: '0 0 13px', color: '#475569', fontSize: '0.85rem', lineHeight: 1.55, minHeight: '40px' }}>{medicine.benefits || 'No benefits added yet.'}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eef2f5', paddingTop: '12px' }}>
                      <strong style={{ color: '#0f172a' }}>₹{Number(medicine.price || 0).toFixed(2)}</strong>
                      <span style={{ fontSize: '0.78rem', color: medicine.stock > 0 ? '#059669' : '#64748b' }}>{medicine.stock > 0 ? `${medicine.stock} in stock` : 'Out of stock'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '13px' }}>
                      <button onClick={() => openEditMedicine(medicine)} style={{ flex: 1, border: '1px solid #dbe4ee', background: 'white', borderRadius: '9px', padding: '9px', color: '#334155', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: '7px' }}><Pencil size={15} /> Edit</button>
                      <button onClick={() => deleteMedicine(medicine)} aria-label={`Remove ${medicine.name}`} style={{ border: '1px solid #fecaca', background: '#fff7f7', color: '#dc2626', borderRadius: '9px', padding: '9px 12px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}
      </div>

      {modalOpen && (
        <div role="presentation" onClick={() => !saving && setModalOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(15,23,42,.55)', display: 'grid', placeItems: 'center', padding: '18px' }}>
          <section role="dialog" aria-modal="true" aria-labelledby="medicine-form-title" onClick={(event) => event.stopPropagation()} style={{ width: 'min(100%, 760px)', maxHeight: '92vh', overflow: 'auto', background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 25px 80px rgba(15,23,42,.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px', marginBottom: '20px' }}>
              <div><div style={{ color: '#059669', fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 800 }}>10 MN Company catalog</div><h2 id="medicine-form-title" style={{ margin: '5px 0 0', fontSize: '1.45rem', color: '#0f172a' }}>{editingId ? 'Edit medicine' : 'Add a medicine'}</h2></div>
              <button type="button" onClick={() => setModalOpen(false)} disabled={saving} aria-label="Close" style={{ border: 0, borderRadius: '9px', padding: '8px', background: '#f1f5f9', cursor: 'pointer' }}><X size={19} /></button>
            </div>
            <form onSubmit={saveMedicine}>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '14px' }}>
                <label style={{ display: 'grid', gap: '6px', color: '#334155', fontWeight: 700, fontSize: '.83rem' }}>Medicine name *<input required maxLength={120} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Enter the product name" style={inputStyle} /></label>
                <label style={{ display: 'grid', gap: '6px', color: '#334155', fontWeight: 700, fontSize: '.83rem' }}>Generic name or ingredient<input value={form.genericName} onChange={(event) => setForm({ ...form, genericName: event.target.value })} placeholder="Optional" style={inputStyle} /></label>
                <label style={{ display: 'grid', gap: '6px', color: '#334155', fontWeight: 700, fontSize: '.83rem' }}>Price (₹) *<input required type="number" min="0.01" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="0.00" style={inputStyle} /></label>
                <label style={{ display: 'grid', gap: '6px', color: '#334155', fontWeight: 700, fontSize: '.83rem' }}>Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} style={inputStyle}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
                <label style={{ display: 'grid', gap: '6px', color: '#334155', fontWeight: 700, fontSize: '.83rem' }}>Stock quantity<input required type="number" min={editingId ? '0' : '1'} step="1" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} style={inputStyle} /></label>
                <label style={{ display: 'grid', gap: '6px', color: '#334155', fontWeight: 700, fontSize: '.83rem' }}>Pack size<input value={form.packSize} onChange={(event) => setForm({ ...form, packSize: event.target.value })} placeholder="e.g. 10 tablets" style={inputStyle} /></label>
                <label style={{ gridColumn: '1 / -1', display: 'grid', gap: '6px', color: '#334155', fontWeight: 700, fontSize: '.83rem' }}>Benefits *<textarea required maxLength={1200} rows={4} value={form.benefits} onChange={(event) => setForm({ ...form, benefits: event.target.value })} placeholder="Describe the intended benefits and uses in clear, customer-friendly language." style={{ ...inputStyle, resize: 'vertical' }} /></label>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', color: '#334155', fontWeight: 700, fontSize: '.83rem', marginBottom: '7px' }}>Product image * <span style={{ color: '#64748b', fontWeight: 400 }}>JPG, PNG or WebP, up to 5 MB</span></label>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', minHeight: '130px', border: '1px dashed #94a3b8', borderRadius: '12px', overflow: 'hidden', background: '#f8fafc', cursor: 'pointer', color: '#475569' }}>
                    {form.image ? <img src={form.image} alt="Medicine preview" style={{ maxHeight: '190px', maxWidth: '100%', objectFit: 'contain' }} /> : <><ImagePlus size={23} color="#059669" /> Choose an image from your device</>}
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '9px', marginTop: '16px', color: '#334155', fontSize: '.85rem', fontWeight: 650 }}><input type="checkbox" checked={Boolean(form.prescriptionRequired)} onChange={(event) => setForm({ ...form, prescriptionRequired: event.target.checked })} /> Requires a prescription</label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
                <button type="button" onClick={() => setModalOpen(false)} disabled={saving} style={{ border: '1px solid #dbe4ee', background: 'white', borderRadius: '10px', padding: '11px 15px', cursor: 'pointer', fontWeight: 700 }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ border: 0, background: '#059669', color: 'white', borderRadius: '10px', padding: '11px 16px', cursor: saving ? 'wait' : 'pointer', fontWeight: 750, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>{saving ? <LoaderCircle className="spin" size={17} /> : <Check size={17} />}{saving ? 'Saving…' : editingId ? 'Save changes' : 'Add medicine'}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
};

export default AdminPanel;
