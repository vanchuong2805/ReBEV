import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function PendingPurchaseCard({ purchase, onView, onReschedule, onCancel }) {
  const isCar = purchase.category_id === 1

  return (
    <Frame
      listing={purchase}
      tone="warning"
      badgeText={`${purchase.status_vi || 'Chờ xác nhận'}${purchase.order_type_vi ? ` • ${purchase.order_type_vi}` : ''}`}
      note={
        isCar
          ? purchase.status_note || 'Đơn đang chờ người bán xác nhận lịch hẹn xem xe.'
          : purchase.status_note || 'Đơn hàng đang chờ xác nhận và chuẩn bị giao pin.'
      }
    />
  )
}
