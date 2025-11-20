import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Loader2 } from "lucide-react";

import { useFormik } from "formik";
import { addressSchema } from "@/services/validations";
import { toast } from "sonner";

import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
  createContact,
  updateContact,
} from "@/features/profile/service";
import { useUser } from "@/contexts/UserContext";

// ===================================================
//                  COMPONENT
// ===================================================

export default function AddAddressModal({ open, onClose, contact }) {
  const { user } = useUser();

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [loading, setLoading] = useState({
    provinces: false,
    districts: false,
    wards: false,
  });
  const [error, setError] = useState("");

  // ---------------- useFormik ----------------
  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      detail: "",
      province_id: "",
      district_id: "",
      ward_name: "",
    },
    validationSchema: addressSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const province = provinces.find(
        (p) => p.ProvinceID == values.province_id
      );
      const district = districts.find(
        (d) => d.DistrictID == values.district_id
      );
      const ward = wards.find((w) => w.WardName == values.ward_name);

      const payload = {
        user_id: user?.id,
        name: values.name.trim(),
        phone: values.phone.trim(),
        detail: values.detail.trim(),
        province_id: province?.ProvinceID,
        province_name: province?.ProvinceName,
        district_id: district?.DistrictID,
        district_name: district?.DistrictName,
        ward_code: ward?.WardCode,
        ward_name: ward?.WardName,
      };

      try {
        if (contact) {
          await updateContact(contact.id, payload);
          toast.success("Đã cập nhật địa chỉ!");
        } else {
          await createContact(payload);
          toast.success("Đã thêm địa chỉ mới!");
        }
        onClose();
      } catch (err) {
        toast.error("Lưu địa chỉ thất bại, vui lòng thử lại.");
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true, // cho phép fill khi edit
  });

  // ---------------- Load Provinces ----------------
  useEffect(() => {
    if (!open) return;

    const load = async () => {
      setLoading((p) => ({ ...p, provinces: true }));
      try {
        const list = await fetchProvinces();
        setProvinces(list || []);
      } catch {
        setError("Không tải được danh sách tỉnh.");
      } finally {
        setLoading((p) => ({ ...p, provinces: false }));
      }
    };
    load();
  }, [open]);

  // ---------------- Edit mode load data ----------------
  useEffect(() => {
    if (!open) return;

    if (contact) {
      formik.setValues({
        name: contact.name || "",
        phone: contact.phone || "",
        detail: contact.detail || "",
        province_id: contact.province_id || "",
        district_id: contact.district_id || "",
        ward_name: contact.ward_name || "",
      });

      if (contact.province_id) handleProvince(contact.province_id, false);
      if (contact.district_id) handleDistrict(contact.district_id, false);
    } else {
      formik.resetForm();
      setDistricts([]);
      setWards([]);
    }
  }, [contact, open]);

  // ===================================================
  //              HANDLE PROVINCE / DISTRICT
  // ===================================================
  const handleProvince = async (id, clear = true) => {
    formik.setFieldValue("province_id", id);

    if (clear) {
      formik.setFieldValue("district_id", "");
      formik.setFieldValue("ward_name", "");
      setDistricts([]);
      setWards([]);
    }

    setLoading((p) => ({ ...p, districts: true }));
    try {
      const data = await fetchDistricts(id);
      setDistricts(data || []);
    } finally {
      setLoading((p) => ({ ...p, districts: false }));
    }
  };

  const handleDistrict = async (id, clear = true) => {
    formik.setFieldValue("district_id", id);

    if (clear) {
      formik.setFieldValue("ward_name", "");
      setWards([]);
    }

    setLoading((p) => ({ ...p, wards: true }));
    try {
      const data = await fetchWards(id);
      setWards(data || []);
    } finally {
      setLoading((p) => ({ ...p, wards: false }));
    }
  };

  // ===================================================
  //                       UI
  // ===================================================

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {contact ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="p-2 mb-2 text-red-600 bg-red-100 border border-red-300 rounded">
            {error}
          </div>
        )}

        {/* ------------ FORM -------------- */}
        <form onSubmit={formik.handleSubmit} className="space-y-3">
          {/* Name */}
          <div>
            <Input
              name="name"
              placeholder="Họ và tên"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-sm text-red-500">{formik.errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Input
              name="phone"
              placeholder="Số điện thoại"
              value={formik.values.phone}
              onChange={formik.handleChange}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-sm text-red-500">{formik.errors.phone}</p>
            )}
          </div>

          {/* Detail */}
          <div>
            <Input
              name="detail"
              placeholder="Số nhà, tên đường..."
              value={formik.values.detail}
              onChange={formik.handleChange}
            />
            {formik.touched.detail && formik.errors.detail && (
              <p className="text-sm text-red-500">{formik.errors.detail}</p>
            )}
          </div>

          {/* ---------------- Province ---------------- */}
          <div className="space-y-1">
            <Label>Tỉnh / Thành phố</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between w-full">
                  {formik.values.province_id
                    ? provinces.find(
                        (p) => p.ProvinceID == formik.values.province_id
                      )?.ProvinceName
                    : "Chọn tỉnh / thành phố"}
                  <ChevronDown className="w-4 h-4 opacity-60" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="overflow-y-auto max-h-64">
                {provinces.map((p) => (
                  <DropdownMenuItem
                    key={p.ProvinceID}
                    onClick={() => handleProvince(p.ProvinceID)}
                  >
                    {p.ProvinceName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {formik.touched.province_id && formik.errors.province_id && (
              <p className="text-sm text-red-500">
                {formik.errors.province_id}
              </p>
            )}
          </div>

          {/* ---------------- District ---------------- */}
          <div className="space-y-1">
            <Label>Quận / Huyện</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-between w-full"
                  disabled={!formik.values.province_id}
                >
                  {formik.values.district_id
                    ? districts.find(
                        (d) => d.DistrictID == formik.values.district_id
                      )?.DistrictName
                    : !formik.values.province_id
                    ? "Chọn tỉnh trước"
                    : loading.districts
                    ? "Đang tải..."
                    : "Chọn quận / huyện"}
                  <ChevronDown className="w-4 h-4 opacity-60" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="overflow-y-auto max-h-64">
                {districts.map((d) => (
                  <DropdownMenuItem
                    key={d.DistrictID}
                    onClick={() => handleDistrict(d.DistrictID)}
                  >
                    {d.DistrictName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {formik.touched.district_id && formik.errors.district_id && (
              <p className="text-sm text-red-500">
                {formik.errors.district_id}
              </p>
            )}
          </div>

          {/* ---------------- Ward ---------------- */}
          <div className="space-y-1">
            <Label>Phường / Xã</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-between w-full"
                  disabled={!formik.values.district_id}
                >
                  {formik.values.ward_name
                    ? wards.find((w) => w.WardName === formik.values.ward_name)
                        ?.WardName
                    : !formik.values.district_id
                    ? "Chọn quận trước"
                    : loading.wards
                    ? "Đang tải..."
                    : "Chọn phường / xã"}
                  <ChevronDown className="w-4 h-4 opacity-60" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="overflow-y-auto max-h-64">
                {wards.map((w) => (
                  <DropdownMenuItem
                    key={w.WardCode}
                    onClick={() =>
                      formik.setFieldValue("ward_name", w.WardName)
                    }
                  >
                    {w.WardName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {formik.touched.ward_name && formik.errors.ward_name && (
              <p className="text-sm text-red-500">{formik.errors.ward_name}</p>
            )}
          </div>

          {/* SUBMIT */}
          <div className="flex justify-end gap-2 mt-5">
            <Button variant="outline" type="button" onClick={onClose}>
              Hủy
            </Button>

            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700"
            >
              {formik.isSubmitting && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {formik.isSubmitting ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
