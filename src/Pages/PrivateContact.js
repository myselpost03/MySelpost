import React, { useState } from 'react';
import Header from '../Components/Header';
import { supabase } from '../Utils/supabaseClient';
import toast, {Toaster} from 'react-hot-toast';
import '../Styles/PrivateContact.css';

const PrivateContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('contact_us').insert([formData]);

    setLoading(false);

    if (error) {
      toast.error('Failed to submit: ' + error.message, { duration: 4000 });
    } else {
      setSubmitted(true);
      toast.success('Inquiry submitted successfully!', { duration: 3000 });
    }
  };

  return (
    <>
      <Header />
      <div className="contact-page-wrapper">
        <div className="contact-container">
          
          {/* Page Header */}
          <div className="contact-header">
            <span className="contact-badge">24/7 HELPDESK</span>
            <h1 className="contact-title">Contact Support</h1>
            <p className="contact-subtitle">
              Have questions regarding queue status, VIP activation, or task tracking? Our team is online to assist you.
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="contact-info-grid">
            <div className="info-card">
              <span className="info-icon">⚡</span>
              <div>
                <h4>Response Time</h4>
                <p>Average reply within <b>2 hours</b></p>
              </div>
            </div>
            <div className="info-card">
              <span className="info-icon">🌐</span>
              <div>
                <h4>Server Status</h4>
                <p><span className="status-dot"></span> All Nodes Operational</p>
              </div>
            </div>
          </div>

          {/* Main Contact Form Section */}
          <div className="contact-card">
            {submitted ? (
              <div className="contact-success-state">
                <span className="success-icon">✅</span>
                <h3>Message Received!</h3>
                <p>Thank you for reaching out. Our support team will respond to your email shortly.</p>
                <button 
                  className="reset-btn" 
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', category: 'queue', message: '' });
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                
                <div className="form-group">
                  <label htmlFor="name">Your Name or Username</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name or handle..."
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Inquiry Topic</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="queue">Queue & Wait Times</option>
                    <option value="vip">VIP Fast-Pass Unlock</option>
                    <option value="tasks">10-Day Free Task Streak</option>
                    <option value="technical">Technical / Loading Issues</option>
                    <option value="other">General Question</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    placeholder="Describe your issue or inquiry in detail..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="submit-contact-btn"
                  disabled={loading}
                >
                  {loading ? 'Sending Message...' : 'Submit Inquiry'}
                </button>

              </form>
            )}
          </div>

          {/* Footer Note */}
          <div className="contact-footer-note">
            <p>🔒 Privacy Guard: We never disclose user search history or target information.</p>
          </div>

        </div>
      </div>
      <Toaster />
    </>
  );
};

export default PrivateContact;