'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/[username]/UserContext';
import { IconCookie, IconCup } from '@tabler/icons-react';
import axios from 'axios';
import './styles/Menu.css';

interface MenuItem {
  store_id: number;
  item_name: string;
  ingredients: Array<string>;
  price: string;
}
interface MenuProps {
  store_id: string | number;
  onItemClick?: (item: MenuItem) => void;
}

function Menu({ store_id, onItemClick }: MenuProps) {
  const router = useRouter();
  const { user, username, userType, loading } = useUser();

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

  function handleOrder(item: MenuItem) {
    if (onItemClick) {
      onItemClick(item);
      return;
    }
    const existing = JSON.parse(localStorage.getItem('cart') || '[]');
    const updated = [...existing, item];
    localStorage.setItem('cart', JSON.stringify(updated));

    console.log(updated);
    router.push(`/${username}/cart`);
  }

  return (
    <div className='menu-container'>
      {/*Menu Item container */}
      {(userType === 'customer' || userType === 'student') &&
        menu.map((item) => (
          <div
            key={item.item_name}
            className='menu-item'
            onClick={() => handleOrder(item)}
          >
            {/* Each item's div */}
            {item.ingredients.length === 0 ? <IconCookie /> : <IconCup />}
            <h4>{item.item_name}</h4>
            {item.ingredients.length > 0 && (
              <p>{item.ingredients.join(', ')}</p>
            )}
            {userType === 'student' ? (
              <p>${(parseFloat(item.price) * 0.9).toFixed(2)}</p>
            ) : (
              <p>${item.price}</p>
            )}
          </div>
        ))}
    </div>
  );
}

export default Menu;
