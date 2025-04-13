import React from "react";
import Header from "../Components/Header";
import "../Styles/About.css";

const About = () => {
  return (
    <div className="about-page">
      <Header />
      <div className="about-content">
        <h1>Welcome to MySelpost</h1>
        <p className="intro-text">
          <strong>MySelpost</strong> is your personal digital builder — where your ideas, no matter how rough, are transformed into polished websites or apps by hand.
        </p>

        <div className="about-section">
          <h2>🚀 What We Do</h2>
          <p>
            We specialize in turning hand-drawn sketches or text prompts into fully functional digital products.
            Every creation is custom-built by AI with care and precision.
          </p>
        </div>

        <div className="about-section">
          <h2>🛠️ How It Works</h2>
          <p>
            1. <strong>Sketch or Prompt:</strong> Submit your idea in the form of a rough sketch or a simple description.<br />
            2. <strong>We Build It:</strong> We begin development using AI, ensuring every detail reflects your original vision.<br />
            3. <strong>Delivery:</strong> You get progress updates and the final product within your selected timeline.
          </p>
        </div>

        <div className="about-section">
          <h2>💳 Plans & Delivery</h2>
          <ul>
            <li>
              <strong>Sketch Plan:</strong> <em>Free</em> – Delivery in <strong>7 days</strong> with <strong>1 monthly point</strong>.
            </li>
            <li>
              <strong>Prompt Plan:</strong> <em>Paid</em> – Delivery in <strong>3 days</strong> with <strong>3 monthly points</strong>.
            </li>
          </ul>
        </div>

        <div className="about-section">
          <h2>💡 Our Mission</h2>
          <p>
            Everyone has ideas. But not everyone knows how to bring them to life. At MySelpost, we believe in empowering creators of all skill levels by offering
            handcrafted builds, delivered with love — no coding knowledge required.
          </p>
        </div>

        <div className="about-footer">
          <p>Got an idea? Let’s build it together.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
