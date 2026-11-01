import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbStore } from '@/lib/db';
import { createToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, password, phone, role = 'buyer' } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: 'Name, email, and password are required' }, { status: 400 });
    }

    const existingUser = dbStore.findOne('users', (u) => String(u.email).toLowerCase() === String(email).toLowerCase());
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'An account with this email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = dbStore.insert('users', {
      name,
      email: String(email).toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      role,
      addresses: []
    });

    const token = createToken(newUser);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        addresses: newUser.addresses
      }
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
