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

    //get order details
    const [orderRows]: any = await connection.query(
      `SELECT item_name, quantity 
       FROM orders 
       WHERE pk_order_id = ? AND store_id = ?`,
      [pk_order_id, store_id]
    );

    if (orderRows.length === 0) {
      throw new Error('Order not found');
    }

    const itemName = orderRows[0].item_name;
    const quantity = orderRows[0].quantity ?? 1;

    //get ingredients for this item
    const [ingredients]: any = await connection.query(
      `SELECT ingredient_name, amount_used
   FROM ingredient
   WHERE item_name = ?`,
      [itemName]
    );

    if (ingredients.length === 0) {
      console.log(`Food item: ${itemName} has no ingredients.`);
    } else {
      //validate inventory
      for (const ing of ingredients) {
        const [inv]: any = await connection.query(
          `SELECT count FROM inventory
       WHERE store_id = ? AND ingredient_name = ?`,
          [store_id, ing.ingredient_name]
        );

        if (inv.length === 0) {
          throw new Error(`Missing ingredient: ${ing.ingredient_name}`);
        }

        const available = inv[0].count;
        const required = (ing.amount_used ?? 0.01) * quantity;

        if (available < required) {
          throw new Error(
            `Not enough ${ing.ingredient_name}. Required: ${required.toFixed(
              4
            )}, Available: ${available}`
          );
        }
      }

      //deduct inventory
      for (const ing of ingredients) {
        await connection.query(
          `UPDATE inventory
       SET count = count - ((?) * (ing.amount_used ?? 0.01))
       WHERE store_id = ? AND ingredient_name = ?`,
          [quantity, store_id, ing.ingredient_name]
        );
      }
    }

    //update order status
    const [updateOrder]: any = await connection.query(
      `UPDATE orders
       SET completed = true
       WHERE store_id = ? AND pk_order_id = ?`,
      [store_id, pk_order_id]
    );

    if (updateOrder.affectedRows === 0) {
      throw new Error('Order update failed');
    }

    await connection.commit();

    return NextResponse.json({
      message: 'Order completed & inventory updated successfully',
    });
  } catch (err: any) {
    await connection.rollback();
    console.error('Transaction failed:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to update inventory' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
