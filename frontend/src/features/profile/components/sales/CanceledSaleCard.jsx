import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function CanceledSaleCard({ sale, onView, onRelist, onSupport }) {
  return (
    <Frame
      listing={sale}
      tone="danger"
      badgeText={`${sale.status_vi || 'Đã huỷ'}${sale.order_type_vi ? ` • ${sale.order_type_vi}` : ''}`}
      note={sale.status_note ? `Lý do huỷ: ${sale.status_note}` : 'Đơn đã huỷ.'}
    />
  )
}
