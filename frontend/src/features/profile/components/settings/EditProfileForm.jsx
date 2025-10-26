import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function EditProfileForm() {
  const [form, setForm] = useState({
    display_name: "Nguyễn Thị Tú Anh",
    email: "anh@example.com",
    phone: "0901234567",
    avatar: "https://i.pravatar.cc/100?img=5",
  })

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleAvatarChange = () => {
    alert("Tính năng đổi ảnh đại diện sẽ được cập nhật sau!")
  }

  return (
    <form className="space-y-5">
      {/* Avatar hiển thị */}
      <div className="flex items-center gap-5">
        <div className="relative w-20 h-20">
          <img
            src={form.avatar}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <Button type="button" variant="outline" onClick={handleAvatarChange}>
            Đổi ảnh đại diện
          </Button>
        </div>
      </div>

      {/* Tên hiển thị */}
      <div>
        <label className="block text-sm font-medium mb-1">Tên hiển thị</label>
        <Input
          name="display_name"
          value={form.display_name}
          onChange={handleChange}
          className="rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF]"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF]"
        />
      </div>

      {/* Số điện thoại */}
      <div>
        <label className="block text-sm font-medium mb-1">Số điện thoại</label>
        <Input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF]"
        />
      </div>

      <Button type="submit" className="w-full bg-[#007BFF] hover:bg-[#68b1ff] hover:text-white transition-all shadow-sm">
        Lưu thay đổi
      </Button>
    </form>
  )
}
