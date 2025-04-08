import React from "react";
import Header from "../Components/Header";
import "../Styles/Privacy.css";

const Privacy = () => {
  return (
    <div className="privacy-page">
      <Header />
      <div className="privacy-container">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last updated: April 7, 2025</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            MySelpost respects your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our services.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>
            We may collect information such as your name, email address, and the content you submit (e.g. sketches or prompts). We also collect technical data like browser type, IP address, and usage logs.
          </p>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>
            We use your data to:
          </p>
          <ul>
            <li>Deliver app and website builds based on your input</li>
            <li>Improve our services and user experience</li>
            <li>Send project updates and important notifications</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Protection</h2>
          <p>
            Your data is stored securely, and we do not sell or share it with third parties. All sensitive data is encrypted or anonymized.
          </p>
        </section>

        <section>
          <h2>5. Cookies</h2>
          <p>
            We use cookies to manage sessions, remember preferences, and track referral bonuses. You can disable cookies in your browser settings.
          </p>
        </section>

        <section>
          <h2>6. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information. To request changes, contact us at <a href="mailto:myselpost03@gmail.com">myselpost03@gmail.com</a>.
          </p>
        </section>

        <section>
          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy occasionally. Significant changes will be announced on our website or via email.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
