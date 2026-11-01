import { NextResponse } from 'next/server';
import { randomInt, randomUUID } from 'crypto';
import { dbStore } from '@/lib/db';
import { ORDER_STAGES } from '@/lib/orderStages';
import { verifyAdmin } from '@/lib/auth';

const generateOrderId = () => `MIM-${randomUUID().replaceAll('-', '').slice(0, 12).toUpperCase()}`;
const generateInvoiceNumber = (orderId) => `INV-${new Date().getFullYear()}-${orderId.replace('MIM-', '')}`;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let orders = dbStore.get('orders');
    if (userId) {
      orders = orders.filter((o) => o.userId === userId);
    }
    orders = [...orders].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      userId = 'user_guest',
      customerName = 'Customer',
      customerPhone = '+91 98765 43210',
      deliveryAddress,
      items = [],
      paymentMethod = 'Cash on Delivery',
      prescriptionId = null,
      notes = ''
    } = body;

    if (!deliveryAddress || typeof deliveryAddress.pincode !== 'string' || !/^[1-9]\d{5}$/.test(deliveryAddress.pincode.trim())) {
      return NextResponse.json({ success: false, message: 'Valid delivery address with PIN code is required.' }, { status: 400 });
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, message: 'Cart is empty. Please add medicines to order.' }, { status: 400 });
    }

    const pincode = deliveryAddress.pincode.trim();
    const pharmacies = dbStore.get('pharmacies');
    const localPharmacy = pharmacies.find((p) => p.pincode === pincode && p.isOpen !== false);
    const matchedPharmacy = localPharmacy || {
      name: '10 MN Company nationwide delivery',
      address: `Standard delivery to PIN code ${pincode}`,
      licenseNumber: '', phone: '', lat: null, lng: null,
      pincode, expressAvailable: false, isDemoFulfillment: true
    };

    const inventory = dbStore.get('medicines');
    const quantities = new Map();
    for (const item of items) {
      quantities.set(item._id, (quantities.get(item._id) || 0) + Number(item.quantity));
    }

    const canonicalItems = [];
    for (const [medicineId, quantity] of quantities) {
      const medicine = inventory.find((m) => m._id === medicineId);
      if (!medicine || !medicine.inStock || Number(medicine.stock) < quantity) {
        return NextResponse.json({ success: false, message: `${medicine?.name || 'A selected medicine'} is unavailable in the requested quantity.` }, { status: 400 });
      }
      canonicalItems.push({
        _id: medicine._id, name: medicine.name, brand: medicine.brand,
        genericName: medicine.genericName, price: Number(medicine.price), mrp: Number(medicine.mrp),
        quantity, packSize: medicine.packSize, prescriptionRequired: Boolean(medicine.prescriptionRequired), image: medicine.image
      });
    }

    const hasRxItems = canonicalItems.some((item) => item.prescriptionRequired);
    const prescription = prescriptionId && dbStore.findOne('prescriptions', (p) => p._id === prescriptionId);
    if (hasRxItems && (!prescription || prescription.status !== 'Verified by Pharmacist')) {
      return NextResponse.json({ success: false, message: 'A pharmacist-verified prescription is required for prescription medicines.' }, { status: 400 });
    }

    const subtotal = canonicalItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const safeDeliveryFee = matchedPharmacy.expressAvailable ? 0 : 25;
    const packagingFee = 15;
    const safeTax = +(subtotal * 0.05).toFixed(2);
    const totalAmount = +(subtotal + safeDeliveryFee + packagingFee + safeTax).toFixed(2);

    const orderId = generateOrderId();
    const invoiceNumber = generateInvoiceNumber(orderId);
    const orderTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const isExpressPin = Boolean(localPharmacy?.expressAvailable) && ['110001', '110016', '110024', '560001', '560034', '400050', '160017', '147001', '122002', '201301'].includes(pincode);
    const etaMinutes = matchedPharmacy.isDemoFulfillment ? 2 * 24 * 60 : isExpressPin ? 10 : 18;

    const arrivalDate = new Date(Date.now() + etaMinutes * 60 * 1000);
    const estimatedArrivalTime = matchedPharmacy.isDemoFulfillment
      ? arrivalDate.toLocaleDateString([], { month: 'short', day: 'numeric' })
      : arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const timeline = ORDER_STAGES.map((stage, idx) => ({
      status: stage.status,
      description: stage.description,
      icon: stage.icon,
      completed: idx === 0,
      timestamp: idx === 0 ? orderTimestamp : ''
    }));

    const newOrder = {
      orderId,
      invoiceNumber,
      userId,
      customerName,
      customerPhone,
      deliveryAddress,
      items: canonicalItems,
      subtotal,
      deliveryFee: safeDeliveryFee,
      packagingFee,
      discount: 0,
      tax: safeTax,
      totalAmount,
      paymentMethod,
      paymentStatus: 'Pending',
      transactionId: 'TXN_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      prescriptionId,
      prescriptionRequired: hasRxItems,
      prescriptionVerified: !hasRxItems || prescription?.status === 'Verified by Pharmacist',
      status: 'Order Placed',
      stageIndex: 0,
      timeline,
      pharmacy: {
        name: matchedPharmacy.name,
        address: matchedPharmacy.address || '',
        licenseNumber: matchedPharmacy.licenseNumber || '',
        phone: matchedPharmacy.phone || '',
        lat: matchedPharmacy.lat,
        lng: matchedPharmacy.lng
      },
      deliveryPartner: {
        name: 'Rahul Verma',
        phone: '+91 98765 43210',
        vehicleNumber: 'DL 01 AB 1234',
        currentLat: matchedPharmacy.lat || 28.6315,
        currentLng: matchedPharmacy.lng || 77.2167
      },
      estimatedDeliveryMinutes: etaMinutes,
      estimatedDeliveryLabel: matchedPharmacy.isDemoFulfillment ? '2–5 business days' : `${etaMinutes} minutes`,
      estimatedArrivalTime,
      deliveryConfirmationOtp: String(randomInt(1000, 10000)),
      deliveredAt: null,
      rating: null,
      feedback: null,
      notes
    };

    const savedOrder = dbStore.insert('orders', newOrder);

    // Reduce stock
    for (const item of canonicalItems) {
      const medicine = inventory.find((m) => m._id === item._id);
      if (medicine) {
        dbStore.updateOne('medicines', (m) => m._id === item._id, {
          stock: Math.max(0, Number(medicine.stock) - item.quantity),
          inStock: Number(medicine.stock) - item.quantity > 0
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully! Tracking initiated.',
      order: savedOrder
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
