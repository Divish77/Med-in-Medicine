import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbStore } from '../services/store.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'med_in_minutes_secret_key_2026';

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existingUser = dbStore.findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultAddresses = [
      {
        id: 'addr_default_1',
        label: 'Home',
        street: 'Flat 402, Green Avenue, Connaught Place',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
        landmark: 'Near Central Park Gate 2',
        fullAddress: 'Flat 402, Green Avenue, Near Central Park Gate 2, Connaught Place, New Delhi - 110001',
        lat: 28.6315,
        lng: 77.2167,
        isDefault: true
      },
      {
        id: 'addr_default_2',
        label: 'Work',
        street: 'Cyber Tower 4, Barakhamba Road',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
        landmark: 'Opposite Metro Gate 3',
        fullAddress: 'Cyber Tower 4, Barakhamba Road, Connaught Place, New Delhi - 110001',
        lat: 28.6300,
        lng: 77.2250,
        isDefault: false
      }
    ];

    const newUser = dbStore.insert('users', {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '+91 98765 43210',
      addresses: defaultAddresses
    });

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        addresses: newUser.addresses
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = dbStore.findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses || []
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Get Current User Profile
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = dbStore.findOne('users', (u) => u._id === decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses || []
      }
    });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

// Save or Update Address
router.post('/addresses', (req, res) => {
  try {
    const { userId, address } = req.body;
    const user = dbStore.findOne('users', (u) => u._id === userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const addresses = user.addresses ? [...user.addresses] : [];
    const addressId = address.id || 'addr_' + Date.now();

    const formattedAddress = {
      id: addressId,
      label: address.label || 'Home',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      landmark: address.landmark || '',
      fullAddress: address.fullAddress || `${address.street}, ${address.landmark ? address.landmark + ', ' : ''}${address.city} - ${address.pincode}`,
      lat: address.lat || 28.6139,
      lng: address.lng || 77.2090,
      isDefault: address.isDefault || addresses.length === 0
    };

    if (formattedAddress.isDefault) {
      addresses.forEach((a) => (a.isDefault = false));
    }

    const existingIdx = addresses.findIndex((a) => a.id === addressId);
    if (existingIdx !== -1) {
      addresses[existingIdx] = formattedAddress;
    } else {
      addresses.push(formattedAddress);
    }

    const updatedUser = dbStore.updateOne('users', (u) => u._id === userId, { addresses });
    res.json({ success: true, addresses: updatedUser.addresses, message: 'Address saved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete Address
router.delete('/addresses/:userId/:addressId', (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const user = dbStore.findOne('users', (u) => u._id === userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const addresses = (user.addresses || []).filter((a) => a.id !== addressId);
    if (addresses.length > 0 && !addresses.some((a) => a.isDefault)) {
      addresses[0].isDefault = true;
    }

    const updatedUser = dbStore.updateOne('users', (u) => u._id === userId, { addresses });
    res.json({ success: true, addresses: updatedUser.addresses, message: 'Address removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
