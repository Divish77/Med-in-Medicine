import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, default: '' },
  pincode: { type: String, required: true },
  landmark: { type: String, default: '' },
  fullAddress: { type: String, required: true },
  lat: { type: Number, default: 28.6139 },
  lng: { type: Number, default: 77.2090 },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '+91 98765 43210' },
  addresses: [addressSchema],
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
