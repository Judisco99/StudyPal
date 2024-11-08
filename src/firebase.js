// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOhHfCad2zRz7h-n6XPfsRyVWge00ykB4",
  authDomain: "study-pall.firebaseapp.com",
  projectId: "study-pall",
  storageBucket: "study-pall.firebasestorage.app",
  messagingSenderId: "172840144812",
  appId: "1:172840144812:web:a499cdbf900721d575f409",
  measurementId: "G-SZPKZYN503"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // Initialize Firebase Auth
const provider = new GoogleAuthProvider();  // Google Auth Provider

export { auth, provider, signInWithPopup };
