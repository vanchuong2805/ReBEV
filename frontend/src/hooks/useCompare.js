import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCompare = create(
  persist(
    (set, get) => ({
      compareList: [],

      // Thêm sản phẩm vào danh sách so sánh
      addToCompare: (productId) => {
        const { compareList } = get();
        if (compareList.includes(productId)) return;
        if (compareList.length >= 4) {
          // Giới hạn tối đa 4 sản phẩm
          return;
        }
        set({ compareList: [...compareList, productId] });
      },

      // Xóa sản phẩm khỏi danh sách
      removeFromCompare: (productId) => {
        const { compareList } = get();
        set({ compareList: compareList.filter((id) => id !== productId) });
      },

      // Check xem sản phẩm có trong danh sách không
      isInCompare: (productId) => {
        const { compareList } = get();
        return compareList.includes(productId);
      },

      // Clear toàn bộ danh sách
      clearCompare: () => {
        set({ compareList: [] });
      },

      // Get số lượng sản phẩm trong danh sách
      getCompareCount: () => {
        const { compareList } = get();
        return compareList.length;
      },
    }),
    {
      name: "compare-storage", // key trong localStorage
    }
  )
);
