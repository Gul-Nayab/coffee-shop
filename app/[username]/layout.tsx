//SJSU CMPE 138 FALL 2025 TEAM 2
'use client';
import { SessionProvider } from 'next-auth/react';
import { UserProvider } from './UserContext';
import NavBar from './components/Navbar';
import { useParams } from 'next/navigation';

export default function UsernameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { username } = useParams() as { username: string };

  if (!username) return null;

  return (
    <SessionProvider>
      <UserProvider username={username}>
        <NavBar />
        {children}
      </UserProvider>
    </SessionProvider>
  );
}
