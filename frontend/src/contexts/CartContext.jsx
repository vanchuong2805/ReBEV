import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCartItems } from "@/features/cart/service.js";
import PromotionBanner from "@/features/home/components/PromotionBanner";
import { addCarts } from "@/features/marketplace/service";

const CartCtx = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [refresh, setRefresh] = useState(0);
  
  function getThumbnail(media) {
    // media là chuỗi JSON: [{ url: "image https://...", is_thumbnail: true }, ...]
    try {
      const arr = JSON.parse(media);
      const pick = arr.find((m) => m.is_thumbnail) || arr[0];
      return pick?.url?.replace(/^(image|video)\s+/, "") || "/placeholder.webp";
    } catch {
      return "/placeholder.webp";
    }
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const fetchData = async () => {
      if (user.id) {
        const data = await getCartItems(user.id);
        const cartItems = data.map((item) => ({
          ...item,
          items: item.items.map((it) => ({
            ...it,
            selected: false,
          })),
          selected: false,
        }));
        console.log(cartItems);
        setItems(cartItems);
      }
    };
    fetchData();
  }, [refresh]);

  const addToCart = async (userId, postId) => {
    await addCarts(userId, postId);
    setRefresh((prev) => prev + 1);
  };

  // --- LOGIC MỚI CHO VIỆC LỰA CHỌN SẢN PHẨM ---

  // Hàm để chọn hoặc bỏ chọn một sản phẩm
  const toggleSelection = (id) => {
    setItems((prev) =>
      prev.map((p) => ({
        ...p,
        items: p.items.map((it) =>
          it.post_id === id ? { ...it, selected: !it.selected } : it
        ),
      }))
    );
  };

  // Hàm để chọn hoặc bỏ chọn một nhóm sản phẩm
  const toggleGroupSelection = ({ seller_id, seller_contact_id }) => {
    setItems((prev) =>
      prev.map((p) =>
        p.seller_id === seller_id && p.seller_contact_id === seller_contact_id
          ? {
              ...p,
              selected: !p.selected,
              items: p.items.map((it) => ({ ...it, selected: !p.selected })),
            }
          : p
      )
    );
  };

  // Hàm để chọn hoặc bỏ chọn TẤT CẢ sản phẩm
  const toggleAllSelection = (isSelected) => {
    setItems((prev) =>
      prev.map((p) => ({
        ...p,
        items: p.items.map((it) => ({ ...it, selected: isSelected })),
      }))
    );
  };

  // Hàm để xóa các sản phẩm ĐÃ ĐƯỢC CHỌN
  const clearSelected = () => {
    setItems((prev) => prev.filter((p) => !p.selected));
  };

  // Lấy ra danh sách các sản phẩm đã được chọn
  const selectedGroups = useMemo(() => {
    const groups = items.filter((p) => p.items.some((it) => it.selected));
    const groupItems = groups.map((p) => ({
      ...p,
      items: p.items.filter((it) => it.selected),
    }));
    return groupItems;
  }, [items]);

  // Kiểm tra xem tất cả sản phẩm có đang được chọn không
  const isAllSelected = useMemo(
    () =>
      items.length > 0 &&
      items.every((p) => p.items.every((it) => it.selected)),
    [items]
  );

  const isGroupSelected = ({ seller_id, seller_contact_id }) => {
    const group = items.find(
      (p) =>
        p.seller_id === seller_id && p.seller_contact_id === seller_contact_id
    );
    return group ? group.items.every((it) => it.selected) : false;
  };

  // Tính tổng tiền của các sản phẩm ĐÃ ĐƯỢC CHỌN
  const selectedTotal = useMemo(
    () =>
      items.reduce(
        (s, p) =>
          s +
          (p.items.reduce((ss, it) => ss + (it.selected ? it.price : 0), 0) ||
            0),
        0
      ),
    [items]
  );

  // Tinh so luong san pham trong gio hang
  const cartItemCount = useMemo(
    () => items.reduce((count, p) => count + p.items.length, 0),
    [items]
  );

  // Cung cấp các hàm và state mới ra ngoài context
  const value = {
    items,
    selectedGroups,
    selectedTotal,
    isAllSelected,
    cartItemCount,
    isGroupSelected,
    toggleSelection,
    toggleAllSelection,
    clearSelected,
    toggleGroupSelection,
    addToCart,
  };

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

//eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartCtx);
