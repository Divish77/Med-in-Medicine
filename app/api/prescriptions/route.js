import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let prescriptions = dbStore.get('prescriptions') || [];
    if (userId) {
      prescriptions = prescriptions.filter((p) => p.userId === userId);
    }
    const sorted = [...prescriptions].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return NextResponse.json({ success: true, count: sorted.length, prescriptions: sorted });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

