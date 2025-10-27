import { createContext, useContext, useState, useEffect } from "react";
import { getFavoritesByUserId, addFavorite, removeFavorite } from "@/features/home/service";
import { useUser } from "./UserContext";

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
  const { user } = useUser();
  const [favoriteList, setFavoriteList] = useState([]);

  // load favorites khi user login
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user?.id) return;
      try {
        const data = await getFavoritesByUserId(user.id);
        const favorites = data.favoritePosts || [];
        setFavoriteList(favorites) ;
      } catch (e) {
        console.error("Lỗi load favorites:", e);
      }
    };
    loadFavorites();
  }, [user]);

  // toggle thêm/xóa yêu thích
  const toggleFavorite = async (postId) => {
    if (!user?.id) return;
    const isFav = favoriteList.some(f => f.id === postId);

    try {
      if (isFav) {
        await removeFavorite(postId);
        setFavoriteList(favoriteList.filter(f => f.id !== postId));
      } else {
        await addFavorite(user.id, postId);
        setFavoriteList([...favoriteList, { id: postId }]);
      }
    } catch (err) {
      console.error(" Favorite toggle failed:", err);
    }
  };

  const isFavorite = (postId) => favoriteList.some(f => f.id === postId);

  return (
    <FavoriteContext.Provider value={{ favoriteList, toggleFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorite() {
  return useContext(FavoriteContext);
}
