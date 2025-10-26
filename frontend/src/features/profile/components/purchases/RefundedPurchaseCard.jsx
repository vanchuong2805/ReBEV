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
      actions={[
        <Button
          key="view"
          size="lg"
          variant="outline"
          className="h-10 w-full"
          onClick={() => onView?.(purchase)}
        >
          Chi tiết
        </Button>,
        <Button
          key="support"
          size="lg"
          variant="outline"
          className="h-10 w-full text-orange-600 border-orange-200"
          onClick={() => onSupport?.(purchase)}
        >
          Hỗ trợ
        </Button>,
      ]}
    />
  )
}
