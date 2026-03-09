import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaCrown,
  FaTimes,
  FaCheckCircle,
  FaShieldAlt,
  FaDownload,
  FaEye,
} from 'react-icons/fa';
import developer from '../Assets/developer.jpg';
import '../Styles/InstaPopup.css';

const InstaPopup = ({ isOpen, onClose }) => {
  const [countryCode, setCountryCode] = useState(null);
  const navigate = useNavigate();

  const upiLink =
    'upi://pay?pa=myselpost03@okhdfcbank&pn=Anuj%20Rajput&am=1&cu=INR';
  const kofiLink = 'https://ko-fi.com/myselpost';

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const res = await fetch('https://ipwho.is/?fields=country_code');
        const data = await res.json();
        setCountryCode(data?.country_code || 'US');
      } catch (error) {
        setCountryCode('US');
      }
    };
    detectLocation();
  }, []);

  const handlePayment = () => {
    const link = countryCode === 'IN' ? upiLink : upiLink;
    window.location.href = link;
    setTimeout(() => {
      localStorage.setItem('isPremium', 'true');
      onClose();
      navigate('/');
    }, 2000);
  };

  const handleKofi = () => {
    const link = kofiLink;
    window.location.href = link;
  }

  if (!isOpen) return null;

  return (
    <div className="vip-overlay">
      <div className="vip-modal">
        <button className="close-x" onClick={onClose}>
          <FaTimes />
        </button>

        {/* 1. Header Section */}
        <div className="vip-header">
          <div className="crown-badge">
            <FaCrown />
          </div>
          <h2>VIP Access</h2>
          <p>Unlock everything instantly</p>
        </div>

        {/* 2. Developer Branding (Larger & Cleaner) 
        <div className="dev-brand-card">
          <div className="dev-avatar-wrapper">
            <img src={developer} alt="Anuj Rajput" />
            <FaCheckCircle className="v-check" />
          </div>
          <div className="dev-details">
            <h3>Anuj Rajput</h3>
            <span>Founder & Indian Merchant</span>
          </div>
        </div>*/}

        {/* 3. Features (Organized) */}
        <div className="features-container">
          <div className="feat">
            <FaEye className="i" /> Private Stories
          </div>
          <div className="feat">
            <FaEye className="i" /> Private Posts
          </div>
          <div className="feat">
            <FaDownload className="i" /> HD Downloads
          </div>
          <div className="feat">
            <FaShieldAlt className="i" /> Safe Access
          </div>
        </div>

        {/* 4. Pricing & Payment */}
        <div className="payment-section">
          <div className="price-box">
            <span className="currency">{countryCode === 'IN' ? '₹' : '$'}</span>
            <span className="amount">{countryCode === 'IN' ? '15' : '1'}</span>
            <span className="duration">/ Lifetime Access</span>
          </div>

          <button
            className="primary-btn"
            style={{
              backgroundColor: '#fff',
              color: '#000',
              fontWeight: 'bold',
            }}
            onClick={handleKofi}
          >
            Tip via Ko-fi
          </button>
          <div className="trust-footer">
            <FaShieldAlt />
            Not the right fit?{' '}
            <Link to="/refund" style={{ textDecoration: 'underline', color: '#555' }}>
              Request a refund.
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstaPopup;
