import express from 'express';
import { dbStore } from '../services/store.js';

const router = express.Router();

// Get nearby serviceable pharmacies
router.get('/nearby', (req, res) => {
  try {
    const { pincode, lat, lng } = req.query;
    const pharmacies = dbStore.get('pharmacies');

    let matchedPharmacies = [...pharmacies];

    if (pincode) {
      const pinMatch = pharmacies.filter((p) => p.pincode === pincode);
      if (pinMatch.length > 0) {
        matchedPharmacies = pinMatch;
      }
    }

    // Sort by distance
    matchedPharmacies.sort((a, b) => a.distanceKm - b.distanceKm);

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
    const pharmacies = dbStore.get('pharmacies');
    const medicines = dbStore.get('medicines');

    const selectedMedicines = medicines.filter((m) => medicineIds.includes(m._id));
    const allInStock = selectedMedicines.every((m) => m.inStock && m.stock > 0);

    const nearestPharmacy = pharmacies.find((p) => p.pincode === pincode) || pharmacies[0];

    res.json({
      success: true,
      serviceable: !!nearestPharmacy,
      pharmacy: nearestPharmacy,
      allInStock,
      itemsChecked: selectedMedicines.length,
      estimatedDeliveryMinutes: nearestPharmacy ? nearestPharmacy.etaMinutes : 10,
      expressEligible: nearestPharmacy ? nearestPharmacy.expressAvailable : false
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
