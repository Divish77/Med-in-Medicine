import express from 'express';
import jwt from 'jsonwebtoken';
import { dbStore } from '../services/store.js';
import { ORDER_STAGES } from '../services/socketService.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'med_in_minutes_secret_key_2026';

const requireAdmin = (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : '';
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = dbStore.findOne('users', (user) => user._id === decoded.id && user.role === 'admin');
    if (!admin) return res.status(403).json({ success: false, message: 'Website administrator access is required.' });
    req.adminUser = admin;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Sign in again to manage orders.' });
  }
};

// Generate unique order ID
const generateOrderId = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `MIM-${randomNum}`;
};

// Generate unique invoice number
const generateInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}-${randomNum}`;
};

// Create a new order
router.post('/', (req, res) => {
  try {
    const {
      userId = 'user_guest',
      customerName = 'Customer',
      customerPhone = '+91 98765 43210',
      deliveryAddress,
      items = [],
      paymentMethod = 'UPI',
      prescriptionId = null,
      notes = ''
    } = req.body;

    if (!deliveryAddress || typeof deliveryAddress.pincode !== 'string' || !/^[1-9]\d{5}$/.test(deliveryAddress.pincode.trim())) {
      return res.status(400).json({ success: false, message: 'Valid delivery address with PIN code is required.' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty. Please add medicines to order.' });
    }

    // Check serviceability
    const pincode = deliveryAddress.pincode.trim();
    const pharmacies = dbStore.get('pharmacies');
    const localPharmacy = pharmacies.find((p) => p.pincode === pincode && p.isOpen !== false);
    const matchedPharmacy = localPharmacy || {
      name: '10 MN Company nationwide delivery',
      address: `Standard delivery to PIN code ${pincode}`,
      licenseNumber: '', phone: '', lat: null, lng: null,
      pincode, expressAvailable: false, isDemoFulfillment: true
    };

    // Check prescription requirement
    const inventory = dbStore.get('medicines');
    const quantities = new Map();
    for (const item of items) {
      if (!item?._id || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1) {
        return res.status(400).json({ success: false, message: 'Each order item must have a valid medicine and quantity.' });
      }
      quantities.set(item._id, (quantities.get(item._id) || 0) + Number(item.quantity));
    }
    const canonicalItems = [];
    for (const [medicineId, quantity] of quantities) {
      const medicine = inventory.find((m) => m._id === medicineId);
      if (!medicine || !medicine.inStock || Number(medicine.stock) < quantity) {
        return res.status(400).json({ success: false, message: `${medicine?.name || 'A selected medicine'} is unavailable in the requested quantity.` });
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
      return res.status(400).json({ success: false, message: 'A pharmacist-verified prescription is required for prescription medicines.' });
    }
    const subtotal = canonicalItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const safeDeliveryFee = matchedPharmacy.expressAvailable ? 0 : 25;
    const packagingFee = 15;
    const safeDiscount = 0;
    const safeTax = +(subtotal * 0.05).toFixed(2);
    const totalAmount = +(subtotal + safeDeliveryFee + packagingFee).toFixed(2);

    const orderId = generateOrderId();
    const invoiceNumber = generateInvoiceNumber();
    const orderTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Calculate delivery time
    const isExpressPin = Boolean(localPharmacy?.expressAvailable) && ['110001', '110016', '110024', '560001', '560034', '400050', '160017', '147001', '122002', '201301'].includes(pincode);
    const etaMinutes = matchedPharmacy.isDemoFulfillment ? 2 * 24 * 60 : isExpressPin ? 10 : 18;

    const arrivalDate = new Date(Date.now() + etaMinutes * 60 * 1000);
    const estimatedArrivalTime = matchedPharmacy.isDemoFulfillment
      ? arrivalDate.toLocaleDateString([], { month: 'short', day: 'numeric' })
      : arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Build timeline
    const timeline = ORDER_STAGES.map((stage, idx) => {
      let isCompleted = false;
      let time = '';

      if (idx === 0) {
        // Order Placed
        isCompleted = true;
        time = orderTimestamp;
      } else if (idx === 1) {
        // Payment Confirmed
        isCompleted = true;
        time = orderTimestamp;
      } else if (idx === 2) {
        // Prescription Verification
        isCompleted = true;
        time = orderTimestamp;
      }

      return {
        status: stage.status,
        description: stage.description,
        icon: stage.icon,
        completed: isCompleted,
        timestamp: time
      };
    });

    // Pharmacy selection
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
      discount: safeDiscount,
      tax: safeTax,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      transactionId: 'TXN_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      prescriptionId,
      prescriptionRequired: hasRxItems,
      prescriptionVerified: !hasRxItems || prescription.status === 'Verified by Pharmacist',
      status: 'Order Placed',
      stageIndex: 0,
      timeline,
      pharmacy: {
        name: matchedPharmacy.name,
        address: matchedPharmacy.address,
        licenseNumber: matchedPharmacy.licenseNumber,
        phone: matchedPharmacy.phone,
        lat: matchedPharmacy.lat,
        lng: matchedPharmacy.lng
      },
      deliveryPartner: null,
      estimatedDeliveryMinutes: etaMinutes,
      estimatedDeliveryLabel: matchedPharmacy.isDemoFulfillment ? '2–5 business days' : `${etaMinutes} minutes`,
      estimatedArrivalTime,
      deliveryConfirmationOtp: String(Math.floor(1000 + Math.random() * 9000)),
      deliveredAt: null,
      rating: null,
      feedback: null,
      notes
    };

    const savedOrder = dbStore.insert('orders', newOrder);
    for (const item of canonicalItems) {
      const medicine = inventory.find((m) => m._id === item._id);
      dbStore.updateOne('medicines', (m) => m._id === item._id, {
        stock: Number(medicine.stock) - item.quantity,
        inStock: Number(medicine.stock) - item.quantity > 0
      });
    }

    // Notify connected sockets via global io if attached to app
    const io = req.app.get('io');
    if (io) {
      io.emit('new_order_placed', savedOrder);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Tracking initiated.',
      order: savedOrder
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get order by Order ID or internal _id
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const order = dbStore.findOne('orders', (o) => o.orderId === id || o._id === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get user orders or all orders
router.get('/', (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return requireAdmin(req, res, () => listOrders(req, res));
    return listOrders(req, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const listOrders = (req, res) => {
  try {
    const { userId } = req.query;
    let orders = dbStore.get('orders');

    if (userId) {
      orders = orders.filter((o) => o.userId === userId);
    }

    // Sort by newest first
    orders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Advance an order to the next fulfillment stage.
router.post('/:id/advance-stage', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { targetStageIndex } = req.body;

    const order = dbStore.findOne('orders', (o) => o.orderId === id || o._id === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (targetStageIndex !== undefined && !Number.isInteger(targetStageIndex)) {
      return res.status(400).json({ success: false, message: 'Target stage must be a whole number.' });
    }

    const nextIndex = typeof targetStageIndex === 'number'
      ? Math.max(0, Math.min(targetStageIndex, ORDER_STAGES.length - 2))
      : Math.min(order.stageIndex + 1, ORDER_STAGES.length - 2); // Do not jump to delivered without confirmation
    if (order.status === 'Successfully Delivered' || order.status === 'Cancelled' || nextIndex < order.stageIndex) {
      const message = order.status === 'Cancelled'
        ? 'A cancelled order cannot be advanced.'
        : order.status === 'Successfully Delivered'
          ? 'A delivered order cannot be changed.'
          : 'Order progress cannot be moved backwards.';
      return res.status(409).json({ success: false, message });
    }

    const stageInfo = ORDER_STAGES[nextIndex];
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedTimeline = order.timeline.map((step, idx) => {
      if (idx <= nextIndex) {
        return {
          ...step,
          completed: true,
          timestamp: step.timestamp || currentTime
        };
      }
      return step;
    });

    const updatedOrder = dbStore.updateOne('orders', (o) => o.orderId === order.orderId, {
      stageIndex: nextIndex,
      status: stageInfo.status,
      timeline: updatedTimeline
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`order_${order.orderId}`).emit('order_updated', updatedOrder);
    }

    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Cancel an active order and release its reserved stock back to the catalog.
router.post('/:id/cancel', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const order = dbStore.findOne('orders', (item) => item.orderId === id || item._id === id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (['Successfully Delivered', 'Cancelled'].includes(order.status)) {
      return res.status(409).json({ success: false, message: `This order is already ${order.status.toLowerCase()}.` });
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
    const cancellationReason = String(req.body?.reason || 'Cancelled by website administrator').trim().slice(0, 250);
    const updatedOrder = dbStore.updateOne('orders', (item) => item.orderId === order.orderId, {
      status: 'Cancelled',
      cancelledAt: timestamp,
      cancelledBy: req.adminUser._id,
      cancellationReason,
      paymentStatus: order.paymentStatus === 'Paid' ? 'Refund Pending' : order.paymentStatus,
      timeline: [...(order.timeline || []), {
        status: 'Cancelled',
        description: cancellationReason,
        icon: 'X',
        completed: true,
        timestamp: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]
    });

    const io = req.app.get('io');
    if (io) io.to(`order_${order.orderId}`).emit('order_updated', updatedOrder);
    res.json({ success: true, message: 'Order cancelled and reserved stock returned to inventory.', order: updatedOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Authorized Delivery Confirmation Action
router.post('/:id/deliver', (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    const order = dbStore.findOne('orders', (o) => o.orderId === id || o._id === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.status === 'Successfully Delivered') {
      return res.status(409).json({ success: false, message: 'This order has already been delivered.' });
    }
    if (order.status === 'Cancelled') {
      return res.status(409).json({ success: false, message: 'A cancelled order cannot be delivered.' });
    }
    if (order.stageIndex < ORDER_STAGES.length - 2) {
      return res.status(409).json({ success: false, message: 'Advance the order to Out for Delivery before confirming handover.' });
    }

    // Verify the customer handover code.
    if (!otp || !order.deliveryConfirmationOtp || otp.toString().trim() !== order.deliveryConfirmationOtp.toString().trim()) {
      return res.status(400).json({
        success: false,
        message: 'A valid delivery handover OTP is required.'
      });
    }

    const finalIdx = ORDER_STAGES.length - 1;
    const deliveryTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fullDeliveredTimestamp = new Date().toISOString();

    const deliveredTimeline = order.timeline.map((step) => ({
      ...step,
      completed: true,
      timestamp: step.timestamp || deliveryTime
    }));

    const finalOrder = dbStore.updateOne('orders', (o) => o.orderId === order.orderId, {
      stageIndex: finalIdx,
      status: 'Successfully Delivered',
      timeline: deliveredTimeline,
      deliveredAt: fullDeliveredTimestamp,
      deliveryOtpVerified: true,
      paymentStatus: 'Paid'
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`order_${order.orderId}`).emit('order_delivered', finalOrder);
    }

    res.json({
      success: true,
      message: 'Your Medicines Have Been Delivered! Thank you for choosing Med in Minutes.',
      order: finalOrder
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Submit Delivery Rating & Feedback
router.post('/:id/feedback', (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, tags = [] } = req.body;

    const order = dbStore.findOne('orders', (o) => o.orderId === id || o._id === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const updatedOrder = dbStore.updateOne('orders', (o) => o.orderId === order.orderId, {
      rating: Number(rating) || 5,
      feedback: {
        comment: comment || 'Smooth and rapid delivery experience.',
        tags,
        submittedAt: new Date().toISOString()
      }
    });

    res.json({
      success: true,
      message: 'Thank you for your feedback! It helps us maintain our 10-minute delivery excellence.',
      order: updatedOrder
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Reorder eligible items
router.post('/:id/reorder', (req, res) => {
  try {
    const { id } = req.params;
    const order = dbStore.findOne('orders', (o) => o.orderId === id || o._id === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.json({
      success: true,
      message: 'Eligible items retrieved for reorder.',
      items: order.items,
      deliveryAddress: order.deliveryAddress
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Download/View Order Invoice
router.get('/:id/invoice', (req, res) => {
  try {
    const { id } = req.params;
    const order = dbStore.findOne('orders', (o) => o.orderId === id || o._id === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const invoiceData = {
      invoiceNumber: order.invoiceNumber || `INV-${order.orderId}`,
      invoiceDate: new Date(order.createdAt).toLocaleDateString(),
      orderId: order.orderId,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress.fullAddress,
      pharmacyName: order.pharmacy.name,
      pharmacyLicense: order.pharmacy.licenseNumber,
      pharmacyGstin: '07AABCM9988C1Z2',
      items: order.items.map((it, idx) => ({
        sno: idx + 1,
        name: it.name,
        packSize: it.packSize || '1 Strip',
        batchNumber: 'BT' + Math.floor(10000 + Math.random() * 90000),
        expiryDate: '12/2027',
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

    res.json({ success: true, invoice: invoiceData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
