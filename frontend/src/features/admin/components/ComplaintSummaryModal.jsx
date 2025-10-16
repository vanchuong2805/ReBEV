import React from "react";
import { X } from "lucide-react";

export default function ComplaintSummaryModal({
  complaint,          // selectedComplaint
  onClose,            // () => void
  onViewDetail,       // () => void
}) {
  if (!complaint) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Thông tin khiếu nại</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Đóng"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên khách hàng
              </label>
              <p className="text-sm text-gray-900">{complaint.customerName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mã sản phẩm
              </label>
              <p className="text-sm text-gray-900">{complaint.productId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mã đơn hàng
              </label>
              <p className="text-sm text-gray-900">{complaint.orderId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ngày tạo
              </label>
              <p className="text-sm text-gray-900">{complaint.createdDate}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lý do
            </label>
            <p className="text-sm text-gray-900">{complaint.reason}</p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onViewDetail}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
