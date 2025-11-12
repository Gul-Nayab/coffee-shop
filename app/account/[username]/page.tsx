'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

function AccountDashboard() {
  const { username } = useParams();
  const [userType, setUserType] = useState<'customer' | 'employee'>('customer');
  const [employee, setEmployee] = useState({
    name: '',
    username: '',
    password: '',
    employee_id: '',
    hours: 0,
  });
  const [customer, setCustomer] = useState({
    name: '',
    username: '',
    password: '',
    phone_number: 0,
  });

  async function getUserInfo() {
    try {
      const response = await axios.get(
        `/api/coffee-shop/users/${username}/type`,
        {
          timeout: 5000,
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserInfo();

      if (user.employee_id) {
        setUserType('employee');
        setEmployee(user);
      } else {
        setCustomer(user);
      }
    };
    fetchUser();
  }, []);

  return (
    <div>
      {userType === 'employee' ? (
        <>
          <h1>{employee.name}</h1>
          <p>{employee.employee_id}</p>
        </>
      ) : (
        <>
          <h1>{customer.name}</h1>
          <p>{customer.phone_number || ''}</p>
        </>
      )}
    </div>
  );
}
export default AccountDashboard;
