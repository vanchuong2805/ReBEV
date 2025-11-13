import { Button } from "@/components/ui/button"
import Frame from "../CardFrame"

export default function GenericListingCard({
    listing,
    type,
    onView,
    onEdit,
    onCancel,
    onHide,
    onRenew,
    onViewContract,
}) {
    const reason = listing?.rejected_reason || listing?.status_description || "Không rõ lý do"

    const config = {
        pending: {
            tone: "warning",
            badgeText: "Chờ duyệt",
            note: "Tin đang được kiểm duyệt. Thời gian duyệt dự kiến: 1–2 ngày làm việc.",
            actions: [
                <Button
                    key="edit"
                    size="lg"
                    variant="outline"
                    className="h-10 w-full"
                    onClick={(e) => {
                        e.stopPropagation()
                        onEdit?.()
                    }}
                >
                    Chỉnh sửa
                </Button>,
                <Button
                    key="cancel"
                    size="lg"
                    variant="outline"
                    className="h-10 w-full text-red-600 border-red-200"
                    onClick={(e) => {
                        e.stopPropagation()
                        onCancel?.()
                    }}
                >
                    Hủy tin
                </Button>,
            ],
        },
        active: {
            tone: "neutral",
            badgeText: "Đang bán",
            actions: [
                <Button
                    key="hide"
                    size="lg"
                    variant="outline"
                    className="h-10 w-full text-red-600 border-red-200"
                    onClick={(e) => {
                        e.stopPropagation()
                        onHide?.()
                    }}
                >
                    Ẩn tin
                </Button>,
            ],
        },
        sold: {
            tone: "muted",
            badgeText: "Đã bán",
        },
        expired: {
            tone: "accent",
            badgeText: "Tin ẩn",
            note: "Tin đang ở trạng thái ẩn. Bỏ ẩn để hiển thị lại.",
            actions: [
                <Button
                    key="unhide"
                    size="lg"
                    className="h-10 w-full bg-red-600 hover:bg-red-700"
                    onClick={(e) => {
                        e.stopPropagation()
                        onHide?.()
                    }}
                >
                    Bỏ ẩn tin
                </Button>,
            ],
        },
        rejected: {
            tone: "danger",
            badgeText: "Bị từ chối",
            note: (
                <span className="text-red-700">
                    Lý do bị từ chối: <span className="font-medium">{reason}</span>
                </span>
            ),
        },
        canceled: {
            tone: "danger",
            badgeText: "Tin huỷ",
            note: "Bài đăng đã bị huỷ và không còn hiển thị trên sàn.",
        },
    }

    const cfg = config[type] || {}

    return (
        <div onClick={() => onView?.()}>
            <Frame
                listing={listing}
                tone={cfg.tone}
                badgeText={cfg.badgeText}
                note={cfg.note}
                actions={cfg.actions}
            />
        </div>
    )
}
