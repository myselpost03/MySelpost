import React, { useState, useRef, useEffect } from 'react';
import '../Styles/QuizPopup.css';

const terms = [
  { id: 1, text: 'I confirm that I am looking to connect with people from different countries for friendship or dating.' },
  { id: 2, text: 'I agree to treat all members with cultural respect and avoid any form of xenophobia or racism.' },
  { id: 3, text: 'I understand that language barriers may exist and agree to use translation tools patiently.' },
  { id: 4, text: 'I verify that I am at least 18 years old, as this is a platform for adult international dating.' },
  { id: 5, text: 'I agree not to share my private contact information until a foundation of trust is built.' },
  { id: 6, text: 'I understand that requesting money or financial assistance from other members is strictly prohibited.' },
  { id: 7, text: 'I accept that my profile information will be visible to users across different time zones globally.' },
  { id: 8, text: 'I agree to report any suspicious behavior or profiles that appear to be fake.' },
  { id: 9, text: 'I understand that premium features like video calls may require a subscription.' },
  { id: 10, text: 'By clicking below, I confirm I am ready to start my journey of meeting foreigners.' },
];

const QuizPopup = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const adShowRef = useRef(null);

  // Ad triggers after steps 3, 6, and 9
  const adSteps = [3, 6, 9];

  useEffect(() => {
    if (window.initCdTma) {
      window
        .initCdTma({ id: '6115107' })
        .then((show) => {
          adShowRef.current = show;
        })
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
    const currentStepNumber = currentStep + 1;

    if (adSteps.includes(currentStepNumber)) {
      triggerAd(() => {
        setCurrentStep(nextStep);
      });
    } else {
      setCurrentStep(nextStep);
    }
  };

  if (currentStep >= terms.length) {
    return (
      <div className="quiz-container glass">
        <h2>🌍 Connection Ready!</h2>
        <p>Your profile is now optimized for international chat.</p>
        <button className="next-btn" onClick={() => window.location.reload()}>
          Start Chatting
        </button>
      </div>
    );
  }

  const progress = ((currentStep + 1) / terms.length) * 100;
  const isAdStep = adSteps.includes(currentStep + 1);
  const isLastStep = currentStep === terms.length - 1;

  return (
    <div className="quiz-container glass">
      <div className="progress-bar-container">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <span className="step-counter">Verification Step {currentStep + 1} of 10</span>

      <h2 className="question-text">{terms[currentStep].text}</h2>

      {/* Options grid removed - just using the action button below */}

      <button
        className="next-btn"
        onClick={isLastStep ? onClose : handleNext}
        disabled={isAdLoading}
      >
        {isAdLoading
          ? 'Loading...'
          : isLastStep
          ? 'Done & Close'
          : isAdStep
          ? 'Continue (Ad)'
          : 'Continue'}
      </button>
    </div>
  );
};

export default QuizPopup;