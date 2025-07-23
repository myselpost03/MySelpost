import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Header.css";
import { supabase } from "../Utils/supabaseClient";
import bcrypt from "bcryptjs";
import SketchyAlert from "../Components/SketchyAlert";
import LoadingIndicator from "../Components/LoadingIndicator";

const Header = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [emailValid, setEmailValid] = useState(true);
  const [credentialsValid, setCredentialsValid] = useState(false);
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);
  const [showZoomed, setShowZoomed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = useNavigate();
  const debounceTimeout = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setTimeout(() => {
      setLoading(false); // simulate delay or finish loading
    }, 500);
  }, []);

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateCredentials = async (email, password) => {
    setChecking(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error || !data) {
        setCredentialsValid(false);
      } else {
        const match = await bcrypt.compare(password, data.password);
        setCredentialsValid(match);
      }
    } catch {
      setCredentialsValid(false);
    } finally {
      setChecking(false);
    }
  };
  
  const handleClick = () => {
    setLoading(true);
    // Simulate loading (optional)
    setTimeout(() => {
      navigate(`/profile/${user.id}`);
    }, 500); // Optional delay
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    if (name === "email") {
      setEmailValid(isEmailValid(value));
    }

    clearTimeout(debounceTimeout.current);

    if (
      updatedForm.email &&
      updatedForm.password &&
      isEmailValid(updatedForm.email)
    ) {
      debounceTimeout.current = setTimeout(() => {
        validateCredentials(updatedForm.email, updatedForm.password);
      }, 500);
    } else {
      setCredentialsValid(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error || !data) throw new Error("Invalid email");

      const match = await bcrypt.compare(password, data.password);
      if (!match) throw new Error("Incorrect password");

      const userObj = { id: data.id, name: data.name, email: data.email };
      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj); // ✅ Set user to trigger logout UI
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChat = () => {
    navigate("/register");
  };

  const handleMobileRedirect = (path) => {
    if (isMobile) navigate(path);
  };

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/" className="logo">
          MySelpost
        </Link>
        {user && !isMobile && (
          <div className="feature-banner-container">
            <div className="coming-soon-banner">Coming Soon</div>
            <button
              className="sketchy-feature-button"
              //onClick={() => setShowZoomed(true)}
            >
              ✨ Feature your Profile here
            </button>
          </div>
        )}
      </div>

      {!user ? (
        <form className="nav-with-inputs" onSubmit={handleSubmit}>
          {!isMobile ? (
            <>
              <input
                className="nav-input"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                className="nav-input"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <nav className="nav">
                <button
                  type="submit"
                  className="profile-button"
                  disabled={checking} // ✅ Now allows clicking if not checking
                >
                  {checking ? "Checking..." : "Login"}
                </button>
                <Link to="/register" className="profile-button">
                  Register
                </Link>
              </nav>
            </>
          ) : (
            <nav className="nav">
              <button
                type="button"
                onClick={() => handleMobileRedirect("/login")}
                className="profile-button"
              >
                Login
              </button>
              <button
                type="button"
                onClick={handleChat}
                className="profile-button"
              >
                Register
              </button>
            </nav>
          )}
        </form>
      ) : (
        <div className="nav-logged-in">
          <button onClick={handleLogout} className="profile-button">
            Logout
          </button>
          <Link
            style={{ textDecoration: "none" }}
            onClick={handleClick}
            className="profile-button"
          >
            Profile
          </Link>
        </div>
      )}
      {alertMessage && (
        <SketchyAlert
          message={alertMessage.text}
          withButton={alertMessage.withButton}
          onClose={() => setAlertMessage(null)}
        />
      )}
      {showZoomed && (
        <div className="zoom-overlay" onClick={() => setShowZoomed(false)}>
          <img
            src="https://i.pinimg.com/736x/b4/41/52/b44152e1ad63150f12efe7a050a0b26c.jpg"
            alt="Zoomed"
            className="zoomed-profile-pic"
          />
        </div>
      )}
    </header>
  );
};

export default Header;
