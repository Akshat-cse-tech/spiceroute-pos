import { useState, useEffect } from "react";

const MENU = {
  "Starters": [
    { id: 1, name: "Paneer Tikka", price: 220, veg: true },
    { id: 2, name: "Chicken Wings", price: 280, veg: false },
    { id: 3, name: "Veg Spring Rolls", price: 160, veg: true },
    { id: 4, name: "Seekh Kebab", price: 260, veg: false },
  ],
  "Main Course": [
    { id: 5, name: "Dal Makhani", price: 220, veg: true },
    { id: 6, name: "Butter Chicken", price: 320, veg: false },
    { id: 7, name: "Paneer Butter Masala", price: 260, veg: true },
    { id: 8, name: "Mutton Rogan Josh", price: 380, veg: false },
  ],
  "Breads": [
    { id: 9, name: "Butter Naan", price: 40, veg: true },
    { id: 10, name: "Laccha Paratha", price: 50, veg: true },
    { id: 11, name: "Garlic Bread", price: 80, veg: true },
  ],
  "Beverages": [
    { id: 12, name: "Mango Lassi", price: 100, veg: true },
    { id: 13, name: "Cold Coffee", price: 120, veg: true },
    { id: 14, name: "Fresh Lime Soda", price: 80, veg: true },
    { id: 15, name: "Masala Chai", price: 60, veg: true },
  ],
  "Desserts": [
    { id: 16, name: "Gulab Jamun", price: 80, veg: true },
    { id: 17, name: "Brownie + Ice Cream", price: 150, veg: true },
    { id: 18, name: "Kulfi Falooda", price: 120, veg: true },
  ],
};

const TABLES = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1, label: `T${i + 1}`,
  capacity: i < 4 ? 2 : i < 8 ? 4 : 6,
}));

const TAX_RATE = 0.05;
const SERVICE_RATE = 0.10;

const C = {
  primary: "#E8521A", primaryLight: "#FFF0EA",
  dark: "#1A1A2E", gray: "#64748B", lightGray: "#F1F5F9",
  border: "#E2E8F0", white: "#FFFFFF",
  green: "#16A34A", red: "#DC2626", amber: "#D97706", surface: "#FAFAFA",
};

