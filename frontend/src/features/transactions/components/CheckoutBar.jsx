// src/components/CheckoutBar.jsx
import React from "react";

function currency(v = 0) {
  return Number(v).toLocaleString("vi-VN") + "₫";
}

export default function CheckoutBar({
  subtotal = 0,
  shipping = 0,
  onPlaceOrder,
  loading = false,
  customerContact,
  groupItems,
  paymentGroup,
}) {
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto mb-6 overflow-hidden bg-white border border-gray-200 shadow-md rounded-xl">
      <div className="px-6 py-5">
        {/* hàng tổng quan (giống Shopee) */}
        <div className="flex items-center justify-center gap-2">
          {/* Trái: ghi chú điều khoản */}
          <p className="flex-shrink-0 text-[13px] text-gray-600">
            Nhấn <span className="font-medium">“Đặt hàng”</span> đồng nghĩa với
            việc bạn đồng ý tuân theo{" "}
            <a href="/terms" className="text-blue-600 hover:underline">
              Điều khoản ReBEV
            </a>
            .
          </p>

          {/* Phải: bảng tiền + nút */}
          <div className="flex items-center flex-shrink-0 gap-6 md:gap-10">
            <div className="hidden text-sm text-gray-600 md:block">
              <div className="flex items-center justify-between gap-6">
                <span>Tổng tiền hàng</span>
                <span>{currency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span>Tổng tiền phí vận chuyển</span>
                <span>{currency(shipping)}</span>
              </div>
            </div>

            <div className="flex-shrink-0 text-right">
              <div className="text-sm text-gray-600">Tổng thanh toán</div>
              <div className="text-2xl font-semibold text-red-500">
                {currency(total)}
              </div>
            </div>
            <button
              onClick={onPlaceOrder}
              disabled={
                loading ||
                !customerContact ||
                !groupItems ||
                groupItems.length === 0 ||
                Object.keys(paymentGroup).length !== groupItems.length
              }
              className="flex-shrink-0  min-w-[160px] rounded-md bg-blue-500 px-6 py-2.5 text-white shadow hover:bg-blue-600 disabled:opacity-60"
            >
              {loading ? "Đang xử lý..." : "Thanh toán"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
