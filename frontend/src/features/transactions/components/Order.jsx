// import React from 'react'

// export default function Order() {
//     const MOCK_API_URL =
//         "https://68f1b067b36f9750dee9f31d.mockapi.io/api/pe/carts";

//   return (
//     <div>Order</div>
//   )
// }

// src/features/checkout/pages/Order.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { createOrder } from "../service";

/**
 * KỲ VỌNG DỮ LIỆU CART ITEM TỪ MOCK_API_URL (hoặc prop):
 * {
 *   post_id: number,
 *   user_id: number,
 *   title: string,
 *   weight: number,
 *   deposit_rate: number,
 *   commission_rate: number,
 *   is_deposit: boolean,
 *   seller_id: number,
 *   seller_contact_id: number,
 *   seller_display_name: string
 * }
 *
 * Component sẽ group theo seller_id và build payload:
 * [
 *   {
 *     seller_id,
 *     seller_contact_id,
 *     seller_display_name,
 *     posts: [{ post_id, user_id, title, weight, deposit_rate, commission_rate, is_deposit }]
 *   }
 * ]
 */

export default function Order({ cartSourceUrl, initialItems }) {
  // URL mặc định (bạn có thể truyền qua props để test endpoint BE thật)
  const MOCK_API_URL =
    cartSourceUrl || "https://68f1b067b36f9750dee9f31d.mockapi.io/api/pe/carts";

  // Nơi submit payload test (nếu bạn có BE thật, truyền submitUrl vào prop)
  const [items, setItems] = useState(
    Array.isArray(initialItems) ? initialItems : []
  );
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [resp, setResp] = useState(null);

  // Tải cart từ mock (nếu không truyền initialItems)
  useEffect(() => {
    if (Array.isArray(initialItems) && initialItems.length) return;
    let canceled = false;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(MOCK_API_URL);
        if (canceled) return;
        // Giả sử mock trả về mảng item
        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (!canceled) setError(e?.message || "Load cart failed");
      } finally {
        if (!canceled) setLoading(false);
      }
    };
    run();
    return () => {
      canceled = true;
    };
  }, [MOCK_API_URL, initialItems]);

  // Build payload theo đúng format BE yêu cầu
  const payload = useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) return [];

    // group theo seller_id
    const map = new Map();
    for (const it of items) {
      const sid = it.seller_id;
      if (!map.has(sid)) {
        map.set(sid, {
          seller_id: sid,
          seller_contact_id: it.seller_contact_id ?? null,
          seller_display_name: it.seller_display_name ?? "",
          posts: [],
        });
      }
      map.get(sid).posts.push({
        post_id: it.post_id,
        user_id: it.user_id,
        title: it.title,
        weight: it.weight,
        deposit_rate: it.deposit_rate,
        commission_rate: it.commission_rate,
        is_deposit: !!it.is_deposit,
      });
    }
    return Array.from(map.values());
  }, [items]);

  const sendOrder = async () => {
    try {
      setSending(true);
      setError(null);
      setResp(null);
      // gửi đúng định dạng mảng
      const res = await createOrder(payload);
      setResp(res.data);
    } catch (e) {
      setError(e?.response?.data || e?.message || "Submit failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container max-w-5xl p-4 mx-auto">
      <h1 className="mb-2 text-2xl font-bold">Order (Build Payload BE Test)</h1>
      <p className="mb-4 text-gray-600">
        Nguồn cart:{" "}
        <code className="bg-gray-100 px-2 py-0.5 rounded">{MOCK_API_URL}</code>
      </p>

      {/* Trạng thái load */}
      {loading && (
        <div className="mb-4 text-sm text-gray-500">Đang tải giỏ hàng…</div>
      )}
      {error && (
        <div className="mb-4 text-sm text-red-600">
          Lỗi: {typeof error === "string" ? error : JSON.stringify(error)}
        </div>
      )}

      {/* Preview item (nguồn) */}
      <div className="mb-6">
        <h2 className="mb-2 font-semibold">Cart Items (Source)</h2>
        <pre className="p-3 overflow-auto text-xs border rounded bg-gray-50">
          {JSON.stringify(items, null, 2)}
        </pre>
      </div>

      {/* Preview payload */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Payload gửi BE</h2>
          <span className="text-sm text-gray-500">
            Submit URL:{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded">
              {MOCK_API_URL}
            </code>
          </span>
        </div>

        <pre className="p-3 overflow-auto text-xs border rounded bg-gray-50">
          {JSON.stringify(payload, null, 2)}
        </pre>

        <button
          onClick={sendOrder}
          disabled={sending || payload.length === 0}
          className={`mt-2 px-4 py-2 rounded text-white ${
            sending || payload.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {sending ? "Đang gửi…" : "Gửi đơn test"}
        </button>
      </div>

      {/* Kết quả response */}
      {resp && (
        <div className="mt-4">
          <h2 className="mb-2 font-semibold">Kết quả BE trả về</h2>
          <pre className="p-3 overflow-auto text-xs border border-green-200 rounded bg-green-50">
            {JSON.stringify(resp, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
