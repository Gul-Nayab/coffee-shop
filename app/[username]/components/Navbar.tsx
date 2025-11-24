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
  IconShoppingCart,
  IconShoppingCartFilled,
  IconTable,
  IconToolsKitchen2,
  IconUserFilled,
} from '@tabler/icons-react';

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
    <nav>
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
              <Link href={`/${username}/stores`}>
                <IconBuildingStore />
              </Link>
            </li>
            <li>
              <Link href={`/${username}/orders`}>
                <IconToolsKitchen2 />
              </Link>
            </li>
            <li>
              <Link href={`/${username}/cart`}>
                <IconShoppingCartFilled color='#1f130f' />
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href={`/${username}/`}>
                <IconCoffee />
              </Link>
            </li>
            <li>
              <Link href={`/${username}/shifts`}>
                <IconClock12 />
              </Link>
            </li>
            <li>
              <Link href={`/${username}/inventory`}>
                <IconTable />
              </Link>
            </li>
            {userType === 'manager' ? (
              <li>
                <Link href={`/${username}/finances`}>
                  <IconBusinessplan />
                </Link>
              </li>
            ) : (
              <li>
                <Link href={`/${username}/orders`}>
                  <IconCategory2 />
                </Link>
              </li>
            )}
          </>
        )}

        <li>
          <button onClick={() => signOut({ callbackUrl: '/auth/login' })}>
            <IconLogout />
          </button>
        </li>
        <li>
          <Link href={`/${username}/account`}>
            <IconUserFilled />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
export default NavBar;
