import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema({
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 100 },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  distanceKm: { type: Number, default: 1.0 },
  isOpen: { type: Boolean, default: true },
  expressAvailable: { type: Boolean, default: true },
  etaMinutes: { type: Number, default: 10 },
  phone: { type: String, default: '' }
}, { timestamps: true });

export const Pharmacy = mongoose.models.Pharmacy || mongoose.model('Pharmacy', pharmacySchema);
