// Xây DTO đơn bán từ raw tables (tái dùng mock của listings & purchases)
import { posts, post_media, category } from '@/features/profile/components/listings/MockListings'
import { orders, order_detail, order_status } from '@/features/profile/components/purchases/MockPurchases'

// Giả lập: user hiện tại là người bán có id = 1
export const SELLER_ME = 1

const latest = (rows) => rows.slice().sort((a,b)=>new Date(a.create_at)-new Date(b.create_at)).at(-1)
const postById = (id) => posts.find(p => p.id === id)
const catName = (id) => category.find(c => c.id === id)?.name || ''
const thumbOf = (postId) => {
  const imgs = post_media.filter(m => m.post_id === postId)
  const th = imgs.find(i => i.is_thumbnail) || imgs[0]
  return th?.url || ''
}

const statusVI = (s) =>
  s === 'pending'    ? 'Chờ xác nhận'   :
  s === 'processing' ? 'Đang xử lý'     :
  s === 'in_transit' ? 'Đang vận chuyển':
  s === 'success'    ? 'Hoàn tất'       :
  s === 'canceled'   ? 'Đã huỷ'         : 'Khác'

const orderTypeVI = (t) =>
  t === 0 ? 'Mua (có ship)' : t === 1 ? 'Đặt cọc (gặp trực tiếp)' : t === 2 ? 'Hoàn tiền' : 'Khác'

// Force: Pin -> ship(0), Xe -> deposit(1)
const effectiveTypeForPost = (p) => {
  if (!p) return 0
  const name = category.find(c => c.id === p.category_id)?.name
  return name === 'Pin điện' ? 0 : 1
}

export const mockSales = orders
  .filter(o => o.seller_id === SELLER_ME)
  .map(o => {
    const d  = order_detail.find(x => x.order_id === o.id)
    const p  = d ? postById(d.post_id) : null
    const st = latest(order_status.filter(x => x.order_id === o.id))

    const effective_type = effectiveTypeForPost(p)

    return {
      ...o,
      order_type: effective_type,
      order_type_vi: orderTypeVI(effective_type),
      shipping_price: effective_type === 0 ? o.shipping_price : 0,

      post_id: d?.post_id,
      title: p?.title || `Bài đăng #${d?.post_id ?? 'N/A'}`,
      category_name: p ? catName(p.category_id) : '',
      thumbnail_url: d ? thumbOf(d.post_id) : '',

      line_price: d?.price,
      deposit_amount: d?.deposit_amount,
      appointment_time: d?.appointment_time,
      contract_file: d?.contract_file,

      status: st?.status,
      status_vi: statusVI(st?.status),
      status_note: st?.description,
    }
  })
  .sort((a,b)=>new Date(b.create_at)-new Date(a.create_at))
