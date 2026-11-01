import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const order = dbStore.findOne('orders', (o) => o.orderId === id || o._id === id);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Eligible items retrieved for reorder.',
      items: order.items,
      deliveryAddress: order.deliveryAddress
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

