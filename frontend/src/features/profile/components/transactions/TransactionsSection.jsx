// components/transactions/TransactionSection.jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import TransactionCard from "./TransactionCard"
import { mockTransactions } from "./MockTransactions"

export default function TransactionSection() {
  const all = mockTransactions || []
  const filterByType = type => all.filter(t => t.transaction_type === type)
  const total = all.length

  const tabs = [
    { key: "all", label: "Tất cả", list: all },
    { key: "purchase", label: "Thanh toán", list: filterByType(0) },
    { key: "deposit", label: "Đặt cọc", list: filterByType(1) },
    { key: "refund", label: "Hoàn tiền", list: filterByType(2) },
    { key: "membership", label: "Thành viên", list: filterByType(3) },
    { key: "release", label: "Giải ngân", list: filterByType(4) },
    { key: "cashout", label: "Rút tiền", list: filterByType(5) },
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
                {tab.label} ({tab.list.length})
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
