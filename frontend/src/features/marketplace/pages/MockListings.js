// components/listings/MockListingsFull.js
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
  { id: 203, user_id: 2, category_id: 2, title: 'Pin LFP 48V 15Ah (còn 90%)', description: 'Tặng sạc nhanh', price: 1800000, base_id: 12, is_hidden: 0, create_at: '2025-09-22T09:10:00+07:00' },
  { id: 301, user_id: 1, category_id: 1, title: 'YADEA G5 – pin 88%', description: 'Đã bảo dưỡng định kỳ', price: 16500000, base_id: 10, is_hidden: 0, create_at: '2025-09-18T16:00:00+07:00' },
  { id: 302, user_id: 1, category_id: 1, title: 'Pega Aura – 9.2k km', description: 'Ẩn để cập nhật hình ảnh', price: 9200000, base_id: 12, is_hidden: 1, create_at: '2025-09-23T08:10:00+07:00' },
  { id: 303, user_id: 1, category_id: 1, title: 'Xmen GT cũ – pin yếu', description: 'Xe cần thay pin, máy êm', price: 4800000, base_id: 12, is_hidden: 0, create_at: '2025-09-24T08:10:00+07:00' },
  { id: 304, user_id: 2, category_id: 1, title: 'VinFast Vento – mới 3 tháng', description: 'Mới 90%, cần bán gấp', price: 28900000, base_id: 11, is_hidden: 0, create_at: '2025-09-30T09:00:00+07:00' },
  { id: 401, user_id: 1, category_id: 1, title: 'Xe điện cũ không rõ nguồn gốc', description: 'Thiếu giấy tờ', price: 5000000, base_id: 12, is_hidden: 0, create_at: '2025-09-20T10:00:00+07:00' },
  { id: 501, user_id: 1, category_id: 2, title: 'Pin Lithium 48V 30Ah - huỷ đăng', description: 'Người bán đã huỷ tin này', price: 2900000, base_id: 13, is_hidden: 0, create_at: '2025-09-27T14:30:00+07:00' },
];

// post_media
export const post_media = posts.flatMap((p, i) => [
  { id: i * 3 + 1, post_id: p.id, url: `https://picsum.photos/seed/${p.id}a/800/600`, is_thumbnail: 1 },
  { id: i * 3 + 2, post_id: p.id, url: `https://picsum.photos/seed/${p.id}b/800/600`, is_thumbnail: 0 },
  { id: i * 3 + 3, post_id: p.id, url: `https://picsum.photos/seed/${p.id}c/800/600`, is_thumbnail: 0 },
]);

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
  { post_id: 501, status: 'cancelled', description: 'Người bán huỷ tin trước khi duyệt', create_at: '2025-09-27T15:00:00+07:00' },
];

// category
export const category = [
  { id: 1, name: 'Xe máy điện', parent_category_id: null, is_deposit: 0, deposit_rate: 0, commission_rate: 2.5 },
  { id: 2, name: 'Pin điện', parent_category_id: null, is_deposit: 0, deposit_rate: 0, commission_rate: 1.5 },
];

// variation
export const variation = [
  { id: 1, category_id: 1, name: 'Số km đã chạy', is_number: 1 },
  { id: 2, category_id: 1, name: 'Sức khỏe pin (%)', is_number: 1 },
  { id: 3, category_id: 1, name: 'Biển số', is_number: 0 },
  { id: 4, category_id: 2, name: 'Điện áp (V)', is_number: 1 },
  { id: 5, category_id: 2, name: 'Dung lượng (Ah)', is_number: 1 },
];

// post_detail
export const post_detail = [
  // ===== Xe máy điện =====
  { post_id: 101, variation_id: 1, custom_value: '7200' },
  { post_id: 101, variation_id: 2, custom_value: '85' },
  { post_id: 101, variation_id: 3, custom_value: '59A1-123.45' },

  { post_id: 102, variation_id: 1, custom_value: '6500' },
  { post_id: 102, variation_id: 2, custom_value: '90' },
  { post_id: 102, variation_id: 3, custom_value: '51F9-876.54' },

  { post_id: 103, variation_id: 1, custom_value: '3000' },
  { post_id: 103, variation_id: 2, custom_value: '96' },
  { post_id: 103, variation_id: 3, custom_value: '60B1-999.88' },

  { post_id: 104, variation_id: 1, custom_value: '4500' },
  { post_id: 104, variation_id: 2, custom_value: '95' },
  { post_id: 104, variation_id: 3, custom_value: '59X1-567.33' },

  { post_id: 105, variation_id: 1, custom_value: '5800' },
  { post_id: 105, variation_id: 2, custom_value: '87' },
  { post_id: 105, variation_id: 3, custom_value: '59D1-445.77' },

  { post_id: 301, variation_id: 1, custom_value: '5000' },
  { post_id: 301, variation_id: 2, custom_value: '88' },
  { post_id: 301, variation_id: 3, custom_value: '59B2-234.11' },

  { post_id: 302, variation_id: 1, custom_value: '9200' },
  { post_id: 302, variation_id: 2, custom_value: '70' },
  { post_id: 302, variation_id: 3, custom_value: '59H1-334.56' },

  { post_id: 303, variation_id: 1, custom_value: '8300' },
  { post_id: 303, variation_id: 2, custom_value: '40' },
  { post_id: 303, variation_id: 3, custom_value: '59C3-111.22' },

  { post_id: 304, variation_id: 1, custom_value: '1200' },
  { post_id: 304, variation_id: 2, custom_value: '90' },
  { post_id: 304, variation_id: 3, custom_value: '59A3-666.99' },

  { post_id: 401, variation_id: 1, custom_value: '7000' },
  { post_id: 401, variation_id: 2, custom_value: '60' },
  { post_id: 401, variation_id: 3, custom_value: 'Không rõ' },

  // ===== Pin điện =====
  { post_id: 201, variation_id: 4, custom_value: '60' },
  { post_id: 201, variation_id: 5, custom_value: '20' },

  { post_id: 202, variation_id: 4, custom_value: '72' },
  { post_id: 202, variation_id: 5, custom_value: '25' },

  { post_id: 203, variation_id: 4, custom_value: '48' },
  { post_id: 203, variation_id: 5, custom_value: '15' },

  { post_id: 501, variation_id: 4, custom_value: '48' },
  { post_id: 501, variation_id: 5, custom_value: '30' },
];

// users (người bán)
export const users = [
  { id: 1, name: 'Nguyễn Văn A', phone: '0901234567', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Trần Thị B', phone: '0912345678', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'Lê Văn C', phone: '0923456789', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, name: 'Phạm Thị D', phone: '0934567890', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: 5, name: 'Ngô Văn E', phone: '0945678901', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 6, name: 'Đặng Thị F', phone: '0956789012', avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: 7, name: 'Huỳnh Quốc G', phone: '0967890123', avatar: 'https://i.pravatar.cc/150?img=7' },
];

// bases (địa chỉ)
export const bases = [
  { id: 10, name: 'Quận 1, TP.HCM' },
  { id: 11, name: 'Quận 3, TP.HCM' },
  { id: 12, name: 'Bình Thạnh, TP.HCM' },
  { id: 13, name: 'Gò Vấp, TP.HCM' },
];
