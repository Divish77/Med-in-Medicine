import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { dbStore } from './services/store.js';
import { seedMedicinesList, seedPharmaciesList } from './seed/seedData.js';
import { setupSocketIO } from './services/socketService.js';

import authRoutes from './routes/authRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';
import pharmacyRoutes from './routes/pharmacyRoutes.js';
import serviceabilityRoutes from './routes/serviceabilityRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.set('io', io);
setupSocketIO(io);

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static directory for prescription uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Seed persistent store with initial verified data if empty
dbStore.seedInitialData(seedMedicinesList, seedPharmaciesList);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Med in Minutes Backend API',
    timestamp: new Date().toISOString(),
    express10MinService: 'Active',
    medicinesLoaded: dbStore.get('medicines').length,
    pharmaciesLoaded: dbStore.get('pharmacies').length
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/pharmacies', pharmacyRoutes);
app.use('/api/serviceability', serviceabilityRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

// Start Server & Connect Database
server.listen(PORT, async () => {
  console.log(`\n=================================================`);
  console.log(`🚀 Med in Minutes Backend Server is running on port ${PORT}`);
  console.log(`⚡ 10-Minute Express Medicine Delivery Network Ready`);
  console.log(`🌐 API Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`=================================================\n`);
  
  await connectDB();
});

export default app;
