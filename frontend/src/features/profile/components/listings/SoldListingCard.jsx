import { Button } from '@/components/ui/button'
import Frame from './ListingCardFrame'

export default function SoldListingCard({ listing, onView, onViewContract, onRelist }) {
  return (
    <Frame
      listing={listing}
      tone="muted"
      badgeText="Đã bán"
      actions={[
        <Button size="lg" variant="outline" className="h-10 w-full" onClick={() => onView?.(listing)}>Chi tiết</Button>,
        <Button size="lg" variant="outline" className="h-10 w-full" onClick={() => onViewContract?.(listing)}>Xem hợp đồng</Button>,
        <Button size="lg" variant="outline" className="h-10 w-full" onClick={() => onRelist?.(listing)}>Đăng lại</Button>,
      ]}
    />
  )
}
