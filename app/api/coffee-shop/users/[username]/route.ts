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
      'SELECT username, password FROM user WHERE username = ?',
      [username]
    );
    console.log('user in api', user);
    if (user.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user[0]); // Return the found user
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
  const { newPassword } = body;

  if (!username || !newPassword) {
    return NextResponse.json(
      { error: 'newPassword and username is required' },
      { status: 400 }
    );
  }

  const connection = await getConnection();
  try {
    await connection.beginTransaction();
    const hashedPassword = Buffer.from(newPassword).toString('base64');

    const result = await connection.query(
      `update User
      set password = ?
      where username = ?`,
      [hashedPassword, username]
    );
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: `No user found with username '${username}'` },
        { status: 404 }
      );
    }
    await connection.commit();
    return NextResponse.json({ message: 'Password changed!' });
  } catch (error: unknown) {
    await connection.rollback();
    console.error('Transaction failed:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to change password' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }
    const result = await query(`delete from user where username = ?`, [
      username,
    ]);
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: `No user found with username '${username}'` },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user ' },
      { status: 500 }
    );
  }
}
