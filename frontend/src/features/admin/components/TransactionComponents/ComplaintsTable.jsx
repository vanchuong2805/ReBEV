import React, { useState } from "react";
import { changeComplaintStatus } from "../../service";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import ComplaintDetail from "./ComplaintDetail";
import { useUser } from "@/contexts/UserContext";

export default function ComplaintsTable({ complaints, setComplaints }) {
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const user = useUser().user;
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString("vi-VN", {
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    });
  };
  const handleChangStatus = async (id, status) => {
    await changeComplaintStatus(id, status);
    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === id) {
          return {
            ...complaint,
            complaint_status: status,
            moderator_user: user?.display_name,
          };
        }
        return complaint;
      })
    );
  };
  const getStatusBadge = (status) => {
    const base =
      "px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center justify-center border transition";
    switch (status) {
      case 0:
        return (
          <span
            className={`${base} bg-yellow-100 text-yellow-800 border-yellow-300`}
          >
            Đang xử lí
          </span>
        );
      case 1:
        return (
          <span
            className={`${base} bg-green-100 text-blue-800 border-blue-300`}
          >
            Chấp nhận
          </span>
        );
      case 2:
        return (
          <span className={`${base} bg-gray-100 text-blue-800 border-blue-300`}>
            Từ chối
          </span>
        );
      case 3:
        return (
          <span className={`${base} bg-blue-100 text-blue-800 border-blue-300`}>
            Hủy
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
  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setOpenDetail(true);
  };
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedOrder(null);
  };
  console.log(complaints);
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        {/* Cho phép cuộn ngang khi thiếu chỗ */}
        <div className="overflow-x-auto">
          {/* Ép có độ rộng tối thiểu để không bị bóp cột + table-fixed */}
          <table className="min-w-[1100px] w-full table-fixed divide-y divide-gray-200">
            {/* width tương đối cho từng cột */}

            <thead className="bg-gray-50">
              <tr>
                {[
                  "Mã ",
                  "Người khiếu nại",
                  "Ngày Tạo",
                  "Trạng Thái",
                  "Người Xác Nhận",
                  "Thao Tác",
                ].map((h, i) => (
                  <th
                    key={i}
                    className={
                      "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    }
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {complaints?.map((item) => {
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      onClick={() => {
                        handleOpenDetail(item);
                      }}
                    >
                      {item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.user.display_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(item.create_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getStatusBadge(item.complaint_status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.moderator_user
                        ? item.moderator_user.display_name
                        : "N/A"}
                    </td>
                    <td className=" whitespace-nowrap text-sm text-gray-900 flex flex-col space-y-2 lg:w-36">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-300"
                        onClick={() => {
                          handleOpenDetail(item);
                        }}
                      >
                        <Eye size={16} className="mr-1" />
                        Xem Chi Tiết
                      </Button>

                      {item.complaint_status == 0 && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => {
                              handleChangStatus(item.id, 2);
                            }}
                          >
                            Từ chối
                          </Button>

                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              handleChangStatus(item.id, 1);
                            }}
                          >
                            Phê duyệt
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}

              {complaints.length === 0 && (
                <tr>
                  <td
                    className="px-6 py-8 text-sm text-gray-500 text-center"
                    colSpan={9}
                  >
                    Không có đơn khiếu nại nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ComplaintDetail
        openDetail={openDetail}
        complaint={selectedOrder}
        onClose={handleCloseDetail}
      />
    </>
  );
}
