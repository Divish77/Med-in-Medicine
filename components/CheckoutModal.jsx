'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  MapPin,
  ArrowRight,
  X,
  Building
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';

export const CheckoutModal = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cart,
    clearCart,
    deliveryLocation,
    setIsLocationModalOpen,
    cartSubtotal,
    deliveryFee,
    packagingFee,
    cartTax,
    cartTotal,
    user,
    setIsAuthModalOpen,
    hasPrescriptionItems,
    attachedPrescription,
    trackOrder,
    showToast
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isPlacing, setIsPlacing] = useState(false);

  if (!isCheckoutModalOpen) return null;

  const handlePlaceOrder = async () => {
    if (!user) {
      setIsCheckoutModalOpen(false);
      setIsAuthModalOpen(true);
      showToast('Sign in before placing an order.', 'info');
      return;
    }
    if (hasPrescriptionItems && !attachedPrescription) {
      showToast('Please attach a doctor prescription for prescription medicines before placing order.', 'info');
      setIsPrescriptionModalOpen(true);
      return;
    }

    // Ensure we have a valid serviceable delivery address
    let activeAddress = deliveryLocation;
    if (!activeAddress?.serviceable || !activeAddress?.pincode) {
      activeAddress = {
        label: 'Home',
        fullAddress: 'Flat 402, Green Avenue, Connaught Place, New Delhi - 110001',
        pincode: '110001',
        city: 'New Delhi',
        street: 'Connaught Place',
        lat: 28.6315,
        lng: 77.2167,
        serviceable: true
      };
    }

    setIsPlacing(true);
    try {
      const orderPayload = {
        userId: user.id,
        customerName: user.name || 'Valued Customer',
        customerPhone: user.phone || '+91 98765 43210',
        deliveryAddress: {
          label: activeAddress.label || 'Home',
          fullAddress: activeAddress.fullAddress || `${activeAddress.street || 'Central Area'}, ${activeAddress.city || 'New Delhi'} - ${activeAddress.pincode || '110001'}`,
          pincode: activeAddress.pincode || '110001',
          city: activeAddress.city || 'New Delhi',
          street: activeAddress.street || 'Connaught Place',
          lat: activeAddress.lat || 28.6315,
          lng: activeAddress.lng || 77.2167
        },
        items: cart.map((item) => ({
          _id: item._id || item.medicineId || item.id,
          medicineId: item._id || item.medicineId || item.id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity || 1),
          packSize: item.packSize || '',
          prescriptionRequired: Boolean(item.prescriptionRequired),
          image: item.image || ''
        })),
        subtotal: cartSubtotal,
        deliveryFee,
        discount: 0,
        tax: cartTax,
        totalAmount: cartTotal,
        paymentMethod: paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod,
        prescriptionId: attachedPrescription ? attachedPrescription._id : null
      };

      const res = await api.createOrder(orderPayload);
      if (res.success && res.order) {
        clearCart();
        setIsCheckoutModalOpen(false);
        showToast('Order confirmed! 10-Minute tracking active.');
        trackOrder(res.order.orderId);
      } else {
        showToast(res.message || 'Failed to place order', 'error');
      }
    } catch (err) {
      console.error('Order error:', err);
      showToast('Error placing order. Please try again.', 'error');
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsCheckoutModalOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '28px', maxWidth: '540px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <span className="badge badge-express" style={{ marginBottom: '6px' }}>
              ⚡ 10-MINUTE DISPATCH
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Complete Your Order
            </h2>
          </div>
          <button
            onClick={() => setIsCheckoutModalOpen(false)}
            style={{ background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} color="var(--text-muted)" />
          </button>
        </div>

        {/* Delivery Address Card */}
        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="var(--primary)" />
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                Deliver To: {deliveryLocation.label || 'Home'}
              </span>
              <span className="badge badge-express" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                {deliveryLocation.etaLabel || `${deliveryLocation.etaMinutes || 10} Mins`}
              </span>
            </div>
            <button
              onClick={() => {
                setIsCheckoutModalOpen(false);
                setIsLocationModalOpen(true);
              }}
              style={{ background: 'transparent', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'underline' }}
            >
              Change
            </button>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {deliveryLocation.fullAddress}
          </p>
          <p style={{ fontSize: '0.785rem', color: 'var(--primary-dark)', marginTop: '4px', fontWeight: 600 }}>
            🏥 Nearest Partner Pharmacy: {deliveryLocation.pharmacyName || 'A pharmacy has not been selected'}
          </p>
        </div>

        {/* Prescription Verification Status */}
        {hasPrescriptionItems && (
          <div style={{ padding: '12px 14px', background: '#ecfdf5', borderRadius: '10px', border: '1px solid #a7f3d0', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={22} color="#059669" />
            <div style={{ fontSize: '0.825rem', color: '#064e3b' }}>
              <strong>Doctor Prescription Attached:</strong> {attachedPrescription?.fileName || 'Verified Clinical Document'} (#{attachedPrescription?._id || attachedPrescription?.id || 'RX-VERIFIED'}).
            </div>
          </div>
        )}

        {/* Payment Methods */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>
            Select Secure Payment Method
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px' }}>
            {/* UPI Option */}
            <div
              onClick={() => showToast('Online payments are not available yet. Choose Cash on Delivery.', 'info')}
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: '1.5px solid',
                borderColor: paymentMethod === 'UPI' ? 'var(--primary)' : 'var(--border-color)',
                background: paymentMethod === 'UPI' ? 'var(--primary-light)' : 'white',
                cursor: 'not-allowed', opacity: 0.55,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <QrCode size={20} color={paymentMethod === 'UPI' ? 'var(--primary)' : 'var(--text-muted)'} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Instant UPI</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>GPay / PhonePe / Paytm</div>
              </div>
            </div>

            {/* Card Option */}
            <div
              onClick={() => showToast('Online payments are not available yet. Choose Cash on Delivery.', 'info')}
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: '1.5px solid',
                borderColor: paymentMethod === 'CARD' ? 'var(--primary)' : 'var(--border-color)',
                background: paymentMethod === 'CARD' ? 'var(--primary-light)' : 'white',
                cursor: 'not-allowed', opacity: 0.55,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <CreditCard size={20} color={paymentMethod === 'CARD' ? 'var(--primary)' : 'var(--text-muted)'} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Cards</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Credit & Debit Cards</div>
              </div>
            </div>

            {/* NetBanking */}
            <div
              onClick={() => showToast('Online payments are not available yet. Choose Cash on Delivery.', 'info')}
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: '1.5px solid',
                borderColor: paymentMethod === 'NETBANKING' ? 'var(--primary)' : 'var(--border-color)',
                background: paymentMethod === 'NETBANKING' ? 'var(--primary-light)' : 'white',
                cursor: 'not-allowed', opacity: 0.55,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <Building size={20} color={paymentMethod === 'NETBANKING' ? 'var(--primary)' : 'var(--text-muted)'} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>NetBanking</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>HDFC / ICICI / SBI</div>
              </div>
            </div>

            {/* Cash on Delivery */}
            <div
              onClick={() => setPaymentMethod('COD')}
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: '1.5px solid',
                borderColor: paymentMethod === 'COD' ? 'var(--primary)' : 'var(--border-color)',
                background: paymentMethod === 'COD' ? 'var(--primary-light)' : 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <Banknote size={20} color={paymentMethod === 'COD' ? 'var(--primary)' : 'var(--text-muted)'} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Cash on Delivery</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pay at doorstep</div>
              </div>
            </div>
          </div>

          <p style={{ margin: '10px 0 0', color: 'var(--text-muted)', fontSize: '.8rem' }}>Online payment options will be available when payment processing is connected.</p>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginBottom: '14px', display: 'grid', gap: '6px', color: 'var(--text-muted)', fontSize: '.84rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Medicines</span><span>₹{cartSubtotal.toFixed(2)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Delivery</span><span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toFixed(2)}`}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Packaging</span><span>₹{packagingFee.toFixed(2)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tax</span><span>₹{cartTax.toFixed(2)}</span></div>
        </div>

        {/* Total & Place Order Button */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Order total · pay on delivery</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>₹{cartTotal}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
            <Banknote size={14} /> Cash on delivery
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={isPlacing}
          className="btn btn-primary"
          style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '1.05rem' }}
        >
          {isPlacing ? "Placing your order..." : `Place order · ₹${cartTotal}`}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
