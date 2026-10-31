import express from 'express';
import { dbStore } from '../services/store.js';

const router = express.Router();

// Get all pharmacies
router.get('/', (req, res) => {
  try {
    const pharmacies = dbStore.get('pharmacies');
    res.json({ success: true, count: pharmacies.length, pharmacies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get nearby serviceable pharmacies
router.get('/nearby', (req, res) => {
  try {
    const { pincode, lat, lng } = req.query;
    const pharmacies = dbStore.get('pharmacies');

    let matchedPharmacies = pharmacies.filter((p) => p.isOpen !== false);

    if (pincode) {
      const pinMatch = pharmacies.filter((p) => p.pincode === pincode);
      matchedPharmacies = matchedPharmacies.filter((p) => p.pincode === pincode);
    }

    if (lat !== undefined && lng !== undefined && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))) {
      const latitude = Number(lat);
      const longitude = Number(lng);
      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return res.status(400).json({ success: false, message: 'Latitude or longitude is out of range.' });
      }
      const distanceKm = (pharmacy) => {
        if (!Number.isFinite(Number(pharmacy.lat)) || !Number.isFinite(Number(pharmacy.lng))) return Infinity;
        const dLat = (Number(pharmacy.lat) - latitude) * Math.PI / 180;
        const dLng = (Number(pharmacy.lng) - longitude) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(latitude * Math.PI / 180) * Math.cos(Number(pharmacy.lat) * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
        return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      };
      matchedPharmacies = matchedPharmacies.map((p) => ({ ...p, distanceKm: distanceKm(p) }));
    }

    matchedPharmacies.sort((a, b) => {
      const aDistance = Number.isFinite(Number(a.distanceKm)) ? Number(a.distanceKm) : Infinity;
      const bDistance = Number.isFinite(Number(b.distanceKm)) ? Number(b.distanceKm) : Infinity;
      return aDistance - bDistance;
    });

    res.json({
      success: true,
      count: matchedPharmacies.length,
      pharmacies: matchedPharmacies
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Check stock availability across nearby pharmacies
router.post('/check-availability', (req, res) => {
  try {
    const { pincode, medicineIds = [] } = req.body;
    if (typeof pincode !== 'string' || !/^[1-9]\d{5}$/.test(pincode) || !Array.isArray(medicineIds) || medicineIds.length === 0) {
      return res.status(400).json({ success: false, message: 'A six-digit PIN code and at least one medicine are required.' });
    }
    const pharmacies = dbStore.get('pharmacies');
    const medicines = dbStore.get('medicines');

    const selectedMedicines = medicines.filter((m) => medicineIds.includes(m._id));
    if (selectedMedicines.length !== medicineIds.length) {
      return res.status(404).json({ success: false, message: 'One or more medicines are unavailable.' });
    }
    const allInStock = selectedMedicines.every((m) => m.inStock && m.stock > 0);

    const nearestPharmacy = pharmacies.find((p) => p.pincode === pincode && p.isOpen !== false) || {
      name: '10 MN Company nationwide delivery', pincode, expressAvailable: false,
      etaLabel: '2–5 business days', isDemoFulfillment: true
    };

    res.json({
      success: true,
      serviceable: true,
      pharmacy: nearestPharmacy,
      allInStock,
      itemsChecked: selectedMedicines.length,
      estimatedDeliveryMinutes: nearestPharmacy.etaMinutes || null,
      estimatedDeliveryLabel: nearestPharmacy.etaLabel || (nearestPharmacy.isDemoFulfillment ? '2–5 business days' : `${nearestPharmacy.etaMinutes || 18} minutes`),
      expressEligible: Boolean(nearestPharmacy.expressAvailable)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update pharmacy status (Open/Closed, Express toggle)
router.put('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { isOpen, expressAvailable } = req.body;

    const pharmacy = dbStore.findOne('pharmacies', (p) => p._id === id);
    if (!pharmacy) {
      return res.status(404).json({ success: false, message: 'Pharmacy not found' });
    }

    const updates = {};
    if (typeof isOpen === 'boolean') updates.isOpen = isOpen;
    if (typeof expressAvailable === 'boolean') updates.expressAvailable = expressAvailable;

    const updated = dbStore.updateOne('pharmacies', (p) => p._id === id, updates);
    res.json({ success: true, message: 'Pharmacy status updated', pharmacy: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
