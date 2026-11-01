import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';
import { medicineCategories } from '@/lib/seedData';
import { verifyAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const rxOnly = searchParams.get('rxOnly');
    const otcOnly = searchParams.get('otcOnly');
    const sort = searchParams.get('sort');

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
      medicines = medicines.filter((m) => String(m.category).toLowerCase() === category.toLowerCase());
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

    return NextResponse.json({
      success: true,
      count: medicines.length,
      categories: medicineCategories,
      medicines
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Website administrator access is required.' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name, brand, genericName, category = 'Pain Relief & Fever',
      price, mrp, stock = 0, dosage = '', packSize = '',
      prescriptionRequired = false, description = '', benefits = '',
      manufacturer = '', image
    } = body;

    const numericPrice = Number(price);
    const numericStock = Number(stock ?? 0);
    if (!String(name || '').trim() || !Number.isFinite(numericPrice) || numericPrice <= 0 || !Number.isInteger(numericStock) || numericStock < 0 || !String(benefits || '').trim() || !String(image || '').trim()) {
      return NextResponse.json({ success: false, message: 'Medicine name, image, benefits, and a valid price are required.' }, { status: 400 });
    }

    const numericMrp = mrp === undefined || mrp === '' ? +(numericPrice * 1.15).toFixed(2) : Number(mrp);
    if (!Number.isFinite(numericMrp) || numericMrp < numericPrice) {
      return NextResponse.json({ success: false, message: 'MRP must be a valid amount greater than or equal to the selling price.' }, { status: 400 });
    }
    const discountPercent = numericMrp > numericPrice ? Math.round(((numericMrp - numericPrice) / numericMrp) * 100) : 0;

    const newMed = {
      _id: 'med_' + Date.now(),
      createdBy: admin._id,
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
    return NextResponse.json({ success: true, message: 'Medicine added to inventory successfully', medicine: inserted }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
