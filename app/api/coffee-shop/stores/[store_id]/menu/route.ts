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

    const coffeeShopMenu = await query(
      `SELECT m.store_id, m.item_name, i.ingredient_name, m.price 
        FROM item m 
        LEFT JOIN ingredient i ON i.item_name = m.item_name AND i.store_id = m.store_id
        WHERE m.store_id = ?
        ORDER BY m.item_name, i.amount_used DESC`,
      [store_id]
    );
    console.log('coffeeShopMenu in api', coffeeShopMenu);

    if (coffeeShopMenu.length === 0) {
      return NextResponse.json(
        { message: 'coffeeShopMenu not found' },
        { status: 404 }
      );
    }

    const grouped = coffeeShopMenu.reduce((acc: unknown, row: unknown) => {
      const key = row.item_name;
      if (!acc[key]) {
        acc[key] = {
          store_id: row.store_id,
          item_name: row.item_name,
          price: row.price,
          ingredients: [],
        };
      }

      if (row.ingredient_name) {
        acc[key].ingredients.push(row.ingredient_name);
      }
      return acc;
    }, {});
    const result: unknown = Object.values(grouped);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coffeeShop menu' },
      { status: 500 }
    );
  }
}
