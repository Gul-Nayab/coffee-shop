'use client';

import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUser } from '../UserContext';
import Link from 'next/link';

function NavBar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, userType, loading } = useUser();
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, router]);

  if (status === 'loading' || loading) return <div>Loading...</div>;

  return (
    <nav style={{ padding: '10px', backgroundColor: '#333', color: '#fff' }}>
      <ul>
        {userType === 'customer' ? (
          <>
            <li>
              <Link href={`/${user?.username}/stores`}>Stores</Link>
            </li>
            <li>
              <Link href={`/${user?.username}/stores`}>Order</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href={`/${user?.username}/dashboard`}>Dashboard</Link>
            </li>
            <li>
              <Link href={`/${user?.username}/shifts`}>Shifts</Link>
            </li>
            <li>
              <Link href={`/${user?.username}/inventory`}>Inventory</Link>
            </li>
            {userType === 'manager' ? (
              <li>
                <Link href={`/${user?.username}/earnings`}>Earnings</Link>
              </li>
            ) : (
              <li>
                <Link href={`/${user?.username}/orders`}>Orders</Link>
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
          <Link href={`/${user?.username}/account`}>{user?.username}</Link>
        </li>
      </ul>
    </nav>
  );
}
export default NavBar;
