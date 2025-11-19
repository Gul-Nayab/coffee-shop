'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUser } from '../UserContext';
import axios from 'axios';

interface Item {
  store_id: number;
  item_name: string;
  item_count: number;
  earnings: string;
}

function Earnings() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, username, userType, loading } = useUser();

  const [budget, setBudget] = useState<number>(0);
  const [earnings, setEarnings] = useState<Item[]>([]);

  const [earningStats, setEarningStats] = useState({
    total_earned: 0,
    total_sold: 0,
  });
  const [showBudgetForm, setShowBudgetForm] = useState<boolean>(false);
  const [newBudgetValue, setNewBudgetValue] = useState<number | null>(null);

  async function getStoreBudget(store_id) {
    try {
      const response = await axios.get(`/api/coffee-shop/stores/${store_id}`, {
        timeout: 5000,
      });
      setBudget(response.data.budget);
    } catch (error) {
      console.error(error);
    }
  }

  async function getEarnings(store_id) {
    try {
      const response = await axios.get(
        `/api/coffee-shop/stores/${store_id}/finances`,
        {
          timeout: 5000,
        }
      );
      setEarnings(response.data);
      let total_earned = 0;
      let total_sold = 0;
      response.data.forEach((item: Item) => {
        total_earned = total_earned + parseFloat(item.earnings);
        total_sold = total_sold + item.item_count;
      });
      setEarningStats({ total_earned: total_earned, total_sold: total_sold });
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
    if (userType !== 'manager') router.push(`/${username}`);
  }, [status, router]);

  useEffect(() => {
    async function fetchBudget() {
      await getStoreBudget(user?.store_id);
    }
    async function fetchEarnings() {
      await getEarnings(user?.store_id);
    }
    fetchBudget();
    fetchEarnings();
  }, [user?.store_id]);

  function setNewBudget(store_id: number, newBudget: number) {
    console.log('store_id:', store_id, 'budget: ', newBudget);
  }

  if (status === 'loading' || loading) return <div>Loading...</div>;
  return (
    <div>
      <h1> Finance Overview</h1>
      <h4> Current Budget </h4>
      <p>${budget}</p>
      {showBudgetForm ? (
        <div style={{ display: 'flex', gap: '4px' }}>
          <input
            type='number'
            min='0'
            value={newBudgetValue || budget}
            onChange={(e) => setNewBudgetValue(parseFloat(e.target.value))}
            style={{ width: '80px' }}
            placeholder='new budget'
          />
          <button
            onClick={() => {
              setNewBudget(earnings[0].store_id, newBudgetValue);
              setNewBudgetValue(null);
              setShowBudgetForm(false);
            }}
          >
            Set
          </button>
          <button
            onClick={() => {
              setShowBudgetForm(false);
              setNewBudgetValue(null);
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={() => setShowBudgetForm(true)}>Set New Budget</button>
      )}
      <h4> Earnings so far </h4>
      <p> ${earningStats.total_earned.toFixed(2)}</p>
      <h4> Items sold so far </h4>
      <p> {earningStats.total_sold}</p>
    </div>
  );
}
export default Earnings;
