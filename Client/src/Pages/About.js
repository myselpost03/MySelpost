import React from "react";
import Header from "../Components/Header";
import "../Styles/About.css";

const ABOUT_CONTENT = [
  {
    title: "🚀 What We Do",
    content:
      "We specialize in turning hand-drawn sketches or text prompts into fully functional digital products. Every creation is custom-built by AI with care and precision.",
  },
  {
    title: "🛠️ How It Works",
    content: (
      <>
        1. <strong>Sketch or Prompt:</strong> Submit your idea in the form of a
        rough sketch or a simple description.
        <br />
        2. <strong>We Build It:</strong> We begin development using AI, ensuring
        every detail reflects your original vision.
        <br />
        3. <strong>Delivery:</strong> You get progress updates and the final
        product within your selected timeline.
      </>
    ),
  },
  {
    title: "💳 Plans & Delivery",
    content: (
      <ul>
        <li>
          <strong>Sketch Plan:</strong> <em>Free</em> – Delivery in{" "}
          <strong>72 hours</strong> with <strong>1 monthly point</strong>.
        </li>
        <li>
          <strong>Prompt Plan:</strong> <em>Paid</em> – Delivery in{" "}
          <strong>48 hours</strong> with <strong>3 monthly points</strong>.
        </li>
        <li>
          <strong>Business Plan:</strong> <em>Paid</em> – Delivery in{" "}
          <strong>24 hours</strong> with <strong>5 monthly points</strong>.
        </li>
      </ul>
    ),
  },
  {
    title: "💡 Our Mission",
    content:
      "Everyone has ideas. But not everyone knows how to bring them to life. At MySelpost, we believe in empowering creators of all skill levels by offering handcrafted builds, delivered with love — no coding knowledge required.",
  },
];

const About = () => (
  <div className="about-page">
    <Header />
    <div className="about-content">
      <h1>Welcome to MySelpost</h1>
      <p className="intro-text">
        <strong>MySelpost</strong> is your personal digital builder — where your
        ideas, no matter how rough, are transformed into polished websites or
        apps by hand.
      </p>

      {ABOUT_CONTENT.map((section, index) => (
        <div key={index} className="about-section">
          <h2>{section.title}</h2>
          {typeof section.content === "string" ? (
            <p>{section.content}</p>
          ) : (
            section.content
          )}
        </div>
      ))}

      <div className="about-footer">
        <p>Got an idea? Let's build it together.</p>
      </div>
    </div>
  </div>
);

export default React.memo(About);
