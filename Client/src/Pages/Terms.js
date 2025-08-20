import React from "react";
import { useNavigate } from "react-router-dom";
import SketchyHeader from "../Components/SketchyHeader";
import "../Styles/Privacy.css"; // Reusing same CSS for consistency

const Terms = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <SketchyHeader title="Terms" onBack={handleBack} />
      <div className="privacy-container">
        <div className="privacy-card">
          <h1 className="privacy-title">Terms of Service</h1>

          <p className="privacy-text">
            Welcome to our social networking platform. By accessing or using our services, you agree to be bound by these Terms of Service.
          </p>

          <h2 className="privacy-subtitle">1. Use of Service</h2>
          <p className="privacy-text">
            You agree to use the platform only for lawful purposes and in a manner that does not infringe the rights of others.
            You are responsible for your account and any content you post, including comments, posts, messages, and photos.
          </p>

          <h2 className="privacy-subtitle">2. User-Generated Content</h2>
          <p className="privacy-text">
            You retain ownership of the content you create. However, by posting, you grant us a license to use, display, and distribute your content within the platform to provide services.
            Do not post videos, copyrighted material, or illegal content.
          </p>

          <h2 className="privacy-subtitle">3. Account Security</h2>
          <p className="privacy-text">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            Notify us immediately if you suspect any unauthorized access.
          </p>

          <h2 className="privacy-subtitle">4. Prohibited Activities</h2>
          <ul className="privacy-list">
            <li>Spamming or sending unsolicited messages.</li>
            <li>Uploading viruses, malware, or harmful code.</li>
            <li>Harassment, bullying, or abusive behavior toward others.</li>
            <li>Attempting to gain unauthorized access to accounts or systems.</li>
          </ul>

          <h2 className="privacy-subtitle">5. Limitation of Liability</h2>
          <p className="privacy-text">
            We are not responsible for any damages or losses resulting from your use of the platform, including user-generated content, interactions, or third-party links.
          </p>

          <h2 className="privacy-subtitle">6. Changes to Terms</h2>
          <p className="privacy-text">
            We may update these Terms of Service from time to time. Users will be notified of significant changes.
          </p>

          <h2 className="privacy-subtitle">7. Contact Us</h2>
          <p className="privacy-text">
            If you have any questions about these terms, please contact us at myselpost03@gmail.com.
          </p>
        </div>
      </div>
    </>
  );
};

export default Terms;
