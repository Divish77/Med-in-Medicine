import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const order = dbStore.findOne('orders', (o) => o.orderId === id || o._id === id);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });
    }

    const invoiceData = {
      invoiceNumber: order.invoiceNumber || `INV-${order.orderId}`,
      invoiceDate: new Date(order.createdAt).toLocaleDateString(),
      orderId: order.orderId,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress?.fullAddress || '',
      pharmacyName: order.pharmacy?.name || '',
      pharmacyLicense: order.pharmacy?.licenseNumber || '',
      pharmacyGstin: order.pharmacy?.gstin || 'Not provided',
      items: (order.items || []).map((it, idx) => ({
        sno: idx + 1,
        name: it.name,
        packSize: it.packSize || '1 Strip',
        batchNumber: it.batchNumber || 'Not provided',
        expiryDate: it.expiryDate || 'See product pack',
        qty: it.quantity,
        rate: it.price,
        amount: +(it.price * it.quantity).toFixed(2),
        prescriptionRequired: it.prescriptionRequired ? 'Yes (Rx)' : 'No (OTC)'
      })),
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      packagingFee: order.packagingFee || 0,
      discount: order.discount,
      tax: order.tax,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      status: order.status
    };

    return NextResponse.json({ success: true, invoice: invoiceData });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
