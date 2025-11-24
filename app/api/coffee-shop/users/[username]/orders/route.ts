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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const body = await request.json();
  const { items } = body;

  if (!username || !items) {
    return NextResponse.json(
      {
        error:
          'store_id, employee_id, date, start_time, and end_time are required',
      },
      { status: 400 }
    );
  }

  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    const values = items.map((item) => [
      username,
      item.store_id,
      item.item_name,
      (parseFloat(item.price) * (item.quantity ?? 1)).toFixed(2),
      0,
    ]);

    await connection.query(
      `insert into orders (username, store_id, item_name, order_total, completed)
   VALUES ?`,
      [values]
    );

    await connection.commit();

    return NextResponse.json({
      message: 'Shift assigned and employee hours updated successfully.',
    });
  } catch (error: any) {
    await connection.rollback();
    console.error('Transaction failed:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create shift' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
