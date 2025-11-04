import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function PendingSaleCard({ sale, onView, onAccept, onReject, onContact }) {
  return (
    <Frame
      listing={sale}
      tone="warning"
      badgeText={`${sale.status_vi || 'Chờ xác nhận'}${sale.order_type_vi ? ` • ${sale.order_type_vi}` : ''}`}
      note={sale.status_note || 'Đơn chờ bạn xác nhận.'}
    />
  )
}
