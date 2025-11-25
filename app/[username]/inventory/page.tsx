'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUser } from '../UserContext';
import axios from 'axios';
import '@/app/styles/Inventory.css';

interface InventoryEntry {
  store_id: number;
  ingredient_name: string;
  count: number;
}

function Inventory() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, userType, loading } = useUser();

  const [inventory, setInventory] = useState<InventoryEntry[]>([]);
  const [increaseIngredientInventory, setIncreaseIngredientInventory] =
    useState<string | null>('');
  const [amountToAdd, setAmountToAdd] = useState<number>(0);

  async function getInventory() {
    try {
      const response = await axios.get(
        `/api/coffee-shop/stores/${user?.store_id}/inventory/`,
        {
          timeout: 5000,
        }
      );
      setInventory(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
    if (userType === 'customer' || userType === 'student')
      router.push('/auth/login'); //add alert
  }, [status, router, userType]);

  useEffect(() => {
    async function fetch() {
      if (user?.store_id) {
        getInventory();
      }
    }
    fetch();
  }, [user?.store_id]);

  async function addInventory(
    store_id: number,
    ingredient_name: string,
    amount_to_add: number
  ) {
    try {
      const response = await axios.patch(
        `/api/coffee-shop/stores/${user?.store_id}/inventory/`,
        {
          ingredient_name,
          amount_to_add,
        }
      );
      alert(`${response.data.message}`);
      setIncreaseIngredientInventory(null);
      setAmountToAdd(0);
      await getInventory();
    } catch (error: unknown) {
      console.error('Error adding inventory:', error);
      alert(`Error:${error}`);
    }
  }

  if (status === 'loading' || loading) return <div>Loading...</div>;
  return (
    <div className="inventory-page">
      <div className="inventory-inner">
        <h1 className="inventory-title">Current Inventory</h1>
        <p className="inventory-subtitle">View stock levels and supplies.</p>
        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th> INGREDIENT NAME </th>
                <th> AMOUNT (UNITS) </th>
                {userType === 'manager' && <th> ACTION </th>}
              </tr>
            </thead>
            <tbody>
              {inventory.map((entry, index) => (
                <tr key={`${entry.store_id}-ingred-${index}`}>
                  {/* Display ingredient and amount */}
                  <td> {entry.ingredient_name}</td>
                  <td> {entry.count}</td>

                  {/* If user is manager, show inventory buttons.
                      onclick of button, open input, on submit or cancel, 
                      close input and show button again
                  */}
                  {userType === 'manager' && (
                    <td>
                      {increaseIngredientInventory === entry.ingredient_name ? (
                        <div className="inventory-edit-form" /*style={{ display: 'flex', gap: '4px' }}*/>
                          <input
                            type='number'
                            min='0'
                            value={amountToAdd || 0}
                            onChange={(e) =>
                              setAmountToAdd(parseFloat(e.target.value))
                            }
                            style={{ width: '80px' }}
                            placeholder='Amount'
                          />
                          <button className="inventory-btn"
                            onClick={() => {
                              addInventory(
                                entry.store_id,
                                entry.ingredient_name,
                                amountToAdd
                              );
                            }}
                            disabled={amountToAdd === 0}
                          >
                            Add
                          </button>
                          <button className="inventory-btn-cancel"
                            onClick={() => setIncreaseIngredientInventory(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        //actual basic button for adding (opens input)
                        <button className="inventory-btn"
                          onClick={() =>
                            setIncreaseIngredientInventory(entry.ingredient_name)
                          }
                        >
                          Add Inventory
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default Inventory;
