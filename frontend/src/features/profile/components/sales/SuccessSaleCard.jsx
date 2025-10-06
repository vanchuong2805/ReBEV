import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const STATUS_STYLE = 'bg-green-100 text-green-800 border-green-200'
const formatVND = n => typeof n === 'number'
  ? n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
  : n

const SuccessSaleCard = ({ sale = {}, onDetail, onContract, onMessage }) => {
  const { title, category_name, thumbnail_url, create_at, status_vi='Hoàn tất', order_type_vi, total_amount, contract_file } = sale

  return (
    <div className="border rounded-lg p-6 bg-white">
      <div className="flex gap-6">
        <img src={thumbnail_url || 'https://placehold.co/320x200?text=No+Image'} alt={title} className="w-32 h-24 object-cover rounded-lg" />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <div className="text-xs text-gray-500">
                {category_name}{create_at ? ` • Hoàn tất: ${new Date(create_at).toLocaleDateString('vi-VN')}` : ''}
              </div>
              <p className="text-sm text-green-700 mt-2">Giao dịch đã hoàn tất.</p>
            </div>
            <Badge variant="secondary" className={STATUS_STYLE}>
              {status_vi}{order_type_vi ? ` • ${order_type_vi}` : ''}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">{formatVND(total_amount)}</span>
            <div className="grid grid-cols-3 gap-2 w-full sm:w-[420px]">
              <Button className="h-10 w-full" variant="outline" onClick={() => onDetail?.(sale)}>Chi tiết</Button>
              <Button className="h-10 w-full" variant="outline" onClick={() => onContract?.(sale)} disabled={!contract_file}>
                {contract_file ? 'Tải hợp đồng' : 'Chưa có hợp đồng'}
              </Button>
              <Button className="h-10 w-full" variant="outline" onClick={() => onMessage?.(sale)}>Nhắn khách</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SuccessSaleCard
