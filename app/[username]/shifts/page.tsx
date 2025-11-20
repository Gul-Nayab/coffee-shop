'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUser } from '../UserContext';
import axios from 'axios';

interface Shift {
  shift_id: number;
  employee_id: number;
  name: string;
  start_time: string;
  end_time: string;
  date: string;
}

function Shifts() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, username, userType, loading } = useUser();

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [filter, setFilter] = useState<string>('');

  async function getShifts(store_id: number) {
    try {
      const response = await axios.get(
        `/api/coffee-shop/stores/${store_id}/shifts`,
        { timeout: 5000 }
      );
      setShifts(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, router]);

  useEffect(() => {
    if (user?.store_id) getShifts(user.store_id);
  }, [user?.store_id]);

  const filteredShifts =
    userType === 'manager'
      ? filter
        ? shifts.filter((s) => s.username === filter)
        : shifts
      : shifts.filter((s) => s.username === username);

  if (status === 'loading' || loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Shifts</h1>
      {userType === 'manager' ? (
        <label>
          Filter by Employee:{' '}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ marginLeft: '8px' }}
          >
            <option value=''>All Employees</option>
            {[...new Set(shifts.map((s) => s.username))].map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {filteredShifts.length === 0 ? (
        <p>No shifts scheduled yet.</p>
      ) : (
        <table
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            marginTop: '1rem',
          }}
        >
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Date</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>
                Employee ID
              </th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>
                Employee Name
              </th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>
                Start Time
              </th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>
                End Time
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredShifts.map((shift) => (
              <tr key={shift.shift_id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {new Date(shift.date).toLocaleDateString('en-US')}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {shift.employee_id}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {shift.name}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {shift.start_time.slice(0, 5)}{' '}
                  {parseInt(shift.start_time.slice(0, 2)) >= 12 ? 'PM' : 'AM'}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {shift.end_time.slice(0, 5)}{' '}
                  {parseInt(shift.end_time.slice(0, 2)) >= 12 ? 'PM' : 'AM'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Shifts;
