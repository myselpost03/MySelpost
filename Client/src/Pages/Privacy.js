import React from "react";
import { useNavigate } from "react-router-dom";
import SketchyHeader from "../Components/SketchyHeader";
import "../Styles/Privacy.css";

const Privacy = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <SketchyHeader title="Privacy" onBack={handleBack} />
      <div className="privacy-container">
        <div className="privacy-card">
          <h1 className="privacy-title">Privacy Policy</h1>
          <p className="privacy-text">
            Your privacy is important to us. This Privacy Policy explains how we collect,
            use, and protect your information when you use our services.
          </p>

          <h2 className="privacy-subtitle">Information We Collect</h2>
          <p className="privacy-text">
            We collect the following information to provide and improve our social networking services:
          </p>
          <ul className="privacy-list">
            <li><strong className="privacy-subtitle">User-generated content:</strong> comments, posts, messages, and photos only (videos are not collected).</li>
            <li><strong className="privacy-subtitle">Usage data:</strong> login times, pages visited, interactions, and session duration.</li>
            <li><strong className="privacy-subtitle">Device and technical data:</strong> IP address (used to determine your country), browser type, and operating system.</li>
            <li><strong className="privacy-subtitle">LocalStorage:</strong> We use localStorage to persist user preferences; we do not use cookies.</li>
            <li><strong className="privacy-subtitle">Other information:</strong> any data voluntarily provided to improve user experience.</li>
          </ul>

          <h2 className="privacy-subtitle">How We Use Your Information</h2>
          <p className="privacy-text">
            Your data is used to enhance app functionality, communicate important updates,
            and ensure security. We do not sell your information to third parties.
          </p>

          <h2 className="privacy-subtitle">Cookies & Tracking</h2>
          <p className="privacy-text">
            Our website doesn't use cookies but uses localStorage and similar technologies to persist user activity
            and remember preferences.
          </p>

          <h2 className="privacy-subtitle">Contact Us</h2>
          <p className="privacy-text">
            If you have any questions about this privacy policy, please contact us at
            myselpost03@gmail.com.
          </p>
        </div>
      </div>
    </>
  );
};

export default Privacy;
