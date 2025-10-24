import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Wallet, CreditCard, ArrowDownToLine, Eye, EyeOff } from "lucide-react"

export default function WalletSection() {
  const [method, setMethod] = useState("momo")
  const [showWithdrawForm, setShowWithdrawForm] = useState(false)
  const [showBalance, setShowBalance] = useState(false)

  return (
    <div className="space-y-6">
      {/* MAIN WALLET CARD */}
      <Card className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 border-0 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24"></div>
        
        <CardContent className="p-8 relative z-10">
          {/* Header với User Info */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">Chào mừng trở lại</p>
                <p className="text-white text-lg font-bold">Nguyễn Văn Nam</p>
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

          {/* Balance Display */}
          <div className="mb-6">
            <p className="text-white/90 text-sm font-medium mb-2">Số dư khả dụng</p>
            <div className="flex items-end gap-2">
              {showBalance ? (
                <h2 className="text-5xl font-bold text-white tracking-tight">₫1.250.000</h2>
              ) : (
                <h2 className="text-5xl font-bold text-white">••••••••</h2>
              )}
            </div>
          </div>

          {/* Action Button */}
          <Button
            className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold shadow-lg h-12"
            onClick={() => setShowWithdrawForm(!showWithdrawForm)}
          >
            <ArrowDownToLine className="w-4 h-4 mr-2" />
            Rút tiền
          </Button>
        </CardContent>
      </Card>

      {/* WITHDRAW FORM */}
      {showWithdrawForm && (
        <Card className="border-2 border-blue-200 shadow-xl animate-in slide-in-from-top-4 duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ArrowDownToLine className="w-5 h-5 text-blue-600" />
              Yêu cầu rút tiền
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 space-y-5">
            {/* Số tiền rút */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số tiền muốn rút
              </label>
              <div className="relative">
                <Input 
                  className="h-12 pl-8 text-lg font-semibold border-2 focus:border-blue-500" 
                  placeholder="0"
                  type="number"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₫</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Số dư khả dụng: ₫1.250.000</p>
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
                  <SelectItem value="momo">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-pink-500 rounded-md flex items-center justify-center text-white text-xs font-bold">M</div>
                      <span>Ví MoMo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="bank">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-white" />
                      </div>
                      <span>Ngân hàng</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Form fields dựa theo phương thức */}
            {method === "momo" && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số điện thoại MoMo
                  </label>
                  <Input 
                    className="h-12 border-2 focus:border-blue-500" 
                    placeholder="Nhập số điện thoại MoMo" 
                    type="tel"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên chủ tài khoản
                  </label>
                  <Input 
                    className="h-12 border-2 focus:border-blue-500" 
                    placeholder="Nhập tên chủ tài khoản" 
                  />
                </div>
              </>
            )}

            {method === "bank" && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngân hàng
                  </label>
                  <Select>
                    <SelectTrigger className="h-12 border-2 focus:border-blue-500">
                      <SelectValue placeholder="Chọn ngân hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mb">MB Bank</SelectItem>
                      <SelectItem value="vcb">Vietcombank</SelectItem>
                      <SelectItem value="tcb">Techcombank</SelectItem>
                      <SelectItem value="acb">ACB</SelectItem>
                      <SelectItem value="agribank">Agribank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số tài khoản
                  </label>
                  <Input 
                    className="h-12 border-2 focus:border-blue-500" 
                    placeholder="Nhập số tài khoản" 
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên chủ tài khoản
                  </label>
                  <Input 
                    className="h-12 border-2 focus:border-blue-500" 
                    placeholder="Nhập tên chủ tài khoản" 
                  />
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 h-12 border-2 hover:bg-gray-50 font-semibold" 
                onClick={() => setShowWithdrawForm(false)}
              >
                Hủy bỏ
              </Button>
              <Button 
                className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg"
              >
                Xác nhận rút tiền
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}