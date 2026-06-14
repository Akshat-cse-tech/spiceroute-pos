import { COLORS } from "../../constants";
import { fmt } from "../../utils";
import { Stat } from "../ui";

export default function ReportsView({ completedOrders, summary }) {
  const totalRevenue = summary?.totalRevenue ?? completedOrders.reduce((s, o) => s + o.total, 0);
  const billCount    = summary?.billCount    ?? completedOrders.length;
  const avgBill      = summary?.avgBill      ?? (billCount ? totalRevenue / billCount : 0);
  const tablesUsed   = summary?.tablesUsed   ?? new Set(completedOrders.map(o => o.tableId)).size;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>📊 Today's Report</div>

      <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        <Stat label="Total Revenue"   value={fmt(totalRevenue)} color={COLORS.primary} />
        <Stat label="Bills Settled"   value={billCount} />
        <Stat label="Avg. Bill Value" value={fmt(avgBill)} />
        <Stat label="Tables Used"     value={tablesUsed} />
      </div>

      {completedOrders.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: COLORS.gray }}>
          <div style={{ fontSize: 48 }}>📋</div>
          <div style={{ marginTop: 12, fontWeight: 600 }}>No bills yet today</div>
        </div>
      ) : (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 15 }}>Recent Bills</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {completedOrders.map(order => (
              <div key={order._id || order.invoiceId} style={{
                background: COLORS.white, borderRadius: 12, padding: "14px 18px",
                border: `1px solid ${COLORS.border}`,
                display: "flex", justifyContent: "space-between",
                alignItems: "center", flexWrap: "wrap", gap: 10,
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{order.invoiceId}</div>
                  <div style={{ fontSize: 12, color: COLORS.gray }}>
                    Table {order.tableId} · {new Date(order.settledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} · {order.items.length} items
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{
                    fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                    background: COLORS.lightGray, color: COLORS.gray, textTransform: "uppercase",
                  }}>{order.paymentMode}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.primary }}>{fmt(order.total)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
