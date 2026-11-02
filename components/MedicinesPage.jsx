'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Info, Plus, X, Sparkles, Filter, ChevronRight } from 'lucide-react';
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
    <div className="medicines-page" style={{ padding: '32px 0 80px', background: 'var(--bg-main)' }}>
      <style>{`
        @media (max-width: 767px) {
          .medicines-page {
            padding: 18px 0 72px !important;
          }
          .meds-header-title {
            font-size: 1.6rem !important;
          }
          .search-filter-card {
            padding: 12px 14px !important;
            border-radius: 14px !important;
            margin-bottom: 18px !important;
          }
          .medicines-responsive-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }
          .med-card-img-wrap {
            height: 120px !important;
          }
          .med-card-body {
            padding: 10px !important;
          }
          .med-card-title {
            font-size: 0.875rem !important;
            min-height: 38px !important;
            line-height: 1.3 !important;
          }
          .med-card-pack {
            font-size: 0.7rem !important;
            margin-bottom: 8px !important;
          }
          .med-card-price {
            font-size: 1rem !important;
          }
          .med-card-add-btn {
            padding: 6px 10px !important;
            font-size: 0.75rem !important;
          }
        }
        @media (max-width: 360px) {
          .medicines-responsive-grid {
            gap: 8px !important;
          }
          .med-card-img-wrap {
            height: 105px !important;
          }
          .med-card-body {
            padding: 8px !important;
          }
        }
      `}</style>

      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: 'var(--health-green)', color: 'white', fontSize: '0.72rem', padding: '3px 9px', fontWeight: 800 }}>
              ⚡ 10-MIN EXPRESS
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Nearest Store: <strong>{deliveryLocation.pharmacyName || 'Central Partner Chemist'}</strong>
            </span>
          </div>
          <h1 className="meds-header-title" style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--dark-navy)', letterSpacing: '-0.5px', marginBottom: '6px' }}>
            Verified Healthcare &amp; Medicines
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            100% genuine pharmaceutical inventory verified by certified pharmacists and dispatched in 10 minutes.
          </p>
        </div>

        {/* Search Bar & Filter Controls Card */}
        <div className="search-filter-card" style={{ background: 'white', padding: '18px 22px', borderRadius: '16px', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', marginBottom: '28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px', alignItems: 'center' }} className="search-filter-grid">
            <style>{`
              @media (min-width: 768px) {
                .search-filter-grid { grid-template-columns: 1fr auto !important; }
              }
            `}</style>

            {/* Search Input with Search Icon and Clear Button */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={18} color="var(--medical-blue)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search medicines, salts, symptoms (e.g. Dolo, Pan 40)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 38px 12px 42px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border-color)',
                  fontSize: '0.925rem',
                  fontWeight: 600,
                  outline: 'none',
                  background: 'var(--bg-main)',
                  color: 'var(--dark-navy)',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--medical-blue)'; e.currentTarget.style.background = '#ffffff'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#e2e8f0',
                    border: 'none',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#475569'
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Rx Filter Segment Radios */}
            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-main)', padding: '4px', borderRadius: '10px', width: '100%', border: '1px solid var(--border-color)' }}>
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
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: 'none',
                    background: rxFilter === filter.id ? 'white' : 'transparent',
                    color: rxFilter === filter.id ? 'var(--medical-blue)' : 'var(--text-muted)',
                    boxShadow: rxFilter === filter.id ? '0 1px 3px rgba(18,59,93,0.1)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    textAlign: 'center'
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Chips Bar (Horizontally scrollable) */}
          <div className="no-scrollbar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '14px 0 2px', WebkitOverflowScrolling: 'touch' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: '1.5px solid',
                  borderColor: selectedCategory === cat ? 'var(--medical-blue)' : 'var(--border-color)',
                  background: selectedCategory === cat ? 'var(--medical-blue)' : 'white',
                  color: selectedCategory === cat ? 'white' : 'var(--dark-navy)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s ease'
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
            <p style={{ fontSize: '0.9rem' }}>Fetching real-time inventory from local pharmacies...</p>
          </div>
        ) : medicines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', background: 'white', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <Info size={36} color="var(--primary)" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>No matching medicines found</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Try searching with a generic salt name or check another category.
            </p>
          </div>
        ) : (
          <div className="medicines-responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '18px' }}>
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
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                {/* Product Image */}
                <div
                  className="med-card-img-wrap"
                  onClick={() => setSelectedMedicine(med)}
                  style={{ height: '160px', position: 'relative', overflow: 'hidden', background: '#f8fafc', cursor: 'pointer' }}
                >
                  <img
                    src={med.image}
                    alt={med.name}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Badges */}
                  <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {med.prescriptionRequired ? (
                      <span className="badge badge-rx" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>
                        Rx
                      </span>
                    ) : (
                      <span className="badge badge-otc" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>
                        OTC
                      </span>
                    )}
                  </div>

                  <span className="badge badge-express" style={{ position: 'absolute', bottom: '8px', right: '8px', fontSize: '0.62rem', padding: '2px 6px' }}>
                    ⚡ 10m
                  </span>
                </div>

                {/* Details */}
                <div className="med-card-body" style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--medical-blue)', textTransform: 'uppercase', marginBottom: '2px' }}>
                    {med.brand || 'Licensed Chemist'}
                  </div>

                  <h3
                    className="med-card-title"
                    onClick={() => setSelectedMedicine(med)}
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      color: 'var(--dark-navy)',
                      cursor: 'pointer',
                      lineHeight: 1.35,
                      marginBottom: '4px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '36px'
                    }}
                    title={med.name}
                  >
                    {med.name}
                  </h3>

                  <div className="med-card-pack" style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '10px' }}>
                    Pack: <strong>{med.packSize}</strong>
                  </div>

                  {/* Price & Add to Cart */}
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '10px', gap: '6px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span className="med-card-price" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                          ₹{med.price}
                        </span>
                        {med.mrp > med.price && (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                            ₹{med.mrp}
                          </span>
                        )}
                      </div>
                      {med.discountPercent > 0 && (
                        <span style={{ fontSize: '0.65rem', color: 'var(--health-green)', fontWeight: 800 }}>
                          {med.discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(med, 1)}
                      disabled={Number(med.stock) < 1 || med.inStock === false}
                      className="btn btn-primary med-card-add-btn"
                      style={{
                        padding: '7px 12px',
                        fontSize: '0.8rem',
                        borderRadius: '8px',
                        opacity: Number(med.stock) < 1 || med.inStock === false ? 0.55 : 1,
                        cursor: Number(med.stock) < 1 || med.inStock === false ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}
                    >
                      <Plus size={14} /> {Number(med.stock) < 1 || med.inStock === false ? 'Out' : 'Add'}
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
            <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '24px', maxWidth: '520px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <span className={`badge ${selectedMedicine.prescriptionRequired ? 'badge-rx' : 'badge-otc'}`} style={{ marginBottom: '6px' }}>
                    {selectedMedicine.prescriptionRequired ? 'Prescription Required (Rx)' : 'Over the Counter (OTC)'}
                  </span>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                    {selectedMedicine.name}
                  </h2>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{selectedMedicine.genericName}</p>
                </div>
                <button
                  onClick={() => setSelectedMedicine(null)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={18} color="var(--text-muted)" />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '14px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <img
                  src={selectedMedicine.image}
                  alt={selectedMedicine.name}
                  style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div style={{ fontSize: '0.825rem', display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minWidth: '160px' }}>
                  <div>Brand: <strong>{selectedMedicine.brand}</strong></div>
                  <div>Manufacturer: <strong>{selectedMedicine.manufacturer}</strong></div>
                  <div>Category: <strong>{selectedMedicine.category}</strong></div>
                  <div>Pack Size: <strong>{selectedMedicine.packSize}</strong></div>
                  <div style={{ color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                    ⚡ 10-Minute Dispatch Available
                  </div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '0.825rem', fontWeight: 800, marginBottom: '4px' }}>Benefits &amp; Uses</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {selectedMedicine.benefits || selectedMedicine.description || 'Product information has not been added yet.'}
                </p>
              </div>

              <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '12px', border: '1px solid #a7f3d0', marginBottom: '18px' }}>
                <div style={{ fontSize: '0.785rem', fontWeight: 700, color: '#064e3b' }}>
                  Dosage Advice:
                </div>
                <div style={{ fontSize: '0.785rem', color: '#047857' }}>
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
