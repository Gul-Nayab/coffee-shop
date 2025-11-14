import { SessionProvider } from 'next-auth/react';
import { UserProvider } from './UserContext';
import NavBar from './components/Navbar';

export default function UsernameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <SessionProvider>
          <UserProvider>
            <NavBar />
            {children}
          </UserProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
