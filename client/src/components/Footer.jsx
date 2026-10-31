import React from 'react';
import { Activity, ShieldCheck, Heart, Phone, Mail, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer = () => {
  const { setActiveTab, setIsPrescriptionModalOpen, setIsLocationModalOpen } = useApp();

  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '60px 0 30px', borderTop: '1px solid #1e293b' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '36px', marginBottom: '40px' }}>
          {/* Brand Info */}
          <div>
            <div style={{ marginBottom: '14px' }}>
              <img
                src="/logo.png"
                alt="Med-in-Medicine"
                style={{ height: '52px', objectFit: 'contain', background: 'white', padding: '4px 10px', borderRadius: '10px' }}
              />
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '16px', color: '#cbd5e1' }}>
              Making healthcare accessible in 10 minutes by connecting nearby verified pharmacies to doorstep delivery partners.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
              <ShieldCheck size={16} /> Licensed Pharmacy Fulfillment Network
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', marginBottom: '16px' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <li>
                <button onClick={() => setActiveTab('home')} style={{ background: 'transparent', color: '#cbd5e1', padding: 0 }}>
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('medicines')} style={{ background: 'transparent', color: '#cbd5e1', padding: 0 }}>
                  Order Medicines
                </button>
              </li>
              <li>
                <button onClick={() => setIsPrescriptionModalOpen(true)} style={{ background: 'transparent', color: '#cbd5e1', padding: 0 }}>
                  Upload Prescription
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('track')} style={{ background: 'transparent', color: '#cbd5e1', padding: 0 }}>
                  Track Active Order
                </button>
              </li>

              <li>
                <button onClick={() => setIsLocationModalOpen(true)} style={{ background: 'transparent', color: '#cbd5e1', padding: 0 }}>
                  Change Delivery Location
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin')} style={{ background: 'transparent', color: '#cbd5e1', padding: 0 }}>
                  Admin sign in
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', marginBottom: '16px' }}>
              Medicine Categories
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <li>Pain Relief & Fever (Dolo, Crocin)</li>
              <li>Antibiotics (Azithral, Augmentin)</li>
              <li>Stomach Care & Antacids (Pan 40)</li>
              <li>Diabetes & Cardiac Care</li>
              <li>Vitamins & Calcium Supplements</li>
              <li>First Aid & Emergency Devices</li>
            </ul>
          </div>

          {/* Medical Disclaimer */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', marginBottom: '16px' }}>
              Medical Disclaimer
            </h4>
            <p style={{ fontSize: '0.75rem', lineHeight: 1.6, color: '#94a3b8' }}>
              Med in Minutes is an on-demand medical logistics and pharmacy aggregator platform. Schedule H and X prescription drugs require a valid doctorâ€™s prescription verified by licensed pharmacists before fulfillment. Do not self-medicate.
            </p>
            <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#fef08a' }}>
              Emergency Helpline: <strong>1800-633-646</strong> (24x7)
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.785rem' }}>
          <div>
            Â© {new Date().getFullYear()} Med in Minutes Healthcare Technologies Pvt Ltd. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Pharmacy Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
