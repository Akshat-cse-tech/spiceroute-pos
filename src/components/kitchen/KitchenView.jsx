import { useState } from "react";
import { COLORS } from "../../constants";
import { elapsed } from "../../utils";
import { Badge } from "../ui";

export default function KitchenView({ tables }) {
  // Track which table orders have been marked as "done" in kitchen
  const [doneIds, setDoneIds] = useState(new Set());

  const activeTables = tables.filter(t => t.status === "occupied" && t.order.length > 0);
  const pendingTables = activeTables.filter(t => !doneIds.has(t.id));
  const doneTables    = activeTables.filter(t =>  doneIds.has(t.id));

  function toggleDone(id) {
    setDoneIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>🍳 Kitchen Display</div>
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{
            fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20,
            background: "#FEF3C7", color: COLORS.amber,
          }}>
            {pendingTables.length} Pending
          </span>
          <span style={{
            fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20,
            background: "#DCFCE7", color: COLORS.green,
          }}>
            {doneTables.length} Done
          </span>
        </div>
      </div>

      {activeTables.length === 0 ? (
        <div style={{ textAlign: "center", padding: 80, color: COLORS.gray }}>
          <div style={{ fontSize: 48 }}>🍽️</div>
          <div style={{ marginTop: 12, fontWeight: 600, fontSize: 16 }}>No active orders</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Orders will appear here when tables are occupied</div>
        </div>
      ) : (
        <>
          {/* ── Pending orders ── */}
          {pendingTables.length > 0 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray, marginBottom: 10 }}>
                PENDING
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 16, marginBottom: 28,
              }}>
                {pendingTables.map(t => <KitchenCard key={t.id} t={t} done={false} onToggle={toggleDone} />)}
              </div>
            </>
          )}

          {/* ── Done orders ── */}
          {doneTables.length > 0 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray, marginBottom: 10 }}>
                DONE
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 16,
              }}>
                {doneTables.map(t => <KitchenCard key={t.id} t={t} done={true} onToggle={toggleDone} />)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function KitchenCard({ t, done, onToggle }) {
  const mins = elapsed(t.openedAt);
  const urgencyColor = done ? COLORS.border
    : mins > 30 ? COLORS.red
    : mins > 15 ? COLORS.amber
    : COLORS.border;

  const timeBg    = done ? "#F1F5F9"
    : mins > 30 ? "#FEE2E2"
    : mins > 15 ? "#FEF3C7"
    : "#DCFCE7";

  const timeColor = done ? COLORS.gray
    : mins > 30 ? COLORS.red
    : mins > 15 ? COLORS.amber
    : COLORS.green;

  return (
    <div style={{
      background: COLORS.white,
      borderRadius: 14,
      padding: 18,
      border: `2px solid ${urgencyColor}`,
      opacity: done ? 0.65 : 1,
      transition: "all 0.2s",
    }}>
      {/* Card header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{t.label}</div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{
            fontSize: 12, fontWeight: 600, padding: "3px 10px",
            borderRadius: 20, background: timeBg, color: timeColor,
          }}>
            {done ? "✓ Done" : `${mins}m`}
          </div>
        </div>
      </div>

      {/* Order items */}
      {t.order.map(item => (
        <div key={item.id} style={{
          display: "flex", justifyContent: "space-between",
          padding: "7px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 14,
        }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Badge veg={item.veg} />
            <span style={{ textDecoration: done ? "line-through" : "none", color: done ? COLORS.gray : COLORS.dark }}>
              {item.name}
            </span>
          </div>
          <span style={{ fontWeight: 700, color: done ? COLORS.gray : COLORS.dark }}>×{item.qty}</span>
        </div>
      ))}

      <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: COLORS.gray }}>
          {t.order.reduce((s, o) => s + o.qty, 0)} portions · {t.capacity}p table
        </div>
        {/* Mark done / undo button */}
        <button
          onClick={() => onToggle(t.id)}
          style={{
            fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20,
            border: `1.5px solid ${done ? COLORS.border : COLORS.green}`,
            background: done ? COLORS.white : "#DCFCE7",
            color: done ? COLORS.gray : COLORS.green,
            cursor: "pointer",
            touchAction: "manipulation",
          }}
        >
          {done ? "↩ Undo" : "✓ Mark Done"}
        </button>
      </div>
    </div>
  );
}
