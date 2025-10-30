import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function ExpiredListingCard({ listing, onView, onRenew, onHide, onEdit }) {
  const status = (listing?.current_status || '').trim()
  const isHidden = status === 'Tin ẩn'
  const note = isHidden
    ? 'Tin đang ở trạng thái ẩn. Bỏ ẩn để tiếp tục hiển thị.'
    : 'Tin đã hết hạn. Gia hạn để tiếp tục hiển thị.'

  return (
    <Frame
      listing={listing}
      tone="accent"
      badgeText={status || 'Hết hạn'}
      note={note}
      actions={[
        <Button size="lg"
          variant="outline"
          className="h-10 w-full"
          onClick={() => onView?.(listing)}>Chi tiết</Button>,
        <Button size="lg" className="h-10 w-full bg-red-600 hover:bg-red-700" onClick={() =>  onHide?.(listing.id)}>
          Bỏ ẩn tin
        </Button>
      ]}
    />
  )
}
