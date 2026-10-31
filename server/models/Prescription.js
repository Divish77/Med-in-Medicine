import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  patientName: { type: String, default: '' },
  doctorName: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Uploaded', 'Verified by Pharmacist', 'Action Required', 'Rejected'],
    default: 'Verified by Pharmacist'
  },
  pharmacistNotes: { type: String, default: 'Prescription reviewed and verified by Chief Pharmacist.' },
  verifiedBy: { type: String, default: 'Dr. Neha Kapoor (Reg: PH-98214)' },
  verifiedAt: { type: String }
}, { timestamps: true });

export const Prescription = mongoose.models.Prescription || mongoose.model('Prescription', prescriptionSchema);
