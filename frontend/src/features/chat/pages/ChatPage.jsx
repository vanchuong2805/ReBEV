// pages/ChatPage.jsx
import { useEffect, useState } from "react";
import ChatWindow from "../components/ChatWindow";
import { useUser } from "@/contexts/UserContext";
import { getRelatedAppUserIds } from "../lib/chatApi";
import { useSearchParams } from "react-router-dom";
import { getUserByID } from "../service";

export default function ChatPage() {
  const [sp] = useSearchParams();
  const [sellerAppId, setSellerAppId] = useState(Number(sp.get("seller")));

  const user = useUser();
  const buyerAppId = user?.user?.id;

  const [convs, setConvs] = useState([]); // [{ otherId: ... }]
  const [current, setCurrent] = useState(null); // { buyerAppId, sellerAppId }

  const catchName = async (buyerAppId) => {
    let result = await getUserByID(buyerAppId);
    return result;
  };

  // ✅ Load danh sách "người đã từng chat"
  useEffect(() => {
    if (!buyerAppId) return;
    (async () => {
      const ids = await getRelatedAppUserIds(buyerAppId);
      setConvs(ids.map((id) => ({ otherId: id })));
    })();
  }, [buyerAppId]);

  console.log("Conversations:", convs);
  console.log(sellerAppId);
  //   if (sellerAppId !== 0) {
  //     setCurrent({
  //       buyerAppId,
  //       sellerAppId: sellerAppId,
  //     });
  //   }
  useEffect(() => {
    if (!buyerAppId || !sellerAppId || isNaN(sellerAppId)) return;

    setCurrent({
      buyerAppId,
      sellerAppId,
    });
  }, [buyerAppId, sellerAppId]);

  console.log("Current conversation:", current);
  return (
    <div className="grid h-screen bg-white sm:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <aside className="border-r border-gray-200 bg-white">
        <div className="flex h-full flex-col overflow-y-auto">
          {convs.length === 0 ? (
            <div className="px-5 py-4 text-sm text-gray-500">
              Chưa có cuộc trò chuyện nào
            </div>
          ) : (
            convs.map((c) => {
              const isActive =
                current?.sellerAppId === c.otherId || sellerAppId === c.otherId;

              return (
                <button
                  key={c.otherId}
                  type="button"
                  onClick={() => {
                    setCurrent({
                      buyerAppId,
                      sellerAppId: c.otherId,
                    });
                    setSellerAppId(0);
                  }}
                  className={`flex w-full flex-col border-b border-gray-100 px-5 py-4 text-left transition hover:bg-gray-50 ${
                    isActive ? "bg-blue-50/80 text-blue-600" : ""
                  }`}
                >
                  <span className="text-sm font-semibold">
                    Người dùng {c.otherId}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Chat area */}
      <main className="flex h-full flex-col bg-gray-50 p-4 sm:p-6">
        {current ? (
          <div className="flex h-full items-start justify-center">
            <ChatWindow
              key={`${current.buyerAppId}_${current.sellerAppId}`}
              buyerAppId={current.buyerAppId}
              sellerAppId={
                sellerAppId === 0 ? current.sellerAppId : sellerAppId
              }
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white text-sm text-gray-500">
            Chọn một hội thoại
          </div>
        )}
      </main>
    </div>
  );
}
