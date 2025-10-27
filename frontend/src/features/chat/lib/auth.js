import { auth } from "./firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";

export async function ensureFirebaseLogin() {
  if (!auth.currentUser) await signInAnonymously(auth);
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) { unsub(); resolve(u); }
    });
  });
}
