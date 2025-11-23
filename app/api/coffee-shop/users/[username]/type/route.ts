import { NextRequest, NextResponse } from 'next/server';
import { query, getConnection } from '@/app/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    console.log('username: ', username);
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const user = await query(
      `SELECT u.username, u.password, u.name, e.employee_id, e.hours, e.store_id, e.is_manager, e.salary, c.phone_number, c.student_id
      FROM user u 
      LEFT JOIN employee e ON e.username = u.username
      LEFT JOIN customer c ON c.username = u.username
      WHERE u.username = ?`,
      [username]
    );
    console.log(user);
    if (user.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user[0], { status: 200 }); // Return the found user with subclass columns included
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user ' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const body = await request.json();
  const { newInfo } = body;

  if (!username || !newInfo) {
    return NextResponse.json(
      { error: 'newInfo and username is required' },
      { status: 400 }
    );
  }

  const connection = await getConnection();
  try {
    // await connection.beginTransaction();
    // await connection.commit();
    return NextResponse.json({ message: 'Information edited!' });
  } catch (error: unknown) {
    await connection.rollback();
    console.error('Transaction failed:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to edit user info' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
