'use client';

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function Login() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: '',
    password: '',
  });
  async function getExistingUser() {
    try {
      const response = await axios.get(
        `/api/coffee-shop/users/${user.username}`,
        {
          timeout: 5000,
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching data:', error);
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const users = await getExistingUser();
    if (users.status === 404) {
      console.error('This user does not exist. Please use Create Account.');
    } else if (user.password !== users.password) {
      console.error('The password is incorrect. Please try again.');
    } else {
      console.log('Logged in!');
      router.push(`/account/${user.username}`);
    }
  };
  return (
    //Login page (br tags are temporary, remove after adding styles)
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type='text'
            placeholder='enter username'
            id='username-input'
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
        </label>
        <br />
        <label>
          Password
          <input
            type='text'
            placeholder='enter password'
            id='password-input'
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </label>
        <button type='submit'>Log in</button>
      </form>

      <button>Create Accout</button>
    </div>
  );
}
export default Login;
