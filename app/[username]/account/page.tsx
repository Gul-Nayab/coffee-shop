'use client';

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUser } from '../UserContext';
import UserAccountInfo from '@/app/[username]/components/UserAccountInfo';
import AccountActionModal from '../components/AccountActionsForm';

function AccountPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, userType, loading } = useUser();

  const [isModalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState<'password' | 'edit' | 'delete' | null>(
    null
  );
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, router]);

  const openModal = (type: 'password' | 'edit' | 'delete') => {
    setAction(type);
    setModalOpen(true);
  };

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
        <h3>Account Actions</h3>
        <button onClick={() => openModal('password')}>Change Password</button>
        <button onClick={() => openModal('edit')}>Edit Information</button>
        <button onClick={() => openModal('delete')}>Delete Account</button>
        <button onClick={() => signOut({ callbackUrl: '/auth/login' })}>
          Log out
        </button>
      </div>

      {user && userType && (
        <AccountActionModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          action={action}
          user={user}
          userType={userType}
          onSuccess={() => router.refresh()}
        />
      )}
    </div>
  );
}
export default AccountPage;
