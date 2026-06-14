import { COLORS } from "../../constants";
import { fmt } from "../../utils";
import { Pill, btnStyle } from "../ui";

export default function OrderPanel({
  table,
  order,
  subtotal,
  discountPct,
  setDiscountPct,
  onChangeQty,
  onSendKOT,
  onOpenBill,
}) {
  if (!table) {
    return (
      <aside className="order-panel" style={{
        width: 300, borderLeft: `1px solid ${COLORS.border}`,
        background: COLORS.white, display: "flex", flexDirection: "column", flexShrink: 0,
      }}>
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", color: COLORS.gray,
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🪑</div>
          <div style={{ fontWeight: 600 }}>Select a table to start</div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="order-panel" style={{
      width: 300, borderLeft: `1px solid ${COLORS.border}`,
      background: COLORS.white, display: "flex", flexDirection: "column", flexShrink: 0,
    }}>
      {/* Table header */}
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>
            {/* ✅ FIX: was table.tableNumber — tables have .label not .tableNumber */}
            {table.label} &nbsp;
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
              background: table.status === "occupied" ? "#FEE2E2" : "#DCFCE7",
              color: table.status === "occupied" ? COLORS.red : COLORS.green,
            }}>
              {table.status === "occupied" ? "Occupied" : "Free"}
            </span>
          </div>
        </div>
        {table.openedAt && (
          <div style={{ fontSize: 12, color: COLORS.gray, marginTop: 2 }}>
            Opened at {new Date(table.openedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}
        <div style={{ fontSize: 12, color: COLORS.gray }}>
          {order.length} item type{order.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Order items */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px" }}>
        {order.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: COLORS.gray, fontSize: 13 }}>
            Tap menu items to add
          </div>
        ) : order.map(item => (
          // ✅ FIX: was item.menuItemId — items have .id
          <div key={item.id} style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
            padding: "8px 10px", borderRadius: 8, background: COLORS.lightGray,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 13 }}>{item.name}</div>
              <div style={{ fontSize: 12, color: COLORS.gray }}>₹{item.price} × {item.qty}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {/* ✅ FIX: was item.menuItemId */}
              <button onClick={() => onChangeQty(item.id, -1)} style={btnStyle}>&minus;</button>
              <span style={{ fontSize: 13, fontWeight: 600, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
              <button onClick={() => onChangeQty(item.id, 1)} style={btnStyle}>+</button>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, minWidth: 50, textAlign: "right" }}>
              {fmt(item.price * item.qty)}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {order.length > 0 && (
        <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: COLORS.gray }}>
            <span>Subtotal</span><span style={{ fontWeight: 600, color: COLORS.dark }}>{fmt(subtotal)}</span>
          </div>

          {/* Discount pills */}
          <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.gray, marginBottom: 6 }}>DISCOUNT</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
            {[0, 5, 10, 15, 20].map(d => (
              <Pill key={d} active={discountPct === d} onClick={() => setDiscountPct(d)}>
                {d === 0 ? "None" : `${d}%`}
              </Pill>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onSendKOT} style={{
              flex: 1, padding: "10px 0", borderRadius: 8,
              border: `1.5px solid ${COLORS.primary}`,
              background: "transparent", color: COLORS.primary,
              fontWeight: 600, cursor: "pointer", fontSize: 13,
              touchAction: "manipulation",
            }}>🍳 KOT</button>
            <button onClick={onOpenBill} style={{
              flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
              background: COLORS.primary, color: "#fff",
              fontWeight: 700, cursor: "pointer", fontSize: 13,
              touchAction: "manipulation",
            }}>🧾 Bill</button>
          </div>
        </div>
      )}
    </aside>
  );
}
