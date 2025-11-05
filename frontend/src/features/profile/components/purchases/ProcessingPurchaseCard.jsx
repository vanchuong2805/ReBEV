import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function ProcessingPurchaseCard({ purchase, onView }) {
  return (
    <Frame
      listing={purchase}
      tone="accent"
      badgeText= "Đang xử lý"
      note={purchase.category_id === 1 ? 'Đơn hàng đang được người bán xử lý.' : 'Người bán đang chuẩn bị giao pin cho bạn.'}
      
    />
  )
}
