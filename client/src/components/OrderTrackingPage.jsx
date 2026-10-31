import React, { useState, useEffect } from 'react';
import {
  Package,
  CreditCard,
  FileCheck,
  Store,
  Bike,
  Navigation,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  Download,
  Star,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../api';
import { InteractiveMap } from './InteractiveMap';

export const OrderTrackingPage = () => {
  const {
    activeOrderId,
    setActiveOrderId,
    socket,
    setIsSuccessModalOpen,
    setDeliveredOrder,
    setIsInvoiceModalOpen,
    setInvoiceData,
    showToast
  } = useApp();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(activeOrderId || '');
  const [otpInput, setOtpInput] = useState('');
  const [isConfirmingDelivery, setIsConfirmingDelivery] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  useEffect(() => {
    setOtpInput(order?.deliveryConfirmationOtp || '');
  }, [order?.orderId, order?.deliveryConfirmationOtp]);

  // Fetch order details
  const loadOrder = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.getOrder(id);
      if (res.success && res.order) {
        setOrder(res.order);
        setSearchInput(res.order.orderId);
      } else {
        showToast('Order not found. Please check Order ID.', 'error');
      }
    } catch (err) {
      showToast('Error loading order tracking', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeOrderId) {
      loadOrder(activeOrderId);
    } else {
      // Load most recent order if any
      api.getOrders().then((res) => {
        if (res.success && res.orders && res.orders.length > 0) {
          setOrder(res.orders[0]);
          setActiveOrderId(res.orders[0].orderId);
          setSearchInput(res.orders[0].orderId);
        }
      });
    }
  }, [activeOrderId]);

  // Socket.IO real-time updates listener
  useEffect(() => {
    if (!socket || !order) return;

    socket.emit('join_order', order.orderId);

    const handleOrderUpdated = (updated) => {
      setOrder(updated);
      showToast(`Order status updated: ${updated.status}`, 'info');
    };

    const handleOrderDelivered = (delivered) => {
      setOrder(delivered);
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
  }, [socket, order ? order.orderId : null]);

  // Authorized Delivery Confirmation Action (Mandatory Requirement)
  const handleConfirmDelivery = async () => {
    if (!order) return;
    setIsConfirmingDelivery(true);
    try {
      const res = await api.confirmOrderDelivery(order.orderId, otpInput);
      if (res.success && res.order) {
        setOrder(res.order);
        setDeliveredOrder(res.order);
        setIsSuccessModalOpen(true);
      } else {
        showToast(res.message || 'Delivery confirmation failed', 'error');
      }
    } catch (err) {
      showToast('Error confirming delivery', 'error');
    } finally {
      setIsConfirmingDelivery(false);
    }
  };

  // Open Invoice
  const handleViewInvoice = async () => {
    if (!order) return;
    try {
      const res = await api.getInvoice(order.orderId);
      if (res.success && res.invoice) {
        setInvoiceData(res.invoice);
        setIsInvoiceModalOpen(true);
      }
    } catch (err) {
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

  if (!order) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <Navigation size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '10px' }}>Track Your Order</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Enter your unique Order ID to view real-time delivery progress and rider location.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loadOrder(searchInput.trim());
            }}
            style={{ display: 'flex', gap: '8px' }}
          >
            <input
              type="text"
              placeholder="Enter your Order ID"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
              style={{ flex: 1, padding: '12px 14px', borderRadius: '10px', border: '1.5px solid var(--border-color)', fontWeight: 700 }}
            />
            <button type="submit" className="btn btn-primary">
              Track
            </button>
          </form>
        </div>
      </div>
    );
  }

  const isDelivered = order.status === 'Successfully Delivered';
  const hasDeliveryCoordinates = order.deliveryAddress?.lat != null && order.deliveryAddress?.lng != null && Number.isFinite(Number(order.deliveryAddress.lat)) && Number.isFinite(Number(order.deliveryAddress.lng));
  const hasRiderLocation = order.deliveryPartner?.currentLat != null && order.deliveryPartner?.currentLng != null && Number.isFinite(Number(order.deliveryPartner.currentLat)) && Number.isFinite(Number(order.deliveryPartner.currentLng));

  return (
    <div style={{ padding: '40px 0 70px', background: 'var(--bg-main)' }}>
      <div className="container">
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
            {!isDelivered && (
              <>
              </>
            )}

            {/* AUTHORIZED DELIVERY CONFIRMATION (Mandatory exact requirement) */}
            {!isDelivered ? (
              <button
                type="button"
                onClick={handleConfirmDelivery}
                disabled={isConfirmingDelivery}
                className="btn btn-accent"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                title="Authorized delivery action: marks order Delivered"
              >
                <CheckCircle2 size={16} /> Confirm & Mark Delivered
              </button>
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
                <InteractiveMap
                  center={hasRiderLocation ? [Number(order.deliveryPartner.currentLat), Number(order.deliveryPartner.currentLng)] : [Number(order.deliveryAddress.lat), Number(order.deliveryAddress.lng)]}
                  zoom={14}
                  pharmacyPos={order.pharmacy?.lat != null && order.pharmacy?.lng != null ? [Number(order.pharmacy.lat), Number(order.pharmacy.lng)] : null}
                  deliveryPos={[Number(order.deliveryAddress.lat), Number(order.deliveryAddress.lng)]}
                  riderPos={hasRiderLocation ? [Number(order.deliveryPartner.currentLat), Number(order.deliveryPartner.currentLng)] : null}
                  height="340px"
                />
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
            </div>
          </div>

          {/* RIGHT: 8-Stage Progress Timeline & Order Details */}
          <div>
            {/* 8-Stage Progress Timeline (Mandatory Exact Requirement) */}
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
                {order.items.map((item) => (
                  <div key={item.medicineId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
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
                  <span>10-Minute Express Delivery</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)', fontWeight: 800, fontSize: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
                  <span>Total Amount Paid</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Modal */}
      {supportModalOpen && (
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
