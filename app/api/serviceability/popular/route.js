import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';

export async function GET() {
  try {
    const list = dbStore.get('serviceablePincodes');
    return NextResponse.json({ success: true, count: list.length, locations: list });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

