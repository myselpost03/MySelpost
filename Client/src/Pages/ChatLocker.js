import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/ChatLocker.css';

const ChatLocker = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [isIndianUser, setIsIndianUser] = useState(false);
  const [loadingCountry, setLoadingCountry] = useState(true);

  // India payment
  const upiLink =
    'upi://pay?pa=myselpost03@okhdfcbank&pn=Myselpost&am=20&cu=INR';

  // Foreign payment
  const kofiLink = 'https://ko-fi.com/myselpost';

  // 🌍 Detect country via IP
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();

        if (data?.country_code === 'IN') {
          setIsIndianUser(true);
        } else {
          setIsIndianUser(false);
        }
      } catch (error) {
        console.error('IP detection failed', error);
        setIsIndianUser(false); // fallback = foreign
      } finally {
        setLoadingCountry(false);
      }
    };

    detectCountry();
  }, []);

  if (!isOpen) return null;

  const refundRedirectUrl = '/refund';

  const handlePayment = () => {
    window.location.href = isIndianUser ? upiLink : kofiLink;

    setTimeout(() => {
      navigate('/');
      onClose();
    }, 2000);
  };

  const handleRefundRedirect = () => {
    navigate(refundRedirectUrl);
    onClose();
  };

  // ⏳ Prevent UI flicker while detecting
  if (loadingCountry) {
    return null;
  }

  return (
    <div className="premium-popup-overlay">
      <div className="premium-popup-card">
        <button className="premium-close-btn" onClick={onClose}>
          &times;
        </button>

        <div className="premium-badge" style={{ fontFamily: 'poppins' }}>
          Premium Unlock 🔓
        </div>

        <h2
          style={{
            whiteSpace: 'nowrap',
            fontSize: '1.5rem',
            fontFamily: 'fredoka one',
          }}
        >
          Unlock Chat Access
        </h2>

        <p style={{ fontFamily: 'patrick hand' }}>
          You’ve reached the free message limit. Complete the payment below to
          continue chatting without interruptions.
        </p>

        {/* 💰 Price */}
        <div className="price-container">
          <span className="currency">{isIndianUser ? '₹' : '$'}</span>
          <span className="amount" style={{ fontFamily: 'patrick hand' }}>
            {isIndianUser ? '20' : '1'}
          </span>
          <span className="duration" style={{ fontFamily: 'patrick hand' }}>
            /one-time
          </span>
        </div>
        {isIndianUser ? (
          <button className="upi-btn" onClick={handlePayment}>
            Pay via UPI
          </button>
        ) : (
          <button className="Tip-btn" onClick={handlePayment}>
            Tip us on Ko-fi
          </button>
        )}

        {/* 📩 Support */}
        <div className="support-info">
          <p style={{ fontFamily: 'patrick hand' }}>Need help with payment?</p>
          <span
            className="manager-highlight"
            style={{ fontFamily: 'patrick hand' }}
          >
            Contact Manager
          </span>
          <a
            href="mailto:anujrajput532@gmail.com"
            className="support-email"
            style={{ fontFamily: 'poppins' }}
          >
            anujrajput532@gmail.com
          </a>
        </div>

        <button className="refund-btn" onClick={handleRefundRedirect}>
          Request a refund
        </button>

        {/* 🔒 India-only security text */}
        {isIndianUser && (
          <p className="secure-text" style={{ fontFamily: 'patrick hand' }}>
            🔒 Secure payment via UPI
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatLocker;
