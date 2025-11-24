import { NextRequest, NextResponse } from 'next/server';
import { query, getConnection } from '@/app/lib/db';

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
      `SELECT o.pk_order_id, o.username, o.store_id, o.item_name, o.order_total, 
      o.quantity, o.order_id, c.name FROM orders o 
      LEFT OUTER JOIN coffeeshop c ON c.store_id = o.store_id WHERE username = ?`,
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const body = await request.json();
  const { items, type } = body;

  if (!username || !items || items.length === 0) {
    return NextResponse.json(
      { error: 'username and items are required' },
      { status: 400 }
    );
  }

  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    const orderId = Math.floor(10000 + Math.random() * 90000);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      const orderTotal = (
        parseFloat(item.price) *
        (item.quantity ?? 1) *
        (type === 'student' ? 0.9 : 1)
      ).toFixed(2);

      await connection.query(
        `INSERT INTO orders 
         (order_id, username, store_id, item_name, order_total, completed, quantity)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          username,
          item.store_id,
          item.item_name,
          orderTotal,
          0,
          item.quantity ?? 1,
        ]
      );
    }

    await connection.commit();

    return NextResponse.json({
      message: 'Order placed successfully!',
      order_id: orderId,
    });
  } catch (error: any) {
    await connection.rollback();
    console.error('Transaction failed:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
