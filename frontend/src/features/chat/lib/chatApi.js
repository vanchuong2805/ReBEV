// src/lib/chatApi.js
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  getDocs,
  limit,
  startAfter,
  arrayUnion,
  where,
} from "firebase/firestore";
import { db, auth } from "./firebase"; // ✅ cần auth cho sendMessage
import { ensureFirebaseLogin } from "./auth";

// Tạo khóa hội thoại duy nhất từ 2 appUserId (id trong SQL của bạn)
function convKeyOf(aId, bId) {
  const [x, y] = [String(aId), String(bId)].sort();
  return `${x}_${y}`;
}

// Gọi khi user bấm "Chat với seller"
export async function openOrCreateConversation(buyerAppId, sellerAppId) {
  const user = await ensureFirebaseLogin();
  const key = convKeyOf(buyerAppId, sellerAppId);
  const ref = doc(db, "conversations", key);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      participantUids: [user.uid],
      participantAppIds: [buyerAppId, sellerAppId],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: "",
    });
  } else {
    // 👉 self-join: thêm đúng UID hiện tại
    await updateDoc(ref, {
      participantUids: arrayUnion(user.uid),
      updatedAt: serverTimestamp(),
    });
  }
  return key;
}
export function subscribeMessages(convKey, cb) {
  const q = query(
    collection(db, `conversations/${convKey}/messages`),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function sendMessage(convKey, content, senderAppId) {
  // Đảm bảo đã đăng nhập (phòng khi gọi thẳng sendMessage khi chưa có UID)
  const user = await ensureFirebaseLogin();
  const uid = user.uid || auth.currentUser?.uid;

  await addDoc(collection(db, `conversations/${convKey}/messages`), {
    senderUid: uid,
    senderAppId,
    content,
    createdAt: serverTimestamp(),
    isReadBy: [],
  });

  await updateDoc(doc(db, "conversations", convKey), {
    lastMessage: content,
    updatedAt: serverTimestamp(),
  });
}

// (tuỳ chọn) phân trang lịch sử
export async function fetchMessagesPage(convKey, pageSize = 30, cursorDoc) {
  const base = collection(db, `conversations/${convKey}/messages`);
  let q = query(base, orderBy("createdAt", "desc"), limit(pageSize));
  if (cursorDoc) {
    q = query(
      base,
      orderBy("createdAt", "desc"),
      startAfter(cursorDoc),
      limit(pageSize)
    );
  }
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const nextCursor = snap.docs[snap.docs.length - 1];
  return { items: items.reverse(), nextCursor };
}



export async function getRelatedAppUserIds(appUserId) {
  const q = query(
    collection(db, "conversations"),
    where("participantAppIds", "array-contains", appUserId)
  );

  const snap = await getDocs(q);

  const results = new Set();

  snap.forEach((doc) => {
    const arr = doc.data().participantAppIds;
    arr.forEach((id) => {
      if (id !== appUserId) {
        results.add(id); // Set để tránh trùng
      }
    });
  });

  return [...results];
}
