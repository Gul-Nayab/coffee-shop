//SJSU CMPE 138 FALL 2025 TEAM 2
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
  name: string; // store name
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

function storeNameToClass(storeName: string): string {
  return (
    'store-' +
    storeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // non-alphanumerics to "-"
      .replace(/(^-|-$)/g, '') // trim leading/trailing "-"
  );
}

function Orders() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, username, userType, loading } = useUser();

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [baristaOrders, setBaristaOrders] = useState<BaristaOrder[]>([]);

  const [inventory, setInventory] = useState<any[]>([]);

  const [ingredientsMap, setIngredientsMap] = useState<
    Record<string, string[]>
  >({});

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
  }, [userType, user?.store_id, username]);

  useEffect(() => {
    if (userType === 'barista') {
      axios
        .get(`/api/coffee-shop/stores/${user?.store_id}/ingredients`)
        .then((res) => {
          const map: Record<string, string[]> = {};
          res.data.forEach((row: any) => {
            if (!map[row.item_name]) map[row.item_name] = [];
            map[row.item_name].push(row.ingredient_name);
          });
          setIngredientsMap(map);
        })
        .catch((err) => console.error(err));
    }
  }, [userType, user?.store_id]);

  useEffect(() => {
    if (userType === 'barista' && user?.store_id) {
      axios
        .get(`/api/coffee-shop/stores/${user.store_id}/inventory`)
        .then((res) => setInventory(res.data))
        .catch((err) => console.error('Inventory fetch error:', err));
    }
  }, [userType, user?.store_id]);

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

  function canCompleteOrder(order: BaristaOrder): boolean {
    const requiredIngredients = ingredientsMap[order.item_name];

    if (!requiredIngredients || requiredIngredients.length === 0) return true;

    for (const ingredient of requiredIngredients) {
      const inv = inventory.find((i) => i.ingredient_name === ingredient);
      if (!inv) return false;

      const available = inv.count;
      const required = 0.01 * order.quantity;
      if (available < required) return false;
    }

    return true;
  }

  if (status === 'loading' || loading) return <div>Loading...</div>;

  // CUSTOMER / STUDENT VIEW
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
          {sortedGroups.map(([key, group]) => {
            const storeClass = storeNameToClass(group.store_name);

            return (
              <article key={key} className={`order-card ${storeClass}`}>
                <div className='order-card__image-wrapper'>
                  {/* Background is set in CSS based on store-* class */}
                  <div className='order-card__image' aria-hidden='true' />
                  <span className='order-card__badge order-card__badge--id'>
                    {group.order_id ? `#${group.order_id}` : 'Order'}
                  </span>
                  <span className='order-card__badge order-card__badge--status'>
                    Completed
                  </span>
                </div>

                <div className='order-card__body'>
                  <h3 className='order-card__store'>{group.store_name}</h3>

                  <ul className='order-card__items-list'>
                    {group.items.map((item) => (
                      <li
                        key={`${group.order_id ?? 'unassigned'}-${item.name}`}
                        className='order-card__item'
                      >
                        <span className='order-card__item-main'>
                          {item.quantity}× {item.name}
                        </span>
                        <span className='order-card__item-price'>
                          ${item.subtotal.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className='order-card__footer'>
                    <span className='order-card__footer-label'>Total</span>
                    <span className='order-card__total'>
                      ${group.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  // BARISTA VIEW
  if (userType === 'barista') {
    return (
      <div className='orders-page'>
        <h1 className='orders-title'>Incoming Orders</h1>

        <div className='orders-container'>
          {baristaOrders.length === 0 ? (
            <p className='orders-empty'>No active orders right now.</p>
          ) : (
            baristaOrders.map((order) => (
              <div
                key={order.pk_order_id}
                className='order-card order-card--barista'
              >
                <h3 className='order-id'>Order #{order.order_id}</h3>
                <p className='order-barista-line'>
                  <strong>Customer:</strong> {order.username}
                </p>
                <p className='order-barista-line'>
                  <strong>Item:</strong> {order.item_name}
                </p>
                <p className='order-barista-line'>
                  <strong>Quantity:</strong> {order.quantity}
                </p>
                <p className='order-barista-line'>
                  <strong>Status:</strong>{' '}
                  {order.completed ? 'Completed' : 'Pending'}
                </p>
                {!order.completed && (
                  <button
                    className='orders-create-btn orders-complete-btn'
                    disabled={!canCompleteOrder(order)}
                    onClick={() => handleOrderComplete(order.pk_order_id)}
                  >
                    {canCompleteOrder(order)
                      ? 'Set As Completed'
                      : 'Insufficient Inventory'}
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
