import { useState } from "react";
import { TAX_RATE, SERVICE_CHARGE } from "../../constants";
import { calcBill, fmt } from "../../utils";
import TableSidebar from "./TableSidebar";
import MenuPanel from "./MenuPanel";
import OrderPanel from "./OrderPanel";
import BillModal from "./BillModal";

export default function BillingView({
  tables,
  menu,
  selectedTable,
  setSelectedTable,
  onAddItem,
  onChangeQty,
  onSendKOT,
  onClearTable,
  onSettleBill,
  showToast,
}) {
  const [showBill, setShowBill] = useState(false);
  const [discountPct, setDiscountPct] = useState(0);

  const table = selectedTable != null ? tables[selectedTable] : null;
  const order = table?.order || [];

  // Map backend order items (which use menuItemId) to have .id for UI compatibility
  const uiOrder = order;

  const { subtotal, discountAmt, tax, service, total } = calcBill(uiOrder, discountPct, TAX_RATE, SERVICE_CHARGE);

  function handleAddItem(menuItem) {
    if (!table) { showToast("Select a table first", "warn"); return; }
    onAddItem(table, menuItem);
  }

  function handleChangeQty(menuItemId, delta) {
    if (!table) return;
    onChangeQty(table, menuItemId, delta);
  }

  function handleSendKOT() {
    if (!table) return;
    onSendKOT(table);
  }

  function handleSettleBill(paymentMode) {
    onSettleBill({
      table,
      discountPct,
      paymentMode,
      onSuccess: () => {
        // Refresh the table in state — useTables will re-fetch on next poll,
        // but also optimistically clear it now for instant UI feedback
        onClearTable(table);
        setSelectedTable(null);
        setShowBill(false);
        setDiscountPct(0);
        showToast(`Bill settled via ${paymentMode.toUpperCase()} ✅`);
      },
    });
  }

  return (
    <>
      <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
        <TableSidebar
          tables={tables}
          selectedTable={selectedTable}
          onSelect={setSelectedTable}
        />
        <MenuPanel
          menu={menu}
          order={uiOrder}
          onAddItem={handleAddItem}
        />
        <OrderPanel
          table={table}
          order={uiOrder}
          subtotal={subtotal}
          discountPct={discountPct}
          setDiscountPct={setDiscountPct}
          onChangeQty={handleChangeQty}
          onSendKOT={handleSendKOT}
          onOpenBill={() => {
            if (!uiOrder.length) { showToast("No items in order", "warn"); return; }
            setShowBill(true);
          }}
        />
      </div>

      {showBill && table && (
        <BillModal
          table={table}
          order={uiOrder}
          subtotal={subtotal}
          discountPct={discountPct}
          discountAmt={discountAmt}
          tax={tax}
          service={service}
          total={total}
          onSettle={handleSettleBill}
          onClose={() => setShowBill(false)}
        />
      )}
    </>
  );
}
