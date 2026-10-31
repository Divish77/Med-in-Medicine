import React from 'react';
import { Printer, Download, X, Activity, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const InvoiceModal = () => {
  const { isInvoiceModalOpen, setIsInvoiceModalOpen, invoiceData } = useApp();

  if (!isInvoiceModalOpen || !invoiceData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={() => setIsInvoiceModalOpen(false)}>
      <div
        className="modal-card print-invoice-card"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '36px', maxWidth: '720px' }}
      >
        <style>{`
          @media print {
            body * { visibility: hidden; }
            .print-invoice-card, .print-invoice-card * { visibility: visible; }
            .print-invoice-card { position: absolute; left: 0; top: 0; width: 100%; max-width: 100%; border: none !important; box-shadow: none !important; }
            .no-print { display: none !important; }
          }
        `}</style>

        {/* Action Bar (hidden on print) */}
        <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-express">TAX INVOICE</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Official Retail Drug Receipt</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={handlePrint} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              <Printer size={16} /> Print / Save PDF
            </button>
            <button
              onClick={() => setIsInvoiceModalOpen(false)}
              style={{ background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={18} color="var(--text-muted)" />
            </button>
          </div>
        </div>

        {/* Invoice Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--primary)', paddingBottom: '20px', marginBottom: '20px' }}>
          <div>
            <div style={{ marginBottom: '8px' }}>
              <img
                src="/logo.png"
                alt="Med-in-Medicine"
                style={{ height: '48px', objectFit: 'contain' }}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              10-Minute Hyperlocal Express Pharmacy Network
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Fulfillment Store: <strong>{invoiceData.pharmacyName}</strong>
            </p>
            <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              DL No: {invoiceData.pharmacyLicense} • GSTIN: {invoiceData.pharmacyGstin}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              RETAIL INVOICE
            </h3>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
              Invoice #: {invoiceData.invoiceNumber}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Date: {invoiceData.invoiceDate}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Order ID: <strong>#{invoiceData.orderId}</strong>
            </p>
          </div>
        </div>

        {/* Bill To Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontSize: '0.825rem' }}>
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '4px' }}>
              Billed To:
            </div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{invoiceData.customerName}</div>
            <div style={{ color: 'var(--text-muted)' }}>Phone: {invoiceData.customerPhone}</div>
          </div>
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '4px' }}>
              Delivery Destination:
            </div>
            <div style={{ color: 'var(--text-muted)', lineHeight: 1.4 }}>{invoiceData.deliveryAddress}</div>
          </div>
        </div>

        {/* Medicines Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '0.825rem' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
              <th style={{ padding: '8px 10px', textAlign: 'left' }}>#</th>
              <th style={{ padding: '8px 10px', textAlign: 'left' }}>Medicine Name / Description</th>
              <th style={{ padding: '8px 10px', textAlign: 'center' }}>Batch</th>
              <th style={{ padding: '8px 10px', textAlign: 'center' }}>Expiry</th>
              <th style={{ padding: '8px 10px', textAlign: 'center' }}>Qty</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Rate</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((it, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '10px' }}>{it.sno}</td>
                <td style={{ padding: '10px' }}>
                  <strong>{it.name}</strong>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{it.packSize} • {it.prescriptionRequired}</div>
                </td>
                <td style={{ padding: '10px', textAlign: 'center', color: '#64748b' }}>{it.batchNumber}</td>
                <td style={{ padding: '10px', textAlign: 'center', color: '#64748b' }}>{it.expiryDate}</td>
                <td style={{ padding: '10px', textAlign: 'center', fontWeight: 700 }}>{it.qty}</td>
                <td style={{ padding: '10px', textAlign: 'right' }}>₹{it.rate}</td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>₹{it.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals & GST Summary */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span>₹{invoiceData.subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>10-Minute Express Delivery</span>
              <span style={{ color: '#059669', fontWeight: 700 }}>{invoiceData.deliveryFee === 0 ? 'FREE' : `₹${invoiceData.deliveryFee}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>GST (CGST 2.5% + SGST 2.5%)</span>
              <span>₹{invoiceData.tax || '0.00'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--text-main)', paddingTop: '8px', marginTop: '4px', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
              <span>Total Paid</span>
              <span>₹{invoiceData.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', fontSize: '0.725rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p>Computer generated tax invoice. Sold by licensed retail pharmacy partner.</p>
            <p>Storage instructions: Store below 25°C in a dry place. Keep out of reach of children.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 700 }}>
            <ShieldCheck size={16} /> 100% Genuine Pharmacy Certified
          </div>
        </div>
      </div>
    </div>
  );
};
