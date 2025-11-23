'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUser } from './UserContext';
import Link from 'next/link';

function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, username, userType, loading } = useUser();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, router, userType]);

  if (status === 'loading' || loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>
        Welcome <Link href={`/${username}/account`}>{user?.name}</Link>
      </h1>
      {/** the actions the user can take*/}
      {userType === 'customer' || userType === 'student' ? (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div
            style={{
              border: '1px solid black',
              borderRadius: '8px',
              cursor: 'pointer',
              width: 'fit-content',
              padding: '1rem',
            }}
            onClick={() => router.push(`/${username}/stores`)}
          >
            View Nearby Stores
          </div>
          <div
            style={{
              border: '1px solid black',
              borderRadius: '8px',
              cursor: 'pointer',
              width: 'fit-content',
              padding: '1rem',
            }}
            onClick={() => router.push(`/${username}/orders`)}
          >
            View Your Orders
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div
            style={{
              border: '1px solid black',
              borderRadius: '8px',
              cursor: 'pointer',
              width: 'fit-content',
              padding: '1rem',
            }}
            onClick={() => router.push(`/${username}/shifts`)}
          >
            View Shifts
          </div>
          <div
            style={{
              border: '1px solid black',
              borderRadius: '8px',
              cursor: 'pointer',
              width: 'fit-content',
              padding: '1rem',
            }}
            onClick={() => router.push(`/${username}/inventory`)}
          >
            View Inventory
          </div>
          {userType === 'manager' ? (
            <div
              style={{
                border: '1px solid black',
                borderRadius: '8px',
                cursor: 'pointer',
                minWidth: 'fit-content',
              }}
              onClick={() => router.push(`/${username}/finances`)}
            >
              View Earnings
            </div>
          ) : (
            <div
              style={{
                border: '1px solid black',
                borderRadius: '8px',
                cursor: 'pointer',
                minWidth: 'fit-content',
              }}
              onClick={() => router.push(`/${username}/orders`)}
            >
              View Incoming Orders
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default Dashboard;
