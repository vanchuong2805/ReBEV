import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { ArrowDownToLine } from "lucide-react"

export default function WithdrawForm({ balance, onCancel, onConfirm }) {
  const [method, setMethod] = useState("momo")
  const [amount, setAmount] = useState("")
  const [formData, setFormData] = useState({})

  const handleSubmit = () => {
    const numericAmount = Number(amount)

    if (!numericAmount || numericAmount <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ.")
      return
    }

    if (numericAmount < 50000) {
      alert("Số tiền rút tối thiểu là 50.000₫.")
      return
    }

    if (numericAmount > balance) {
      alert("Số tiền vượt quá số dư khả dụng.")
      return
    }

    onConfirm({ amount: numericAmount, method, ...formData })
  }

  return (
    <Card className="border-2 border-blue-200 shadow-xl animate-in slide-in-from-top-4 duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ArrowDownToLine className="w-5 h-5 text-blue-600" />
          Yêu cầu rút tiền
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Số tiền */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Số tiền muốn rút
          </label>
          <div className="relative">
            <Input
              className="h-12 pl-8 text-lg font-semibold border-2 focus:border-blue-500"
              placeholder="0"
              type="number"
              value={amount}
              onChange={(e) => {
                const value = Number(e.target.value)
                if (value <= balance) {
                  setAmount(value)
                } else {
                  alert("Không thể nhập số tiền vượt quá số dư khả dụng.")
                }
              }}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
              ₫
            </span>
          </div>

          {/* Gợi ý giới hạn */}
          <p
            className={`text-xs mt-1 ${
              amount && amount < 50000
                ? "text-red-500 font-medium"
                : "text-gray-500"
            }`}
          >
            💡 Tối thiểu: 50.000₫ — Tối đa: ₫{balance.toLocaleString("vi-VN")}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Số dư khả dụng: ₫{balance.toLocaleString("vi-VN")}
          </p>
        </div>

        {/* Phương thức */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phương thức thanh toán
          </label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="h-12 border-2 focus:border-blue-500">
              <SelectValue placeholder="Chọn phương thức" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="momo">Ví MoMo</SelectItem>
              <SelectItem value="bank">Ngân hàng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Form phụ thuộc phương thức */}
        {method === "momo" ? (
          <>
            <Input
              placeholder="Số điện thoại MoMo"
              className="h-12 border-2 focus:border-blue-500"
              onChange={(e) =>
                setFormData({ ...formData, momoPhone: e.target.value })
              }
            />
            <Input
              placeholder="Tên chủ tài khoản"
              className="h-12 border-2 focus:border-blue-500"
              onChange={(e) =>
                setFormData({ ...formData, momoName: e.target.value })
              }
            />
          </>
        ) : (
          <>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, bankName: value })
              }
            >
              <SelectTrigger className="h-12 border-2 focus:border-blue-500">
                <SelectValue placeholder="Chọn ngân hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MB Bank">MB Bank</SelectItem>
                <SelectItem value="Vietcombank">Vietcombank</SelectItem>
                <SelectItem value="Techcombank">Techcombank</SelectItem>
                <SelectItem value="ACB">ACB</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Số tài khoản"
              className="h-12 border-2 focus:border-blue-500"
              onChange={(e) =>
                setFormData({ ...formData, bankNumber: e.target.value })
              }
            />
            <Input
              placeholder="Tên chủ tài khoản"
              className="h-12 border-2 focus:border-blue-500"
              onChange={(e) =>
                setFormData({ ...formData, bankOwner: e.target.value })
              }
            />
          </>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1 h-12" onClick={onCancel}>
            Hủy bỏ
          </Button>
          <Button
            className="flex-1 h-12 bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Xác nhận rút tiền
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
