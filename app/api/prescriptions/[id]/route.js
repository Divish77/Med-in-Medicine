import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const prescription = dbStore.findOne('prescriptions', (p) => p._id === id || p.id === id);
    if (!prescription) {
      return NextResponse.json({ success: false, message: 'Prescription not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, prescription });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const existing = dbStore.findOne('prescriptions', (p) => p._id === id || p.id === id);
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Prescription not found.' }, { status: 404 });
    }
    dbStore.deleteOne('prescriptions', (p) => p._id === id || p.id === id);
    return NextResponse.json({ success: true, message: 'Prescription removed successfully.' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
