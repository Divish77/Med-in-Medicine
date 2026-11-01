import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';

export async function POST(request) {
  try {
    const { pincode, medicineIds = [] } = await request.json();
    if (typeof pincode !== 'string' || !/^[1-9]\d{5}$/.test(pincode) || !Array.isArray(medicineIds) || medicineIds.length === 0) {
      return NextResponse.json({ success: false, message: 'A six-digit PIN code and at least one medicine are required.' }, { status: 400 });
    }

    const pharmacies = dbStore.get('pharmacies');
    const medicines = dbStore.get('medicines');

    const selectedMedicines = medicines.filter((m) => medicineIds.includes(m._id));
    if (selectedMedicines.length !== medicineIds.length) {
      return NextResponse.json({ success: false, message: 'One or more medicines are unavailable.' }, { status: 404 });
    }
    const allInStock = selectedMedicines.every((m) => m.inStock && m.stock > 0);

    const nearestPharmacy = pharmacies.find((p) => p.pincode === pincode && p.isOpen !== false) || {
      name: '10 MN Company nationwide delivery', pincode, expressAvailable: false,
      etaLabel: '2–5 business days', isDemoFulfillment: true
    };

    return NextResponse.json({
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
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
