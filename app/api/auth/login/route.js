import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbStore } from '@/lib/db';
import { createToken } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    let user = dbStore.findOne('users', (u) => String(u.email).toLowerCase() === String(email).toLowerCase());
    let isMatch = false;

    if (user && user.password) {
      isMatch = await bcrypt.compare(password, user.password);
    }

    // If local credentials didn't match, verify directly against Supabase Auth
    if (!isMatch) {
      try {
        const { data: suData, error: suErr } = await supabase.auth.signInWithPassword({ 
          email: String(email).trim(), 
          password 
        });

        if (!suErr && suData?.user) {
          const suUser = suData.user;
          const isAdmin = 
            suUser.email?.toLowerCase() === 'admin@example.com' ||
            suUser.email?.toLowerCase() === 'divishbansal77@gmail.com' ||
            suUser.user_metadata?.role === 'admin' ||
            suUser.app_metadata?.role === 'admin';
          const role = isAdmin ? 'admin' : (suUser.user_metadata?.role || 'buyer');

          if (!user) {
            user = dbStore.insert('users', {
              _id: suUser.id,
              name: suUser.user_metadata?.full_name || suUser.email.split('@')[0],
              email: suUser.email,
              phone: suUser.user_metadata?.phone || '',
              role,
              addresses: []
            });
          }

          const token = suData.session?.access_token || createToken(user);

          return NextResponse.json({
            success: true,
            message: 'Logged in successfully via Supabase',
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone || '',
              role: user.role || role,
              addresses: user.addresses || []
            }
          });
        }
      } catch {
        // Fallback to error response below
      }
    }

    if (!isMatch || !user) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }

    const token = createToken(user);

    return NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      token,
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

