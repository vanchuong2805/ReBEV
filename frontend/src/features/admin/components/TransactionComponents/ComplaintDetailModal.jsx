import React from "react";
import { X, Check } from "lucide-react";

export default function ComplaintDetailModal({
  complaint, // selectedComplaint
  onClose, // () => void
  onChangeStatus, // (id, status, description) => void
  onChangeDescription, // (newDesc) => void
}) {
  if (!complaint) return null;

  const { productInfo = {} } = complaint;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Chi tiết khiếu nại</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Đóng"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Product Info */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-2">
              Thông tin sản phẩm
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">{productInfo.name}</p>
              <p className="text-sm text-gray-600">
                Giá: {productInfo?.price?.toLocaleString?.("vi-VN") || "—"} VND
              </p>
            </div>
          </div>

          {/* Product Images */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-2">
              Hình ảnh sản phẩm
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {(productInfo.images || []).map((img, idx) => (
                <div
                  key={idx}
                  className="bg-gray-200 h-48 rounded-lg flex items-center justify-center"
                >
                  {/* Bạn có thể thay bằng <img src={img} alt={`Hình ${idx+1}`} className="object-cover h-48 w-full rounded-lg" /> */}
                  <span className="text-gray-500">Hình ảnh {idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Complaint Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tên khách hàng
                </label>
                <p className="text-sm text-gray-900">
                  {complaint.customerName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ngày tạo
                </label>
                <p className="text-sm text-gray-900">{complaint.createdDate}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lý do khiếu nại
              </label>
              <p className="text-sm text-gray-900">{complaint.reason}</p>
            </div>
          </div>

          {/* Response */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả (Phản hồi cho khách hàng)
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Nhập phản hồi cho khách hàng..."
              value={complaint.description}
              onChange={(e) => onChangeDescription?.(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() =>
                onChangeStatus?.(
                  complaint.id,
                  "approved",
                  complaint.description
                )
              }
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
              <Check size={16} className="mr-2" />
              Đồng ý
            </button>
            <button
              onClick={() =>
                onChangeStatus?.(
                  complaint.id,
                  "rejected",
                  complaint.description
                )
              }
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center"
            >
              <X size={16} className="mr-2" />
              Từ chối
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
