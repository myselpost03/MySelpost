import React, { useState, useEffect } from 'react';
import OneSignal from 'react-onesignal';
import { useNavigate } from 'react-router-dom';
import myBackgroundImage from '../Assets/bg.png';
import { supabase } from '../Utils/supabaseClient';
import factsData from '../JSON/lifehacks.json';
import { v4 as uuidv4 } from 'uuid'; // Install via: npm install uuid

const Lifehacks = () => {
  const [liked, setLiked] = useState(false);
  const [showNotifyPopup, setShowNotifyPopup] = useState(false);
  const [notificationAllowed, setNotificationAllowed] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);
  const [facts, setFacts] = useState([]);
  const [currentFact, setCurrentFact] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [userCountry, setUserCountry] = useState(null);
  const [showSwipeGuide, setShowSwipeGuide] = useState(
    localStorage.getItem('hasSeenSwipeGuide') !== 'true'
  );
  const [startY, setStartY] = useState(0);
  const [startX, setStartX] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [factTime, setFactTime] = useState('09:00');
  const [guestId, setGuestId] = useState(null);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let id = localStorage.getItem('guest_id');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('guest_id', id);
    }
    setGuestId(id);
  }, []);

  useEffect(() => {
    if (!guestId) return;

    const loadUnviewedFacts = async () => {
      // 1. Get viewed indices from Supabase
      const { data: viewed } = await supabase
        .from('viewed_facts')
        .select('fact_index')
        .eq('user_id', guestId);

      const viewedIndices = viewed.map((v) => v.fact_index);

      // 2. Filter local data
      const filtered = factsData.filter(
        (_, index) => !viewedIndices.includes(index)
      );
      setFacts(filtered);
      if (filtered.length > 0) setCurrentFact(filtered[0]);
    };

    loadUnviewedFacts();
  }, [guestId]);

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenFeedbackPopup');

    if (!hasSeen) {
      const timer = setTimeout(() => {
        setShowFeedbackPopup(true);
        localStorage.setItem('hasSeenFeedbackPopup', 'true');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        // Try primary API
        let res = await fetch('https://ipapi.co/json/');
        let data = await res.json();

        if (data && data.country_name) {
          setUserCountry(data.country_name);
          localStorage.setItem('user_country', data.country_name);
          return;
        }

        // Fallback API
        res = await fetch('https://ipinfo.io/json?token=YOUR_TOKEN');
        data = await res.json();

        if (data && data.country) {
          setUserCountry(data.country); // returns "IN", "US"
          localStorage.setItem('user_country', data.country);
          return;
        }

        throw new Error('No country found');
      } catch (err) {
        console.error('Country detection failed:', err);
        setUserCountry('Unknown');
      }
    };

    const cached = localStorage.getItem('user_country');
    if (cached) {
      setUserCountry(cached);
    } else {
      fetchCountry();
    }
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

  const saveFeedback = async (choice) => {
    try {
      await supabase.from('user_feedback').insert([
        {
          user_id: guestId,
          choice: choice,
          country: userCountry,
        },
      ]);
      handleSubscribe();
    } catch (err) {
      console.error('Error saving feedback:', err);
    }
  };

  // When showing next fact:
  const markFactAsViewed = async (index) => {
    await supabase
      .from('viewed_facts')
      .insert([{ user_id: guestId, fact_index: index }]);
  };
  useEffect(() => {
    setImageLoaded(false);
  }, [currentFact]);

  const showNextFact = () => {
    if (facts.length === 0) return;

    const currentIdxInOriginalData = factsData.findIndex(
      (f) => f.imageUrl === currentFact?.imageUrl
    );
    markFactAsViewed(currentIdxInOriginalData);

    const nextIndex = (currentIndex + 1) % facts.length;

    // Force reset image loading before switching
    setImageLoaded(false);

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
      <div className="fact-image-cardd">
        {!imageLoaded && <div className="image-shimmer"></div>}
        {showSwipeGuide && (
          <div className="swipe-guide-animation">
            <div className="swipe-arrow swipe-left">⬅️</div>
            <div className="swipe-text">Swipe to see next fact</div>
            <div className="swipe-arrow swipe-right">➡️</div>
          </div>
        )}

        <img
          key={currentFact?.imageUrl} // Force re-render on src change
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
      {showFeedbackPopup && (
        <div className="feedback-overlay">
          <div className="feedback-popup">
            <h2>💬 Quick Feedback</h2>
            <p>Tell us how you feel about FactPins</p>

            <button
              className="feedback-btn positive"
              onClick={async () => {
                await saveFeedback('love_facts_download_later');
                setShowFeedbackPopup(false);
              }}
            >
              ❤️ I love reading facts <br />
              <small>I’ll download the app later</small>
            </button>

            <button
              className="feedback-btn negative"
              onClick={async () => {
                await saveFeedback('dont_like_never_download');
                setShowFeedbackPopup(false);
              }}
            >
              😕 I don’t like reading facts <br />
              <small>I’ll never download your app</small>
            </button>
          </div>
        </div>
      )}
      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button className="tab-btn">
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

export default Lifehacks;
