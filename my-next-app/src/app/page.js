"use client";

import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/navigation";  // Correct import for app directory
import styles from "./page.module.css";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDn1diK1hdrfAaqnxhnFlqQ5qvwUfAhags",
  authDomain: "rockerzz-8e4e5.firebaseapp.com",
  projectId: "rockerzz-8e4e5",
  storageBucket: "rockerzz-8e4e5.appspot.com",
  messagingSenderId: "741020854623",
  appId: "1:741020854623:web:158337df9eaca5deb4eeea",
  measurementId: "G-H7CDMWPZJH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function LoginPage() {
  const router = useRouter();  // Correct useRouter for app directory

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User info:", user);

      // Redirect to /Home after successful login
      router.push("/Home");
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.loginContainer}>
        <h1 className={styles.title}>Login</h1>
        <form className={styles.form}>
          <input
            type="text"
            placeholder="Username"
            className={styles.inputField}
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.inputField}
          />
          <div className={styles.forgotPassword}>
            <a href="#">Forget Password?</a>
          </div>
          <button type="button" className={styles.loginButton} onClick={handleGoogleLogin}>
            Login with Google
          </button>
        </form>
        <div className={styles.signupContainer}>
          Not a Member? <a href="#">Signup</a>
        </div>
      </div>
    </div>
  );
}
