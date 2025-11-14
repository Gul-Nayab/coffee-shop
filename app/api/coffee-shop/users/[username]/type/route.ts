import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

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
      `SELECT * FROM user u 
      LEFT OUTER JOIN employee e ON e.username = u.username
      LEFT OUTER JOIN manager m ON m.employee_id = e.employee_id
      LEFT OUTER JOIN customer c ON c.username = u.username
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
