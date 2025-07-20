import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import "../Styles/Register.css";
import bcrypt from "bcryptjs";
import axios from "axios";
import { supabase } from "../Utils/supabaseClient";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
  });
  const [emailValid, setEmailValid] = useState(true);
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [nameTaken, setNameTaken] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://ip-api.com/json/?fields=status,message,countryCode")
      .then((res) => res.json())
      .then((response) => {
        //console.log("Country is : ", response.countryCode);
        setCountry(response.countryCode || "Hidden");
      })
      .catch((data, status) => {
        console.log("Request failed:", data);
        setCountry("Hidden");
      });
  }, []);

  const isEmailValid = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const checkNameExists = async (name) => {
    if (!name) {
      setNameTaken(false);
      return;
    }
    const { data, error } = await supabase
      .from("users")
      .select("name")
      .eq("name", name);

    setNameTaken(data && data.length > 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmailValid(isEmailValid(value));
    }

    if (name === "name") {
      checkNameExists(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.gender &&
    emailValid &&
    !nameTaken;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { name, email, password, gender } = formData;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const { error } = await supabase
        .from("users")
        .insert([{ name, email, password: hashedPassword, gender, country }]);

      if (error) throw error;

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Create an Account</h2>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className={nameTaken ? "invalid" : ""}
          />
          {nameTaken && (
            <p className="error-msg">
              Name already taken. Please choose another.
            </p>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className={!emailValid ? "invalid" : ""}
          />
          {!emailValid && (
            <p className="error-msg">Please enter a valid email address.</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="gender-group">
            <label className="gender-option">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleChange}
              />
              <span>♂ Male</span>
            </label>
            <label className="gender-option">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleChange}
              />
              <span>♀ Female</span>
            </label>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" disabled={!isFormValid || loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="link-to-login">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>

        {showAlert && (
          <div className="custom-alert-box">
            🎉 Registration successful! Redirecting to login...
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
