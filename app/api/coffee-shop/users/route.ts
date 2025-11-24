import { NextRequest, NextResponse } from 'next/server';
import { getConnection, query } from '@/app/lib/db';

export async function GET() {
  try {
    const users = await query('SELECT * FROM user');
    return NextResponse.json(users);
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userType, username, password, name, kwargs } = body;

  if (!userType || !username || !password || !name) {
    return NextResponse.json(
      { error: 'userType, username, password, and name are required' },
      { status: 400 }
    );
  }

  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      `INSERT INTO user (username, password, name)
      VALUES (?, ?, ?)`,
      [username, password, name]
    );

    if (userType === 'customer') {
      await connection.query(
        `INSERT INTO customer (username, phone_number, student_id)
      VALUES (?, ?, ?)`,
        [username, kwargs.customer.phone_number, kwargs.customer.student_id]
      );
    } else {
      await connection.query(
        `INSERT INTO employee (username, e_id, hours, store_id, salary, is_manager)
      VALUES (?, ?, ?, ?, ?, ?)`,
        [
          username,
          kwargs.employee.employee_id,
          kwargs.employee.hours,
          kwargs.employee.store_id,
          kwargs.employee.salary,
          kwargs.employee.is_manager,
        ]
      );
    }

    await connection.commit();
    return NextResponse.json({
      message: 'New user successfully created',
      username,
    });
  } catch (err: any) {
    await connection.rollback();
    console.error('Transaction failed:', err);
    return NextResponse.json(
      { error: err.message || 'Transaction failed' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
