import React from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, ShieldAlert, ArrowRight, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQty,
    cartSubtotal,
    cartDiscount,
    deliveryFee,
    packagingFee,
    cartTax,
    cartTotal,
    hasPrescriptionItems,
    attachedPrescription,
    setAttachedPrescription,
    setIsPrescriptionModalOpen,
    deliveryLocation,
    setIsLocationModalOpen,
    setIsCheckoutModalOpen,
    user,
    setIsAuthModalOpen,
    showToast
  } = useApp();

  if (!isCartOpen) return null;

  const handleCheckoutClick = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      showToast('Sign in before checking out.', 'info');
      return;
    }
    if (!deliveryLocation.serviceable) {
      setIsLocationModalOpen(true);
      return;
    }
    if (hasPrescriptionItems && !attachedPrescription) {
      setIsPrescriptionModalOpen(true);
      return;
    }
    if (hasPrescriptionItems && attachedPrescription?.status !== 'Verified by Pharmacist') {
      try {
        const latest = await api.getPrescription(attachedPrescription._id);
        if (latest.success && latest.prescription) setAttachedPrescription(latest.prescription);
        if (latest.prescription?.status !== 'Verified by Pharmacist') {
          showToast(latest.prescription?.status === 'Rejected'
            ? 'Prescription was rejected. Upload a clear, valid prescription.'
            : 'Prescription is awaiting pharmacist review.', 'info');
          return;
        }
      } catch {
        showToast('Could not check prescription review status. Try again.', 'error');
        return;
      }
    }
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsCartOpen(false)} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div
        className="cart-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100vh',
          background: 'white',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          animation: 'slideInRight 0.25s ease-out'
        }}
      >
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>Your Cart</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {cart.length} {cart.length === 1 ? 'item' : 'items'} ready for express dispatch
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} color="var(--text-muted)" />
          </button>
        </div>

        {/* Delivery ETA Strip */}
        <div style={{ padding: '10px 20px', background: deliveryLocation.serviceable ? '#ecfdf5' : '#fef2f2', borderBottom: `1px solid ${deliveryLocation.serviceable ? '#a7f3d0' : '#fecaca'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} color={deliveryLocation.serviceable ? '#059669' : '#dc2626'} />
            <span style={{ fontWeight: 600, color: deliveryLocation.serviceable ? '#064e3b' : '#991b1b' }}>
              {deliveryLocation.serviceable ? `Delivering to ${deliveryLocation.area || deliveryLocation.pincode} · ${deliveryLocation.etaLabel || `${deliveryLocation.etaMinutes || 10} mins`}` : 'Delivery location not serviceable'}
            </span>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(true)}
            style={{ background: 'transparent', color: 'var(--primary)', fontWeight: 700, fontSize: '0.75rem', textDecoration: 'underline' }}
          >
            Change
          </button>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <ShoppingBag size={32} color="#94a3b8" />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '8px' }}>Your cart is empty</h3>
              <p style={{ fontSize: '0.875rem', maxWidth: '280px', margin: '0 auto 20px' }}>
                Explore essential medicines, wellness items, and healthcare kits.
              </p>
              <button onClick={() => setIsCartOpen(false)} className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
                Browse Medicines
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {cart.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    background: 'white'
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        style={{ background: 'transparent', padding: '2px', color: '#94a3b8' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0' }}>
                      {item.prescriptionRequired ? (
                        <span className="badge badge-rx" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>Rx</span>
                      ) : (
                        <span className="badge badge-otc" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>OTC</span>
                      )}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.packSize}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          ₹{item.price * item.quantity}
                        </span>
                        {item.mrp && item.mrp > item.price && (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                            ₹{item.mrp * item.quantity}
                          </span>
                        )}
                      </div>

                      {/* Stepper */}
                      <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '8px', padding: '2px' }}>
                        <button
                          onClick={() => updateCartQty(item._id, item.quantity - 1)}
                          style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ width: '28px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item._id, item.quantity + 1)}
                          style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Prescription Attachment Status Banner */}
              {hasPrescriptionItems && (
                <div style={{ padding: '12px 14px', borderRadius: '12px', background: attachedPrescription ? '#ecfdf5' : '#fef2f2', border: `1.5px solid ${attachedPrescription ? '#a7f3d0' : '#fecaca'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldAlert size={18} color={attachedPrescription ? '#059669' : '#dc2626'} />
                      <span style={{ fontSize: '0.825rem', fontWeight: 700, color: attachedPrescription ? '#064e3b' : '#991b1b' }}>
                        {attachedPrescription ? 'Prescription Attached & Verified' : 'Rx Required for Items in Cart'}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsPrescriptionModalOpen(true)}
                      style={{ background: 'transparent', color: attachedPrescription ? '#059669' : '#dc2626', fontWeight: 700, fontSize: '0.75rem', textDecoration: 'underline' }}
                    >
                      {attachedPrescription ? 'Change' : 'Upload Rx'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer / Bill Summary */}
        {cart.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-color)', background: '#f8fafc' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Item Total</span>
                <span>₹{cartSubtotal}</span>
              </div>
              {cartDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 600 }}>
                  <span>Medicine Savings</span>
                  <span>-₹{cartDiscount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Delivery fee</span>
                <span>{deliveryFee === 0 ? <strong style={{ color: '#059669' }}>FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Insulated Sterile Packaging</span>
                <span>₹{packagingFee}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>GST</span>
                <span>₹{cartTax}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)', fontWeight: 800, fontSize: '1.1rem', borderTop: '1px dashed #cbd5e1', paddingTop: '8px', marginTop: '4px' }}>
                <span>Total Amount to Pay</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>

            {/* Unserviceable Warning */}
            {!deliveryLocation.serviceable && (
              <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#991b1b', fontSize: '0.8rem', fontWeight: 600, marginBottom: '12px' }}>
                ⚠️ Checkout blocked: PIN code {deliveryLocation.pincode} is not currently serviceable. Please switch to a serviceable location.
              </div>
            )}

            {/* Checkout Button */}
            <button
              onClick={handleCheckoutClick}
              disabled={!deliveryLocation.serviceable}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1rem',
                opacity: !deliveryLocation.serviceable ? 0.6 : 1,
                cursor: !deliveryLocation.serviceable ? 'not-allowed' : 'pointer'
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
