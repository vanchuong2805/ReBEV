import { Button } from '@/components/ui/button'
import Frame from '../CardFrame'

export default function GenericPurchaseCard({
    type,
    detail,
    status,
    reviewed,
    onComplaint,
    onReview,
    onView,
    post,
}) {
    const isCar = post?.category_id === 1

    const config = {
        pending: {
            tone: "warning",
            badgeText: "Chờ xác nhận",
            note: isCar
                ? "Đơn đang chờ người bán xác nhận lịch hẹn xem xe."
                : "Đơn hàng đang chờ xác nhận và chuẩn bị giao pin.",
        },
        processing: {
            tone: "accent",
            badgeText: "Đang xử lý",
            note:
                (isCar
                    ? "Đơn hàng đang được người bán xử lý."
                    : "Người bán đang chuẩn bị giao pin cho bạn."),
        },
        shipping: {
            tone: "muted",
            badgeText: "Đang vận chuyển",
            note: "Đơn hàng đang được vận chuyển đến bạn.",
        },
        success: {
            tone: "success",
            badgeText:
                detail?.complaints?.length > 0
                    ? "Khiếu nại"
                    : status === "DELIVERED"
                        ? "Đã giao hàng"
                        : "Đã hoàn tất",
            note: "Giao dịch đã hoàn tất thành công.",
            actions:
                status === "DELIVERED"
                    ? detail.complaints?.length > 0
                        ? []
                        : [
                            <Button
                                key="complaint"
                                size="lg"
                                variant="outline"
                                className="h-10 w-full"
                                onClick={() => onComplaint?.(detail)}
                            >
                                Khiếu nại
                            </Button>,
                        ] : status === "COMPLETED" && !detail.complaints?.length > 0 ? [
                            <Button
                                key="review"
                                size="lg"
                                variant="outline"
                                className="h-10 w-full"
                                onClick={() => onReview?.(detail, reviewed)}
                            >
                                {reviewed ? "Cập nhật đánh giá" : "Đánh giá"}
                            </Button>,
                        ] : [],

        },
        canceled: {
            tone: "danger",
            badgeText: "Đã huỷ",
            note: "Đơn hàng đã bị huỷ.",
        },
        refunded: {
            tone: "accent",
            badgeText:
                status === "PENDING"
                    ? "Chờ bàn giao hàng"
                    : status === "RETURNING"
                        ? "Đang giao hàng"
                        : status === "RETURNED"
                            ? "Đã hoàn hàng"
                            : "Đơn đã huỷ",
            note:
                status === "PENDING"
                    ? "Vui lòng mang hàng tới điểm hẹn để bàn giao."
                    : status === "RETURNING"
                        ? "Đơn hoàn đang trong quá trình bàn giao."
                        : status === "RETURNED"
                            ? "Hàng đã được hoàn trả thành công."
                            : "Đơn hàng đã bị huỷ.",
        },

    }

    const cfg = config[type] || {}

    return (
        <Frame
            listing={post}
            tone={cfg.tone}
            badgeText={cfg.badgeText}
            note={cfg.note}
            actions={cfg.actions}
            onClick={() => onView?.(purchase)}
        />
    )
}
