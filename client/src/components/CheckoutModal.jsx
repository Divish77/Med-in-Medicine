import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  X,
  CheckCircle2,
  Lock,
  Building
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

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
    cartTotal,
    user,
    hasPrescriptionItems,
    attachedPrescription,
    trackOrder,
    showToast
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI', 'CARD', 'NETBANKING', 'COD'
  const [upiId, setUpiId] = useState('priya@okhdfcbank');
  const [isPlacing, setIsPlacing] = useState(false);

  if (!isCheckoutModalOpen) return null;

  const handlePlaceOrder = async () => {
    if (!deliveryLocation.serviceable) {
      showToast('Selected location is not serviceable', 'error');
      return;
    }

    setIsPlacing(true);
    try {
      const orderPayload = {
        userId: user ? user.id : 'usr_guest',
        customerName: user ? user.name : 'Priya Sharma',
        customerPhone: user ? user.phone : '+91 98765 43210',
        deliveryAddress: {
          label: deliveryLocation.label || 'Home',
          fullAddress: deliveryLocation.fullAddress,
          pincode: deliveryLocation.pincode,
          city: deliveryLocation.city,
          street: deliveryLocation.street,
          lat: deliveryLocation.lat || 28.6315,
          lng: deliveryLocation.lng || 77.2167
        },
        items: cart.map((item) => ({
          medicineId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          packSize: item.packSize,
          prescriptionRequired: item.prescriptionRequired,
          image: item.image
        })),
        subtotal: cartSubtotal,
        deliveryFee,
        discount: 0,
        tax: +(cartSubtotal * 0.05).toFixed(2),
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
                {deliveryLocation.etaMinutes || 10} Mins
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
            🏥 Nearest Partner Pharmacy: {deliveryLocation.pharmacyName || 'Apollo Pharmacy Express (Connaught Place)'}
          </p>
        </div>

        {/* Prescription Verification Status */}
        {hasPrescriptionItems && (
          <div style={{ padding: '12px 14px', background: '#ecfdf5', borderRadius: '10px', border: '1px solid #a7f3d0', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={22} color="#059669" />
            <div style={{ fontSize: '0.825rem', color: '#064e3b' }}>
              <strong>Prescription Verified:</strong> Dr. Neha Kapoor (Reg: PH-98214) verified medication schedule.
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
              onClick={() => setPaymentMethod('UPI')}
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: '1.5px solid',
                borderColor: paymentMethod === 'UPI' ? 'var(--primary)' : 'var(--border-color)',
                background: paymentMethod === 'UPI' ? 'var(--primary-light)' : 'white',
                cursor: 'pointer',
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
              onClick={() => setPaymentMethod('CARD')}
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: '1.5px solid',
                borderColor: paymentMethod === 'CARD' ? 'var(--primary)' : 'var(--border-color)',
                background: paymentMethod === 'CARD' ? 'var(--primary-light)' : 'white',
                cursor: 'pointer',
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
              onClick={() => setPaymentMethod('NETBANKING')}
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: '1.5px solid',
                borderColor: paymentMethod === 'NETBANKING' ? 'var(--primary)' : 'var(--border-color)',
                background: paymentMethod === 'NETBANKING' ? 'var(--primary-light)' : 'white',
                cursor: 'pointer',
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

          {paymentMethod === 'UPI' && (
            <input
              type="text"
              placeholder="Enter UPI ID (e.g. yourname@okhdfcbank)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
            />
          )}
        </div>

        {/* Total & Pay Button */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount to Pay</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>₹{cartTotal}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
            <Lock size={14} /> 256-bit Bank Grade Security
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={isPlacing}
          className="btn btn-primary"
          style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '1.05rem' }}
        >
          {isPlacing ? 'Allocating Rider & Confirming Order...' : `Pay ₹${cartTotal} & Start 10-Min Delivery`}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
