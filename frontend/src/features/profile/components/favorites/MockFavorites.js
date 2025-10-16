// components/favorites/MockFavorites.js
// ======================================
// Mô phỏng bảng favorite_post + build DTO hiển thị cho FE
// ======================================

// ====== RAW TABLES ======
export const favorite_post = [
  { user_id: 1, post_id: 103 }, // VinFast Feliz
  { user_id: 1, post_id: 304 }, // VinFast Vento
  { user_id: 1, post_id: 101 }, // Klara S
  { user_id: 1, post_id: 203 }, // Pin LFP 48V 15Ah
  { user_id: 1, post_id: 202 }, // Pin CATL
  { user_id: 1, post_id: 301 }  // YADEA G5
]

// ✅ import danh sách bài đăng từ MockListings (để hiển thị chi tiết)
import { mockListings } from '../listings/MockListings'

// ====== HELPERS ======
export const getFavoritesOfUser = (userId) => {
  const userFavs = favorite_post.filter(f => f.user_id === userId)
  return userFavs.map(fav => {
    const post = mockListings.find(p => p.id === fav.post_id)
    if (!post) return null
    return {
      user_id: fav.user_id,
      post_id: fav.post_id,
      title: post.title,
      price: post.price,
      category_name: post.category_name,
      thumbnail_url: post.thumbnail_url,
      current_status: post.current_status,
      created_at: post.created_at
    }
  }).filter(Boolean)
}

// ====== MOCK DTO CHO FE (ví dụ user_id = 1) ======
export const mockFavorites = getFavoritesOfUser(1)
