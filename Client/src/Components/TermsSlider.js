import React, { useState } from 'react';
import '../Styles/TermsPopup.css';

export default function TermsSlider({ onAccept }) {
  const termsSliders = [
    {
      title: 'Chat With Foreigner',
      text: 'All messages must remain respectful and polite when communicating with foreigners.',
    },
    {
      title: 'No Hate Speech',
      text: 'Racism, discrimination, or hate speech toward any nationality is strictly prohibited.',
    },
    {
      title: 'Language Responsibility',
      text: 'Users are responsible for the clarity and intent of their messages.',
    },
    {
      title: 'No Harassment',
      text: 'Harassment, threats, or abusive language is not allowed.',
    },
    {
      title: 'Cultural Awareness',
      text: 'Respect cultural norms and differences when messaging foreign users.',
    },
    {
      title: 'No Illegal Content',
      text: 'Messages must not include illegal activities or instructions.',
    },
    {
      title: 'Translation Accuracy',
      text: 'Automatic translations may be inaccurate; verify before sending.',
    },
    {
      title: 'No Scams',
      text: 'Fraudulent behavior or scams toward foreign users are forbidden.',
    },
    {
      title: 'Privacy Protection',
      text: 'Do not request or share sensitive personal or financial information.',
    },
    {
      title: 'No Explicit Content',
      text: 'Sexual or inappropriate content is not permitted.',
    },
    {
      title: 'Age Compliance',
      text: 'Ensure compliance with international age-related laws.',
    },
    {
      title: 'No Political Manipulation',
      text: 'Political manipulation or propaganda is prohibited.',
    },
    {
      title: 'No Spam',
      text: 'Sending spam or promotional messages is not allowed.',
    },
    {
      title: 'Respect Time Zones',
      text: 'Be considerate of different time zones.',
    },
    {
      title: 'No Misinformation',
      text: 'Do not intentionally spread false or misleading information.',
    },
    {
      title: 'Report Abuse',
      text: 'Report abusive behavior immediately through the platform.',
    },
    {
      title: 'Platform Monitoring',
      text: 'Messages may be monitored for safety and compliance.',
    },
    {
      title: 'No Impersonation',
      text: 'Impersonating people or organizations is forbidden.',
    },
    {
      title: 'Consent Matters',
      text: 'Ensure the other party is comfortable continuing the conversation.',
    },
    {
      title: 'Final Agreement',
      text: 'By continuing, you agree to follow all communication rules.',
    },
  ];

  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openedLinks, setOpenedLinks] = useState({}); // track which slides already opened the link

  const isLast = index === termsSliders.length - 1;

  const handleNext = () => {
    if (isLast) {
      onAccept?.();
      return;
    }

    // If link not opened yet for this slide
    if (!openedLinks[index]) {
      setLoading(true);
      const link = 'https://otieu.com/4/10380848';

      // Open in new tab
      window.open(link, '_blank');

      // Mark as opened
      setOpenedLinks((prev) => ({ ...prev, [index]: true }));

      // Simulate short loading pause
      setTimeout(() => {
        setLoading(false);
        setIndex((prev) => prev + 1);
      }, 2000);
    } else {
      // Link already opened → just move to next slide
      setIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="terms-overlay">
      <div className="terms-popup">
        <div className="terms-title">{termsSliders[index].title}</div>

        <div className="terms-text">{termsSliders[index].text}</div>

        {loading && (
          <div
            className="terms-popup-spinner"
            style={{ marginBottom: '1rem' }}
          />
        )}

        <div className="terms-footer">
          <div className="slide-indicator">
            {index + 1} / {termsSliders.length}
          </div>

          <button
            className="terms-button"
            onClick={handleNext}
            disabled={loading} // prevent clicking during spinner
          >
            {isLast ? 'Accept' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
