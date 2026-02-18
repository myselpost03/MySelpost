import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCrown, FaEnvelope, FaCheck } from 'react-icons/fa';
import '../Styles/AdultPopup.css';

const AdultPopup = ({ isOpen, onClose }) => {
  const [countryCode, setCountryCode] = useState(null);
  const navigate = useNavigate();

  const upiLink =
    'upi://pay?pa=myselpost03@okhdfcbank&pn=Myselpost&am=3&cu=INR';

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
        <div className="video-premium-header">
          <FaCrown className="video-premium-crown" />
          <h2>VIP Access</h2>
          <p>Watch Full Videos</p>
        </div>

        <div className="video-premium-price">
          {isIndianUser ? '₹3' : '$1'} <span>/ lifetime</span>
        </div>

        <div className="video-premium-features">
          <div className="video-premium-feature">
            <FaCheck className="video-check-icon" />
            <span>Remove blur and watch full-length clips</span>
          </div>

          <div className="video-premium-feature">
            <FaCheck className="video-check-icon" />
            <span>Unlock 1-on-1 private chat features</span>
          </div>

          <div className="video-premium-feature">
            <FaCheck className="video-check-icon" />
            <span>One-time tip, no recurring subscriptions</span>
          </div>

          <div className="video-premium-feature">
            <FaCheck className="video-check-icon" />
            <span>One-time payment, lifetime benefit</span>
          </div>
        </div>

        {/* New Contact Manager Section */}
        <div className="manager-contact-box">
          <p className="contact-text">Got questions? Contact your manager</p>
          <p className="manager-name">Anuj Rajput</p>
          <a href="mailto:anujrajput532@gmail.com" className="manager-email">
            <FaEnvelope style={{ marginRight: '5px' }} />{' '}
            anujrajput532@gmail.com
          </a>
        </div>

        <div className="video-premium-actions">
          <button
            className="upi-btn"
            onClick={isIndianUser ? handleUPI : handleKofi}
          >
            {isIndianUser ? 'Pay via UPI' : 'Tip via Ko-fi'}
          </button>
          <button className="video-premium-cancel-btn" onClick={onClose}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdultPopup;
