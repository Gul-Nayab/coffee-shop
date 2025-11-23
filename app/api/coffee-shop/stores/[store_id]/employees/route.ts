import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ store_id: number }> }
) {
  try {
    const { store_id } = await params;

    if (!store_id) {
      return NextResponse.json(
        { error: 'Store ID is required' },
        { status: 400 }
      );
    }

    const employees = await query(
      `SELECT u.name, e.employee_id
      FROM employee e 
      LEFT JOIN user u ON u.username = e.username
      WHERE e.store_id = ? AND e.is_manager = false`,
      [store_id]
    );

    if (employees.length === 0) {
      return NextResponse.json(
        { message: 'employees not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(employees, { status: 200 }); // Return all employees
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user ' },
      { status: 500 }
    );
  }
}
