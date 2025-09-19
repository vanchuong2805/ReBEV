import React, { useState } from "react"
import {
  Search, Bell, ShoppingCart, User, Menu, X, ChevronDown,
  Battery, Car, PlugZap, ShieldCheck,
  Scale, Heart, Headset
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const CATEGORIES = [
  { icon: <Car size={18} />, label: "Xe điện đã qua sử dụng", href: "/cars" },
  { icon: <Battery size={18} />, label: "Pin EV đã qua sử dụng", href: "/batteries" },
  { icon: <PlugZap size={18} />, label: "Sạc & Phụ kiện", href: "/accessories" },
  { icon: <ShieldCheck size={18} />, label: "Kiểm định / Bảo hành", href: "/inspection" },
  { icon: <Scale size={18} />, label: "So sánh", href: "/compare" },
  { icon: <Heart size={18} />, label: "Yêu thích", href: "/favorites" },
  { icon: <Headset size={18} />, label: "Hỗ trợ / Khiếu nại", href: "/support" },
]

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#007BFF]">
      {/* Logo */}
      <div className="container pl-0 pr-4 md:pr-6 lg:pr-8 flex h-16 items-center justify-between">

        <a className="flex items-center space-x-2" href="/">
          <div className="flex items-center space-x-1">
            <span className="bg-white text-[#007BFF] px-2 py-1 rounded font-bold text-lg">
              Re
            </span>
            <span className="text-white font-bold text-lg">BEV</span>
          </div>
        </a>

        {/* Nút Danh mục */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mr-2 px-2 text-base hover:bg-white/10 focus-visible:ring-0 text-white"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="ml-2 hidden sm:inline font-medium">Danh mục</span>
          </Button>
        </div>

        {/* Search */}
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="relative w-full sm:w-[300px] md:w-[420px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm xe/pin, hãng, dung lượng, năm…"
              className="pl-8 focus-visible:ring-white bg-white"
            />
          </div>
        </div>

        {/* Actions */}
        <nav className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="relative text-white hover:text-white hover:bg-white/10">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">3</Badge>
          </Button>

          <Button variant="ghost" size="sm" className="relative text-white hover:text-white hover:bg-white/10">
            <ShoppingCart className="h-5 w-5" />
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">2</Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 h-auto px-2 py-1 text-white hover:bg-white/10">
                <div className="w-8 h-8 bg-white text-[#007BFF] rounded-full flex items-center justify-center font-semibold text-sm">
                  PT
                </div>
                <span className="font-medium hidden sm:inline">USER</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">USER</p>
                  <p className="text-xs leading-none text-muted-foreground">USER@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><User className="mr-2 h-4 w-4" />Tài khoản</DropdownMenuItem>
              <DropdownMenuItem>Tin đăng của tôi</DropdownMenuItem>
              <DropdownMenuItem>Yêu thích</DropdownMenuItem>
              <DropdownMenuItem>Cài đặt</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Đăng xuất</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="bg-white text-[#007BFF] hover:bg-gray-100 font-semibold shadow-lg">
            Đăng tin
          </Button>
        </nav>
      </div>

      {/* Sidebar Danh mục */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#343A40]">Danh mục</h2>
              <Button variant="ghost" onClick={() => setMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-3 text-[#343A40]">
              {CATEGORIES.map((c) => (
                <a key={c.label} href={c.href} className="flex items-center space-x-2 hover:text-[#007BFF] transition-colors">
                  {c.icon} <span>{c.label}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header