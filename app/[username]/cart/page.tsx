'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUser } from '../UserContext';
import Menu from '../components/Menu';
import Modal from '../components/Modal';
import axios from 'axios';
import '@/app/styles/Cart.css';

interface MenuItem {
  store_id: number;
  item_name: string;
  ingredients: string[];
  price: string;
  quantity?: number;
}

interface Store {
  store_id: number;
  name: string;
}

export default function CartPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { username, userType, loading } = useUser();

  const [cart, setCart] = useState<MenuItem[]>([]);
  const [storeId, setStoreId] = useState<number | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [isOrdering, setIsOrdering] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    'cancel' | 'change' | null
  >(null);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      const parsed: MenuItem[] = JSON.parse(stored);
      const normalized = parsed.map((i) => ({
        ...i,
        quantity: i.quantity ?? 1,
      }));
      setCart(normalized);
      if (normalized.length > 0) setStoreId(normalized[0].store_id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
    if (userType === 'manager') router.push('/auth/login');
  }, [status, router, userType]);

  useEffect(() => {
    if (cart.length === 0) {
      axios
        .get('/api/coffee-shop/stores')
        .then((res) => setStores(res.data))
        .catch(console.error);
    }
  }, [cart.length]);

  function handleRemove(itemName: string) {
    setCart(cart.filter((item) => item.item_name !== itemName));
  }

  function handleAddItem(newItem: MenuItem) {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.item_name === newItem.item_name
      );
      if (existingIndex !== -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + 1,
        };
        return updated;
      } else {
        return [...prevCart, { ...newItem, quantity: 1 }];
      }
    });
  }

  function handleCancelOrder() {
    setConfirmAction('cancel');
  }

  function handleChangeStore() {
    setConfirmAction('change');
  }

  function confirmActionHandler() {
    if (confirmAction) {
      localStorage.removeItem('cart');
      setCart([]);
      setStoreId(null);
      setIsOrdering(false);
      setConfirmAction(null);
    }
  }

  const discountRate = userType === 'student' ? 0.9 : 1;

  const total = cart.reduce(
    (sum, i) => sum + parseFloat(i.price) * (i.quantity ?? 1) * discountRate,
    0
  );

  async function handleSubmitOrder() {
    try {
      console.log(cart);
      await axios.post(`/api/coffee-shop/users/${username}/orders`, {
        items: cart,
        type: userType,
      });
      alert('Order placed successfully!');
      localStorage.removeItem('cart');
      setCart([]);
      setIsOrdering(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Failed to submit order.');
    }
  }

  if (status === 'loading' || loading) return <div>Loading...</div>;

  return (
    <div className='cart-page'>
      <h1 className='cart-title'>Your Cart</h1>

      <div className='cart-layout'>
        {/* LEFT SIDE */}
        <div className='cart-left'>
          {!isOrdering && cart.length === 0 ? (
            <div className='store-select'>
              <h3>Select a Store</h3>
              <select
                value={storeId ?? ''}
                onChange={(e) => setStoreId(Number(e.target.value))}
              >
                <option value=''>-- Choose a store --</option>
                {stores.map((s) => (
                  <option key={s.store_id} value={s.store_id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <button
                disabled={!storeId}
                onClick={() => setIsOrdering(true)}
                className='begin-btn'
              >
                Begin Order
              </button>
            </div>
          ) : (
            <div>
              {cart.length === 0 ? (
                <p className='empty-cart-message'>
                  Your cart is empty. Click items from the menu to add them.
                </p>
              ) : (
                <table className='cart-table'>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => {
                      const discountedPrice =
                        parseFloat(item.price) * discountRate;
                      const totalItemPrice =
                        discountedPrice * (item.quantity ?? 1);
                      return (
                        <tr key={item.item_name}>
                          <td>
                            {item.item_name}
                            {item.quantity && item.quantity > 1 && (
                              <span className='quantity-text'>
                                × {item.quantity}
                              </span>
                            )}
                          </td>
                          <td>${totalItemPrice.toFixed(2)}</td>
                          <td>
                            <button
                              onClick={() =>
                                setCart((prev) =>
                                  prev
                                    .map((i) =>
                                      i.item_name === item.item_name
                                        ? {
                                            ...i,
                                            quantity: (i.quantity || 1) - 1,
                                          }
                                        : i
                                    )
                                    .filter((i) => (i.quantity ?? 1) > 0)
                                )
                              }
                            >
                              –
                            </button>
                            <button
                              onClick={() =>
                                setCart((prev) =>
                                  prev.map((i) =>
                                    i.item_name === item.item_name
                                      ? {
                                          ...i,
                                          quantity: (i.quantity || 1) + 1,
                                        }
                                      : i
                                  )
                                )
                              }
                              className='plus-btn'
                            >
                              +
                            </button>
                            <button
                              onClick={() => handleRemove(item.item_name)}
                              className='delete-btn'
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              <div className='cart-summary'>
                <strong>Total: </strong>${total.toFixed(2)}
                {userType === 'student' && (
                  <span className='discount-text'>
                    {' '}
                    (10% student discount applied)
                  </span>
                )}
              </div>

              <div className='cart-actions'>
                <button onClick={() => setIsOrdering(true)}> Open Menu</button>
                <button onClick={handleSubmitOrder}>Submit Order</button>
                <button onClick={handleChangeStore}>Change Store</button>
                <button onClick={handleCancelOrder}>Cancel Order</button>
              </div>
            </div>
          )}
        </div>

        {isOrdering && storeId && (
          <div className='menu-panel'>
            <div className='menu-header'>
              <h3>Menu</h3>
              <button
                className='close-menu'
                onClick={() => setIsOrdering(false)}
              >
                ✕
              </button>
            </div>
            <Menu store_id={storeId} onItemClick={handleAddItem} />
          </div>
        )}
      </div>

      <Modal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title='Confirm Action'
      >
        <p>
          Are you sure you want to{' '}
          {confirmAction === 'cancel'
            ? 'cancel this order'
            : 'change to a different store'}
          ? This will clear your cart.
        </p>
        <div className='modal-actions'>
          <button onClick={confirmActionHandler}>Yes</button>
          <button onClick={() => setConfirmAction(null)}>No</button>
        </div>
      </Modal>
    </div>
  );
}
