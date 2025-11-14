'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

interface User {
  name: string;
  username: string;
  password: string;
  employee_id?: number;
  hours?: number;
  store_id?: number;
  salary?: number;
  phone_number?: number;
  student_id?: number;
}

type UserType = 'customer' | 'barista' | 'manager';

interface UserContextType {
  user: User | null;
  userType: UserType | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  userType: null,
  loading: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { username } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `/api/coffee-shop/users/${username}/type`
        );
        const user = response.data;
        setUser(user);
        if (user.employee_id && user.salary) {
          setUserType('manager');
        } else if (user.employee_id) {
          setUserType('barista');
        } else {
          setUserType('customer');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [username]);

  return (
    <UserContext.Provider value={{ user, userType, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
