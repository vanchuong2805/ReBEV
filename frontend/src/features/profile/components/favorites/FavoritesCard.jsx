// components/favorites/FavoriteCard.jsx
import { Button } from '@/components/ui/button'
import Frame, { formatVND } from '../CardFrame'
import { useNavigate } from "react-router-dom"
import { useFavorite } from '@/contexts/FavoritesContexts.jsx'

export default function FavoriteCard({ listing, onView, onRemove }) {
  const navigate = useNavigate()
  const { toggleFavorite } = useFavorite()

  return (
    <Frame
      listing={listing}
      tone="accent"
      badgeText={listing.status || 'Đang bán'}
      note="Tin bạn đã quan tâm"
      actions={[
        <Button size="lg"
          variant="outline"
          className="h-10 w-full"
          onClick={() =>
            navigate(`/marketplace/listing/${listing.id}`, {
              state: { from: `/profile/favorites` }
            })
          }>Chi tiết</Button>,
        <Button
          key="remove"
          size="lg"
          className="h-10 w-full bg-red-600 text-white hover:bg-red-700"
          onClick={() => {toggleFavorite(listing.id) 
            console.log('Bỏ quan tâm:', listing.id)}}
        >
          Bỏ quan tâm
        </Button>,
      ]}
    />
  )
}
