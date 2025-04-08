import React from "react";
import Header from "../Components/Header";
import "../Styles/Terms.css";

const Terms = () => {
  return (
    <div className="terms-page">
      <Header />
      <div className="terms-container">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last updated: April 7, 2025</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using MySelpost, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, please do not use the service.
          </p>
        </section>

        <section>
          <h2>2. Use of Service</h2>
          <p>
            You may use MySelpost to submit sketches or prompts to receive app or website builds. Free plans are limited to one monthly sketch and subject to 20-day delivery. Paid plans may offer faster delivery and more submissions.
          </p>
        </section>

        <section>
          <h2>3. Intellectual Property</h2>
          <p>
            You retain all rights to the ideas you submit. We do not claim ownership. However, by submitting, you grant us permission to build and deliver the product based on your submission.
          </p>
        </section>

        <section>
          <h2>4. User Responsibilities</h2>
          <p>
            You agree not to submit illegal, offensive, or copyrighted content without permission. We reserve the right to reject or remove submissions at our discretion.
          </p>
        </section>

        <section>
          <h2>5. Modifications</h2>
          <p>
            We reserve the right to update these Terms at any time. We'll notify users of significant changes via the website or email.
          </p>
        </section>

        <section>
          <h2>6. Contact</h2>
          <p>
            If you have questions about these Terms, please contact us at <a href="mailto:myselpost03@gmail.com">myselpost03@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
