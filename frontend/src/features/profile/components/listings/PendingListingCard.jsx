import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function PendingListingCard({ listing, onView, onEdit, onCancel }) {
  return (
    <div onClick={() => onView?.(listing)}>
    <Frame 
      listing={listing}
      tone="warning"
      badgeText="Chờ duyệt"
      note="Tin đang được kiểm duyệt. Thời gian duyệt dự kiến: 1–2 ngày làm việc."
      actions={[
        <Button size="lg" variant="outline" className="h-10 w-full" onClick={() => onEdit?.(listing)}>Chỉnh sửa</Button>,
        <Button size="lg" variant="outline" className="h-10 w-full text-red-600 border-red-200" onClick={() => onCancel?.(listing)}>Hủy tin</Button>,
      ]}
    />
    </div>
  )
}
