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
      `SELECT store_id, item_name, COUNT(item_name) AS item_count, SUM(order_total) as earnings
      FROM orders WHERE store_id = ? AND completed = TRUE 
      GROUP BY item_name ORDER BY earnings DESC`,
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
  const { budget } = body;

  if (!budget || !store_id) {
    return NextResponse.json(
      { error: 'budget or store_id not provided, no change implemented' },
      { status: 400 }
    );
  }

  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      `UPDATE coffeeshop SET budget = ? 
      WHERE store_id = ?`,
      [budget, store_id]
    );

    await connection.commit();

    return NextResponse.json({
      message: 'Inventory updated successfully',
      budget: budget,
    });
  } catch (err: any) {
    await connection.rollback();
    console.error('Transaction failed:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to update budget' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
