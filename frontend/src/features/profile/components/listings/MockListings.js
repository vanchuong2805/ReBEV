// components/listings/MockListings.js
// ====== RAW TABLES (đúng schema) ======

// post
export const posts = [
  { id: 101, user_id: 1, category_id: 1, title: 'VinFast Klara S 2021 - pin 85%', description: 'Xe giữ gìn, chính chủ, bao test', price: 14500000, base_id: 10, is_hidden: 0, create_at: '2025-09-20T09:15:00+07:00' },
  { id: 102, user_id: 1, category_id: 1, title: 'DatBike Weaver++ 2023', description: 'Chạy 6.5k km, bảo dưỡng đầy đủ', price: 36500000, base_id: 11, is_hidden: 0, create_at: '2025-09-25T18:40:00+07:00' },
  { id: 103, user_id: 1, category_id: 1, title: 'VinFast Feliz 2022 – mới thay pin', description: 'Xe ít đi, bảo hành chính hãng', price: 21500000, base_id: 10, is_hidden: 0, create_at: '2025-09-28T09:50:00+07:00' },
  { id: 104, user_id: 1, category_id: 1, title: 'Gogo E-Scooter Classic', description: 'Xe nữ đi, pin 95%, nhẹ và êm', price: 17800000, base_id: 11, is_hidden: 0, create_at: '2025-09-27T14:30:00+07:00' },
  { id: 105, user_id: 1, category_id: 1, title: 'YADEA Xmen Neo 2022', description: 'Mới bảo dưỡng, pin tốt, xe đẹp', price: 13500000, base_id: 11, is_hidden: 0, create_at: '2025-09-21T17:10:00+07:00' },
  { id: 201, user_id: 1, category_id: 2, title: 'Pin LFP 60V 20Ah (like-new)', description: 'Dùng ít, pin khoẻ', price: 2500000, base_id: 10, is_hidden: 0, create_at: '2025-09-26T10:02:00+07:00' },
  { id: 202, user_id: 1, category_id: 2, title: 'Pin CATL 72V 25Ah', description: 'Chuẩn zin, test thực tế trước khi bán', price: 3200000, base_id: 12, is_hidden: 0, create_at: '2025-09-29T11:15:00+07:00' },
  { id: 203, user_id: 1, category_id: 2, title: 'Pin LFP 48V 15Ah (còn 90%)', description: 'Tặng sạc nhanh', price: 1800000, base_id: 12, is_hidden: 0, create_at: '2025-09-22T09:10:00+07:00' },
  { id: 301, user_id: 1, category_id: 1, title: 'YADEA G5 – pin 88%', description: 'Đã bảo dưỡng định kỳ', price: 16500000, base_id: 10, is_hidden: 0, create_at: '2025-09-18T16:00:00+07:00' },
  { id: 302, user_id: 1, category_id: 1, title: 'Pega Aura – 9.2k km', description: 'Ẩn để cập nhật hình ảnh', price: 9200000, base_id: 12, is_hidden: 1, create_at: '2025-09-23T08:10:00+07:00' },
  { id: 303, user_id: 1, category_id: 1, title: 'Xmen GT cũ – pin yếu', description: 'Xe cần thay pin, máy êm', price: 4800000, base_id: 12, is_hidden: 0, create_at: '2025-09-24T08:10:00+07:00' },
  { id: 304, user_id: 1, category_id: 1, title: 'VinFast Vento – mới 3 tháng', description: 'Mới 90%, cần bán gấp', price: 28900000, base_id: 11, is_hidden: 0, create_at: '2025-09-30T09:00:00+07:00' },
  { id: 401, user_id: 1, category_id: 1, title: 'Xe điện cũ không rõ nguồn gốc', description: 'Thiếu giấy tờ', price: 5000000, base_id: 12, is_hidden: 0, create_at: '2025-09-20T10:00:00+07:00' },
  // ✅ thêm tin huỷ
  { id: 501, user_id: 7, category_id: 2, title: 'Pin Lithium 48V 30Ah - huỷ đăng', description: 'Người bán đã huỷ tin này', price: 2900000, base_id: 13, is_hidden: 0, create_at: '2025-09-27T14:30:00+07:00' }
]

// post_media
export const post_media = posts.map((p, i) => ({
  id: i + 1,
  post_id: p.id,
  url: `https://picsum.photos/seed/post${p.id}/640/400`,
  is_thumbnail: 1
}))

