import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Download,
  Star,
  RotateCcw,
  AlertTriangle,
  History,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

export const DeliverySuccessModal = () => {
  const {
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    deliveredOrder,
    setIsInvoiceModalOpen,
    setInvoiceData,
    addToCart,
    setActiveTab,
    showToast,
    user
  } = useApp();

  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState(['Super Fast ⚡', 'Sterile Sealed Pouch']);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isReportingIssue, setIsReportingIssue] = useState(false);

  // Trigger celebration confetti
  useEffect(() => {
    if (isSuccessModalOpen) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch  {
        // Fallback gracefully
      }
    }
  }, [isSuccessModalOpen]);

  if (!isSuccessModalOpen || !deliveredOrder) return null;

  const experienceTags = [
    'Super Fast ⚡',
    'Polite Rider 😊',
    'Tamper-Proof Pouch 🔒',
    'Cold-Chain Maintained ❄️',
    'Accurate Medicines 💊'
  ];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.submitFeedback(deliveredOrder.orderId, {
        rating,
        tags: selectedTags,
        comment: feedbackComment
      });
      setFeedbackSubmitted(true);
      showToast('Thank you for rating your express delivery experience!');
    } catch  {
      showToast('Failed to submit feedback', 'error');
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const res = await api.getInvoice(deliveredOrder.orderId);
      if (res.success && res.invoice) {
        setInvoiceData(res.invoice);
        setIsInvoiceModalOpen(true);
      }
    } catch  {
      showToast('Error opening invoice', 'error');
    }
  };

  const handleReorder = async () => {
    deliveredOrder.items.forEach((item) => {
      addToCart(item, item.quantity);
    });
    if (user) showToast('Items added to cart for reorder!');
    setIsSuccessModalOpen(false);
    setActiveTab('medicines');
  };

  return (
    <div className="modal-overlay" onClick={() => setIsSuccessModalOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '32px', maxWidth: '580px' }}>
        {/* Celebration Icon Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 10px 25px rgba(5, 150, 105, 0.4)',
              animation: 'pulse-express 2s infinite'
            }}
          >
            <CheckCircle2 size={42} strokeWidth={2.5} />
          </div>

          {/* Mandatory exact success messages */}
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            Your Medicines Have Been Delivered!
          </h2>
          <p style={{ fontSize: '1rem', color: '#047857', fontWeight: 600 }}>
            Thank you for choosing Med in Minutes. We hope to serve you again.
          </p>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Delivered at: {deliveredOrder.deliveredAt
              ? new Date(deliveredOrder.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Pending'} • Order #{deliveredOrder.orderId}
          </div>
        </div>

        {/* Order Summary & Paid Breakdown */}
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '18px 20px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
              Delivery Summary
            </span>
            <span className="badge badge-otc" style={{ fontSize: '0.75rem' }}>
              Paid via {deliveredOrder.paymentMethod}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
            {deliveredOrder.items.map((item) => (
              <div key={item.medicineId} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  {item.quantity}x {item.name}
                </span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: '10px', marginTop: '4px', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
              <span>Total Amount Paid</span>
              <span>₹{deliveredOrder.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Rating and Experience Feedback Section */}
        {!feedbackSubmitted ? (
          <form onSubmit={handleFeedbackSubmit} style={{ background: 'white', borderRadius: '16px', padding: '16px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', textAlign: 'center', marginBottom: '10px' }}>
              Rate Your Delivery Experience
            </h4>

            {/* 5-Star Rating Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{ background: 'transparent', padding: '4px' }}
                >
                  <Star
                    size={28}
                    fill={star <= rating ? '#f59e0b' : 'none'}
                    color={star <= rating ? '#f59e0b' : '#cbd5e1'}
                    style={{ transition: 'all 0.15s' }}
                  />
                </button>
              ))}
            </div>

            {/* Experience Tag Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '12px' }}>
              {experienceTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: selectedTags.includes(tag) ? 'var(--primary)' : '#e2e8f0',
                    background: selectedTags.includes(tag) ? 'var(--primary-light)' : 'white',
                    color: selectedTags.includes(tag) ? 'var(--primary-dark)' : 'var(--text-muted)'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              placeholder="Tell us what you loved about our 10-minute medicine delivery..."
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.85rem', marginBottom: '10px' }}
            />

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: '0.875rem' }}
            >
              <Send size={15} /> Submit Feedback
            </button>
          </form>
        ) : (
          <div style={{ padding: '14px', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0', textAlign: 'center', marginBottom: '20px' }}>
            <p style={{ fontWeight: 700, color: '#064e3b', fontSize: '0.9rem' }}>
              ⭐ Thank you! Your feedback helps us keep 10-minute healthcare ultra-reliable.
            </p>
          </div>
        )}

        {/* Action Buttons: Invoice, Reorder, Issue, History */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
          <button
            type="button"
            onClick={handleDownloadInvoice}
            className="btn btn-secondary"
            style={{ padding: '12px', fontSize: '0.875rem' }}
          >
            <Download size={16} color="var(--primary)" /> Download Invoice
          </button>

          <button
            type="button"
            onClick={handleReorder}
            className="btn btn-secondary"
            style={{ padding: '12px', fontSize: '0.875rem' }}
          >
            <RotateCcw size={16} color="#0284c7" /> Reorder Medicines
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setIsReportingIssue(true)}
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #fed7aa',
              background: '#fff7ed',
              color: '#c2410c',
              fontWeight: 600,
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <AlertTriangle size={15} /> Report an Issue
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSuccessModalOpen(false);
              setActiveTab('track');
            }}
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: '#f8fafc',
              color: 'var(--text-main)',
              fontWeight: 600,
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <History size={15} /> View Order History
          </button>
        </div>

        {/* Issue Report Form Drawer/Modal */}
        {isReportingIssue && (
          <div style={{ marginTop: '16px', padding: '16px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px' }}>
            <h5 style={{ fontWeight: 800, color: '#9a3412', marginBottom: '6px', fontSize: '0.9rem' }}>
              Report Issue for Order #{deliveredOrder.orderId}
            </h5>
            <p style={{ fontSize: '0.785rem', color: '#c2410c', marginBottom: '10px' }}>
              Our pharmacist support team investigates immediately.
            </p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
              {['Damaged Package Seal', 'Missing Item', 'Wrong Dosage', 'Delivery Delay'].map((issue) => (
                <button
                  key={issue}
                  type="button"
                  onClick={() => {
                    showToast(`Issue logged: ${issue}. Pharmacist assigned.`);
                    setIsReportingIssue(false);
                  }}
                  style={{ background: 'white', border: '1px solid #fdba74', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#9a3412' }}
                >
                  {issue}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIsReportingIssue(false)}
              style={{ background: 'transparent', fontSize: '0.75rem', color: '#9a3412', textDecoration: 'underline' }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
