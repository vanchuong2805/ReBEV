import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Loader2 } from "lucide-react"
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
  createContact,
  updateContact,
} from "@/features/profile/service"
import { useUser } from "@/contexts/UserContext"

export default function AddAddressModal({ open, onClose, contact }) {
  const { user } = useUser()
  const [form, setForm] = useState({
    name: "",
    phone: "",
    detail: "",
    province_id: "",
    district_id: "",
    ward_name: "",
  })
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [loading, setLoading] = useState({ provinces: false, districts: false, wards: false })
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadProvinces = async () => {
      setLoading(p => ({ ...p, provinces: true }))
      try {
        const data = await fetchProvinces()
        setProvinces(data || [])
      } catch (err) {
        console.error(" Lỗi tải tỉnh:", err)
        setError("Không tải được danh sách tỉnh.")
      } finally {
        setLoading(p => ({ ...p, provinces: false }))
      }
    }
    loadProvinces()
  }, [])


  const handleProvinceSelect = async (provinceId) => {
    setForm(prev => ({
      ...prev,
      province_id: provinceId,
      district_id: "",
      ward_name: "",
    }))
    setDistricts([])
    setWards([])

    if (!provinceId) return
    setLoading(p => ({ ...p, districts: true }))
    try {
      const data = await fetchDistricts(provinceId)
      setDistricts(data || [])
    } catch (err) {
      console.error(" Lỗi tải quận:", err)
      setError("Không tải được danh sách quận/huyện.")
    } finally {
      setLoading(p => ({ ...p, districts: false }))
    }
  }

  const handleDistrictSelect = async (districtId) => {
    setForm(prev => ({
      ...prev,
      district_id: districtId,
      ward_name: "",
    }))
    setWards([])

    if (!districtId) return
    setLoading(p => ({ ...p, wards: true }))
    try {
      const data = await fetchWards(districtId)
      setWards(data || [])
    } catch (err) {
      console.error(" Lỗi tải phường:", err)
      setError("Không tải được danh sách phường/xã.")
    } finally {
      setLoading(p => ({ ...p, wards: false }))
    }
  }


  useEffect(() => {
    const loadForEdit = async () => {
      if (contact) {
        setForm({
          name: contact.name || "",
          phone: contact.phone || "",
          detail: contact.detail || "",
          province_id: contact.province_id || "",
          district_id: contact.district_id || "",
          ward_name: contact.ward_name || "",
        })

        if (contact.province_id) await handleProvinceSelect(contact.province_id)
        if (contact.district_id) await handleDistrictSelect(contact.district_id)

        setForm(prev => ({
          ...prev,
          ward_name: contact.ward_name || "",
        }))
      } else if (open) {
        setForm({
          name: "",
          phone: "",
          detail: "",
          province_id: "",
          district_id: "",
          ward_name: "",
        })
        setDistricts([])
        setWards([])
      }
    }

    if (open) loadForEdit()
  }, [contact, open])

  useEffect(() => {
    if (!open) {
      setIsSubmitting(false)
    }
  }, [open])

  const handleSubmit = async () => {
    if (isSubmitting) return

    const phoneRegex = /^(0|\+84)(\d{9})$/

    if (!form.name.trim()) return alert("Vui lòng nhập họ và tên.")
    if (!form.phone.trim()) return alert("Vui lòng nhập số điện thoại.")
    if (!phoneRegex.test(form.phone.trim())) return alert("Số điện thoại không hợp lệ.")
    if (!form.detail.trim()) return alert("Vui lòng nhập địa chỉ chi tiết.")
    if (!form.province_id) return alert("Vui lòng chọn Tỉnh/Thành phố.")
    if (!form.district_id) return alert("Vui lòng chọn Quận/Huyện.")
    if (!form.ward_name) return alert("Vui lòng chọn Phường/Xã.")

    setIsSubmitting(true)

    const province = provinces.find(p => p.ProvinceID == form.province_id)
    const district = districts.find(d => d.DistrictID == form.district_id)
    const ward = wards.find(w => w.WardName == form.ward_name)

    const payload = {
      user_id: user?.id,
      name: form.name.trim(),
      phone: form.phone.trim(),
      detail: form.detail.trim(),
      province_id: province?.ProvinceID || "",
      province_name: province?.ProvinceName || "",
      district_id: district?.DistrictID || "",
      district_name: district?.DistrictName || "",
      ward_code: ward?.WardCode || "",
      ward_name: ward?.WardName || "",
    }

    try {
      if (contact) {
        await updateContact(contact.id, payload)
        alert("Đã cập nhật địa chỉ thành công")
      } else {
        await createContact(payload)
        alert("Đã thêm địa chỉ mới thành công")
      }
      onClose()
    } catch (err) {
      console.error("Lỗi khi lưu contact:", err)
      alert("Lưu địa chỉ thất bại, vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" aria-describedby="add-address-desc">
        <DialogHeader>
          <DialogTitle>{contact ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-600 p-2 text-sm rounded-md mb-3">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <Input placeholder="Họ và tên" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Số điện thoại" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <Input placeholder="Số nhà, tên đường..." value={form.detail} onChange={e => setForm({ ...form, detail: e.target.value })} />

          {/* Province */}
          <div className="space-y-1">
            <Label>Tỉnh / Thành phố</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {form.province_id
                    ? provinces.find(p => p.ProvinceID == form.province_id)?.ProvinceName
                    : loading.provinces
                    ? "Đang tải..."
                    : "Chọn tỉnh / thành phố"}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-64 overflow-y-auto">
                {provinces.map(p => (
                  <DropdownMenuItem key={p.ProvinceID} onClick={() => handleProvinceSelect(p.ProvinceID)}>
                    {p.ProvinceName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* District */}
          <div className="space-y-1">
            <Label>Quận / Huyện</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between" disabled={!form.province_id || loading.districts}>
                  {form.district_id
                    ? districts.find(d => d.DistrictID == form.district_id)?.DistrictName
                    : !form.province_id
                    ? "Chọn tỉnh trước"
                    : loading.districts
                    ? "Đang tải..."
                    : "Chọn quận / huyện"}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-64 overflow-y-auto">
                {districts.map(d => (
                  <DropdownMenuItem key={d.DistrictID} onClick={() => handleDistrictSelect(d.DistrictID)}>
                    {d.DistrictName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Ward */}
          <div className="space-y-1">
            <Label>Phường / Xã</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between" disabled={!form.district_id || loading.wards}>
                  {form.ward_name
                    ? wards.find(w => w.WardName == form.ward_name)?.WardName
                    : !form.district_id
                    ? "Chọn quận trước"
                    : loading.wards
                    ? "Đang tải..."
                    : "Chọn phường / xã"}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-64 overflow-y-auto">
                {wards.map(w => (
                  <DropdownMenuItem key={w.WardCode} onClick={() => setForm({ ...form, ward_name: w.WardName })}>
                    {w.WardName}
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
          <Button
            disabled={isSubmitting}
            className={`bg-[#007BFF] hover:bg-[#68b1ff] hover:text-white transition-all shadow-sm flex items-center gap-2 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            onClick={handleSubmit}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
