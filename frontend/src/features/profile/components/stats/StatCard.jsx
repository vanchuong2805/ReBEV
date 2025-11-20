import { Card } from "@/components/ui/card"
import { TrendingUp, Tag, ShoppingBag, Activity } from "lucide-react"

export default function StatCard({ title, value, type }) {
  const icons = {
    posts: <Tag className="w-5 h-5 text-blue-500" />,
    selling: <ShoppingBag className="w-5 h-5 text-emerald-500" />,
    sold: <TrendingUp className="w-5 h-5 text-violet-500" />,
    trading: <Activity className="w-5 h-5 text-orange-500" />,
  }

  return (
    <Card className="p-4 border border-gray-200 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {icons[type]}
      </div>

      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </Card>
  )
}
