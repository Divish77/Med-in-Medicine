import express from 'express';
import { dbStore } from '../services/store.js';
import { medicineCategories } from '../seed/seedData.js';

const router = express.Router();

// Get medicines with search, category, and prescription filter
router.get('/', (req, res) => {
  try {
    const { search, category, rxOnly, otcOnly, sort } = req.query;
    let medicines = dbStore.get('medicines');

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      medicines = medicines.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.genericName.toLowerCase().includes(q) ||
          m.brand.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
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

// Get categories list
router.get('/meta/categories', (req, res) => {
  res.json({ success: true, categories: medicineCategories });
});

export default router;
