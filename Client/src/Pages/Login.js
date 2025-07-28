import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import "../Styles/Login.css";
import { supabase } from "../Utils/supabaseClient";
import bcrypt from "bcryptjs";

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
        throw new Error("Invalid email or user not found.");
      }

      const passwordMatch = await bcrypt.compare(password, data.password);
      if (!passwordMatch) {
        throw new Error("Incorrect password.");
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

      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Log In</h2>
          <input
            type="text"
            name="identifier"
            placeholder="Email or Name"
            value={formData.identifier}
            onChange={handleChange}
            required
            className={!emailValid ? "invalid" : ""}
          />
          {!emailValid && <p className="error-msg">Email format invalid</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" disabled={!isFormValid || loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
