import { Clock, Settings, Truck, CheckCircle, XCircle, RefreshCcw } from "lucide-react"

export default function OrderProgress({ progressIndex = 0, isCanceled = false, type = "normal" }) {
  // 🧩 Các bước cho đơn hàng thường
  const normalSteps = [
    { label: "Chờ xác nhận", icon: Clock },
    { label: "Đang xử lý", icon: Settings },
    { label: "Đang vận chuyển", icon: Truck },
    { label: "Hoàn tất", icon: CheckCircle },
  ]

  // 🧩 Các bước cho đơn hoàn tiền
  const returnSteps = [
    { label: "Chờ duyệt hoàn", icon: Clock },
    { label: "Đang hoàn tiền", icon: RefreshCcw },
    { label: "Hoàn tất hoàn tiền", icon: CheckCircle },
  ]

  // 🔍 Chọn bộ step theo loại đơn
  const steps = type === "return" ? returnSteps : normalSteps

  // 🚫 Nếu đơn bị hủy
  if (isCanceled)
    return (
      <div className="text-center py-10">
        <XCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
        <p className="text-xl font-semibold text-red-600">ĐƠN HÀNG ĐÃ BỊ HUỶ</p>
        <p className="text-sm text-gray-500 mt-2">
          Vui lòng liên hệ người bán nếu có thắc mắc.
        </p>
      </div>
    )

  // 🔄 Render step progress
  return (
    <>
      <div className="flex items-center justify-between relative mb-2">
        {steps.map((step, i) => {
          const Icon = step.icon
          const done = i <= progressIndex
          const isLast = i === steps.length - 1
          const bg = done
            ? i === steps.length - 1
              ? "bg-green-500"
              : "bg-[#007BFF]"
            : "bg-gray-200"
          return (
            <div
              key={i}
              className="flex flex-col items-center text-center relative z-10"
              style={{ width: `${100 / steps.length}%` }}
            >
              <div className={`flex items-center justify-center w-12 h-12 rounded-full ${bg}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p
                className={`text-sm mt-3 ${
                  done ? "text-gray-900 font-medium" : "text-gray-500"
                }`}
              >
                {step.label}
              </p>
              {!isLast && (
                <div
                  className="absolute top-6 left-1/2 h-0.5"
                  style={{
                    width: "100%",
                    backgroundColor: done ? "#007BFF" : "#E5E7EB",
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
      <p className="text-sm text-gray-500 text-center mt-6">
        Cảm ơn bạn đã mua sắm tại{" "}
        <span className="font-semibold text-[#007BFF]">ReBEV</span>!
      </p>
    </>
  )
}
