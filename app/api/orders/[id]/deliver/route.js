import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';
import { ORDER_STAGES } from '@/lib/orderStages';
import { verifyAdmin } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Website administrator access is required.' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { otp, order: orderData } = body;

    let order = dbStore.findOne('orders', (o) => o.orderId === id || o._id === id);
    if (!order && orderData && (orderData.orderId === id || orderData._id === id)) {
      order = dbStore.insert('orders', orderData);
    }
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });
    }

    if (order.status === 'Successfully Delivered') {
      return NextResponse.json({ success: false, message: 'This order has already been delivered.' }, { status: 409 });
    }
    if (order.status === 'Cancelled') {
      return NextResponse.json({ success: false, message: 'A cancelled order cannot be delivered.' }, { status: 409 });
    }

    if (otp && order.deliveryConfirmationOtp && otp.toString().trim() !== order.deliveryConfirmationOtp.toString().trim()) {
      return NextResponse.json({ success: false, message: 'Invalid delivery handover code. Please check the customer OTP.' }, { status: 400 });
    }

    const finalIdx = ORDER_STAGES.length - 1;
    const deliveryTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fullDeliveredTimestamp = new Date().toISOString();

    const oldTimelineByStatus = new Map((order.timeline || []).map((step) => [step.status, step]));
    const deliveredTimeline = ORDER_STAGES.map((stage) => ({
      ...stage,
      ...oldTimelineByStatus.get(stage.status),
      status: stage.status,
      description: stage.description,
      icon: stage.icon,
      completed: true,
      timestamp: oldTimelineByStatus.get(stage.status)?.timestamp || deliveryTime
    }));

    const finalOrder = dbStore.updateOne('orders', (o) => o.orderId === order.orderId, {
      stageIndex: finalIdx,
      status: 'Successfully Delivered',
      timeline: deliveredTimeline,
      deliveredAt: fullDeliveredTimestamp,
      deliveryOtpVerified: true,
      paymentStatus: order.paymentMethod === 'Cash on Delivery' ? 'Paid' : order.paymentStatus
    });

    return NextResponse.json({
      success: true,
      message: 'Order delivery confirmed successfully!',
      order: finalOrder
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

