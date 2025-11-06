import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function ShippingSaleCard({ sale, onView, onTrack, onDelivered }) {
  return (
    <Frame
      listing={sale}
      tone="purple"
      badgeText={`${sale.status_vi || 'Đang vận chuyển'}${sale.order_type_vi ? ` • ${sale.order_type_vi}` : ''}`}
      note={sale.status_note || 'Đơn đang trên đường.'}
    />
  )
}
