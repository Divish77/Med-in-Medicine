import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';
import { ORDER_STAGES } from '@/lib/orderStages';
import { verifyAdmin } from '@/lib/auth';

const getOrderStageIndex = (order) => {
  const statusIndex = ORDER_STAGES.findIndex((stage) => stage.status === order.status);
  if (statusIndex >= 0) return statusIndex;
  return Math.max(0, Math.min(Number(order.stageIndex) || 0, ORDER_STAGES.length - 2));
};

export async function POST(request, { params }) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Website administrator access is required.' }, { status: 403 });
    }

    const { id } = await params;
    const { targetStageIndex } = await request.json().catch(() => ({}));

    const order = dbStore.findOne('orders', (o) => o.orderId === id || o._id === id);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });
    }

    const currentStageIndex = getOrderStageIndex(order);
    const nextIndex = typeof targetStageIndex === 'number'
      ? Math.max(0, Math.min(targetStageIndex, ORDER_STAGES.length - 2))
      : Math.min(currentStageIndex + 1, ORDER_STAGES.length - 2);

    if (order.status === 'Successfully Delivered' || order.status === 'Cancelled' || nextIndex < currentStageIndex) {
      const message = order.status === 'Cancelled'
        ? 'A cancelled order cannot be advanced.'
        : order.status === 'Successfully Delivered'
          ? 'A delivered order cannot be changed.'
          : 'Order progress cannot be moved backwards.';
      return NextResponse.json({ success: false, message }, { status: 409 });
    }

    const stageInfo = ORDER_STAGES[nextIndex];
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const oldTimelineByStatus = new Map((order.timeline || []).map((step) => [step.status, step]));
    const updatedTimeline = ORDER_STAGES.map((stage, idx) => {
      const step = oldTimelineByStatus.get(stage.status);
      if (idx <= nextIndex) {
        return {
          ...stage,
          ...step,
          status: stage.status,
          description: stage.description,
          icon: stage.icon,
          completed: true,
          timestamp: step?.timestamp || currentTime
        };
      }
      return { ...stage, ...step, status: stage.status, completed: false, timestamp: '' };
    });

    const updatedOrder = dbStore.updateOne('orders', (o) => o.orderId === order.orderId, {
      stageIndex: nextIndex,
      status: stageInfo.status,
      timeline: updatedTimeline
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
