'use client';

import '../../styles/Stores.css';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUser } from '../UserContext';
import axios from 'axios';

interface CoffeeShop {
  store_id: number;
  name: string;
  address: string;
  outlets: boolean;
  distance_from_sjsu: number;
  seating: boolean;
  open_time: string;
  close_time: string;
  vegan: boolean;
}

function CoffeeShops() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, userType, loading } = useUser();

  const [stores, setStores] = useState<CoffeeShop[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);
  useEffect(() => {
    async function getAllStores() {
      try {
        const response = await axios.get('/api/coffee-shop/stores', {
          timeout: 5000,
        });
        setStores(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    getAllStores();
  }, []);
  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  function handleCardClick(store_id: number) {
    router.push(`stores/${store_id}`);
  }

  return (
    <div>
      <h1>Stores</h1>
      <div>
        {' '}
        {/*Container for all the store cards */}
        {(userType === 'customer' || userType === 'student') &&
          stores.map((store) => (
            <div
              key={store.store_id}
              onClick={() => handleCardClick(store.store_id)}
            >
              {/*The store card */}
              <h3>Store #{store.name}</h3>
              <p>{store.address}</p>
              <p>
                {store.open_time}AM - {store.close_time}PM
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default CoffeeShops;
