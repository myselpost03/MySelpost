import React, { useState } from 'react';
import '../Styles/TermsPopup.css';

export default function AudioTermsSlider({ onAccept }) {
  const termsSliders = [
    {
      title: 'Respect Privacy',
      text: 'Do not record or share audio without consent.',
    },
    {
      title: 'No Offensive Content',
      text: 'Audio messages should be polite and free from offensive language.',
    },
    {
      title: 'No Spam',
      text: 'Avoid sending repetitive or promotional audio messages.',
    },
    {
      title: 'Keep It Clear',
      text: 'Ensure your audio is understandable and concise.',
    },
    {
      title: 'No Harassment',
      text: 'Harassment or threats via audio are strictly prohibited.',
    },
    {
      title: 'Cultural Sensitivity',
      text: 'Be mindful of cultural differences in tone or content.',
    },
    {
      title: 'No Sensitive Info',
      text: 'Do not share personal or financial information in audio.',
    },
    {
      title: 'Legal Compliance',
      text: 'Audio content must comply with all local laws.',
    },
    {
      title: 'Appropriate Length',
      text: 'Keep audio messages reasonably short for better experience.',
    },
    {
      title: 'Background Noise',
      text: 'Avoid excessive background noise for clarity.',
    },
    {
      title: "Respect Others' Time",
      text: 'Do not send audio messages excessively.',
    },
    {
      title: 'No Threatening Content',
      text: 'Threats or intimidation in audio are prohibited.',
    },
    {
      title: 'No Impersonation',
      text: 'Do not impersonate others in audio messages.',
    },
    {
      title: 'Respect Age Limits',
      text: 'Ensure recipients are of appropriate age to receive audio content.',
    },
    {
      title: 'Consent for Recording',
      text: 'Obtain consent before recording anyone else.',
    },
    {
      title: 'No Misinformation',
      text: 'Do not spread false or misleading information in audio.',
    },
    {
      title: 'Report Abuse',
      text: 'Report abusive or inappropriate audio messages.',
    },
    {
      title: 'Platform Monitoring',
      text: 'Audio messages may be monitored for safety and compliance.',
    },
    {
      title: 'No Commercial Solicitation',
      text: 'Avoid selling or promoting products/services via audio.',
    },
    {
      title: 'Final Agreement',
      text: 'By sending audio, you agree to follow all communication rules.',
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
