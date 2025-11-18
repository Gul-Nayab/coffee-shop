'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/[username]/UserContext';
import axios from 'axios';
import { IconCookie, IconCup } from '@tabler/icons-react';

interface MenuItem {
  store_id: number;
  item_name: string;
  ingredients: Array<string>;
  price: number;
}

function Menu({ store_id }: number) {
  const router = useRouter();
  const { user, userType, loading } = useUser();

  const [menu, setMenu] = useState<MenuItem[]>([]);

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

  function handleOrder(item_name: string) {
    console.log(`${item_name} added to order`);
  }

  //remove inline styles
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {/*Menu Item container */}
      {userType === 'customer' &&
        menu.map((item) => (
          <div
            key={item.item_name}
            onClick={() => handleOrder(item.item_name)}
            style={{
              border: '1px solid black',
              padding: '5px',
              minWidth: '100px',
              cursor: 'pointer',
            }}
          >
            {/* Each item's div */}
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
            <p>{item.price}</p>
          </div>
        ))}
    </div>
  );
}

export default Menu;
