'use client';

import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '../UserContext';
import Link from 'next/link';
import Image from 'next/image';
import {
  IconBuildingStore,
  IconBusinessplan,
  IconCategory2,
  IconClock12,
  IconCoffee,
  IconLogout,
  IconShoppingCartFilled,
  IconTable,
  IconToolsKitchen2,
  IconUserFilled,
} from '@tabler/icons-react';
import './styles/Navbar.css';

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
    <nav className='navbar'>
      <div className='navbar-left'>
        <Link href={`/${username}/`}>
          <Image
            src='/images/SJCoffeeLogo.png'
            width={65}
            height={65}
            alt='logo'
            className='navbar-logo'
          />
        </Link>
      </div>

      <div className='navbar-right'>
        {userType === 'customer' || userType === 'student' ? (
          <>
            <Link href={`/${username}/cart`}>
              <IconShoppingCartFilled className='nav-icon' />
            </Link>
            <Link href={`/${username}/stores`}>
              <IconBuildingStore className='nav-icon' />
            </Link>
            <Link href={`/${username}/account`}>
              <IconUserFilled className='nav-icon' />
            </Link>
          </>
        ) : (
          <>
            <Link href={`/${username}/`}>
              <IconCoffee className='nav-icon' />
            </Link>
            <Link href={`/${username}/shifts`}>
              <IconClock12 className='nav-icon' />
            </Link>
            <Link href={`/${username}/inventory`}>
              <IconTable className='nav-icon' />
            </Link>
            {userType === 'manager' ? (
              <Link href={`/${username}/finances`}>
                <IconBusinessplan className='nav-icon' />
              </Link>
            ) : (
              <Link href={`/${username}/orders`}>
                <IconCategory2 className='nav-icon' />
              </Link>
            )}
            <Link href={`/${username}/account`}>
              <IconUserFilled className='nav-icon' />
            </Link>
          </>
        )}

        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className='logout-btn'
        >
          <IconLogout className='nav-icon' />
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
