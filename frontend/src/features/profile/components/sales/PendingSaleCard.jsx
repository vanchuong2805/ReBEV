import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function PendingSaleCard({ sale, onView, onAccept, onReject, onContact }) {
  return (
    <Frame
      listing={sale}
      tone="warning"
      badgeText={`${sale.status_vi || 'Chờ xác nhận'}${sale.order_type_vi ? ` • ${sale.order_type_vi}` : ''}`}
      note={sale.status_note || 'Đơn chờ bạn xác nhận.'}
      actions={[
        <Button size="lg" variant="outline" className="h-10 w-full" onClick={() => onView?.(sale)}>
          Chi tiết
        </Button>,
        <Button size="lg" className="h-10 w-full bg-red-600 hover:bg-red-700" onClick={() => onAccept?.(sale)}>
          Xác nhận
        </Button>,
        <Button size="lg" variant="outline" className="h-10 w-full" onClick={() => onContact?.(sale)}>
          Liên hệ người mua
        </Button>,
        <Button size="lg" variant="outline" className="h-10 w-full text-red-600 border-red-200" onClick={() => onReject?.(sale)}>
          Từ chối
        </Button>,
      ]}
    />
  )
}
