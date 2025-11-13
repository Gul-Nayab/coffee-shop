'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { signOut } from 'next-auth/react';

function AccountPage() {
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
    phone_number: '',
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
      <h1> Your Account</h1>
      {/* Display user information */}
      <div>
        <h3> Your Info</h3>
        {userType === 'employee' ? (
          <table>
            <tbody>
              <tr>
                <th> Name</th>
                <td> {employee.name}</td>
              </tr>
              <tr>
                <th> Employee ID</th>
                <td> {employee.employee_id}</td>
              </tr>
              <tr>
                <th> Hours</th>
                <td> {employee.hours}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table>
            <tbody>
              <tr>
                <th> Name</th>
                <td> {customer.name}</td>
              </tr>
              {customer.phone_number && (
                <tr>
                  <th> Phone Number</th>
                  <td>{customer.phone_number}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {/*Accout action buttons */}
      <div>
        <h3> Account Actions</h3>
        <button> Change Password</button>
        <button onClick={() => signOut({ callbackUrl: '/auth/login' })}>
          Log out
        </button>
      </div>
    </div>
  );
}
export default AccountPage;
