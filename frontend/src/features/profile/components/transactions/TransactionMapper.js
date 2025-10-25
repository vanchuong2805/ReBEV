export const transactionTypeVI = (t) =>
  t === 0 ? "Nạp tiền vào ví" :
  t === 1 ? "Rút tiền" :
  t === 2 ? "Thanh toán đơn hàng" :
  t === 3 ? "Hoàn tiền" :
  t === 4 ? "Mua gói thành viên" : "Khác"

export const statusVI = (s) => s ? "Thành công" : "Thất bại"
