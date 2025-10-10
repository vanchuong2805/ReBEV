import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEMO } from "@/data";

const CartCtx = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      //return JSON.parse(localStorage.getItem("cart") || "[]");
      const stored = JSON.parse(localStorage.getItem("cart"));
      if (stored && stored.length) return stored;
      return [
        { ...DEMO[0], qty: 1 },
        { ...DEMO[2], qty: 2 },
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const add = (product, qty = 1) =>
    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === product.id);
      if (i > -1) {
        const next = [...prev];
        next[i].qty += qty;
        return next;
      }
      return [...prev, { ...product, qty }];
    });

  const remove = (id) => setItems((prev) => prev.filter((p) => p.id !== id));
  const update = (id, qty) =>
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p))
    );
  const clear = () => setItems([]);

  const total = useMemo(
    () => items.reduce((s, p) => s + (p.price || 0) * p.qty, 0),
    [items]
  );
  const count = useMemo(() => items.reduce((s, p) => s + p.qty, 0), [items]);

  return (
    <CartCtx.Provider
      value={{ items, add, remove, update, clear, total, count }}
    >
      {children}
    </CartCtx.Provider>
  );
}
//eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartCtx);
