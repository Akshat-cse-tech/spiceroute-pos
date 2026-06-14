import { useState } from "react";
import { COLORS } from "../../constants";
import { Badge, Pill } from "../ui";

export default function MenuPanel({ menu, order, onAddItem }) {
  const categories = Object.keys(menu);
  const [activeCategory, setActiveCategory] = useState(categories[0] || "");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const allItems = Object.values(menu).flat();

  const filteredAll = allItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "all" || (filter === "veg" ? item.veg : !item.veg))
  );
  const categoryItems = (menu[activeCategory] || []).filter(item =>
    filter === "all" || (filter === "veg" ? item.veg : !item.veg)
  );
  const menuItems = search ? filteredAll : categoryItems;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 80px" }}>

      {/* ── Search + Veg filter row ── */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 10,
        alignItems: "center", flexWrap: "wrap",
      }}>
        <input
          placeholder="Search menu..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 140,
            padding: "8px 12px",
            borderRadius: 8,
            border: `1px solid ${COLORS.border}`,
            fontSize: 13,
            outline: "none",
            WebkitAppearance: "none",          // iOS fix
          }}
        />
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {[
            { key: "all",    label: "All" },
            { key: "veg",    label: "Veg",     color: COLORS.green },
            { key: "nonveg", label: "Non-Veg", color: COLORS.red   },
          ].map(f => (
            <Pill
              key={f.key}
              active={filter === f.key}
              onClick={() => setFilter(f.key)}
              color={f.color}
            >
              {/* Inline dot so it's always visible regardless of emoji support */}
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                {f.key !== "all" && (
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: filter === f.key ? "#fff" : (f.color),
                    flexShrink: 0, display: "inline-block",
                  }} />
                )}
                {f.label}
              </span>
            </Pill>
          ))}
        </div>
      </div>

      {/* ── Category tabs ── */}
      {!search && (
        <div style={{
          display: "flex", gap: 6, marginBottom: 12,
          overflowX: "auto", paddingBottom: 4,
          scrollbarWidth: "none",              // hide scrollbar on Firefox
        }}>
          {categories.map(cat => (
            <Pill key={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)}>
              {cat}
            </Pill>
          ))}
        </div>
      )}

      {/* ── Menu grid ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 10,
      }}>
        {menuItems.map(item => {
          const inOrder = order.find(o => o.id === item.id);
          return (
            <div
              key={item.id}
              onClick={() => onAddItem(item)}
              style={{
                background: COLORS.white,
                borderRadius: 12,
                border: `1.5px solid ${inOrder ? COLORS.primary : COLORS.border}`,
                padding: 12,
                cursor: "pointer",
                transition: "all 0.15s",
                boxShadow: inOrder ? `0 0 0 3px ${COLORS.primaryLight}` : "none",
                WebkitTapHighlightColor: "transparent",   // mobile tap flicker fix
                userSelect: "none",
              }}
            >
              {/* Badge row */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}>
                <Badge veg={item.veg} />
                {inOrder && (
                  <span style={{
                    background: COLORS.primary,
                    color: "#fff",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 8px",
                  }}>
                    ×{inOrder.qty}
                  </span>
                )}
              </div>

              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, lineHeight: 1.3 }}>
                {item.name}
              </div>
              <div style={{ color: COLORS.primary, fontWeight: 700, fontSize: 15 }}>
                ₹{item.price}
              </div>
            </div>
          );
        })}
      </div>

      {menuItems.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: COLORS.gray }}>
          No items found
        </div>
      )}
    </div>
  );
}
