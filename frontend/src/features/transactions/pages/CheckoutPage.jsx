// import { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router";
// import { useCart } from "@/contexts/CartContext";
// import { createOrder, getDeliveryFees } from "../service";
// import CheckoutBar from "../components/CheckoutBar";
// import Header from "@/components/common/Header";

// export default function Checkout() {
//   const { items, selectedTotal, clear } = useCart();
//   const [loading, setLoading] = useState(false);
//   const [shippingFee, setShippingFee] = useState(0);
//   const navigate = useNavigate();
//   const selectedItems = items.filter((it) => it.selected);

//   const placeOrder = async () => {
//     try {
//       setLoading(true);
//       const res = await createOrder();
//       clear();
//       navigate(
//         `/checkout/success?orderId=${res.orderId}&total=${selectedTotal}`,
//         {
//           replace: true,
//         }
//       );
//     } catch (error) {
//       console.error("Failed to place order:", error);
//       navigate("/checkout/fail", { replace: true });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const fetchShippingFee = async () => {
//       try {
//         const weight = selectedItems?.reduce(
//           (sum, item) => sum + (item.weight || 0),
//           0
//         );
//         const fee = await getDeliveryFees({ weight });
//         setShippingFee(fee);
//       } catch (error) {
//         console.error("Failed to fetch shipping fee:", error);
//         setShippingFee(0);
//       }
//     };
//     fetchShippingFee();
//   }, [selectedItems]);

//   return (
//     <>
//       <Header />
//       <div className="grid w-11/12 max-w-6xl gap-6 p-6 mx-auto md:w-4/5">
//         {/* Top: items */}
//         {selectedItems.length === 0 ? (
//           <div className="p-6 text-center bg-white rounded-md shadow-sm">
//             <p className="text-gray-500">
//               Giỏ hàng trống – không thể thanh toán
//             </p>
//             <Link to="/" className="inline-block mt-2 text-blue-600 underline">
//               Quay lại mua sắm
//             </Link>
//           </div>
//         ) : (
//           <>
//             {/* Top: items */}
//             <div>
//               <h1 className="text-xl font-semibold">Thanh toán</h1>
//               <div className="bg-white divide-y rounded-lg shadow-sm">
//                 {selectedItems.map((item) => (
//                   <div
//                     key={item.post_id}
//                     className="flex items-center gap-4 p-3"
//                   >
//                     {/* Khung ảnh: không phóng to/cắt, hỗ trợ dọc/ngang */}
//                     <div className="flex items-center justify-center w-16 h-16 overflow-hidden rounded bg-gray-50">
//                       <img
//                         src={item.image}
//                         alt={item.title}
//                         className="object-contain max-w-full max-h-full"
//                         loading="lazy"
//                       />
//                     </div>

//                     <div className="flex-1">
//                       <p className="font-medium line-clamp-2">{item.title}</p>
//                       <p className="text-sm text-red-500">
//                         {(item.price || 0).toLocaleString("vi-VN")}₫
//                       </p>
//                     </div>
//                     <div className="font-medium text-red-500">
//                       {(item.price || 0).toLocaleString("vi-VN")}₫
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Bottom: summary */}
//             <div className="px-4 py-3">
//               <CheckoutBar
//                 subtotal={selectedTotal}
//                 shipping={shippingFee}
//                 onPlaceOrder={placeOrder}
//                 loading={loading}
//               />
//             </div>
//           </>
//         )}
//       </div>
//     </>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useCart } from "@/contexts/CartContext";
import { createOrder, getDeliveryFees } from "../service";
import CheckoutBar from "../components/CheckoutBar";
import Header from "@/components/common/Header";

// chỉ import & xài AddAddressModal (không tạo file mới)
import AddAddressModal from "@/features/profile/components/settings/AddAddressModal";
import { getContactByUserId, deleteContact } from "@/features/profile/service";
import { getContactById } from "@/features/cart/service";

