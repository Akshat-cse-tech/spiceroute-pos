import { useState, useEffect, useCallback } from "react";
import { billsApi } from "../api";

/**
 * Manages bill settlement and today's completed-orders list.
 */
export function useBills(showToast) {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [reportSummary, setReportSummary] = useState(null);

  const fetchToday = useCallback(async () => {
    try {
      const { data } = await billsApi.getToday();
      setCompletedOrders(data.bills);
      setReportSummary(data.summary);
    } catch (err) {
      showToast("Could not load today's bills: " + err.message, "error");
    }
  }, [showToast]);

  useEffect(() => { fetchToday(); }, [fetchToday]);

  async function settleBill({ table, discountPct, paymentMode, onSuccess }) {
    try {
      await billsApi.settle(table._id, discountPct, paymentMode);
      showToast(`Bill settled via ${paymentMode.toUpperCase()} ✅`);
      await fetchToday(); // refresh report
      onSuccess?.();
    } catch (err) {
      showToast("Settlement failed: " + err.message, "error");
    }
  }

  return { completedOrders, reportSummary, settleBill, fetchToday };
}
