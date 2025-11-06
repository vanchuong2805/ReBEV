import { ArrowLeft } from "lucide-react"

export default function OrderLayout({ title, status, onBack, children }) {
  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      {/* HEADER */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#007BFF] font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>TRỞ LẠI</span>
          </button>

          <div className="text-right">
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-sm font-semibold text-[#007BFF]">{status?.toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">{children}</div>
    </div>
  )
}
