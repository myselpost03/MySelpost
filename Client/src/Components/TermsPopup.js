import React, { useState } from "react";
import "../Styles/TermsPopup.css";

const termsSlides = [
  {
    title: "Welcome to ChatZone",
    text: "Before you begin chatting, please take a moment to review our Terms of Service. These ensure a safe, respectful, and enjoyable environment for everyone.",
  },
  {
    title: "Respectful Communication",
    text: "Do not use abusive, threatening, or discriminatory language. Treat all users with kindness and respect.",
  },
  {
    title: "No Harassment or Bullying",
    text: "Harassment, hate speech, or bullying of any kind is strictly prohibited. Violations may result in immediate account restrictions.",
  },
  {
    title: "Privacy Matters",
    text: "Do not share or request sensitive personal information. Protect your privacy and that of others.",
  },
  {
    title: "No Spam or Advertising",
    text: "Avoid sending repetitive, promotional, or irrelevant content. This includes unsolicited ads or external links.",
  },
  {
    title: "Stay Safe",
    text: "We encourage you to use caution when interacting online. Report any suspicious or unsafe behavior to moderators immediately.",
  },
  {
    title: "Respect Platform Rules",
    text: "Follow all posted community guidelines and platform-specific rules to ensure a positive chat environment.",
  },
  {
    title: "No Illegal Activity",
    text: "Do not use this platform for any illegal, harmful, or malicious purposes. Violators may be reported to authorities.",
  },
  {
    title: "Content Ownership",
    text: "You retain ownership of your messages but grant the platform a license to display and moderate them as needed for safety and compliance.",
  },
  {
    title: "Agreement",
    text: "By clicking Done, you acknowledge that you’ve read, understood, and agree to these Terms of Service. Enjoy chatting responsibly!",
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

    const script = document.createElement("script");
    script.dataset.zone = zoneId;
    script.src = "https://groleegni.net/vignette.min.js";
    script.async = true;

    document.body.appendChild(script);
  };

  // Wait for ad to render visually
  const waitForAdToRender = (timeout = 10000) => {
    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        // Adjust selector to match your ad element
        const adElement = document.querySelector("iframe, .adsbygoogle, .vignette-ad");
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

const nextSlide = async () => {
  // Define which slides trigger which ads
  const adZones = {
    0: "10136263",   
    1: "9916729",    
    2: "10054592",   
    3: "10148445",
    4: "10148454",
    5: "10148455",
    6: "10148458",
    7: "10148459",
    8: "10148460",
    9: "10148461",
  };

  if (adZones[slide]) {
    setLoadingAd(true);

    // Load script for this slide's ad
    loadAdScript(adZones[slide]);

    // Wait for it to visually appear
    await waitForAdToRender();

    setLoadingAd(false);
  }

  if (slide < termsSlides.length - 1) {
    setSlide(slide + 1);
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
            {loadingAd
              ? <div className="terms-popup-spinner"></div>
              : slide === termsSlides.length - 1
              ? "Done"
              : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
