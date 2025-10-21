import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEMO } from "@/data";

const CartCtx = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("cart"));
      if (stored && stored.length) return stored;
      // Thêm dữ liệu demo với trạng thái 'selected' mặc định là true
      return [
        { ...DEMO[0], qty: 1, selected: true },
        { ...DEMO[2], qty: 2, selected: true },
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
      // Khi thêm sản phẩm mới, mặc định là đã được chọn
      return [...prev, { ...product, qty, selected: true }];
    });

  const remove = (id) => setItems((prev) => prev.filter((p) => p.id !== id));

  const update = (id, qty) =>
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p))
    );

  // --- LOGIC MỚI CHO VIỆC LỰA CHỌN SẢN PHẨM ---

  // Hàm để chọn hoặc bỏ chọn một sản phẩm
  const toggleSelection = (id) => {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  // Hàm để chọn hoặc bỏ chọn TẤT CẢ sản phẩm
  const toggleAllSelection = (isSelected) => {
    setItems((prev) => prev.map((p) => ({ ...p, selected: isSelected })));
  };

  // Hàm để xóa các sản phẩm ĐÃ ĐƯỢC CHỌN
  const clearSelected = () => {
    setItems((prev) => prev.filter((p) => !p.selected));
  };

  // Lấy ra danh sách các sản phẩm đã được chọn
  const selectedItems = useMemo(() => items.filter((p) => p.selected), [items]);

  // Kiểm tra xem tất cả sản phẩm có đang được chọn không
  const isAllSelected = useMemo(
    () => items.length > 0 && items.every((p) => p.selected),
    [items]
  );

  // Tính tổng tiền của các sản phẩm ĐÃ ĐƯỢC CHỌN
  const selectedTotal = useMemo(
    () => selectedItems.reduce((s, p) => s + (p.price || 0) * p.qty, 0),
    [selectedItems]
  );

  const count = useMemo(() => items.reduce((s, p) => s + p.qty, 0), [items]);
  const itemCount = useMemo(() => items.length, [items]);
  // Cung cấp các hàm và state mới ra ngoài context
  const value = {
    items,
    add,
    remove,
    update,
    count,
    itemCount,
    selectedItems,
    selectedTotal,
    isAllSelected,
    toggleSelection,
    toggleAllSelection,
    clearSelected,
  };

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

//eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartCtx);
