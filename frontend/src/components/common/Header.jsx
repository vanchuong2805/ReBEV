import React, { useState } from "react"
import {
  Search, ShoppingCart, Menu, ChevronDown,
  Battery, Car, Scale, Heart, Headset, MapPin
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Link } from "react-router"
import { gql} from "@apollo/client"
import{ useQuery, useLazyQuery } from "@apollo/client/react"

// ==================== GraphQL ====================
const GET_PROVINCES = gql`
  query {
    provinces {
      id
      name
    }
  }
`

const GET_WARDS_BY_PROVINCE = gql`
  query GetWards($provinceId: ID!) {
    province(id: $provinceId) {
      wards {
        id
        name
      }
    }
  }
`

// ==================== Danh mục ====================
const CATEGORIES = [
  { icon: <Car size={20} />, label: "Xe điện đã qua sử dụng", href: "" },
  { icon: <Battery size={20} />, label: "Pin EV đã qua sử dụng", href: "" },
]

// ==================== Component ====================
const Header = ({ user = 0 }) => {
  // Query danh sách tỉnh
  const { loading, error, data } = useQuery(GET_PROVINCES)
   if (error) return <p className="p-4 text-red-500">Lỗi: {error.message}</p>
  // Lazy query để lấy xã theo tỉnh
  const [getWards, { loading: wardLoading, error: wardError, data: wardData }] =
    useLazyQuery(GET_WARDS_BY_PROVINCE)
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedWard, setSelectedWard] = useState("")
  const provinces = data?.provinces || []
  const wards = wardData?.province?.wards || []

  const handleProvinceChange = e => {
    const provinceId = e.target.value
    setSelectedProvince(provinceId)
    setSelectedWard("")
    if (provinceId) getWards({ variables: { provinceId } })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#007BFF]">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between gap-4 py-3">

          {/* Logo + Menu */}
          <div className="flex items-center gap-2 lg:gap-4">
            <a className="flex items-center gap-1.5 group" href="/">
              <div className="bg-white px-3 py-1.5 rounded-lg shadow-md">
                <span className="text-[#007BFF] font-bold text-xl">Re</span>
              </div>
              <span className="text-white font-bold text-xl">BEV</span>
            </a>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-12 px-5 flex items-center bg-[#339CFF] text-white rounded-md hover:bg-[#68b1ff] hover:text-white transition-all shadow-sm">
                  <Menu className="h-6 w-6" />
                  <span className="ml-2 hidden lg:inline font-medium">Danh mục</span>
                  <ChevronDown className="ml-1 h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" sideOffset={12} className="w-80 shadow-xl">
                {CATEGORIES.map(c => (
                  <DropdownMenuItem key={c.label} asChild className="cursor-pointer py-3 hover:bg-blue-50">
                    <Link to={c.href} className="flex items-center gap-3">
                      <div className="bg-blue-100 text-[#007BFF] p-2 rounded-lg">{c.icon}</div>
                      <span className="font-medium text-gray-700">{c.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search + Địa chỉ */}
          <div className="flex-1 max-w-3xl mx-4">
            <div className="flex items-center w-full bg-white rounded-lg shadow-md px-2 py-1 gap-2">

              {/* Ô tìm kiếm */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Tìm xe điện, pin..."
                  className="pl-10 pr-4 border-0 focus-visible:ring-0 h-12 text-gray-700 placeholder:text-gray-400 rounded-md"
                />
              </div>

              {/* Dropdown chọn tỉnh/xã */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 px-10 flex items-center gap-2 border rounded-md shadow-sm hover:bg-gray-50"
                  >
                    <MapPin className="h-4 w-4 text-[#007BFF]" />
                    <span className="text-gray-700 font-medium">
                      {selectedProvince
                        ? provinces.find(p => p.id === selectedProvince)?.name
                        : "Chọn khu vực"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-80 p-4 space-y-4 shadow-xl rounded-lg">
                  <h3 className="text-gray-800 font-semibold text-base">Chọn khu vực</h3>

                  <div className="space-y-3">
                    {/* Chọn tỉnh */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">Chọn tỉnh thành *</label>
                      <select
                        value={selectedProvince}
                        onChange={handleProvinceChange}
                        className="w-full border border-gray-300 rounded-md h-10 px-3 text-gray-700 focus:ring-2 focus:ring-[#007BFF]"
                      >
                        <option value="">-- Chọn tỉnh --</option>
                        {provinces.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Chọn xã */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">Chọn xã/phường *</label>
                      <select
                        value={selectedWard}
                        onChange={e => setSelectedWard(e.target.value)}
                        disabled={!selectedProvince || wardLoading}
                        className="w-full border border-gray-300 rounded-md h-10 px-3 text-gray-700 focus:ring-2 focus:ring-[#007BFF]"
                      >
                        <option value="">
                          {wardLoading ? "Đang tải..." : "-- Chọn xã --"}
                        </option>
                        {wards.map(w => (
                          <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                      </select>
                      {wardError && <p className="text-red-500 text-sm mt-1">Không thể tải danh sách xã</p>}
                    </div>
                  </div>

                  <Button className="w-full bg-[#007BFF] hover:bg-[#0056b3] text-white font-semibold h-10 rounded-md">
                    Áp dụng
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Nút tìm kiếm */}
              <Button className="h-10 px-5 bg-[#007BFF] hover:bg-[#0056b3] text-white font-semibold rounded-md shadow-sm">
                Tìm kiếm
              </Button>
            </div>
          </div>

          {/* User actions */}
          {user === 1 ? (
            <nav className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hover:bg-white/20 rounded-full text-white h-10 w-10">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 h-10 px-3 hover:bg-white/20 rounded-full text-white transition-colors"
                  >
                    <div className="w-8 h-8 bg-white text-[#007BFF] rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                      PT
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 shadow-xl">
                  <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                    <Link to="">Tài khoản</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                    <Link to="">Tin đăng của tôi</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                    <Link to="">Nâng cấp tài khoản</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-red-600 cursor-pointer py-2.5">
                    <Link to="">Đăng xuất</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className="bg-white text-[#007BFF] hover:bg-gray-100 font-semibold shadow-lg">
                Đăng tin
              </Button>
            </nav>
          ) : (
            <nav className="flex items-center gap-2">
              <Button asChild variant="ghost" className="bg-[#339CFF] text-white hover:bg-[#68b1ff] hover:text-white h-10 px-4 shadow-sm">
                <Link to="">Đăng nhập</Link>
              </Button>
              <Button asChild className="bg-white text-[#007BFF] hover:bg-gray-100 font-semibold h-10 px-5 shadow-sm">
                <Link to="">Đăng ký</Link>
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
