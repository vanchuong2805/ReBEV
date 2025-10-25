import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useUser } from "@/contexts/UserContext"
import { updateProfile } from "@/features/profile/service" 

export default function EditProfileForm() {
  const { user, loading, updateUser } = useUser()

  const [form, setForm] = useState({
    avatar: "/default-avatar.png",
    display_name: "",
  })

  useEffect(() => {
    if (user) {
      setForm({
        avatar: user.avatar || "/default-avatar.png",
        display_name: user.display_name || "",
      })
    }
  }, [user])

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })


  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn một file hình ảnh hợp lệ (jpg, png, jpeg...)")
      return
    }
    const imageUrl = URL.createObjectURL(file)
    setForm({ ...form, avatar: imageUrl })
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    const updatedUser = {
      ...user,
      avatar: form.avatar,
      display_name: form.display_name,
      update_at: new Date().toISOString(),
    }
    const res = await updateProfile(user.id, updatedUser)
    updateUser(updatedUser)
    alert("Cập nhật thông tin thành công!")
  }

  if (loading) {
    return (
      <Card className="mb-8">
        <CardContent className="p-8 text-gray-500">
          Đang tải thông tin...
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative w-20 h-20">
          <img
            src={form.avatar}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("avatarUpload").click()}
          >
            Đổi ảnh đại diện
          </Button>
          <input
            type="file"
            id="avatarUpload"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
      </div>
      {/* Display name */}
      <div>
        <label className="block text-sm font-medium mb-1">Tên hiển thị</label>
        <Input
          name="display_name"
          value={form.display_name}
          onChange={handleChange}
        />
      </div>
      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input
          name="email"
          type="email"
          value={form.email}
          disabled
          className="bg-white text-black cursor-not-allowed border border-gray-300"
        />
      </div>
      {/* Phone */}
      <div>
        <label className="block text-sm font-medium mb-1">Số điện thoại</label>
        <Input
          name="phone"
          value={form.phone}
          disabled
          className="bg-white text-black text-sm font-medium cursor-not-allowed border border-gray-300"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-[#007BFF] hover:bg-[#68b1ff] hover:text-white transition-all shadow-sm"
      >
        Lưu thay đổi
      </Button>
    </form>
  )
}
