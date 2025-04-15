import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// Firebase配置
const firebaseConfig = {
  apiKey: "AIzaSyAQWwW3dCglf-6kPQNseCRaHCcXdL2VHb8",
  authDomain: "mood-b9ac4.firebaseapp.com",
  projectId: "mood-b9ac4",
  storageBucket: "mood-b9ac4.appspot.com",
  messagingSenderId: "1091038003368",
  appId: "1:1091038003368:web:0317f2e6fbc2ddf65f429d",
};

// 初始化Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// 获取当前用户
export const getCurrentUser = () => {
  return auth.currentUser;
};

// 检查用户是否已认证
export const isAuthenticated = () => {
  return !!auth.currentUser;
};

// 退出登录
export const logout = () => {
  return signOut(auth);
};

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
};
