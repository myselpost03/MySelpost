import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import '../Styles/Register.css';
import bcrypt from 'bcryptjs';
import { supabase } from '../Utils/supabaseClient';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [emailValid, setEmailValid] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();

  const isEmailValid = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setEmailValid(isEmailValid(value));
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const isFormValid =
    formData.name && formData.email && formData.password && emailValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { name, email, password } = formData;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const { error } = await supabase
        .from('users')
        .insert([{ name, email, password: hashedPassword }]);

      if (error) throw error;

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Something went wrong');
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
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className={!emailValid ? 'invalid' : ''}
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
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" disabled={!isFormValid || loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          <p>
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
