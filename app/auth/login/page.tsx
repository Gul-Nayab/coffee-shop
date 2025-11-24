'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import '@/app/styles/Login.css';
import '@/app/styles/CreateAccount.css';

function Login() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      username: user.username,
      password: user.password,
      redirect: false,
    });
    if (res?.error) {
      alert('Invalid credentials');
      console.error(res.error);
      return;
    }
    router.push(`/${user.username}/`);
  };

  return (
    <div className='login-page'>
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
        <h1 className='title'>Sign in to account</h1>
      </div>

      <div className='card-row'>
        <div className='card'>
          <div className='inner'>
            <p className='group-title'>* indicates required field</p>

            <form onSubmit={handleSubmit} className='login-form'>
              <div className='field-row'>
                <input
                  className='input-base'
                  type='text'
                  placeholder='* Username'
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                />
              </div>
              <div className='field-row'>
                <input
                  className='input-base'
                  type='password'
                  placeholder='* Password'
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />
              </div>

              <div className='actions-row'>
                <button type='submit' className='cta-btn'>
                  Sign in
                </button>
              </div>
            </form>

            <p className='helper'>
              Don’t have an account?{' '}
              <Link href='/auth/create' className='create-link'>
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
