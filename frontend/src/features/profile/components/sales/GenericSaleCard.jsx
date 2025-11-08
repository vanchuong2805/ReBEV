import Frame from '../CardFrame'

export default function GenericSaleCard({ type, sale }) {
  const isCar = sale?.category_id === 1


  const config = {
    pending: {
      tone: 'warning',
      badgeText: 'Chờ xác nhận',
      note:  'Đơn chờ bạn xác nhận.',
    },
    processing: {
      tone: 'info',
      badgeText: 'Đang xử lý',
      note:  (isCar ? 'Chuẩn bị lịch hẹn gặp.' : 'Chuẩn bị giao hàng.'),
    },
    shipping: {
      tone: 'purple',
      badgeText: 'Đang vận chuyển',
      note:  (isCar ? 'Đơn đang trên đường đến người mua.' : 'Đơn đang trên đường đến người mua.'),
    },
    success: {
      tone: 'success',
      badgeText: 'Hoàn tất',
      note: 'Giao dịch đã hoàn tất thành công.',
    },
    canceled: {
      tone: 'danger',
      badgeText: 'Đã huỷ',
      note:   'Đơn đã bị huỷ.',
    },
    refunded: {
      tone: 'accent',
      badgeText: 'Hoàn tiền đang xử lý',
      note:
        'Đơn hàng đã được yêu cầu hoàn tiền. Vui lòng chờ hệ thống xử lý giao dịch.',
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
      listing={sale}
      tone={cfg.tone}
      badgeText={cfg.badgeText}
      note={cfg.note}
    />
  )
}
