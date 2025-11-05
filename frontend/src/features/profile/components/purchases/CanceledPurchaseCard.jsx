import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function CanceledPurchaseCard({ purchase, onView, onReorder, onSupport }) {
  return (
    <Frame
      listing={purchase}
      tone="danger"
      badgeText={`${purchase.status_vi || 'Đã huỷ'}${purchase.order_type_vi ? ` • ${purchase.order_type_vi}` : ''}`}
      note={purchase.status_note ? `Lý do huỷ: ${purchase.status_note}` : 'Đơn hàng đã bị huỷ.'}
    />
  )
}
