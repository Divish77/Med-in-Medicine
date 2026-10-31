import express from 'express';
import jwt from 'jsonwebtoken';
import { dbStore } from '../services/store.js';
import { medicineCategories } from '../seed/seedData.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'med_in_minutes_secret_key_2026';

const requireAdmin = (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : '';
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = dbStore.findOne('users', (user) => user._id === decoded.id && user.role === 'admin');
    if (!admin) return res.status(403).json({ success: false, message: 'Website administrator access is required.' });
    req.adminUser = admin;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Sign in again to manage the website catalog.' });
  }
};

// Get medicines with search, category, and prescription filter
router.get('/', (req, res) => {
  try {
    const { search, category, rxOnly, otcOnly, sort } = req.query;
    let medicines = dbStore.get('medicines');

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      medicines = medicines.filter(
        (m) =>
          String(m.name || '').toLowerCase().includes(q) ||
          String(m.genericName || '').toLowerCase().includes(q) ||
          String(m.brand || '').toLowerCase().includes(q) ||
          String(m.category || '').toLowerCase().includes(q) ||
          (m.description && m.description.toLowerCase().includes(q))
      );
    }

    if (category && category !== 'All') {
      medicines = medicines.filter((m) => m.category.toLowerCase() === category.toLowerCase());
    }

    if (rxOnly === 'true') {
      medicines = medicines.filter((m) => m.prescriptionRequired === true);
    } else if (otcOnly === 'true') {
      medicines = medicines.filter((m) => m.prescriptionRequired === false);
    }

    if (sort === 'price_asc') {
      medicines = [...medicines].sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      medicines = [...medicines].sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      medicines = [...medicines].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    res.json({
      success: true,
      count: medicines.length,
      categories: medicineCategories,
      medicines
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single medicine details
router.get('/meta/categories', (req, res) => {
  res.json({ success: true, categories: medicineCategories });
});

router.get('/:id', (req, res) => {
  try {
    const medicine = dbStore.findOne('medicines', (m) => m._id === req.params.id);
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
    res.json({ success: true, medicine });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add a medicine to the website catalog (administrator only)
router.post('/', requireAdmin, (req, res) => {
  try {
    const {
      name,
      brand,
      genericName,
      category = 'Pain Relief & Fever',
      price,
      mrp,
      stock = 0,
      dosage = '',
      packSize = '',
      prescriptionRequired = false,
      description = '',
      benefits = '',
      manufacturer = '',
      image,
    } = req.body;

    const numericPrice = Number(price);
    const numericStock = Number(stock ?? 0);
    if (!String(name || '').trim() || !Number.isFinite(numericPrice) || numericPrice <= 0 || !Number.isInteger(numericStock) || numericStock < 0 || !String(benefits || '').trim() || !String(image || '').trim()) {
      return res.status(400).json({ success: false, message: 'Medicine name, image, benefits, and a valid price are required.' });
    }
    if (String(image).length > 7_200_000) return res.status(413).json({ success: false, message: 'Medicine image must be 5 MB or smaller.' });

    const numericMrp = mrp === undefined || mrp === '' ? +(numericPrice * 1.15).toFixed(2) : Number(mrp);
    if (!Number.isFinite(numericMrp) || numericMrp < numericPrice) {
      return res.status(400).json({ success: false, message: 'MRP must be a valid amount greater than or equal to the selling price.' });
    }
    const discountPercent = numericMrp > numericPrice ? Math.round(((numericMrp - numericPrice) / numericMrp) * 100) : 0;

    const newMed = {
      _id: 'med_' + Date.now(),
      createdBy: req.adminUser._id,
      name: String(name).trim(),
      brand: String(brand || '').trim(),
      genericName: String(genericName || '').trim(),
      category,
      price: numericPrice,
      mrp: numericMrp,
      discountPercent,
      stock: numericStock,
      dosage,
      packSize,
      prescriptionRequired: Boolean(prescriptionRequired),
      description,
      benefits: String(benefits).trim(),
      manufacturer: String(manufacturer || '').trim(),
      image,
      rating: 0,
      ratingCount: 0,
      inStock: numericStock > 0
    };

    const inserted = dbStore.insert('medicines', newMed);
    res.status(201).json({ success: true, message: 'Medicine added to inventory successfully', medicine: inserted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update a website catalog item (administrator only)
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const existing = dbStore.findOne('medicines', (m) => m._id === id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    if (existing.createdBy !== req.adminUser._id) return res.status(403).json({ success: false, message: 'Only the website administrator can edit this medicine.' });
    const allowedFields = ['name', 'brand', 'genericName', 'category', 'price', 'mrp', 'stock', 'dosage', 'packSize', 'prescriptionRequired', 'description', 'benefits', 'manufacturer', 'image'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedFields.includes(key)));
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No supported medicine fields were provided.' });
    }
    if ('stock' in updates) {
      updates.stock = Number(updates.stock);
      if (!Number.isInteger(updates.stock) || updates.stock < 0) {
        return res.status(400).json({ success: false, message: 'Stock must be a non-negative whole number.' });
      }
      updates.inStock = updates.stock > 0;
    }
    if ('price' in updates) {
      updates.price = Number(updates.price);
      if (!Number.isFinite(updates.price) || updates.price <= 0) return res.status(400).json({ success: false, message: 'Price must be greater than zero.' });
    }
    if ('mrp' in updates) {
      updates.mrp = Number(updates.mrp);
      if (!Number.isFinite(updates.mrp) || updates.mrp <= 0) return res.status(400).json({ success: false, message: 'MRP must be greater than zero.' });
    }
    const nextPrice = updates.price ?? existing.price;
    const nextMrp = updates.mrp ?? existing.mrp;
    if (nextMrp < nextPrice) return res.status(400).json({ success: false, message: 'MRP cannot be below the selling price.' });
    if ('price' in updates || 'mrp' in updates) updates.discountPercent = nextMrp > nextPrice ? Math.round(((nextMrp - nextPrice) / nextMrp) * 100) : 0;
    if ('name' in updates) updates.name = String(updates.name).trim();
    if (!updates.name && 'name' in req.body) return res.status(400).json({ success: false, message: 'Medicine name cannot be empty.' });

    const updated = dbStore.updateOne('medicines', (m) => m._id === id, updates);
    res.json({ success: true, message: 'Medicine updated successfully', medicine: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete medicine from inventory
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const existing = dbStore.findOne('medicines', (m) => m._id === id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    if (existing.createdBy !== req.adminUser._id) return res.status(403).json({ success: false, message: 'Only the website administrator can remove this medicine.' });
    dbStore.delete('medicines', (m) => m._id === id);
    res.json({ success: true, message: 'Medicine removed from inventory' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
