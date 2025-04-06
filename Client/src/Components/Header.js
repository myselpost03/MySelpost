import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Header.css";
import { supabase } from '../Utils/supabaseClient';
import bcrypt from 'bcryptjs';

const Header = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [emailValid, setEmailValid] = useState(true);
  const [credentialsValid, setCredentialsValid] = useState(false);
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();
  const debounceTimeout = useRef(null);

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateCredentials = async (email, password) => {
    setChecking(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
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
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) throw new Error("Invalid email");

      const match = await bcrypt.compare(password, data.password);
      if (!match) throw new Error("Incorrect password");

      const userObj = { id: data.id, name: data.name, email: data.email };
      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj); // ✅ Set user to trigger logout UI
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleMobileRedirect = (path) => {
    if (isMobile) navigate(path);
  };

  return (
    <header className="header">
      <Link to="/" className="logo">MySelpost</Link>

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
                  className="nav-link"
                  disabled={checking} // ✅ Now allows clicking if not checking
                >
                  {checking ? 'Checking...' : 'Login'}
                </button>
                <Link to="/register" className="nav-link">Register</Link>
              </nav>
            </>
          ) : (
            <nav className="nav">
              <button
                type="button"
                onClick={() => handleMobileRedirect('/login')}
                className="nav-link"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleMobileRedirect('/register')}
                className="nav-link"
              >
                Register
              </button>
            </nav>
          )}
        </form>
      ) : (
        <div className="nav-logged-in">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
