import { useState, useEffect, useCallback } from "react";
import { tablesApi } from "../api";

/**
 * Manages all table state from the MongoDB backend.
 * Returns tables array + every action that mutates a table.
 */
export function useTables(showToast) {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Load tables on mount ───────────────────────────────────────────────────
  const fetchTables = useCallback(async () => {
    try {
      const { data } = await tablesApi.getAll();
      setTables(data);
    } catch (err) {
      showToast("Could not load tables: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchTables(); }, [fetchTables]);

  // Re-fetch every 60 s so kitchen timer refreshes
  useEffect(() => {
    const t = setInterval(fetchTables, 60000);
    return () => clearInterval(t);
  }, [fetchTables]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  /** Replace a single table in state after an API response */
  function syncTable(updated) {
    setTables(prev => prev.map(t => t._id === updated._id ? updated : t));
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  async function addItem(table, menuItem) {
    try {
      const { data } = await tablesApi.addItem(table._id, menuItem._id);
      syncTable(data);
    } catch (err) {
      showToast("Add item failed: " + err.message, "error");
    }
  }

  async function changeQty(table, menuItemId, delta) {
    try {
      const { data } = await tablesApi.changeQty(table._id, menuItemId, delta);
      syncTable(data);
    } catch (err) {
      showToast("Update qty failed: " + err.message, "error");
    }
  }

  async function sendKOT(table) {
    const unsent = table.order.filter(o => !o.kotSent);
    if (!table.order.length) { showToast("No items to send", "warn"); return; }
    if (!unsent.length) { showToast("All items already sent to kitchen", "warn"); return; }
    try {
      const { data } = await tablesApi.sendKOT(table._id);
      syncTable(data);
      showToast(`KOT sent for Table ${table.tableNumber} 🍳`);
    } catch (err) {
      showToast("KOT failed: " + err.message, "error");
    }
  }

  async function clearTable(table) {
    try {
      const { data } = await tablesApi.clear(table._id);
      syncTable(data);
    } catch (err) {
      showToast("Clear table failed: " + err.message, "error");
    }
  }

  return { tables, loading, fetchTables, addItem, changeQty, sendKOT, clearTable };
}
