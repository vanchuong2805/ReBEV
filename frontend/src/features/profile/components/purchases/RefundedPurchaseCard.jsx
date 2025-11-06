import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function RefundPurchaseCard({ purchase, onView, onSupport }) {
  return (
    <Frame
      listing={purchase}
      tone="accent" // màu cam nhẹ - phù hợp trạng thái “Hoàn tiền”
      badgeText={`${purchase.status_vi || 'Hoàn tiền đang xử lý'}${purchase.order_type_vi ? ` • ${purchase.order_type_vi}` : ''}`}
      note={
        purchase.status_note ||
        'Đơn hàng đã được yêu cầu hoàn tiền. Vui lòng chờ hệ thống xử lý giao dịch.'
      }
    />
  )
}
