import { Button } from '@/components/ui/button'
import Frame, { formatVND } from '../CardFrame'

export default function ListingCard({ listing, onView, onEdit, onHide }) {
  return (
    <Frame
      listing={listing}
      tone="neutral"
      badgeText={listing?.current_status || 'Đang bán'}
      actions={[
        <Button size="lg"
          variant="outline"
          className="h-10 w-full"
          onClick={() => onView?.(listing)}>Chi tiết</Button>,
        <Button size="lg"
          variant="outline"
          className="h-10 w-full text-red-600 border-red-200"
          onClick={() => onHide?.(listing.id)}>Ẩn tin</Button>,
      ]}
    />
  )
}
