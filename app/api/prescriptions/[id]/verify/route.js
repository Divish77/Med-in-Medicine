import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, pharmacistNotes, verifiedBy } = body;

    const allowedStatuses = new Set(['Verified by Pharmacist', 'Rejected']);
    if (!allowedStatuses.has(status)) {
      return NextResponse.json({ success: false, message: 'Status must be Verified by Pharmacist or Rejected.' }, { status: 400 });
    }

    const existing = dbStore.findOne('prescriptions', (p) => p._id === id);
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Prescription not found' }, { status: 404 });
    }

    const updated = dbStore.updateOne('prescriptions', (p) => p._id === id, {
      status,
      pharmacistNotes: pharmacistNotes || (status === 'Verified by Pharmacist' ? 'Approved for fulfillment' : 'Requires doctor clarification'),
      verifiedBy: String(verifiedBy || '').trim(),
      verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    return NextResponse.json({ success: true, message: `Prescription marked as ${status}`, prescription: updated });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
