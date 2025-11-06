import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function ProcessingSaleCard({ sale, onView, onSchedule, onPrintLabel, onContact }) {
  const isShip = sale.category_id
  return (
    <Frame
      listing={sale}
      tone="info"
      badgeText={`${sale.status_vi || 'Đang xử lý'}${sale.order_type_vi ? ` • ${sale.order_type_vi}` : ''}`}
      note={sale.status_note || (isShip ? 'Chuẩn bị giao hàng.' : 'Chuẩn bị lịch hẹn gặp.')}
    />
  )
}
