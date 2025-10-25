// EditPasswordForm.jsx
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function EditPasswordForm() {
    const [form, setForm] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    })

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    return (
        <form className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Mật khẩu hiện tại</label>
                <Input type="password" name="old_password" value={form.old_password} onChange={handleChange} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
                <Input type="password" name="new_password" value={form.new_password} onChange={handleChange} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
                <Input type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange} />
            </div>

            <Button type="submit" className="w-full bg-[#007BFF] hover:bg-[#68b1ff] hover:text-white transition-all shadow-sm">Đổi mật khẩu</Button>
        </form>
    )
}
