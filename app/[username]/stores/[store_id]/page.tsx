'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUser } from '@/app/[username]/UserContext';
import axios from 'axios';
import Menu from '../../components/Menu';

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

interface MenuItem {
  store_id: number;
  item_name: string;
  ingredients: Array<string>;
}

function ACoffeeShop() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, userType, loading } = useUser();
  const { store_id } = useParams();

  const [store, setStore] = useState<CoffeeShop>();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    async function getAllStores() {
      try {
        const response = await axios.get(
          `/api/coffee-shop/stores/${store_id}`,
          {
            timeout: 5000,
          }
        );
        setStore(response.data);
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

  function handleOrder() {
    console.log('order created!');
  }

  return (
    <div>
      <h1>Stores</h1>
      {userType === 'customer' && (
        <>
          {/*The store Information */}
          <div>
            <h3>{store?.name}</h3>
            <p>{store?.address}</p>
            <p>
              {store?.open_time}AM - {store?.close_time}PM
            </p>
            <p>Has outlets: {store?.outlets}</p>
            <p>Distance from SJSU: {store?.distance_from_sjsu}</p>
            <p>Has Seating: {store?.seating}</p>
            <p>Has Vegan Options: {store?.seating}</p>
          </div>
          {/*Menu */}
          <div>
            <h3>Here is a Menu!</h3>
            <button>Create an order</button>
            <Menu store_id={store_id} />
          </div>
        </>
      )}
    </div>
  );
}

export default ACoffeeShop;
