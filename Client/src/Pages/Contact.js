import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SketchyHeader from "../Components/SketchyHeader";
import "../Styles/Contact.css";
import i18n from "../i18n";
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
      <SketchyHeader title={i18n.t("contact")} onBack={handleBack} />
      <div className="contact-wrapper">
        <div className="contact-box">
          {!submitted ? (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{i18n.t("name")}</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>{i18n.t("email")}</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>{i18n.t("message")}</label>
                <textarea
                  name="message"
                  rows="5"
                  required
                  placeholder={i18n.t("haveIdea")}
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={!isFormValid || loading}
              >
                {loading ? i18n.t("sending") : `${i18n.t("sendMessage")} ✉️`}
              </button>
            </form>
          ) : (
            <div className="thank-you">
              <h2>{i18n.t("thanksFeedback")}</h2>
              <p>{i18n.t("responseTime")}</p>
            </div>
          )}
        </div>
      </div>
        <div className="bottom-nav">
        <button className="tab-btn" onClick={() => navigate('/demo')}>
          🏠<span>Home</span>
        </button>
        <button className="tab-btn">
          🔔<span>Notify</span>
        </button>
       {/*<button className="tab-btn">
          🪙<span>Coins</span>
        </button>*/}
        <button className="tab-btn" onClick={() => navigate('/fact-profile')}>
          ⚙️ <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Contact;
