import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function ProcessingSaleCard({ sale, onView, onSchedule, onPrintLabel, onContact }) {
  const isShip = sale.order_type === 0
  return (
    <Frame
      listing={sale}
      tone="info"
      badgeText={`${sale.status_vi || 'Đang xử lý'}${sale.order_type_vi ? ` • ${sale.order_type_vi}` : ''}`}
      note={sale.status_note || (isShip ? 'Chuẩn bị giao hàng.' : 'Chuẩn bị lịch hẹn gặp.')}
      actions={[
        <Button size="lg" variant="outline" className="h-10 w-full" onClick={() => onView?.(sale)}>
          Chi tiết
        </Button>,
        <Button size="lg" variant="outline" className="h-10 w-full" onClick={() => onContact?.(sale)}>
          Liên hệ người mua
        </Button>,
        <Button size="lg" variant="outline" className="h-10 w-full text-red-600 border-red-200">
          Huỷ đơn
        </Button>,
      ]}
    />
  )
}
