// Custom hook để quản lý tìm kiếm sản phẩm
import { create } from "zustand";

const useProductSearch = create((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearSearch: () => set({ searchQuery: "" }),
}));

export { useProductSearch };
