'use client';

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUser } from '../UserContext';
import UserAccountInfo from '@/app/[username]/components/UserAccountInfo';
import AccountActionModal from '../components/AccountActionsForm';
import '@/app/styles/Account.css';

function AccountPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, username, userType, loading } = useUser();

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
    <div className="account-page">
      <div className="account-greeting">
        Hello, <i>{user?.name}</i>!
      </div>
      <h1 className="account-title"> Your Account</h1>
      {/* Display user information */}
      <div className="account-info-box">
        <h3> Your Info</h3>
        {user && userType && <UserAccountInfo user={user} type={userType} />}
      </div>
      {/*Accout action buttons */}
      <div className="account-buttons">
        <button className="account-btn btn-changePassword" onClick={() => openModal('password')}>Change Password</button>
        <button className="account-btn btn-editInfo" onClick={() => openModal('edit')}>Edit Information</button>
        <button className="account-btn btn-deleteAccount" onClick={() => openModal('delete')}>Delete Account</button>
        <button className="account-btn btn-logout" onClick={() => signOut({ callbackUrl: '/auth/login' })}>
          Log out
        </button>
      </div>

      <img
        src="/images/SJCoffeeLogo.png"
        className="account-logo-big"
        alt="Brand Logo"
      />

      {user && userType && (
        <AccountActionModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          action={action}
          user={user}
          username={username}
          userType={userType}
          onSuccess={() => router.refresh()}
        />
      )}
    </div>
  );
}
export default AccountPage;
