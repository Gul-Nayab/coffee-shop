'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUser } from './UserContext';
import Link from 'next/link';
import '@/app/styles/Dashboard.css';

function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, username, userType, loading } = useUser();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, router, userType]);

  if (status === 'loading' || loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header-card">
          <div className="dashboard-header-title">
            Welcome back,
          </div>
          <Link href={`/${username}/account`} className="dashboard-header-name">{user?.name}</Link>
          {userType === 'customer' || userType === 'student' ? (
          <>
            <div className="dashboard-header-subtext">
              Ready for your daily brew? Check out nearby spots or
            </div>
            <div className="dashboard-header-subtext">
              revisit your favorites.
            </div>
          </>
          ) : (
            <div className="dashboard-header-subtext">
              Here's what is happening at the coffeeshop.
            </div>
          )}
        </div>

        <div className="dashboard-actions-grid">
          {/** the actions the user can take*/}
          {userType === 'customer' || userType === 'student' ? (
            </*div style={{ display: 'flex', gap: '0.5rem' }}*/>
              <div
                className="dashboard-action-card"
                onClick={() => router.push(`/${username}/stores`)}
              >
                <img src="/images/viewStores.jpeg" alt="Find Nearby Stores" />
                <div className="dashboard-card-text">Find Nearby Stores</div>
                <div className="dashboard-card-button">View Nearby Stores</div>
              </div>
              <div
                className="dashboard-action-card"
                onClick={() => router.push(`/${username}/orders`)}
              >
                <img src="/images/viewStores.jpeg" alt="Your Orders" />
                
                <div className="dashboard-card-text">Your Orders</div>
                <div className="dashboard-card-button">View Your Orders</div>
              </div>
            <//*div*/>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div
                className="dashboard-action-card"
                onClick={() => router.push(`/${username}/shifts`)}
              >
                <img src="/images/viewShifts.jpeg" alt="View Shifts" />
                <div className="dashboard-card-text">View Shifts</div>
                <div className="dashboard-card-button">View Your Shifts</div>
              </div>
              <div
                className="dashboard-action-card"
                onClick={() => router.push(`/${username}/inventory`)}
              >
                <img src="/images/viewInventory.jpeg" alt="View Inventory" />
                <div className="dashboard-card-text">View Inventory</div>
                <div className="dashboard-card-button">View Your Inventory</div>
              </div>
              {userType === 'manager' ? (
                <div
                  className="dashboard-action-card"
                  onClick={() => router.push(`/${username}/finances`)}
                >
                  <img src="/images/viewEarning.jpeg" alt="View Earnings" />
                  <div className="dashboard-card-text">View Earnings</div>
                  <div className="dashboard-card-button">View Your Earning</div>
                </div>
              ) : (
                <div
                  className="dashboard-action-card"
                  onClick={() => router.push(`/${username}/orders`)}
                >
                  <img src="/images/viewStores.jpeg" alt="View Upcoming Orders" />
                  <div className="dashboard-card-text">View Upcoming Orders</div>
                  <div className="dashboard-card-button">View Orders</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
