// components/favorites/FavoriteCard.jsx
import { Button } from '@/components/ui/button'
import Frame, { formatVND } from '../listings/ListingCardFrame'

export default function FavoriteCard({ listing, onView, onRemove }) {
  const { title, category_name, thumbnail_url, price, current_status, created_at } = listing || {}

  return (
    <Frame
      listing={{
        title,
        category_name,
        thumbnail_url,
        price,
        created_at,
      }}
      tone="accent"
      badgeText={current_status || 'Đang bán'}
      note="Tin bạn đã quan tâm"
      actions={[
        <Button
          key="view"
          size="lg"
          variant="outline"
          className="h-10 w-full"
          onClick={() => onView?.(listing)}
        >
          Xem chi tiết
        </Button>,
        <Button
          key="remove"
          size="lg"
          className="h-10 w-full bg-red-600 text-white hover:bg-red-700"
          onClick={() => onRemove?.(listing)}
        >
          Bỏ quan tâm
        </Button>,
      ]}
    />
  )
}
