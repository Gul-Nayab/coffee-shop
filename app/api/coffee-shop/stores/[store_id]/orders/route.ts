import { NextRequest, NextResponse } from 'next/server';
import { query, getConnection } from '@/app/lib/db';

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

    const orders = await query(
      `SELECT pk_order_id, store_id, item_name, completed, order_id, quantity, username
       FROM orders WHERE store_id = ? AND completed = FALSE`,
      [store_id]
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ store_id: string }> }
) {
  const { store_id } = await params;
  const body = await request.json();
  const { pk_order_id } = body;

  if (!store_id || !pk_order_id) {
    return NextResponse.json(
      { error: 'store_id and pk_order_id are required' },
      { status: 400 }
    );
  }

  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    const [updateResult] = await connection.query(
      `UPDATE orders
       SET completed=true
       WHERE store_id = ? AND pk_order_id = ?`,
      [store_id, pk_order_id]
    );

    if (updateResult.affectedRows === 0) {
      throw new Error('Order not found in inventory');
    }
    await connection.commit();

    return NextResponse.json({
      message: 'Order Status updated successfully',
    });
  } catch (err: any) {
    await connection.rollback();
    console.error('Transaction failed:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to updated inventory' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