// shadcn ui
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { items, selectedTotal, clear, selectedGroups } = useCart();
  const [loading, setLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);

  const [addressOpen, setAddressOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  const [fromAddr, setFromAddr] = useState({
    from_district_id: undefined,
    from_ward_code: undefined,
  });

  const navigate = useNavigate();

  const selectedItems = useMemo(
    () => items.filter((it) => it.selected),
    [items]
  );

  // lấy user id (tuỳ app của bạn)
  const userRaw =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = userRaw ? JSON.parse(userRaw) : null;

  // Helper: gom giỏ theo seller để gửi cho BE
  const buildSellerGroups = (list) => {
    const map = new Map();
    for (const it of list) {
      if (!map.has(it.seller_id)) {
        map.set(it.seller_id, {
          seller_id: it.seller_id,
          seller_contact_id: it.seller_contact_id ?? null,
          seller_display_name: it.seller_display_name ?? "",
          posts: [],
        });
      }
      map.get(it.seller_id).posts.push({
        post_id: it.post_id,
        user_id: it.user_id,
        title: it.title,
        weight: it.weight,
        deposit_rate: it.deposit_rate,
        commission_rate: it.commission_rate,
        is_deposit: !!it.is_deposit,
      });
    }
    return Array.from(map.values());
  };

  // mở modal -> load contact từ DB
  useEffect(() => {
    if (!addressOpen || !user?.id) return;
    (async () => {
      try {
        setContactsLoading(true);
        const data = await getContactByUserId(user.id);
        const list = Array.isArray(data)
          ? data.filter((c) => !c.is_deleted)
          : [];
        setContacts(list);
        if (!selectedContact && list.length > 0) {
          setSelectedContact(list[0]);
        }
      } catch (e) {
        console.error("Load contacts failed:", e);
        setContacts([]);
      } finally {
        setContactsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressOpen, user?.id]);

  // Lấy địa chỉ người bán (from_*) từ seller_contact_id của item đầu tiên (nếu có)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      // không có item nào => reset
      if (!selectedItems.length) {
        if (!cancelled)
          setFromAddr({
            from_district_id: undefined,
            from_ward_code: undefined,
          });
        return;
      }

      try {
        const sellerContact = await getContactById(
          selectedItems[0].seller_contact_id
        );
        if (cancelled) return;
        console.log(sellerContact);
        // API của bạn trả về đúng các field dưới:
        // { district_id: 1774, ward_code: "430403", ... }
        const from_district_id = Number(sellerContact?.district_id);
        const from_ward_code = sellerContact?.ward_code
          ? String(sellerContact.ward_code)
          : undefined;

        // Log nhanh kiểm tra
        console.log("[sellerContact]", sellerContact);
        console.log("[from_*]", { from_district_id, from_ward_code });

        setFromAddr({ from_district_id, from_ward_code });
      } catch (e) {
        console.error("Load seller from-address failed:", e);
        if (!cancelled)
          setFromAddr({
            from_district_id: undefined,
            from_ward_code: undefined,
          });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedItems]);

  // tính phí ship khi danh sách sp hoặc địa chỉ thay đổi (dùng đủ from_* to_*)
  useEffect(() => {
    const fetchFee = async () => {
      try {
        const weight = selectedItems.reduce((s, it) => s + (it.weight || 0), 0);
        if (!weight || !selectedContact) {
          setShippingFee(0);
          return;
        }
        console.log(fromAddr);
        const fee = await getDeliveryFees({
          weight,
          to_district_id: selectedContact.district_id,
          to_ward_code: selectedContact.ward_code,
          from_district_id: fromAddr.from_district_id,
          from_ward_code: fromAddr.from_ward_code,
        });
        console.log(fromAddr.from_district_id, fromAddr.from_ward_code);
        setShippingFee(fee || 0);
      } catch (e) {
        console.error("getDeliveryFees failed:", e);
        setShippingFee(0);
      }
    };
    fetchFee();
  }, [selectedItems, selectedContact, fromAddr]);

  const placeOrder = async () => {
    try {
      if (!selectedItems.length) {
        alert("Giỏ hàng trống.");
        return;
      }
      if (!selectedContact) {
        alert("Vui lòng chọn địa chỉ nhận hàng.");
        return;
      }

      setLoading(true);

      const groups = buildSellerGroups(selectedItems);
      const totalWeight = selectedItems.reduce(
        (s, it) => s + (it.weight || 0),
        0
      );

      // Tạo payload gửi BE (object)
      const orderData = {
        buyer_contact_id: selectedContact.id, // id địa chỉ người mua
        shipping_fee: shippingFee || 0,
        subtotal: selectedTotal || 0,
        total: (selectedTotal || 0) + (shippingFee || 0),
        payment_method: "momo",
        note: "",

        // GHN fields:
        to_district_id: selectedContact.district_id,
        to_ward_code: selectedContact.ward_code,
        from_district_id: fromAddr.from_district_id,
        from_ward_code: fromAddr.from_ward_code,
        weight: totalWeight,

        // nhóm theo seller + posts đúng format bạn yêu cầu
        groups,
      };

      const res = await createOrder(orderData);

      clear();
      navigate(
        `/checkout/success?orderId=${res.orderId || ""}&total=${selectedTotal}`,
        { replace: true }
      );
    } catch (error) {
      console.error("Failed to place order:", error);
      navigate("/checkout/fail", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  // ==== handlers cho modal danh sách địa chỉ ====
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
      setContacts(list);
      const maybe = list.find(
        (c) => c.phone === payload.phone && c.detail === payload.detail
      );
      if (maybe) setSelectedContact(maybe);
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
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selectedContact?.id === id) {
        setSelectedContact(() => {
          const remain = contacts.filter((c) => c.id !== id);
          return remain[0] || null;
        });
      }
    } catch (e) {
      console.error("deleteContact failed:", e);
      alert("Xoá thất bại, vui lòng thử lại.");
    }
  };

  return (
    <>
      <div className="grid w-11/12 max-w-6xl gap-6 p-6 mx-auto md:w-4/5">
        {/* ======= ĐỊA CHỈ NHẬN HÀNG ======= */}
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Địa chỉ nhận hàng</h2>
              {selectedContact ? (
                <div className="mt-1 text-sm text-gray-700">
                  <div className="font-medium">
                    {selectedContact.name} • {selectedContact.phone}
                  </div>
                  <div>
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
                </div>
              ) : (
                <p className="mt-1 text-sm text-gray-500">
                  Bạn chưa chọn địa chỉ. Vui lòng chọn để giao hàng chính xác.
                </p>
              )}
            </div>
            <button
              onClick={() => setAddressOpen(true)}
              className="text-blue-600 hover:underline"
            >
              {selectedContact ? "Thay đổi" : "Chọn địa chỉ"}
            </button>
          </div>
        </div>

        {/* ======= DANH SÁCH SẢN PHẨM ======= */}
        <div>
          <h1 className="text-xl font-semibold">Thanh toán</h1>
          <div className="bg-white divide-y rounded-lg shadow-sm">
            {console.log(selectedGroups)}
            {selectedGroups.map((group) => (
              <div key={group.seller_id} className="p-3">
                <h2 className="mb-2 font-medium">
                  {group.seller_display_name}
                </h2>
              </div>
            ))}
          </div>
        </div>

        {/* ======= TỔNG KẾT ======= */}
        <div className="px-4 py-3">
          <CheckoutBar
            subtotal={selectedTotal}
            shipping={shippingFee}
            onPlaceOrder={placeOrder}
            loading={loading}
          />
        </div>
      </div>

      {/* ======= MODAL CHỌN ĐỊA CHỈ (click card để chọn) ======= */}
      <Dialog open={addressOpen} onOpenChange={setAddressOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chọn địa chỉ nhận hàng</DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-between mb-3">
            <Button variant="outline" onClick={addNew}>
              + Thêm địa chỉ
            </Button>
          </div>

          <div className="max-h-[65vh] overflow-auto space-y-3">
            {contactsLoading ? (
              <div className="py-8 text-center text-gray-500">Đang tải…</div>
            ) : contacts.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                Chưa có địa chỉ. Nhấn “Thêm địa chỉ”.
              </div>
            ) : (
              contacts.map((c) => {
                const active = selectedContact?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedContact(c)}
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
    </>
  );
}
