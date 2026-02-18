import React, { useState, useEffect } from 'react';
import { supabase } from '../Utils/supabaseClient';
import UPI from './UPI';
import Tip from './Tip';
import Header from '../Components/Header';
import OneSignal from 'react-onesignal';
import AdsterraBanner from '../Components/AdsterraBanner';
import '../Styles/Private.css';

const Private = () => {
  const [step, setStep] = useState('home');
  const [activeTab, setActiveTab] = useState('home');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [progress, setProgress] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(42531);
  const [log, setLog] = useState('Initializing secure handshake...');
  const [queuePos] = useState(Math.floor(Math.random() * 200) + 114);
  const [showPopup, setShowPopup] = useState(false);
  const [countryCode, setCountryCode] = useState(null);

  // New States for Notification
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // For feedback messages
  const [notificationAllowed, setNotificationAllowed] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);

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
  const handleVIP = () => setShowPopup(true);

  // Email Save Function
  const handleSaveEmail = async () => {
    if (!email || !email.includes('@')) {
      setSaveStatus('❌ Please enter a valid email.');
      return;
    }

    if (!username) {
      setSaveStatus('❌ Username missing.');
      return;
    }

    setIsSaving(true);
    setSaveStatus('📡 Syncing with server...');

    try {
      const { error } = await supabase.from('instaviewer').insert([
        {
          email: email,
          username: username,
        },
      ]);

      if (error) throw error;

      setSaveStatus('✅ Alert Active! We will email you.');
      setEmail('');
    } catch (err) {
      console.error(err);
      setSaveStatus('⚠️ Connection error. Try again.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(''), 4000);
    }
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

  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineUsers((prev) => {
        const change = Math.floor(Math.random() * 40) - 20;
        return Math.min(Math.max(prev + change, 30000), 50000);
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (step === 'processing') {
      const stages = [
        'Initializing secure tunnel...',
        'Authenticating node access...',
        'Requesting cluster access...',
        'Bypassing SSL Pinning...',
        'Fetching Profile Shards...',
        'Validating session tokens...',
        'Decrypting Media metadata...',
        'Reconstructing fragments...',
        'Finalizing Handshake...',
        'Completing secure transfer...',
      ];

      const totalDuration = 60000; // 60 seconds total
      const intervalMs = 200; // update every 200ms
      const totalTicks = totalDuration / intervalMs; // 300 ticks
      const incrementPerTick = 100 / totalTicks; // exact progress increment

      let tick = 0;
      let currentStage = -1;

      const interval = setInterval(() => {
        tick++;

        setProgress((prev) => {
          const newProgress = Math.min(prev + incrementPerTick, 100);

          // Change stages based on progress %
          const stageIndex = Math.floor((newProgress / 100) * stages.length);

          if (stageIndex !== currentStage && stages[stageIndex]) {
            currentStage = stageIndex;
            setLog(stages[stageIndex]);
          }

          if (newProgress >= 100) {
            clearInterval(interval);

            // small delay before queue screen
            setTimeout(() => {
              setStep('queue');
            }, 1500);
          }

          return newProgress;
        });
      }, intervalMs);

      return () => clearInterval(interval);
    }
  }, [step]);
  return (
    <>
      <Header />

      <div
        className="bg-container"
        style={{ marginTop: '20PX', display: 'flex', flexDirection: 'column' }}
      >
      <div className="viewer-banner">
 {/* <AdsterraBanner />*/}
        </div>

        <style>{`
        @keyframes pulse-red {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 82, 82, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 82, 82, 0); }
        }
        .red-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background-color: #ff5252;
          border-radius: 50%;
          margin-right: 8px;
          vertical-align: middle;
          animation: pulse-red 2s infinite;
        }
      `}</style>

        <div className="glass-card">
          <div className="live-indicator">
            <div className="dot"></div>
            <b>{onlineUsers.toLocaleString()}</b>{' '}
            <span style={{ marginLeft: '4px', opacity: 0.6 }}>
              Users Online
            </span>
          </div>

          <div className="tab-nav">
            <button
              className={`tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
              onClick={() => setActiveTab('recent')}
            >
              Recent
            </button>
            <button
              className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              Search
            </button>
            <button
              className={`tab-btn ${activeTab === 'vault' ? 'active' : ''}`}
              onClick={() => setActiveTab('vault')}
            >
              Vault
            </button>
          </div>

          {activeTab === 'home' && (
            <div className="fade-content">
              {step === 'home' && (
                <>
                  <h2 className="title-text" style={{ whiteSpace: 'nowrap' }}>
                    Insta Viewer
                  </h2>
                  <p className="sub-text">
                    Enter Target ID to initiate fetching profile.
                  </p>
                  <div className="input-group-modern">
                    <label className="input-label-premium">
                      <span className="label-icon">👤</span> Profile
                    </label>
                    <div className="input-wrapper">
                      <input
                        className="premium-input"
                        placeholder="Enter @username..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <div className="input-glow"></div>
                    </div>
                  </div>
                  {/* Allow Notification Button */}
                  {!notificationAllowed && (
                    <button
                      className="primary-btn"
                      onClick={handleSubscribe}
                      style={{
                        marginBottom: '12px',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px 18px',
                        fontSize: '14px',
                        fontWeight: '600',
                        letterSpacing: '0.4px',
                        cursor: 'pointer',
                        boxShadow: '0 6px 18px rgba(102, 126, 234, 0.35)',
                        transition: 'all 0.25s ease',
                        width: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow =
                          '0 10px 25px rgba(102, 126, 234, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow =
                          '0 6px 18px rgba(102, 126, 234, 0.35)';
                      }}
                    >
                      🔔 Allow Notification
                    </button>
                  )}

                  {/* Unlock Button */}
                  <button
                    className="primary-btn"
                    disabled={!notificationAllowed || !username}
                    style={{
                      opacity: notificationAllowed && username ? 1 : 0.5,
                      cursor:
                        notificationAllowed && username
                          ? 'pointer'
                          : 'not-allowed',
                    }}
                    onClick={() =>
                      notificationAllowed && username && setStep('processing')
                    }
                  >
                    START
                  </button>

                  {/* Optional helper text */}
                  {!notificationAllowed && (
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#888',
                        marginTop: '8px',
                      }}
                    >
                      Enable notifications to view profiles.
                    </p>
                  )}
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
                </div>
              )}

              {step === 'queue' && (
                <div className="fade-in">
                  <h2
                    style={{
                      fontSize: '1rem',
                      marginBottom: '20px',
                      color: '#ff5252',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      fontFamily: 'poppins',
                      fontWeight: '600',
                      letterSpacing: '0.5px',
                    }}
                  >
                    <span className="red-dot"></span>
                    High Traffic: In Line
                  </h2>

                  <div className="queue-ticket">
                    <div className="ticket-top">
                      <span>
                        TICKET_ID:{' '}
                        {Math.random().toString(36).substring(7).toUpperCase()}
                      </span>
                      <span className="live-tag">● QUEUED</span>
                    </div>
                    <div className="ticket-main">
                      <span className="queue-label">CURRENT POSITION</span>
                      <div className="queue-number">#{queuePos}</div>
                      <div className="ticket-grid">
                        <div className="grid-item">
                          <span>Est. Wait</span>
                          <b>~14 days</b>
                        </div>
                        <div className="grid-item">
                          <span>Status</span>
                          <b>Waiting</b>
                        </div>
                        <div className="grid-item">
                          <span>Server Area</span>
                          <b>United States</b>
                        </div>
                        <div className="grid-item">
                          <span>User Type</span>
                          <b>Standard</b>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 1. VIP Bypass moved BEFORE notification box */}
                  <button
                    className="vip-btn-premium"
                    style={{ marginBottom: '20px' }}
                    onClick={handleVIP}
                  >
                    <span className="vip-badge-label">VIP</span>
                    BYPASS QUEUE NOW
                  </button>

                  {/* 2. Notification Box */}
                  <div className="notify-box">
                    <label className="notify-label">QUEUE NOTIFICATION</label>
                    <div className="notify-input-wrapper">
                      <input
                        type="email"
                        className="notify-input"
                        placeholder="Enter email for alerts..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSaving}
                      />
                      <button
                        className="notify-submit"
                        onClick={handleSaveEmail}
                        disabled={isSaving}
                      >
                        {isSaving ? '...' : 'Submit'}
                      </button>
                    </div>
                    <p
                      style={{
                        fontSize: '0.65rem',
                        color: '#999',
                        marginTop: '6px',
                      }}
                    >
                      We will notify you when your position reaches #1
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ... Rest of the component (Recent/Vault tabs) remains the same ... */}
          {activeTab === 'recent' && (
            <div className="recent-list">
              {[
                { u: 'kirti_cutie32', m: '130 followers', t: '2m ago' },
                { u: 'neerajlodhi7681', m: '256 followers', t: '8m ago' },
                { u: 'jany_0257', m: '126 followers', t: '15m ago' },
                { u: 'sanviiikapoor', m: '374 followers', t: '22m ago' },
              ].map((item) => (
                <div className="recent-item" key={item.u}>
                  <div className="avatar-ring">
                    <div className="avatar-inner">
                      {item.u[0].toUpperCase()}
                    </div>
                  </div>
                  <div className="recent-info">
                    <b>@{item.u}</b>
                    <span>{item.m}</span>
                  </div>
                  <div className="recent-time">{item.t}</div>
                </div>
              ))}
              <div style={{ marginLeft: '-30.8px' }}>
               {/* <AdsterraBanner />*/}
              </div>

              <button className="load-more-btn" onClick={handleVIP}>
                Load More
              </button>
            </div>
          )}

          {activeTab === 'vault' && (
            <div className="vault-view">
             <div style={{ marginLeft: '-30.8px' }}>
               {/* <AdsterraBanner />*/}
              </div>

              <p className="sub-text" style={{ marginBottom: '15px' }}>
                Recent Unlocked Media.
              </p>
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
         <div style={{ marginLeft: '-30.8px' }}>
           {/* <AdsterraBanner />*/}
          </div>
        </div>
        {/* Only render if we have a country code, or default to UPI if you want to prioritize India */}
        {countryCode === 'IN' ? (
          <UPI isOpen={showPopup} onClose={() => setShowPopup(false)} />
        ) : (
          <Tip isOpen={showPopup} onClose={() => setShowPopup(false)} />
        )}
      </div>
    </>
  );
};

export default Private;
