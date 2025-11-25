'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUser } from '../UserContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Label,
} from 'recharts';

import axios from 'axios';
import '@/app/styles/Finances.css';
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

  async function setNewBudget(store_id: number, newBudget: number) {
    console.log('store_id:', store_id, 'budget: ', newBudget);
    try {
      const response = await axios.patch(
        `/api/coffee-shop/stores/${store_id}/finances`,
        { budget: newBudget },
        {
          timeout: 5000,
        }
      );
      await getStoreBudget(store_id);
      alert(`${response.data.message}`);
    } catch (error) {
      console.error(error);
    }
  }

  if (status === 'loading' || loading) return <div>Loading...</div>;
  return (
    <div className="finance-page">
      <div className="finance-inner">
        <h1 className="finance-title"> Finance Overview</h1>
        <p className="finance-subtitle">
            Track your coffee shop’s financial health and inventory performance.
        </p>
        <div>
          {' '}
          {/*This div shows total earning and budget */}
          <div className="finance-section-label">Money Stats</div>
          <div className="finance-grid">
            <div className="finance-card">
              <div className="finance-card-title">CURRENT BUDGET</div>
              <div className="finance-card-value">${budget}</div>
              {/*If button is clicked, show number input with set and cancel buttons */}
              {showBudgetForm ? (
                <div  className="finance-budget-form"/*style={{ display: 'flex', gap: '4px' }}*/>
                  <input
                    type='number'
                    min='0'
                    value={newBudgetValue || budget}
                    onChange={(e) => setNewBudgetValue(parseFloat(e.target.value))}
                    style={{ width: '80px' }}
                    placeholder='new budget'
                  />
                  <button className="finance-btn"
                    onClick={() => {
                      setNewBudget(earnings[0].store_id, newBudgetValue);
                      setNewBudgetValue(null);
                      setShowBudgetForm(false);
                    }}
                  >
                    Set
                  </button>
                  <button className="finance-btn"
                    style={{ background: '#b76e3b' }}
                    onClick={() => {
                      setShowBudgetForm(false);
                      setNewBudgetValue(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button className="finance-btn"
                  onClick={() => setShowBudgetForm(true)}>
                  {/*The actual set new budget button*/}
                  Set New Budget
                </button>
              )}
            </div>
          
            <div className="finance-card">
              <div className="finance-card-title">EARNINGS SO FAR</div>
              <div className="finance-card-value"> 
                ${earningStats.total_earned.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="finance-section-label">Item Stats</div>
          <div className="item-grid">
            <div className="item-small-card">
              <div className="item-small-label">Items sold so far</div>
              <div className="item-small-value">{earningStats.total_sold}</div>
            </div>

            <div className="item-chart-card">
              <div className="item-chart-title">Item Popularity</div>
              <div className="item-chart-sub">
                Sales performances across product categories.
              </div>
              {/**graph to show how many of each item is sold to guage item popularity */}
                <BarChart width={'90%'} height={350} data={earnings} margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='item_name' >
                    <Label value='Item Name' offset={7} position="bottom" />
                  </XAxis>
                  <YAxis>
                    <Label
                      value='Number sold'
                      angle={-90}
                      position='insideLeft'
                      style={{ textAnchor: 'middle' }}
                    />
                  </YAxis>
                  <Tooltip />
                  <Bar dataKey='item_count' fill='#8884d8' />
                </BarChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Earnings;
