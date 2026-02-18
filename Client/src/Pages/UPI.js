import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/UPI.css';

const UPI = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const upiLink =
    'upi://pay?pa=myselpost03@okhdfcbank&pn=Myselpost&am=3&cu=INR';
  const refundRedirectUrl = '/refund'; 

  const handleUPI = () => {
    window.location.href = upiLink;
    setTimeout(() => {
      navigate('/');
      onClose();
    }, 2000);
  };

  const handleRefundRedirect = () => {
    navigate(refundRedirectUrl);
    onClose();
  };

  return (
    <div className="premium-popup-overlay">
      <div className="premium-popup-card valentine-theme">
        <button className="premium-close-btn" onClick={onClose}>
          &times;
        </button>

        {/* 1. Updated Badge */}
        <div className="premium-badge">Priority Bypass Active ⚡</div>

        {/* 2. Updated Title */}
        <h2 style={{ whiteSpace: 'nowrap', fontSize: '1.4rem' }}>Unlock Profile 🔓</h2>
        
        {/* 3. Updated Description */}
        <p>
          Bypass the traffic queue and gain instant access to private media, 
          stories, and hidden profile shards.
        </p>

        <div className="price-container">
          <span className="currency">₹</span>
          <span className="amount">10</span>
          <span className="duration">/per unlock</span>
        </div>

        {/* 4. Updated Button Text */}
        <button className="upi-btn" onClick={handleUPI}>
          Pay via UPI
        </button>

        <div className="support-info">
          <p>Technical Support Manager:</p>
          <span className="manager-highlight">Anuj Rajput</span>
          <a href="mailto:anujrajpoot082@gmail.com" className="support-email">
            anujrajpoot082@gmail.com
          </a>
        </div>

        <button className="refund-btn" onClick={handleRefundRedirect}>
          Encryption failed? Get a Refund
        </button>

        {/* 5. Updated Footer Text */}
        <p className="secure-text">🔒 256-bit Secure SSL Connection</p>
      </div>
    </div>
  );
};

export default UPI;