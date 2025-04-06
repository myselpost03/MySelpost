import React from 'react';
import Header from '../Components/Header';
import '../Styles/Login.css';

const Register = () => {
  return (
    <div>
      <Header />
      <div className="login-container">
        <form className="login-form">
          <h2>Log In</h2>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Login</button>
          <p>Don't have an account? <a href="/register">Register</a></p>
        </form>
      </div>
    </div>
  );
};

export default Register;
