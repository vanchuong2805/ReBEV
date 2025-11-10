import React from "react";

export default function ReturnOrdertable({ returnOrders }) {
  console.log(returnOrders);
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
          </table>
        </div>
      </div>
    </>
  );
}
