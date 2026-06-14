import { COLORS } from "../../constants";
import { todayStr } from "../../utils";

const NAV_ITEMS = [
  { key: "billing",  label: "🧾 Billing"  },
  { key: "tables",   label: "🪑 Tables"   },
  { key: "kitchen",  label: "👨‍🍳 Kitchen"  },
  { key: "reports",  label: "📊 Reports"  },
];

export default function Header({ view, setView, occupiedCount, totalTables }) {
  return (
    <header style={{
      background: COLORS.white, borderBottom: `1px solid ${COLORS.border}`,
      padding: "0 24px", display: "flex", alignItems: "center",
      justifyContent: "space-between", height: 56,
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: COLORS.primary,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>🍽️</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1 }}>SpiceRoute POS</div>
          <div style={{ fontSize: 11, color: COLORS.gray }}>{todayStr()}</div>
        </div>
      </div>

      <nav style={{ display: "flex", gap: 4 }}>
        {NAV_ITEMS.map(({ key, label }) => (
          <button key={key} onClick={() => setView(key)} style={{
            padding: "6px 14px", borderRadius: 8, border: "none",
            background: view === key ? COLORS.primaryLight : "transparent",
            color: view === key ? COLORS.primary : COLORS.gray,
            fontWeight: view === key ? 600 : 400, cursor: "pointer", fontSize: 13,
          }}>{label}</button>
        ))}
      </nav>

      <div style={{
        background: COLORS.primaryLight, color: COLORS.primary,
        fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20,
      }}>
        {occupiedCount}/{totalTables} Tables
      </div>
    </header>
  );
}
