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

    const coffeeShop = await query(
      'SELECT * FROM coffeeshop WHERE store_id = ?',
      [store_id]
    );
    console.log('coffeeShop in api', coffeeShop);
    if (coffeeShop.length === 0) {
      return NextResponse.json(
        { message: 'coffeeShop not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(coffeeShop[0]); // Return the found coffeeShop
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coffeeShop ' },
      { status: 500 }
    );
  }
}
