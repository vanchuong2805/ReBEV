export const formatVND = (n) =>
  typeof n === "number"
    ? n === 0
      ? "Miễn phí"
      : `${n.toLocaleString("vi-VN")} VND`
    : "0 VND";
