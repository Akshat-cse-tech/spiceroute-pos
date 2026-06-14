export function fmt(n) { return `₹${(n || 0).toFixed(2)}`; }

export function now() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export function todayStr() {
  return new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Minutes elapsed since a table was opened.
 * Accepts both ISO date strings (from MongoDB) and HH:MM strings (legacy).
 */
export function elapsed(openedAt) {
  if (!openedAt) return 0;
  const opened = new Date(openedAt);
  if (isNaN(opened)) return 0; // fallback for bad values
  return Math.max(0, Math.floor((Date.now() - opened.getTime()) / 60000));
}

export function calcBill(order, discountPct, taxRate, serviceCharge) {
  const subtotal = order.reduce((s, o) => s + o.price * o.qty, 0);
  const discountAmt = subtotal * (discountPct / 100);
  const taxableAmt = subtotal - discountAmt;
  const tax = taxableAmt * taxRate;
  const service = taxableAmt * serviceCharge;
  const total = taxableAmt + tax + service;
  return { subtotal, discountAmt, taxableAmt, tax, service, total };
}
