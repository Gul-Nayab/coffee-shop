import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* navbar */}
      <div>
        <button>
          <Link href={`/auth/create`} />
          Sign Up
        </button>
        <button>
          <Link href={`/auth/login`} />
          Login In
        </button>
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
