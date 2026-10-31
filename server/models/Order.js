import mongoose from 'mongoose';
import { randomInt } from 'crypto';

const orderItemSchema = new mongoose.Schema({
  medicineId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  packSize: { type: String },
  prescriptionRequired: { type: Boolean, default: false },
  image: { type: String }
});

const timelineEventSchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  icon: { type: String }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  deliveryAddress: {
    label: { type: String, default: 'Home' },
    fullAddress: { type: String, required: true },
    pincode: { type: String, required: true },
    street: { type: String },
    city: { type: String },
    lat: { type: Number },
    lng: { type: Number }
  },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'Cash on Delivery' },
  paymentStatus: { type: String, default: 'Pending' },
  transactionId: { type: String, default: '' },
  prescriptionId: { type: String, default: null },
  prescriptionRequired: { type: Boolean, default: false },
  prescriptionVerified: { type: Boolean, default: false },
  status: {
    type: String,
    enum: [
      'Order Placed',
      'Prescription Verification',
      'Order Accepted by Pharmacy',
      'Medicines Being Packed',
      'Delivery Partner Assigned',
      'Out for Delivery',
      'Successfully Delivered',
      'Cancelled'
    ],
    default: 'Order Placed'
  },
  stageIndex: { type: Number, default: 0 },
  timeline: [timelineEventSchema],
  pharmacy: {
    name: { type: String, default: 'Apollo Pharmacy Express' },
    address: { type: String, default: 'Inner Circle, Connaught Place' },
    licenseNumber: { type: String, default: 'DL-SW-2023-9941A' },
    phone: { type: String, default: '+91 11 2341 5501' }
  },
  deliveryPartner: {
    name: { type: String, default: 'Rahul Sharma' },
    phone: { type: String, default: '+91 98112 34567' },
    vehicleNumber: { type: String, default: 'DL 01 EV 4421' },
    rating: { type: Number, default: 4.95 },
    deliveriesCount: { type: Number, default: 1840 },
    currentLat: { type: Number, default: 28.6315 },
    currentLng: { type: Number, default: 77.2167 },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }
  },
  estimatedDeliveryMinutes: { type: Number, default: 10 },
  estimatedArrivalTime: { type: String },
  deliveryConfirmationOtp: { type: String, default: () => String(randomInt(1000, 10000)) },
  deliveredAt: { type: String, default: null },
  invoiceNumber: { type: String },
  rating: { type: Number, default: null },
  feedback: {
    comment: { type: String, default: '' },
    tags: [{ type: String }],
    submittedAt: { type: String }
  }
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
