import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Website administrator access is required.' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const order = dbStore.findOne('orders', (item) => item.orderId === id || item._id === id);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });
    }
    if (['Successfully Delivered', 'Cancelled'].includes(order.status)) {
      return NextResponse.json({ success: false, message: `This order is already ${order.status.toLowerCase()}.` }, { status: 409 });
    }

    for (const item of order.items || []) {
      const medicine = dbStore.findOne('medicines', (candidate) => candidate._id === item._id);
      if (!medicine) continue;
      const restoredStock = Number(medicine.stock || 0) + Number(item.quantity || 0);
      dbStore.updateOne('medicines', (candidate) => candidate._id === item._id, {
        stock: restoredStock,
        inStock: restoredStock > 0
      });
    }

    const timestamp = new Date().toISOString();
    const cancellationReason = String(body.reason || 'Cancelled by website administrator').trim().slice(0, 250);
    const updatedOrder = dbStore.updateOne('orders', (item) => item.orderId === order.orderId, {
      status: 'Cancelled',
      cancelledAt: timestamp,
      cancelledBy: admin._id,
      cancellationReason,
      paymentStatus: order.paymentStatus === 'Paid'
        ? 'Refund Pending'
        : order.paymentMethod === 'Cash on Delivery' ? 'Not Charged' : order.paymentStatus,
      timeline: [...(order.timeline || []), {
        status: 'Cancelled',
        description: cancellationReason,
        icon: 'X',
        completed: true,
        timestamp: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]
    });

    return NextResponse.json({
      success: true,
      message: 'Order cancelled and reserved stock returned to inventory.',
      order: updatedOrder
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

