import React, { useState, useRef, useEffect } from 'react';
import '../Styles/QuizPopup.css';

const terms = [
  { id: 1, text: "I certify that I am at least 18 years of age (or the legal age of majority in my jurisdiction).", options: ["I Agree", "Exit"] },
  { id: 2, text: "You agree that all content viewed is for personal, non-commercial use only.", options: ["Accept", "Decline"] },
  { id: 3, text: "I understand this site contains sexually explicit material and I wish to proceed.", options: ["Yes, Proceed", "No, Leave"] },
  { id: 4, text: "Users must respect the 'Consent' policy: Non-consensual content is strictly prohibited.", options: ["I Understand", "Report Info"] },
  { id: 5, text: "I agree not to record, download, or redistribute any live or premium content.", options: ["Agree", "Cancel"] },
  { id: 6, text: "Accounts found sharing login credentials will be permanently banned without refund.", options: ["Acknowledge", "Read More"] },
  { id: 7, text: "I accept that my browsing data is handled according to the Privacy & Cookie Policy.", options: ["Accept All", "Preferences"] },
  { id: 8, text: "Harassment, hate speech, or bullying of performers is grounds for immediate termination.", options: ["I Comply", "Exit"] },
  { id: 9, text: "I understand that some interactions may involve third-party billing services.", options: ["Continue", "Details"] },
  { id: 10, text: "You agree to maintain the confidentiality of your account password and security.", options: ["I Agree", "Reset Password"] },
  { id: 11, text: "I verify that I am accessing this site from a private and secure location.", options: ["Verified", "Not Secure"] },
  { id: 12, text: "I understand that credit card statements may show a discrete billing descriptor.", options: ["Acknowledge", "Billing FAQ"] },
  { id: 13, text: "Users must report any suspected illegal or underage content immediately.", options: ["I Will Report", "Help Center"] },
  { id: 14, text: "I agree to the Digital Millennium Copyright Act (DMCA) notice and takedown policy.", options: ["Accept", "View DMCA"] },
  { id: 15, text: "Automated scraping or 'ripping' of site content is strictly forbidden.", options: ["I Agree", "Decline"] },
  { id: 16, text: "I understand that certain features may require additional identity verification.", options: ["Agree", "Learn Why"] },
  { id: 17, text: "I accept that the site is not responsible for external links to third-party sites.", options: ["Proceed", "Go Back"] },
  { id: 18, text: "Refunds for digital tokens or premium access are subject to the Refund Policy.", options: ["Understood", "View Policy"] },
  { id: 19, text: "I agree to treat all creators and performers with professional courtesy.", options: ["I Promise", "Exit"] },
  { id: 20, text: "By clicking below, I confirm I have read and accepted all 20 sections of these terms.", options: ["Finalize & Enter", "Cancel"] }
];

const QuizPopup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const adShowRef = useRef(null);

  useEffect(() => {
    if (window.initCdTma) {
      window.initCdTma({ id: '6115107' })
        .then((show) => { adShowRef.current = show; })
        .catch((e) => console.error('Ad Init Error:', e));
    }
  }, []);

  const triggerAd = async (onSuccess) => {
    if (typeof adShowRef.current !== 'function') {
      onSuccess();
      return;
    }
    setIsAdLoading(true);
    try {
      await adShowRef.current();
      onSuccess();
    } catch (e) {
      console.error('Ad error:', e);
      onSuccess(); 
    } finally {
      setIsAdLoading(false);
    }
  };

  const handleNext = () => {
    const nextStep = currentStep + 1;
    const stepNumber = currentStep + 1;

    // Trigger ad after every 2nd term
    if (stepNumber % 2 === 0) {
      triggerAd(() => {
        setCurrentStep(nextStep);
        setSelectedOption(null);
      });
    } else {
      setCurrentStep(nextStep);
      setSelectedOption(null);
    }
  };

  if (currentStep >= terms.length) {
    return (
      <div className="quiz-container glass">
        <h2>✅ Verification Complete</h2>
        <p>Welcome to the community.</p>
        <button className="next-btn" onClick={() => window.location.reload()}>Enter Site</button>
      </div>
    );
  }

  const progress = ((currentStep + 1) / terms.length) * 100;

  return (
    <div className="quiz-container glass">
      <div className="progress-bar-container">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      
      <span className="step-counter">Step {currentStep + 1} of 20</span>
      
      <h2 className="question-text">{terms[currentStep].text}</h2>

      <div className="options-grid">
        {terms[currentStep].options.map((option, index) => (
          <button 
            key={index}
            className={`option-btn ${selectedOption === index ? 'selected' : ''}`}
            onClick={() => setSelectedOption(index)}
          >
            {option}
          </button>
        ))}
      </div>

      <button 
        className="next-btn" 
        onClick={handleNext} 
        disabled={selectedOption === null || isAdLoading}
      >
        {isAdLoading ? "Loading..." : (currentStep + 1) % 2 === 0 ? "Continue (Ad)" : "Next Step"}
      </button>
    </div>
  );
};

export default QuizPopup;