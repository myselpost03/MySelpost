import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OneSignal from 'react-onesignal';
import {
  FaVideo,
  FaRegBell,
  FaRegBellSlash,
  FaBan,
  FaCrown,
  FaEnvelope,
  FaTimes,
  FaCheck,
} from 'react-icons/fa';
import { supabase } from '../Utils/supabaseClient';
import { isWebView } from '../Utils/isWebView';
import '../Styles/ChatHeader.css';

const ChatHeader = ({ title, onBack, onBlockToggle, isBlocked }) => {
  const [subscribed, setSubscribed] = useState(false);
  const showButton = !isWebView();
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [countryCode, setCountryCode] = useState(null);

  const navigate = useNavigate();
  const upiLink =
    'upi://pay?pa=myselpost03@okhdfcbank&pn=Myselpost&am=25&cu=INR';

  const kofiLink = 'https://ko-fi.com/myselpost';

  const handleDeveloper = () => {
    navigate('/contact-us');
  };

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
      navigate('/');
    }, 2000);
  };
  const handleKofi = () => {
    window.open(kofiLink, '_blank');

    // simulate success
    setTimeout(() => {
      localStorage.setItem('isPremium', 'true');
      setShowPremiumPopup(false);
    }, 1500);
  };
  // Check if already subscribed on mount
  useEffect(() => {
    const isSubscribed =
      localStorage.getItem('notificationsEnabled') === 'true';
    setSubscribed(isSubscribed);

    // If guest already granted permission and user logs in, save playerId
    if (isSubscribed) {
      savePlayerForUser();
    }
  }, []);

  const savePlayerForUser = async () => {
    try {
      // Check if permission already granted
      if (Notification.permission !== 'granted') {
        // Request permission only if not granted
        const permission = await OneSignal.Notifications.requestPermission();
        if (permission !== 'granted') return; // stop if user denies
      }

      // Opt-in the push subscription
      await OneSignal.User.PushSubscription.optIn();
      const playerId = OneSignal.User.PushSubscription.id;
      console.log('✅ Player ID:', playerId);

      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.id) {
        // Save playerId with user_id in players table
        const { data, error } = await supabase
          .from('players')
          .upsert(
            { player_id: playerId, user_id: user.id },
            { onConflict: 'player_id' }
          );

        if (error) console.error('❌ Error saving player:', error.message);
        else console.log('✅ Player saved in players table:', data);

        // Remove from guestPlayers if exists
        await supabase.from('guestPlayers').delete().eq('player_id', playerId);
      }
    } catch (err) {
      console.error('❌ Error saving player for user:', err);
    }
  };

  const handleSubscribe = async () => {
    // Only execute if notificationsEnabled not set
    if (localStorage.getItem('notificationsEnabled') === 'true') return;

    try {
      // Request permission only if not granted
      if (Notification.permission !== 'granted') {
        const permission = await OneSignal.Notifications.requestPermission();
        if (permission !== 'granted') return;
      }

      await OneSignal.User.PushSubscription.optIn();
      const playerId = OneSignal.User.PushSubscription.id;
      console.log('✅ Player ID:', playerId);

      const user = JSON.parse(localStorage.getItem('user'));

      if (user?.id) {
        const { data, error } = await supabase
          .from('players')
          .upsert(
            { player_id: playerId, user_id: user.id },
            { onConflict: 'player_id' }
          );
        if (error) console.error('❌ Error saving player:', error.message);
        else console.log('✅ Player saved in players table:', data);

        await supabase.from('guestPlayers').delete().eq('player_id', playerId);
      } else {
        const { error } = await supabase
          .from('guestPlayers')
          .upsert({ player_id: playerId }, { onConflict: 'player_id' });
        if (error)
          console.error('❌ Error saving guest player:', error.message);
        else console.log('✅ Player saved in guestPlayers table');
      }

      localStorage.setItem('notificationsEnabled', 'true');
      setSubscribed(true);
    } catch (err) {
      console.error('❌ Error subscribing for push:', err);
    }
  };
  const isIndianUser = countryCode === 'IN';
  return (
    <div className="chat-header">
      <button className="chat-back-button" onClick={onBack}>
        ←
      </button>
      <h1 className="chat-header-title">{title}</h1>

      <div className="chat-header-actions">
        {/* Block button - just calls the function passed from parent */}
        <button
          onClick={onBlockToggle}
          aria-label={isBlocked ? 'Unblock user' : 'Block user'}
          title={isBlocked ? 'Unblock user' : 'Block user'}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: isBlocked ? '#ff6f61' : '#fff',
            fontSize: '1.2rem',
          }}
        >
          <FaBan />
        </button>

        {/* Notification bell 
       {showButton && (
      <button
        className="chat-bell-icon"
        onClick={handleSubscribe}
        disabled={subscribed}
        title={subscribed ? "Notifications enabled" : "Enable notifications"}
      >
        {subscribed ? (
          <FaRegBell style={{ marginRight: "6px" }} />
        ) : (
          <FaRegBellSlash style={{ marginRight: "6px" }} />
        )}
      </button>
    )}*/}
        {/* onClick={() => setShowPremiumPopup(true)}
        <button
          className="video-call-icon"
          onClick={() =>
            (window.location.href = 'https://rapid-links.com/s?QzH2N7V2')
          }
        >
          <FaVideo size={20} />
        </button>*/}
      </div>
      {showPremiumPopup && (
        <div className="video-premium-overlay">
          <div className="video-premium-modal">
            <button
              className="video-premium-close-btn"
              onClick={() => setShowPremiumPopup(false)}
              aria-label="Close popup"
            >
              <FaTimes size={16} />
            </button>
            <div className="video-premium-header">
              <FaCrown className="video-premium-crown" />
              <h2>Premium Feature</h2>
              <p>Unlock Video Calling</p>
            </div>

            <div className="video-premium-price">
              {isIndianUser ? '₹25' : '$1'} <span>/ lifetime</span>
            </div>
            {/*
            <div className="video-premium-features">
              <div className="video-premium-feature">
                <FaCheck className="video-check-icon" />
                <span>Unlimited video calls</span>
              </div>
              <div className="video-premium-feature">
                <FaCheck className="video-check-icon" />
                <span>HD video quality</span>
              </div>
              <div className="video-premium-feature">
                <FaCheck className="video-check-icon" />
                <span>Priority connection</span>
              </div>
              <div className="video-premium-feature">
                <FaCheck className="video-check-icon" />
                <span>Lifetime access</span>
              </div>
            </div>*/}
            <div className="profile-card">
              <h3 className="profile-name">Anuj Rajput</h3>

              <p className="profile-role">Developer & Merchant</p>

              <div className="profile-note">
                <p>
                  <strong>Note:</strong> Payments are processed under the name{' '}
                  <strong>Anuj Rajput</strong> and will appear as such on your
                  bank statement.
                </p>
              </div>

              <button onClick={handleDeveloper} className="profile-btn">
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
      )}
    </div>
  );
};

export default ChatHeader;
