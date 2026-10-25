import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import "../Styles/Login.css";
import { supabase } from "../Utils/supabaseClient";
import bcrypt from "bcryptjs";
import { trackEvent } from "../Utils/analytics";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import BannerAd from "../Components/BannerAd";
import i18n from "../i18n";
import AdsterraBanner from "../Components/AdsterraBanner";

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [emailValid, setEmailValid] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isMobileDevice = () =>
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "identifier") {
      // Only validate if it contains "@"
      if (value.includes("@")) {
        setEmailValid(isEmailValid(value));
      } else {
        setEmailValid(true); // Assume valid if it's likely a name
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = formData.identifier && formData.password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { identifier, password } = formData;

    try {
      // Fetch user by either email or name
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .or(`email.eq.${identifier},name.eq.${identifier}`)
        .single();

      if (fetchError || !data) {
        throw new Error(i18n.t("invalidUser"));
      }

      const passwordMatch = await bcrypt.compare(password, data.password);
      if (!passwordMatch) {
        throw new Error(i18n.t("incorrectPassword"));
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          coins: data.reward_coins ?? 0,
          rewardTime: data.last_coin_award_time ?? null,
        })
      );
      trackEvent({
        action: "button_click",
        category: "User Interaction",
        label: "Login Button",
      });
      // after successful login
      if (isMobileDevice()) {
        navigate("/chat-list", { replace: true });
      } else {
        navigate("/", { replace: true }); // Or wherever you want desktop users to land
      }
    } catch (err) {
      setError(err.message || i18n.t("loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google User Info:", decoded);

      // Check if user exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", decoded.email)
        .single();

      let userId;
      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Insert new user
        const { data: insertedUser, error: insertError } = await supabase
          .from("users")
          .insert([
            {
              name: decoded.name,
              email: decoded.email,
              profile_pic: decoded.picture || null,
            },
          ])
          .select()
          .single();

        if (insertError) throw insertError;
        userId = insertedUser.id;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: userId,
          name: decoded.name,
          email: decoded.email,
          coins: existingUser?.reward_coins ?? 0,
          google_login: true,
        })
      );

      trackEvent({
        action: "button_click",
        category: "User Interaction",
        label: "Google Login",
      });

      if (isMobileDevice()) {
        navigate("/chat-list", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError(i18n.t("googleLogin"));
    }
  };

  const handleGoogleLoginError = () => {
    setError(i18n.t("googleLoginFailed"));
  };

  return (
    <div>
      <Header />
       <div
               style={{
                 display: 'flex',
                 justifyContent: 'center', // Centers horizontally
                 alignItems: 'center', // Centers vertically
                 marginTop: '20%'
                 // Ensures no scrollbars if the ad is slightly off
               }}
             >
               <div style={{ maxWidth: '100%' }}>
                 <AdsterraBanner />
               </div>
             </div>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>{i18n.t("logIN")}</h2>

          <input
            type="text"
            name="identifier"
            placeholder={i18n.t("emailPlaceholder")}
            value={formData.identifier}
            onChange={handleChange}
            required
            className={!emailValid ? "invalid" : ""}
          />
          {!emailValid && <p className="error-msg">{i18n.t("emailInvalid")}</p>}

          <input
            type="password"
            name="password"
            placeholder={i18n.t("password")}
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" disabled={!isFormValid || loading}>
            {loading ? i18n.t("loggingIn") : i18n.t("login")}
          </button>

          <p className="link-to-register">
            {i18n.t("forgotPassword")}
            <Link to="/reset-password" style={{ textDecoration: "none" }}>
              {""} {i18n.t("reset")}
            </Link>
          </p>
        </form>
      </div>
 
    </div>
  );
};

export default Login;
