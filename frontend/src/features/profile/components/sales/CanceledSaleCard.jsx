import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function CanceledSaleCard({ sale, onView, onRelist, onSupport }) {
  return (
    <Frame
      listing={sale}
      tone="danger"
      badgeText={`${sale.status_vi || 'Đã huỷ'}${sale.order_type_vi ? ` • ${sale.order_type_vi}` : ''}`}
      note={sale.status_note ? `Lý do huỷ: ${sale.status_note}` : 'Đơn đã huỷ.'}
      actions={[
        <Button size="lg" variant="outline" className="h-10 w-full" onClick={() => onView?.(sale)}>
          Chi tiết
        </Button>,
        <Button size="lg" variant="outline" className="h-10 w-full" onClick={() => onRelist?.(sale)}>
          Đăng lại
        </Button>,
        <Button size="lg" variant="outline" className="h-10 w-full" onClick={() => onSupport?.(sale)}>
          Hỗ trợ
        </Button>,
      ]}
    />
  )
}
