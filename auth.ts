// auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import axios from 'axios';

async function getUserFromDb(username: string, password: string) {
  try {
    const response = await axios.get(
      `${process.env.AUTH_URL}/api/coffee-shop/users/${username}`,
      {
        timeout: 5000,
      }
    );
    console.log('Response in getUser:', response);
    const dbUser = response.data;

    if (!dbUser || !dbUser.password) return null;
    if (password !== dbUser.password) return null;

    return dbUser;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'text' },
      },
      authorize: async (credentials) => {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await getUserFromDb(
          credentials.username,
          credentials.password
        );

        if (!user) throw new Error('Invalid credentials');

        return {
          id: user.username,
          name: user.username,
        };
      },
    }),
  ],
});
