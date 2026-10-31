import express from 'express';
import { dbStore } from '../services/store.js';

const router = express.Router();

// Check serviceability by PIN code
router.get('/check', (req, res) => {
  try {
    const { pincode } = req.query;

    if (!pincode || !/^[1-9]\d{5}$/.test(pincode.trim())) {
      return res.status(400).json({
        success: false,
        serviceable: false,
        message: 'Please provide a valid 6-digit PIN code.'
      });
    }

    const cleanPin = pincode.trim();

    // Use a local pharmacy's faster estimate when one is available.
    const matchedPharmacy = dbStore.get('pharmacies').find((p) => p.pincode === cleanPin && p.isOpen !== false);

    if (matchedPharmacy) {
      return res.json({
        success: true,
        serviceable: true,
        pincode: cleanPin,
        area: matchedPharmacy.area || matchedPharmacy.address || '',
        city: matchedPharmacy.city || '',
        expressEligible: Boolean(matchedPharmacy.expressAvailable),
        etaMinutes: matchedPharmacy.etaMinutes || 18,
        etaLabel: `${matchedPharmacy.etaMinutes || 18} minutes`,
        pharmacyName: matchedPharmacy.name,
        deliveryFee: matchedPharmacy.expressAvailable ? 0 : 25,
        message: `Delivery is available from ${matchedPharmacy.name}.`
      });
    }

    return res.json({
      success: true,
      serviceable: true,
      pincode: cleanPin,
      area: '',
      city: '',
      expressEligible: false,
      etaMinutes: null,
      etaLabel: '2–5 business days',
      pharmacyName: '10 MN Company nationwide delivery',
      deliveryFee: 25,
      nationwideDemoDelivery: true,
      message: `Standard delivery is available to PIN code ${cleanPin} in 2–5 business days.`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get popular serviceable cities
router.get('/popular', (req, res) => {
  const popular = dbStore.get('pharmacies')
    .filter((pharmacy) => pharmacy.isOpen !== false && pharmacy.pincode)
    .map((pharmacy) => ({
      city: pharmacy.city || '',
      pincode: pharmacy.pincode,
      area: pharmacy.area || pharmacy.address || '',
      eta: `${pharmacy.etaMinutes || 18} Mins`
    }));
  res.json({ success: true, popular });
});

export default router;
