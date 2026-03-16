import React, { useState, useEffect } from 'react';
import OneSignal from 'react-onesignal';
import { useNavigate } from 'react-router-dom';
import '../Styles/Demo.css';
import myBackgroundImage from '../Assets/bg.png';
import fact from '../Assets/group.jpg';
import factsData from '../JSON/facts.json';

const Demo = () => {
  const [liked, setLiked] = useState(false);
  const [showNotifyPopup, setShowNotifyPopup] = useState(false);
  const [notificationAllowed, setNotificationAllowed] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);
  const [facts, setFacts] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentFact, setCurrentFact] = useState(null);

  const [showSwipeGuide, setShowSwipeGuide] = useState(
    localStorage.getItem('hasSeenSwipeGuide') !== 'true'
  );
  const [startY, setStartY] = useState(0);
  const [startX, setStartX] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [factTime, setFactTime] = useState('09:00');
  const navigate = useNavigate();
  useEffect(() => {
    setImageLoaded(false);
  }, [currentFact]);
  useEffect(() => {
    setFacts(factsData);

    if (factsData.length > 0) {
      setCurrentIndex(0);
      setCurrentFact(factsData[0]);
    }
  }, []);
  const showNextFact = () => {
    if (facts.length === 0) return;

    const nextIndex = (currentIndex + 1) % facts.length;
    if (showSwipeGuide) {
      setShowSwipeGuide(false);
      localStorage.setItem('hasSeenSwipeGuide', 'true');
    }
    setCurrentIndex(nextIndex);
    setCurrentFact(facts[nextIndex]);
  };
  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const endY = e.changedTouches[0].clientY;
    const endX = e.changedTouches[0].clientX;

    const diffY = startY - endY;
    const diffX = startX - endX;

    if (Math.abs(diffY) > 50 || Math.abs(diffX) > 50) {
      showNextFact();
    }
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
    <div
      className="bg-fact"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={myBackgroundImage}
        alt="background"
        className="background-image"
      />

      {/* Image Card */}
      <div className="fact-image-card">
        {!imageLoaded && <div className="image-shimmer"></div>}
        {showSwipeGuide && (
          <div className="swipe-guide-animation">
            <div className="swipe-arrow swipe-left">⬅️</div>
            <div className="swipe-text">Swipe to see next fact</div>
            <div className="swipe-arrow swipe-right">➡️</div>
          </div>
        )}

        <img
          src={currentFact?.imageUrl}
          className={`fact-image ${imageLoaded ? 'show' : 'hide'}`}
          alt="fact visual"
          style={{ height: '220px' }}
          onLoad={() => setImageLoaded(true)}
        />
        {/* <div className="like-overlay">
          <button
            className={`like-btn ${liked ? 'liked' : ''}`}
            onClick={() => setLiked(!liked)}
          >
            {liked ? '❤️' : '🤍'}
          </button>
          <span className="like-count">1.2K</span>
        </div>*/}
      </div>

      {/* Fact Card */}
      {/* Fact Card */}
      <div className="fact-card">
        {/* red pin */}
        <div className="pin"></div>

        {/* title */}
        <h2 className="fact-title">Fact</h2>

        {/* notebook text area */}
        <p className="fact-text">{currentFact?.fact}</p>
      </div>
      {showNotifyPopup && (
        <div className="notify-overlay">
          <div className="notify-popup">
            <h3 className="notify-title">🔔 Daily Fact Reminder</h3>

            <div className="notify-option">
              <label>Enable Push Notifications</label>
              <input
                type="checkbox"
                checked={notificationAllowed}
                disabled={checkingPermission}
                onChange={async (e) => {
                  if (e.target.checked) {
                    await handleSubscribe();
                  } else {
                    await OneSignal.User.PushSubscription.optOut();
                    setNotificationAllowed(false);
                  }
                }}
              />
            </div>

            <div className="notify-option">
              <label>Daily Fact Time</label>

              <select
                value={factTime}
                onChange={(e) => setFactTime(e.target.value)}
                disabled={!notificationAllowed}
              >
                <option value="07:00">7 AM</option>
                <option value="08:00">8 AM</option>
                <option value="09:00">9 AM</option>
                <option value="10:00">10 AM</option>
                <option value="11:00">11 AM</option>
                <option value="12:00">12 PM</option>
                <option value="13:00">1 PM</option>
                <option value="14:00">2 PM</option>
                <option value="15:00">3 PM</option>
                <option value="16:00">4 PM</option>
                <option value="17:00">5 PM</option>
                <option value="18:00">6 PM</option>
                <option value="19:00">7 PM</option>
                <option value="20:00">8 PM</option>
                <option value="21:00">9 PM</option>
                <option value="22:00">10 PM</option>
                <option value="23:00">11 PM</option>
              </select>
            </div>

            <div className="notify-buttons">
              <button
                className="notify-btn cancel"
                onClick={() => setShowNotifyPopup(false)}
              >
                Cancel
              </button>

              <button
                className="notify-btn save"
                onClick={async () => {
                  if (notificationAllowed) {
                    console.log('📅 Daily fact time:', factTime);

                    // optional: send selected time to backend
                    // await fetch("/api/save-time", { method:"POST", body: JSON.stringify({time: factTime}) });
                  }

                  setShowNotifyPopup(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button className="tab-btn">
          🏠<span>Home</span>
        </button>
        <button className="tab-btn" onClick={() => setShowNotifyPopup(true)}>
          🔔<span>Notify</span>
        </button>
        {/*<button className="tab-btn">
          🪙<span>Coins</span>
        </button>*/}
        <button className="tab-btn" onClick={() => navigate('/fact-profile')}>
          ⚙️ <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Demo;
