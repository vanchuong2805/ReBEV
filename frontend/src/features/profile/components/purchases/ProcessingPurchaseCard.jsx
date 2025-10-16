import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function ProcessingPurchaseCard({ purchase, onView, onContact, onCancel }) {
  return (
    <Frame
      listing={purchase}
      tone="accent"
      badgeText={`${purchase.status_vi || 'Đang xử lý'}${purchase.order_type_vi ? ` • ${purchase.order_type_vi}` : ''}`}
      note={purchase.status_note || 'Người bán đang xử lý hoặc sắp xếp lịch hẹn.'}
      actions={[
        <Button size="lg" variant="outline" className="h-10 w-full" onClick={() => onView?.(purchase)}>Chi tiết</Button>,
        <Button size="lg" variant="outline" className="h-10 w-full" onClick={() => onContact?.(purchase)}>Liên hệ người bán</Button>,
        <Button size="lg" variant="outline" className="h-10 w-full text-red-600 border-red-200" onClick={() => onCancel?.(purchase)}>Huỷ đơn</Button>,
      ]}
    />
  )
}
