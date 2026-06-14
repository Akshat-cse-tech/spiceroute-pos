import { COLORS } from "../../constants";

const FEATURES = [
  { icon: "🧾", title: "Smart Billing", desc: "Manage table orders, apply discounts, calculate GST & service charges — all in a few taps." },
  { icon: "🪑", title: "Table Management", desc: "Real-time overview of all 12 tables, occupancy status, and quick navigation to any table." },
  { icon: "👨‍🍳", title: "Kitchen Display", desc: "Live KOT feed for the kitchen. Staff see new orders instantly without needing paper slips." },
  { icon: "📊", title: "Reports & Analytics", desc: "Daily revenue breakdown, payment mode split, per-table performance, and item-level insights." },
  { icon: "🥗", title: "Veg / Non-Veg Indicators", desc: "FSSAI-compliant veg / non-veg badges on every menu item for clarity and compliance." },
  { icon: "💨", title: "Blazing Fast", desc: "Built with React 19 + Vite for near-instant load times and a smooth, lag-free experience." },
];

const STACK = [
  { label: "React 19", color: "#61DAFB" },
  { label: "Vite 8", color: "#646CFF" },
  { label: "JavaScript (ESM)", color: "#F7DF1E" },
  { label: "CSS-in-JS", color: COLORS.primary },
  { label: "Vercel", color: "#000" },
];

const TEAM = [
  { name: "Akshat", role: "Developer & Designer", emoji: "👨‍💻" },
];

export default function AboutView({ onLogout, user }) {
  return (
    <div style={{
      maxWidth: 860, margin: "0 auto", padding: "32px 20px 60px",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* ── Hero ── */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, #c73e0f 100%)`,
        borderRadius: 20, padding: "40px 36px", color: "#fff",
        marginBottom: 36, position: "relative", overflow: "hidden",
      }}>
        {/* decorative circles */}
        <div style={{
          position: "absolute", top: -40, right: -40, width: 200, height: 200,
          borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: 200, width: 160, height: 160,
          borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none",
        }} />
        <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800 }}>SpiceRoute POS</h1>
        <p style={{ margin: "10px 0 0", fontSize: 16, opacity: 0.9, maxWidth: 540, lineHeight: 1.6 }}>
          A modern, lightweight Point-of-Sale system built for Indian restaurants.
          Fast, intuitive, and designed for real-world restaurant workflows.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 600 }}>
            v0.0.0
          </span>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 600 }}>
            Open Source
          </span>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 600 }}>
            🇮🇳 Made in India
          </span>
        </div>
      </div>

      {/* ── Features ── */}
      <section style={{ marginBottom: 36 }}>
        <SectionTitle>✨ Features</SectionTitle>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{
              background: "#fff", borderRadius: 14, padding: "20px 20px",
              border: `1px solid ${COLORS.border}`,
              transition: "box-shadow 0.2s",
            }}
              onMouseOver={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(232,82,26,0.10)")}
              onMouseOut={e => (e.currentTarget.style.boxShadow = "none")}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.dark, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: COLORS.gray, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section style={{ marginBottom: 36 }}>
        <SectionTitle>🛠️ Tech Stack</SectionTitle>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {STACK.map(s => (
            <div key={s.label} style={{
              background: "#fff", border: `1.5px solid ${COLORS.border}`,
              borderRadius: 24, padding: "6px 16px", fontSize: 13, fontWeight: 600,
              color: COLORS.dark, display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, display: "inline-block" }} />
              {s.label}
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ marginBottom: 36 }}>
        <SectionTitle>⚡ How It Works</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            ["1", "Select a table from the sidebar or the Tables view."],
            ["2", "Browse the menu by category and add items to the order."],
            ["3", "Send a KOT to the kitchen and track live orders."],
            ["4", "When the customer is ready, generate a bill — apply discount, choose payment mode."],
            ["5", "Settle the bill. The table frees up and revenue is recorded in Reports."],
          ].map(([num, step]) => (
            <div key={num} style={{
              display: "flex", alignItems: "flex-start", gap: 14,
              background: "#fff", border: `1px solid ${COLORS.border}`,
              borderRadius: 12, padding: "14px 16px",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", background: COLORS.primaryLight,
                color: COLORS.primary, fontWeight: 800, fontSize: 13,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>{num}</div>
              <div style={{ fontSize: 14, color: COLORS.dark, lineHeight: 1.6 }}>{step}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team / Credits ── */}
      <section style={{ marginBottom: 36 }}>
        <SectionTitle>👥 Team</SectionTitle>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {TEAM.map(m => (
            <div key={m.name} style={{
              background: "#fff", borderRadius: 14, padding: "20px 24px",
              border: `1px solid ${COLORS.border}`, textAlign: "center", minWidth: 160,
            }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>{m.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.dark }}>{m.name}</div>
              <div style={{ fontSize: 12, color: COLORS.gray, marginTop: 2 }}>{m.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Signed-in user info + logout ── */}
      {user && (
        <div style={{
          background: COLORS.primaryLight, borderRadius: 14, padding: "18px 22px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 13, color: COLORS.gray }}>Logged in as</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.dark }}>{user.name}</div>
            <div style={{ fontSize: 12, color: COLORS.primary, textTransform: "capitalize" }}>{user.role}</div>
          </div>
          <button onClick={onLogout} style={{
            padding: "8px 20px", borderRadius: 10, border: `1.5px solid ${COLORS.primary}`,
            background: "#fff", color: COLORS.primary, fontWeight: 700, fontSize: 14,
            cursor: "pointer",
          }}>Sign Out</button>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 style={{
      fontSize: 18, fontWeight: 700, color: "#1A1A2E",
      marginBottom: 16, marginTop: 0,
      display: "flex", alignItems: "center", gap: 8,
    }}>{children}</h2>
  );
}
