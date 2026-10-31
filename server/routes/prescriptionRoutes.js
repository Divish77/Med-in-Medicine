import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dbStore } from '../services/store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `rx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
    cb(allowed.has(file.mimetype) ? null : new Error('Upload a JPEG, PNG, WebP, or PDF file.'), allowed.has(file.mimetype));
  }
});

const router = express.Router();

// Upload prescription file
router.post('/upload', upload.single('prescription'), (req, res) => {
  try {
    const { userId, userName, patientName, doctorName } = req.body;
    if (!userId || !userName || !String(patientName || '').trim() || !String(doctorName || '').trim()) {
      return res.status(400).json({ success: false, message: 'Signed-in customer, patient name, and prescribing doctor are required.' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Select a prescription file to upload.' });
    }

    const fileName = path.basename(req.file.originalname);
    const fileUrl = `/uploads/${req.file.filename}`;

    const prescriptionRecord = dbStore.insert('prescriptions', {
      userId,
      userName,
      fileName,
      fileUrl,
      patientName: String(patientName).trim(),
      doctorName: String(doctorName).trim(),
      status: 'Pending Verification',
      pharmacistNotes: '',
      verifiedBy: '',
      verifiedAt: null
    });

    res.status(201).json({
      success: true,
      message: 'Prescription uploaded and is awaiting pharmacist review.',
      prescription: prescriptionRecord
    });
  } catch (err) {
    console.error('Prescription upload error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all prescriptions for authorized operations.
router.get('/', (req, res) => {
  try {
    const prescriptions = dbStore.get('prescriptions') || [];
    const sorted = [...prescriptions].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    res.json({ success: true, count: sorted.length, prescriptions: sorted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get user prescriptions
router.get('/user/:userId', (req, res) => {
  try {
    const prescriptions = dbStore.find('prescriptions', (p) => p.userId === req.params.userId);
    res.json({ success: true, count: prescriptions.length, prescriptions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const prescription = dbStore.findOne('prescriptions', (p) => p._id === req.params.id);
    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found.' });
    }
    res.json({ success: true, prescription });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verify / Reject Prescription (Pharmacist Action)
router.put('/:id/verify', (req, res) => {
  try {
    const { id } = req.params;
    const { status, pharmacistNotes, verifiedBy } = req.body;
    const allowedStatuses = new Set(['Verified by Pharmacist', 'Rejected']);
    if (!allowedStatuses.has(status)) {
      return res.status(400).json({ success: false, message: 'Status must be Verified by Pharmacist or Rejected.' });
    }

    const existing = dbStore.findOne('prescriptions', (p) => p._id === id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    const updated = dbStore.updateOne('prescriptions', (p) => p._id === id, {
      status,
      pharmacistNotes: pharmacistNotes || (status === 'Verified by Pharmacist' ? 'Approved for fulfillment' : 'Requires doctor clarification'),
      verifiedBy: String(verifiedBy || '').trim(),
      verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    res.json({ success: true, message: `Prescription marked as ${status}`, prescription: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
