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
    onCancel,
    onSupport,
}) {
    const isCar = purchase?.category_id === 1

    const config = {
        pending: {
            tone: "warning",
            badgeText: `${purchase.status_vi || "Chờ xác nhận"}${purchase.order_type_vi ? ` • ${purchase.order_type_vi}` : ""}`,
            note: isCar
                ? purchase.status_note || "Đơn đang chờ người bán xác nhận lịch hẹn xem xe."
                : purchase.status_note || "Đơn hàng đang chờ xác nhận và chuẩn bị giao pin.",
        },
        processing: {
            tone: "accent",
            badgeText: `${purchase.status_vi || "Đang xử lý"}${purchase.order_type_vi ? ` • ${purchase.order_type_vi}` : ""}`,
            note:
                purchase.status_note ||
                (isCar
                    ? "Đơn hàng đang được người bán xử lý."
                    : "Người bán đang chuẩn bị giao pin cho bạn."),
        },
        shipping: {
            tone: "muted",
            badgeText: `${purchase.status_vi || "Đang vận chuyển"}${purchase.order_type_vi ? ` • ${purchase.order_type_vi}` : ""}`,
            note: purchase.status_note || "Đơn hàng đang được vận chuyển đến bạn.",
        },
        success: {
            tone: "success",
            badgeText: `${purchase.status_vi || "Hoàn tất"}${purchase.order_type_vi ? ` • ${purchase.order_type_vi}` : ""}`,
            note: "Giao dịch đã hoàn tất thành công.",
            actions: [
                status === "DELIVERED" ? (
                    <Button
                        key="complaint"
                        size="lg"
                        variant="outline"
                        className="h-10 w-full"
                        onClick={() => onComplaint?.(purchase)}
                    >
                        Khiếu nại
                    </Button>
                ) : (
                    <Button
                        key="review"
                        size="lg"
                        variant="outline"
                        className="h-10 w-full"
                        onClick={() => onReview?.(purchase, reviewed)}
                    >
                        {reviewed ? "Cập nhật đánh giá" : "Đánh giá"}
                    </Button>
                ),
            ],
        },
        canceled: {
            tone: "danger",
            badgeText: `${purchase.status_vi || "Đã huỷ"}${purchase.order_type_vi ? ` • ${purchase.order_type_vi}` : ""}`,
            note: purchase.status_note || "Đơn hàng đã bị huỷ.",
        },
        refunded: {
            tone: "accent",
            badgeText: `${purchase.status_vi || "Hoàn tiền đang xử lý"}${purchase.order_type_vi ? ` • ${purchase.order_type_vi}` : ""}`,
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
