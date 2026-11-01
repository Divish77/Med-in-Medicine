import jwt from 'jsonwebtoken';
import { dbStore } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'med_in_minutes_secret_key_2026';

export const verifyAdmin = (request) => {
  try {
    const authHeader = request.headers.get('authorization') || '';
    if (!authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7);

    // 1. Check if token is a Supabase Auth JWT token
    const decoded = jwt.decode(token);
    if (decoded) {
      const email = decoded.email || decoded.user_metadata?.email || '';
      const role = decoded.user_metadata?.role || decoded.app_metadata?.role || decoded.role || '';
      const isAdminEmail = 
        email.toLowerCase() === 'admin@example.com' || 
        email.toLowerCase() === 'divishbansal77@gmail.com' ||
        (process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase());

      if (role === 'admin' || isAdminEmail) {
        return {
          _id: decoded.sub || decoded.id || 'admin_supabase',
          email: email || 'admin@example.com',
          role: 'admin',
          name: decoded.user_metadata?.full_name || 'Website Administrator'
        };
      }
    }

    // 2. Check local JWT signature
    try {
      const localDecoded = jwt.verify(token, JWT_SECRET);
      const admin = dbStore.findOne('users', (u) => u._id === localDecoded.id && u.role === 'admin');
      if (admin) return admin;
      if (localDecoded.role === 'admin') {
        return {
          _id: localDecoded.id || 'admin_local',
          email: localDecoded.email || 'admin@example.com',
          role: 'admin',
          name: localDecoded.name || 'Website Administrator'
        };
      }
    } catch {
      // not a local signature
    }

    return null;
  } catch {
    return null;
  }
};

export const verifyUser = (request) => {
  try {
    const authHeader = request.headers.get('authorization') || '';
    if (!authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7);

    // 1. Check Supabase Auth JWT
    const decoded = jwt.decode(token);
    if (decoded && (decoded.email || decoded.sub)) {
      const email = decoded.email || decoded.user_metadata?.email || '';
      const existing = dbStore.findOne('users', (u) => u.email === email || u._id === decoded.sub);
      if (existing) return existing;
      return {
        _id: decoded.sub || decoded.id,
        email: email,
        name: decoded.user_metadata?.full_name || email.split('@')[0] || 'Customer',
        role: decoded.user_metadata?.role || 'buyer'
      };
    }

    // 2. Check local JWT
    try {
      const localDecoded = jwt.verify(token, JWT_SECRET);
      const user = dbStore.findOne('users', (u) => u._id === localDecoded.id);
      return user || localDecoded || null;
    } catch {
      return null;
    }
  } catch {
    return null;
  }
};

export const createToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email, role: user.role || 'buyer' }, JWT_SECRET, { expiresIn: '7d' });
};

