import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';

export async function DELETE(request, { params }) {
  try {
    const { userId, addressId } = await params;
    const user = dbStore.findOne('users', (u) => u._id === userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const currentAddresses = user.addresses || [];
    const filtered = currentAddresses.filter((a) => a._id !== addressId && a.id !== addressId);
    const updated = dbStore.updateOne('users', (u) => u._id === userId, { addresses: filtered });

    return NextResponse.json({ success: true, message: 'Address deleted successfully', user: updated });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

