import { useUser } from "@/contexts/UserContext";
import { basesService } from "@/features/posts/service";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { getContactByUserId, deleteContact } from "@/features/profile/service";
import { getPostById } from "@/features/marketplace/service";
import { createOrder } from "../service";
import AddAddressModal from "@/features/profile/components/settings/AddAddressModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
function DepositPage() {
  const location = useLocation();
  const [base, setBase] = useState(null);
  const { user } = useUser();
  const { orderData } = location.state || {};
  const [customerContacts, setCustomerContacts] = useState([]);
  const [listing, setListing] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState(null);
  const [addressOpen, setAddressOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [contactsLoading, setContactsLoading] = useState(false);

  const handleDeposit = async () => {
    if (!selectedContact) {
      toast.error("Vui lòng chọn địa chỉ nhận hàng");
      return;
    }
    orderData.to_contact_id = selectedContact.id;
    orderData.order_details[0].appointment_time = appointmentTime;
    const paymentInfo = {
      total_amount: orderData.total_amount,
      redirectUrl: `${window.location.origin}`,
    };
    console.log(paymentInfo);
    const orders = [orderData];
    const { payUrl } = await createOrder({ orders, paymentInfo });
    console.log(payUrl);
    window.location.href = payUrl;
    console.log({ orders, paymentInfo });
  };

  // handlers cho modal danh sách địa chỉ
  const addNew = () => {
    setEditing(null);
    setShowAdd(true);
  };

  const editOne = (contact) => {
    setEditing(contact);
    setShowAdd(true);
  };

  const saveAddress = async (payload) => {
    try {
      setShowAdd(false);
      setEditing(null);
      if (!user?.id) return;
      setContactsLoading(true);
      const data = await getContactByUserId(user.id);
      const list = Array.isArray(data) ? data.filter((c) => !c.is_deleted) : [];
      setCustomerContacts(list);
      const maybe = list.find(
        (c) =>
          (payload?.id && c.id === payload.id) ||
          (c.phone === payload?.phone && c.detail === payload?.detail)
      );
      setSelectedContact(maybe || list[0] || null);
    } catch (e) {
      console.error("saveAddress reload failed:", e);
    } finally {
      setContactsLoading(false);
    }
  };

  const removeOne = async (id) => {
    if (!confirm("Bạn có chắc muốn xoá địa chỉ này không?")) return;
    try {
      await deleteContact(id);
      setCustomerContacts((prev) => prev.filter((c) => c.id !== id));
      if (selectedContact?.id === id) {
        setSelectedContact(customerContacts[0] || null);
      }
    } catch (e) {
      console.error("deleteContact failed:", e);
      toast.error("Xoá thất bại, vui lòng thử lại.");
    }
  };

  useEffect(() => {
    if (!orderData || !user) return;
    const fetchBase = async () => {
      try {
        const bases = await basesService.getAllBases();
        const baseAddress = bases.find(
          (b) => b.id === orderData.from_contact_id
        );
        const customerContacts = await getContactByUserId(user.id);
        const post = await getPostById(orderData.order_details[0].post_id);
        const list = Array.isArray(customerContacts)
          ? customerContacts.filter((c) => !c.is_deleted)
          : [];
        setListing(post);
        setBase(baseAddress);
        setCustomerContacts(list);
        setSelectedContact(list.find((c) => c.is_default) || list[0] || null);
        setAppointmentTime(new Date().toISOString().slice(0, 10));
      } catch (error) {
        console.error("Error fetching base:", error);
      }
    };
    fetchBase();
  }, [orderData, user]);

  if (!orderData || !listing) {
    return <div>Không có dữ liệu đơn hàng để đặt cọc.</div>;
  }
  if (!user) {
    return <div>Vui lòng đăng nhập để tiếp tục đặt cọc.</div>;
  }

  if (!base || !customerContacts) {
    return <div>Đang tải thông tin địa chỉ...</div>;
  }
  const media = JSON.parse(listing.media);
  const imageUrl =
    media.find((img) => img.is_thumbnail)?.url.split(" ")[1] ||
    media[0]?.url.split(" ")[1] ||
    "";
  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Xác nhận đặt cọc
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Thông tin sản phẩm */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">
              Thông tin đơn hàng
            </h2>
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg">
                <img
                  src={imageUrl}
                  alt={listing.title}
                  className="object-contain w-full transition-transform duration-300 h-80 hover:scale-105"
                />
              </div>
              <div className="pt-4 space-y-3">
                <div className="flex items-start">
                  <span className="text-gray-600  font-medium min-w-[120px]">
                    Tên sản phẩm:
                  </span>
                  <span className="pl-8 text-xl font-bold text-gray-900">
                    {listing.title}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-600  font-medium min-w-[120px]">
                    Giá sản phẩm:
                  </span>
                  <span className="pl-8 text-xl font-bold text-red-600">
                    {listing.price.toLocaleString()} VND
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-600  font-medium min-w-[120px]">
                    Số tiền đặt cọc:
                  </span>
                  <span className="pl-8 text-xl font-bold text-red-600">
                    {orderData.total_amount.toLocaleString()} VND
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-600  font-medium min-w-[120px]">
                    Tổng thanh toán:
                  </span>
                  <span className="text-xl font-bold text-red-600 pl-7">
                    {orderData.total_amount.toLocaleString()} VND
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin giao dịch */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">
              Thông tin giao dịch
            </h2>

            <div className="space-y-6">
              {/* Địa chỉ cơ sở */}
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <h3 className="mb-3 text-lg font-semibold text-gray-800">
                  Địa chỉ giao dịch
                </h3>
                <div className="space-y-2">
                  <p className="flex items-start text-gray-700">
                    <svg
                      className="w-5 h-5 mr-2 mt-0.5 text-blue-600 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{`${base.detail}, ${base.ward_name}, ${base.district_name}, ${base.province_name}`}</span>
                  </p>
                  <p className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="font-medium">{base.phone}</span>
                  </p>
                </div>
              </div>

              {/* Địa chỉ nhận hàng */}
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="mb-3 text-lg font-semibold text-gray-800">
                  Thông tin liên hệ
                </h3>
                {selectedContact ? (
                  <div className="space-y-2">
                    <div className="font-medium text-gray-900">
                      {selectedContact.name} • {selectedContact.phone}
                    </div>
                    <div className="text-sm text-gray-700">
                      {selectedContact.detail}
                      {", "}
                      {[
                        selectedContact.ward_name,
                        selectedContact.district_name,
                        selectedContact.province_name,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                    <button
                      onClick={() => setAddressOpen(true)}
                      className="mt-2 text-blue-600 hover:underline"
                    >
                      Thay đổi
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="mb-2 text-sm text-gray-500">
                      Bạn chưa chọn thông tin liên hệ. Vui lòng chọn để giao
                      hàng chính xác.
                    </p>
                    <button
                      onClick={() => setAddressOpen(true)}
                      className="text-blue-600 hover:underline"
                    >
                      Chọn địa chỉ
                    </button>
                  </div>
                )}
              </div>

              {/* Lịch hẹn */}
              <div>
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  Chọn lịch hẹn
                </label>
                <input
                  type="date"
                  name="appointment_time"
                  min={new Date().toISOString().slice(0, 10)}
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Nút đặt cọc */}
              <button
                onClick={handleDeposit}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Xác nhận đặt cọc
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal chọn địa chỉ */}
      <Dialog open={addressOpen} onOpenChange={setAddressOpen}>
        <DialogContent className="max-w-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Chọn thông tin liên hệ</DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-between mb-3">
            <Button variant="outline" onClick={addNew}>
              + Thêm thông tin liên hệ
            </Button>
          </div>

          <div className="max-h-[65vh] overflow-auto space-y-3">
            {contactsLoading ? (
              <div className="py-8 text-center text-gray-500">Đang tải…</div>
            ) : customerContacts.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                Chưa có thông tin liên hệ. Nhấn "Thêm thông tin liên hệ".
              </div>
            ) : (
              customerContacts.map((c) => {
                const active = selectedContact?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedContact(c);
                    }}
                    className={`cursor-pointer rounded-lg border p-3 transition ${
                      active ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">
                          {c.name} • {c.phone}
                        </div>
                        <div className="text-sm text-gray-600">
                          {c.detail}
                          {", "}
                          {[c.ward_name, c.district_name, c.province_name]
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            editOne(c);
                          }}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeOne(c.id);
                          }}
                        >
                          Xoá
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAddressOpen(false)}>
              Đóng
            </Button>
            <Button
              onClick={() => setAddressOpen(false)}
              disabled={!selectedContact}
            >
              Dùng địa chỉ này
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddAddressModal
        open={showAdd}
        onClose={() => {
          setShowAdd(false);
          setEditing(null);
        }}
        onSave={saveAddress}
        contact={editing}
      />
    </div>
  );
}

export default DepositPage;
