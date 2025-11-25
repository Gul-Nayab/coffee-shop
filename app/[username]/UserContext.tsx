//SJSU CMPE 138 FALL 2025 TEAM 2
'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import axios from 'axios';

interface User {
  name: string;
  username: string;
  password: string;
  e_id?: number;
  hours?: number;
  store_id?: number;
  is_manager: boolean;
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
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  username: null,
  userType: null,
  loading: true,
  refreshUser: async () => {},
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

  const fetchUser = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/coffee-shop/users/${username}/type`
      );
      const user = response.data;
      setUser(user);
      if (user.is_manager) setUserType('manager');
      else if (user.e_id) setUserType('barista');
      else if (user.student_id) setUserType('student');
      else setUserType('customer');
    } catch (err) {
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider
      value={{ user, username, userType, loading, refreshUser: fetchUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
