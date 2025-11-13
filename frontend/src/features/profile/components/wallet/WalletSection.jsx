import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Eye, EyeOff, ArrowDownToLine } from "lucide-react"
import { useUser } from "@/contexts/UserContext"
import { getUserById, createWithdraw } from "../../service"
import WithdrawForm from "./WithdrawForm"
import ConfirmBill from "./ConfirmBill"
import { toast } from "sonner"

export default function WalletSection() {
  const { user } = useUser()
  const [balance, setBalance] = useState(0)
  const [showBalance, setShowBalance] = useState(false)
  const [showWithdrawForm, setShowWithdrawForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmData, setConfirmData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) return
      const data = await getUserById(user.id)
      setBalance(data.balance)
    }
    fetchData()
  }, [user])
  const handleWithdraw = async (amount) => {
    if (!user || !user.id) return
    const data = await createWithdraw(user.id, amount)
    setBalance(data.balance)
    toast.success("Yêu cầu rút tiền đã được gửi thành công!")
  }

  return (
    <div className="space-y-6">
      {/* WALLET CARD */}
      <Card className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 border-0 shadow-2xl overflow-hidden">
        <CardContent className="p-8 relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Chào mừng trở lại</p>
                <p className="text-white text-lg font-bold">
                  {user?.display_name || "Người dùng"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </Button>
          </div>

          {/* Balance */}
          <div className="mb-6">
            <p className="text-white/90 text-sm font-medium mb-1">Số dư khả dụng</p>
            <h2 className="text-5xl font-bold text-white">
              {showBalance ? `₫${balance.toLocaleString("vi-VN")}` : "••••••••"}
            </h2>
          </div>

          <Button
            className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold shadow-lg h-12"
            onClick={() => setShowWithdrawForm(true)}
          >
            <ArrowDownToLine className="w-4 h-4 mr-2" /> Rút tiền
          </Button>
        </CardContent>
      </Card>

      {/* FORM + CONFIRM */}
      {showWithdrawForm && (
        <WithdrawForm
          balance={balance}
          onCancel={() => setShowWithdrawForm(false)}
          onConfirm={(data) => {
            setConfirmData(data)
            setShowConfirm(true)
          }}
        />
      )}

      <ConfirmBill
        open={showConfirm}
        data={confirmData}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          if (!confirmData?.amount) return
          handleWithdraw(confirmData.amount)
          setShowConfirm(false)
          setShowWithdrawForm(false)
        }}
      />
    </div>
  )
}
