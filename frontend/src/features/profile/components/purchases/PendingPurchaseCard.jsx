import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const STATUS_STYLE =
  'bg-yellow-100 text-yellow-800 border-yellow-200'

const formatVND = n =>
  typeof n === 'number'
    ? n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
    : n

const PendingPurchaseCard = ({ purchase = {}, onView, onPay, onCancel }) => {
  const {
    title, category_name, thumbnail_url, create_at,
    total_amount, status_vi = 'Chờ xác nhận', order_type_vi,
    status_note,
  } = purchase

  return (
    <div className="border rounded-lg p-6 bg-white">
      <div className="flex gap-6">
        <img
          src={thumbnail_url || 'https://placehold.co/320x200?text=No+Image'}
          alt={title}
          className="w-32 h-24 object-cover rounded-lg"
          loading="lazy"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <div className="text-xs text-gray-500">
                {category_name}{create_at ? ` • Đặt lúc: ${new Date(create_at).toLocaleString('vi-VN')}` : ''}
              </div>
              <p className="text-sm text-yellow-700 mt-2">
                {status_note || 'Đơn đang chờ người bán xác nhận / hoặc bạn cần thanh toán đặt cọc.'}
              </p>
            </div>
            <Badge variant="secondary" className={STATUS_STYLE}>
              {status_vi}{order_type_vi ? ` • ${order_type_vi}` : ''}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">{formatVND(total_amount)}</span>
            <div className="grid grid-cols-3 gap-2 w-full sm:w-[420px]">
              <Button className="h-10 w-full" variant="outline" onClick={() => onView?.(purchase)}>Chi tiết</Button>
              <Button className="h-10 w-full bg-red-600 hover:bg-red-700" onClick={() => onPay?.(purchase)}>Thanh toán</Button>
              <Button className="h-10 w-full text-red-600 border-red-200" variant="outline" onClick={() => onCancel?.(purchase)}>Huỷ đơn</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PendingPurchaseCard
