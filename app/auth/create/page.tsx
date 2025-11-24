'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import Link from 'next/link';
import '@/app/styles/CreateAccount.css';

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
    salary: 0,
    is_manager: false,
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
          employee,
          customer,
        },
      });
      alert(`${response.data.message}`);
    } catch (error: unknown) {
      console.error('Error creating account:', error);
      alert(`Error: ${error}`);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveAccount();
    router.push(`/auth/login`);
  };

  return (
    <div className='create-page'>
      <div className='banner'>
        <Link href='/'>
          <Image
            src='/images/SJCoffeeLogo.png'
            width={56}
            height={56}
            alt='logo'
            className='logo'
          />
        </Link>

        <div className='auth-buttons'>
          <button
            className='auth-btn'
            style={{ backgroundColor: '#fff6ea' }}
            onClick={() => router.push(`/auth/create`)}
          >
            Sign Up
          </button>
          <button
            className='auth-btn'
            style={{ backgroundColor: '#573425', color: 'white' }}
            onClick={() => router.push(`/auth/login`)}
          >
            Log In
          </button>
        </div>
      </div>

      <div className='brown-line' />
      <div className='title-wrap'>
        <h1 className='title'>Create an Account</h1>
      </div>

      <div className='card-row'>
        <div className='card'>
          <div className='tabs-wrap'>
            <button
              className={`tab-btn ${userType === 'customer' ? 'active' : ''}`}
              onClick={() => setUserType('customer')}
              type='button'
            >
              Customer
            </button>
            <button
              className={`tab-btn ${userType === 'employee' ? 'active' : ''}`}
              onClick={() => setUserType('employee')}
              type='button'
            >
              Employee
            </button>
          </div>

          <form onSubmit={handleSubmit} className='inner'>
            <p className='section-title'>
              {userType === 'customer'
                ? 'Create Customer Account'
                : 'Create Employee Account'}
            </p>

            <p className='group-title'>Personal Information</p>

            {/* Shared fields */}
            <div className='field-row'>
              <input
                className='input-base'
                type='text'
                placeholder='* Full Name'
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>

            {userType === 'customer' && (
              <>
                <div className='field-row'>
                  <input
                    className='input-base'
                    type='text'
                    placeholder='Phone Number'
                    onChange={(e) =>
                      setCustomerUser({
                        ...customer,
                        phone_number: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className='field-row'>
                  <input
                    className='input-base'
                    type='text'
                    placeholder='SJSU ID'
                    onChange={(e) =>
                      setCustomerUser({
                        ...customer,
                        student_id: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </>
            )}

            {userType === 'employee' && (
              <>
                <div className='field-row'>
                  <select
                    className='select-base'
                    value={employeeType}
                    onChange={(e) => {
                      setEmployeeType(e.target.value as 'barista' | 'manager');
                      setEmployeeUser({
                        ...employee,
                        is_manager: e.target.value === 'manager',
                      });
                    }}
                  >
                    <option value='barista'>Barista</option>
                    <option value='manager'>Manager</option>
                  </select>
                </div>

                <div className='field-row'>
                  <input
                    className='input-base'
                    type='text'
                    placeholder='* Employee ID'
                    onChange={(e) =>
                      setEmployeeUser({
                        ...employee,
                        employee_id: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className='field-row'>
                  <input
                    className='input-base'
                    type='text'
                    placeholder={
                      employeeType === 'manager'
                        ? 'Biweekly Salary'
                        : 'Hourly Salary'
                    }
                    onChange={(e) =>
                      setEmployeeUser({
                        ...employee,
                        salary: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>

                <div className='field-row'>
                  <select
                    className='select-base'
                    value={employerStoreID ?? ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setEmployerStoreID(val);
                      setEmployeeUser({ ...employee, store_id: val });
                    }}
                  >
                    <option value=''>Select a store</option>
                    {stores.map((store) => (
                      <option key={store.store_id} value={store.store_id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <p className='group-title'>Account Security</p>

            <div className='field-row'>
              <input
                className='input-base'
                type='text'
                placeholder='* Username'
                onChange={(e) => {
                  setUser({ ...user, username: e.target.value });
                  setCustomerUser({ ...customer, username: e.target.value });
                  setEmployeeUser({ ...employee, username: e.target.value });
                }}
              />
            </div>

            <div className='field-row'>
              <input
                className='input-base'
                type='password'
                placeholder='* Password'
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>

            <div className='actions-row'>
              <button
                type='submit'
                className='auth-btn'
                style={{ backgroundColor: '#f9943b' }}
              >
                Create Account
              </button>
            </div>
            <p className='helper-text'>* indicates required field</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
