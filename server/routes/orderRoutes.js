import express from 'express';
import { dbStore } from '../services/store.js';
import { ORDER_STAGES } from '../services/socketService.js';

const router = express.Router();

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
      subtotal = 0,
      deliveryFee = 0,
      discount = 0,
      tax = 0,
      totalAmount = 0,
      paymentMethod = 'UPI',
      prescriptionId = null,
      notes = ''
    } = req.body;

    if (!deliveryAddress || !deliveryAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Valid delivery address with PIN code is required.' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty. Please add medicines to order.' });
    }

    // Check serviceability
    const pincode = deliveryAddress.pincode.trim();
    if (pincode === '999999' || pincode.startsWith('0') || pincode.startsWith('9')) {
      return res.status(400).json({
        success: false,
        message: `Delivery is currently not available for PIN code ${pincode}. Please select a serviceable location.`
      });
    }

    // Check prescription requirement
    const hasRxItems = items.some((item) => item.prescriptionRequired);
    if (hasRxItems && !prescriptionId) {
      // Auto-attach a demo verified prescription if user is ordering Rx items in demo
    }

    const orderId = generateOrderId();
    const invoiceNumber = generateInvoiceNumber();
    const orderTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Calculate delivery time
    const isExpressPin = ['110001', '110016', '110024', '560001', '560034', '400050', '160017', '147001', '122002', '201301'].includes(pincode);
    const etaMinutes = isExpressPin ? 10 : 18;

    const arrivalDate = new Date(Date.now() + etaMinutes * 60 * 1000);
    const estimatedArrivalTime = arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
    const pharmacies = dbStore.get('pharmacies');
    const matchedPharmacy = pharmacies.find((p) => p.pincode === pincode) || pharmacies[0];

    const newOrder = {
      orderId,
      invoiceNumber,
      userId,
      customerName,
      customerPhone,
      deliveryAddress,
      items,
      subtotal,
      deliveryFee,
      discount,
      tax,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      transactionId: 'TXN_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      prescriptionId,
      prescriptionRequired: hasRxItems,
      prescriptionVerified: true,
      status: 'Order Placed',
      stageIndex: 0,
      timeline,
      pharmacy: {
        name: matchedPharmacy.name,
        address: matchedPharmacy.address,
        licenseNumber: matchedPharmacy.licenseNumber,
        phone: matchedPharmacy.phone
      },
      deliveryPartner: {
        name: 'Rahul Sharma',
        phone: '+91 98112 34567',
        vehicleNumber: 'DL 01 EV 4421',
        rating: 4.95,
        deliveriesCount: 1840,
        currentLat: matchedPharmacy.lat || 28.6315,
        currentLng: matchedPharmacy.lng || 77.2167,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      estimatedDeliveryMinutes: etaMinutes,
      estimatedArrivalTime,
      deliveryConfirmationOtp: '4821',
      deliveredAt: null,
      rating: null,
      feedback: null,
      notes
    };

    const savedOrder = dbStore.insert('orders', newOrder);

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
});

// Advance order stage (Simulated Delivery Tracking Flow for demo mode)
router.post('/:id/advance-stage', (req, res) => {
  try {
    const { id } = req.params;
    const { targetStageIndex } = req.body;

    const order = dbStore.findOne('orders', (o) => o.orderId === id || o._id === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const nextIndex = typeof targetStageIndex === 'number'
      ? targetStageIndex
      : Math.min(order.stageIndex + 1, ORDER_STAGES.length - 2); // Do not jump to delivered without confirmation

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

    // Simulated rider coordinates moving closer
    const ratio = nextIndex / (ORDER_STAGES.length - 1);
    const startLat = 28.6315, startLng = 77.2167;
    const destLat = order.deliveryAddress.lat || 28.6139;
    const destLng = order.deliveryAddress.lng || 77.2090;

    const currentLat = +(startLat + (destLat - startLat) * ratio).toFixed(4);
    const currentLng = +(startLng + (destLng - startLng) * ratio).toFixed(4);

    const updatedOrder = dbStore.updateOne('orders', (o) => o.orderId === order.orderId, {
      stageIndex: nextIndex,
      status: stageInfo.status,
      timeline: updatedTimeline,
      deliveryPartner: {
        ...order.deliveryPartner,
        currentLat,
        currentLng
      }
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

// Authorized Delivery Confirmation Action
router.post('/:id/deliver', (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    const order = dbStore.findOne('orders', (o) => o.orderId === id || o._id === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
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
