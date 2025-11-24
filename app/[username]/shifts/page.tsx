'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUser } from '../UserContext';
import axios from 'axios';
import Modal from '../components/Modal';

interface Shift {
  shift_id: number;
  e_id: number;
  name: string;
  start_time: string;
  end_time: string;
  date: string;
}

interface Employee {
  name: string;
  e_id: number;
}

function Shifts() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, username, userType, loading } = useUser();

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [filter, setFilter] = useState<string>('');

  const [isModalOpen, setModalOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);

  //form fields information
  const [selectedEmployee, setSelectedEmployee] = useState<number | ''>('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

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

  async function getAllEmployees(store_id: number) {
    try {
      const response = await axios.get(
        `/api/coffee-shop/stores/${store_id}/employees`,
        { timeout: 5000 }
      );
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function assignShift(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedEmployee || !date || !startTime || !endTime) {
      alert('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`/api/coffee-shop/stores/${user?.store_id}/shifts`, {
        e_id: selectedEmployee,
        date,
        start_time: startTime,
        end_time: endTime,
      });

      await getShifts(user.store_id);
      setModalOpen(false);
      setSelectedEmployee('');
      setDate('');
      setStartTime('');
      setEndTime('');
    } catch (error) {
      console.error('Error assigning shift:', error);
      alert('Failed to assign shift.');
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, router]);

  useEffect(() => {
    async function fetchShifts() {
      getShifts(user.store_id);
    }
    if (user?.store_id) {
      fetchShifts();
    }
    console.log('Barista e_id:', user?.e_id);
    console.log(
      'Shift e_ids:',
      shifts.map((s) => s.e_id)
    );
  }, [user?.store_id]);

  useEffect(() => {
    if (isModalOpen && user?.store_id) {
      getAllEmployees(user.store_id);
    }
  }, [isModalOpen, user?.store_id]);

  const filteredShifts =
    userType === 'manager'
      ? filter
        ? shifts.filter((s) => s.name === filter)
        : shifts
      : shifts.filter((s) => s.e_id === user?.e_id);

  if (status === 'loading' || loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Shifts</h1>
      {userType === 'manager' ? (
        <>
          <label>
            {' '}
            {/* Drop down to select employee to filter shifts */}
            Filter by Employee:{' '}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ marginLeft: '8px' }}
            >
              <option value=''>All Employees</option>
              {[...new Set(shifts.map((s) => s.name))].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          {/* button to open form for assigning shifts */}
          <button onClick={() => setModalOpen(true)}>Assign Shifts</button>
          {/*Modal form for assigning a new shifts */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            title='Assign New Shift'
          >
            <p>Pick an employee to assign a shfit.</p>
            <form onSubmit={assignShift} className='assign-shift-form'>
              <label>
                Employee:
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(Number(e.target.value))}
                  required
                >
                  <option value=''>Select an Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.e_id} value={emp.e_id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Date:
                <input
                  type='date'
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </label>

              <label>
                Start Time:
                <input
                  type='time'
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </label>

              <label>
                End Time:
                <input
                  type='time'
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </label>

              <button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Assigning...' : 'Assign Shift'}
              </button>
            </form>
          </Modal>
        </>
      ) : null}

      {/*Shift table */}
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
                  {shift.e_id}
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
