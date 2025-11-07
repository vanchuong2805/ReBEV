import { createContext, useContext, useState, useEffect } from "react";
import { getFavoritesByUserId, addFavorite, removeFavorite } from "@/features/home/service";
import { useUser } from "./UserContext";

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
  const { user } = useUser();
  const [favoriteList, setFavoriteList] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user?.id) return;
      try {
        const data = await getFavoritesByUserId(user.id);
        const favorites = (data.favoritePosts || []).map(f => ({
          id: f.post_id || f.id,
          ...f,
        }));
        setFavoriteList(favorites);
      } catch (e) {
        console.error(" Lỗi load favorites:", e);
      }
    };
    loadFavorites();
  }, [user]);

  const toggleFavorite = async (post) => {
    if (!user?.id) return;

    const postId = typeof post === "object" ? post.id || post.post_id : post;
    const isFav = favoriteList.some(f => f.id === postId || f.post_id === postId);

    try {
      if (isFav) {
        await removeFavorite(postId);
        setFavoriteList(prev =>
          prev.filter(f => f.id !== postId && f.post_id !== postId)
        );
      } else {
        await addFavorite(user.id, postId);
        const data = await getFavoritesByUserId(user.id);
        const favorites = (data.favoritePosts || []).map(f => ({
          id: f.post_id || f.id,
          ...f,
        }));
        setFavoriteList(favorites);
      }
    } catch (err) {
      console.error(" Favorite toggle failed:", err);
    }
  };
  const isFavorite = (postId) =>
    favoriteList.some(f => f.id === postId || f.post_id === postId);

  return (
    <FavoriteContext.Provider value={{ favoriteList, toggleFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorite() {
  return useContext(FavoriteContext);
}
