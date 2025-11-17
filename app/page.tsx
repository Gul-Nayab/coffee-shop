import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* navbar */}
      <div>
        <Image
          src='/SJCoffeeLogo.png'
          width={100}
          height={100}
          alt='Picture of the author'
        />
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
          src='/SJCoffeeLogo.png'
          width={500}
          height={500}
          alt='Picture of the author'
        />
        <h1>WELCOME DOWNTOWN SAN JOSE COFFEE SHOP MANAGEMENT PLATFORM</h1>
      </div>
    </>
  );
}
