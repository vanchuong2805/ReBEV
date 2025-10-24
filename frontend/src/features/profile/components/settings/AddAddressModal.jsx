import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

// Mock dữ liệu
const mockProvinces = [
    { id: 1, name: "TP Hồ Chí Minh" },
    { id: 2, name: "Hà Nội" },
    { id: 3, name: "Đà Nẵng" },
]

const mockWards = [
    { id: 1, province_id: 1, name: "Phường 4 - Gò Vấp" },
    { id: 2, province_id: 1, name: "Phường 3 - Quận 10" },
    { id: 3, province_id: 2, name: "Phường Trúc Bạch - Ba Đình" },
    { id: 4, province_id: 3, name: "Phường Hải Châu 1" },
    { id: 5, province_id: 3, name: "Phường Hòa Cường Bắc" },
]

export default function AddAddressModal({ open, onClose, onSave, contact }) {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        detail: "",
        province_id: "",
        ward_id: "",
    })

    useEffect(() => {
        if (contact) {
            const province = mockProvinces.find(p => p.name === contact.province)
            const ward = mockWards.find(w => w.name === contact.ward)
            setForm({
                name: contact.name || "",
                phone: contact.phone || "",
                detail: contact.detail || "",
                province_id: province?.id || "",
                ward_id: ward?.id || "",
            })
        } else {
            setForm({ name: "", phone: "", detail: "", province_id: "", ward_id: "" })
        }
    }, [contact])

    const handleSubmit = () => {
        const provinceName = mockProvinces.find(p => p.id == form.province_id)?.name || ""
        const wardName = mockWards.find(w => w.id == form.ward_id)?.name || ""
        onSave({
            ...form,
            province: provinceName,
            ward: wardName,
        })
    }

    const filteredWards = mockWards.filter(w => w.province_id == form.province_id)

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{contact ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <Input
                        name="name"
                        placeholder="Họ và tên"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all duration-150"
                    />
                    <Input
                        name="phone"
                        placeholder="Số điện thoại"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all duration-150"
                    />
                    <Input
                        name="detail"
                        placeholder="Số nhà, tên đường..."
                        value={form.detail}
                        onChange={(e) => setForm({ ...form, detail: e.target.value })}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all duration-150"
                    />

                    {/* Dropdown chọn tỉnh */}
                    <div className="space-y-1">
                        <Label>Tỉnh / Thành phố</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between"
                                >
                                    {form.province_id
                                        ? mockProvinces.find(p => p.id == form.province_id)?.name
                                        : "Chọn tỉnh / thành phố"}
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                                {mockProvinces.map((p) => (
                                    <DropdownMenuItem
                                        key={p.id}
                                        onClick={() => setForm({ ...form, province_id: p.id, ward_id: "" })}
                                    >
                                        {p.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Dropdown chọn phường */}
                    <div className="space-y-1">
                        <Label>Phường / Xã</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between"
                                    disabled={!form.province_id}
                                >
                                    {form.ward_id
                                        ? filteredWards.find(w => w.id == form.ward_id)?.name
                                        : form.province_id
                                            ? "Chọn phường / xã"
                                            : "Chọn tỉnh trước"}
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                                {filteredWards.map((w) => (
                                    <DropdownMenuItem
                                        key={w.id}
                                        onClick={() => setForm({ ...form, ward_id: w.id })}
                                    >
                                        {w.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-5">
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button className='bg-[#007BFF] hover:bg-[#68b1ff] hover:text-white transition-all shadow-sm' onClick={handleSubmit}>Lưu</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
