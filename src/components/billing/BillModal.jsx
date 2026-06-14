import { useState } from "react";
import { COLORS } from "../../constants";
import { fmt, todayStr, now } from "../../utils";

const PAYMENT_MODES = [
  { key: "cash", label: "💵 Cash" },
  { key: "upi",  label: "📱 UPI"  },
  { key: "card", label: "💳 Card" },
];

export default function BillModal({
  table,
  order,
  subtotal,
  discountPct,
  discountAmt,
  tax,
  service,
  total,
  onSettle,
  onClose,
}) {
  const [paymentMode, setPaymentMode] = useState("cash");

  if (!table) return null;

  // ── Print bill in new window ─────────────────────────────────────────────
  function handlePrint() {
    const printWindow = window.open("", "_blank", "width=400,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Bill - ${table.label}</title>
          <style>
            body { font-family: monospace; font-size: 13px; padding: 20px; max-width: 320px; margin: 0 auto; }
            h2 { text-align: center; margin-bottom: 4px; }
            .center { text-align: center; }
            .row { display: flex; justify-content: space-between; padding: 4px 0; }
            .divider { border-top: 1px dashed #999; margin: 8px 0; }
            .bold { font-weight: bold; }
            .total-row { font-size: 15px; font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>🍽️ SpiceRoute</h2>
          <p class="center" style="color:#666; margin:0 0 4px">${todayStr()} · ${now()}</p>
          <p class="center" style="margin:0 0 12px">Table: <strong>${table.label}</strong></p>
          <div class="divider"></div>
          <div class="row bold"><span>Item</span><span>Qty × Rate = Amt</span></div>
          <div class="divider"></div>
          ${order.map(item => `
            <div class="row">
              <span>${item.name}</span>
              <span>${item.qty} × ₹${item.price} = ₹${item.price * item.qty}</span>
            </div>
          `).join("")}
          <div class="divider"></div>
          <div class="row"><span>Subtotal</span><span>₹${subtotal.toFixed(2)}</span></div>
          ${discountPct > 0 ? `<div class="row"><span>Discount (${discountPct}%)</span><span>-₹${discountAmt.toFixed(2)}</span></div>` : ""}
          <div class="row"><span>GST (5%)</span><span>₹${tax.toFixed(2)}</span></div>
          <div class="row"><span>Service (10%)</span><span>₹${service.toFixed(2)}</span></div>
          <div class="divider"></div>
          <div class="row total-row"><span>TOTAL</span><span>₹${total.toFixed(2)}</span></div>
          <div class="divider"></div>
          <p class="center" style="margin-top:16px; color:#666;">Thank you for visiting!<br/>Please visit again 🙏</p>
          <script>window.onload = () => { window.print(); window.close(); }<\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      zIndex: 1000, display: "flex", alignItems: "center",
      justifyContent: "center", padding: 16,
    }}>
      <div style={{
        background: COLORS.white, borderRadius: 18,
        width: "100%", maxWidth: 420, maxHeight: "90vh", overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{
          background: COLORS.primary, padding: "20px 24px",
          borderRadius: "18px 18px 0 0", color: "#fff",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 2 }}>🍽️ SpiceRoute</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>{todayStr()} · {now()}</div>
            <div style={{ fontWeight: 600, marginTop: 6, fontSize: 15 }}>{table.label}</div>
          </div>
          {/* Print button */}
          <button
            onClick={handlePrint}
            title="Print Bill"
            style={{
              background: "rgba(255,255,255,0.2)", border: "none",
              borderRadius: 8, color: "#fff", cursor: "pointer",
              padding: "6px 12px", fontSize: 13, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 4,
            }}
          >
            🖨️ Print
          </button>
        </div>

        <div style={{ padding: 24 }}>
          {/* Items table */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16, fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                {["Item", "Qty", "Rate", "Amt"].map(h => (
                  <th key={h} style={{
                    padding: "6px 0",
                    textAlign: h === "Item" ? "left" : "right",
                    color: COLORS.gray, fontWeight: 600,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {order.map(item => (
                <tr key={item.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: "8px 0" }}>{item.name}</td>
                  <td style={{ textAlign: "right" }}>{item.qty}</td>
                  <td style={{ textAlign: "right" }}>{fmt(item.price)}</td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(item.price * item.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals breakdown */}
          {[
            ["Subtotal", fmt(subtotal)],
            ...(discountPct > 0 ? [[`Discount (${discountPct}%)`, `-${fmt(discountAmt)}`]] : []),
            ["GST (5%)", fmt(tax)],
            ["Service (10%)", fmt(service)],
          ].map(([l, v]) => (
            <div key={l} style={{
              display: "flex", justifyContent: "space-between",
              marginBottom: 6, fontSize: 13, color: COLORS.gray,
            }}>
              <span>{l}</span><span>{v}</span>
            </div>
          ))}

          <div style={{
            display: "flex", justifyContent: "space-between",
            borderTop: `2px solid ${COLORS.dark}`, paddingTop: 10, marginTop: 6,
            fontWeight: 700, fontSize: 18,
          }}>
            <span>Total</span>
            <span style={{ color: COLORS.primary }}>{fmt(total)}</span>
          </div>

          {/* Payment mode */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray, marginBottom: 8 }}>
              PAYMENT MODE
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {PAYMENT_MODES.map(p => (
                <button key={p.key} onClick={() => setPaymentMode(p.key)} style={{
                  flex: 1, padding: "10px 0", borderRadius: 8, cursor: "pointer",
                  border: `1.5px solid ${paymentMode === p.key ? COLORS.primary : COLORS.border}`,
                  background: paymentMode === p.key ? COLORS.primaryLight : COLORS.white,
                  color: paymentMode === p.key ? COLORS.primary : COLORS.dark,
                  fontWeight: paymentMode === p.key ? 600 : 400,
                  fontSize: 13, touchAction: "manipulation",
                }}>{p.label}</button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: "12px 0", borderRadius: 10,
              border: `1.5px solid ${COLORS.border}`,
              background: "transparent", color: COLORS.dark,
              fontWeight: 600, cursor: "pointer", touchAction: "manipulation",
            }}>Cancel</button>
            <button onClick={() => onSettle(paymentMode)} style={{
              flex: 2, padding: "12px 0", borderRadius: 10, border: "none",
              background: COLORS.primary, color: "#fff",
              fontWeight: 700, fontSize: 15, cursor: "pointer",
              touchAction: "manipulation",
            }}>Settle Bill ✓</button>
          </div>
        </div>
      </div>
    </div>
  );
}
