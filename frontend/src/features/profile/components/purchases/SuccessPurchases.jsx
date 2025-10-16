import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function SuccessPurchases({ purchase, onView, onInvoice, onReview }) {
  return (
    <Frame
      listing={purchase}
      tone="success"
      badgeText={`${purchase.status_vi || 'Hoàn tất'}${purchase.order_type_vi ? ` • ${purchase.order_type_vi}` : ''}`}
      note="Giao dịch đã hoàn tất thành công."
      actions={[
        <Button size="lg" variant="outline" className="h-10 w-full" onClick={() => onView?.(purchase)}>
          Chi tiết
        </Button>,
        <Button
          size="lg"
          variant="outline"
          className="h-10 w-full"
          onClick={() => onInvoice?.(purchase)}
          disabled={!purchase.contract_file}
        >
          {purchase.contract_file ? 'Tải hợp đồng' : 'Chưa có hợp đồng'}
        </Button>,
        <Button size="lg" variant="outline" className="h-10 w-full" onClick={() => onReview?.(purchase)}>
          Đánh giá
        </Button>,
      ]}
    />
  )
}