// post_status
export const post_status = [
  { post_id: 101, status: 'approved', description: 'Đang bán', create_at: '2025-09-20T10:00:00+07:00' },
  { post_id: 102, status: 'pending', description: 'Chờ duyệt', create_at: '2025-09-25T18:40:00+07:00' },
  { post_id: 103, status: 'approved', description: 'Đang bán', create_at: '2025-09-28T10:00:00+07:00' },
  { post_id: 104, status: 'pending', description: 'Chờ duyệt', create_at: '2025-09-27T15:00:00+07:00' },
  { post_id: 105, status: 'rejected', description: 'Ảnh không rõ, thiếu thông tin', create_at: '2025-09-21T18:00:00+07:00' },
  { post_id: 201, status: 'pending', description: 'Chờ duyệt', create_at: '2025-09-26T10:05:00+07:00' },
  { post_id: 202, status: 'approved', description: 'Đã duyệt', create_at: '2025-09-29T12:00:00+07:00' },
  { post_id: 203, status: 'sold', description: 'Đã bán', create_at: '2025-09-23T11:00:00+07:00' },
  { post_id: 301, status: 'sold', description: 'Đã bán', create_at: '2025-09-19T12:00:00+07:00' },
  { post_id: 302, status: 'approved', description: 'Đã duyệt (nhưng ẩn)', create_at: '2025-09-23T08:20:00+07:00' },
  { post_id: 303, status: 'rejected', description: 'Tin bị từ chối', create_at: '2025-09-24T09:00:00+07:00' },
  { post_id: 304, status: 'approved', description: 'Đang bán', create_at: '2025-09-30T09:10:00+07:00' },
  { post_id: 401, status: 'pending', description: 'Chờ duyệt', create_at: '2025-09-20T10:05:00+07:00' },
  // ✅ thêm tình trạng huỷ
  { post_id: 501, status: 'cancelled', description: 'Người bán huỷ tin trước khi duyệt', create_at: '2025-09-27T15:00:00+07:00' }
]

// category
export const category = [
  { id: 1, name: 'Xe máy điện', parent_category_id: null, is_deposit: 0, deposit_rate: 0, commission_rate: 2.5 },
  { id: 2, name: 'Pin điện', parent_category_id: null, is_deposit: 0, deposit_rate: 0, commission_rate: 1.5 }
]

// variation (thuộc tính theo danh mục)
export const variation = [
  { id: 1, category_id: 1, name: 'Số km đã chạy', is_number: 1, is_require: 0 },
  { id: 2, category_id: 1, name: 'Sức khỏe pin (%)', is_number: 1, is_require: 0 },
  { id: 3, category_id: 1, name: 'Biển số', is_number: 0, is_require: 0 },
  { id: 4, category_id: 2, name: 'Điện áp (V)', is_number: 1, is_require: 0 },
  { id: 5, category_id: 2, name: 'Dung lượng (Ah)', is_number: 1, is_require: 0 }
]

// post_detail (rút gọn)
export const post_detail = [
  { post_id: 101, variation_id: 1, custom_value: '7200' },
  { post_id: 101, variation_id: 2, custom_value: '85' },
  { post_id: 103, variation_id: 1, custom_value: '3000' },
  { post_id: 103, variation_id: 2, custom_value: '96' },
  { post_id: 201, variation_id: 4, custom_value: '60' },
  { post_id: 201, variation_id: 5, custom_value: '20' },
  { post_id: 501, variation_id: 4, custom_value: '48' },
  { post_id: 501, variation_id: 5, custom_value: '30' }
]

// ====== HELPERS ======
const latestStatusOf = (postId) => {
  const rows = post_status.filter(s => s.post_id === postId)
  if (!rows.length) return null
  rows.sort((a, b) => new Date(b.create_at) - new Date(a.create_at))
  return rows[0]
}

const mapStatusToVI = (status, isHidden) => {
  if (isHidden) return 'Tin ẩn'
  switch (status) {
    case 'pending': return 'Chờ duyệt'
    case 'approved': return 'Đang bán'
    case 'rejected': return 'Bị từ chối'
    case 'sold': return 'Đã bán'
    case 'cancelled': return 'Tin huỷ' // ✅ thêm trạng thái mới
    default: return 'Khác'
  }
}

const thumbnailOf = (postId) => {
  const imgs = post_media.filter(m => m.post_id === postId)
  const th = imgs.find(i => i.is_thumbnail) || imgs[0]
  return th?.url || ''
}

const categoryNameOf = (category_id) =>
  category.find(c => c.id === category_id)?.name || ''

const detailOf = (postId) => {
  const rows = post_detail.filter(d => d.post_id === postId)
  const pick = (varName) => {
    const v = variation.find(vr => vr.name === varName)
    if (!v) return undefined
    const d = rows.find(r => r.variation_id === v.id)
    return d?.custom_value
  }
  return {
    mileage_km: Number(pick('Số km đã chạy') || 0) || undefined,
    battery_health_pct: Number(pick('Sức khỏe pin (%)') || 0) || undefined,
    plate_number: pick('Biển số'),
    voltage_v: Number(pick('Điện áp (V)') || 0) || undefined,
    capacity_ah: Number(pick('Dung lượng (Ah)') || 0) || undefined
  }
}

// ====== DTO CHO UI ======
export const mockListings = posts.map(p => {
  const latest = latestStatusOf(p.id)
  const viStatus = mapStatusToVI(latest?.status, !!p.is_hidden)
  const attrs = detailOf(p.id)
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    category_id: p.category_id,
    category_name: categoryNameOf(p.category_id),
    base_id: p.base_id,
    is_hidden: !!p.is_hidden,
    created_at: p.create_at,
    thumbnail_url: thumbnailOf(p.id),
    current_status: viStatus
  }
}).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))