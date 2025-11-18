'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface CoffeeShop {
  store_id: number;
  name: string;
  address: string;
  outlets: boolean;
  distance_from_sjsu: number;
  seating: boolean;
  open_time: string;
  close_time: string;
  vegan: boolean;
  budget: number;
}

function CreateAccount() {
  const router = useRouter();
  const [userType, setUserType] = useState<'customer' | 'employee'>('customer');
  const [employeeType, setEmployeeType] = useState<'barista' | 'manager'>(
    'barista'
  );
  const [stores, setStores] = useState<CoffeeShop[]>([]);
  const [employerStoreID, setEmployerStoreID] = useState<number>();

  const [user, setUser] = useState({
    name: '',
    username: '',
    password: '',
  });
  const [customer, setCustomerUser] = useState({
    username: '',
    phone_number: 0,
    student_id: 0,
  });
  const [employee, setEmployeeUser] = useState({
    username: '',
    employee_id: 0,
    hours: 0,
    store_id: 0,
  });
  const [manager, setManagerUser] = useState({
    employee_id: 0,
    salary: 0,
  });

  useEffect(() => {
    async function getAllStores() {
      try {
        const response = await axios.get('/api/coffee-shop/stores', {
          timeout: 5000,
        });
        setStores(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    getAllStores();
  }, []);

  async function saveAccount() {
    try {
      const response = await axios.post('/api/coffee-shop/users', {
        userType,
        username: user.username,
        password: user.password,
        name: user.name,
        kwargs: {
          employeeType,
          employee,
          customer,
          manager,
        },
      });
      alert(`${response.data.message}`);
    } catch (error: unknown) {
      console.error('Error adding inventory:', error);
      alert(`Error:${error}`);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveAccount();
    router.push(`/auth/login`);
  };
  return (
    <div>
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        {/* pick employee or customer */}
        <label>
          <input
            type='radio'
            name='user_type'
            value='employee'
            checked={userType === 'employee'}
            onChange={() => setUserType('employee')}
          />
          Employee
        </label>
        <label>
          <input
            type='radio'
            name='user_type'
            value='customer'
            checked={userType === 'customer'}
            onChange={() => setUserType('customer')}
          />
          Customer
        </label>

        {/* Name input field */}
        <label>
          Name
          <input
            type='text'
            placeholder='enter your name'
            id='name-input'
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </label>
        <br />

        {userType === 'customer' && (
          <>
            <label>
              Phone Number
              <input
                type='text'
                placeholder='enter your phone number'
                id='phone-number-input'
                onChange={(e) =>
                  setCustomerUser({
                    ...customer,
                    phone_number: parseInt(e.target.value.trim()),
                  })
                }
              />
            </label>
            <label>
              Student ID
              <input
                type='text'
                placeholder='enter your student id'
                id='student-id-input'
                onChange={(e) =>
                  setCustomerUser({
                    ...customer,
                    student_id: parseInt(e.target.value.trim()),
                  })
                }
              />
            </label>
            <br />
          </>
        )}
        {userType === 'employee' && (
          <>
            {/*Employee Type dropdown */}
            <label>
              Role:
              <select
                value={employeeType}
                onChange={(e) =>
                  setEmployeeType(e.target.value as 'barista' | 'manager')
                }
              >
                <option value='barista'>Barista</option>
                <option value='manager'>Manager</option>
              </select>
            </label>

            <label>
              Employee ID
              <input
                type='text'
                placeholder='enter your employee ID'
                id='employee-id-input'
                onChange={(e) => {
                  setEmployeeUser({
                    ...employee,
                    employee_id: parseInt(e.target.value),
                  });
                  setManagerUser({
                    ...manager,
                    employee_id: parseInt(e.target.value),
                  });
                }}
              />
            </label>
            <br />
            {employeeType === 'manager' ? (
              <label>
                Salary
                <input
                  type='text'
                  placeholder='enter your yearly salary'
                  id='salary-input'
                  onChange={(e) =>
                    setManagerUser({
                      ...manager,
                      salary: parseFloat(e.target.value),
                    })
                  }
                />
              </label>
            ) : null}
            <label>
              Pick the store you work for
              <select
                value={employerStoreID}
                onChange={(e) => {
                  setEmployerStoreID(parseInt(e.target.value));
                  setEmployeeUser({
                    ...employee,
                    store_id: parseInt(e.target.value),
                  });
                }}
              >
                <option value=''>Select a store</option>
                {stores.map((store) => (
                  <option key={store.store_id} value={store.store_id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
        <label>
          Create Username
          <input
            type='text'
            placeholder='enter a username'
            id='username-input'
            onChange={(e) => {
              setUser({ ...user, username: e.target.value });
              setCustomerUser({ ...customer, username: e.target.value });
              setEmployeeUser({ ...employee, username: e.target.value });
            }}
          />
        </label>
        <br />
        <label>
          Create Password
          <input
            type='text'
            placeholder='enter a password'
            id='password-input'
            onChange={(e) => setUser({ ...user, password: e.target.value })} //save it hashed
          />
        </label>
        <br />

        <button type='submit'>Create Account</button>
      </form>
    </div>
  );
}
export default CreateAccount;
