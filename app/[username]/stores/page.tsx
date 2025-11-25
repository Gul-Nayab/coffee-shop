'use client';

import '../../styles/Stores.css';  

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUser } from '../UserContext';
import axios from 'axios';

interface CoffeeShop {
  Store_id: number;
  Name: string;
  Address: string;
  Outlets: boolean;
  Distance_from_sjsu: number;
  Seating: boolean;
  Open_time: string;
  Close_time: string;
  Vegan: boolean;
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
              key={store.Store_id}
              onClick={() => handleCardClick(store.Store_id)}
            >
              {/*The store card */}
              <h3>Store #{store.Name}</h3>
              <p>{store.Address}</p>
              <p>
                {store.Open_time}AM - {store.Close_time}PM
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default CoffeeShops;
