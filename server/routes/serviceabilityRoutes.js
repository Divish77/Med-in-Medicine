import express from 'express';
import { dbStore } from '../services/store.js';

const router = express.Router();

// Check serviceability by PIN code
router.get('/check', (req, res) => {
  try {
    const { pincode } = req.query;

    if (!pincode || !/^\d{6}$/.test(pincode.trim())) {
      return res.status(400).json({
        success: false,
        serviceable: false,
        message: 'Please provide a valid 6-digit PIN code.'
      });
    }

    const cleanPin = pincode.trim();

    // Check against designated express delivery zones
    const knownZones = dbStore.get('serviceablePincodes');
    const matchedZone = knownZones.find((z) => z.pincode === cleanPin);

    // Explicitly unserviceable mock PINs for testing
    if (cleanPin === '999999' || cleanPin.startsWith('0') || cleanPin.startsWith('9')) {
      return res.json({
        success: true,
        serviceable: false,
        pincode: cleanPin,
        expressEligible: false,
        etaMinutes: null,
        message: `Sorry, Med in Minutes does not currently deliver to PIN code ${cleanPin}. We are actively expanding to your neighborhood soon!`
      });
    }

    if (matchedZone) {
      return res.json({
        success: true,
        serviceable: true,
        pincode: cleanPin,
        area: matchedZone.area,
        city: matchedZone.city,
        expressEligible: matchedZone.expressDelivery,
        etaMinutes: matchedZone.etaMinutes || 10,
        pharmacyName: matchedZone.pharmacyName,
        deliveryFee: 0,
        message: `⚡ 10-Minute Express Delivery Available at ${matchedZone.area}, ${matchedZone.city}!`
      });
    }

    // Generic serviceable Indian PIN code with realistic standard timeline (15-20 mins, not 10 mins)
    return res.json({
      success: true,
      serviceable: true,
      pincode: cleanPin,
      area: 'Regional Hub',
      city: 'Local Area',
      expressEligible: false,
      etaMinutes: 18,
      pharmacyName: 'Med in Minutes Verified Partner Store',
      deliveryFee: 25,
      message: `Standard Express Delivery (15-20 mins) available for PIN code ${cleanPin}.`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get popular serviceable cities
router.get('/popular', (req, res) => {
  const popular = [
    { city: 'New Delhi', pincode: '110001', area: 'Connaught Place', eta: '10 Mins' },
    { city: 'Bangalore', pincode: '560001', area: 'MG Road / Indiranagar', eta: '10 Mins' },
    { city: 'Mumbai', pincode: '400050', area: 'Bandra West', eta: '10 Mins' },
    { city: 'Gurgaon', pincode: '122002', area: 'Cyber City', eta: '10 Mins' },
    { city: 'Noida', pincode: '201301', area: 'Sector 18', eta: '10 Mins' },
    { city: 'Chandigarh', pincode: '160017', area: 'Sector 17', eta: '10 Mins' },
    { city: 'Patiala', pincode: '147001', area: 'Model Town', eta: '10 Mins' },
    { city: 'Hyderabad', pincode: '500081', area: 'Hitec City', eta: '10 Mins' }
  ];
  res.json({ success: true, popular });
});

export default router;
