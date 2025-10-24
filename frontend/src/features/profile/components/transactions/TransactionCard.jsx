// components/transactions/TransactionCard.jsx
import { Badge } from "@/components/ui/badge"
import {
  CreditCard,
  PiggyBank,
  RefreshCcw,
  Crown,
  Wallet,
  ArrowUpCircle,
} from "lucide-react"

const formatVND = n =>
  n?.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }) || "0 ₫"

const TYPE_MAP = {
  0: { label: "Thanh toán đơn hàng", color: "bg-blue-100 text-blue-800", icon: <CreditCard className="h-5 w-5 text-blue-700" /> },
  1: { label: "Đặt cọc xe", color: "bg-orange-100 text-orange-800", icon: <PiggyBank className="h-5 w-5 text-orange-700" /> },
  2: { label: "Hoàn tiền", color: "bg-yellow-100 text-yellow-800", icon: <RefreshCcw className="h-5 w-5 text-yellow-700" /> },
  3: { label: "Mua gói thành viên", color: "bg-purple-100 text-purple-800", icon: <Crown className="h-5 w-5 text-purple-700" /> },
  4: { label: "Giải ngân", color: "bg-teal-100 text-teal-800", icon: <Wallet className="h-5 w-5 text-teal-700" /> },
  5: { label: "Rút tiền về ngân hàng", color: "bg-red-100 text-red-800", icon: <ArrowUpCircle className="h-5 w-5 text-red-700" /> },
}

export default function TransactionCard({ tx }) {
  const info = TYPE_MAP[tx.transaction_type] || TYPE_MAP[0]

  // phân biệt loại giải ngân theo đơn hàng (nếu có thông tin loại)


  const label = info.label

  return (
    <div className="border rounded-lg p-6 bg-white hover:shadow-md transition">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {info.icon}
          <h3 className="text-lg font-semibold">{label}</h3>
        </div>
        <Badge className={info.color}>
          {tx.status ? "Thành công" : "Thất bại"}
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">
            {new Date(tx.create_at).toLocaleString("vi-VN")}
          </p>
          {tx.related_order_id && (
            <p className="text-sm text-gray-500 mt-1">
              Đơn hàng liên quan: #{tx.related_order_id}
            </p>
          )}
          {tx.related_package_id && (
            <p className="text-sm text-gray-500 mt-1">
              Gói thành viên #{tx.related_package_id}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{formatVND(tx.amount)}</p>
        </div>
      </div>
    </div>
  )
}
