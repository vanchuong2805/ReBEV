import { useUser } from "@/contexts/UserContext";
import { basesService } from "@/features/posts/service";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { getContactByUserId } from "@/features/profile/service";
import { getPostById } from "@/features/marketplace/service";
import { createOrder } from "../service";
function DepositPage() {
  const location = useLocation();
  const [base, setBase] = useState(null);
  const { user } = useUser();
  const { orderData } = location.state || {};
  const [customerContacts, setCustomerContacts] = useState(null);
  const [listing, setListing] = useState(null);
  const [toContact, setToContact] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState(null);

  const handleDeposit = async () => {
    orderData.to_contact_id = parseInt(toContact);
    orderData.order_details[0].appointment_time = appointmentTime;
    const paymentInfo = {
      total_amount: orderData.total_amount,
      redirectUrl: `${window.location.origin}`,
    };
    const orders = [orderData];
    const {payUrl} = await createOrder({ orders, paymentInfo });
    console.log(payUrl);
    window.location.href = payUrl;
    console.log({orders, paymentInfo})
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
        setListing(post);
        setBase(baseAddress);
        setCustomerContacts(customerContacts);
        setToContact(customerContacts[0]?.id || null);
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
    <div style={{ display: "flex", gap: "50px" }}>
      <div>
        <h2>Thông tin đơn hàng</h2>
        <img src={imageUrl} alt={listing.title} />
        <p>Tên sản phẩm: {listing.title}</p>
        <p>Giá sản phẩm: {listing.price.toLocaleString()} VND</p>
      </div>
      <div>
        <p>
          Địa chỉ giao dịch:{" "}
          {`${base.detail}, ${base.ward_name}, ${base.district_name}, ${base.province_name}`}
        </p>
        <p>Liên hệ: {base.phone}</p>
        <h2>Chọn địa chỉ khách hàng:</h2>
        <select
          name="customer_contact"
          style={{ border: "solid 1px 1px black" }}
          onChange={(e) => setToContact(e.target.value)}
        >
          {customerContacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {`${contact.detail}, ${contact.ward_name}, ${contact.district_name}, ${contact.province_name} - ${contact.phone} - ${contact.name}`}
            </option>
          ))}
        </select>
        <p>Chọn lịch hẹn:</p>
        {/* chỉ được chọn tính từ hôm nay */}
        <input
          type="date"
          name="appointment_time"
          min={new Date().toISOString().slice(0, 10)}
          value={appointmentTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
        />{" "}
        <br />
        <button
          onClick={handleDeposit}
          style={{ textDecoration: "underline", color: "blue" }}
        >
          Đặt cọc
        </button>
      </div>
    </div>
  );
}

export default DepositPage;
