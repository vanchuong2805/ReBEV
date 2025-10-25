import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function CanceledListingCard({ listing, onView, onRepublish }) {
  return (

    <Frame
      listing={listing}
      tone="danger"
      badgeText="Tin huỷ"
      note="Bài đăng đã bị huỷ và không còn hiển thị trên sàn."
      actions={[
        <Button size="lg"
          variant="outline"
          className="h-10 w-full"
          onClick={() => onView?.(listing)}>Chi tiết</Button>,
        <Button size="lg" className="h-10 w-full" onClick={() => onRepublish?.(listing)}>
          Đăng lại
        </Button>,
      ]}
    />
  )
}
