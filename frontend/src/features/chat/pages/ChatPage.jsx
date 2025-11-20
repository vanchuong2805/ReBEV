// pages/ChatPage.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageSquarePlus, Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ErrorBoundary } from "../components/ErrorBoundary"; // đường dẫn theo project

import { useUser } from "@/contexts/UserContext";

import ChatWindow from "../components/ChatWindow";
import { getRelatedAppUserIds } from "../lib/chatApi";
import { fetchUsers } from "../service";

export default function ChatPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [sellerAppId, setSellerAppId] = useState(Number(sp.get("seller")));

  const user = useUser();
  const buyerAppId = user?.user?.id;

  const [convs, setConvs] = useState([]); // [{ otherId: ... }]
  const [current, setCurrent] = useState(null); // { buyerAppId, sellerAppId }

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUsers();
        console.log("user", data);
        setUsers(data.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  const getUserById = useCallback(
    (id) => users.find((item) => Number(item.id) === Number(id)),
    [users]
  );

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

  const filteredConversations = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return convs;
    return convs.filter((conversation) => {
      const userInfo = getUserById(conversation.otherId);
      const displayName = userInfo?.display_name?.toLowerCase() ?? "";
      return (
        displayName.includes(keyword) ||
        String(conversation.otherId).includes(keyword)
      );
    });
  }, [convs, searchTerm, getUserById]);

  const activeSellerId = useMemo(() => {
    if (!current) return null;
    return sellerAppId === 0 ? current.sellerAppId : sellerAppId;
  }, [current, sellerAppId]);

  const activeUser = useMemo(() => {
    if (!activeSellerId) return null;
    return getUserById(activeSellerId) ?? null;
  }, [activeSellerId, getUserById]);

  console.log(users);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <div className="grid min-h-screen grid-cols-1 overflow-hidden border-y border-slate-200 bg-white/90 backdrop-blur-sm sm:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
        <aside className="flex flex-col bg-slate-900/95 text-slate-100">
          <div className="space-y-2 px-6 pt-6 pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Hộp thư
            </p>
            <h2 className="text-2xl font-semibold">Tin nhắn</h2>
            <p className="text-xs text-slate-400">
              Chọn một cuộc trò chuyện để xem chi tiết.
            </p>
          </div>
          <div className="px-6 pb-4">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm kiếm hội thoại"
                className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 py-2.5 pl-10 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              />
            </label>
          </div>
          <div className="px-6 pb-4">
            <label className="relative block">
              <button
                onClick={() => {
                  navigate("/");
                }}
              >
                Về trang chủ
              </button>
            </label>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto px-4 pb-8">
            {filteredConversations.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-700/60 px-6 py-12 text-center text-sm text-slate-400">
                <MessageSquarePlus className="h-8 w-8 text-slate-500" />
                <p>Chưa tìm thấy cuộc trò chuyện phù hợp.</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const userInfo = getUserById(conversation.otherId);
                const displayName = userInfo?.display_name ?? "Người dùng ẩn";
                const initials = displayName.charAt(0).toUpperCase() || "?";
                const isActive =
                  current?.sellerAppId === conversation.otherId ||
                  sellerAppId === conversation.otherId;

                return (
                  <button
                    key={conversation.otherId}
                    type="button"
                    onClick={() => {
                      setCurrent({
                        buyerAppId,
                        sellerAppId: conversation.otherId,
                      });
                      setSellerAppId(0);
                    }}
                    className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                      isActive
                        ? "bg-cyan-500/20 text-white ring-1 ring-inset ring-cyan-300/60"
                        : "text-slate-200 hover:bg-slate-800/70"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border text-base font-semibold uppercase ${
                        isActive
                          ? "border-cyan-300 bg-cyan-400/10 text-white"
                          : "border-slate-700 bg-slate-800 text-slate-200"
                      }`}
                    >
                      {userInfo?.avatar ? (
                        <img
                          src={userInfo?.avatar}
                          alt="avataNguoiDung"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-semibold tracking-tight">
                        {displayName}
                      </span>
                      <span
                        className={`text-xs ${
                          isActive ? "text-cyan-200" : "text-slate-400"
                        }`}
                      >
                        Nhấn để tiếp tục trò chuyện
                      </span>
                    </div>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isActive ? "bg-cyan-300" : "bg-slate-600"
                      }`}
                    />
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <main className="flex h-full flex-col bg-slate-50/80">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white/70 px-6 py-4 backdrop-blur">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Đang trò chuyện với
              </p>
              <h1 className="mt-1 text-xl font-semibold text-slate-900">
                {activeUser?.display_name ?? "Chưa chọn hội thoại"}
              </h1>
            </div>
          </header>

          <div className="relative flex flex-1 flex-col px-0 pb-0 pt-0">
            {current ? (
              <div className="flex h-full w-full items-stretch">
                <div className="flex h-full w-full flex-col overflow-hidden bg-white">
                  <ErrorBoundary>
                    {current && (
                      <ChatWindow
                        key={`${current.buyerAppId}_${current.sellerAppId}`}
                        buyerAppId={current.buyerAppId}
                        sellerAppId={current.sellerAppId}
                      />
                    )}
                  </ErrorBoundary>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-white/80 px-10 text-center text-slate-500 shadow-inner">
                <MessageSquarePlus className="h-10 w-10 text-slate-400" />
                <div className="space-y-1">
                  <p className="text-base font-semibold text-slate-700">
                    Chọn một hội thoại
                  </p>
                  <p className="text-sm text-slate-500">
                    Nhấn vào danh sách bên trái để bắt đầu trao đổi với đối tác.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
