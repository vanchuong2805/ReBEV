import Frame from '../CardFrame'

export default function GenericSaleCard({ type, post, detail, status }) {
  const isCar = post?.category_id === 1


  const config = {
    pending: {
      tone: 'warning',
      badgeText: (status === "PENDING" ? "Đang thanh toán" : "Chờ xác nhận"),
      note: 'Đơn chờ bạn xác nhận.',
    },
    processing: {
      tone: 'info',
      badgeText: 'Đang xử lý',
      note: (isCar ? 'Chuẩn bị lịch hẹn gặp.' : 'Chuẩn bị giao hàng.'),
    },
    shipping: {
      tone: 'purple',
      badgeText: 'Đang vận chuyển',
      note: (isCar ? 'Đơn đang trên đường đến người mua.' : 'Đơn đang trên đường đến người mua.'),
    },
    success: {
      tone: "success",
      badgeText:
        detail?.complaints?.length > 0
          ? "Khiếu nại"
          : status === "DELIVERED"
            ? "Đã giao hàng"
            : "Đã hoàn tất",
      note:
        status === "DELIVERED"
          ? "Hàng đã được giao đến người mua."
          : "Giao dịch đã hoàn tất thành công.",
    },
    canceled: {
      tone: 'danger',
      badgeText: 'Đã huỷ',
      note: 'Đơn đã bị huỷ.',
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
    },
    return: {
      tone: 'secondary',
      badgeText: 'Đơn hoàn trả',
      note:
        'Người mua đã gửi yêu cầu hoàn trả hàng. Vui lòng kiểm tra và phản hồi.',
    },
  }

  const cfg = config[type] || {}

  return (
    <Frame
      listing={post}
      tone={cfg.tone}
      badgeText={cfg.badgeText}
      note={cfg.note}
    />
  )
}
