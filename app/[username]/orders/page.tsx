'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUser } from '../UserContext';
import axios from 'axios';

interface CustomerOrder {
  username: string;
  item_name: string;
  store_name: string;
  store_id: number;
  order_total: number;
}
interface IncomingOrder {
  item_name: string;
  store_id: number;
  completed: boolean;
}

function Orders() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, username, userType, loading } = useUser();
  const [orders, setOrders] = useState<CustomerOrder[] | IncomingOrder[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
    if (userType === 'manager') router.push('/auth/login'); //add alert
  }, [status, router, userType]);

  useEffect(() => {
    async function getUserOrders() {
      try {
        const response = await axios.get(
          `/api/coffee-shop/users/${username}/orders/`,
          {
            timeout: 5000,
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    async function getIncompleteOrders() {
      try {
        const response = await axios.get(
          `/api/coffee-shop/stores/${user?.store_id}/orders/`,
          {
            timeout: 5000,
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    if (userType === 'customer') {
      getUserOrders();
    } else if (userType === 'barista') {
      getIncompleteOrders();
    }
  }, [userType]);

  if (status === 'loading' || loading) return <div>Loading...</div>;

  if (userType === 'customer' || userType === 'student') {
    const customerOrders = orders as CustomerOrder[];
    return (
      <div>
        <h1>Your Order History</h1>
        <button> Create a New Order </button>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {/* Order div container */}
          {customerOrders.map((order, index) => (
            <div
              key={`order-${index}`}
              style={{
                border: '1px solid black',
                borderRadius: '8px',
                padding: '4px',
              }}
            >
              {/* Order div */}
              <p>Store name: Philz Coffee</p>
              <p> Item Ordered: {order.item_name}</p>
              <p> Total Cost: ${order.order_total}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (userType === 'barista') {
    const incomingOrders = orders as IncomingOrder[];
    return (
      <div>
        <h1>Upcoming Orders</h1>
        <div>
          {/*Order div container*/}
          {incomingOrders.map((order, index) => (
            <div key={`order-${index}`}>
              {/*Order div */}
              <p> Item Ordered: {order.item_name}</p>
              <p> Completed: {order.completed}</p>
              <button> Set Order As Completed </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
export default Orders;
