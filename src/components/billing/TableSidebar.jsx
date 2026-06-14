import { COLORS } from "../../constants";
import { elapsed } from "../../utils";

export default function TableSidebar({ tables, selectedTable, onSelect }) {
  return (
    <aside style={{
      width: 200, borderRight: `1px solid ${COLORS.border}`,
      background: COLORS.white, overflowY: "auto", padding: 12, flexShrink: 0,
    }}>
      <div style={{
        fontSize: 11, fontWeight: 600, color: COLORS.gray,
        textTransform: "uppercase", letterSpacing: 1, marginBottom: 8,
      }}>Tables</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {tables.map((t, i) => {
          const isSelected = selectedTable === i;
          const isOccupied = t.status === "occupied";
          return (
            <button
              key={t._id}
              onClick={() => onSelect(i)}
              style={{
                borderRadius: 10,
                border: `2px solid ${isSelected ? COLORS.primary : isOccupied ? "#FCA5A5" : COLORS.border}`,
                background: isSelected ? COLORS.primaryLight : isOccupied ? "#FFF5F5" : COLORS.lightGray,
                padding: "10px 6px", cursor: "pointer", textAlign: "center",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: isSelected ? COLORS.primary : COLORS.dark }}>
                {t.label}
              </div>
              <div style={{ fontSize: 10, color: COLORS.gray }}>{t.capacity}p</div>
              {isOccupied && (
                <div style={{ fontSize: 10, color: COLORS.red, marginTop: 2 }}>
                  {elapsed(t.openedAt)}m
                </div>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
