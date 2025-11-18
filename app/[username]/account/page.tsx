'use client';

import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUser } from '../UserContext';
import UserAccountInfo from '../components/UserAccountInfo';

function AccountPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, userType, loading } = useUser();
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, router]);

  if (status === 'loading' || loading) return <div>Loading...</div>;
  return (
    <div>
      <h1> Your Account</h1>
      {/* Display user information */}
      <div>
        <h3> Your Info</h3>
        {user && userType && <UserAccountInfo user={user} type={userType} />}
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
