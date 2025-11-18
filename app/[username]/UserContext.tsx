'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

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

type UserType = 'customer' | 'barista' | 'manager' | 'student';

interface UserContextType {
  user: User | null;
  username: string | null;
  userType: UserType | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  username: null,
  userType: null,
  loading: true,
});

export function UserProvider({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>(username);
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
        if (user.employee_id && user.salary) setUserType('manager');
        else if (user.employee_id) setUserType('barista');
        else if (user.student_id) setUserType('student');
        else setUserType('customer');
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [username]);

  return (
    <UserContext.Provider value={{ user, username, userType, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
