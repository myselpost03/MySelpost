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
            Your privacy is important to us. This Privacy Policy explains how we
            collect, use, store, and protect your information when you use our
            services. By using our platform (including the social networking
            site and the sketch-to-app builder tool), you agree to the terms
            described below.
          </p>

          <h2 className="privacy-subtitle">Information We Collect</h2>
          <p className="privacy-text">
            We collect the following information to provide, maintain, and
            improve our services:
          </p>
          <ul className="privacy-list">
            <li>
              <strong className="privacy-subtitle">User registration:</strong>{" "}
              We use Google Sign-In only for account creation and
              authentication. We do not access your contacts, emails, or other
              personal Google data beyond what is necessary to register and log
              you in.
            </li>
            <li>
              <strong className="privacy-subtitle">
                User-generated content:
              </strong>{" "}
              Comments, posts, messages, and photos shared on the social
              networking service. Videos are not collected.
            </li>
            <li>
              <strong className="privacy-subtitle">
                Sketch-to-app tool data:
              </strong>{" "}
              Text descriptions, labels, and other information you provide when
              creating or generating app designs. These are processed only to
              generate the requested output.
            </li>
            <li>
              <strong className="privacy-subtitle">Usage data:</strong> Login
              times, pages visited, actions taken within the platform, and
              session duration to help us analyze trends and improve features.
            </li>
            <li>
              <strong className="privacy-subtitle">
                Device and technical data:
              </strong>{" "}
              IP address (used only to determine your country/region), browser
              type, and operating system.
            </li>
            <li>
              <strong className="privacy-subtitle">LocalStorage:</strong> We use
              localStorage to save your preferences and enhance your experience.
              We do not use cookies for tracking at this time.
            </li>
            <li>
              <strong className="privacy-subtitle">Other information:</strong>{" "}
              Any data you voluntarily provide, such as feedback or suggestions,
              to improve our services.
            </li>
          </ul>

          <h2 className="privacy-subtitle">How We Use Your Information</h2>
          <p className="privacy-text">
            The information we collect is used for the following purposes:
          </p>
          <ul className="privacy-list">
            <li>To provide, operate, and maintain our services.</li>
            <li>To improve functionality, features, and user experience.</li>
            <li>
              To process inputs in the sketch-to-app builder tool and generate
              outputs.
            </li>
            <li>To personalize content and remember your preferences.</li>
            <li>
              To communicate important updates, changes, or security notices.
            </li>
            <li>To prevent fraudulent or unauthorized activity.</li>
          </ul>
          <p className="privacy-text">
            We do not sell, rent, or trade your personal information to third
            parties.
          </p>

          <h2 className="privacy-subtitle">Google Analytics</h2>
          <p className="privacy-text">
            We use Google Analytics to understand how users interact with our
            site and improve performance. Google Analytics may collect data such
            as your IP address, device type, browser version, and the pages you
            visit. This information is used in aggregate form to improve user
            experience and is not linked to your personal identity. You can opt
            out of Google Analytics tracking through your browser settings or
            using the Google Analytics opt-out browser add-on.
          </p>

          <h2 className="privacy-subtitle">Age Restrictions</h2>
          <p className="privacy-text">
            Our services are intended for users aged 13 and above. We do not
            knowingly collect personal data from children under 13. If we become
            aware that we have collected information from a child under 13, we
            will take steps to remove such data promptly. Parents or guardians
            may contact us to request deletion of their child’s information.
          </p>

          <h2 className="privacy-subtitle">Future Advertising</h2>
          <p className="privacy-text">
            While we do not currently display advertisements, we may in the
            future use third-party advertising services such as Google AdSense.
            These services may use cookies or similar tracking technologies to
            deliver personalized ads and measure effectiveness. Any changes
            regarding advertising practices will be updated in this Privacy
            Policy, and users will be notified where legally required.
          </p>

          <h2 className="privacy-subtitle">Cookies & Tracking</h2>
          <p className="privacy-text">
            Our website does not currently use cookies. Instead, we use
            localStorage and similar browser-based technologies to persist user
            activity, preferences, and login state. If in the future we adopt
            cookies or other tracking methods for advertising or analytics, this
            Privacy Policy will be updated accordingly.
          </p>

          <h2 className="privacy-subtitle">Data Retention</h2>
          <p className="privacy-text">
            We retain your personal information only as long as necessary to
            provide you with our services and fulfill the purposes described in
            this Privacy Policy. Data related to your account will be stored
            until you delete your account or request removal. Some aggregated or
            anonymized data may be retained for analytics and security purposes.
          </p>

          <h2 className="privacy-subtitle">Data Security</h2>
          <p className="privacy-text">
            We implement reasonable technical and organizational measures to
            protect your information from unauthorized access, disclosure,
            alteration, or destruction. While no system is completely secure, we
            strive to protect your data using industry best practices. Users are
            also responsible for safeguarding their login credentials.
          </p>

          <h2 className="privacy-subtitle">Your Rights</h2>
          <p className="privacy-text">
            Depending on your region, you may have rights regarding your
            personal information, such as:
          </p>
          <ul className="privacy-list">
            <li>Requesting access to the data we hold about you.</li>
            <li>
              Requesting corrections to inaccurate or incomplete information.
            </li>
            <li>Requesting deletion of your account and associated data.</li>
            <li>
              Objecting to certain processing activities, including marketing.
            </li>
          </ul>
          <p className="privacy-text">
            To exercise these rights, please contact us directly using the
            details below.
          </p>

          <h2 className="privacy-subtitle">Third-Party Services</h2>
          <p className="privacy-text">
            In addition to Google Analytics and (future) Google AdSense, we may
            rely on other third-party providers for hosting, security, or
            service optimization. These providers may have access to limited
            information solely for the purpose of performing services on our
            behalf and are obligated not to disclose or use it for other
            purposes.
          </p>

          <h2 className="privacy-subtitle">Changes to this Privacy Policy</h2>
          <p className="privacy-text">
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page, and where appropriate, users will be
            notified by email or through a notice on our platform. Continued use
            of our services after updates means you accept the revised policy.
          </p>

          <h2 className="privacy-subtitle">Contact Us</h2>
          <p className="privacy-text">
            If you have any questions, concerns, or requests regarding this
            Privacy Policy, please contact us at{" "}
            <strong>myselpost03@gmail.com</strong>.
          </p>
        </div>
      </div>
    </>
  );
};

export default Privacy;
