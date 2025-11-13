import { Button } from '@/components/ui/button'
import Frame, { formatVND } from '../CardFrame'
import { useNavigate } from "react-router-dom"
import { useFavorite } from '@/contexts/FavoritesContexts.jsx'

export default function FavoriteCard({ listing, onView, onRemove }) {
  const navigate = useNavigate()
  const { toggleFavorite } = useFavorite()


  return (
    <div onClick={() =>
      navigate(`/marketplace/listing/${listing.id}`, {
        state: { from: `/profile/favorites` }
      })
    }>

      <Frame
        listing={listing}
        tone="accent"
        badgeText={listing.status == 1 ? 'Đang bán' : 'Đã bán'}
        note="Tin bạn đã quan tâm"
        actions={[
          <Button
            key="remove"
            size="lg"
            className="h-10 w-full bg-red-600 text-white hover:bg-red-700"
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(listing.id)
              console.log('Bỏ quan tâm:', listing.id)
            }}
          >
            Bỏ quan tâm
          </Button>,
        ]}
      />
    </div>
  )
}
