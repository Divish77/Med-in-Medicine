import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const medicine = dbStore.findOne('medicines', (m) => m._id === id);
    if (!medicine) {
      return NextResponse.json({ success: false, message: 'Medicine not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, medicine });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Website administrator access is required.' }, { status: 403 });
    }

    const { id } = await params;
    const existing = dbStore.findOne('medicines', (m) => m._id === id);
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Medicine not found' }, { status: 404 });
    }

    const body = await request.json();
    const allowedFields = ['name', 'brand', 'genericName', 'category', 'price', 'mrp', 'stock', 'dosage', 'packSize', 'prescriptionRequired', 'description', 'benefits', 'manufacturer', 'image'];
    const updates = Object.fromEntries(Object.entries(body).filter(([key]) => allowedFields.includes(key)));

    if ('stock' in updates) {
      updates.stock = Number(updates.stock);
      if (!Number.isInteger(updates.stock) || updates.stock < 0) {
        return NextResponse.json({ success: false, message: 'Stock must be a non-negative whole number.' }, { status: 400 });
      }
      updates.inStock = updates.stock > 0;
    }
    if ('price' in updates) {
      updates.price = Number(updates.price);
      if (!Number.isFinite(updates.price) || updates.price <= 0) {
        return NextResponse.json({ success: false, message: 'Price must be greater than zero.' }, { status: 400 });
      }
    }
    if ('mrp' in updates) {
      updates.mrp = Number(updates.mrp);
      if (!Number.isFinite(updates.mrp) || updates.mrp <= 0) {
        return NextResponse.json({ success: false, message: 'MRP must be greater than zero.' }, { status: 400 });
      }
    }
    const nextPrice = updates.price ?? existing.price;
    const nextMrp = updates.mrp ?? existing.mrp;
    if (nextMrp < nextPrice) {
      return NextResponse.json({ success: false, message: 'MRP cannot be below the selling price.' }, { status: 400 });
    }
    if ('price' in updates || 'mrp' in updates) {
      updates.discountPercent = nextMrp > nextPrice ? Math.round(((nextMrp - nextPrice) / nextMrp) * 100) : 0;
    }
    if ('name' in updates) updates.name = String(updates.name).trim();

    const updated = dbStore.updateOne('medicines', (m) => m._id === id, updates);
    return NextResponse.json({ success: true, message: 'Medicine updated successfully', medicine: updated });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Website administrator access is required.' }, { status: 403 });
    }

    const { id } = await params;
    const existing = dbStore.findOne('medicines', (m) => m._id === id);
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Medicine not found' }, { status: 404 });
    }

    dbStore.delete('medicines', (m) => m._id === id);
    return NextResponse.json({ success: true, message: 'Medicine removed from inventory' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
