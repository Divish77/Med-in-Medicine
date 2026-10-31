import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, X, AlertCircle, ShieldCheck, User, Stethoscope } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

export const PrescriptionModal = () => {
  const {
    isPrescriptionModalOpen,
    setIsPrescriptionModalOpen,
    setAttachedPrescription,
    user,
    showToast
  } = useApp();

  const [file, setFile] = useState(null);
  const [patientName, setPatientName] = useState(user ? user.name : 'Priya Sharma');
  const [doctorName, setDoctorName] = useState('Dr. Arvind Joshi (MD)');
  const [uploading, setUploading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  if (!isPrescriptionModalOpen) return null;

  const sampleRxList = [
    {
      title: 'General Physician Rx (Antibiotics & Pain Relief)',
      doctor: 'Dr. Neeraj Verma (MBBS, MD)',
      patient: 'Priya Sharma',
      preview: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'Cardiologist Rx (BP & Diabetes Routine)',
      doctor: 'Dr. Sunita Rao (DM Cardiology)',
      patient: 'Ramesh Sharma',
      preview: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();
      if (file) {
        formData.append('prescription', file);
      }
      formData.append('userId', user ? user.id : 'usr_guest');
      formData.append('userName', user ? user.name : 'Customer');
      formData.append('patientName', patientName);
      formData.append('doctorName', doctorName);

      const res = await api.uploadPrescription(formData);
      if (res.success) {
        setVerificationResult(res.prescription);
        setAttachedPrescription(res.prescription);
        showToast('Prescription verified by on-duty pharmacist!');
        setTimeout(() => {
          setIsPrescriptionModalOpen(false);
        }, 1200);
      }
    } catch (err) {
      showToast('Error uploading prescription', 'error');
    } finally {
      setUploading(false);
    }
  };

  const selectSample = (sample) => {
    setPatientName(sample.patient);
    setDoctorName(sample.doctor);
    setFile({ name: `${sample.title}.pdf` });
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
              Mandatory for Schedule H medications. Our registered pharmacist verifies details in 60 seconds.
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
              accept="image/*,.pdf"
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

          {/* Quick Sample Selector */}
          <div style={{ marginBottom: '18px' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
              OR SELECT VERIFIED SAMPLE RX FOR INSTANT DEMO:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sampleRxList.map((sample) => (
                <div
                  key={sample.title}
                  onClick={() => selectSample(sample)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.825rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={18} color="var(--primary)" />
                    <div>
                      <strong style={{ color: 'var(--text-main)' }}>{sample.title}</strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{sample.doctor} • Patient: {sample.patient}</div>
                    </div>
                  </div>
                  <span className="badge badge-otc" style={{ fontSize: '0.7rem' }}>Select</span>
                </div>
              ))}
            </div>
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
              <strong>Certified Pharmacist Verification:</strong> All medicines are cross-checked against drug interactions and allergies by licensed pharmacists.
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', borderRadius: '12px' }}
          >
            {uploading ? 'Verifying with Chief Pharmacist...' : 'Verify & Attach Prescription'}
          </button>
        </form>
      </div>
    </div>
  );
};
