import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'Med in Minutes Next.js Full-Stack App',
    timestamp: new Date().toISOString(),
    medicinesLoaded: dbStore.count('medicines'),
    pharmaciesLoaded: dbStore.count('pharmacies'),
    ordersLoaded: dbStore.count('orders')
  });
}

