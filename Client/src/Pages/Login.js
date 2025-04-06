import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import '../Styles/Login.css';
import { supabase } from '../Utils/supabaseClient';
import bcrypt from 'bcryptjs';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [emailValid, setEmailValid] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setEmailValid(isEmailValid(value));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const isFormValid = formData.email && formData.password && emailValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { email, password } = formData;

    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (fetchError || !data) {
        throw new Error('Invalid email or user not found.');
      }

      const passwordMatch = await bcrypt.compare(password, data.password);
      if (!passwordMatch) {
        throw new Error('Incorrect password.');
      }

      // ✅ Store logged-in user data in localStorage
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email
      }));

      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed.');
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
            {loading ? 'Logging in...' : 'Login'}
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
