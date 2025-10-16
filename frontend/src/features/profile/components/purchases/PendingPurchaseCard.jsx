import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function PendingPurchaseCard({ purchase, onView, onReschedule, onCancel }) {
  const isCar = purchase.category_name?.toLowerCase().includes('xe')

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
      actions={[
        <Button size="lg" variant="outline" className="h-10 w-full" onClick={() => onView?.(purchase)}>Chi tiết</Button>,
        isCar && <Button size="lg" variant="outline" className="h-10 w-full text-blue-600 border-blue-200" onClick={() => onReschedule?.(purchase)}>Đổi lịch</Button>,
        isCar && <Button size="lg" variant="outline" className="h-10 w-full text-red-600 border-red-200" onClick={() => onCancel?.(purchase)}>Huỷ lịch</Button>,
      ]}
    />
  )
}
