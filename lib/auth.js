import jwt from 'jsonwebtoken';
import { dbStore } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'med_in_minutes_secret_key_2026';

export const verifyAdmin = (request) => {
  try {
    const authHeader = request.headers.get('authorization') || '';
    if (!authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = dbStore.findOne('users', (u) => u._id === decoded.id && u.role === 'admin');
    return admin || null;
  } catch {
    return null;
  }
};

export const verifyUser = (request) => {
  try {
    const authHeader = request.headers.get('authorization') || '';
    if (!authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = dbStore.findOne('users', (u) => u._id === decoded.id);
    return user || null;
  } catch {
    return null;
  }
};

export const createToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email, role: user.role || 'buyer' }, JWT_SECRET, { expiresIn: '7d' });
};
