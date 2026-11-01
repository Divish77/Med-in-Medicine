'use client';

import React, { Suspense, useCallback, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Package,
  CreditCard,
  FileCheck,
  Store,
  Bike,
  Navigation,
  CheckCircle2,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  Download,
  Check,
  History,
  ChevronRight
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';

const InteractiveMap = dynamic(() => import('./InteractiveMap').then((module) => module.InteractiveMap), { ssr: false });

export const OrderTrackingPage = () => {
  const {
    activeOrderId,
    setActiveOrderId,
    socket,
    setIsSuccessModalOpen,
    setDeliveredOrder,
    setIsInvoiceModalOpen,
    setInvoiceData,
    showToast,
    user
  } = useApp();

  const [order, setOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(activeOrderId || '');
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  const loadOrders = useCallback(async () => {
    if (!user?.id) {
      setOrders([]);
      return;
    }
    setOrdersLoading(true);
    try {
      const res = await api.getOrders(user.id);
      if (res.success) setOrders(res.orders || []);
      else showToast(res.message || 'Could not load your order history.', 'error');
    } catch {
      showToast('Could not load your order history.', 'error');
    } finally {
      setOrdersLoading(false);
    }
  }, [user?.id, showToast]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  // Fetch order details
  const loadOrder = useCallback(async (id) => {
    if (!id) return;
    try {
      const res = await api.getOrder(id);
      if (res.success && res.order) {
        setOrder(res.order);
        setSearchInput(res.order.orderId);
        if (res.order.status === 'Successfully Delivered' || res.order.status === 'Delivered' || res.order.status === 'Cancelled') {
          setActiveOrderId('');
          if (typeof window !== 'undefined') {
            localStorage.removeItem('mim_active_order');
          }
        }
      } else {
        // Fallback to local cached order before clearing
        let localFallback = null;
        if (typeof window !== 'undefined') {
          try {
            const raw = localStorage.getItem(`mim_order_${id}`);
            if (raw) localFallback = JSON.parse(raw);
          } catch {}
        }
        if (localFallback) {
          setOrder(localFallback);
          setSearchInput(localFallback.orderId);
        } else {
          setOrder(null);
        }
      }
    } catch {
      setOrder(null);
    }
  }, [setActiveOrderId]);

  useEffect(() => {
    if (activeOrderId) {
      loadOrder(activeOrderId);
    } else if (user?.id) {
      api.getOrders(user.id).then((res) => {
        if (res.success && res.orders && res.orders.length > 0) {
          const inProgress = res.orders.find(o => 
            o.status !== 'Successfully Delivered' && 
            o.status !== 'Delivered' && 
            o.status !== 'Cancelled'
          );
          if (inProgress) {
            setOrder(inProgress);
            setActiveOrderId(inProgress.orderId);
            setSearchInput(inProgress.orderId);
          } else {
            setOrder(null);
            setSearchInput('');
          }
        } else {
          setOrder(null);
          setSearchInput('');
        }
      }).catch(() => {});
    } else {
      setOrder(null);
      setSearchInput('');
    }
  }, [activeOrderId, user?.id, loadOrder, setActiveOrderId]);

  // Socket.IO real-time updates listener
  const trackedOrderId = order?.orderId;
  useEffect(() => {
    if (!socket || !trackedOrderId) return;

    socket.emit('join_order', trackedOrderId);

    const handleOrderUpdated = (updated) => {
      setOrder(updated);
      setOrders((current) => current.map((item) => item.orderId === updated.orderId ? updated : item));
      showToast(`Order status updated: ${updated.status}`, 'info');
    };

    const handleOrderDelivered = (delivered) => {
      setOrder(delivered);
      setOrders((current) => current.map((item) => item.orderId === delivered.orderId ? delivered : item));
      setDeliveredOrder(delivered);
      setIsSuccessModalOpen(true);
      showToast('Your Medicines Have Been Delivered!');
    };

    socket.on('order_updated', handleOrderUpdated);
    socket.on('order_delivered', handleOrderDelivered);

    return () => {
      socket.off('order_updated', handleOrderUpdated);
      socket.off('order_delivered', handleOrderDelivered);
    };
  }, [socket, trackedOrderId, setDeliveredOrder, setIsSuccessModalOpen, showToast]);

  // Polling fallback for real-time tracking
  useEffect(() => {
    if (!trackedOrderId) return;
    if (order?.status === 'Delivered' || order?.status === 'Cancelled') return;
    const interval = setInterval(async () => {
      try {
        const res = await api.getOrder(trackedOrderId);
        if (res.success && res.order) {
          if (res.order.stageIndex !== order?.stageIndex || res.order.status !== order?.status) {
            setOrder(res.order);
            setOrders((current) => current.map((item) => item.orderId === res.order.orderId ? res.order : item));
            if (res.order.status === 'Delivered') {
              setDeliveredOrder(res.order);
              setIsSuccessModalOpen(true);
            }
          }
        }
      } catch {}
    }, 4000);
    return () => clearInterval(interval);
  }, [trackedOrderId, order?.status, order?.stageIndex, setDeliveredOrder, setIsSuccessModalOpen]);

  // Open Invoice
  const handleViewInvoice = async () => {
    if (!order) return;
    try {
      const res = await api.getInvoice(order.orderId);
      if (res.success && res.invoice) {
        setInvoiceData(res.invoice);
        setIsInvoiceModalOpen(true);
      }
    } catch  {
      showToast('Error loading invoice', 'error');
    }
  };

  // Map icon strings to Lucide components
  const getStageIcon = (iconName, isCompleted, isCurrent) => {
    const color = isCurrent ? '#059669' : isCompleted ? '#10b981' : '#94a3b8';
    switch (iconName) {
      case 'CheckCircle2': return <CheckCircle2 size={20} color={color} />;
      case 'CreditCard': return <CreditCard size={20} color={color} />;
      case 'FileCheck': return <FileCheck size={20} color={color} />;
      case 'Store': return <Store size={20} color={color} />;
      case 'Package': return <Package size={20} color={color} />;
      case 'Bike': return <Bike size={20} color={color} />;
      case 'Navigation': return <Navigation size={20} color={color} />;
      default: return <Check size={20} color={color} />;
    }
  };

  const isDelivered = order?.status === 'Successfully Delivered';
  const hasDeliveryCoordinates = order?.deliveryAddress?.lat != null && order?.deliveryAddress?.lng != null && Number.isFinite(Number(order.deliveryAddress.lat)) && Number.isFinite(Number(order.deliveryAddress.lng));
  const hasRiderLocation = order?.deliveryPartner?.currentLat != null && order?.deliveryPartner?.currentLng != null && Number.isFinite(Number(order.deliveryPartner.currentLat)) && Number.isFinite(Number(order.deliveryPartner.currentLng));

  return (
    <div style={{ padding: '40px 0 70px', background: 'var(--bg-main)' }}>
      <div className="container">
        {user?.role !== 'admin' && (
          <section aria-labelledby="order-history-title" style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <History size={21} color="var(--primary)" />
              <h2 id="order-history-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Your order history</h2>
            </div>
            {!user ? (
              <div style={{ padding: '18px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '14px', color: 'var(--text-muted)' }}>Sign in to see all your orders here.</div>
            ) : ordersLoading && orders.length === 0 ? (
              <div role="status" style={{ padding: '18px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '14px', color: 'var(--text-muted)' }}>Loading your orders…</div>
            ) : orders.length === 0 ? (
              <div style={{ padding: '18px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '14px', color: 'var(--text-muted)' }}>You haven’t placed any orders yet. Your orders will appear here after checkout.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '12px' }}>
                {orders.map((item) => {
                  const selected = order?.orderId === item.orderId;
                  return (
                    <button key={item.orderId} type="button" onClick={() => { setOrder(item); setActiveOrderId(item.orderId); setSearchInput(item.orderId); }} aria-pressed={selected}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', textAlign: 'left', padding: '15px', background: selected ? '#ecfdf5' : 'white', border: `1px solid ${selected ? '#6ee7b7' : 'var(--border-color)'}`, borderRadius: '14px', cursor: 'pointer' }}>
                      <span style={{ minWidth: 0 }}>
                        <strong style={{ display: 'block', color: 'var(--text-main)' }}>#{item.orderId}</strong>
                        <span style={{ display: 'block', marginTop: '5px', color: 'var(--text-muted)', fontSize: '.82rem' }}>{new Date(item.createdAt).toLocaleDateString()} · {item.items?.length || 0} item{item.items?.length === 1 ? '' : 's'} · ₹{Number(item.totalAmount || 0).toFixed(2)}</span>
                        <span style={{ display: 'inline-block', marginTop: '8px', color: item.status === 'Cancelled' ? '#dc2626' : item.status === 'Successfully Delivered' ? '#047857' : '#0369a1', fontWeight: 750, fontSize: '.82rem' }}>{item.status}</span>
                      </span>
                      <ChevronRight size={18} color="var(--primary)" />
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {!order && (
          <div style={{ maxWidth: '520px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '20px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <Navigation size={42} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>Track an order</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '18px' }}>Choose an order from your history above or enter its order ID.</p>
            <form onSubmit={(event) => { event.preventDefault(); loadOrder(searchInput.trim()); }} style={{ display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="Enter your Order ID" value={searchInput} onChange={(event) => setSearchInput(event.target.value.toUpperCase())} style={{ flex: 1, minWidth: 0, padding: '12px 14px', borderRadius: '10px', border: '1.5px solid var(--border-color)', fontWeight: 700 }} />
              <button type="submit" className="btn btn-primary">Track</button>
            </form>
          </div>
        )}

        {order && <>
        {/* Top Header & Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Order #{order.orderId}
              </h1>
              <span className={`badge ${isDelivered ? 'badge-otc' : 'badge-express'}`}>
                {isDelivered ? 'Delivered' : order.estimatedDeliveryLabel ? `ETA ${order.estimatedDeliveryLabel}` : order.estimatedDeliveryMinutes ? `ETA ${order.estimatedDeliveryMinutes} Mins` : 'ETA unavailable'}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Placed at {order.timeline[0]?.timestamp || 'Just now'} • Fulfilling Store: {order.pharmacy?.name}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                loadOrder(searchInput.trim());
              }}
              style={{ display: 'flex', gap: '6px' }}
            >
              <input
                type="text"
                placeholder="Switch Order ID..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                style={{ width: '160px', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
              />
              <button type="submit" className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
                Track
              </button>
            </form>

            <button
              onClick={handleViewInvoice}
              className="btn btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            >
              <Download size={15} /> Invoice
            </button>
          </div>
        </div>

        {/* DEMO SIMULATION CONTROL PANEL (Clearly labelled requirement) */}
        <div style={{ background: '#0f172a', color: 'white', borderRadius: '16px', padding: '16px 20px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <Navigation size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>ORDER STATUS</span>
              </div>
              <p style={{ fontSize: '0.785rem', color: '#94a3b8' }}>
                Order progress is updated by the pharmacy as it is fulfilled.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {!isDelivered ? (
              <span style={{ color: '#475569', fontSize: '.82rem' }}>The pharmacy confirms delivery after checking your handover code.</span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setDeliveredOrder(order);
                  setIsSuccessModalOpen(true);
                }}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                🎉 View Delivery Success Screen
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Main Tracking Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '28px' }} className="tracking-grid">
          <style>{`
            @media (min-width: 992px) {
              .tracking-grid { gridTemplateColumns: 1.15fr 0.85fr !important; }
            }
          `}</style>

          {/* LEFT: Live Map & Delivery Partner Card */}
          <div>
            {/* Live Map Card */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Navigation size={18} color="var(--primary)" />
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                    {hasRiderLocation ? 'Live GPS Delivery Route' : 'Delivery Location'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse-express 1.5s infinite' }} />
                  {isDelivered ? 'Delivery Complete' : hasRiderLocation ? 'Live Tracking Active' : 'Live tracking unavailable'}
                </div>
              </div>

              {/* Leaflet Map with Pharmacy, Moving Rider, and Destination pins */}
              {hasDeliveryCoordinates ? (
                <Suspense fallback={<div role="status" style={{ minHeight: '180px', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>Loading map…</div>}>
                  <InteractiveMap
                    center={hasRiderLocation ? [Number(order.deliveryPartner.currentLat), Number(order.deliveryPartner.currentLng)] : [Number(order.deliveryAddress.lat), Number(order.deliveryAddress.lng)]}
                    zoom={14}
                    pharmacyPos={order.pharmacy?.lat != null && order.pharmacy?.lng != null ? [Number(order.pharmacy.lat), Number(order.pharmacy.lng)] : null}
                    deliveryPos={[Number(order.deliveryAddress.lat), Number(order.deliveryAddress.lng)]}
                    riderPos={hasRiderLocation ? [Number(order.deliveryPartner.currentLat), Number(order.deliveryPartner.currentLng)] : null}
                    height="340px"
                  />
                </Suspense>
              ) : (
                <div style={{ minHeight: '180px', display: 'grid', placeItems: 'center', color: 'var(--text-muted)', background: '#f8fafc', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                  Map tracking will appear when location coordinates are available.
                </div>
              )}

              {/* Map Footer Route Info */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', padding: '12px', background: '#f8fafc', borderRadius: '12px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Store size={16} color="var(--primary)" />
                  <span>From: <strong>{order.pharmacy?.name}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="#ef4444" />
                  <span>To: <strong>{order.deliveryAddress?.label} ({order.deliveryAddress?.pincode})</strong></span>
                </div>
              </div>
            </div>

            {/* Delivery Partner Card */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px' }}>
                Delivery Partner Details
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', display: 'grid', placeItems: 'center', color: 'var(--primary)', background: 'var(--primary-light)' }}><Bike size={24} /></div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>
                        {order.deliveryPartner?.name || 'Delivery partner not assigned'}
                      </strong>
                      <span className="badge badge-express" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                        ⭐ {order.deliveryPartner?.rating ? `${order.deliveryPartner.rating} / 5` : 'Not rated'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      EV Scooter: <strong>{order.deliveryPartner?.vehicleNumber || 'Not assigned'}</strong> • {order.deliveryPartner?.deliveriesCount ? `${order.deliveryPartner.deliveriesCount} deliveries` : 'Delivery history unavailable'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <a
                    href={`tel:${order.deliveryPartner?.phone || ''}`}
                    className="btn btn-secondary"
                    style={{ padding: '10px 16px', fontSize: '0.85rem' }}
                  >
                    <Phone size={15} color="var(--primary)" /> Call Rider
                  </a>
                  <button
                    onClick={() => setSupportModalOpen(true)}
                    className="btn btn-secondary"
                    style={{ padding: '10px 16px', fontSize: '0.85rem' }}
                  >
                    <MessageSquare size={15} color="#0284c7" /> Support
                  </button>
                </div>
              </div>

              {/* Delivery OTP verification info */}
              {order.status !== 'Successfully Delivered' && order.status !== 'Delivered' && order.status !== 'Cancelled' ? (
                <div style={{ marginTop: '18px', padding: '12px 16px', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={20} color="#059669" />
                    <span style={{ fontSize: '0.85rem', color: '#064e3b', fontWeight: 600 }}>
                      Share OTP upon medicine package handover:
                    </span>
                  </div>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '2px', color: '#059669', background: 'white', padding: '4px 12px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                    {order.deliveryConfirmationOtp || 'Not available'}
                  </span>
                </div>
              ) : (order.status === 'Successfully Delivered' || order.status === 'Delivered') ? (
                <div style={{ marginTop: '18px', padding: '12px 16px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #86efac', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={20} color="#16a34a" />
                  <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 700 }}>
                    Package Delivered &amp; Handover Completed Successfully.
                  </span>
                </div>
              ) : (
                <div style={{ marginTop: '18px', padding: '12px 16px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#991b1b', fontWeight: 700 }}>
                    Order Cancelled.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Order Progress Timeline & Order Details */}
          <div>
            {/* Order Progress Timeline */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Order Progress Timeline
                </h3>
                <span className="badge badge-express" style={{ fontSize: '0.75rem' }}>
                  Step {order.stageIndex + 1} of 8
                </span>
              </div>

              {/* Timeline Container */}
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {order.timeline.map((step, idx) => {
                  const isCompleted = step.completed;
                  const isCurrent = order.stageIndex === idx && !isDelivered;

                  return (
                    <div key={step.status} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                      {/* Left Icon and connecting vertical line */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: isCurrent ? '#059669' : isCompleted ? '#ecfdf5' : '#f1f5f9',
                            border: `2px solid ${isCurrent ? '#059669' : isCompleted ? '#10b981' : '#cbd5e1'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isCurrent ? 'white' : isCompleted ? '#059669' : '#94a3b8',
                            boxShadow: isCurrent ? '0 0 12px rgba(5, 150, 105, 0.4)' : 'none',
                            zIndex: 2
                          }}
                        >
                          {getStageIcon(step.icon, isCompleted, isCurrent)}
                        </div>

                        {idx < order.timeline.length - 1 && (
                          <div
                            style={{
                              width: '2px',
                              height: '34px',
                              background: isCompleted ? '#10b981' : '#e2e8f0',
                              marginTop: '4px',
                              marginBottom: '-4px'
                            }}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, paddingTop: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: isCurrent ? 800 : 700, color: isCurrent ? 'var(--primary)' : isCompleted ? 'var(--text-main)' : 'var(--text-muted)' }}>
                            {idx + 1}. {step.status}
                          </h4>
                          {step.timestamp && (
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isCurrent ? 'var(--primary)' : '#94a3b8' }}>
                              {step.timestamp}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.4 }}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary & Medicine Items */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Ordered Medicines ({order.items.length})
                </h3>
                <span className="badge badge-otc" style={{ fontSize: '0.75rem' }}>
                  {order.paymentMethod} • {order.paymentStatus}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
                {order.items.map((item, index) => (
                  <div key={item._id || item.medicineId || `${item.name}-${index}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{item.quantity}x</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.name}</span>
                      {item.prescriptionRequired && <span className="badge badge-rx" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>Rx</span>}
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Delivery fee</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)', fontWeight: 800, fontSize: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
                  <span>Order total</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>}
      </div>

      {/* Support Modal */}
        {order && supportModalOpen && (
        <div className="modal-overlay" onClick={() => setSupportModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '24px', maxWidth: '420px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>24x7 Priority Medical Support</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Order #{order.orderId} • Express Medical Dispatch Desk
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href="tel:1800633646" className="btn btn-primary" style={{ width: '100%' }}>
                <Phone size={16} /> Call Emergency Helpline (1800-633-646)
              </a>
              <button
                type="button"
                onClick={() => {
                  showToast('Connecting to on-duty pharmacist...');
                  setSupportModalOpen(false);
                }}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                <MessageSquare size={16} /> Chat with Pharmacist
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
  );
};
