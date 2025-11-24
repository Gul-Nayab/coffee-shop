'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUser } from '../UserContext';
import axios from 'axios';
import '@/app/styles/Orders.css';

interface CustomerOrder {
  pk_order_id: number;
  username: string;
  store_id: number;
  item_name: string;
  order_total: string;
  quantity: number;
  order_id: number | null;
  name: string;
}

interface BaristaOrder {
  pk_order_id: number;
  item_name: string;
  store_id: number;
  completed: boolean;
  order_id: number;
  quantity: number;
  username: string;
}

function Orders() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, username, userType, loading } = useUser();

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [baristaOrders, setBaristaOrders] = useState<BaristaOrder[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, router]);

  useEffect(() => {
    async function getUserOrders() {
      try {
        const response = await axios.get(
          `/api/coffee-shop/users/${username}/orders/`,
          { timeout: 5000 }
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
          { timeout: 5000 }
        );
        setBaristaOrders(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    if (userType === 'customer' || userType === 'student') {
      getUserOrders();
    } else if (userType === 'barista') {
      getIncompleteOrders();
    }
  }, [userType]);

  async function handleOrderComplete(pk_order_id: number) {
    console.log(pk_order_id, 'completed');
    try {
      const response = await axios.patch(
        `/api/coffee-shop/stores/${user?.store_id}/orders`,
        { pk_order_id }
      );

      alert(response.data.message);
      const refreshed = await axios.get(
        `/api/coffee-shop/stores/${user?.store_id}/orders/`
      );
      setBaristaOrders(refreshed.data);
    } catch (error) {
      console.error('Failed to mark order complete:', error);
      alert('Error updating order status.');
    }
  }

  if (status === 'loading' || loading) return <div>Loading...</div>;

  if (userType === 'customer' || userType === 'student') {
    const customerOrders = orders;

    const groupedOrders = customerOrders.reduce(
      (acc, order) => {
        const key = order.order_id ?? `${order.item_name}-${Math.random()}`;
        if (!acc[key]) {
          acc[key] = {
            order_id: order.order_id,
            store_name: order.name,
            items: [],
            total: 0,
          };
        }
        acc[key].items.push({
          name: order.item_name,
          quantity: order.quantity,
          subtotal: parseFloat(order.order_total),
        });
        acc[key].total += parseFloat(order.order_total);
        return acc;
      },
      {} as Record<
        string,
        {
          order_id: number | null;
          store_name: string;
          items: { name: string; quantity: number; subtotal: number }[];
          total: number;
        }
      >
    );

    const sortedGroups = Object.entries(groupedOrders).sort(
      ([aKey], [bKey]) => {
        const aId = groupedOrders[aKey].order_id ?? 0;
        const bId = groupedOrders[bKey].order_id ?? 0;
        return bId - aId;
      }
    );

    return (
      <div className='orders-page'>
        <h1 className='orders-title'>Your Order History</h1>
        <button
          onClick={() => router.push(`/${username}/cart`)}
          className='orders-create-btn'
        >
          Create a New Order
        </button>

        <div className='orders-container'>
          {sortedGroups.map(([key, group]) => (
            <div key={key} className='order-card'>
              <h3 className='order-id'>
                {group.order_id ? `Order #${group.order_id}` : 'Order'}
              </h3>
              <p className='order-store'>
                <strong>Store:</strong> {group.store_name}
              </p>
              <ul className='order-items-list'>
                {group.items.map((item) => (
                  <li
                    key={`${group.order_id ?? 'unassigned'}-${item.name}`}
                    className='order-item'
                  >
                    {item.name} × {item.quantity} — ${item.subtotal.toFixed(2)}
                  </li>
                ))}
              </ul>
              <p className='order-total'>
                <strong>Total:</strong> ${group.total.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (userType === 'barista') {
    return (
      <div className='orders-page'>
        <h1 className='orders-title'>Incoming Orders</h1>
        <div className='orders-container'>
          {baristaOrders.length === 0 ? (
            <p>No active orders right now.</p>
          ) : (
            baristaOrders.map((order) => (
              <div key={order.pk_order_id} className='order-card'>
                <h3 className='order-id'>Order #{order.order_id}</h3>
                <p>
                  <strong>Customer:</strong> {order.username}
                </p>
                <p>
                  <strong>Item:</strong> {order.item_name}
                </p>
                <p>
                  <strong>Quantity:</strong> {order.quantity}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  {order.completed ? 'Completed' : 'Pending'}
                </p>
                {!order.completed && (
                  <button
                    className='orders-create-btn'
                    onClick={() => handleOrderComplete(order.pk_order_id)}
                  >
                    Set As Completed
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default Orders;
