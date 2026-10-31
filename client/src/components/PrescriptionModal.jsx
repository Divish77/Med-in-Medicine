import React, { useState } from 'react';
import { Upload, X, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

export const PrescriptionModal = () => {
  const {
    isPrescriptionModalOpen,
    setIsPrescriptionModalOpen,
    setAttachedPrescription,
    user,
    showToast,
    setIsAuthModalOpen
  } = useApp();

  const [file, setFile] = useState(null);
  const [patientName, setPatientName] = useState(user?.name || '');
  const [doctorName, setDoctorName] = useState('');
  const [uploading, setUploading] = useState(false);

  if (!isPrescriptionModalOpen) return null;

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      showToast('Sign in before uploading a prescription.', 'info');
      return;
    }
    if (!(file instanceof File)) {
      showToast('Choose a prescription file from your device before uploading.', 'error');
      return;
    }
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('prescription', file);
      formData.append('userId', user.id);
      formData.append('userName', user.name);
      formData.append('patientName', patientName);
      formData.append('doctorName', doctorName);

      const res = await api.uploadPrescription(formData);
      if (res.success) {
        setAttachedPrescription(res.prescription);
        showToast('Prescription submitted and is awaiting pharmacist review.', 'info');
      } else {
        showToast(res.message || 'Could not upload prescription.', 'error');
      }
    } catch  {
      showToast('Error uploading prescription', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsPrescriptionModalOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-rx" style={{ fontSize: '0.75rem' }}>
                PRESCRIPTION REQUIRED
              </span>
              <span className="badge badge-otc" style={{ fontSize: '0.75rem' }}>
                <ShieldCheck size={13} /> 100% Confidential
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>
              Upload Doctor’s Prescription
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Required for prescription medicines. A pharmacist will review your uploaded document.
            </p>
          </div>
          <button
            onClick={() => setIsPrescriptionModalOpen(false)}
            style={{ background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} color="var(--text-muted)" />
          </button>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUpload}>
          {/* File Drag and Drop Box */}
          <div
            style={{
              border: '2px dashed var(--primary-border)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              background: '#f0fdf4',
              cursor: 'pointer',
              marginBottom: '18px',
              position: 'relative'
            }}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
            />
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: 'var(--shadow-sm)', color: 'var(--primary)' }}>
              <Upload size={24} />
            </div>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
              {file ? file.name : 'Tap to upload or take a photo of Prescription'}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Supports JPG, PNG, or PDF up to 10MB
            </p>
          </div>

          {/* Details fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                Patient Full Name *
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                Prescribing Doctor *
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          {/* Pharmacist verification badge */}
          <div style={{ padding: '12px', background: '#ecfdf5', borderRadius: '10px', border: '1px solid #a7f3d0', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={24} color="#059669" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.8rem', color: '#065f46' }}>
              A licensed pharmacist must review this prescription before prescription medicines can be ordered.
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', borderRadius: '12px' }}
          >
            {uploading ? 'Uploading prescription...' : 'Submit for Pharmacist Review'}
          </button>
        </form>
      </div>
    </div>
  );
};
