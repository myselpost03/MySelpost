import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCrown, FaEnvelope, FaTimes } from 'react-icons/fa';
import '../Styles/RevealNumberPopup.css';

const RevealNumberPopup = ({ isOpen, onClose }) => {
  const [countryCode, setCountryCode] = useState(null);
  const navigate = useNavigate();
  const handleDeveloper = () => {
    navigate('/contact-us');
  };
  const upiLink =
    'upi://pay?pa=myselpost03@okhdfcbank&pn=Myselpost&am=15&cu=INR';

  const kofiLink = 'https://ko-fi.com/myselpost';

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const res = await fetch('https://ipwho.is/?fields=country_code');
        const data = await res.json();

        if (data?.country_code) {
          setCountryCode(data.country_code); // example: IN, US, BR
        } else {
          setCountryCode('US'); // fallback
        }
      } catch (error) {
        console.warn('Location detection failed:', error);
        setCountryCode('US'); // fallback
      }
    };

    detectLocation();
  }, []);

  const handleUPI = () => {
    window.location.href = upiLink;

    setTimeout(() => {
      localStorage.setItem('isPremium', 'true');
      onClose();
      navigate('/');
    }, 1500);
  };

  const handleKofi = () => {
    window.open(kofiLink, '_blank');

    setTimeout(() => {
      localStorage.setItem('isPremium', 'true');
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  const isIndianUser = countryCode === 'IN';

  return (
    <div className="video-premium-overlay">
      <div className="video-premium-modal">
        <button
          className="video-premium-close-btn"
          onClick={onClose}
          aria-label="Close popup"
        >
          <FaTimes size={16} />
        </button>
        <div className="video-premium-header">
          <FaCrown className="video-premium-crown" />
          <h2>Premium Feature</h2>
          <p>Reveal Instagram</p>
        </div>

        <div className="video-premium-price">
          {isIndianUser ? '₹15' : '$1'} <span>/ Reveal</span>
        </div>

        <div className="profile-card">
          <h3 className="profile-name">Anuj Rajput</h3>

          <p className="profile-role">Developer & Merchant (MySelpost India)</p>

          <div className="profile-note">
            <p>
              <strong>Note:</strong> Payments are processed under the name{' '}
              <strong>Anuj Rajput</strong> and will appear as such on your bank
              statement.
            </p>
          </div>

          <button className="profile-btn" onClick={handleDeveloper}>
            Contact Developer
          </button>
        </div>

        <div className="video-premium-actions">
          <button
            className="upi-btn"
            onClick={isIndianUser ? handleUPI : handleKofi}
          >
            {isIndianUser ? 'Pay via UPI' : 'Tip via Ko-fi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevealNumberPopup;
