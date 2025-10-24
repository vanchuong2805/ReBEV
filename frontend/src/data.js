// 👉 Thay DEMO cũ bằng đoạn dưới
import {
  posts,
  post_media,
  post_status,
  post_detail,
  users,
  bases,
} from "@/features/marketplace/pages/MockListings";

// Helpers
const statusMap = Object.fromEntries(
  post_status.map((s) => [s.post_id, s.status])
);
const baseName = Object.fromEntries(bases.map((b) => [b.id, b.name]));
const userById = Object.fromEntries(users.map((u) => [u.id, u]));

// Lấy thumbnail cho mỗi post
const thumbByPost = {};
for (const m of post_media) {
  if (m.is_thumbnail) thumbByPost[m.post_id] = m.url;
}

// Gom detail theo post_id
//  - Cat 1 (Xe): variation_id=1 (km), 2 (SoH%)
//  - Cat 2 (Pin): variation_id=4 (Volt), 5 (Ah)
const detailsByPost = post_detail.reduce((acc, d) => {
  if (!acc[d.post_id]) acc[d.post_id] = {};
  acc[d.post_id][d.variation_id] = d.custom_value;
  return acc;
}, {});

// Tạo highlights ngắn gọn cho card
function buildHighlights(p) {
  const d = detailsByPost[p.id] || {};
  if (p.category_id === 1) {
    const km = d[1] ? `${Number(d[1]).toLocaleString("vi-VN")} km` : undefined;
    const soh = d[2] ? `${d[2]}% SoH` : undefined;
    return [km, soh].filter(Boolean);
  }
  if (p.category_id === 2) {
    const v = d[4] ? `${d[4]}V` : undefined;
    const ah = d[5] ? `${d[5]}Ah` : undefined;
    return [v, ah].filter(Boolean);
  }
  return [];
}

// ✅ Chỉ hiển thị "ĐÃ KIỂM ĐỊNH" theo rule mock (thay bằng field từ API sau này)
function isVerified(p) {
  const d = detailsByPost[p.id] || {};
  if (p.category_id === 1) {
    const km = Number(d[1]);
    const soh = Number(d[2]);
    // Xe: SoH ≥ 90 & ODO ≤ 5,000  hoặc  (Giá ≥ 30tr & SoH ≥ 88)
    return (
      (Number.isFinite(soh) &&
        soh >= 90 &&
        Number.isFinite(km) &&
        km <= 5000) ||
      (p.price >= 30_000_000 && Number.isFinite(soh) && soh >= 88)
    );
  }
  if (p.category_id === 2) {
    const v = Number(d[4]);
    const ah = Number(d[5]);
    // Pin: Volt ≥ 60 & Ah ≥ 20
    return Number.isFinite(v) && v >= 60 && Number.isFinite(ah) && ah >= 20;
  }
  return false;
}

export const DEMO = posts
  // 1️⃣ Bỏ tất cả bài có field is_hidden (nghĩa là loại bài có thể ẩn)
  .filter((p) => statusMap[p.id] === "approved")
  // 2️⃣ Map sang cấu trúc hiển thị
  .map((p) => ({
    id: p.id,
    category_id: p.category_id,
    title: p.title,
    price: p.price,
    image: thumbByPost[p.id],
    badge: isVerified(p) ? "ĐÃ KIỂM ĐỊNH" : null,
    status: statusMap[p.id],
    base_name: baseName[p.base_id],
    seller: userById[p.user_id],
    highlights: buildHighlights(p),
    created_at: p.create_at,
  }))
  // 3️⃣ Sắp xếp mới nhất lên trước
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
