import { COLORS } from "../../constants";
import { fmt, elapsed } from "../../utils";
import { Stat } from "../ui";

export default function TablesView({ tables, todayOrders, onTableClick }) {
  const occupiedCount = tables.filter(t => t.status === "occupied").length;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>🪑 Table Status</div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <Stat label="Total Tables"  value={tables.length} />
        <Stat label="Occupied"      value={occupiedCount}                 color={COLORS.red} />
        <Stat label="Free"          value={tables.length - occupiedCount} color={COLORS.green} />
        <Stat label="Today's Bills" value={todayOrders}                   color={COLORS.primary} />
      </div>

      {/* Table grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 12,
      }}>
        {tables.map((t, index) => {
          const isOccupied = t.status === "occupied";
          const mins = elapsed(t.openedAt);
          const runningTotal = t.order.reduce((s, o) => s + o.price * o.qty, 0);

          // Color coding: green = free, amber = 15+ mins, red = 30+ mins
          const borderColor = !isOccupied
            ? COLORS.border
            : mins > 30 ? COLORS.red
            : mins > 15 ? COLORS.amber
            : "#FCA5A5";

          const bgColor = !isOccupied
            ? COLORS.white
            : mins > 30 ? "#FEF2F2"
            : mins > 15 ? "#FFFBEB"
            : "#FFF5F5";

          return (
            <div
              key={t.id}
              // ✅ FIX: App.jsx TablesView onTableClick expects index, not object
              onClick={() => onTableClick(index)}
              style={{
                borderRadius: 14,
                border: `2px solid ${borderColor}`,
                background: bgColor,
                padding: 20,
                cursor: "pointer",
                textAlign: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                transition: "all 0.15s",
                WebkitTapHighlightColor: "transparent",
                userSelect: "none",
              }}
            >
              {/* Status dot */}
              <div style={{
                width: 12, height: 12, borderRadius: "50%",
                background: isOccupied
                  ? (mins > 30 ? COLORS.red : mins > 15 ? COLORS.amber : "#F87171")
                  : COLORS.green,
                margin: "0 auto 8px",
              }} />

              <div style={{ fontWeight: 700, fontSize: 20 }}>{t.label}</div>
              <div style={{ fontSize: 12, color: COLORS.gray, marginBottom: 6 }}>
                {t.capacity} seats
              </div>

              {isOccupied ? (
                <>
                  <div style={{
                    fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                    background: mins > 30 ? "#FEE2E2" : mins > 15 ? "#FEF3C7" : "#FEE2E2",
                    color: mins > 30 ? COLORS.red : mins > 15 ? COLORS.amber : COLORS.red,
                    display: "inline-block", marginBottom: 4,
                  }}>
                    {mins}m · {t.order.length} items
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.primary, fontWeight: 700 }}>
                    {fmt(runningTotal)}
                  </div>
                </>
              ) : (
                <div style={{
                  fontSize: 11, fontWeight: 600, color: COLORS.green,
                  padding: "2px 8px", borderRadius: 20,
                  background: "#DCFCE7", display: "inline-block",
                }}>
                  Available
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
