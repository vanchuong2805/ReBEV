import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export default function ConfirmBill({ open, data, onClose, onConfirm }) {
  if (!data) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <FileText className="w-5 h-5" /> Xác nhận yêu cầu rút tiền
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm text-gray-700 mt-2">
          <p><strong>Số tiền:</strong> ₫{Number(data.amount).toLocaleString("vi-VN")}</p>
          <p><strong>Phương thức:</strong> {data.method === "momo" ? "Ví MoMo" : "Ngân hàng"}</p>

          {data.method === "momo" ? (
            <>
              <p><strong>SĐT MoMo:</strong> {data.momoPhone || "—"}</p>
              <p><strong>Chủ tài khoản:</strong> {data.momoName || "—"}</p>
            </>
          ) : (
            <>
              <p><strong>Ngân hàng:</strong> {data.bankName || "—"}</p>
              <p><strong>Số tài khoản:</strong> {data.bankNumber || "—"}</p>
              <p><strong>Chủ tài khoản:</strong> {data.bankOwner || "—"}</p>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>Quay lại</Button>
          <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={onConfirm}>
            Xác nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
