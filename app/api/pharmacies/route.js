import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';

export async function GET() {
  try {
    const pharmacies = dbStore.get('pharmacies');
    return NextResponse.json({ success: true, count: pharmacies.length, pharmacies });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
