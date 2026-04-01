import React, { useRef, useMemo, useState, useEffect } from 'react';
import OneSignal from 'react-onesignal';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Utils/supabaseClient';
import InstaPopup from '../Components/InstaPopup';
import Tip from './Tip';
import TelegramPopup from '../Components/TelegramPopup';
import group from '../Assets/group.jpg';
import Header from '../Components/Header';
import Result from './Result';
import useTelegramMiniApp from '../Hooks/useTelegramMiniApp';
import AdsterraBanner from '../Components/AdsterraBanner';
import '../Styles/Private.css';

const Private = () => {
  const [step, setStep] = useState('home');
  const [activeTab, setActiveTab] = useState('home');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [progress, setProgress] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(
    Math.floor(Math.random() * 1000) + 9000
  );
  const [showModal, setShowModal] = useState(false);
  const [gender, setGender] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationAllowed, setNotificationAllowed] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const [log, setLog] = useState('Initializing secure handshake...');
  const [queuePos] = useState(Math.floor(Math.random() * 200) + 114);
  const [showPopup, setShowPopup] = useState(false);
  const [countryCode, setCountryCode] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [boosts, setBoosts] = useState(7);
  const [boostCooldown, setBoostCooldown] = useState(0);
  // Store the target finish time instead of just a progress percentage
  const [finishTime, setFinishTime] = useState(null);
  const adShowRef = useRef(null);
  const isTelegram =
    navigator.userAgent.toLowerCase().includes('telegram') ||
    !!window?.Telegram?.WebApp;
  useEffect(() => {
    if (isTelegram) return;

    // Show popup immediately if notifications are not allowed
    if (!notificationAllowed) {
      setShowNotifPopup(true);
    }
  }, [notificationAllowed, isTelegram]);
  useEffect(() => {
    if (boostCooldown > 0) {
      const timer = setInterval(
        () => setBoostCooldown((prev) => prev - 1),
        1000
      );
      return () => clearInterval(timer);
    }
  }, [boostCooldown]);

  const navigate = useNavigate();
  // Carousel Data
  const carouselItems = [
    { type: 'media', title: 'Posts History', count: 9, icon: '📸' },
  ];

  const [lastSearchTime, setLastSearchTime] = useState(
    localStorage.getItem('lastSearchTime') || null
  );

  const [isLocked, setIsLocked] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);

  const postImages = React.useMemo(() => {
    return Array.from({ length: 9 }, (_, i) => ({
      id: i,
      url: i === 0 ? group : `https://picsum.photos/seed/post${i}/300/300`,
    }));
  }, []);

  const COLORS = {
    gradient: 'linear-gradient(135deg, #ff758c, #ff7eb3)',
    bg: '#FFF5F7',
    textMain: '#2D3748',
    textMuted: '#718096',
    primary: '#ff758c',
    border: '#FED7E2',
    white: '#FFFFFF',
    success: '#ED64A6',
    disabled: '#FFD1DC',
    insta: '#E4405F',
  };

  const spinnerStyle = {
    width: '24px',
    height: '24px',
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #ff758c',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  // --- OneSignal Permission Check ---
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
  // Check localStorage on mount
  useEffect(() => {
    // Do not show modal inside Telegram
    if (isTelegram) {
      setShowModal(false);
      return;
    }

    const hasOnboarded = localStorage.getItem('user_onboarded');

    if (!hasOnboarded) {
      setShowModal(true);
    }
  }, [isTelegram]);

  const handleOnboardingSubmit = () => {
    if (gender && agreed) {
      localStorage.setItem('user_onboarded', 'true');
      localStorage.setItem('user_gender', gender);

      setShowModal(false); // close modal first
      setIsLoading(true); // show main loader

      setTimeout(() => {
        setIsLoading(false); // hide loader after 3 seconds
      }, 3000);
    }
  };

  // --- Initialize Onclicka Ad ---
  useEffect(() => {
    if (window.initCdTma) {
      window
        .initCdTma({ id: '6113234' }) // Replace with your actual ID
        .then((show) => {
          adShowRef.current = show;
        })
        .catch((e) => console.error('Ad Init Error:', e));
    }
  }, []);

  // --- Updated triggerAd for better UI feedback ---
  const triggerAd = async (onSuccess) => {
    // Check if SDK is even present
    if (typeof adShowRef.current !== 'function') {
      console.warn('Ad SDK not initialized yet.');
      // Optional: add a small delay or toast message here
      onSuccess();
      return;
    }

    setIsAdLoading(true); // This sets the button text to "Loading Ad..."

    try {
      // Awaiting the actual ad display process
      await adShowRef.current();
      console.log('tma ad played');
      onSuccess(); // Execute the intended action (e.g., setStep, setActiveTab)
    } catch (e) {
      console.error('Ad display error:', e);
      // You may want to prevent navigation if the ad is required
      // If you want to force success even on error, keep this:
      onSuccess();
    } finally {
      setIsAdLoading(false); // Reset loading state
    }
  };

  // Handlers
  const handleVIP = () => setShowPopup(true);

  const handleContentLocker = () => {
    window.location.href = 'https://rapid-links.com/s?DN8sU26j';
  };

  const handleSaveEmail = async () => {
    if (!email || !email.includes('@')) {
      setSaveStatus('❌ Invalid email.');
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('instaviewer')
        .insert([{ email, username }]);
      if (error) throw error;
      setSaveStatus('✅ Alert Active!');
      setEmail('');
    } catch (err) {
      setSaveStatus('⚠️ Error. Try again.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(''), 4000);
    }
  };

  const handleTabClick = (tab) => {
    // If user is on website (not Telegram)
    if (!isTelegram && (tab === 'recent' || tab === 'vault')) {
      setShowPopup(true);
      return;
    }

    // Telegram users can access normally
    if (isTelegram && (tab === 'recent' || tab === 'vault')) {
      triggerAd(() => setActiveTab(tab));
    } else {
      setActiveTab(tab);
    }
  };

  useEffect(() => {
    if (lastSearchTime) {
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      const now = new Date().getTime();
      if (now - parseInt(lastSearchTime) < oneWeek) {
        setIsLocked(true);
      } else {
        // Time is up, clear local storage
        localStorage.removeItem('lastSearchTime');
        setLastSearchTime(null);
      }
    }
  }, [lastSearchTime]);
  // Effects
  useEffect(() => {
    fetch('https://ipwho.is/?fields=country_code')
      .then((res) => res.json())
      .then((data) => setCountryCode(data?.country_code || 'US'))
      .catch(() => setCountryCode('US'));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineUsers((prev) => {
        const change = Math.floor(Math.random() * 20) - 10;
        return Math.max(9000, Math.min(10000, prev + change));
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // --- Updated Processing Logic ---
  useEffect(() => {
    const TOTAL_DURATION = 3600000; // 1 hour in ms

    if (step === 'processing' && !finishTime) {
      setFinishTime(Date.now() + TOTAL_DURATION);
    }

    if (finishTime) {
      const timer = setInterval(() => {
        const now = Date.now();
        const remaining = finishTime - now;

        if (remaining <= 0) {
          setProgress(100);
          clearInterval(timer);
          navigate('/results', { state: { username } });
        } else {
          // Progress is based on how much of the original duration is left
          const p = ((TOTAL_DURATION - remaining) / TOTAL_DURATION) * 100;
          setProgress(Math.min(p, 99));
        }
      }, 100);
      return () => clearInterval(timer);
    }
  }, [step, finishTime, navigate, username]);

  const handleBoost = async () => {
    if (boosts <= 0 || boostCooldown > 0) return;

    await triggerAd(() => {
      // Reduce remaining time by 1/7th of the original 1 hour
      const reduction = 3600000 / 7;
      setFinishTime((prev) => (prev ? prev - reduction : Date.now()));

      setBoosts((prev) => prev - 1);
      setBoostCooldown(10); // 30s cooldown
    });
  };

  const handleStartClick = () => {
    if (!username) return;

    // If user is on normal website
    if (!isTelegram) {
      setShowPopup(true);
      return;
    }

    // If inside Telegram
    handleStartSearch();
  };
  // Ensure this specific structure for your handleStartSearch
  const handleStartSearch = async () => {
    setStep('processing');
    if (isAdLoading) return; // Prevent double clicks

    // We explicitly call triggerAd and pass the state updates as the callback
    await triggerAd(() => {
      const now = new Date().getTime();
      localStorage.setItem('lastSearchTime', now);
      setLastSearchTime(now);
      setIsLocked(true);
      setStep('processing');
    });
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    pointerEvents: 'auto', // Re-enable pointer events for the modal itself
  };

  const modalStyle = {
    background: '#fff',
    padding: '40px',
    borderRadius: '24px',
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  };

  return (
    <>
      <Header />
      <div className="bg-container" style={{ flexDirection: 'column' }}>
        {/*!isTelegram && (
          <div className="inline-notice-gradient">
            <h3>Important Update 📢</h3>
            <p className="tele-notice">
              We have shifted our services to our official Telegram bot.
            </p>
            <a
              href="https://t.me/instalens_bot/instalens"
              target="_blank"
              rel="noreferrer"
              className="telegram-btn"
            >
              Join @instalens_bot
            </a>
          </div>
        )*/}

        {/*
          <button className='chat-btn' onClick={() => navigate('/guest-user')}>Chat with Foreigner</button>
 */}

        <div className="glass-card">
          {step !== 'results' && (
            <div className="live-indicator">
              <div className="dot"></div>
              <b>{onlineUsers.toLocaleString()}</b>
              <span style={{ marginLeft: '4px', opacity: 0.6 }}>Online</span>
            </div>
          )}

          <div className="tab-nav">
            {['recent', 'home', 'vault'].map((t) => (
              <button
                key={t}
                className={`tab-btn-priv ${activeTab === t ? 'active' : ''}`}
                onClick={() => handleTabClick(t)}
                disabled={isAdLoading}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {activeTab === 'home' && (
            <div className="fade-content">
              {step === 'home' && (
                <>
                  <h2 className="title-text" style={{ whiteSpace: 'nowrap' }}>
                    Private Insta Viewer
                  </h2>
                  <p className="sub-text">
                    Enter User ID to View Private Account.
                  </p>
                  <div className="input-group-modern">
                    <label className="input-label-premium">
                      👤 Target Profile
                    </label>
                    <input
                      className="premium-input"
                      placeholder="@username..."
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  {/*!notificationAllowed && !isTelegram && (
                    <button
                      onClick={handleSubscribe}
                      style={{
                        width: '100%',
                        marginTop: '12px',
                        marginBottom: '10px',
                        background: '#f8f9fa',
                        border: `1px solid ${COLORS.border}`,
                        color: COLORS.textMain,
                        padding: '12px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      🔔 Enable Notifications
                    </button>
                  )*/}

                  {notificationAllowed && !isTelegram && (
                    <div
                      style={{
                        color: COLORS.success,
                        fontSize: '13px',
                        fontWeight: '700',
                        marginTop: '10px',
                        marginBottom: '10px',
                        textAlign: 'center',
                      }}
                    >
                      ✅ Notifications Enabled
                    </div>
                  )}
                  <button
                    className={
                      !isTelegram ? 'primary-btn-disabled' : 'primary-btn'
                    }
                    disabled={!username || isAdLoading}
                    onClick={handleStartClick}
                  >
                    {isAdLoading
                      ? 'Loading...'
                      : !isTelegram
                      ? 'START'
                      : 'START'}
                  </button>
                </>
              )}

              {step === 'processing' && (
                <div className="processing-wrapper">
                  <div className="status-label-row">
                    <span className="current-log">{log}</span>
                    <span className="status-tag">Live</span>
                  </div>
                  <div className="progress-container">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="progress-shine" />
                    </div>
                  </div>
                  <div className="progress-details">
                    <span className="percent-number">
                      {Math.round(progress)}%
                    </span>
                    <span className="sub-text">Decrypting Data...</span>
                  </div>
                  <button
                    className="boost-btn"
                    style={{
                      backgroundColor: '#FFD700',
                      color: '#000',
                      padding: '10px',
                      marginTop: '10px',
                    }}
                    onClick={handleBoost}
                    disabled={boosts === 0 || boostCooldown > 0 || isAdLoading}
                  >
                    {boostCooldown > 0
                      ? `Next Boost in ${boostCooldown}s...`
                      : boosts > 0
                      ? `Boost Progress (${boosts} left)`
                      : 'Processing...'}
                  </button>
                </div>
              )}

              {step === 'results' && (
                <Result
                  username={username}
                  carouselItems={carouselItems}
                  carouselIndex={carouselIndex}
                  setCarouselIndex={setCarouselIndex}
                  postImages={postImages}
                  handleContentLocker={handleContentLocker}
                  setPreviewImage={setPreviewImage}
                />
              )}
            </div>
          )}

          {/* Recent & Vault Tabs remain mapped per original UI */}
          {activeTab === 'recent' && (
            <div className="recent-container-fixed">
              <div className="recent-header-row"></div>

              {/* This wrapper is what will scroll */}
              <div className="recent-scroll-area">
                {[
                  {
                    u: 'kirti_cutie32',
                    m: '138 followers',
                    t: '2m ago',
                    color: '#ff4d4d',
                  },
                  {
                    u: 'augustkoldso',
                    m: '219 followers',
                    t: '8m ago',
                    color: '#7d5fff',
                  },
                  {
                    u: 'jacob.dyas',
                    m: '1.4k followers',
                    t: '12m ago',
                    color: '#17c0eb',
                  },
                  {
                    u: '_elly.7._',
                    m: '57 followers',
                    t: '15m ago',
                    color: '#32ff7e',
                  },
                ].map((item, idx) => (
                  <div
                    className="recent-item"
                    key={item.u}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div
                      className="avatar-ring"
                      style={{ borderColor: item.color }}
                    >
                      <div
                        className="avatar-inner"
                        style={{ background: item.color }}
                      >
                        {item.u[0].toUpperCase()}
                      </div>
                    </div>
                    <div className="recent-info">
                      <div className="user-row">
                        <b>@{item.u}</b>
                      </div>
                      <span>{item.m}</span>
                    </div>
                    <div className="recent-time">{item.t}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'vault' && (
            <div className="vault-view">
              <p className="sub-text">Recent Unlocked Media.</p>
              <div className="blur-grid">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="blur-item"
                    style={{
                      backgroundImage: `url(https://picsum.photos/id/${
                        i + 45
                      }/200)`,
                    }}
                  >
                    <div className="lock-overlay">🔒</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <TelegramPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
      </div>

      {previewImage && (
        <div
          className="full-screen-modal"
          onClick={() => setPreviewImage(null)}
        >
          <div className="modal-content">
            <img src={previewImage} alt="Full Preview" />
            <button className="close-modal">×</button>
          </div>
        </div>
      )}
      {/*showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ marginBottom: '10px' }}>Welcome!</h2>
            <p
              style={{
                color: COLORS.textMuted,
                fontSize: '14px',
                marginBottom: '24px',
              }}
            >
              Please complete this to continue.
            </p>
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label
                style={{
                  fontWeight: '700',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                I am:
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: `1px solid ${COLORS.border}`,
                }}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div
              style={{
                marginBottom: '24px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{ transform: 'scale(1.2)' }}
              />
              <label
                htmlFor="terms"
                style={{ fontSize: '13px', color: COLORS.textMain }}
              >
                I agree to the Terms and Conditions
              </label>
            </div>
            {!notificationAllowed ? (
              <button
                onClick={handleSubscribe}
                style={{
                  width: '100%',
                  marginBottom: '15px',
                  background: '#f8f9fa',
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.textMain,
                  padding: '12px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                🔔 Enable Notifications to Continue
              </button>
            ) : (
              <div
                style={{
                  color: COLORS.success,
                  fontSize: '13px',
                  fontWeight: '700',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                }}
              >
                ✅ Notifications Enabled
              </div>
            )}
            <button
              onClick={handleOnboardingSubmit}
              disabled={!gender || !agreed || !notificationAllowed || isLoading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background:
                  gender && agreed && notificationAllowed
                    ? COLORS.gradient
                    : COLORS.disabled,
                color: '#fff',
                fontWeight: '700',
                cursor:
                  gender && agreed && notificationAllowed && !isLoading
                    ? 'pointer'
                    : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              {isLoading ? (
                <>
                  <div style={spinnerStyle}></div>
                  Please wait...
                </>
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </div>
      )*/}
      {/*showNotifPopup && !isTelegram && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ marginBottom: '10px' }}>Insta Viewer 🔍</h2>

            <p
              style={{
                fontSize: '14px',
                color: COLORS.textMuted,
                marginBottom: '20px',
              }}
            >
              Get instant updates when private profile add new posts or stories.
              <br />
              Enable notifications to continue.
            </p>

            {!notificationAllowed ? (
              <button
                onClick={async () => {
                  await handleSubscribe();
                  setShowNotifPopup(false);
                }}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: COLORS.gradient,
                  color: '#fff',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                🔔 Enable Notifications
              </button>
            ) : (
              <div
                style={{
                  color: COLORS.success,
                  fontWeight: '700',
                  marginBottom: '10px',
                }}
              >
                ✅ Notifications Enabled
              </div>
            )}

            <button
              onClick={() => setShowNotifPopup(false)}
              disabled={!notificationAllowed}
              style={{
                marginTop: '10px',
                background: 'transparent',
                border: 'none',
                color: notificationAllowed ? COLORS.textMuted : '#bbb',
                cursor: notificationAllowed ? 'pointer' : 'not-allowed',
                fontSize: '13px',
              }}
            >
              DONE
            </button>
          </div>
        </div>
      )*/}
    </>
  );
};

export default Private;
