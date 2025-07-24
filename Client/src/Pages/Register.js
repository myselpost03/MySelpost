import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import "../Styles/Register.css";
import bcrypt from "bcryptjs";
import { supabase } from "../Utils/supabaseClient";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: null,
  });

  const [step, setStep] = useState(1);
  const [emailValid, setEmailValid] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [country, setCountry] = useState("Hidden");

  const [nameTaken, setNameTaken] = useState(false);
  const navigate = useNavigate();

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const checkNameExists = async (name) => {
    if (!name) return;
    const { data } = await supabase
      .from("users")
      .select("name")
      .eq("name", name);
    setNameTaken(data && data.length > 0);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "email") {
      setEmailValid(isEmailValid(value));
    }

    if (name === "name") {
      checkNameExists(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  useEffect(() => {
    fetch("https://ipwho.is/?fields=country_code")
      .then((res) => res.json())
      .then((response) => {
        setCountry(response.country_code || "Hidden");
      })
      .catch(() => setCountry("Hidden"));
  }, []);

  useEffect(() => {
    if (
      step === 1 &&
      formData.name &&
      formData.email &&
      emailValid &&
      !nameTaken
    ) {
      const delay = setTimeout(() => {
        setStep(2);
      }, 500);
      return () => clearTimeout(delay);
    }
  }, [formData.name, formData.email, emailValid, nameTaken, step]);

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.profilePic &&
    emailValid &&
    !nameTaken;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const hashedPassword = await bcrypt.hash(formData.password, 10);

      let profilePicUrl = null;
      if (formData.profilePic) {
        const fileExt = formData.profilePic.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("profile-pics")
          .upload(filePath, formData.profilePic);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("profile-pics")
          .getPublicUrl(filePath);

        profilePicUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from("users").insert([
        {
          name: formData.name,
          email: formData.email,
          password: hashedPassword,
          profile_pic: profilePicUrl,
          country: country,
        },
      ]);

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
          <h2 className="acct-text">Create an Account</h2>

          {step === 1 && (
            <>
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
              <p className="step-indicator">Step 1 of 2 ✅</p>
            </>
          )}

          {step === 2 && (
            <>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <label style={{ marginTop: "10px" }}>Profile Pic</label>
              <input
                type="file"
                name="profilePic"
                accept="image/*"
                onChange={handleChange}
                required
              />

              {error && <p className="error-msg">{error}</p>}

              <button type="submit" disabled={!isFormValid || loading}>
                {loading ? "Registering..." : "Register"}
              </button>

              <p className="link-to-login">
                Already have an account? <Link to="/login">Login</Link>
              </p>

              <p className="step-indicator">Step 2 of 2 📸</p>
            </>
          )}
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
