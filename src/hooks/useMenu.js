import { useState, useEffect } from "react";
import { menuApi } from "../api";

/**
 * Loads menu items from the backend grouped by category.
 * Falls back to empty object while loading.
 */
export function useMenu() {
  const [menu, setMenu] = useState({});       // { "Starters": [...], ... }
  const [menuLoading, setMenuLoading] = useState(true);

  useEffect(() => {
    menuApi.getAll()
      .then(({ data }) => setMenu(data))
      .catch(console.error)
      .finally(() => setMenuLoading(false));
  }, []);

  return { menu, menuLoading };
}
