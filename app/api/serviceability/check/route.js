import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get('pincode');

    if (!pincode || !/^[1-9]\d{5}$/.test(pincode.trim())) {
      return NextResponse.json({
        success: false,
        serviceable: false,
        message: 'Please provide a valid 6-digit PIN code.'
      }, { status: 400 });
    }

    const cleanPin = pincode.trim();
    const matchedPharmacy = dbStore.get('pharmacies').find((p) => p.pincode === cleanPin && p.isOpen !== false);

    if (matchedPharmacy) {
      return NextResponse.json({
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

    return NextResponse.json({
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
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

