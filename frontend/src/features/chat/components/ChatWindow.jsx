// src/components/ChatWindow.jsx
import { useEffect, useRef, useState } from "react";
import {
  openOrCreateConversation,
  subscribeMessages,
  sendMessage,
} from "../lib/chatApi";
import { fetchUsers } from "@/features/admin/service";

export default function ChatWindow({ buyerAppId, sellerAppId }) {
  const [convKey, setConvKey] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const unsubRef = useRef(null);
  const bottomRef = useRef(null);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchUsers().then((data) => {
      setUsers(data);
    });
  }, []);

  const getUserById = (id) => {
    const nguoiDung = users.filter((user) => (user.id == id ? true : false))[0];
    return nguoiDung;
  };

  useEffect(() => {
    (async () => {
      const key = await openOrCreateConversation(buyerAppId, sellerAppId);
      setConvKey(key);
      unsubRef.current = subscribeMessages(key, (arr) => {
        setMsgs(arr);
      });
    })();
    return () => unsubRef.current && unsubRef.current();
  }, [buyerAppId, sellerAppId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  async function handleSend() {
    const content = text.trim();
    if (!content || !convKey) return;
    await sendMessage(convKey, content, buyerAppId);
    setText("");
  }

  return (
    //max-w-3xl
    <div className="flex h-[90vh] min-h-[360px] w-full  flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* <header className="border-b border-gray-200 px-6 py-4 text-sm font-semibold text-gray-800">
        Chat với {getUserById(sellerAppId)?.display_name}
      </header> */}

      <section className="flex-1 space-y-3 overflow-y-auto bg-gray-50 px-4 py-4 sm:px-6">
        {msgs.map((m) => {
          const isMe = m.senderAppId === buyerAppId;

          return (
            <div
              key={m.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  isMe
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 bg-white text-gray-900"
                }`}
              >
                <div
                  className={`mb-1 text-xs font-medium ${
                    isMe ? "text-white/80 text-right" : "text-gray-500"
                  }`}
                >
                  {isMe ? "Bạn" : `${getUserById(sellerAppId)?.display_name}`}
                </div>
                <p className="text-sm">{m.content}</p>
                <div
                  className={`mt-2 text-[11px] ${
                    isMe ? "text-white/70" : "text-gray-500"
                  } text-right`}
                >
                  {m.createdAt?.toDate?.().toLocaleString?.() || ""}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </section>

      <footer className="flex items-center gap-3 border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <input
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nhập tin nhắn…"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          type="button"
          onClick={handleSend}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
        >
          Gửi
        </button>
      </footer>
    </div>
  );
}
