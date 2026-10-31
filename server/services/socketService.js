import { dbStore } from './store.js';

export const ORDER_STAGES = [
  { status: 'Order Placed', description: 'Order received and registered in Med in Minutes network.', icon: 'CheckCircle2' },
  { status: 'Payment Confirmed', description: 'Digital payment processed and confirmed securely.', icon: 'CreditCard' },
  { status: 'Prescription Verification', description: 'Licensed pharmacist verified prescription details.', icon: 'FileCheck' },
  { status: 'Order Accepted by Pharmacy', description: 'Partner pharmacy accepted order and allocated stock.', icon: 'Store' },
  { status: 'Medicines Being Packed', description: 'Medicines sealed in tamper-proof sterile delivery pouch.', icon: 'Package' },
  { status: 'Delivery Partner Assigned', description: 'Rider Rahul Sharma (DL 01 EV 4421) assigned & en route.', icon: 'Bike' },
  { status: 'Out for Delivery', description: 'Rider is on the way. Live GPS tracking active.', icon: 'Navigation' },
  { status: 'Successfully Delivered', description: 'Package handed over securely. OTP verified.', icon: 'Home' }
];

// Delivery route simulation points between pharmacy (Connaught Place 28.6315, 77.2167) and customer location (28.6139, 77.2090)
const ROUTE_WAYPOINTS = [
  { lat: 28.6315, lng: 77.2167, label: "Pharmacy Hub" },
  { lat: 28.6280, lng: 77.2145, label: "Janpath Intersection" },
  { lat: 28.6235, lng: 77.2120, label: "Tolstoy Marg" },
  { lat: 28.6185, lng: 77.2105, label: "Rajpath Avenue" },
  { lat: 28.6150, lng: 77.2095, label: "Turning into Customer Street" },
  { lat: 28.6139, lng: 77.2090, label: "Customer Doorstep" }
];

export const setupSocketIO = (io) => {
  io.on('connection', (socket) => {
    // Join an order tracking room
    socket.on('join_order', (orderId) => {
      socket.join(`order_${orderId}`);
      const order = dbStore.findOne('orders', (o) => o.orderId === orderId);
      if (order) {
        socket.emit('order_state', order);
      }
    });

    // Advance order to next stage or specific stage
    socket.on('advance_order_stage', ({ orderId, targetStageIndex }) => {
      const order = dbStore.findOne('orders', (o) => o.orderId === orderId);
      if (!order) return;

      const nextIndex = typeof targetStageIndex === 'number' 
        ? targetStageIndex 
        : Math.min(order.stageIndex + 1, ORDER_STAGES.length - 1);

      // Do not auto-deliver without explicit delivery confirmation if stage is last
      const isDelivered = nextIndex === ORDER_STAGES.length - 1;
      const stageInfo = ORDER_STAGES[nextIndex];

      // Update timeline
      const updatedTimeline = order.timeline.map((step, idx) => {
        if (idx <= nextIndex) {
          return {
            ...step,
            completed: true,
            timestamp: step.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
        return step;
      });

      // Update rider coordinate simulation
      const waypointIdx = Math.min(nextIndex, ROUTE_WAYPOINTS.length - 1);
      const riderCoord = ROUTE_WAYPOINTS[waypointIdx];

      const updatePayload = {
        stageIndex: nextIndex,
        status: stageInfo.status,
        timeline: updatedTimeline,
        'deliveryPartner.currentLat': riderCoord.lat,
        'deliveryPartner.currentLng': riderCoord.lng,
        deliveryPartner: {
          ...order.deliveryPartner,
          currentLat: riderCoord.lat,
          currentLng: riderCoord.lng
        }
      };

      if (isDelivered) {
        updatePayload.deliveredAt = new Date().toISOString();
      }

      const updatedOrder = dbStore.updateOne('orders', (o) => o.orderId === orderId, updatePayload);
      io.to(`order_${orderId}`).emit('order_updated', updatedOrder);
    });

    // Confirm delivery action (authorized confirmation)
    socket.on('confirm_delivery', ({ orderId, otp }) => {
      const order = dbStore.findOne('orders', (o) => o.orderId === orderId);
      if (!order) return;

      const lastIdx = ORDER_STAGES.length - 1;
      const deliveredTimeline = order.timeline.map((step) => ({
        ...step,
        completed: true,
        timestamp: step.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));

      const finalOrder = dbStore.updateOne('orders', (o) => o.orderId === orderId, {
        stageIndex: lastIdx,
        status: 'Successfully Delivered',
        timeline: deliveredTimeline,
        deliveredAt: new Date().toISOString(),
        deliveryOtpVerified: true
      });

      io.to(`order_${orderId}`).emit('order_delivered', finalOrder);
    });
  });
};
