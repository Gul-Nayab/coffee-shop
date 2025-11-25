import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ store_id: string }> }
) {
  try {
    const { store_id } = await params;
    if (!store_id) {
      return NextResponse.json(
        { error: 'store_id is required' },
        { status: 400 }
      );
    }

    const inventory = await query(
      'SELECT *  FROM ingredient WHERE store_id = ?',
      [store_id]
    );
    if (inventory.length === 0) {
      return NextResponse.json(
        { message: 'ingredients not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(inventory);
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory ' },
      { status: 500 }
    );
  }
}
