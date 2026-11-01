import { NextResponse } from 'next/server';
import { medicineCategories } from '@/lib/seedData';

export async function GET() {
  return NextResponse.json({ success: true, categories: medicineCategories });
}

