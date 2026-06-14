const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// ── Menu ──────────────────────────────────────────────────────────────────────
export const menuApi = {
  /** Returns { data: { "Starters": [...], "Main Course": [...] } } */
  getAll: () => request("/menu"),
};

// ── Tables ────────────────────────────────────────────────────────────────────
export const tablesApi = {
  /** Returns all 12 tables with current orders */
  getAll: () => request("/tables"),

  /** Add a menu item to a table's order */
  addItem: (tableMongoId, menuItemId) =>
    request(`/tables/${tableMongoId}/items`, {
      method: "POST",
      body: JSON.stringify({ menuItemId }),
    }),

  /** Change item qty by delta (+1 or -1) */
  changeQty: (tableMongoId, menuItemId, delta) =>
    request(`/tables/${tableMongoId}/items/${menuItemId}`, {
      method: "PATCH",
      body: JSON.stringify({ delta }),
    }),

  /** Mark all unsent items as KOT sent */
  sendKOT: (tableMongoId) =>
    request(`/tables/${tableMongoId}/kot`, { method: "POST" }),

  /** Clear a table after bill is settled */
  clear: (tableMongoId) =>
    request(`/tables/${tableMongoId}/clear`, { method: "POST" }),
};

// ── Bills ─────────────────────────────────────────────────────────────────────
export const billsApi = {
  /** Settle a bill — also clears the table on the backend */
  settle: (tableMongoId, discountPct, paymentMode) =>
    request("/bills", {
      method: "POST",
      body: JSON.stringify({ tableId: tableMongoId, discountPct, paymentMode }),
    }),

  /** Fetch today's bills + revenue summary */
  getToday: () => request("/bills/today"),
};
