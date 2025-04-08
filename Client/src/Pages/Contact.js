import React, { useState } from "react";
import Header from "../Components/Header";
import "../Styles/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <Header />
      <div className="contact-wrapper">
        <div className="contact-box">
          <h1>Get in Touch</h1>
          <p>Have an idea, suggestion, or need help? Let’s talk!</p>

          {!submitted ? (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  rows="5"
                  required
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Send Message ✉️
              </button>
            </form>
          ) : (
            <div className="thank-you">
              <h2>Thanks for reaching out!</h2>
              <p>We'll get back to you within 24–48 hours.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
