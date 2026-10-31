import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  genericName: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  discountPercent: { type: Number, default: 0 },
  stock: { type: Number, default: 100 },
  dosage: { type: String, default: '' },
  packSize: { type: String, default: '1 Strip' },
  prescriptionRequired: { type: Boolean, default: false },
  description: { type: String, default: '' },
  manufacturer: { type: String, default: '' },
  image: { type: String, default: '' },
  rating: { type: Number, default: 4.8 },
  ratingCount: { type: Number, default: 100 },
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

export const Medicine = mongoose.models.Medicine || mongoose.model('Medicine', medicineSchema);
