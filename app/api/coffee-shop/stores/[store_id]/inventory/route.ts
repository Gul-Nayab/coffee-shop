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

    const inventory = await query(
      'SELECT *  FROM inventory WHERE store_id = ? ORDER BY store_id, ingredient_name',
      [store_id]
    );
    if (inventory.length === 0) {
      return NextResponse.json(
        { message: 'inventory not found' },
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ store_id: string }> }
) {
  const { store_id } = await params;
  const body = await request.json();
  const { ingredient_name, amount_to_add } = body;

  if (!store_id || !ingredient_name || !amount_to_add) {
    console.log(store_id, '|', ingredient_name, '|', amount_to_add, '|');
    return NextResponse.json(
      { error: 'store_id, ingredient_name, and amount_to_add are required' },
      { status: 400 }
    );
  }

  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    //get price per unit of ingredient
    const [ingredientRows]: any = await connection.query(
      `SELECT cost_of_ingredient_per_unit
       FROM ingredient
       WHERE store_id = ? AND ingredient_name = ?`,
      [store_id, ingredient_name]
    );

    if (ingredientRows.length === 0) {
      throw new Error('Ingredient not found');
    }

    const price_per_unit = ingredientRows[0].cost_of_ingredient_per_unit;
    const total_cost = price_per_unit * amount_to_add;

    // get budget of the store
    const [storeRows]: any = await connection.query(
      `SELECT budget FROM coffeeshop WHERE store_id = ?`,
      [store_id]
    );

    if (storeRows.length === 0) {
      throw new Error('Store not found');
    }

    const current_budget = storeRows[0].budget;
    if (current_budget < total_cost) {
      throw new Error('Insufficient budget');
    }

    // Update budget
    await connection.query(
      `UPDATE coffeeshop SET budget = budget - ? WHERE store_id = ?`,
      [total_cost, store_id]
    );

    // Update inventory
    const [updateResult]: any = await connection.query(
      `UPDATE inventory SET count = count + ?
       WHERE store_id = ? AND ingredient_name = ?`,
      [amount_to_add, store_id, ingredient_name]
    );

    if (updateResult.affectedRows === 0) {
      throw new Error('Ingredient not found in inventory');
    }
    await connection.commit();

    return NextResponse.json({
      message: 'Inventory updated successfully',
      ingredient_name,
      amount_added: amount_to_add,
      total_cost,
      new_budget: current_budget - total_cost,
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
