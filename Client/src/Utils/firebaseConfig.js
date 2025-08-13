// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjUVd-Fk9HXi6xrTtftnZbuiwmoLbml88",
  authDomain: "profile-pics-e1ee3.firebaseapp.com",
  projectId: "profile-pics-e1ee3",
  storageBucket: "profile-pics-e1ee3.firebasestorage.app",
  messagingSenderId: "1022413602244",
  appId: "1:1022413602244:web:8d4b66060a22edc5ce7891"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
