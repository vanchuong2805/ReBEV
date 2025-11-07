// components/transactions/TransactionCard.jsx
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  HandCoins,
  RotateCcw,
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

// 🔹 Chỉnh icon + màu hợp lý cho từng loại giao dịch
const TYPE_MAP = {
  1: {
    label: "Mua hàng",
    color: "bg-blue-100 text-blue-800",
    icon: <ShoppingCart className="h-5 w-5 text-blue-700" />,
  },
  2: {
    label: "Đặt cọc",
    color: "bg-amber-100 text-amber-800",
    icon: <HandCoins className="h-5 w-5 text-amber-700" />,
  },
  3: {
    label: "Hoàn tiền",
    color: "bg-green-100 text-green-800",
    icon: <RotateCcw className="h-5 w-5 text-green-700" />,
  },
  4: {
    label: "Mua gói thành viên",
    color: "bg-purple-100 text-purple-800",
    icon: <Crown className="h-5 w-5 text-purple-700" />,
  },
  5: {
    label: "Giải ngân",
    color: "bg-rose-100 text-rose-800",
    icon: <ArrowUpCircle className="h-5 w-5 text-rose-700" />,
  },
  6:{
    label: "Rút tiền",
    color: "bg-gray-100 text-gray-800",
    icon: <Wallet className="h-5 w-5 text-gray-600" />,
  }
}

export default function TransactionCard({ tx }) {
  const info = TYPE_MAP[tx.transaction_type] || {
    label: "Khác",
    color: "bg-gray-100 text-gray-700",
    icon: <Wallet className="h-5 w-5 text-gray-600" />,
  }

  return (
    <div className="border rounded-lg p-6 bg-white hover:shadow-md transition">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {info.icon}
          <h3 className="text-lg font-semibold">{info.label}</h3>
        </div>
        <Badge className={info.color}>
          {tx.status==0 ? "Thành công" : "Thất bại"}
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
              Gói thành viên: #{tx.related_package_id}
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
