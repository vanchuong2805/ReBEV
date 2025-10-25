import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function ShippingSaleCard({ sale, onView, onTrack, onDelivered }) {
  return (
    <Frame
      listing={sale}
      tone="purple"
      badgeText={`${sale.status_vi || 'Đang vận chuyển'}${sale.order_type_vi ? ` • ${sale.order_type_vi}` : ''}`}
      note={sale.status_note || 'Đơn đang trên đường.'}
      actions={[
        <Button size="lg" variant="outline" className="h-10 w-full" onClick={() => onView?.(sale)}>
          Chi tiết
        </Button>,
        <Button size="lg" variant="outline" className="h-10 w-full" onClick={() => onTrack?.(sale)}>
          Theo dõi
        </Button>,
        <Button size="lg" className="h-10 w-full bg-red-600 hover:bg-red-700" onClick={() => onDelivered?.(sale)}>
          Đánh dấu đã giao
        </Button>,
      ]}
    />
  )
}
