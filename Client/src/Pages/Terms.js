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
            Welcome to our platform. We provide two services: a social
            networking site for users to connect, and a sketch-to-app builder
            tool that allows you to create app designs from your sketches or
            text. By accessing or using either service, you agree to be bound by
            these Terms of Service. If you do not agree, please discontinue use
            of our platform immediately. These terms apply to all visitors,
            users, and others who access or use the services.
          </p>

          <h2 className="privacy-subtitle">1. Use of Service</h2>
          <p className="privacy-text">
            You agree to use the platform only for lawful purposes and in a
            manner that does not infringe the rights of others. You are
            responsible for your account and any content you post, including
            comments, posts, messages, photos, and any sketches or text you
            submit to the app builder tool. Our services are intended for users
            aged 13 and above. By using the platform, you confirm that you meet
            this age requirement.
          </p>

          <h2 className="privacy-subtitle">2. User-Generated Content</h2>
          <p className="privacy-text">
            You retain ownership of the content you create. However, by posting
            or submitting content, you grant us a worldwide, non-exclusive,
            royalty-free license to use, display, and distribute your content
            within the platform for the purposes of providing and improving our
            services. This license is limited to what is necessary for operating
            the platform and does not give us ownership of your work.
          </p>
          <p className="privacy-text">
            You agree not to submit videos, copyrighted material without
            permission, or any content that is illegal, offensive, or harmful.
            We reserve the right to remove or restrict content at our discretion
            if it violates these terms or applicable law.
          </p>

          <h2 className="privacy-subtitle">3. Account Security</h2>
          <p className="privacy-text">
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account. We use Google Sign-In for registration and login to enhance
            security and user convenience. If you suspect unauthorized access to
            your account, you must notify us immediately. We will not be liable
            for any loss or damage resulting from your failure to maintain the
            confidentiality of your login details.
          </p>

          <h2 className="privacy-subtitle">4. Prohibited Activities</h2>
          <p className="privacy-text">
            You may not misuse our services. Examples of prohibited activities
            include, but are not limited to:
          </p>
          <ul className="privacy-list">
            <li>Spamming, phishing, or sending unsolicited messages.</li>
            <li>
              Uploading viruses, malware, or harmful code that could damage the
              platform or users’ devices.
            </li>
            <li>Harassment, bullying, or abusive behavior toward others.</li>
            <li>
              Attempting to gain unauthorized access to accounts, systems, or
              networks.
            </li>
            <li>
              Submitting misleading, harmful, or illegal sketches or text in the
              app builder tool.
            </li>
            <li>
              Copying, reselling, or redistributing parts of the platform
              without prior written permission.
            </li>
          </ul>

          <h2 className="privacy-subtitle">5. Intellectual Property</h2>
          <p className="privacy-text">
            All rights, titles, and interests in the platform itself—including
            software, design, trademarks, and logos—are owned by us or our
            licensors. You may not reproduce, modify, or distribute our
            intellectual property without prior authorization. You retain rights
            to your own uploaded content, subject to the license granted under
            Section 2.
          </p>

          <h2 className="privacy-subtitle">6. Limitation of Liability</h2>
          <p className="privacy-text">
            Our services are provided on an "as is" and "as available" basis. We
            do not warrant that the platform will be error-free, uninterrupted,
            secure, or that generated app outputs will meet specific
            requirements. The sketch-to-app builder tool is experimental and may
            not always generate accurate or functional results.
          </p>
          <p className="privacy-text">
            To the maximum extent permitted by law, we are not liable for any
            indirect, incidental, or consequential damages arising from your use
            of the platform, including user-generated content, app builder
            outputs, interactions with other users, or third-party links.
          </p>

          <h2 className="privacy-subtitle">7. Termination of Accounts</h2>
          <p className="privacy-text">
            We may suspend or terminate your account at any time if we believe
            you have violated these Terms of Service or engaged in harmful
            behavior. You may also request deletion of your account at any time
            by contacting us. Upon termination, your right to use the platform
            will immediately cease.
          </p>

          <h2 className="privacy-subtitle">8. Changes to Terms</h2>
          <p className="privacy-text">
            We may update these Terms of Service from time to time to reflect
            changes in our practices, services, or legal requirements. Any
            significant changes will be communicated to users, and continued use
            of the platform after updates indicates acceptance of the revised
            terms.
          </p>

          <h2 className="privacy-subtitle">9. Governing Law</h2>
          <p className="privacy-text">
            These Terms of Service shall be governed by and construed in
            accordance with the laws of your jurisdiction. Any disputes arising
            under or in connection with these terms will be subject to the
            exclusive jurisdiction of the courts located in your country or
            region.
          </p>

          <h2 className="privacy-subtitle">10. Contact Us</h2>
          <p className="privacy-text">
            If you have any questions about these terms, please contact us at
            myselpost03@gmail.com.
          </p>
        </div>
      </div>
    </>
  );
};

export default Terms;
