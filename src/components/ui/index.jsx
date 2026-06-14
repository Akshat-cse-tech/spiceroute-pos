import { COLORS } from "../../constants";

// ── Veg / Non-veg indicator (FSSAI standard square + circle) ──────────────────
export function Badge({ veg }) {
  const color = veg ? COLORS.green : COLORS.red;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 16,
      height: 16,
      border: `2px solid ${color}`,
      borderRadius: 3,
      flexShrink: 0,
      background: "#fff",           // ← white bg so border is always visible
    }}>
      <span style={{
        display: "block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: color,           // ← filled circle inside
      }} />
    </span>
  );
}

// ── Pill / toggle button ──────────────────────────────────────────────────────
export function Pill({ children, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: 20,
        border: `1.5px solid ${active ? (color || COLORS.primary) : COLORS.border}`,
        background: active ? (color || COLORS.primary) : COLORS.white,
        color: active ? COLORS.white : COLORS.gray,
        fontWeight: active ? 600 : 400,
        fontSize: 13,
        cursor: "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
export function Stat({ label, value, sub, color }) {
  return (
    <div style={{
      background: COLORS.white,
      borderRadius: 12,
      padding: "16px 20px",
      border: `1px solid ${COLORS.border}`,
      flex: 1,
      minWidth: 120,
    }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: color || COLORS.dark }}>{value}</div>
      <div style={{ fontSize: 12, color: COLORS.gray, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: COLORS.primary, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ── Toast notification ────────────────────────────────────────────────────────
export function Toast({ toast }) {
  if (!toast) return null;
  const bg =
    toast.type === "warn"  ? COLORS.amber :
    toast.type === "error" ? COLORS.red   : "#16A34A";
  return (
    <div style={{
      position: "fixed",
      top: 16,
      right: 16,
      zIndex: 9999,
      background: bg,
      color: "#fff",
      padding: "10px 18px",
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 500,
      boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
      animation: "fadeIn 0.2s ease",
      maxWidth: "calc(100vw - 32px)",   // ← mobile safe
    }}>
      {toast.msg}
    </div>
  );
}

// ── Qty +/- button style (shared) ─────────────────────────────────────────────
export const btnStyle = {
  width: 28,
  height: 28,
  borderRadius: 6,
  border: `1px solid #CBD5E1`,
  background: "#fff",
  cursor: "pointer",
  fontSize: 16,
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  lineHeight: 1,
  touchAction: "manipulation",        // ← prevents double-tap zoom on mobile
};
