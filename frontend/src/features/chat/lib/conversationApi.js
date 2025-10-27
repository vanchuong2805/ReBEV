// lib/conversationApi.js
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

export function subscribeConversationsForSeller(sellerAppId, cb) {
  const q = query(
    collection(db, "conversations"),
    where("participantAppIds", "array-contains", sellerAppId),
    orderBy("updatedAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    cb(items);
  });
}
