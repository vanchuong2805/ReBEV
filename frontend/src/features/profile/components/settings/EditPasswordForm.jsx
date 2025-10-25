import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { useUser } from "@/contexts/UserContext"
import { changePassword } from "@/features/profile/service"

export default function EditPasswordForm() {
    const { user, loading, updateUser } = useUser()
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  })

  const [show, setShow] = useState({
    old: false,
    new: false,
    confirm: false,
  })

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.old_password || !form.new_password || !form.confirm_password) {
      alert("Vui lòng điền đầy đủ tất cả các trường.")
      return
    }

    if (form.new_password !== form.confirm_password) {
      alert("Mật khẩu xác nhận không trùng khớp.")
      return
    }

    if (form.new_password.length < 6) {
      alert("Mật khẩu mới phải có ít nhất 6 ký tự.")
      return
    }
    setForm({
      old_password: "",
      new_password: "",
      confirm_password: "",
    })

    const res = await changePassword(user.id, form.old_password, form.new_password)

    if (res.status == "200") {
      alert("Đổi mật khẩu thành công!")
    } else {
      alert("Đổi mật khẩu thất bại. Vui lòng thử lại.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* OLD PASSWORD */}
      <div>
        <label className="block text-sm font-medium mb-1">Mật khẩu hiện tại</label>
        <div className="relative">
          <Input
            type={show.old ? "text" : "password"}
            name="old_password"
            value={form.old_password}
            onChange={handleChange}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShow({ ...show, old: !show.old })}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
          >
            {show.old ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* NEW PASSWORD */}
      <div>
        <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
        <div className="relative">
          <Input
            type={show.new ? "text" : "password"}
            name="new_password"
            value={form.new_password}
            onChange={handleChange}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShow({ ...show, new: !show.new })}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
          >
            {show.new ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* CONFIRM PASSWORD */}
      <div>
        <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
        <div className="relative">
          <Input
            type={show.confirm ? "text" : "password"}
            name="confirm_password"
            value={form.confirm_password}
            onChange={handleChange}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShow({ ...show, confirm: !show.confirm })}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
          >
            {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#007BFF] hover:bg-[#68b1ff] hover:text-white transition-all shadow-sm"
      >
        Đổi mật khẩu
      </Button>
    </form>
  )
}
