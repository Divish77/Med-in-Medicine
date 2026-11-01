'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Camera,
  FileText,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Plus,
  RefreshCw,
  Sparkles,
  Clock,
  ArrowRight,
  ShoppingCart,
  ShieldCheck,
  Eye,
  X,
  Edit3,
  Check,
  History,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';

export const PrescriptionModal = () => {
  const {
    isPrescriptionModalOpen,
    setIsPrescriptionModalOpen,
    setAttachedPrescription,
    attachedPrescription,
    addToCart,
    setIsCheckoutModalOpen,
    user,
    showToast,
    setIsAuthModalOpen,
    deliveryLocation
  } = useApp();

  // Primary Tabs: "upload" vs "history"
  const [activeTab, setActiveTab] = useState('upload');

  // Upload & Scanning Steps: 'idle' | 'scanning' | 'results' | 'unclear'
  const [step, setStep] = useState('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState('Initializing AI OCR Scanner...');

  // Uploaded files gallery
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Extracted clinical data
  const [extractedMedicines, setExtractedMedicines] = useState([]);
  const [matchedProducts, setMatchedProducts] = useState([]);
  const [unavailableMedicines, setUnavailableMedicines] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [currentPrescriptionRecord, setCurrentPrescriptionRecord] = useState(null);

  // File Preview Modal
  const [previewFile, setPreviewFile] = useState(null);

  // History Tab State
  const [historyPrescriptions, setHistoryPrescriptions] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Hidden File Inputs
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Load prescription history
  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await api.getAllPrescriptions(user?.id);
      if (res.success && Array.isArray(res.prescriptions)) {
        setHistoryPrescriptions(res.prescriptions);
      }
    } catch {
      // Fallback
    } finally {
      setHistoryLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isPrescriptionModalOpen && activeTab === 'history') {
      loadHistory();
    }
  }, [isPrescriptionModalOpen, activeTab, loadHistory]);

  if (!isPrescriptionModalOpen) return null;

  // Handle files selection (both drag/drop and input)
  const handleFilesAdded = (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const newFiles = Array.from(fileList).map((f) => ({
      id: `file_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      file: f,
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: f.type,
      isPdf: f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'),
      previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : null
    }));

    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setStep('idle');
  };

  const removeFile = (id) => {
    setSelectedFiles((prev) => {
      const remaining = prev.filter((f) => f.id !== id);
      if (remaining.length === 0) setStep('idle');
      return remaining;
    });
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  // Perform AI Prescription Scan
  const handleStartScan = async () => {
    if (selectedFiles.length === 0) {
      showToast('Please select or capture a prescription file first.', 'error');
      return;
    }

    setStep('scanning');
    setScanProgress(15);
    setScanStatusText('Uploading prescription securely...');

    // Progress animation milestones
    const t1 = setTimeout(() => {
      setScanProgress(45);
      setScanStatusText('Scanning handwritten & printed text with AI OCR...');
    }, 450);

    const t2 = setTimeout(() => {
      setScanProgress(75);
      setScanStatusText('Extracting medicine names, strengths, and dosages...');
    }, 950);

    const t3 = setTimeout(() => {
      setScanProgress(90);
      setScanStatusText('Matching with local licensed pharmacy inventory...');
    }, 1450);

    try {
      const formData = new FormData();
      selectedFiles.forEach((f) => {
        formData.append('files', f.file);
      });
      formData.append('userId', user?.id || 'guest');
      formData.append('userName', user?.name || 'Customer');
      if (patientName) formData.append('patientName', patientName);
      if (doctorName) formData.append('doctorName', doctorName);

      const res = await api.uploadPrescription(formData);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);

      if (res.unclear || (!res.success && res.message?.includes('could not be recognized'))) {
        setScanProgress(100);
        setStep('unclear');
        showToast('Prescription image was unclear. Please upload a clear photo or PDF.', 'error');
        return;
      }

      if (res.success && res.prescription) {
        setScanProgress(100);
        const rx = res.prescription;
        setCurrentPrescriptionRecord(rx);
        setAttachedPrescription(rx);
        setExtractedMedicines(rx.extractedMedicines || []);
        setMatchedProducts(
          (rx.matchedMedicines || []).map((m) => ({
            ...m,
            selected: true,
            selectedQty: 1
          }))
        );
        setUnavailableMedicines(rx.unavailableMedicines || []);
        setPatientName(rx.patientName || '');
        setDoctorName(rx.doctorName || '');
        setClinicName(rx.clinicName || '');
        setDiagnosis(rx.diagnosis || '');

        setTimeout(() => {
          setStep('results');
          showToast('✅ Prescription scanned successfully! Medicines identified.', 'info');
        }, 300);
      } else {
        throw new Error(res.message || 'Prescription scan failed.');
      }
    } catch (err) {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setStep('unclear');
      showToast(err.message || 'Failed to scan prescription. Try again with a clear photo.', 'error');
    }
  };

  // Toggle selection for a matched product
  const toggleProductSelection = (id) => {
    setMatchedProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  // Update selected quantity
  const updateProductQty = (id, delta) => {
    setMatchedProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, Math.min(10, (item.selectedQty || 1) + delta));
          return { ...item, selectedQty: newQty };
        }
        return item;
      })
    );
  };

  // Edit extracted medicine row
  const updateExtractedMed = (id, field, value) => {
    setExtractedMedicines((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Add new blank medicine row
  const addManualMedicineRow = () => {
    const newId = `manual_${Date.now()}`;
    const newRow = {
      id: newId,
      name: 'New Prescribed Medicine',
      strength: '500 mg',
      dosage: '1 Tablet - Once Daily',
      frequency: 'Once Daily (OD)',
      duration: '5 Days',
      quantity: 10,
      instructions: 'As directed'
    };
    setExtractedMedicines((prev) => [...prev, newRow]);
    showToast('Added medicine row. Enter medicine name to match.', 'info');
  };

  // Add selected matched medicines to cart
  const handleAddSelectedToCart = () => {
    const toAdd = matchedProducts.filter((p) => p.selected && p.catalogItem);
    if (toAdd.length === 0) {
      showToast('Please select at least one available medicine to add to your cart.', 'info');
      return;
    }

    toAdd.forEach((prod) => {
      addToCart(prod.catalogItem, prod.selectedQty || 1);
    });

    if (currentPrescriptionRecord) {
      setAttachedPrescription(currentPrescriptionRecord);
    }

    showToast(`🛒 Added ${toAdd.length} medicine(s) to your cart. Prescription verified!`);
  };

  const handleProceedToCheckout = () => {
    handleAddSelectedToCart();
    setIsPrescriptionModalOpen(false);
    setTimeout(() => {
      setIsCheckoutModalOpen(true);
    }, 250);
  };

  // Attach a prescription from history
  const handleSelectHistoryPrescription = (rx) => {
    setAttachedPrescription(rx);
    showToast(`Prescription #${rx._id || rx.id} attached to active session.`);
    setIsPrescriptionModalOpen(false);
  };

  const handleDeleteHistoryPrescription = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this prescription from history?')) return;
    try {
      await api.deletePrescription(id);
      setHistoryPrescriptions((prev) => prev.filter((p) => (p._id || p.id) !== id));
      showToast('Prescription removed from history.');
    } catch {
      showToast('Could not delete prescription.', 'error');
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsPrescriptionModalOpen(false)}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          padding: '0',
          maxWidth: '820px',
          width: 'calc(100% - 24px)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #059669 60%, #0284c7 100%)',
            color: 'white',
            padding: '20px 26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(6px)'
              }}
            >
              <FileText size={24} color="white" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    background: '#f59e0b',
                    color: '#0f172a',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em'
                  }}
                >
                  ⚡ AI OCR SCANNER
                </span>
                <span style={{ fontSize: '0.78rem', color: '#ecfdf5', fontWeight: 600 }}>
                  <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> 100% Medical Confidentiality
                </span>
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '4px 0 0', letterSpacing: '-0.3px' }}>
                Upload Doctor’s Prescription
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsPrescriptionModalOpen(false)}
            aria-label="Close"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher: "Upload & Scan" vs "Prescription History" */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-color)',
            background: '#f8fafc',
            padding: '4px 20px 0'
          }}
        >
          <button
            onClick={() => setActiveTab('upload')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.9rem',
              fontWeight: 800,
              color: activeTab === 'upload' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'upload' ? '3px solid var(--primary)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={16} /> New Upload &amp; AI Scan
          </button>

          <button
            onClick={() => {
              setActiveTab('history');
              loadHistory();
            }}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.9rem',
              fontWeight: 800,
              color: activeTab === 'history' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'history' ? '3px solid var(--primary)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <History size={16} /> My Prescriptions
            {historyPrescriptions.length > 0 && (
              <span
                style={{
                  background: 'var(--primary-light)',
                  color: 'var(--primary-dark)',
                  padding: '1px 7px',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}
              >
                {historyPrescriptions.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {activeTab === 'upload' ? (
            <>
              {/* STEP 1: UPLOAD & FILE PICKER (Idle) */}
              {step === 'idle' && (
                <div>
                  {/* Drag and Drop Upload Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{
                      border: isDragging ? '2.5px dashed #059669' : '2px dashed #94a3b8',
                      borderRadius: '20px',
                      padding: '36px 20px',
                      textAlign: 'center',
                      background: isDragging ? '#ecfdf5' : '#f8fafc',
                      transition: 'all 0.2s ease',
                      marginBottom: '20px',
                      position: 'relative'
                    }}
                  >
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: '#ecfdf5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                        color: 'var(--primary)',
                        boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)'
                      }}
                    >
                      <Upload size={32} />
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Drag and drop your doctor&apos;s prescription here
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                      Supports multiple pages/images. Formats: <strong>PDF, JPG, JPEG, PNG, WebP</strong> (Max 15MB)
                    </p>

                    {/* Dual Action Buttons: Camera & File Browse */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-primary"
                        style={{ padding: '11px 22px', fontSize: '0.9rem', gap: '8px' }}
                      >
                        <FileText size={17} /> Browse Files &amp; PDFs
                      </button>

                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        style={{
                          background: 'white',
                          border: '1.5px solid var(--primary)',
                          color: 'var(--primary)',
                          borderRadius: '12px',
                          padding: '11px 22px',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                        }}
                      >
                        <Camera size={17} /> Take Photo (Camera)
                      </button>
                    </div>

                    {/* Hidden Native File Inputs */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="application/pdf,image/jpeg,image/png,image/webp,image/jpg"
                      onChange={(e) => handleFilesAdded(e.target.files)}
                      style={{ display: 'none' }}
                    />
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => handleFilesAdded(e.target.files)}
                      style={{ display: 'none' }}
                    />
                  </div>

                  {/* Multi-File Previews Gallery */}
                  {selectedFiles.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          Selected Prescription Pages ({selectedFiles.length})
                        </h4>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--primary)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Plus size={14} /> Add another page
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '14px' }}>
                        {selectedFiles.map((f, idx) => (
                          <div
                            key={f.id}
                            style={{
                              border: '1px solid var(--border-color)',
                              borderRadius: '14px',
                              overflow: 'hidden',
                              background: 'white',
                              boxShadow: 'var(--shadow-sm)',
                              position: 'relative'
                            }}
                          >
                            {/* Preview Thumbnail */}
                            <div
                              style={{
                                height: '110px',
                                background: '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden'
                              }}
                            >
                              {f.isPdf ? (
                                <div style={{ textAlign: 'center', color: '#dc2626' }}>
                                  <FileText size={36} />
                                  <div style={{ fontSize: '0.68rem', fontWeight: 800, marginTop: '4px', color: '#64748b' }}>
                                    PDF DOCUMENT
                                  </div>
                                </div>
                              ) : f.previewUrl ? (
                                <img
                                  src={f.previewUrl}
                                  alt={f.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                <FileText size={32} color="#64748b" />
                              )}
                            </div>

                            {/* File Info & Remove button */}
                            <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ minWidth: 0, flex: 1, paddingRight: '6px' }}>
                                <div
                                  style={{
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    color: '#0f172a'
                                  }}
                                  title={f.name}
                                >
                                  {f.name}
                                </div>
                                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                                  Page {idx + 1} • {f.size}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(f.id)}
                                title="Remove file"
                                style={{
                                  background: '#fee2e2',
                                  border: 'none',
                                  borderRadius: '6px',
                                  color: '#dc2626',
                                  padding: '5px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Primary Trigger: Start AI Scanning */}
                      <button
                        type="button"
                        onClick={handleStartScan}
                        className="btn btn-primary"
                        style={{
                          width: '100%',
                          padding: '14px',
                          fontSize: '1rem',
                          marginTop: '20px',
                          borderRadius: '14px',
                          gap: '10px'
                        }}
                      >
                        <Sparkles size={18} color="#fef08a" /> Scan &amp; Match Medicines with AI
                      </button>
                    </div>
                  )}

                  {/* Trust & Safety Notice */}
                  <div
                    style={{
                      background: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      borderRadius: '14px',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}
                  >
                    <ShieldCheck size={22} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '0.825rem', color: '#065f46', lineHeight: 1.5 }}>
                      <strong>Legally Compliant e-Prescription Fulfillment:</strong> Our AI parser extracts required drug strengths and doses to match genuine licensed retail pharmacy inventory in real time.
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: SCANNING IN PROGRESS ANIMATION */}
              {step === 'scanning' && (
                <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                  <div
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #059669, #0284c7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px',
                      color: 'white',
                      boxShadow: '0 8px 30px rgba(5, 150, 105, 0.35)',
                      animation: 'pulse 1.5s infinite'
                    }}
                  >
                    <Sparkles size={40} />
                  </div>

                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                    Scanning Prescription with AI OCR...
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
                    {scanStatusText}
                  </p>

                  {/* Progress Bar */}
                  <div
                    style={{
                      maxWidth: '480px',
                      height: '10px',
                      background: '#e2e8f0',
                      borderRadius: '10px',
                      margin: '0 auto 12px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${scanProgress}%`,
                        background: 'linear-gradient(90deg, #059669, #0284c7)',
                        borderRadius: '10px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {scanProgress}% Processed
                  </span>
                </div>
              )}

              {/* STEP 3: UNCLEAR PRESCRIPTION NOTIFICATION */}
              {step === 'unclear' && (
                <div style={{ textAlign: 'center', padding: '36px 20px' }}>
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      background: '#fee2e2',
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px'
                    }}
                  >
                    <AlertCircle size={38} />
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#991b1b', marginBottom: '8px' }}>
                    Prescription Image Was Unclear
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '500px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                    Our AI OCR could not read the handwriting or printed text on the uploaded document. Please make sure the photo is well-lit, laid flat, and not blurry.
                  </p>

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFiles([]);
                        setStep('idle');
                      }}
                      className="btn btn-primary"
                      style={{ padding: '11px 24px' }}
                    >
                      <RefreshCw size={16} /> Upload Clearer Image
                    </button>
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      style={{
                        background: 'white',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '12px',
                        padding: '11px 20px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Camera size={16} /> Retake with Camera
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: AI SCAN RESULTS & MEDICINE MATCHING */}
              {step === 'results' && (
                <div>
                  {/* Doctor & Patient Prescription Header Card */}
                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      border: '1px solid var(--border-color)',
                      marginBottom: '20px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                        Doctor
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                        {doctorName || 'Authorized Physician'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                        Patient
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                        {patientName || user?.name || 'Customer'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                        Diagnosis / Clinical Indication
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                        {diagnosis || 'Acute consultation'}
                      </div>
                    </div>
                  </div>

                  {/* 1. MATCHED IN-STOCK MEDICINES */}
                  <div style={{ marginBottom: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            background: '#ecfdf5',
                            color: '#059669',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontWeight: 800,
                            fontSize: '0.75rem'
                          }}
                        >
                          AVAILABLE AT NEAREST PHARMACY ({matchedProducts.length})
                        </span>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        Select medicines to add directly to your cart
                      </span>
                    </div>

                    {matchedProducts.length === 0 ? (
                      <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                        No direct catalog matches found. You can add items manually below.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {matchedProducts.map((prod) => {
                          const item = prod.catalogItem;
                          return (
                            <div
                              key={prod.id}
                              onClick={() => toggleProductSelection(prod.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '14px 18px',
                                borderRadius: '16px',
                                border: prod.selected ? '2px solid #059669' : '1.5px solid var(--border-color)',
                                background: prod.selected ? '#f0fdf4' : 'white',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                gap: '14px'
                              }}
                            >
                              {/* Checkbox */}
                              <div
                                style={{
                                  width: '22px',
                                  height: '22px',
                                  borderRadius: '6px',
                                  border: prod.selected ? 'none' : '2px solid #cbd5e1',
                                  background: prod.selected ? '#059669' : 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  flexShrink: 0
                                }}
                              >
                                {prod.selected && <Check size={16} strokeWidth={3} />}
                              </div>

                              {/* Medicine Image */}
                              <div
                                style={{
                                  width: '54px',
                                  height: '54px',
                                  borderRadius: '10px',
                                  background: '#f1f5f9',
                                  overflow: 'hidden',
                                  flexShrink: 0
                                }}
                              >
                                {item.image ? (
                                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                    <FileText size={20} />
                                  </div>
                                )}
                              </div>

                              {/* Details */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                                    {item.name}
                                  </h4>
                                  {item.prescriptionRequired && (
                                    <span className="badge badge-rx" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                                      Rx Verified
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                                  Prescribed: <strong>{prod.name}</strong> • {prod.frequency} ({prod.duration})
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                                  ✓ In Stock • {item.packSize || '1 Pack'}
                                </div>
                              </div>

                              {/* Quantity & Price */}
                              <div
                                onClick={(e) => e.stopPropagation()}
                                style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: 'white',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '8px',
                                    padding: '2px 6px'
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={() => updateProductQty(prod.id, -1)}
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 700, padding: '0 4px' }}
                                  >
                                    -
                                  </button>
                                  <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                                    {prod.selectedQty || 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateProductQty(prod.id, 1)}
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 700, padding: '0 4px' }}
                                  >
                                    +
                                  </button>
                                </div>

                                <div style={{ textAlign: 'right', minWidth: '70px' }}>
                                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                                    ₹{((item.price || 0) * (prod.selectedQty || 1)).toFixed(2)}
                                  </div>
                                  {item.mrp && item.mrp > item.price && (
                                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                                      ₹{((item.mrp || 0) * (prod.selectedQty || 1)).toFixed(2)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 2. UNAVAILABLE PRESCRIBED MEDICINES SECTION */}
                  {unavailableMedicines.length > 0 && (
                    <div style={{ marginBottom: '28px' }}>
                      <div
                        style={{
                          background: '#fff7ed',
                          border: '1px solid #ffedd5',
                          borderRadius: '16px',
                          padding: '16px 20px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                          <span
                            style={{
                              background: '#f97316',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '8px',
                              fontSize: '0.7rem',
                              fontWeight: 800
                            }}
                          >
                            NOT AVAILABLE AT LOCAL PHARMACY ({unavailableMedicines.length})
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#9a3412' }}>
                            We strictly never substitute doctor-prescribed brands automatically.
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {unavailableMedicines.map((un, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: 'white',
                                padding: '10px 14px',
                                borderRadius: '10px',
                                fontSize: '0.85rem'
                              }}
                            >
                              <div>
                                <strong>{un.name}</strong>
                                <span style={{ color: '#64748b', fontSize: '0.78rem', marginLeft: '8px' }}>
                                  Dosage: {un.dosage || un.frequency}
                                </span>
                              </div>
                              <span style={{ color: '#dc2626', fontSize: '0.75rem', fontWeight: 700 }}>
                                Out of Stock
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. EDITABLE EXTRACTED LIST (Allow customer to tweak) */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#334155' }}>
                        Extracted Prescription Medications
                      </h4>
                      <button
                        type="button"
                        onClick={addManualMedicineRow}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--primary)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Plus size={14} /> Add Medicine Manually
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {extractedMedicines.map((med) => (
                        <div
                          key={med.id}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1fr 1fr',
                            gap: '8px',
                            background: '#f8fafc',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                            alignItems: 'center',
                            fontSize: '0.8rem'
                          }}
                        >
                          <input
                            type="text"
                            value={med.name}
                            onChange={(e) => updateExtractedMed(med.id, 'name', e.target.value)}
                            style={{
                              padding: '6px 8px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.8rem',
                              fontWeight: 600
                            }}
                            title="Medicine Name"
                          />
                          <input
                            type="text"
                            value={med.strength || ''}
                            placeholder="Strength"
                            onChange={(e) => updateExtractedMed(med.id, 'strength', e.target.value)}
                            style={{
                              padding: '6px 8px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.8rem'
                            }}
                          />
                          <input
                            type="text"
                            value={med.frequency || ''}
                            placeholder="Frequency"
                            onChange={(e) => updateExtractedMed(med.id, 'frequency', e.target.value)}
                            style={{
                              padding: '6px 8px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.8rem'
                            }}
                          />
                          <input
                            type="text"
                            value={med.duration || ''}
                            placeholder="Duration"
                            onChange={(e) => updateExtractedMed(med.id, 'duration', e.target.value)}
                            style={{
                              padding: '6px 8px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.8rem'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* BOTTOM ACTION BAR */}
                  <div
                    style={{
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '20px',
                      display: 'flex',
                      gap: '12px',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setStep('idle')}
                      style={{
                        background: 'transparent',
                        border: '1px solid #cbd5e1',
                        borderRadius: '12px',
                        padding: '12px 20px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        color: '#64748b'
                      }}
                    >
                      ← Re-upload / Scan Another
                    </button>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={handleAddSelectedToCart}
                        disabled={matchedProducts.filter((p) => p.selected).length === 0}
                        style={{
                          background: 'white',
                          border: '1.5px solid var(--primary)',
                          borderRadius: '12px',
                          color: 'var(--primary)',
                          padding: '12px 22px',
                          fontWeight: 800,
                          fontSize: '0.92rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <ShoppingCart size={17} /> Add to Cart Only
                      </button>

                      <button
                        type="button"
                        onClick={handleProceedToCheckout}
                        disabled={matchedProducts.filter((p) => p.selected).length === 0}
                        className="btn btn-primary"
                        style={{
                          padding: '12px 24px',
                          fontWeight: 800,
                          fontSize: '0.95rem',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>Add &amp; Proceed to Checkout</span>
                        <ArrowRight size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* TAB 2: PRESCRIPTION HISTORY */
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Your Uploaded Prescriptions
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Re-use verified prescriptions for repeat orders or download copies.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('upload');
                    setStep('idle');
                  }}
                  className="btn btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem', gap: '6px' }}
                >
                  <Plus size={15} /> Upload New
                </button>
              </div>

              {historyLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
                  <div style={{ marginTop: '8px', fontSize: '0.85rem' }}>Loading prescriptions...</div>
                </div>
              ) : historyPrescriptions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', background: '#f8fafc', borderRadius: '16px' }}>
                  <FileText size={40} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ fontWeight: 800, color: '#334155', margin: '0 0 6px' }}>No prescriptions found</h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 16px' }}>
                    Uploaded prescriptions will appear here for fast reordering and medical records.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('upload');
                      setStep('idle');
                    }}
                    className="btn btn-primary"
                    style={{ padding: '10px 20px' }}
                  >
                    Upload Your First Prescription
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {historyPrescriptions.map((rx) => (
                    <div
                      key={rx._id || rx.id}
                      style={{
                        border: '1.5px solid var(--border-color)',
                        borderRadius: '16px',
                        padding: '16px 20px',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '14px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '220px' }}>
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '12px',
                            background: '#ecfdf5',
                            color: '#059669',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <FileText size={24} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                              #{rx._id || rx.id}
                            </strong>
                            <span
                              style={{
                                background: '#dcfce7',
                                color: '#15803d',
                                padding: '1px 8px',
                                borderRadius: '8px',
                                fontSize: '0.7rem',
                                fontWeight: 800
                              }}
                            >
                              ✓ Verified
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                            Patient: <strong>{rx.patientName || 'Customer'}</strong> • Doctor: {rx.doctorName || 'Authorized Doctor'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                            Uploaded on: {new Date(rx.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            {rx.orderId && (
                              <span style={{ marginLeft: '10px', color: '#0284c7', fontWeight: 600 }}>
                                Linked Order: #{rx.orderId}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {rx.fileUrl && (
                          <button
                            type="button"
                            onClick={() => setPreviewFile(rx.fileUrl)}
                            style={{
                              background: '#f1f5f9',
                              border: 'none',
                              borderRadius: '9px',
                              padding: '8px 14px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              color: '#334155'
                            }}
                          >
                            <Eye size={14} /> View File
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleSelectHistoryPrescription(rx)}
                          className="btn btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.825rem', gap: '6px' }}
                        >
                          <Check size={14} /> Use for Order
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteHistoryPrescription(rx._id || rx.id, e)}
                          title="Delete"
                          style={{
                            background: '#fff1f2',
                            border: '1px solid #fecdd3',
                            borderRadius: '9px',
                            padding: '8px',
                            color: '#e11d48',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal File Viewer Popup */}
        {previewFile && (
          <div
            className="modal-overlay"
            style={{ zIndex: 10005 }}
            onClick={() => setPreviewFile(null)}
          >
            <div
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '720px', padding: '20px', textAlign: 'center' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h4 style={{ margin: 0, fontWeight: 800 }}>Prescription Document Preview</h4>
                <button
                  type="button"
                  onClick={() => setPreviewFile(null)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              {previewFile.startsWith('data:application/pdf') || previewFile.endsWith('.pdf') ? (
                <iframe
                  src={previewFile}
                  title="Prescription PDF"
                  style={{ width: '100%', height: '520px', border: 'none', borderRadius: '12px' }}
                />
              ) : (
                <img
                  src={previewFile}
                  alt="Prescription preview"
                  style={{ maxWidth: '100%', maxHeight: '520px', objectFit: 'contain', borderRadius: '12px' }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
