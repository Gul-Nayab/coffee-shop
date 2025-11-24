"use client";

import { useState } from "react";
import Image from "next/image";
import { Work_Sans } from "next/font/google";
import Link from "next/link";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

type Tab = "customer" | "employee";

const COLORS = {
  brown: "#573425",
  cream: "#fffdf5",
  banner: "#e38933",
  divider: "#4c352b",
};

const FIELD_WIDTH = 400;
const FIELD_HEIGHT = 54;
const RADIUS = 14;

export default function CreateAccountPage() {
  const [tab, setTab] = useState<Tab>("customer");

// page container
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

  const tabsWrap: React.CSSProperties = {
    display: "inline-flex",
    border: `2px solid ${COLORS.brown}`,
    borderRadius: 20,
    overflow: "hidden",
    background: COLORS.cream,
  };

  const tabBtn = (active: boolean): React.CSSProperties => ({
    padding: "10px 18px",
    fontWeight: 800,
    fontSize: 15,
    border: "none",
    cursor: "pointer",
    background: active ? COLORS.brown : "transparent",
    color: active ? "#fff" : COLORS.brown,
  });

  const inner: React.CSSProperties = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px 0 24px",
  };

  const sectionTitle: React.CSSProperties = {
    margin: "18px 0 12px 0",
    fontSize: 20,
    fontWeight: 800,
    color: COLORS.brown,
    textAlign: "center",
    width: FIELD_WIDTH,
  };

  const groupTitle: React.CSSProperties = {
    margin: "18px 0 10px 0",
    fontSize: 16,
    fontWeight: 800,
    color: COLORS.brown,
    textAlign: "left",
    width: FIELD_WIDTH,
  };

  // fixed-width wrapper for each field row; the control inside is width:100%
  const fieldRow: React.CSSProperties = {
    width: FIELD_WIDTH,
    marginBottom: 14,
    display: "block",
  };

  const controlBase: React.CSSProperties = {
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
    fontWeight: 600,
    lineHeight: "1.2",
    boxSizing: "border-box",
    transition: "box-shadow 140ms ease, border-color 120ms ease, transform 60ms ease",
  };

  const inputBase: React.CSSProperties = { ...controlBase };

  const selectBase: React.CSSProperties = {
    ...controlBase,
    appearance: "none" as any,
    WebkitAppearance: "none",
    MozAppearance: "none",
    backgroundImage:
      "url(\"data:image/svg+xml;utf8,<svg fill='%23573425' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    backgroundSize: "16px",
    paddingRight: 40, // room for arrow without changing overall width
  };

  const actionsRow: React.CSSProperties = {
    marginTop: 16,
    display: "flex",
    justifyContent: "flex-end",
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
    marginTop: 10,
    textAlign: "center",
    fontSize: 12,
    color: "#7a6f69",
  };

  return (
    <div className={workSans.className} style={page}>
      <div style={banner}>
       <Link href="/">
          <Image
             src="/images/SJCoffeeLogo.png"
             alt="SJ Coffee Logo"
             width={56}
             height={56}
              style={{ cursor: "pointer" }}
          />
        </Link>

      </div>
      <div style={brownLine} />
      <div style={titleWrap}>
        <h1 style={title}>Create an account</h1>
      </div>

      <div style={cardRow}>
        <div style={card}>
          <div style={{ paddingTop: 16, paddingBottom: 8 }}>
            <div style={tabsWrap}>
              <button
                style={tabBtn(tab === "customer")}
                onClick={() => setTab("customer")}
                type="button"
              >
                Customer
              </button>
              <button
                style={tabBtn(tab === "employee")}
                onClick={() => setTab("employee")}
                type="button"
              >
                Employee
              </button>
            </div>
          </div>

          <div style={inner}>
            {tab === "customer" ? (
              <CustomerForm
                fieldRow={fieldRow}
                inputBase={inputBase}
                sectionTitle={sectionTitle}
                groupTitle={groupTitle}
              />
            ) : (
              <EmployeeForm
                fieldRow={fieldRow}
                inputBase={inputBase}
                selectBase={selectBase}
                sectionTitle={sectionTitle}
                groupTitle={groupTitle}
              />
            )}

            <div style={actionsRow}>
              <button
                style={cta}
                className="primary-btn"
                type="button"
                onClick={() => alert("Submit (wire up later)")}
              >
                Create Account
              </button>
            </div>
            <p style={helper}>* indicates required field</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .primary-btn:hover { filter: brightness(0.98); }
        .primary-btn:active { transform: translateY(1px); }

        input:focus, select:focus {
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

/* =================== Customer Form =================== */
function CustomerForm({
  fieldRow,
  inputBase,
  sectionTitle,
  groupTitle,
}: any) {
  return (
    <form>
      <p style={sectionTitle}>Create Customer Account</p>

      <p style={groupTitle}>Personal Information</p>
      <div style={fieldRow}><input style={inputBase} placeholder="* Full Name" /></div>
      <div style={fieldRow}><input style={inputBase} placeholder="Phone Number" /></div>
      <div style={fieldRow}><input style={inputBase} placeholder="SJSU ID" /></div>

      <p style={groupTitle}>Account Security</p>
      <div style={fieldRow}><input style={inputBase} placeholder="* Username" /></div>
      <div style={fieldRow}><input type="password" style={inputBase} placeholder="* Password" /></div>
    </form>
  );
}

/* =================== Employee Form =================== */
function EmployeeForm({
  fieldRow,
  inputBase,
  selectBase,
  sectionTitle,
  groupTitle,
}: any) {
  return (
    <form>
      <p style={sectionTitle}>Create Employee Account</p>

      <p style={groupTitle}>Personal Information</p>
      <div style={fieldRow}>
        <select defaultValue="" style={selectBase}>
          <option value="" disabled>* Role</option>
          <option>Barista</option>
          <option>Manager</option>
        </select>
      </div>

      <div style={fieldRow}><input style={inputBase} placeholder="* Full Name" /></div>

      <div style={fieldRow}>
        <select defaultValue="" style={selectBase}>
          <option value="" disabled>* Store</option>
          <option>Market St.</option>
          <option>Santa Clara St.</option>
          <option>San Pedro Sq.</option>
        </select>
      </div>

      <p style={groupTitle}>Account Security</p>
      <div style={fieldRow}><input style={inputBase} placeholder="* Username" /></div>
      <div style={fieldRow}><input type="password" style={inputBase} placeholder="* Password" /></div>
    </form>
  );
}
