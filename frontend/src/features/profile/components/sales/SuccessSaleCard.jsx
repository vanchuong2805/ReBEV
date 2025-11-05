import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'


export default function SuccessSaleCard({ sale, onView, onContract, onMessage }) {
  return (
    <Frame
      listing={sale}
      tone="success"
      badgeText={`${sale.status_vi || 'Hoàn tất'}${sale.order_type_vi ? ` • ${sale.order_type_vi}` : ''}`}
      note="Giao dịch đã hoàn tất thành công."
    />
  )
}
