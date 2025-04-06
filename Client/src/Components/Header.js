import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Header.css';

const Header = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isDisabled = !email || !password;

  return (
    <header className="header">
      <Link to="/" className="logo">MySelpost</Link>
      <div className="nav-with-inputs">
        <input
          type="email"
          className="nav-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="nav-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <nav className="nav">
          <Link
            to="/login"
            className={`nav-link ${isDisabled ? 'conditionally-disabled' : ''}`}
            onClick={(e) => {
              if (window.innerWidth >= 768 && isDisabled) e.preventDefault();
            }}
          >
            Login
          </Link>
          <Link
            to="/register"
            className={`nav-link ${isDisabled ? 'conditionally-disabled' : ''}`}
            onClick={(e) => {
              if (window.innerWidth >= 768 && isDisabled) e.preventDefault();
            }}
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
