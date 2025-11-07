import Frame from '../CardFrame'

export default function GenericSaleCard({ type, sale }) {
    const isCar = sale?.category_id === 1

    const config = {
        pending: {
            tone: 'warning',
            badgeText: `${sale.status_vi || 'Chờ xác nhận'}${sale.order_type_vi ? ` • ${sale.order_type_vi}` : ''}`,
            note: sale.status_note || 'Đơn chờ bạn xác nhận.',
        },
        processing: {
            tone: 'info',
            badgeText: `${sale.status_vi || 'Đang xử lý'}${sale.order_type_vi ? ` • ${sale.order_type_vi}` : ''}`,
            note: sale.status_note || (isCar ? 'Chuẩn bị lịch hẹn gặp.' : 'Chuẩn bị giao hàng.'),
        },
        shipping: {
            tone: 'purple',
            badgeText: `${sale.status_vi || 'Đang vận chuyển'}${sale.order_type_vi ? ` • ${sale.order_type_vi}` : ''}`,
            note: sale.status_note || 'Đơn đang trên đường đến người mua.',
        },
        success: {
            tone: 'success',
            badgeText: `${sale.status_vi || 'Hoàn tất'}${sale.order_type_vi ? ` • ${sale.order_type_vi}` : ''}`,
            note: 'Giao dịch đã hoàn tất thành công.',
        },
        canceled: {
            tone: 'danger',
            badgeText: `${sale.status_vi || 'Đã huỷ'}${sale.order_type_vi ? ` • ${sale.order_type_vi}` : ''}`,
            note: sale.status_note ? `Lý do huỷ: ${sale.status_note}` : 'Đơn đã bị huỷ.',
        },
        refunded: {
            tone: 'accent',
            badgeText: `${sale.status_vi || 'Hoàn tiền đang xử lý'}${sale.order_type_vi ? ` • ${sale.order_type_vi}` : ''}`,
            note:
                sale.status_note ||
                'Đơn hàng đã được yêu cầu hoàn tiền. Vui lòng chờ hệ thống xử lý giao dịch.',
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
