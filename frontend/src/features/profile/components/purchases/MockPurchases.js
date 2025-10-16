// Giống bên listings: mock DB + DTO cho UI
import { posts, post_media, category } from '@/features/profile/components/listings/MockListings'

// ===== RAW TABLES (đã chỉnh theo rule: Pin -> ship, Xe -> đặt cọc) =====
export const orders = [
  // 101: Xe -> deposit (1), không ship
  { id: 9001, customer_id: 9, seller_id: 1, customer_contact_id: 101, seller_contact_id: 201, order_type: 1, shipping_price: 0,       total_amount: 14500000, paid_amount: 2000000,  unpaid_amount: 12500000, create_at: '2025-09-26T11:10:00+07:00' },

  // 201: Pin -> ship (0)
  { id: 9002, customer_id: 9, seller_id: 1, customer_contact_id: 101, seller_contact_id: 202, order_type: 0, shipping_price: 60000,   total_amount: 2500000,  paid_amount: 500000,   unpaid_amount: 2000000,  create_at: '2025-09-26T12:00:00+07:00' },

  // 301: Xe -> deposit (1), không ship (đã hoàn tất)
  { id: 9003, customer_id: 9, seller_id: 1, customer_contact_id: 101, seller_contact_id: 201, order_type: 1, shipping_price: 0,       total_amount: 16500000, paid_amount: 16500000, unpaid_amount: 0,        create_at: '2025-09-20T09:00:00+07:00' },

  // 501: Xe -> deposit (1), không ship (đã huỷ)
  { id: 9004, customer_id: 9, seller_id: 1, customer_contact_id: 101, seller_contact_id: 205, order_type: 1, shipping_price: 0,       total_amount: 5000000,  paid_amount: 0,        unpaid_amount: 5000000,  create_at: '2025-09-21T10:00:00+07:00' },

  // 102: Xe -> deposit (1)
  { id: 9005, customer_id: 9, seller_id: 1, customer_contact_id: 101, seller_contact_id: 202, order_type: 1, shipping_price: 0,       total_amount: 36500000, paid_amount: 1000000,  unpaid_amount: 35500000, create_at: '2025-09-26T18:50:00+07:00' },
  { id: 9006, customer_id: 9, seller_id: 1, customer_contact_id: 101, seller_contact_id: 202,
  order_type: 0, shipping_price: 70000, total_amount: 2500000, paid_amount: 2500000, unpaid_amount: 0,
  create_at: '2025-09-27T08:30:00+07:00' }, // PIN - ship

{ id: 9007, customer_id: 9, seller_id: 1, customer_contact_id: 101, seller_contact_id: 202,
  order_type: 1, shipping_price: 0, total_amount: 36500000, paid_amount: 1000000, unpaid_amount: 35500000,
  create_at: '2025-09-27T09:00:00+07:00' }, // XE - đặt cọc & hẹn gặp

]

export const order_detail = [
  // Xe -> deposit + có lịch hẹn
  { id: 1, order_id: 9001, post_id: 101, price: 14500000, deposit_amount: 2000000, commission_amount: 0, appointment_time: '2025-09-27T10:00:00+07:00', contract_file: null,                                  create_at: '2025-09-26T11:10:10+07:00', update_at: '2025-09-26T11:10:10+07:00' },

  // Pin -> ship, không cần lịch hẹn / đặt cọc
  { id: 2, order_id: 9002, post_id: 201, price: 2500000,  deposit_amount: 0,       commission_amount: 0, appointment_time: null,                              contract_file: null,                                  create_at: '2025-09-26T12:00:10+07:00', update_at: '2025-09-26T12:00:10+07:00' },

  // Xe -> deposit + lịch hẹn (đã hoàn tất, có hợp đồng)
  { id: 3, order_id: 9003, post_id: 301, price: 16500000, deposit_amount: 1000000, commission_amount: 0, appointment_time: '2025-09-21T14:00:00+07:00',     contract_file: 'https://example.com/contracts/9003.pdf', create_at: '2025-09-20T09:00:10+07:00', update_at: '2025-09-22T15:30:00+07:00' },

  // Xe -> deposit + lịch hẹn (đã huỷ)
  { id: 4, order_id: 9004, post_id: 501, price: 5000000,  deposit_amount: 0,       commission_amount: 0, appointment_time: '2025-09-22T09:00:00+07:00',     contract_file: null,                                  create_at: '2025-09-21T10:00:10+07:00', update_at: '2025-09-21T10:30:00+07:00' },

  // Xe -> deposit + lịch hẹn
  { id: 5, order_id: 9005, post_id: 102, price: 36500000, deposit_amount: 1000000, commission_amount: 0, appointment_time: '2025-09-27T16:00:00+07:00',     contract_file: null,                                  create_at: '2025-09-26T18:50:10+07:00', update_at: '2025-09-26T18:50:10+07:00' },
  { id: 6, order_id: 9006, post_id: 201, price: 2500000, deposit_amount: 0, commission_amount: 0,
  appointment_time: null, contract_file: null,
  create_at: '2025-09-27T08:30:10+07:00', update_at: '2025-09-27T08:30:10+07:00' }, // PIN

{ id: 7, order_id: 9007, post_id: 102, price: 36500000, deposit_amount: 1000000, commission_amount: 0,
  appointment_time: '2025-09-28T16:00:00+07:00', contract_file: null,
  create_at: '2025-09-27T09:00:10+07:00', update_at: '2025-09-27T09:15:00+07:00' }, // XE

]

