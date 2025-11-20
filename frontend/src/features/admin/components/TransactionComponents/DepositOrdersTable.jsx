import React, { useState } from "react";
import { updateContractFile, updateOrderStatus } from "../../service";
import { useUpload } from "@/hooks/posts/useUpload";
import { Button } from "@/components/ui/button";
import OrderTableDetail from "./OrderTableDetail";

export default function DepositOrdersTable({ orders, setOrders }) {
  const { upload } = useUpload();

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setOpenDetail(true);
  };
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedOrder(null);
  };
  const handleAddContract = async (e, id) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = await upload(file);
    const url = data?.url?.split(" ")[1];
    console.log(url);
    await updateContractFile(id, url);
    setOrders((prev) =>
      prev.map((order) => {
        // order_details là mảng, nhưng bạn chỉ cần so id của phần tử đầu tiên
        if (order.order_details[0].id === id) {
          return {
            ...order,
            order_details: order.order_details.map((detail) =>
              detail.id === id
                ? {
                    ...detail,
                    contract_file: url, // cập nhật contract_file mới
                  }
                : detail
            ),
          };
        }
        return order;
      })
    );
  };

  const handleUpdateStatus = async (id, status) => {
    await updateOrderStatus(id, status);

    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? {
              ...order,
              order_statuses: [
                {
                  ...(order.order_statuses?.[0] || {}),
                  status, // cập nhật đúng chỗ UI đang đọc
                  create_at: new Date().toISOString(),
                },
                ...(order.order_statuses?.slice(1) || []),
              ],
            }
          : order
      )
    );
  };

  const getStatusBadge = (status) => {
    const base =
      "px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center justify-center border transition";
    switch (status) {
      case "PENDING":
        return (
          <span
            className={`${base} bg-yellow-100 text-yellow-800 border-yellow-300`}
          >
            Đang chờ
          </span>
        );
      case "PAID":
        return (
          <span className={`${base} bg-blue-100 text-blue-800 border-blue-300`}>
            Đã bán
          </span>
        );
      case "CONFIRMED":
        return (
          <span
            className={`${base} bg-indigo-100 text-indigo-800 border-indigo-300`}
          >
            Đã xác nhận
          </span>
        );
      case "COMPLETED":
        return (
          <span
            className={`${base} bg-green-100 text-green-800 border-green-300`}
          >
            Đã hoàn thành
          </span>
        );
      case "CUSTOMER_CANCELLED":
        return (
          <span
            className={`${base} bg-orange-100 text-orange-800 border-orange-300`}
          >
            Người mua hủy
          </span>
        );
      case "SELLER_CANCELLED":
        return (
          <span className={`${base} bg-rose-100 text-rose-800 border-rose-300`}>
            Người bán hủy
          </span>
        );
      case "CANCELLED":
        return (
          <span className={`${base} bg-red-100 text-red-800 border-red-300`}>
            Đã hủy
          </span>
        );
      case "FAIL_PAY":
        return (
          <span className={`${base} bg-gray-100 text-gray-700 border-gray-300`}>
            Thanh toán thất bại
          </span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-700 border-gray-300`}>
            N/A
          </span>
        );
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        {/* Cho phép cuộn ngang khi thiếu chỗ */}
        <div className="overflow-x-auto">
          {/* Ép có độ rộng tối thiểu để không bị bóp cột + table-fixed */}
          <table className="min-w-[1100px] w-full table-fixed divide-y divide-gray-200">
            {/* width tương đối cho từng cột */}
            <colgroup>
              <col className="w-16" /> {/* ID */}
              <col className="w-24" /> {/* Người mua */}
              <col className="w-24" /> {/* Người bán */}
              <col className="w-32" /> {/* Tổng tiền */}
              <col className="w-28" /> {/* Trạng thái */}
              <col className="w-40" /> {/* Ngày tạo */}
              <col className="w-28 lg:w-32" /> {/* Người xác nhận */}
              <col className="w-40" /> {/* Hợp đồng */}
              <col className="w-28" /> {/* Thao tác */}
            </colgroup>

            <thead className="bg-gray-50">
              <tr>
                {[
                  "ID Đơn Mua",
                  "Người Mua",
                  "Người Bán",
                  "Tổng Tiền",
                  "Trạng Thái",
                  "Ngày Tạo",
                  "Người Xác Nhận",
                  "Hợp Đồng",
                  "Thao Tác",
                ].map((h, i) => (
                  <th
                    key={i}
                    className={[
                      "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                      // Ẩn bớt cột trên màn hình nhỏ cho thoáng
                      h === "Người Xác Nhận" || h === "Hợp Đồng"
                        ? "hidden md:table-cell"
                        : "",
                    ].join(" ")}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {orders?.map((item) => {
                const st = item.order_statuses?.[0];
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td
                      className="px-3 py-2 text-sm text-gray-900"
                      onClick={() => handleOpenDetail(item)}
                    >
                      {item.id}
                    </td>

                    <td
                      className="px-3 py-2 break-words text-sm text-gray-900"
                      title={String(item.customer.display_name)}
                      onClick={() => handleOpenDetail(item)}
                    >
                      {item.customer.display_name}
                    </td>

                    <td
                      className="px-3 py-2 break-words text-sm text-gray-900"
                      title={String(item.seller_id)}
                      onClick={() => handleOpenDetail(item)}
                    >
                      {item.seller.display_name}
                    </td>

                    <td
                      className="px-3 py-2 text-sm text-gray-900"
                      onClick={() => handleOpenDetail(item)}
                    >
                      {item.total_amount.toLocaleString("vi-VN")} VND
                    </td>

                    <td
                      className="px-3 py-2"
                      onClick={() => handleOpenDetail(item)}
                    >
                      {/* Chỉ hiển thị badge, bỏ chữ trạng thái lặp lại */}
                      {getStatusBadge(st?.status?.toUpperCase?.() || "N/A")}
                    </td>

                    <td
                      className="px-3 py-2 text-xs text-gray-900"
                      onClick={() => handleOpenDetail(item)}
                    >
                      {st?.create_at?.replace("T", " ").replace("Z", "") || "—"}
                    </td>

                    <td
                      className="px-3 py-2 break-words text-sm text-gray-900"
                      title={st?.create_by_user?.display_name || "N/A"}
                      onClick={() => handleOpenDetail(item)}
                    >
                      {st?.create_by_user?.display_name
                        ? st?.create_by_user?.display_name
                        : "N/A"}
                    </td>
                    <td className="px-3 py-2 hidden md:table-cell">
                      {/* Nút gọn mở input file ẩn */}
                      {console.log(item)}
                      <input
                        id={`file-${item.id}`}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          // reset value để có thể chọn cùng file nhiều lần nếu cần
                          const file = e.target.files?.[0];
                          if (!file) return;
                          handleAddContract(e, item.order_details[0]?.id);
                          e.target.value = "";
                        }}
                      />

                      <label
                        htmlFor={`file-${item.id}`}
                        className="px-2 py-1 text-xs rounded-md border bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        Tải hợp đồng
                      </label>
                      {item.order_details[0].contract_file && (
                        <a
                          href={item.order_details[0].contract_file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800 text-xs"
                        >
                          {" "}
                          Hợp Đồng{" "}
                        </a>
                      )}
                      <br />
                    </td>

                    <td className="px-3 py-3">
                      {st?.status?.toUpperCase() === "CONFIRMED" && (
                        <div className="flex flex-col gap-1 ">
                          <Button
                            onClick={() => {
                              handleUpdateStatus(
                                item?.id,
                                "CUSTOMER_CANCELLED"
                              );
                            }}
                            className={
                              "bg-orange-600 text-white hover:bg-orange-700 px-2 py-1"
                            }
                          >
                            Bên mua hủy
                          </Button>
                          <Button
                            onClick={() => {
                              handleUpdateStatus(item?.id, "SELLER_CANCELLED");
                            }}
                            className={
                              "bg-red-600 text-white hover:bg-red-700 px-2 py-1"
                            }
                          >
                            Bên bán hủy
                          </Button>
                          <Button
                            onClick={() => {
                              handleUpdateStatus(item?.id, "COMPLETED");
                            }}
                            className={
                              "bg-green-600 text-white hover:bg-green-700 px-2 py-1"
                            }
                          >
                            Thành công{" "}
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {orders.length === 0 && (
                <tr>
                  <td
                    className="px-6 py-8 text-sm text-gray-500 text-center"
                    colSpan={9}
                  >
                    Không có đơn đặt cọc nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <OrderTableDetail
        openDetail={openDetail}
        orderId={selectedOrder?.id}
        onClose={handleCloseDetail}
      />
    </>
  );
}
