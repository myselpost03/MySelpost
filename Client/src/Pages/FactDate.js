import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import developer from '../Assets/developer.jpg';
import OneSignal from 'react-onesignal';
import myBackgroundImage from '../Assets/bg.png';
import factDate from '../JSON/factDate.json';
import { imageMap } from './imageMap';
import '../Styles/FactDate.css';

const COOLDOWN_TIME = 24 * 60 * 60 * 1000; // 24 hours

const FactDate = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [buttonsLocked, setButtonsLocked] = useState(false);
const [showNotifyPopup, setShowNotifyPopup] = useState(false);
   const [notificationAllowed, setNotificationAllowed] = useState(false);
    const [checkingPermission, setCheckingPermission] = useState(true);
   
  const [showSwipeGuide, setShowSwipeGuide] = useState(
    localStorage.getItem('hasSeenSwipeGuide') !== 'true'
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentCard = factDate[currentIndex];

  const navigate = useNavigate();

  // 🔒 Check cooldown on load
  useEffect(() => {
    const lastClickTime = localStorage.getItem('cooldownTime');

    if (lastClickTime) {
      const diff = Date.now() - Number(lastClickTime);

      if (diff < COOLDOWN_TIME) {
        setButtonsLocked(true);
      } else {
        localStorage.removeItem('cooldownTime');
      }
    }
  }, []);

  // 👉 Handle button click
  const handleAction = (type) => {
  if (buttonsLocked) {
    setShowPopup(true);
    return;
  }

  // First time click → lock + show popup
  localStorage.setItem('cooldownTime', Date.now());

  setButtonsLocked(true);
  setShowPopup(true);

  if (type === 'like') handleSwipe('right');
  if (type === 'dislike') handleSwipe('left');
};

  const handleSwipe = (direction) => {
    setSwipeDirection(direction);

    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === factDate.length - 1 ? 0 : prev + 1
      );
      setSwipeDirection(null);
    }, 300);
  };

   useEffect(() => {
      const checkPermission = async () => {
        try {
          // Check existing permission
          if (Notification.permission === 'granted') {
            setNotificationAllowed(true);
            await OneSignal.User.PushSubscription.optIn();
          } else {
            setNotificationAllowed(false);
          }
        } catch (err) {
          console.error(err);
          setNotificationAllowed(false);
        } finally {
          setCheckingPermission(false);
        }
      };
  
      checkPermission();
    }, []);
  
    const handleSubscribe = async () => {
      try {
        const permission = await OneSignal.Notifications.requestPermission();
  
        if (permission === true || Notification.permission === 'granted') {
          await OneSignal.User.PushSubscription.optIn();
  
          const playerId = OneSignal.User.PushSubscription.id;
          console.log('✅ Player ID:', playerId);
  
          setNotificationAllowed(true);
        } else {
          console.log('❌ Permission denied');
          setNotificationAllowed(false);
        }
      } catch (err) {
        console.error('❌ Error subscribing:', err);
        setNotificationAllowed(false);
      }
    };

  return (
    <div className="profile-page">
      <img src={myBackgroundImage} alt="background" className="background-image" />

      <div className={`fact-image-card ${swipeDirection ? `swipe-${swipeDirection}` : ''}`}>
        {!imageLoaded && <div className="image-shimmer"></div>}

        {showSwipeGuide && (
          <div className="swipe-guide-animation">
            <div className="swipe-arrow swipe-left">⬅️</div>
            <div className="swipe-text">Swipe to see next fact</div>
            <div className="swipe-arrow swipe-right">➡️</div>
          </div>
        )}

        <img
          src={imageMap[currentCard.image]}
          className="fact-image-date"
          alt="profile"
          onLoad={() => setImageLoaded(true)}
        />

        <div className="card-overlay-info">
          <h2 className="profile-name">
            {currentCard.name}, <span>{currentCard.age}</span>
          </h2>
          <p className="profile-location">📍 {currentCard.location}</p>
        </div>

        <div className="card-overlay-buttons">
          <button
            className="overlay-btn dislike-btn"
            disabled={buttonsLocked}
            onClick={() => handleAction('dislike')}
          >
            ❌ <span>1 coin</span>
          </button>

          <button
            className="overlay-btn like-btn"
            disabled={buttonsLocked}
            onClick={() => handleAction('like')}
          >
            ❤️ <span>20 coins</span>
          </button>

          <button
            className="overlay-btn telegram-btn"
            disabled={buttonsLocked}
            onClick={() => handleAction('telegram')}
          >
            📩 <span>50 coins</span>
          </button>
        </div>
      </div>

      {/* 🔥 Popup */}
      {showPopup && (
        <div className="cool-popup">
          <div className="date-popup-box">
            <h2 style={{whiteSpace: 'nowrap'}}>🔒 Feature Locked</h2>
            <p>
              This feature will automatically unlock after <b>24 hours</b> for new users.
            </p>

            <button
              className="date-notify-btn"
              onClick={() => {
                handleSubscribe();
                setShowPopup(false);
              }}
            >
              🔔 Notify Me
            </button>

            <button
              className="date-close-btn"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="bottom-nav">
        <button className="tab-btn" onClick={() => navigate('/fact-pins')}>
          🏠<span>Home</span>
        </button>
        {/* <button className="tab-btn" onClick={() => navigate('/fact-videos')}>
          🎬<span>AI</span>
        </button>*/}
        <button className="tab-btn" onClick={() => navigate('/fact-date')}>
          ❤️<span>Fact Date</span>
        </button>
        <button className="tab-btn" onClick={() => navigate('/fact-profile')}>
          ⚙️ <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default FactDate;