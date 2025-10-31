import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'


export default function SuccessSaleCard({ sale, onView, onContract, onMessage }) {
  return (
    <Frame
      listing={sale}
      tone="success"
      badgeText={`${sale.status_vi || 'Hoàn tất'}${sale.order_type_vi ? ` • ${sale.order_type_vi}` : ''}`}
      note="Giao dịch đã hoàn tất thành công."
      actions={[
        <Button size="lg" variant="outline" className="h-10 w-full" onClick={() => onView?.(sale)}>
          Chi tiết
        </Button>,
        <Button
          size="lg"
          variant="outline"
          className="h-10 w-full"
          onClick={() => onContract?.(sale)}
          disabled={!sale.contract_file}
        >
          {sale.contract_file ? 'Tải hợp đồng' : 'Chưa có hợp đồng'}
        </Button>,
        <Button size="lg" variant="outline" className="h-10 w-full" onClick={() => onMessage?.(sale)}>
          Nhắn khách
        </Button>,
      ]}
    />
  )
}
