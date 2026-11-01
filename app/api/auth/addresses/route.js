import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';

export async function POST(request) {
  try {
    const { userId, address } = await request.json();
    if (!userId || !address) {
      return NextResponse.json({ success: false, message: 'User ID and address are required' }, { status: 400 });
    }

    const user = dbStore.findOne('users', (u) => u._id === userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const newAddress = {
      _id: 'addr_' + Date.now(),
      ...address
    };

    const currentAddresses = user.addresses || [];
    const updated = dbStore.updateOne('users', (u) => u._id === userId, {
      addresses: [...currentAddresses, newAddress]
    });

    return NextResponse.json({ success: true, message: 'Address saved successfully', address: newAddress, user: updated });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

