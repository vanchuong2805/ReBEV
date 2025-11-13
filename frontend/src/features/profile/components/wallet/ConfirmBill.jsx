import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function ConfirmBill({ open, data, onClose, onConfirm }) {
  if (!data) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border border-gray-200 shadow-lg">
        {/* Header (Pastel tone) */}
        <div className="bg-gradient-to-r from-indigo-100 to-blue-100 px-6 py-6 border-b border-indigo-200/40">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800 text-center">
              Xác nhận rút tiền
            </DialogTitle>
            <p className="text-sm text-gray-500 text-center mt-1">
              Vui lòng kiểm tra thông tin trước khi gửi yêu cầu
            </p>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Amount Box */}
          <div className="bg-white rounded-xl p-5 text-center border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-1 font-medium">Số tiền rút</p>
            <p className="text-3xl font-bold text-gray-800 tracking-tight">
              ₫{Number(data.amount).toLocaleString("vi-VN")}
            </p>
          </div>

          {/* Details */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-3 shadow-sm">
            {/* Method */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phương thức</span>
              <span className="font-semibold text-gray-900">
                {data.method === "momo" ? "Ví MoMo" : "Ngân hàng"}
              </span>
            </div>

            {/* MoMo */}
            {data.method === "momo" && (
              <>
                <div className="h-px bg-gray-200 my-2" />

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số điện thoại</span>
                  <span className="font-semibold text-gray-900">{data.momoPhone}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Chủ TK</span>
                  <span className="font-semibold text-gray-900">{data.momoName}</span>
                </div>
              </>
            )}

            {/* BANK */}
            {data.method === "bank" && (
              <>
                <div className="h-px bg-gray-200 my-2" />

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ngân hàng</span>
                  <span className="font-semibold text-gray-900">{data.bankName}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số tài khoản</span>
                  <span className="font-semibold text-gray-900">{data.bankNumber}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Chủ TK</span>
                  <span className="font-semibold text-gray-900">{data.bankOwner}</span>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 h-11 rounded-xl border-gray-300 hover:bg-gray-100 font-medium"
              onClick={onClose}
            >
              Hủy
            </Button>

            <Button
              className="flex-1 h-11 rounded-xl bg-slate-700 text-white hover:bg-slate-800 font-medium"
              onClick={onConfirm}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
