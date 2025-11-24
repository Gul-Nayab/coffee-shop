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

    const shifts = await query(
      `SELECT s.shift_id, s.e_id, u.name, s.start_time, s.end_time, s.date
       FROM shifts s
       LEFT OUTER JOIN employee e ON s.e_id = e.e_id
       LEFT OUTER JOIN user u ON u.username = e.username
       WHERE s.store_id = ?
       ORDER BY s.date, s.start_time`,
      [store_id]
    );
    if (shifts.length === 0) {
      return NextResponse.json(
        { message: 'shifts not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(shifts);
  } catch (error: unknown) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shifts ' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ store_id: string }> }
) {
  const { store_id } = await params;
  const body = await request.json();
  const { employee_id, date, start_time, end_time } = body;

  if (!store_id || !employee_id || !date || !start_time || !end_time) {
    return NextResponse.json(
      {
        error:
          'store_id, employee_id, date, start_time, and end_time are required',
      },
      { status: 400 }
    );
  }

  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    // create new shift
    await connection.query(
      `INSERT INTO shifts (e_id, start_time, end_time, date, store_id)
       VALUES (?, ?, ?, ?, ?)`,
      [employee_id, start_time, end_time, date, store_id]
    );

    //compute hours to add for employee
    const [start_hours, start_min] = start_time.split(':').map(Number);
    const [end_hours, end_min] = end_time.split(':').map(Number);
    const shiftHours =
      end_hours + end_min / 60 - (start_hours + start_min / 60);

    //update hours
    await connection.query(
      `UPDATE employee
       SET hours = COALESCE(hours, 0) + ?
       WHERE e_id = ? AND store_id = ?`,
      [shiftHours, employee_id, store_id]
    );

    await connection.commit();

    return NextResponse.json({
      message: 'Shift assigned and employee hours updated successfully.',
    });
  } catch (error: any) {
    await connection.rollback();
    console.error('Transaction failed:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create shift' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
