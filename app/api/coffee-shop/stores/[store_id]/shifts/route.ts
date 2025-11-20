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
      `SELECT s.shift_id, s.employee_id, u.name, s.start_time, s.end_time, s.date
       FROM shifts s
       LEFT OUTER JOIN employee e ON s.employee_id = e.employee_id
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
