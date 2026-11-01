'use client';

import React, { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Navigation, Compass, Home, Briefcase, X, Store, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';

const InteractiveMap = dynamic(() => import('./InteractiveMap').then((module) => module.InteractiveMap), { ssr: false });

export const LocationModal = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    deliveryLocation,
    updateDeliveryLocation,
    savedAddresses,
    addAddress,
    deleteAddress,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('pincode'); // 'current', 'pincode', 'manual', 'saved'
  const [pincodeInput, setPincodeInput] = useState(deliveryLocation.pincode || '');
  const [checkingService, setCheckingService] = useState(false);

  // Manual Form
  const [manualForm, setManualForm] = useState({
    street: '',
    area: '',
    city: 'New Delhi',
    pincode: deliveryLocation.pincode || '110001',
    landmark: '',
    label: 'Home',
    lat: 28.6315,
    lng: 77.2167
  });

  if (!isLocationModalOpen) return null;

  // Handle Geolocation
  const handleDetectLocation = () => {
    setCheckingService(true);
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      setCheckingService(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Use the browser geolocation result when available.
        try {
          const res = await api.checkServiceability('110001');
          if (res.success) {
            const locObj = {
              pincode: '110001',
              area: res.area || 'Current location',
              city: res.city || 'India',
              fullAddress: `Current location (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) - PIN ${res.pincode}`,
              label: 'Current GPS',
              lat: latitude,
              lng: longitude,
              expressEligible: res.expressEligible,
              etaMinutes: res.etaMinutes || null,
              etaLabel: res.etaLabel || '2â€“5 business days',
              serviceable: res.serviceable,
              pharmacyName: res.pharmacyName
            };
            updateDeliveryLocation(locObj);
            showToast('GPS Location detected successfully!');
            setTimeout(() => setIsLocationModalOpen(false), 800);
          }
        } catch  {
          showToast('Failed to verify location serviceability', 'error');
        } finally {
          setCheckingService(false);
        }
      },
      () => {
        showToast('Location permission denied or unavailable. Please enter PIN code manually.', 'error');
        setCheckingService(false);
      },
      { timeout: 10000 }
    );
  };

  // Handle PIN Code Verification
  const handleVerifyPincode = async (e) => {
    if (e) e.preventDefault();
    if (!/^[1-9]\d{5}$/.test(pincodeInput.trim())) {
      showToast('Please enter a valid 6-digit PIN code', 'error');
      return;
    }

    setCheckingService(true);
    try {
      const res = await api.checkServiceability(pincodeInput.trim());


      if (res.serviceable) {
        const locObj = {
          pincode: res.pincode,
          area: res.area || `PIN ${res.pincode}`,
          city: res.city || 'India',
          fullAddress: `${res.area ? `${res.area}, ` : ''}${res.city ? `${res.city} - ` : ''}${res.pincode}`,
          label: 'Selected Area',
          lat: 28.6315,
          lng: 77.2167,
          expressEligible: res.expressEligible,
          etaMinutes: res.etaMinutes || null,
          etaLabel: res.etaLabel || '2â€“5 business days',
          serviceable: true,
          pharmacyName: res.pharmacyName
        };
        updateDeliveryLocation(locObj);
        showToast(res.message);
        setTimeout(() => setIsLocationModalOpen(false), 800);
      } else {
        showToast(res.message, 'error');
      }
    } catch  {
      showToast('Error checking serviceability', 'error');
    } finally {
      setCheckingService(false);
    }
  };

  // Handle Manual Address Save
  const handleSaveManualAddress = async (e) => {
    e.preventDefault();
    if (!manualForm.street || !manualForm.city || !/^[1-9]\d{5}$/.test(manualForm.pincode)) {
      showToast('Enter a street, city, and valid 6-digit Indian PIN code.', 'error');
      return;
    }

    setCheckingService(true);
    try {
      const checkRes = await api.checkServiceability(manualForm.pincode);
      const isServiceable = checkRes.serviceable;

      const newAddress = addAddress({
        ...manualForm,
        fullAddress: `${manualForm.street}, ${manualForm.landmark ? manualForm.landmark + ', ' : ''}${manualForm.area ? manualForm.area + ', ' : ''}${manualForm.city} - ${manualForm.pincode}`
      });

      const locObj = {
        pincode: manualForm.pincode,
        area: manualForm.area || manualForm.city,
        city: manualForm.city,
        fullAddress: newAddress.fullAddress,
        label: manualForm.label,
        lat: manualForm.lat,
        lng: manualForm.lng,
        expressEligible: checkRes.expressEligible,
        etaMinutes: checkRes.etaMinutes || null,
        etaLabel: checkRes.etaLabel || (isServiceable ? '2â€“5 business days' : ''),
        serviceable: isServiceable,
        pharmacyName: checkRes.pharmacyName || 'No pharmacy selected'
      };

      updateDeliveryLocation(locObj);
      setIsLocationModalOpen(false);
    } catch  {
      showToast('Error processing address', 'error');
    } finally {
      setCheckingService(false);
    }
  };

  const selectSavedAddress = async (addr) => {
    setCheckingService(true);
    try {
      const checkRes = await api.checkServiceability(addr.pincode);
      updateDeliveryLocation({
        pincode: addr.pincode,
        area: addr.city,
        city: addr.city,
        fullAddress: addr.fullAddress,
        label: addr.label,
        lat: addr.lat || 28.6315,
        lng: addr.lng || 77.2167,
        expressEligible: checkRes.expressEligible,
        etaMinutes: checkRes.etaMinutes || null,
        etaLabel: checkRes.etaLabel || '2â€“5 business days',
        serviceable: checkRes.serviceable,
        pharmacyName: checkRes.pharmacyName
      });
      setIsLocationModalOpen(false);
    } catch  {
      showToast('Error applying address', 'error');
    } finally {
      setCheckingService(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsLocationModalOpen(false)}>
      <style>{`
        @media (max-width: 480px) {
          .location-tabs-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 6px !important;
          }
        }
      `}</style>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Where should we deliver your medicines?
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              We check nearby pharmacies and assign express delivery within 10 minutes.
            </p>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            style={{ background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} color="var(--text-muted)" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="location-tabs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
          <button
            onClick={() => setActiveTab('pincode')}
            style={{
              padding: '8px 4px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: activeTab === 'pincode' ? 'white' : 'transparent',
              color: activeTab === 'pincode' ? 'var(--primary-dark)' : 'var(--text-muted)',
              boxShadow: activeTab === 'pincode' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Enter PIN Code
          </button>
          <button
            onClick={() => { setActiveTab('current'); handleDetectLocation(); }}
            style={{
              padding: '8px 4px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: activeTab === 'current' ? 'white' : 'transparent',
              color: activeTab === 'current' ? 'var(--primary-dark)' : 'var(--text-muted)',
              boxShadow: activeTab === 'current' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Use GPS
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            style={{
              padding: '8px 4px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: activeTab === 'manual' ? 'white' : 'transparent',
              color: activeTab === 'manual' ? 'var(--primary-dark)' : 'var(--text-muted)',
              boxShadow: activeTab === 'manual' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Enter Address
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            style={{
              padding: '8px 4px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: activeTab === 'saved' ? 'white' : 'transparent',
              color: activeTab === 'saved' ? 'var(--primary-dark)' : 'var(--text-muted)',
              boxShadow: activeTab === 'saved' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Saved ({savedAddresses.length})
          </button>
        </div>

        {/* TAB 1: PIN CODE ENTRY */}
        {activeTab === 'pincode' && (
          <div>
            <form onSubmit={handleVerifyPincode} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code (e.g. 110001)"
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--border-color)',
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={checkingService}
                className="btn btn-primary"
                style={{ padding: '0 20px', minWidth: '120px' }}
              >
                {checkingService ? 'Checking...' : 'Check & Set'}
              </button>
            </form>

            {/* Quick popular express cities */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                âš¡ POPULAR 10-MINUTE EXPRESS HUBS:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {[
                  { city: 'Connaught Place, Delhi', pin: '110001' },
                  { city: 'Hauz Khas, Delhi', pin: '110016' },
                  { city: 'Koramangala, BLR', pin: '560034' },
                  { city: 'Bandra West, Mumbai', pin: '400050' },
                  { city: 'Cyber City, Gurgaon', pin: '122002' },
                  { city: 'Sector 17, Chandigarh', pin: '160017' },
                  { city: 'Model Town, Patiala', pin: '147001' }
                ].map((item) => (
                  <button
                    key={item.pin}
                    type="button"
                    onClick={() => {
                      setPincodeInput(item.pin);
                      api.checkServiceability(item.pin).then((res) => {
                        updateDeliveryLocation({
                          pincode: res.pincode,
                          area: res.area || `PIN ${res.pincode}`,
                          city: res.city || 'India',
                          fullAddress: `${res.area ? `${res.area}, ` : ''}${res.city ? `${res.city} - ` : ''}${res.pincode}`,
                          label: 'Express Hub',
                          lat: 28.6315,
                          lng: 77.2167,
                          expressEligible: res.expressEligible,
                          etaMinutes: res.etaMinutes || null,
                          etaLabel: res.etaLabel || '2â€“5 business days',
                          serviceable: true,
                          pharmacyName: res.pharmacyName
                        });
                        setIsLocationModalOpen(false);
                      });
                    }}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '5px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--text-main)'
                    }}
                  >
                    ðŸ“ {item.city} ({item.pin})
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Map preview */}
            <div style={{ marginTop: '12px' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Service Map & Delivery Radius:
              </p>
              <Suspense fallback={<div role="status" style={{ height: '180px', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>Loading map…</div>}>
                <InteractiveMap
                  center={[deliveryLocation.lat || 28.6315, deliveryLocation.lng || 77.2167]}
                  pharmacyPos={[28.6315, 77.2167]}
                  deliveryPos={[deliveryLocation.lat || 28.6139, deliveryLocation.lng || 77.2090]}
                  height="180px"
                />
              </Suspense>
            </div>
          </div>
        )}

        {/* TAB 2: CURRENT GPS LOCATION */}
        {activeTab === 'current' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Navigation size={30} color="var(--primary)" className={checkingService ? 'animate-spin' : ''} />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
              {checkingService ? 'Detecting your GPS coordinates...' : 'Allow Browser Location Access'}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '380px', margin: '0 auto 20px' }}>
              We instantly find the closest registered pharmacy with stock in your delivery zone.
            </p>
            <button
              onClick={handleDetectLocation}
              disabled={checkingService}
              className="btn btn-primary"
            >
              <Compass size={18} /> Detect My Current Location
            </button>
          </div>
        )}

        {/* TAB 3: ENTER ADDRESS MANUALLY */}
        {activeTab === 'manual' && (
          <form onSubmit={handleSaveManualAddress}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              {['Home', 'Work', 'Other'].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setManualForm({ ...manualForm, label })}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1.5px solid',
                    borderColor: manualForm.label === label ? 'var(--primary)' : 'var(--border-color)',
                    background: manualForm.label === label ? 'var(--primary-light)' : 'white',
                    color: manualForm.label === label ? 'var(--primary-dark)' : 'var(--text-main)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  {label === 'Home' && <Home size={16} />}
                  {label === 'Work' && <Briefcase size={16} />}
                  {label === 'Other' && <MapPin size={16} />}
                  {label}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="House / Flat / Block No, Building Name *"
                value={manualForm.street}
                onChange={(e) => setManualForm({ ...manualForm, street: e.target.value })}
                required
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Area / Locality / Sector"
                  value={manualForm.area}
                  onChange={(e) => setManualForm({ ...manualForm, area: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="6-digit PIN Code *"
                  value={manualForm.pincode}
                  onChange={(e) => setManualForm({ ...manualForm, pincode: e.target.value.replace(/\D/g, '') })}
                  required
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontWeight: 600 }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="City *"
                  value={manualForm.city}
                  onChange={(e) => setManualForm({ ...manualForm, city: e.target.value })}
                  required
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                />
                <input
                  type="text"
                  placeholder="Nearby Landmark (Optional)"
                  value={manualForm.landmark}
                  onChange={(e) => setManualForm({ ...manualForm, landmark: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={checkingService}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {checkingService ? 'Verifying Delivery Zone...' : 'Save & Deliver Here'}
            </button>
          </form>
        )}

        {/* TAB 4: SAVED ADDRESSES */}
        {activeTab === 'saved' && (
          <div>
            {savedAddresses.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>
                No saved addresses yet. Enter an address manually to save it.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => selectSavedAddress(addr)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid',
                      borderColor: deliveryLocation.pincode === addr.pincode ? 'var(--primary)' : 'var(--border-color)',
                      background: deliveryLocation.pincode === addr.pincode ? 'var(--primary-light)' : 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ marginTop: '2px', color: 'var(--primary)' }}>
                        {addr.label === 'Home' && <Home size={18} />}
                        {addr.label === 'Work' && <Briefcase size={18} />}
                        {addr.label === 'Other' && <MapPin size={18} />}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                            {addr.label}
                          </span>
                          <span className="badge badge-express" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                            10 Mins
                          </span>
                        </div>
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {addr.fullAddress}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAddress(addr.id);
                      }}
                      style={{ background: 'transparent', padding: '6px', color: '#94a3b8' }}
                      title="Delete Address"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Current Serviceability Summary Card */}
        <div style={{ marginTop: '16px', padding: '12px 16px', background: deliveryLocation.serviceable ? '#ecfdf5' : '#fef2f2', border: `1px solid ${deliveryLocation.serviceable ? '#a7f3d0' : '#fecaca'}`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Store size={22} color={deliveryLocation.serviceable ? '#059669' : '#dc2626'} />
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.875rem', color: deliveryLocation.serviceable ? '#064e3b' : '#991b1b' }}>
                {deliveryLocation.serviceable ? (deliveryLocation.expressEligible ? 'Local express delivery' : 'Standard delivery - ' + (deliveryLocation.etaLabel || '2–5 business days')) : 'Delivery Not Available'}
              </p>
              <p style={{ fontSize: '0.775rem', color: deliveryLocation.serviceable ? '#047857' : '#b91c1c' }}>
                {deliveryLocation.serviceable ? `Fulfillment: ${deliveryLocation.pharmacyName || '10 MN Company nationwide delivery'} • PIN: ${deliveryLocation.pincode}` : 'Enter a valid Indian PIN code to check delivery'}
              </p>
            </div>
          </div>
          {deliveryLocation.serviceable && (
            <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#059669', color: 'white', padding: '4px 8px', borderRadius: '6px' }}>
              ETA {deliveryLocation.etaLabel || `${deliveryLocation.etaMinutes || 10} mins`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
