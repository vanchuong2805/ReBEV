import React from "react";
import { X } from "lucide-react";

export default function DepositDetailModal({
  deposit, // object selectedDeposit
  onClose, // () => void
  onChangeStatus, // (id, status) => void
}) {
  if (!deposit) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Chi tiết đơn đặt cọc</h3>
          <button
            aria-label="Đóng"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mã đơn hàng
              </label>
              <p className="text-sm text-gray-900">{deposit.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Đơn đặt cọc
              </label>
              <a
                href={deposit.depositPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Xem PDF
              </a>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ngày giao dịch
              </label>
              <p className="text-sm text-gray-900">{deposit.depositDate}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ngày hẹn
              </label>
              <p className="text-sm text-gray-900">{deposit.appointmentDate}</p>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => onChangeStatus?.(deposit.id, "buyer_cancelled")}
              className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
            >
              Bên mua hủy
            </button>
            <button
              onClick={() => onChangeStatus?.(deposit.id, "seller_cancelled")}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Bên bán hủy
            </button>
            <button
              onClick={() => onChangeStatus?.(deposit.id, "completed")}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Giao dịch thành công
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
