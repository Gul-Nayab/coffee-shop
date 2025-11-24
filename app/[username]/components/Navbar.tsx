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
        <Link href={`/${username}/`} title='Go to Dashboard'>
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
            <Link href={`/${username}/cart`} title='See your cart'>
              <IconShoppingCartFilled className='nav-icon' />
            </Link>
            <Link href={`/${username}/stores`} title='See all stores'>
              <IconBuildingStore className='nav-icon' />
            </Link>

            <Link href={`/${username}/orders`} title='View your order history'>
              <IconToolsKitchen2 className='nav-icon' />
            </Link>

            <Link href={`/${username}/account`} title='Go to your account'>
              <IconUserFilled className='nav-icon' />
            </Link>
          </>
        ) : (
          <>
            <Link href={`/${username}/`} title='Go to dashboard'>
              <IconCoffee className='nav-icon' />
            </Link>
            <Link href={`/${username}/shifts`} title='See shifts'>
              <IconClock12 className='nav-icon' />
            </Link>
            <Link href={`/${username}/inventory`} title='See inventory'>
              <IconTable className='nav-icon' />
            </Link>
            {userType === 'manager' ? (
              <Link href={`/${username}/finances`} title='View finances'>
                <IconBusinessplan className='nav-icon' />
              </Link>
            ) : (
              <Link href={`/${username}/orders`} title='See pending orders'>
                <IconCategory2 className='nav-icon' />
              </Link>
            )}
            <Link href={`/${username}/account`} title='Go to your account'>
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
