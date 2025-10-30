import FavoritesCard from './FavoritesCard'
import { Car, Heart } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getFavoritesByUserId } from '../../service'
import { useUser } from '@/contexts/UserContext'
import { useState, useEffect } from 'react'
import { useFavorite } from '@/contexts/FavoritesContexts.jsx'

export default function FavoriteList() {
  const { user } = useUser();
  const { favoriteList } = useFavorite()

  useEffect(() => {
  if (!user?.id) return;
  const fetchFavorites = async () => {
    try {
      const res = await getFavoritesByUserId(user.id);
      const favorites = res.favoritePosts || [];
      setFavoriteList(favorites);
    } catch (err) {
      console.error("Lỗi load favorites:", err);
      setFavoriteList([]);
    }
  };
  fetchFavorites();
}, [user]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Danh sách quan tâm</CardTitle>
            <CardDescription>
              Các tin đăng bạn đã thêm vào danh sách yêu thích
            </CardDescription>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-500" />
            <span>Thêm tin mới</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {favoriteList.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              Chưa có tin nào trong danh sách quan tâm
            </div>
          ) : (
            favoriteList.map(item => (
              <FavoritesCard

                key={item.id || item.post_id}
                listing={item}
                onView={(l) => console.log('Xem chi tiết:', l.title)}
                onRemove={(l) => console.log('Bỏ quan tâm:', l.title)}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
