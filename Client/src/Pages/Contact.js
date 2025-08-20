import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SketchyHeader from "../Components/SketchyHeader";
import "../Styles/Contact.css";
import { supabase } from "../Utils/supabaseClient";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.message.trim() !== "";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);

    const { error } = await supabase.from("contact_us").insert([formData]);

    setLoading(false);

    if (error) {
      alert("Failed to submit: " + error.message);
    } else {
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="contact-page">
      <SketchyHeader title="Contact" onBack={handleBack} />
      <div className="contact-wrapper">
        <div className="contact-box">
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
                  placeholder="Have an idea, suggestion, or need help? Let’s talk!"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={!isFormValid || loading}
              >
                {loading ? "Sending..." : "Send Message ✉️"}
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
