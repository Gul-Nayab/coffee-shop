import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    if (!username) {
      return NextResponse.json(
        { error: 'username is required' },
        { status: 400 }
      );
    }

    const orders = await query(
      `SELECT o.username, o.store_id, o.item_name, o.order_total, c.name FROM orders o 
      LEFT OUTER JOIN coffee_shop c ON c.store_id = o.store_id WHERE username = ?`,
      [username]
    );
    if (orders.length === 0) {
      return NextResponse.json(
        { message: 'orders not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(orders);
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders ' },
      { status: 500 }
    );
  }
}
