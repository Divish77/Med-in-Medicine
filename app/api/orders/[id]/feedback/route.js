import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { rating, comment, tags = [] } = await request.json().catch(() => ({}));

    const order = dbStore.findOne('orders', (o) => o.orderId === id || o._id === id);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });
    }

    const updatedOrder = dbStore.updateOne('orders', (o) => o.orderId === order.orderId, {
      rating: Number(rating) || 5,
      feedback: {
        comment: comment || 'Smooth and rapid delivery experience.',
        tags,
        submittedAt: new Date().toISOString()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback! It helps us maintain our 10-minute delivery excellence.',
      order: updatedOrder
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
