import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function GenericPurchaseCard({
    type,
    purchase,
    status,
    reviewed,
    onComplaint,
    onReview,
    onView,
    order,
    onCancel,
    onSupport,
}) {
    const isCar = purchase?.category_id === 1

    const config = {
        pending: {
            tone: "warning",
            badgeText: "Chờ xác nhận",
            note: isCar
                ? purchase.status_note || "Đơn đang chờ người bán xác nhận lịch hẹn xem xe."
                : purchase.status_note || "Đơn hàng đang chờ xác nhận và chuẩn bị giao pin.",
        },
        processing: {
            tone: "accent",
            badgeText: "Đang xử lý",
            note:
                purchase.status_note ||
                (isCar
                    ? "Đơn hàng đang được người bán xử lý."
                    : "Người bán đang chuẩn bị giao pin cho bạn."),
        },
        shipping: {
            tone: "muted",
            badgeText: "Đang vận chuyển",
            note: purchase.status_note || "Đơn hàng đang được vận chuyển đến bạn.",
        },
        success: {
            tone: "success",
            badgeText:
                order?.complaints?.length > 0
                    ? "Khiếu nại"
                    : status === "DELIVERED"
                        ? "Đã giao hàng"
                        : "Đã hoàn tất",
            note: "Giao dịch đã hoàn tất thành công.",
            actions:
                status === "DELIVERED"
                    ? order.complaints?.length > 0
                        ? []
                        : [
                            <Button
                                key="complaint"
                                size="lg"
                                variant="outline"
                                className="h-10 w-full"
                                onClick={() => onComplaint?.(purchase)}
                            >
                                Khiếu nại
                            </Button>,
                        ]
                    : [
                        <Button
                            key="review"
                            size="lg"
                            variant="outline"
                            className="h-10 w-full"
                            onClick={() => onReview?.(order, reviewed)}
                        >
                            {reviewed ? "Cập nhật đánh giá" : "Đánh giá"}
                        </Button>,
                    ],

        },
        canceled: {
            tone: "danger",
            badgeText: "Đã huỷ",
            note: purchase.status_note || "Đơn hàng đã bị huỷ.",
        },
        refunded: {
            tone: "accent",
            badgeText: "Hoàn tiền đang xử lý",
            note:
                purchase.status_note ||
                "Đơn hàng đã được yêu cầu hoàn tiền. Vui lòng chờ hệ thống xử lý.",
            actions: [
                <Button
                    key="support"
                    size="lg"
                    variant="outline"
                    className="h-10 w-full"
                    onClick={() =>
                        window.open(
                            `mailto:support@rebev.vn?subject=Hỗ trợ hoàn tiền #${purchase.id}`
                        )
                    }
                >
                    Liên hệ hỗ trợ
                </Button>,
            ],
        },
    }

    const cfg = config[type] || {}

    return (
        <Frame
            listing={purchase}
            tone={cfg.tone}
            badgeText={cfg.badgeText}
            note={cfg.note}
            actions={cfg.actions}
            onClick={() => onView?.(purchase)}
        />
    )
}
