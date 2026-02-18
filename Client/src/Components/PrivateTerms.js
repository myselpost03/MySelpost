import React, { useState } from 'react';
import '../Styles/TermsPopup.css';

export default function PrivateTerms({ onAccept }) {
  const termsSliders = [
    {
      title: 'Usage Agreement',
      text: 'By using this service, you agree to access private profile data for personal viewing purposes only.',
    },
    {
      title: 'User Anonymity',
      text: 'Our platform ensures your identity remains 100% hidden. The targeted user will never be notified of your request.',
    },
    {
      title: 'No Data Redistribution',
      text: 'You agree not to download, screenshot, or share the content retrieved from private accounts on other social platforms.',
    },
    {
      title: 'Privacy Respect',
      text: 'While viewing private posts, you agree to respect the individual’s privacy and avoid any form of online stalking.',
    },
    {
      title: 'No Harassment',
      text: 'Information obtained through this portal must not be used to harass, threaten, or bully the profile owner.',
    },
    {
      title: 'Compliance with Laws',
      text: 'Users are responsible for ensuring their actions comply with local and international digital privacy laws.',
    },
    {
      title: 'Fair Usage Policy',
      text: 'To prevent system abuse, users are limited to 3 private profile requests per 24-hour period.',
    },
    {
      title: 'No Account Access',
      text: 'We do not require your Instagram password or login details. Never share your credentials with third-party tools.',
    },
    {
      title: 'Verification Requirements',
      text: 'Due to high demand, users may be required to complete a security check or wait in a queue to access data.',
    },
    {
      title: 'Automated Processing',
      text: 'Your request is processed by an automated system. Please allow time for the queue to clear.',
    },
    {
      title: 'Content Accuracy',
      text: 'We aim to provide the most recent posts and stories available from the targeted profile’s cache.',
    },
    {
      title: 'Service Limitations',
      text: 'This tool is for educational and investigative purposes only. We do not guarantee 24/7 uptime.',
    },
    {
      title: 'No Commercial Use',
      text: 'Using retrieved data for commercial gain, advertising, or marketing is strictly prohibited.',
    },
    {
      title: 'Security Protocols',
      text: 'Our systems use end-to-end protection to ensure your search history is deleted immediately after the session.',
    },
    {
      title: 'Responsible Viewing',
      text: 'Please use the "Instant Unlock" feature responsibly to support the maintenance of our servers.',
    },
    {
      title: 'Queue System',
      text: 'Free users are placed in a global queue. Position is determined by server load and traffic volume.',
    },
    {
      title: 'Ethical Standards',
      text: 'By proceeding, you confirm that you have a legitimate reason for viewing the requested profile.',
    },
    {
      title: 'Data Deletion',
      text: 'All unlocked profile images are temporary and will be cleared from our cache after 30 minutes.',
    },
    {
      title: 'Final Disclaimer',
      text: 'We are not affiliated with Instagram or Meta. This is an independent research and viewing tool.',
    },
    {
      title: 'Agreement Confirmation',
      text: 'By clicking Accept, you confirm that you have read and agreed to all the terms listed above.',
    },
  ];

  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openedLinks, setOpenedLinks] = useState({});

  const isLast = index === termsSliders.length - 1;

  const handleNext = () => {
    if (isLast) {
      onAccept?.();
      return;
    }

    if (!openedLinks[index]) {
      setLoading(true);
      const link = 'https://otieu.com/4/10380848';
      window.open(link, '_blank');

      setOpenedLinks((prev) => ({ ...prev, [index]: true }));

      // --- Professional Delay Logic ---
      // Generate a random delay between 3500ms and 5000ms for a "processing" feel
      const professionalDelay = Math.floor(Math.random() * 1500) + 3500;

      setTimeout(() => {
        setLoading(false);
        setIndex((prev) => prev + 1);
      }, professionalDelay);
    } else {
      // Small 800ms "validation" delay even if link was already opened
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setIndex((prev) => prev + 1);
      }, 800);
    }
  };

  return (
    <div className="terms-overlay">
      <div className="terms-popup">
        <div className="terms-title">{termsSliders[index].title}</div>

        {/* Added a dynamic status message to explain the slow loading */}
        <div className="terms-text">
          {loading
            ? 'Verifying compliance with server protocols...'
            : termsSliders[index].text}
        </div>

        {loading && (
          <div className="loading-container">
            <div className="terms-popup-spinner" />
            <span className="sync-text">Syncing...</span>
          </div>
        )}

        <div className="terms-footer">
          <div className="slide-indicator">
            STEP {index + 1} / {termsSliders.length}
          </div>

          <button
            className={`terms-button ${loading ? 'btn-disabled' : ''}`}
            onClick={handleNext}
            disabled={loading}
          >
            {isLast ? 'ACCEPT & UNLOCK' : 'NEXT STEP'}
          </button>
        </div>
      </div>
    </div>
  );
}
