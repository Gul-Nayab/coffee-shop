'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUser } from '@/app/[username]/UserContext';
import axios from 'axios';
import { IconCookie, IconCup } from '@tabler/icons-react';

interface MenuItem {
  store_id: number;
  item_name: string;
  ingredients: Array<string>;
  price: number;
}

function Menu(store_id: number) {
  const router = useRouter();
  //   const { data: session, status } = useSession();
  const { user, userType, loading } = useUser();

  const [menu, setMenu] = useState<MenuItem[]>([]);

  //   useEffect(() => {
  //     if (status === 'unauthenticated') {
  //       router.push('/auth/login');
  //     }
  //   }, [status, router]);

  useEffect(() => {
    async function getMenuItems() {
      try {
        const response = await axios.get(
          `/api/coffee-shop/stores/${store_id}/menu`,
          {
            timeout: 5000,
          }
        );
        setMenu(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    getMenuItems();
  }, [store_id]);

  //   if (status === 'loading' || loading) {
  //     return <div>Loading...</div>;
  //   }

  //   if (!session) {
  //     return null;
  //   }

  function handleOrder(item_name: string) {
    console.log(`${item_name} added to order`);
  }

  return (
    <div>
      {/*Menu Item container */}
      {userType === 'customer' &&
        menu.map((item) => (
          <div key={item.item_name} onClick={() => handleOrder(item.item_name)}>
            <div>
              {item.ingredients.length === 0 ? (
                <IconCookie size={20} />
              ) : (
                <IconCup size={20} />
              )}
            </div>
            <h4>{item.item_name}</h4>
            {item.ingredients.length !== 0 && (
              <p>{item.ingredients.join(', ')}</p>
            )}
            <p>${item.price}</p>
          </div>
        ))}
    </div>
  );
}

export default Menu;
