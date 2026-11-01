'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Info, Plus, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';

export const MedicinesPage = () => {
  const { addToCart, deliveryLocation, user } = useApp();

  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [rxFilter, setRxFilter] = useState('all'); // 'all', 'rx', 'otc'
  const [loading, setLoading] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const loadCategories = useCallback(async () => {
    try {
      const res = await api.getCategories();
      if (res.success && res.categories) {
        setCategories(res.categories);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const loadMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (rxFilter === 'rx') params.rxOnly = 'true';
      if (rxFilter === 'otc') params.otcOnly = 'true';

      const res = await api.getMedicines(params);
      if (res.success && res.medicines) {
        setMedicines(res.medicines);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, rxFilter]);

  useEffect(() => {
    loadCategories();
    loadMedicines();
  }, [loadCategories, loadMedicines]);

  useEffect(() => {
    const delayDebounce = setTimeout(loadMedicines, 250);
    return () => clearTimeout(delayDebounce);
  }, [loadMedicines]);

  return (
    <div style={{ padding: '40px 0 80px', background: 'var(--bg-main)' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-express">⚡ 10-MIN EXPRESS CATALOG</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Nearest Store: <strong>{deliveryLocation.pharmacyName || 'No pharmacy selected'}</strong>
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
            Verified Healthcare & Medicines
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Search from 100% genuine pharmaceutical inventory verified by certified pharmacists.
          </p>
        </div>

        {/* Search Bar & Filter Controls */}
        <div style={{ background: 'white', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px', alignItems: 'center' }} className="search-filter-grid">
            <style>{`
              @media (min-width: 768px) {
                .search-filter-grid { gridTemplateColumns: 1fr auto !important; }
              }
            `}</style>

            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search medicines by brand name, generic salt, or symptom (e.g. Dolo, Pan 40, Fever)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border-color)',
                  fontSize: '0.95rem',
                  fontWeight: 600
                }}
              />
            </div>

            {/* Rx Filter Radios */}
            <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
              {[
                { id: 'all', label: 'All Items' },
                { id: 'otc', label: 'OTC Only' },
                { id: 'rx', label: 'Rx Required' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setRxFilter(filter.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    background: rxFilter === filter.id ? 'white' : 'transparent',
                    color: rxFilter === filter.id ? 'var(--primary-dark)' : 'var(--text-muted)',
                    boxShadow: rxFilter === filter.id ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Chips Bar */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '14px 0 4px', scrollbarWidth: 'none' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? 'var(--primary)' : 'var(--border-color)',
                  background: selectedCategory === cat ? 'var(--primary)' : '#f8fafc',
                  color: selectedCategory === cat ? 'white' : 'var(--text-main)',
                  transition: 'all 0.15s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Medicines Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <div className="animate-spin" style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', marginBottom: '12px' }} />
            <p>Fetching real-time inventory from local pharmacies...</p>
          </div>
        ) : medicines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', background: 'white', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <Info size={40} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>No matching medicines found</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Try searching with a generic salt name or check another category.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {medicines.map((med) => (
              <div
                key={med._id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                {/* Product Image */}
                <div style={{ height: '170px', position: 'relative', overflow: 'hidden', background: '#f8fafc' }}>
                  <img
                    src={med.image}
                    alt={med.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Badges */}
                  <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                    {med.prescriptionRequired ? (
                      <span className="badge badge-rx" style={{ fontSize: '0.65rem' }}>
                        Rx Required
                      </span>
                    ) : (
                      <span className="badge badge-otc" style={{ fontSize: '0.65rem' }}>
                        OTC
                      </span>
                    )}
                  </div>

                  <span className="badge badge-express" style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '0.65rem', padding: '2px 8px' }}>
                    ⚡ 10 Mins
                  </span>
                </div>

                {/* Details */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '2px' }}>
                    {med.brand}
                  </div>

                  <h3
                    onClick={() => setSelectedMedicine(med)}
                    style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', cursor: 'pointer', lineHeight: 1.35, marginBottom: '4px' }}
                    title={med.name}
                  >
                    {med.name}
                  </h3>

                  <p style={{ fontSize: '0.785rem', color: 'var(--text-muted)', lineHeight: 1.3, marginBottom: '8px', minHeight: '32px' }}>
                    {med.genericName}
                  </p>
                  {med.benefits && (
                    <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.45, margin: '0 0 10px' }}>
                      {med.benefits.length > 110 ? `${med.benefits.slice(0, 107)}…` : med.benefits}
                    </p>
                  )}

                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '14px' }}>
                    Pack: <strong>{med.packSize}</strong>
                  </div>

                  {/* Price & Add to Cart */}
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          ₹{med.price}
                        </span>
                        {med.mrp > med.price && (
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                            ₹{med.mrp}
                          </span>
                        )}
                      </div>
                      {med.discountPercent > 0 && (
                        <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>
                          {med.discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(med, 1)}
                      disabled={Number(med.stock) < 1 || med.inStock === false}
                      className="btn btn-primary"
                      style={{ padding: '8px 14px', fontSize: '0.825rem', borderRadius: '8px', opacity: Number(med.stock) < 1 || med.inStock === false ? 0.55 : 1, cursor: Number(med.stock) < 1 || med.inStock === false ? 'not-allowed' : 'pointer' }}
                    >
                      <Plus size={15} /> {Number(med.stock) < 1 || med.inStock === false ? 'Out of stock' : user ? 'Add' : 'Sign in to add'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Medicine Detail Modal */}
        {selectedMedicine && (
          <div className="modal-overlay" onClick={() => setSelectedMedicine(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '28px', maxWidth: '520px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span className={`badge ${selectedMedicine.prescriptionRequired ? 'badge-rx' : 'badge-otc'}`} style={{ marginBottom: '6px' }}>
                    {selectedMedicine.prescriptionRequired ? 'Prescription Required (Rx)' : 'Over the Counter (OTC)'}
                  </span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {selectedMedicine.name}
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedMedicine.genericName}</p>
                </div>
                <button
                  onClick={() => setSelectedMedicine(null)}
                  style={{ background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={18} color="var(--text-muted)" />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '18px' }}>
                <img
                  src={selectedMedicine.image}
                  alt={selectedMedicine.name}
                  style={{ width: '120px', height: '120px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>Brand: <strong>{selectedMedicine.brand}</strong></div>
                  <div>Manufacturer: <strong>{selectedMedicine.manufacturer}</strong></div>
                  <div>Category: <strong>{selectedMedicine.category}</strong></div>
                  <div>Pack Size: <strong>{selectedMedicine.packSize}</strong></div>
                  <div style={{ color: '#059669', fontWeight: 700, marginTop: '4px' }}>
                    ⚡ 10-Minute Dispatch Available
                  </div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '4px' }}>Benefits & Uses</h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {selectedMedicine.benefits || selectedMedicine.description || 'Product information has not been added yet.'}
                </p>
              </div>

              <div style={{ background: '#ecfdf5', padding: '12px 14px', borderRadius: '12px', border: '1px solid #a7f3d0', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#064e3b' }}>
                  Dosage Advice:
                </div>
                <div style={{ fontSize: '0.8rem', color: '#047857' }}>
                  {selectedMedicine.dosage}
                </div>
              </div>

              <button
                onClick={() => {
                  addToCart(selectedMedicine, 1);
                  setSelectedMedicine(null);
                }}
                disabled={Number(selectedMedicine.stock) < 1 || selectedMedicine.inStock === false}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', opacity: Number(selectedMedicine.stock) < 1 || selectedMedicine.inStock === false ? 0.55 : 1, cursor: Number(selectedMedicine.stock) < 1 || selectedMedicine.inStock === false ? 'not-allowed' : 'pointer' }}
              >
                Add to Cart • ₹{selectedMedicine.price}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
