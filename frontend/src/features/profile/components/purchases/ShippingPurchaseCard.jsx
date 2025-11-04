import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function ShippingPurchaseCard({ purchase, onView, onTrack, onContact }) {
  return (
    <Frame
      listing={purchase}
      tone="muted"
      badgeText={`${purchase.status_vi || 'Đang vận chuyển'}${purchase.order_type_vi ? ` • ${purchase.order_type_vi}` : ''}`}
      note={purchase.status_note || 'Đơn hàng đang được vận chuyển đến bạn.'}
    />
  )
}
