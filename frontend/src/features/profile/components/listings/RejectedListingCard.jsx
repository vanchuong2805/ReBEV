import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function RejectedListingCard({ listing, onView, onEdit, onResubmit, onDelete }) {
  const reason = listing?.rejected_reason || listing?.status_description || 'Không rõ lý do'
  
  return (
    <div onClick={() => onView?.(listing)}>
    <Frame 
      listing={listing}
      tone="danger"
      badgeText="Bị từ chối"
      note={<span className="text-red-700">Lý do bị từ chối: <span className="font-medium">{reason}</span></span>}
    />
    </div>
  )
}
