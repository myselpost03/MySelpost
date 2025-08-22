import React, { useState } from "react";
import { supabase } from "../Utils/supabaseClient";
import bcrypt from "bcryptjs";
import Header from "../Components/Header";
import "../Styles/ResetPassword.css";
import toast, { Toaster } from "react-hot-toast";
import confetti from "canvas-confetti"; // ✅ Import confettiimport { Toaster } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = async () => {
    if (!email) {
      setMessage("❌ Please enter your email.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setMessage("⚠️ Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // 1. Check if user exists
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error || !user) {
        setMessage("❌ User not found.");
        setLoading(false);
        return;
      }

      // 2. Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Update password
      const { error: updateError } = await supabase
        .from("users")
        .update({ password: hashedPassword })
        .eq("email", email);

      if (updateError) throw updateError;

      toast.success("Password reset successful. Please log in.");
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = loading || !email || !password || !confirmPassword;

  return (
    <>
      <Header />
      <div className="reset-wrapper">
        <div className="reset-card">
          <h2 className="reset-title">🔑 Reset Your Password</h2>
          <p className="reset-subtext">
            Enter your account email and new password to reset.
          </p>

          <input
            type="email"
            className="reset-input"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              className="reset-input"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="reset-input"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            className="reset-btn"
            onClick={handleReset}
            disabled={isButtonDisabled}
          >
            {loading ? "⏳ Resetting..." : "Reset Password"}
          </button>

          {message && <div className="reset-message">{message}</div>}
        </div>
      </div>

      <Toaster />
    </>
  );
}
