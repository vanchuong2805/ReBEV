import { Badge } from '@/components/ui/badge'

const TONE = {
  neutral: { card: 'bg-white', badge: 'bg-slate-100 text-slate-700 border-slate-200' },
  muted: { card: 'bg-gray-50', badge: 'bg-gray-100 text-gray-700 border-gray-200' },
  success: { card: 'bg-green-50', badge: 'bg-green-100 text-green-800 border-green-200' },
  warning: { card: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  accent: { card: 'bg-orange-50', badge: 'bg-orange-100 text-orange-800 border-orange-200' },
  danger: { card: 'bg-red-50', badge: 'bg-red-100 text-red-800 border-red-200' },
}

export const formatVND = (n) =>
  typeof n === 'number'
    ? n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
    : n

export default function ListingCardFrame({
  listing = {},
  tone = 'neutral',                // neutral|muted|success|warning|accent|danger
  badgeText = 'Trạng thái',
  note,                            // dòng mô tả ngắn (optional)
  actions,                         // mảng 2-3 ReactNode cho nhóm nút
}) {
  const { title, thumbnail_url, category_name, created_at, price } = listing
  const styles = TONE[tone] || TONE.neutral

  return (
    <div className={`border rounded-lg p-6 ${styles.card}`}>
      <div className="flex gap-6">
        <img
          src={thumbnail_url || 'https://placehold.co/320x200?text=No+Image'}
          alt={title}
          className="w-32 h-24 object-cover rounded-lg"
          loading="lazy"
        />

        {/* dùng flex-col để ghìm footer xuống đáy */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-semibold mb-1 line-clamp-2">{title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="px-2 py-0.5 rounded-full bg-white/70 text-gray-800 text-xs border">
                  {category_name || 'Danh mục'}
                </span>
                {created_at && <span>• {new Date(created_at).toLocaleDateString('vi-VN')}</span>}
              </div>
              {note && <p className="text-sm mt-2">{note}</p>}
            </div>
            <Badge variant="secondary" className={styles.badge}>
              {badgeText}
            </Badge>
          </div>

          {/* Footer (cố định chiều rộng nhóm nút để thẳng hàng) */}
          <div className="mt-auto flex items-center pt-1">
            <span className="text-2xl font-bold text-gray-800">{formatVND(price)}</span>

            {/* nhóm nút: luôn căn phải, dù 2 hay 3 nút */}
            <div className="flex justify-end gap-2 ml-auto w-full max-w-[360px]">
              {/* Luôn tạo 3 slot cố định, từ phải sang trái */}
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-[120px] flex justify-end">
                  {actions?.[i] || <span className="invisible">placeholder</span>}
                </div>
              )).reverse()}
            </div>



          </div>
        </div>
      </div>
    </div>
  )
}
