'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <>
      {/* navbar */}
      <div>
        <button onClick={() => router.push(`/auth/create`)}>Sign Up</button>
        <button onClick={() => router.push(`/auth/login`)}>Login In</button>
      </div>
      <div>
        <Image
          src='/images/SJCoffeeLogo.png'
          width={500}
          height={500}
          alt='logo'
        />
        <h1>WELCOME DOWNTOWN SAN JOSE COFFEE SHOP MANAGEMENT PLATFORM</h1>
      </div>
    </>
  );
}
