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
  tone = 'neutral',               
  badgeText = 'Trạng thái',
  note,                          
  actions,                       
}) {
  const { title, media, category_id, created_at, price } = listing
  const styles = TONE[tone] || TONE.neutral

  // Parse media JSON -> lấy thumbnail URL
  let thumbnailUrl = '/placeholder.png'
  try {
    const parsed = typeof media === 'string' ? JSON.parse(media) : media
    const thumb = parsed?.find((item) => item.is_thumbnail)
    thumbnailUrl = thumb?.url?.replace(/^image\s+/i, '') || thumbnailUrl
  } catch (e) {
    console.error(' Lỗi parse media:', e)
  }

  return (
    <div className={`border rounded-lg p-6 ${styles.card}`}>
      <div className="flex gap-6">
        {/* Hình ảnh thumbnail */}
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-32 h-24 object-cover rounded-lg"
          loading="lazy"
          onError={(e) => (e.target.src = '/placeholder.png')}
        />

        {/* Phần nội dung */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-semibold mb-1 line-clamp-2">{title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="px-2 py-0.5 rounded-full bg-white/70 text-gray-800 text-xs border">
                  {category_id === 1 ? 'Xe máy' : 'Pin điện'}
                </span>
                {created_at && (
                  <span>• {new Date(created_at).toLocaleDateString('vi-VN')}</span>
                )}
              </div>
              {note && <p className="text-sm mt-2">{note}</p>}
            </div>

            <Badge variant="secondary" className={styles.badge}>
              {badgeText}
            </Badge>
          </div>

          {/* Footer */}
          <div className="mt-auto flex items-center pt-1">
            <span className="text-2xl font-bold text-gray-800">
              {formatVND(price)}
            </span>

            {/* Nhóm nút hành động */}
            <div className="flex justify-end gap-2 ml-auto w-full max-w-[360px]">
              {[0, 1, 2]
                .map((i) => (
                  <div key={i} className="w-[120px] flex justify-end">
                    {actions?.[i] || <span className="invisible">placeholder</span>}
                  </div>
                ))
                .reverse()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
