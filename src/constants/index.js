// ── Menu Data ─────────────────────────────────────────────────────────────────
export const MENU = {
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

// ── Tables ────────────────────────────────────────────────────────────────────
export const TABLES = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  label: `T${i + 1}`,
  capacity: i < 4 ? 2 : i < 8 ? 4 : 6,
}));

// ── Tax / Charges ─────────────────────────────────────────────────────────────
export const TAX_RATE = 0.05;       // 5% GST
export const SERVICE_CHARGE = 0.1; // 10%

// ── Design Tokens ─────────────────────────────────────────────────────────────
export const COLORS = {
  primary: "#E8521A",
  primaryLight: "#FFF0EA",
  dark: "#1A1A2E",
  gray: "#64748B",
  lightGray: "#F1F5F9",
  border: "#E2E8F0",
  white: "#FFFFFF",
  green: "#16A34A",
  red: "#DC2626",
  amber: "#D97706",
  surface: "#FAFAFA",
};
