import { NextResponse } from 'next/server';
import { verifyUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = verifyUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role || 'buyer',
        addresses: user.addresses || []
      }
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