function fmt(n) { return `₹${n.toFixed(2)}`; }
function nowStr() { return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }); }
function todayStr() { return new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

function Badge({ veg }) {
  return (
    <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${veg ? C.green : C.red}`, borderRadius: 2, flexShrink: 0, marginTop: 2 }}>
      <span style={{ display: "block", width: 6, height: 6, borderRadius: "50%", margin: "2px auto", background: veg ? C.green : C.red }} />
    </span>
  );
}

function Pill({ children, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 14px", borderRadius: 20,
      border: `1.5px solid ${active ? (color || C.primary) : C.border}`,
      background: active ? (color || C.primary) : C.white,
      color: active ? C.white : C.gray,
      fontWeight: active ? 600 : 400, fontSize: 13, cursor: "pointer",
      transition: "all 0.15s", whiteSpace: "nowrap",
    }}>{children}</button>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ background: C.white, borderRadius: 12, padding: "16px 20px", border: `1px solid ${C.border}`, flex: 1, minWidth: 130 }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: color || C.dark }}>{value}</div>
      <div style={{ fontSize: 12, color: C.gray, marginTop: 2 }}>{label}</div>
    </div>
  );
}

// ── Mobile step indicator ─────────────────────────────────────────────────────
function MobileStepBar({ step, onStep, tableLabel, orderCount }) {
  const steps = [
    { key: 0, icon: "🪑", label: tableLabel || "Table" },
    { key: 1, icon: "🍛", label: "Menu" },
    { key: 2, icon: "🛒", label: `Order${orderCount ? ` (${orderCount})` : ""}` },
  ];
  return (
    <div style={{ display: "flex", background: C.white, borderBottom: `1px solid ${C.border}` }}>
      {steps.map((s, i) => (
        <button key={s.key} onClick={() => onStep(s.key)} style={{
          flex: 1, padding: "10px 4px", border: "none", cursor: "pointer",
          background: step === s.key ? C.primaryLight : C.white,
          borderBottom: `3px solid ${step === s.key ? C.primary : "transparent"}`,
          color: step === s.key ? C.primary : C.gray,
          fontSize: 11, fontWeight: step === s.key ? 700 : 400,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
        }}>
          <span style={{ fontSize: 18 }}>{s.icon}</span>
          {s.label}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const isMobile = useIsMobile();
  const [view, setView] = useState("billing");
  const [mobileStep, setMobileStep] = useState(0); // 0=tables, 1=menu, 2=order
  const [tables, setTables] = useState(
    TABLES.map(t => ({ ...t, status: "free", order: [], openedAt: null }))
  );
  const [selectedTable, setSelectedTable] = useState(null);
  const [activeCategory, setActiveCategory] = useState(Object.keys(MENU)[0]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [completedOrders, setCompletedOrders] = useState([]);
  const [showBill, setShowBill] = useState(false);
  const [discountPct, setDiscountPct] = useState(0);
  const [paymentMode, setPaymentMode] = useState("cash");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const t = setInterval(() => {}, 60000);
    return () => clearInterval(t);
  }, []);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  const table = selectedTable != null ? tables[selectedTable] : null;
  const order = table?.order || [];

  function selectTable(i) {
    setSelectedTable(i);
    if (isMobile) setMobileStep(1); // jump to menu after picking table
  }

  function addItem(item) {
    if (selectedTable == null) {
      showToast("Select a table first", "warn");
      if (isMobile) setMobileStep(0);
      return;
    }
    setTables(prev => prev.map((t, i) => {
      if (i !== selectedTable) return t;
      const existing = t.order.find(o => o.id === item.id);
      return {
        ...t, status: "occupied", openedAt: t.openedAt || nowStr(),
        order: existing
          ? t.order.map(o => o.id === item.id ? { ...o, qty: o.qty + 1 } : o)
          : [...t.order, { ...item, qty: 1 }],
      };
    }));
  }

  function changeQty(itemId, delta) {
    setTables(prev => prev.map((t, i) => {
      if (i !== selectedTable) return t;
      const newOrder = t.order.map(o => o.id === itemId ? { ...o, qty: o.qty + delta } : o).filter(o => o.qty > 0);
      return { ...t, order: newOrder, status: newOrder.length ? t.status : "free", openedAt: newOrder.length ? t.openedAt : null };
    }));
  }

  function sendKOT() {
    if (!order.length) { showToast("No items to send", "warn"); return; }
    showToast(`KOT sent to kitchen for Table ${table.id} 🍳`);
  }

  const subtotal = order.reduce((s, o) => s + o.price * o.qty, 0);
  const discountAmt = subtotal * (discountPct / 100);
  const taxableAmt = subtotal - discountAmt;
  const tax = taxableAmt * TAX_RATE;
  const service = taxableAmt * SERVICE_RATE;
  const total = taxableAmt + tax + service;

  function settleBill() {
    setCompletedOrders(prev => [{
      id: `INV-${Date.now()}`, tableId: table.id, items: [...order],
      subtotal, discountAmt, tax, service, total, paymentMode, time: nowStr(), date: todayStr(),
    }, ...prev]);
    setTables(prev => prev.map((t, i) =>
      i !== selectedTable ? t : { ...t, status: "free", order: [], openedAt: null }
    ));
    setSelectedTable(null);
    setShowBill(false);
    setDiscountPct(0);
    if (isMobile) setMobileStep(0);
    showToast(`Bill settled! ${fmt(total)} via ${paymentMode.toUpperCase()} ✅`);
  }

  function printReceipt() {
    const invoiceNo = `INV-${Date.now()}`;
    const receiptHTML = `
      <html><head><title>Receipt</title>
      <style>
        body { font-family: 'Courier New', monospace; font-size: 13px; width: 300px; margin: 0 auto; padding: 10px; color: #000; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .lg { font-size: 16px; }
        .divider { border-top: 1px dashed #000; margin: 8px 0; }
        .row { display: flex; justify-content: space-between; margin: 3px 0; }
        .total-row { display: flex; justify-content: space-between; font-weight: bold; font-size: 15px; border-top: 2px solid #000; padding-top: 6px; margin-top: 4px; }
        .footer { text-align: center; margin-top: 12px; font-size: 11px; }
      </style></head>
      <body>
        <div class="center bold lg">🍽️ SpiceRoute</div>
        <div class="center" style="font-size:11px;margin-top:2px;">Restaurant & Café</div>
        <div class="center" style="font-size:11px;">GSTIN: 24XXXXX1234X1ZX</div>
        <div class="divider"></div>
        <div class="row"><span>Invoice: ${invoiceNo}</span></div>
        <div class="row"><span>Table: ${table.id}</span><span>${todayStr()} ${nowStr()}</span></div>
        <div class="divider"></div>
        <div class="row bold"><span>Item</span><span>Qty</span><span>Amt</span></div>
        <div class="divider"></div>
        ${order.map(i => `<div class="row"><span style="max-width:160px;overflow:hidden">${i.name}</span><span>×${i.qty}</span><span>${fmt(i.price * i.qty)}</span></div>`).join("")}
        <div class="divider"></div>
        <div class="row"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
        ${discountPct > 0 ? `<div class="row"><span>Discount (${discountPct}%)</span><span>-${fmt(discountAmt)}</span></div>` : ""}
        <div class="row"><span>GST (5%)</span><span>${fmt(tax)}</span></div>
        <div class="row"><span>Service (10%)</span><span>${fmt(service)}</span></div>
        <div class="total-row"><span>TOTAL</span><span>${fmt(total)}</span></div>
        <div class="divider"></div>
        <div class="row"><span>Payment:</span><span style="text-transform:uppercase;font-weight:bold">${paymentMode}</span></div>
        <div class="footer">
          <div class="divider"></div>
          <div>Thank you for dining with us! 🙏</div>
          <div>Visit again soon</div>
        </div>
      </body></html>
    `;
    const win = window.open("", "_blank", "width=350,height=600");
    win.document.write(receiptHTML);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 300);
  }

  function reprintReceipt(o) {
    const receiptHTML = `
      <html><head><title>Receipt</title>
      <style>
        body { font-family: 'Courier New', monospace; font-size: 13px; width: 300px; margin: 0 auto; padding: 10px; color: #000; }
        .center { text-align: center; } .bold { font-weight: bold; } .lg { font-size: 16px; }
        .divider { border-top: 1px dashed #000; margin: 8px 0; }
        .row { display: flex; justify-content: space-between; margin: 3px 0; }
        .total-row { display: flex; justify-content: space-between; font-weight: bold; font-size: 15px; border-top: 2px solid #000; padding-top: 6px; margin-top: 4px; }
        .footer { text-align: center; margin-top: 12px; font-size: 11px; }
      </style></head>
      <body>
        <div class="center bold lg">🍽️ SpiceRoute</div>
        <div class="center" style="font-size:11px;margin-top:2px;">Restaurant & Café</div>
        <div class="center" style="font-size:11px;">GSTIN: 24XXXXX1234X1ZX</div>
        <div class="divider"></div>
        <div class="row"><span>Invoice: ${o.id}</span></div>
        <div class="row"><span>Table: ${o.tableId}</span><span>${o.date} ${o.time}</span></div>
        <div class="center bold" style="font-size:10px;margin:2px 0;">** DUPLICATE COPY **</div>
        <div class="divider"></div>
        <div class="row bold"><span>Item</span><span>Qty</span><span>Amt</span></div>
        <div class="divider"></div>
        ${o.items.map(i => `<div class="row"><span style="max-width:160px;overflow:hidden">${i.name}</span><span>×${i.qty}</span><span>${fmt(i.price * i.qty)}</span></div>`).join("")}
        <div class="divider"></div>
        <div class="row"><span>Subtotal</span><span>${fmt(o.subtotal)}</span></div>
        ${o.discountAmt > 0 ? `<div class="row"><span>Discount</span><span>-${fmt(o.discountAmt)}</span></div>` : ""}
        <div class="row"><span>GST (5%)</span><span>${fmt(o.tax)}</span></div>
        <div class="row"><span>Service (10%)</span><span>${fmt(o.service)}</span></div>
        <div class="total-row"><span>TOTAL</span><span>${fmt(o.total)}</span></div>
        <div class="divider"></div>
        <div class="row"><span>Payment:</span><span style="text-transform:uppercase;font-weight:bold">${o.paymentMode}</span></div>
        <div class="footer"><div class="divider"></div><div>Thank you for dining with us! 🙏</div></div>
      </body></html>
    `;
    const win = window.open("", "_blank", "width=350,height=600");
    win.document.write(receiptHTML);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 300);
  }

  const totalRevenue = completedOrders.reduce((s, o) => s + o.total, 0);
  const todayOrders = completedOrders.length;
  const avgOrder = todayOrders ? totalRevenue / todayOrders : 0;
  const occupiedCount = tables.filter(t => t.status === "occupied").length;

  const menuItems = search
    ? Object.values(MENU).flat().filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        (filter === "all" || (filter === "veg" ? item.veg : !item.veg))
      )
    : (MENU[activeCategory] || []).filter(item =>
        filter === "all" || (filter === "veg" ? item.veg : !item.veg)
      );

  function elapsed(openedAt) {
    if (!openedAt) return 0;
    const [h, m] = openedAt.split(":").map(Number);
    const n = new Date();
    return Math.max(0, n.getHours() * 60 + n.getMinutes() - (h * 60 + m));
  }

  // ── NAV items ──────────────────────────────────────────────────────────────
  const NAV = [
    { key: "billing", icon: "🧾", label: "Billing" },
    { key: "tables",  icon: "🪑", label: "Tables" },
    { key: "kitchen", icon: "👨‍🍳", label: "Kitchen" },
    { key: "reports", icon: "📊", label: "Reports" },
  ];

  // ── TABLE GRID (shared between mobile step and desktop sidebar) ────────────
  function TableGrid({ compact = false }) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr 1fr" : "repeat(auto-fill, minmax(70px,1fr))", gap: 8 }}>
        {tables.map((t, i) => (
          <button key={t.id} onClick={() => selectTable(i)} style={{
            borderRadius: 12,
            border: `2px solid ${selectedTable === i ? C.primary : t.status === "occupied" ? "#FCA5A5" : C.border}`,
            background: selectedTable === i ? C.primaryLight : t.status === "occupied" ? "#FFF5F5" : C.lightGray,
            padding: compact ? "12px 6px" : "14px 6px",
            cursor: "pointer", textAlign: "center",
          }}>
            <div style={{ fontSize: compact ? 15 : 16, fontWeight: 700, color: selectedTable === i ? C.primary : C.dark }}>{t.label}</div>
            <div style={{ fontSize: 10, color: C.gray }}>{t.capacity}p</div>
            {t.status === "occupied" && (
              <div style={{ fontSize: 10, color: C.red, marginTop: 2 }}>{elapsed(t.openedAt)}m</div>
            )}
          </button>
        ))}
      </div>
    );
  }

  // ── MENU PANEL (shared) ────────────────────────────────────────────────────
  function MenuPanel() {
    return (
      <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? 12 : 16 }}>
        {/* Search + filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input
            placeholder="Search menu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 120, padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, outline: "none" }}
          />
          <div style={{ display: "flex", gap: 4 }}>
            {["all", "veg", "nonveg"].map(f => (
              <Pill key={f} active={filter === f} onClick={() => setFilter(f)}
                color={f === "veg" ? C.green : f === "nonveg" ? C.red : C.primary}>
                {f === "all" ? "All" : f === "veg" ? "🟢" : "🔴"}
              </Pill>
            ))}
          </div>
        </div>

        {/* Category pills */}
        {!search && (
          <div style={{ display: "flex", gap: 6, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
            {Object.keys(MENU).map(cat => (
              <Pill key={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)}>{cat}</Pill>
            ))}
          </div>
        )}

        {/* Selected table banner on mobile */}
        {isMobile && (
          <div style={{
            marginBottom: 10, padding: "8px 12px", borderRadius: 8,
            background: selectedTable != null ? C.primaryLight : "#FEF3C7",
            border: `1px solid ${selectedTable != null ? C.primary : C.amber}`,
            fontSize: 13, fontWeight: 600,
            color: selectedTable != null ? C.primary : C.amber,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span>{selectedTable != null ? `📍 Table ${table.id} selected` : "⚠️ No table selected"}</span>
            {selectedTable != null && order.length > 0 && (
              <button onClick={() => setMobileStep(2)} style={{
                background: C.primary, color: "#fff", border: "none",
                borderRadius: 6, padding: "3px 10px", fontSize: 12, cursor: "pointer",
              }}>View Order ({order.length})</button>
            )}
          </div>
        )}

        {/* Items grid */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(170px,1fr))", gap: 10 }}>
          {menuItems.map(item => {
            const inOrder = order.find(o => o.id === item.id);
            return (
              <div key={item.id} onClick={() => addItem(item)} style={{
                background: C.white, borderRadius: 12,
                border: `1.5px solid ${inOrder ? C.primary : C.border}`,
                padding: 12, cursor: "pointer",
                boxShadow: inOrder ? `0 0 0 3px ${C.primaryLight}` : "none",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <Badge veg={item.veg} />
                  {inOrder && (
                    <span style={{ background: C.primary, color: "#fff", borderRadius: 20, fontSize: 11, fontWeight: 700, padding: "2px 7px" }}>×{inOrder.qty}</span>
                  )}
                </div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{item.name}</div>
                <div style={{ color: C.primary, fontWeight: 700, fontSize: 14 }}>{fmt(item.price)}</div>
              </div>
            );
          })}
        </div>
        {menuItems.length === 0 && <div style={{ textAlign: "center", padding: 60, color: C.gray }}>No items found</div>}
      </div>
    );
  }

  // ── ORDER PANEL (shared) ───────────────────────────────────────────────────
  function OrderPanel() {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C.white }}>
        {!table ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: C.gray }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🪑</div>
            <div style={{ fontWeight: 600 }}>Select a table first</div>
            {isMobile && (
              <button onClick={() => setMobileStep(0)} style={{ marginTop: 12, background: C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontWeight: 600 }}>
                Pick Table
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>
                Table {table.id}
                {table.openedAt && <span style={{ fontSize: 12, fontWeight: 400, color: C.gray, marginLeft: 8 }}>since {table.openedAt}</span>}
              </div>
              <div style={{ fontSize: 12, color: C.gray }}>{order.length} item type{order.length !== 1 ? "s" : ""}</div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px" }}>
              {order.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40, color: C.gray, fontSize: 13 }}>
                  {isMobile ? (
                    <>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🍛</div>
                      <div>Go to Menu to add items</div>
                      <button onClick={() => setMobileStep(1)} style={{ marginTop: 12, background: C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontWeight: 600 }}>
                        Browse Menu
                      </button>
                    </>
                  ) : "Tap menu items to add"}
                </div>
              ) : order.map(item => (
                <div key={item.id} style={{
                  display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
                  padding: "8px 10px", borderRadius: 8, background: C.lightGray,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: C.gray }}>{fmt(item.price)} × {item.qty}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <button onClick={() => changeQty(item.id, -1)} style={btnStyle}>&minus;</button>
                    <span style={{ fontSize: 13, fontWeight: 600, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => changeQty(item.id, 1)} style={btnStyle}>+</button>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, minWidth: 50, textAlign: "right" }}>{fmt(item.price * item.qty)}</div>
                </div>
              ))}
            </div>
            {order.length > 0 && (
              <div style={{ borderTop: `1px solid ${C.border}`, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: C.gray }}>
                  <span>Subtotal</span><span style={{ fontWeight: 600, color: C.dark }}>{fmt(subtotal)}</span>
                </div>
                <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                  {[0, 5, 10, 15, 20].map(d => (
                    <Pill key={d} active={discountPct === d} onClick={() => setDiscountPct(d)}>
                      {d === 0 ? "No disc." : `${d}%`}
                    </Pill>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={sendKOT} style={{
                    flex: 1, padding: "10px 0", borderRadius: 8,
                    border: `1.5px solid ${C.primary}`, background: "transparent",
                    color: C.primary, fontWeight: 600, cursor: "pointer", fontSize: 13,
                  }}>KOT 🍳</button>
                  <button onClick={() => setShowBill(true)} style={{
                    flex: 2, padding: "10px 0", borderRadius: 8, border: "none",
                    background: C.primary, color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13,
                  }}>Bill 🧾</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh", background: C.surface, color: C.dark }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 16, right: 16, zIndex: 9999,
          background: toast.type === "warn" ? C.amber : "#16A34A",
          color: "#fff", padding: "10px 18px", borderRadius: 10, fontSize: 14, fontWeight: 500,
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        }}>{toast.msg}</div>
      )}

      {/* ── HEADER ── */}
      <header style={{
        background: C.white, borderBottom: `1px solid ${C.border}`,
        padding: isMobile ? "0 12px" : "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 52, position: "sticky", top: 0, zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🍽️</div>
          {!isMobile && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1 }}>SpiceRoute POS</div>
              <div style={{ fontSize: 10, color: C.gray }}>{todayStr()}</div>
            </div>
          )}
        </div>

        {/* Nav — icons only on mobile, labels on desktop */}
        <nav style={{ display: "flex", gap: isMobile ? 2 : 4 }}>
          {NAV.map(({ key, icon, label }) => (
            <button key={key} onClick={() => { setView(key); if (key === "billing" && isMobile) setMobileStep(0); }} style={{
              padding: isMobile ? "6px 10px" : "6px 14px",
              borderRadius: 8, border: "none",
              background: view === key ? C.primaryLight : "transparent",
              color: view === key ? C.primary : C.gray,
              fontWeight: view === key ? 600 : 400, cursor: "pointer",
              fontSize: isMobile ? 18 : 13,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
            }}>
              {icon}
              {!isMobile && <span>{label}</span>}
            </button>
          ))}
        </nav>

        {/* Occupancy badge */}
        <div style={{
          background: C.primaryLight, color: C.primary,
          fontSize: isMobile ? 10 : 12, fontWeight: 600,
          padding: isMobile ? "3px 7px" : "4px 10px", borderRadius: 20, whiteSpace: "nowrap",
        }}>
          {occupiedCount}/{TABLES.length}{!isMobile && " Tables"}
        </div>
      </header>

      {/* ── BILLING VIEW ── */}
      {view === "billing" && (
        <>
          {isMobile ? (
            /* ── MOBILE: step-based ── */
            <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 52px)" }}>
              <MobileStepBar
                step={mobileStep}
                onStep={setMobileStep}
                tableLabel={selectedTable != null ? `T${tables[selectedTable].id}` : "Table"}
                orderCount={order.length}
              />
              <div style={{ flex: 1, overflowY: "auto" }}>
                {mobileStep === 0 && (
                  <div style={{ padding: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.gray, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                      Select a Table
                    </div>
                    <TableGrid compact={false} />
                  </div>
                )}
                {mobileStep === 1 && <MenuPanel />}
                {mobileStep === 2 && (
                  <div style={{ height: "100%" }}>
                    <OrderPanel />
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ── DESKTOP: 3-column ── */
            <div style={{ display: "flex", height: "calc(100vh - 52px)" }}>
              {/* Sidebar: tables */}
              <aside style={{ width: 200, borderRight: `1px solid ${C.border}`, background: C.white, overflowY: "auto", padding: 12, flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.gray, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Tables</div>
                <TableGrid compact={true} />
              </aside>

              {/* Menu */}
              <MenuPanel />

              {/* Order panel */}
              <aside style={{ width: 300, borderLeft: `1px solid ${C.border}`, flexShrink: 0, display: "flex", flexDirection: "column" }}>
                <OrderPanel />
              </aside>
            </div>
          )}
        </>
      )}

      {/* ── TABLES VIEW ── */}
      {view === "tables" && (
        <div style={{ padding: isMobile ? 12 : 24 }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Table Status</div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <Stat label="Total Tables" value={TABLES.length} />
            <Stat label="Occupied" value={occupiedCount} color={C.red} />
            <Stat label="Free" value={TABLES.length - occupiedCount} color={C.green} />
            <Stat label="Bills Today" value={todayOrders} color={C.primary} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px,1fr))", gap: 10 }}>
            {tables.map((t, i) => (
              <div key={t.id} onClick={() => { setSelectedTable(i); setView("billing"); if (isMobile) setMobileStep(1); }} style={{
                borderRadius: 14, border: `2px solid ${t.status === "occupied" ? "#FCA5A5" : C.border}`,
                background: t.status === "occupied" ? "#FFF5F5" : C.white,
                padding: 16, cursor: "pointer", textAlign: "center",
              }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{t.status === "occupied" ? "🔴" : "🟢"}</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{t.label}</div>
                <div style={{ fontSize: 11, color: C.gray }}>{t.capacity} seats</div>
                {t.status === "occupied" && (
                  <>
                    <div style={{ fontSize: 11, color: C.red, marginTop: 3 }}>{t.order.length} items · {elapsed(t.openedAt)}m</div>
                    <div style={{ fontSize: 12, color: C.primary, fontWeight: 600 }}>{fmt(t.order.reduce((s, o) => s + o.price * o.qty, 0))}</div>
                  </>
                )}
                {t.status === "free" && <div style={{ fontSize: 11, color: C.green, marginTop: 3 }}>Available</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── KITCHEN VIEW ── */}
      {view === "kitchen" && (
        <div style={{ padding: isMobile ? 12 : 24 }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>👨‍🍳 Kitchen Display</div>
          {tables.filter(t => t.status === "occupied").length === 0 ? (
            <div style={{ textAlign: "center", padding: 80, color: C.gray }}>
              <div style={{ fontSize: 48 }}>🍽️</div>
              <div style={{ marginTop: 12, fontWeight: 600 }}>No active orders</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 14 }}>
              {tables.filter(t => t.status === "occupied" && t.order.length > 0).map(t => {
                const mins = elapsed(t.openedAt);
                return (
                  <div key={t.id} style={{
                    background: C.white, borderRadius: 14, padding: 16,
                    border: `2px solid ${mins > 30 ? C.red : mins > 15 ? C.amber : C.border}`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ fontWeight: 700 }}>Table {t.id}</div>
                      <div style={{
                        fontSize: 12, fontWeight: 600, padding: "2px 10px", borderRadius: 20,
                        background: mins > 30 ? "#FEE2E2" : mins > 15 ? "#FEF3C7" : "#DCFCE7",
                        color: mins > 30 ? C.red : mins > 15 ? C.amber : C.green,
                      }}>{mins}m</div>
                    </div>
                    {t.order.map(item => (
                      <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${C.border}`, fontSize: 13 }}>
                        <div style={{ display: "flex", gap: 7, alignItems: "center" }}><Badge veg={item.veg} />{item.name}</div>
                        <span style={{ fontWeight: 700 }}>×{item.qty}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── REPORTS VIEW ── */}
      {view === "reports" && (
        <div style={{ padding: isMobile ? 12 : 24 }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>📊 Today's Report</div>
          <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
            <Stat label="Revenue" value={fmt(totalRevenue)} color={C.primary} />
            <Stat label="Bills" value={todayOrders} />
            <Stat label="Avg Bill" value={fmt(avgOrder)} />
          </div>
          {completedOrders.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: C.gray }}>
              <div style={{ fontSize: 40 }}>📋</div>
              <div style={{ marginTop: 10, fontWeight: 600 }}>No bills yet today</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {completedOrders.map(o => (
                <div key={o.id} style={{
                  background: C.white, borderRadius: 12, padding: "12px 16px",
                  border: `1px solid ${C.border}`, display: "flex",
                  justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8,
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{o.id}</div>
                    <div style={{ fontSize: 12, color: C.gray }}>Table {o.tableId} · {o.time} · {o.items.length} items</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: C.lightGray, color: C.gray, textTransform: "uppercase" }}>{o.paymentMode}</span>
                    <span style={{ fontWeight: 700, fontSize: 15, color: C.primary }}>{fmt(o.total)}</span>
                    <button onClick={() => reprintReceipt(o)} style={{
                      padding: "4px 10px", borderRadius: 7, fontSize: 12, fontWeight: 600,
                      border: `1.5px solid ${C.border}`, background: C.white,
                      cursor: "pointer", color: C.gray,
                    }}>🖨️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── BILL MODAL ── */}
      {showBill && table && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "flex-end", justifyContent: "center",
        }}>
          <div style={{
            background: C.white,
            borderRadius: isMobile ? "20px 20px 0 0" : 18,
            width: "100%", maxWidth: isMobile ? "100%" : 420,
            maxHeight: isMobile ? "92vh" : "90vh",
            overflowY: "auto",
            marginBottom: isMobile ? 0 : 20,
          }}>
            <div style={{ background: C.primary, padding: "18px 24px", borderRadius: isMobile ? "20px 20px 0 0" : "18px 18px 0 0", color: "#fff" }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>🍽️ SpiceRoute</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>{todayStr()} · {nowStr()}</div>
              <div style={{ fontWeight: 600, marginTop: 6 }}>Table {table.id}</div>
            </div>
            <div style={{ padding: 20 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 14, fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                    {["Item", "Qty", "Rate", "Amt"].map(h => (
                      <th key={h} style={{ padding: "6px 0", textAlign: h === "Item" ? "left" : "right", color: C.gray, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {order.map(item => (
                    <tr key={item.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: "7px 0", fontSize: 12 }}>{item.name}</td>
                      <td style={{ textAlign: "right", fontSize: 12 }}>{item.qty}</td>
                      <td style={{ textAlign: "right", fontSize: 12 }}>{fmt(item.price)}</td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(item.price * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {[
                ["Subtotal", fmt(subtotal)],
                ...(discountPct > 0 ? [[`Discount (${discountPct}%)`, `-${fmt(discountAmt)}`]] : []),
                ["GST (5%)", fmt(tax)],
                ["Service (10%)", fmt(service)],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 13, color: C.gray }}>
                  <span>{l}</span><span>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: `2px solid ${C.dark}`, paddingTop: 10, marginTop: 6, fontWeight: 700, fontSize: 16 }}>
                <span>Total</span><span style={{ color: C.primary }}>{fmt(total)}</span>
              </div>

              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.gray, marginBottom: 8 }}>PAYMENT MODE</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {[{ key: "cash", label: "💵 Cash" }, { key: "upi", label: "📱 UPI" }, { key: "card", label: "💳 Card" }].map(p => (
                    <button key={p.key} onClick={() => setPaymentMode(p.key)} style={{
                      flex: 1, padding: "10px 0", borderRadius: 8, cursor: "pointer",
                      border: `1.5px solid ${paymentMode === p.key ? C.primary : C.border}`,
                      background: paymentMode === p.key ? C.primaryLight : C.white,
                      color: paymentMode === p.key ? C.primary : C.dark,
                      fontWeight: paymentMode === p.key ? 600 : 400, fontSize: 13,
                    }}>{p.label}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button onClick={() => setShowBill(false)} style={{
                  flex: 1, padding: "12px 0", borderRadius: 10,
                  border: `1.5px solid ${C.border}`, background: "transparent",
                  color: C.dark, fontWeight: 600, cursor: "pointer", fontSize: 13,
                }}>Cancel</button>
                <button onClick={printReceipt} style={{
                  flex: 1, padding: "12px 0", borderRadius: 10,
                  border: `1.5px solid ${C.primary}`, background: "transparent",
                  color: C.primary, fontWeight: 600, cursor: "pointer", fontSize: 13,
                }}>🖨️ Print</button>
                <button onClick={settleBill} style={{
                  flex: 2, padding: "12px 0", borderRadius: 10, border: "none",
                  background: C.primary, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
                }}>Settle ✓</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
      `}</style>
    </div>
  );
}

const btnStyle = {
  width: 26, height: 26, borderRadius: 6, border: `1px solid #CBD5E1`,
  background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700,
  display: "flex", alignItems: "center", justifyContent: "center",
  padding: 0, lineHeight: 1,
};
