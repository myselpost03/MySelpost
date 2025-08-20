import React from "react";
import { useNavigate } from "react-router-dom";
import SketchyHeader from "../Components/SketchyHeader";
import "../Styles/Privacy.css"; // Reuse same CSS for consistency

const About = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <SketchyHeader title="About Us" onBack={handleBack} />
      <div className="privacy-container">
        <div className="privacy-card">
          <h1 className="privacy-title">About Our Platform</h1>

          <p className="privacy-text">
            Welcome to our social networking platform! We aim to connect people from around the world,
            providing a safe and engaging space for sharing thoughts, photos, and interacting with others.
          </p>

          <h2 className="privacy-subtitle">Our Mission</h2>
          <p className="privacy-text">
            Our mission is to create a platform where users can freely express themselves, share meaningful
            content, and build communities while maintaining privacy and security.
          </p>

          <h2 className="privacy-subtitle">What We Offer</h2>
          <ul className="privacy-list">
            <li>Post comments, messages, and photos.</li>
            <li>Connect and interact with other users safely.</li>
            <li>Stay updated with the latest posts from your network.</li>
            <li>Control your data and account privacy settings.</li>
          </ul>

          <h2 className="privacy-subtitle">Our Values</h2>
          <p className="privacy-text">
            We value transparency, privacy, and user safety. Our platform is designed to give you full control
            over your content and experience.
          </p>

          <h2 className="privacy-subtitle">Contact Us</h2>
          <p className="privacy-text">
            Have questions or suggestions? Reach out to us at myselpost03@gmail.com. We’d love to hear from you!
          </p>
        </div>
      </div>
    </>
  );
};

export default About;
