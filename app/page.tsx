/*SJSU CMPE 138 FALL 2025 TEAM 2*/
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { CSSProperties } from 'react';

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    width: '100vw',
    overflowX: 'hidden',
  },

  card: {
  position: 'relative',
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  backgroundImage: "url('/images/HomeScreen.jpg')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  },

  overlay: {
    position: 'absolute',
    inset: 0,
    // gradient back on the left: light → darker
    background:
      'linear-gradient(to right, rgba(249,246,234,0.90) 0%, rgba(0,0,0,0.20) 40%, rgba(0,0,0,0.55) 100%)',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 32px',
  },
  nav: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px',
  },
  navButtonBase: {
    border: 'none',
    padding: '10px 30px',
    borderRadius: 999,
    fontWeight: 700,
    fontSize: '0.95rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    boxShadow: '0 12px 28px rgba(0,0,0,0.25)',
  },
  navButtonSignIn: {
    backgroundColor: '#fff6ea', // cream
    color: '#111111',
  },
  navButtonJoin: {
    backgroundColor: '#f9943b', // orange
    color: '#ffffff',
  },
  contentRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexGrow: 1,
    columnGap: '36px',
    paddingTop: '32px',
    paddingRight: '32px',
  },

  // LOGO – just the logo over the image
  logoPanel: {
    flex: '0 0 400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  logoImage: {
    maxWidth: '400px',
    height: 'auto',
  },

  // TEXT AREA
  textArea: {
    position: 'relative',
    flex: 1,
    marginLeft: '10px',
    color: '#fff6ea', // cream
    fontFamily: 'Georgia, "Times New Roman", serif',
  },

  // DTSJ – bigger & bolder, right above the title block
  dtsj: {
    marginTop: '-30px',
    fontSize: '10rem',
    fontWeight: 900,
    color: '#f9943b', // orange
    letterSpacing: '-0.08em',
    marginBottom: '-30px',
    textTransform: 'uppercase',
  },

  // "Coffee Shop" (one line) and "Finder" (next line), larger
  titleCoffeeShop: {
    fontSize: '8rem',
    fontWeight: 500,
    fontStyle: 'italic',
    lineHeight: 1.0,
    marginBottom: '-30px',
    color: '#fff6ea',
  },
  titleFinder: {
    fontSize: '8rem',
    fontWeight: 500,
    fontStyle: 'italic',
    lineHeight: 1.0,
    marginTop: '0.35rem',
    color: '#fff6ea',
    marginBottom: '-30px',
  },

  badgeWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '30px',
  },
  badge: {
    backgroundColor: '#f9943b', // orange
    color: '#fff6ea', // cream text
    padding: '18px 28px',
    borderRadius: '24px 24px 0 24px',
    fontSize: '1.25rem',
    fontWeight: 700,
    maxWidth: '420px',
    lineHeight: 1.2,
    textAlign: 'left',
    fontStyle: 'italic',
  },
};

export default function Home() {
  const router = useRouter();

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.overlay}>
          {/* Top-right buttons */}
          <header style={styles.nav}>
            <button
              style={{
                ...styles.navButtonBase,
                ...styles.navButtonSignIn,
              }}
              onClick={() => router.push('/auth/login')}
            >
              Sign in
            </button>
            <button
              style={{
                ...styles.navButtonBase,
                ...styles.navButtonJoin,
              }}
              onClick={() => router.push('/auth/create')}
            >
              Join us
            </button>
          </header>

          {/* Main content: logo + text */}
          <div style={styles.contentRow}>
            {/* Left logo */}
            <div style={styles.logoPanel}>
              <Image
                src="/images/SJCoffeeLogo.png"
                width={400}
                height={400}
                alt="DTSJ Coffee logo"
                style={styles.logoImage}
              />
            </div>

            {/* Right text section */}
            <div style={styles.textArea}>
              <div style={styles.dtsj}>DTSJ</div>

              <div style={styles.titleCoffeeShop}>Coffee Shop</div>
              <div style={styles.titleFinder}>Finder</div>

              <div style={styles.badgeWrapper}>
                <div style={styles.badge}>
                  Menus, locations<br />
                  hours, ordering,<br />
                  &amp; more
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
