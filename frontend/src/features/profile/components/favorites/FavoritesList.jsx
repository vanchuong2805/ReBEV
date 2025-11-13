import FavoritesCard from './FavoritesCard'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useUser } from '@/contexts/UserContext'
import { useFavorite } from '@/contexts/FavoritesContexts.jsx'

export default function FavoriteList() {
  const { user } = useUser();
  const { favoriteList } = useFavorite()


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
