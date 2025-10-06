// components/transactions/MockTransactions.js

export const mockTransactions = [
  {
    id: 1,
    sender_id: 3,               // người mua
    receiver_id: 10,            // hệ thống
    transaction_type: 1,        // Đặt cọc
    related_order_id: 201,
    related_order_detail_id: null,
    related_package_id: null,
    amount: 2000000,
    status: 1,
    create_at: "2025-09-25T14:10:00+07:00",
  },
  {
    id: 2,
    sender_id: 3,
    receiver_id: 5,             // người bán
    transaction_type: 0,        // Thanh toán
    related_order_id: 202,
    related_order_detail_id: null,
    related_package_id: null,
    amount: 18500000,
    status: 1,
    create_at: "2025-09-27T11:30:00+07:00",
  },
  {
    id: 3,
    sender_id: 10,
    receiver_id: 5,
    transaction_type: 4,        // Giải ngân tiền cọc xe
    related_order_id: 201,
    related_order_detail_id: null,
    related_package_id: null,
    amount: 2000000,
    status: 1,
    create_at: "2025-09-30T09:00:00+07:00",
  },
  {
    id: 4,
    sender_id: 2,
    receiver_id: 10,
    transaction_type: 2,        // Hoàn tiền
    related_order_id: 203,
    related_order_detail_id: null,
    related_package_id: null,
    amount: 2500000,
    status: 1,
    create_at: "2025-09-22T09:00:00+07:00",
  },
  {
    id: 5,
    sender_id: 1,
    receiver_id: 10,
    transaction_type: 3,        // Mua gói thành viên
    related_order_id: null,
    related_order_detail_id: null,
    related_package_id: 1,
    amount: 99000,
    status: 1,
    create_at: "2025-09-21T16:00:00+07:00",
  },
  {
    id: 6,
    sender_id: 10,
    receiver_id: 4,
    transaction_type: 4,        // Giải ngân bán pin (ship)
    related_order_id: 305,
    related_order_detail_id: 2,
    related_package_id: null,
    amount: 2600000,
    status: 1,
    create_at: "2025-09-29T20:30:00+07:00",
  },
  {
    id: 7,
    sender_id: 10,
    receiver_id: 3,
    transaction_type: 5,        // Rút tiền
    related_order_id: null,
    related_order_detail_id: null,
    related_package_id: null,
    amount: 5000000,
    status: 1,
    create_at: "2025-10-02T13:00:00+07:00",
  },
]
