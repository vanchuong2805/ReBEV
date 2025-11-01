import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCeaRgVEyPGsxWXv6u13nzeewgbiNIBaJs",
  authDomain: "rebevchat.firebaseapp.com",
  projectId: "rebevchat",
  storageBucket: "rebevchat.firebasestorage.app",
  messagingSenderId: "998717265745",
  appId: "1:998717265745:web:0f3a6a97cd77171607a570",
  measurementId: "G-02JFDCPT6B",
};

const app = initializeApp(firebaseConfig);
initializeFirestore(app, { localCache: persistentLocalCache() });
export const db = getFirestore(app);
export const auth = getAuth(app);
