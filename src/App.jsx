import { useState } from "react";
import { MENU, TABLES, TAX_RATE, SERVICE_CHARGE } from "./constants";
import { Toast } from "./components/ui";
import { calcBill } from "./utils";
import Header from "./components/layout/Header";
import BillingView from "./components/billing/BillingView";
import TablesView from "./components/tables/TablesView";
import KitchenView from "./components/kitchen/KitchenView";
import ReportsView from "./components/reports/ReportsView";

let invoiceCounter = 1;

export default function App() {
  const [view, setView] = useState("billing");
  const [tables, setTables] = useState(
    TABLES.map(t => ({ ...t, status: "free", order: [], openedAt: null, waiter: "" }))
  );
  const [selectedTable, setSelectedTable] = useState(null);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [toast, setToast] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  // ── Order helpers ─────────────────────────────────────────────────────────
  function handleAddItem(table, menuItem) {
    setTables(prev => prev.map(t => {
      if (t.id !== table.id) return t;
      const existing = t.order.find(o => o.id === menuItem.id);
      const newOrder = existing
        ? t.order.map(o => o.id === menuItem.id ? { ...o, qty: o.qty + 1 } : o)
        : [...t.order, { ...menuItem, qty: 1 }];
      return { ...t, order: newOrder, status: "occupied", openedAt: t.openedAt || new Date() };
    }));
  }

  function handleChangeQty(table, menuItemId, delta) {
    setTables(prev => prev.map(t => {
      if (t.id !== table.id) return t;
      const newOrder = t.order
        .map(o => o.id === menuItemId ? { ...o, qty: o.qty + delta } : o)
        .filter(o => o.qty > 0);
      return { ...t, order: newOrder, status: newOrder.length > 0 ? "occupied" : "free" };
    }));
  }

  function handleSendKOT(table) {
    showToast(`KOT sent for ${table.label} ✅`);
  }

  function handleClearTable(table) {
    setTables(prev => prev.map(t =>
      t.id === table.id
        ? { ...t, status: "free", order: [], openedAt: null, waiter: "" }
        : t
    ));
  }

  function handleSettleBill({ table, discountPct, paymentMode, onSuccess }) {
    // ── Calculate final totals the same way BillModal does ──────────────────
    const { subtotal, discountAmt, tax, service, total } =
      calcBill(table.order, discountPct, TAX_RATE, SERVICE_CHARGE);

    const invoiceId = `INV-${String(invoiceCounter++).padStart(4, "0")}`;

    const completedOrder = {
      // ── Fields ReportsView reads ─────────────────────────────────────────
      invoiceId,                          // e.g. "INV-0001"
      tableId:     table.id,
      tableLabel:  table.label,
      items:       table.order,           // ← was saved as "order", ReportsView needs "items"
      subtotal,
      discountPct,
      discountAmt,
      tax,
      service,
      total,                              // ← was missing, caused ₹0 revenue
      paymentMode,
      settledAt:   new Date(),
    };

    setCompletedOrders(prev => [completedOrder, ...prev]); // newest first
    onSuccess?.();
  }

  const occupiedCount = tables.filter(t => t.status === "occupied").length;

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      minHeight: "100vh",
      background: "#FAFAFA",
      color: "#1A1A2E",
    }}>
      <Toast toast={toast} />

      <Header
        view={view}
        setView={setView}
        occupiedCount={occupiedCount}
        totalTables={tables.length}
      />

      {view === "billing" && (
        <BillingView
          tables={tables}
          menu={MENU}
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
          onAddItem={handleAddItem}
          onChangeQty={handleChangeQty}
          onSendKOT={handleSendKOT}
          onClearTable={handleClearTable}
          onSettleBill={handleSettleBill}
          showToast={showToast}
        />
      )}

      {view === "tables" && (
        <TablesView
          tables={tables}
          todayOrders={completedOrders.length}
          onTableClick={(i) => { setSelectedTable(i); setView("billing"); }}
        />
      )}

      {view === "kitchen" && <KitchenView tables={tables} />}

      {view === "reports" && (
        <ReportsView completedOrders={completedOrders} summary={null} />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: none; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
        div::-webkit-scrollbar { display: none; }

        @media (max-width: 768px) {
          .billing-layout  { flex-direction: column !important; height: auto !important; }
          .table-sidebar   { width: 100% !important; border-right: none !important; border-bottom: 1px solid #E2E8F0; }
          .order-panel     { width: 100% !important; border-left: none !important; border-top: 1px solid #E2E8F0; }
        }
      `}</style>
    </div>
  );
}
