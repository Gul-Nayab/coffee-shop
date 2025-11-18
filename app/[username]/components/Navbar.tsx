'use client';

import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '../UserContext';
import Link from 'next/link';
import Image from 'next/image';

function NavBar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { username } = useParams() as { username: string };
  const { userType, loading } = useUser();
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, router]);

  if (status === 'loading' || loading) return <div>Loading...</div>;

  return (
    <nav
      style={{
        padding: '4px',
        backgroundColor: '#ebbf7dff',
        color: '#fff',
      }}
    >
      <ul style={{ display: 'flex', listStyle: 'none', gap: '2rem' }}>
        <Link href={`/${username}/`}>
          <Image
            src='/images/SJCoffeeLogo.png'
            width={50}
            height={50}
            alt='logo'
          />
        </Link>
        {userType === 'customer' || userType === 'student' ? (
          <>
            <li>
              <Link href={`/${username}/stores`}>Stores</Link>
            </li>
            <li>
              <Link href={`/${username}/orders`}>Order</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href={`/${username}/`}>Dashboard</Link>
            </li>
            <li>
              <Link href={`/${username}/shifts`}>Shifts</Link>
            </li>
            <li>
              <Link href={`/${username}/inventory`}>Inventory</Link>
            </li>
            {userType === 'manager' ? (
              <li>
                <Link href={`/${username}/finances`}>Finances</Link>
              </li>
            ) : (
              <li>
                <Link href={`/${username}/orders`}>Orders</Link>
              </li>
            )}
          </>
        )}

        <li>
          <button onClick={() => signOut({ callbackUrl: '/auth/login' })}>
            Log out
          </button>
        </li>
        <li>
          <Link href={`/${username}/account`}>{username}</Link>
        </li>
      </ul>
    </nav>
  );
}
export default NavBar;
