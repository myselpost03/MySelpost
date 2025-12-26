import React, { useState } from 'react';
import '../Styles/TermsPopup.css';

const termsSlides = [
  {
    title: 'Welcome to ChatZone',
    text: 'Before you begin chatting, please take a moment to review our Terms of Service. These ensure a safe, respectful, and enjoyable environment for everyone.',
  },
  {
    title: 'Respectful Communication',
    text: 'Do not use abusive, threatening, or discriminatory language. Treat all users with kindness and respect.',
  },
  {
    title: 'No Harassment or Bullying',
    text: 'Harassment, hate speech, or bullying of any kind is strictly prohibited. Violations may result in immediate account restrictions.',
  },
  {
    title: 'Privacy Matters',
    text: 'Do not share or request sensitive personal information. Protect your privacy and that of others.',
  },
  {
    title: 'No Spam or Advertising',
    text: 'Avoid sending repetitive, promotional, or irrelevant content. This includes unsolicited ads or external links.',
  },
  {
    title: 'Stay Safe',
    text: 'We encourage you to use caution when interacting online. Report any suspicious or unsafe behavior to moderators immediately.',
  },
  {
    title: 'Respect Platform Rules',
    text: 'Follow all posted community guidelines and platform-specific rules to ensure a positive chat environment.',
  },
  {
    title: 'No Illegal Activity',
    text: 'Do not use this platform for any illegal, harmful, or malicious purposes. Violators may be reported to authorities.',
  },
  {
    title: 'Content Ownership',
    text: 'You retain ownership of your messages but grant the platform a license to display and moderate them as needed for safety and compliance.',
  },

  // Additional 20 Items
  {
    title: 'Age Requirement',
    text: 'You must meet the minimum age requirement set by your region to use this platform. Underage users may have accounts restricted or removed.',
  },
  {
    title: 'No Impersonation',
    text: 'Do not impersonate any person, group, or entity. Misleading identities can result in account suspension.',
  },
  {
    title: 'Accurate Information',
    text: 'Provide truthful and accurate information when required. Misrepresentation may harm others and the platform community.',
  },
  {
    title: 'Report Violations',
    text: 'If you witness rule violations, please report them. Community safety relies on collective awareness and responsibility.',
  },
  {
    title: 'No NSFW Content',
    text: 'Sexually explicit, graphic, or pornographic content is not allowed. Keep interactions appropriate for a general audience.',
  },
  {
    title: 'No Self-Harm Encouragement',
    text: 'Content promoting or encouraging self-harm, suicide, or violence is strictly forbidden.',
  },
  {
    title: 'Supportive Interactions',
    text: 'Aim to be understanding and supportive. Many users may be here to connect or seek positive interactions.',
  },
  {
    title: 'Language Consideration',
    text: 'Be mindful of language differences. Avoid miscommunication and be patient with non-native speakers.',
  },
  {
    title: 'Reporting Bugs',
    text: 'If you encounter technical issues, report them to help improve the platform experience for everyone.',
  },
  {
    title: 'Moderation Rights',
    text: 'Moderators may delete messages, restrict accounts, or issue warnings to maintain community safety.',
  },
  {
    title: 'Inclusive Environment',
    text: 'We welcome users from all backgrounds. Respect differences in culture, identity, and belief.',
  },
  {
    title: 'Constructive Feedback',
    text: 'Feedback should be polite and helpful. Avoid insults or negative criticism directed at individuals.',
  },
  {
    title: 'No Malware or Harmful Links',
    text: 'Sharing links that contain viruses, spyware, or malicious content is strictly prohibited.',
  },
  {
    title: 'Responsible Sharing',
    text: 'Think before sharing content. Ensure what you post is accurate, helpful, and appropriate.',
  },
  {
    title: 'Temporary Restrictions',
    text: 'Accounts may be temporarily limited if behavior is flagged for review. This helps maintain fairness in moderation.',
  },
  {
    title: 'Appeals Process',
    text: 'If moderation action is taken on your account, you may appeal it through official support channels.',
  },
  {
    title: 'Platform Updates',
    text: 'Rules and features may change over time. Stay informed by checking announcements and update logs.',
  },
  {
    title: 'Your Agreement',
    text: 'By using this platform, you agree to follow these guidelines. Continued use signifies ongoing acceptance.',
  },
];

export default function TermsPopup({ onDone }) {
  const [slide, setSlide] = useState(0);
  const [loadingAd, setLoadingAd] = useState(false);

  // Load ad script normally
  const loadAdScript = (zoneId) => {
    // Remove existing script for same zone
    const oldScript = document.querySelector(`script[data-zone="${zoneId}"]`);
    if (oldScript) oldScript.remove();

    const script = document.createElement('script');
    script.dataset.zone = zoneId;
    script.src = 'https://groleegni.net/vignette.min.js';
    script.async = true;

    document.body.appendChild(script);
  };

  // Wait for ad to render visually
  const waitForAdToRender = (timeout = 10000) => {
    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        // Adjust selector to match your ad element
        const adElement = document.querySelector(
          'iframe, .adsbygoogle, .vignette-ad'
        );
        if (adElement && adElement.offsetHeight > 0) {
          observer.disconnect();
          resolve();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      // fallback in case ad never appears
      setTimeout(() => {
        observer.disconnect();
        resolve();
      }, timeout);
    });
  };
  const TOTAL_ADS = 10;
  const AD_ZONE_IDS = [
    '10376761',
    '10376762',
    '10376765',
    '10376766',
    '10148454',
    '10148455',
    '10148458',
    '10148459',
    '10148460',
    '10148461',
  ];

  // Calculate 10 evenly spaced slide positions to show ads
  const adSlidePositions = Array.from({ length: TOTAL_ADS }, (_, i) =>
    Math.floor(((i + 1) * termsSlides.length) / (TOTAL_ADS + 1))
  );

  const nextSlide = async () => {
    const nextIndex = slide + 1;

    // Check if next slide should show an ad
    const adIndex = adSlidePositions.indexOf(nextIndex);

    if (adIndex !== -1) {
      setLoadingAd(true);

      // Load ad zone for this scheduled ad position
      loadAdScript(AD_ZONE_IDS[adIndex]);

      // Wait for the ad to display
      await waitForAdToRender();

      setLoadingAd(false);
    }

    if (slide < termsSlides.length - 1) {
      setSlide(nextIndex);
    } else if (onDone) {
      onDone();
    }
  };

  return (
    <div className="terms-overlay">
      <div className="terms-popup">
        <h2 className="terms-title">{termsSlides[slide].title}</h2>
        <p className="terms-text">{termsSlides[slide].text}</p>

        <div className="terms-footer">
          <span className="slide-indicator">
            {slide + 1} / {termsSlides.length}
          </span>
          <button
            className="terms-button"
            onClick={nextSlide}
            disabled={loadingAd}
          >
            {loadingAd ? (
              <div className="terms-popup-spinner"></div>
            ) : slide === termsSlides.length - 1 ? (
              'Done'
            ) : (
              'Next'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