export const order_status = [
  { id: 1, order_id: 9001, status: 'pending',    description: 'Chờ xác nhận lịch hẹn',  create_at: '2025-09-26T11:10:00+07:00' },
  { id: 2, order_id: 9001, status: 'processing', description: 'Người bán đang xử lý',   create_at: '2025-09-26T12:05:00+07:00' },

  { id: 3, order_id: 9002, status: 'pending',    description: 'Chờ giao hàng',         create_at: '2025-09-26T12:00:00+07:00' },

  { id: 4, order_id: 9003, status: 'processing', description: 'Đang chuẩn bị gặp trực tiếp', create_at: '2025-09-21T09:00:00+07:00' },
  { id: 5, order_id: 9003, status: 'in_transit', description: 'Đã gặp và đang làm thủ tục', create_at: '2025-09-21T12:30:00+07:00' },
  { id: 6, order_id: 9003, status: 'success',    description: 'Hoàn tất giao dịch',     create_at: '2025-09-22T15:30:00+07:00' },

  { id: 7, order_id: 9004, status: 'pending',    description: 'Chờ xác nhận',           create_at: '2025-09-21T10:00:00+07:00' },
  { id: 8, order_id: 9004, status: 'canceled',   description: 'Người mua huỷ đơn',      create_at: '2025-09-21T10:30:00+07:00' },

  { id: 9,  order_id: 9005, status: 'pending',    description: 'Chờ xác nhận lịch hẹn', create_at: '2025-09-26T18:50:00+07:00' },
  { id: 10, order_id: 9005, status: 'processing', description: 'Đang sắp xếp lịch hẹn', create_at: '2025-09-26T19:10:00+07:00' },
  // PIN: đang vận chuyển
{ id: 11, order_id: 9006, status: 'pending',    description: 'Đã đóng gói, chờ giao',          create_at: '2025-09-27T08:35:00+07:00' },
{ id: 12, order_id: 9006, status: 'in_transit', description: 'Đang vận chuyển đến bạn',         create_at: '2025-09-27T09:10:00+07:00' },

// XE: đang di chuyển tới điểm hẹn
{ id: 13, order_id: 9007, status: 'pending',    description: 'Chờ xác nhận lịch hẹn',           create_at: '2025-09-27T09:00:00+07:00' },
{ id: 14, order_id: 9007, status: 'processing', description: 'Đang sắp xếp lịch hẹn',           create_at: '2025-09-27T09:05:00+07:00' },
{ id: 15, order_id: 9007, status: 'in_transit', description: 'Đang di chuyển tới điểm hẹn',      create_at: '2025-09-27T15:00:00+07:00' },

]

// ===== Helpers =====
const latest = (rows) => rows.slice().sort((a,b)=>new Date(a.create_at)-new Date(b.create_at)).at(-1)
const catName = (id) => category.find(c=>c.id===id)?.name || ''
const postById = (id) => posts.find(p => p.id === id)
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

// Force order type theo category: Pin -> ship(0), Xe -> deposit(1)
const effectiveTypeForPost = (p) => {
  if (!p) return 0
  const cat = category.find(c => c.id === p.category_id)?.name
  return cat === 'Pin điện' ? 0 : 1
}

// ===== DTO cho UI (có enforce rule) =====
export const mockPurchases = orders.map(o => {
  const d  = order_detail.find(x => x.order_id === o.id)
  const p  = d ? postById(d.post_id) : null
  const st = latest(order_status.filter(x => x.order_id === o.id))

  const effective_type = effectiveTypeForPost(p)
  const order_type_vi  = orderTypeVI(effective_type)

  // Với deposit (xe) thì ship = 0; với ship (pin) thì giữ nguyên ship price
  const shipping_price_effective = effective_type === 0 ? o.shipping_price : 0

  return {
    ...o,
    order_type: effective_type,                 // <— enforce
    order_type_vi: order_type_vi,               // 'Mua (có ship)' | 'Đặt cọc...'
    shipping_price: shipping_price_effective,   // <— chuẩn hoá

    post_id: d?.post_id,
    title: p?.title || `Bài đăng #${d?.post_id ?? 'N/A'}`,
    category_name: p ? catName(p.category_id) : '',
    thumbnail_url: d ? thumbOf(d.post_id) : '',

    line_price: d?.price,
    deposit_amount: d?.deposit_amount,
    commission_amount: d?.commission_amount,
    appointment_time: d?.appointment_time,
    contract_file: d?.contract_file,

    status: st?.status,
    status_vi: statusVI(st?.status),
    status_note: st?.description,
  }
}).sort((a,b)=>new Date(b.create_at)-new Date(a.create_at))
