//SJSU CMPE 138 FALL 2025 TEAM 2
'use client';

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUser } from '../UserContext';
import '@/app/styles/Account.css';
import UserAccountInfo from '@/app/[username]/components/UserAccountInfo';
import AccountActionModal from '../components/AccountActionsForm';

export default function AccountPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, username, userType, loading, refreshUser } = useUser();

  const [isModalOpen, setModalOpen] = useState(false);
  const [action, setAction] =
    useState<'password' | 'edit' | 'delete' | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, router]);

  const openModal = (type: 'password' | 'edit' | 'delete') => {
    setAction(type);
    setModalOpen(true);
  };

  if (status === 'loading' || loading) return <div>Loading...</div>;

  const displayName = user?.name ?? 'User';
  const displayPhone =
    user?.phone ?? 'Not provided';

  return (
    <div className="account-page">

      {/* BIG SJ LOGO — moves to top to match mockup layering */}
      <img
        src="/images/SJCoffeeLogo.png"
        alt="Brand Logo"
        className="account-logo-big"
      />

      {/* GREETING */}
      <div className="account-greeting">
        Hello, <i>{displayName}</i>!
      </div>

      {/* TITLE */}
      <h1 className="account-title">Your Account</h1>

      {/* INFO CARD — rewritten to match mockup exactly */}
      <div className="account-info-box">
        <p>Name: {displayName}</p>
        <p>Phone number: {displayPhone}</p>
      </div>

      {/* BUTTON ROW */}
      <div className="account-buttons">
        <button
          className="account-btn btn-changePassword"
          onClick={() => openModal('password')}
        >
          Change Password
        </button>

        <button
          className="account-btn btn-editInfo"
          onClick={() => openModal('edit')}
        >
          Edit Information
        </button>

        <button
          className="account-btn btn-deleteAccount"
          onClick={() => openModal('delete')}
        >
          Delete Account
        </button>

        <button
          className="account-btn btn-logout"
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
        >
          Log out
        </button>
      </div>

      {/* MODALS */}
      {user && userType && (
        <AccountActionModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          action={action}
          user={user}
          username={username}
          userType={userType}
          onSuccess={() => {
            refreshUser();
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
