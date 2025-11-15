// components/transactions/TransactionSection.jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import TransactionCard from "./TransactionCard"
import {getTransactionByUserId} from "@/features/profile/service"
import { useEffect,useState } from "react"
import { useUser } from '@/contexts/UserContext'

export default function TransactionSection() {
  const { user } = useUser()
  const [all, setAll] = useState([])
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) return
      const data = await getTransactionByUserId(user.id)
      setAll(data.transactions)
      console.log(" Transactions fetched in component:", data)
    }
    fetchData()
  }, [])

  const filterByType = type => all.filter(t => t.transaction_type === type)
  const total = all.length

  const tabs = [
    { key: "all", label: "Tất cả", list: all },
    { key: "buy", label: "Mua hàng", list: filterByType(1) },
    { key: "deposit", label: "Đặt cọc", list: filterByType(2) },
    { key: "package_fee", label: "Mua gói", list: filterByType(4) },
    { key: "refund", label: "Hoàn tiền", list: filterByType(3) },
    { key: "release", label: "Giải ngân", list: filterByType(5) },
    { key: "cash_out", label: "Rút tiền", list: filterByType(6) },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch sử giao dịch</CardTitle>
        <CardDescription>
          Theo dõi toàn bộ hoạt động nạp, cọc, thanh toán, hoàn tiền và giải ngân trong hệ thống
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-6">
            {tabs.map(tab => (
              <TabsTrigger key={tab.key} value={tab.key}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map(tab => (
            <TabsContent key={tab.key} value={tab.key} className="space-y-4">
              {tab.list.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  Không có giao dịch {tab.label.toLowerCase()}
                </div>
              ) : (
                tab.list.map(tx => <TransactionCard key={tx.id} tx={tx} />)
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
