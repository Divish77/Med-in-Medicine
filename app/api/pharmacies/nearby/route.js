import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get('pincode');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    const pharmacies = dbStore.get('pharmacies');
    let matchedPharmacies = pharmacies.filter((p) => p.isOpen !== false);

    if (pincode) {
      const filtered = matchedPharmacies.filter((p) => p.pincode === pincode);
      if (filtered.length > 0) {
        matchedPharmacies = filtered;
      } else {
        matchedPharmacies = [{
          name: '10 MN Company nationwide delivery',
          pincode,
          city: '',
          expressAvailable: false,
          etaMinutes: null,
          etaLabel: '2–5 business days',
          isDemoFulfillment: true,
          distanceKm: null
        }];
      }
    }

    if (lat !== null && lng !== null && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))) {
      const latitude = Number(lat);
      const longitude = Number(lng);
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

    return NextResponse.json({
      success: true,
      count: matchedPharmacies.length,
      pharmacies: matchedPharmacies
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

