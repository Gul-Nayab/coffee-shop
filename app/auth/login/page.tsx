"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Work_Sans } from "next/font/google";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const COLORS = {
  brown: "#573425",
  cream: "#fffdf5",
  banner: "#e38933",
  divider: "#4c352b",
};

const FIELD_WIDTH = 400;
const FIELD_HEIGHT = 54;
const RADIUS = 14;

export default function LoginPage() {
  const page: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundImage: "url('/images/coffee-bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const banner: React.CSSProperties = {
    backgroundColor: COLORS.banner,
    height: 72,
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
  };

  const brownLine: React.CSSProperties = { height: 4, backgroundColor: COLORS.divider };

  const titleWrap: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    paddingTop: 20,
    paddingBottom: 12,
  };

  const title: React.CSSProperties = {
    margin: 0,
    fontSize: 34,
    fontWeight: 800,
    color: "#fff",
    textShadow: "0 2px 10px rgba(0,0,0,0.28)",
  };

  const cardRow: React.CSSProperties = {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "12px 16px 40px",
  };

  const card: React.CSSProperties = {
    width: "100%",
    maxWidth: 520,
    background: "#fffdf5ee",
    border: `2px solid ${COLORS.brown}`,
    borderRadius: 20,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const inner: React.CSSProperties = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "16px 0 24px",
  };

  const sectionTitle: React.CSSProperties = {
    margin: "0 0 14px 0",
    fontSize: 22,
    fontWeight: 800,
    color: COLORS.brown,
    textAlign: "center",
    width: FIELD_WIDTH,
  };

  const groupTitle: React.CSSProperties = {
    margin: "0 0 10px 0",
    fontSize: 16,
    fontWeight: 800,
    color: COLORS.brown,
    textAlign: "left",
    width: FIELD_WIDTH,
  };

  const fieldRow: React.CSSProperties = {
    width: FIELD_WIDTH,
    marginBottom: 14,
    display: "block",
  };

  const inputBase: React.CSSProperties = {
    display: "block",
    width: "100%",
    height: FIELD_HEIGHT,
    padding: "12px 16px",
    borderRadius: RADIUS,
    border: `2px solid ${COLORS.brown}`,
    background: COLORS.cream,
    color: COLORS.brown,
    outline: "none",
    fontSize: 18,
    fontWeight: 700,
    lineHeight: "1.2",
    boxSizing: "border-box",
    transition: "box-shadow 140ms ease, border-color 120ms ease",
  };

  const actionsRow: React.CSSProperties = {
    marginTop: 8,
    display: "flex",
    justifyContent: "center",
    width: FIELD_WIDTH,
  };

  const cta: React.CSSProperties = {
    width: 160,
    height: 46,
    borderRadius: 999,
    border: "none",
    background: COLORS.brown,
    color: "#fff",
    fontWeight: 800,
    fontSize: 18,
    cursor: "pointer",
    boxShadow: "0 2px 0 #3c2a23",
  };

  const helper: React.CSSProperties = {
    marginTop: 12,
    textAlign: "center",
    fontSize: 12,
    color: "#7a6f69",
  };

  return (
    <div className={workSans.className} style={page}>
      {/* Top banner with clickable logo */}
      <div style={banner}>
        <Link href="/" aria-label="Go to home">
          <Image
            src="/images/SJCoffeeLogo.png"// file in /public
            alt="SJ Coffee Logo"
            width={56}
            height={56}
            priority
          />
        </Link>
      </div>
      <div style={brownLine} />

      {/* Page title */}
      <div style={titleWrap}>
        <h1 style={title}>Sign in to account</h1>
      </div>

      {/* Card */}
      <div style={cardRow}>
        <div style={card}>
          <div style={inner}>
            <p style={groupTitle}>* indicates required field</p>

            <div style={fieldRow}>
              <input style={inputBase} placeholder="* Username" />
            </div>
            <div style={fieldRow}>
              <input type="password" style={inputBase} placeholder="* Password" />
            </div>

            <div style={actionsRow}>
              <button
                type="button"
                className="primary-btn"
                style={cta}
                onClick={() => alert("Sign-in action (wire up later)")}
              >
                Sign in
              </button>
            </div>

            <p style={helper}>
              Don’t have an account?{" "}
              <Link href="/auth/create" style={{ color: COLORS.brown, fontWeight: 700 }}>
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* focus + placeholder styles */}
      <style jsx>{`
        .primary-btn:hover { filter: brightness(0.98); }
        .primary-btn:active { transform: translateY(1px); }
        input:focus {
          border-color: ${COLORS.brown};
          box-shadow: 0 0 0 3px rgba(87, 52, 37, 0.22);
        }
        ::placeholder {
          color: ${COLORS.brown};
          opacity: 1;
          font-size: 18px;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
