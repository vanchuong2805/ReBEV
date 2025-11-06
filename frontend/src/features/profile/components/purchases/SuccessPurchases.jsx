import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function SuccessPurchases({ purchase, reviewed, onComplaint, onReview, detail, status }) {


  return (
    <Frame
      listing={purchase}
      tone="success"
      badgeText={`${purchase.status_vi || 'Hoàn tất'}${purchase.order_type_vi ? ` • ${purchase.order_type_vi}` : ''}`}
      note="Giao dịch đã hoàn tất thành công."
      actions={[
        (status === 'DELIVERED') ? (
            <Button size="lg" variant="outline" className="h-10 w-full" onClick={() => onComplaint?.(detail)}>
              Khiếu nại
            </Button>
            ) : (
            <Button size="lg" variant="outline" className="h-10 w-full" onClick={() => onReview?.(detail, reviewed)}>
              {reviewed ? 'Cập nhật đánh giá' : 'Đánh giá'}
            </Button>
        ) 
      ]}
    />
  )
}

       
    