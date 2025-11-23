'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

function Login() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(user);
    e.preventDefault();
    const res = await signIn('credentials', {
      username: user.username,
      password: user.password,
      redirect: false,
    });
    if (res?.error) {
      console.error(res.error);
      return;
    }
    console.log('Logged in!');
    router.push(`/${user.username}/`);
  };

  return (
    //Login page (br tags are temporary, remove after adding styles)
    <>
      {/*Navbar */}
      <div>
        <Image
          src='/images/SJCoffeeLogo.png'
          width={100}
          height={100}
          alt='logo'
          onClick={() => router.push(`/`)}
        />
        <button onClick={() => router.push(`/auth/create`)}>Sign Up</button>
        <button onClick={() => router.push(`/auth/login`)}>Login In</button>
      </div>
      {/*Body of webpage */}
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

        <button onClick={() => router.push('/auth/create')}>
          Create Accout
        </button>
      </div>
    </>
  );
}
export default Login;
