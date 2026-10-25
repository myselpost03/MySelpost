import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Utils/supabaseClient';
import Header from '../Components/Header';
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
  const [countryCode, setCountryCode] = useState(null);

  // User & Streak Tracking States (No Login System)
  const [userId, setUserId] = useState('');
  const [unlockChoice, setUnlockChoice] = useState(null); // 'paid' or 'free'
  const [streakDays, setStreakDays] = useState(0);
  const [todayGames, setTodayGames] = useState(0);
  const [isStreakPending, setIsStreakPending] = useState(false);

  // Modals & Popups States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTelegramPopup, setShowTelegramPopup] = useState(false);
  const [showVipInfoPopup, setShowVipInfoPopup] = useState(false);
  const [vipPopupMessage, setVipPopupMessage] = useState('');

  // Email Saving States
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const navigate = useNavigate();

  // Check if running on localhost or with dev query param (?dev=true) for testing
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '192.168.29.135' || window.location.search.includes('dev=true');

  // Check if running inside Telegram Mini App environment (or bypassed in dev)
  const isTelegram =
    isDev ||
    (typeof window !== 'undefined' &&
      window.Telegram?.WebApp &&
      window.Telegram.WebApp.initData !== '');

  // Initialize User ID and Fetch Streak Progress from Supabase on Mount
  useEffect(() => {
    let id = '';
    if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
      id = String(window.Telegram.WebApp.initDataUnsafe.user.id);
    } else {
      id = localStorage.getItem('app_user_uuid');
      if (!id) {
        id = 'user_' + Math.random().toString(36).substring(2, 11);
        localStorage.setItem('app_user_uuid', id);
      }
    }
    setUserId(id);
    fetchUserProgress(id);
  }, []);

  const fetchUserProgress = async (id) => {
    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', id)
        .single();

      if (data) {
        setUnlockChoice(data.unlock_type);
        setStreakDays(data.streak_days || 0);
        setTodayGames(data.today_games || 0);

        // Check if user missed a day (streak broken -> pending status)
        const lastActive = data.last_active_date ? new Date(data.last_active_date) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (lastActive) {
          lastActive.setHours(0, 0, 0, 0);
          const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
          if (diffDays > 1 && (data.streak_days || 0) < 15) {
            setIsStreakPending(true);
          }
        }

        // PERSISTENT QUEUE REQUIREMENT: If user opted for free and streak < 15, keep queue persistent
        if (data.unlock_type === 'free' && (data.streak_days || 0) < 15) {
          setStep('queue');
          setActiveTab('home');
        }
      }
    } catch (err) {
      console.log('No existing streak record found.');
    }
  };

  // Option 2 Click Handler (Free 15-Day Streak Route)
  const handleFreeTaskClick = async (e) => {
    e.preventDefault();
    if (!isTelegram && !isDev) {
      setShowTelegramPopup(true);
      return;
    }

    setUnlockChoice('free');
    
    // Save free option selection to Supabase
    try {
      await supabase.from('user_streaks').upsert([
        {
          user_id: userId,
          unlock_type: 'free',
          streak_days: streakDays || 0,
          today_games: todayGames || 0,
          last_active_date: new Date().toISOString(),
          completed: false
        }
      ], { onConflict: 'user_id' });
    } catch (err) {
      console.error('Error saving free choice:', err);
    }

    setStep('queue');
  };

  const handleTelegramRedirect = () => {
    window.open('https://t.me/myselpost_bot/myselpost', '_blank');
  };

  const handleInputFocus = (e) => {
    if (!isTelegram && !isDev) {
      e.target.blur();
      setShowTelegramPopup(true);
    }
  };

  const handleVIP = () => {
    window.open('https://lnkmeup.com/unlock/lryHg2hc', '_blank');
    setShowPaymentModal(false);
    setShowVipInfoPopup(false);
  };

  const creditUserReward = async (userId, amount) => {
    console.log(`Credit ${amount} to user ${userId}`);
  };

  useEffect(() => {
    if (!isTelegram) return;

    if (!window.loadOfferWallSDK) {
      const script = document.createElement('script');
      script.src = 'https://wall.giga.pub/api/v1/loader.js?projectId=6133';
      script.async = true;
      document.head.appendChild(script);
    }

    (window.loadGigaSDKCallbacks || (window.loadGigaSDKCallbacks = [])).push(
      () => {
        window
          .loadOfferWallSDK({
            projectId: '6133',
          })
          .then((sdk) => {
            window.gigaOfferWallSDK = sdk;
            sdk.on('rewardClaim', async (data) => {
              console.log('Reward claim received:', data);
              await creditUserReward(data.userId, data.amount);
              sdk.confirmReward(data.rewardId, data.hash);
            });
          })
          .catch((error) => {
            console.error('Error loading SDK:', error);
          });
      },
    );
  }, [isTelegram]);

  const handleLoadMoreClick = () => {
    if (!isTelegram && !isDev) {
      setShowTelegramPopup(true);
      return;
    }
    setVipPopupMessage('Only VIP users can access the full archive of searched profiles list.');
    setShowVipInfoPopup(true);
  };

  const handleVaultItemClick = () => {
    if (!isTelegram && !isDev) {
      setShowTelegramPopup(true);
      return;
    }
    setVipPopupMessage('This feature and full media un-blurring is accessible exclusively to VIP users.');
    setShowVipInfoPopup(true);
  };

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
          setCountryCode(data.country_code);
        } else {
          setCountryCode('US');
        }
      } catch (error) {
        console.warn('Location detection failed:', error);
        setCountryCode('US');
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

      const totalDuration = 60000;
      const intervalMs = 200;
      const totalTicks = totalDuration / intervalMs;
      const incrementPerTick = 100 / totalTicks;

      let currentStage = -1;

      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = Math.min(prev + incrementPerTick, 100);
          const stageIndex = Math.floor((newProgress / 100) * stages.length);

          if (stageIndex !== currentStage && stages[stageIndex]) {
            currentStage = stageIndex;
            setLog(stages[stageIndex]);
          }

          if (newProgress >= 100) {
            clearInterval(interval);
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
        <div className="viewer-banner"></div>

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
            <b style={{ color: '#000' }}>{onlineUsers.toLocaleString()}</b>{' '}
            <span
              style={{
                color: '#000',
                fontWeight: 'bold',
                marginLeft: '4px',
                opacity: 0.6,
              }}
            >
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
              {/* If user opted for free, lock/persist them on the queue page */}
              {unlockChoice === 'free' && streakDays < 15 ? (
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
                    15-Day Free Streak Active
                  </h2>

                  <div className="queue-ticket">
                    <div className="ticket-top">
                      <span>
                        TICKET_ID: {userId ? userId.substring(0, 8).toUpperCase() : 'QUEUED'}
                      </span>
                      <span className="live-tag">● STREAK LOCKED</span>
                    </div>
                    <div className="ticket-main">
                      <span className="queue-label">FREE UNLOCK STATUS</span>
                      <div className="queue-number" style={{ fontSize: '1.4rem', margin: '8px 0' }}>
                        {streakDays} / 15 Days Completed
                      </div>
                      <div className="ticket-grid">
                        <div className="grid-item">
                          <span>Streak Status</span>
                          <b style={{ color: isStreakPending ? '#dc2626' : '#16a34a' }}>
                            {isStreakPending ? 'Pending (Missed Day)' : 'Active Streak'}
                          </b>
                        </div>
                        <div className="grid-item">
                          <span>Today's Games</span>
                          <b>{todayGames}/7 Played</b>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 15-Day Streak Progress Bar Card */}
                  <div style={{ marginTop: '16px', backgroundColor: '#fff', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b' }}>Daily Progress Tracker</span>
                      <span style={{ fontSize: '12px', color: isStreakPending ? '#dc2626' : '#16a34a', fontWeight: 'bold' }}>
                        {isStreakPending ? '⚠️ Progress Pending' : `${Math.round((streakDays / 15) * 100)}% Done`}
                      </span>
                    </div>

                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
                      <div style={{ width: `${(streakDays / 15) * 100}%`, height: '100%', backgroundColor: isStreakPending ? '#dc2626' : '#22c55e', transition: 'width 0.3s ease' }}></div>
                    </div>

                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                      {isStreakPending 
                        ? 'You missed playing games yesterday! Complete today’s 7 games to restore your streak.'
                        : 'Come daily for 15 straight days and play 7 games daily to unlock your profile for free.'}
                    </p>

                    <button
                      onClick={() => navigate('/demo')}
                      style={{
                        width: '100%',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '14px',
                        boxShadow: '0 4px 10px rgba(0, 123, 255, 0.3)'
                      }}
                    >
                      🎮 Play Today's 7 Games ({7 - Math.min(todayGames, 7)} left)
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {step === 'home' && (
                    <>
                      <h2
                        className="title-text"
                        style={{ color: '#000', whiteSpace: 'nowrap' }}
                      >
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
                            onFocus={handleInputFocus}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                          <div className="input-glow"></div>
                        </div>
                      </div>

                      <button
                        className="primary-btn"
                        disabled={!username}
                        style={{
                          opacity: username ? 1 : 0.5,
                          cursor: username ? 'pointer' : 'not-allowed',
                        }}
                        onClick={() => {
                          if (!isTelegram && !isDev) {
                            setShowTelegramPopup(true);
                          } else if (username) {
                            setStep('processing');
                          }
                        }}
                      >
                        START
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
                          <span className="queue-label">EST. WAIT TIME</span>
                          <div className="queue-number">2 Months</div>
                          <div className="ticket-grid">
                            <div className="grid-item">
                              <span>Queue Position</span>
                              <b>#212</b>
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

                      <div className="unlock-options-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                        
                        {/* Option 1: Fast Paid Route */}
                        <a
                          className="vip-btn-premium no-underline"
                          style={{
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            if (!isTelegram && !isDev) {
                              setShowTelegramPopup(true);
                            } else {
                              setShowPaymentModal(true);
                            }
                          }}
                        >
                          <span className="vip-badge-label" style={{ marginRight: '8px' }}>PAID</span>
                          <strong>Unlock Profile Now</strong>
                        </a>

                        {/* Option 2: Free Route via 15-Day Streak & 7 Daily Games */}
                        <a
                          className="free-btn-tasks no-underline"
                          style={{
                            textDecoration: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: '1px solid #007bff',
                            backgroundColor: '#f8f9fa',
                            color: '#333',
                            cursor: 'pointer'
                          }}
                          onClick={handleFreeTaskClick}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ backgroundColor: '#28a745', color: '#fff', fontSize: '11px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>FREE</span>
                            <strong>Unlock in 15 Days</strong>
                          </div>
                          <span style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                            Play 7 games daily for 15 straight days
                          </span>
                        </a>
                      </div>

                      <div className="notify-box">
                        <label className="notify-label">QUEUE NOTIFICATION</label>
                        <div className="notify-input-wrapper">
                          <input
                            type="email"
                            className="notify-input"
                            placeholder="Enter email for alerts..."
                            value={email}
                            onFocus={handleInputFocus}
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
                        {saveStatus && (
                          <p style={{ fontSize: '0.75rem', marginTop: '5px' }}>
                            {saveStatus}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

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
                    <b style={{ color: '#000' }}>@{item.u}</b>
                    <span>{item.m}</span>
                  </div>
                  <div className="recent-time">{item.t}</div>
                </div>
              ))}
              <button className="load-more-btn" onClick={handleLoadMoreClick}>
                Load More
              </button>
            </div>
          )}

          {activeTab === 'vault' && (
            <div className="vault-view">
              <p className="sub-text" style={{ marginBottom: '15px' }}>
                Recent Unlocked Media (Real Preview).
              </p>
              <div className="blur-grid">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="blur-item"
                    onClick={handleVaultItemClick}
                    style={{
                      backgroundImage: `url(https://picsum.photos/id/${i + 10}/200)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '4px',
                      background: 'rgba(0,0,0,0.6)',
                      color: '#fff',
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      🔒 VIP
                    </div>
                  </div>
                ))}
              </div>
              <button 
                className="load-more-btn" 
                onClick={handleVaultItemClick}
                style={{ marginTop: '16px', width: '100%' }}
              >
                Load More Vault Items
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TELEGRAM REDIRECT POPUP */}
      {showTelegramPopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px'
        }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '380px', padding: '24px', textAlign: 'center', position: 'relative' }}>
            <button onClick={() => setShowTelegramPopup(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📱</div>
            <h3 style={{ margin: '12px 0 6px 0', fontSize: '18px', color: '#1e293b' }}>Access Required in Telegram</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>Please open this app inside Telegram.</p>
            <button onClick={handleTelegramRedirect} style={{ width: '100%', backgroundColor: '#24A1DE', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>🚀 Open App in Telegram</button>
          </div>
        </div>
      )}

      {/* VIP EXCLUSIVE FEATURE POPUP */}
      {showVipInfoPopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px'
        }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '380px', padding: '24px', textAlign: 'center', position: 'relative' }}>
            <button onClick={() => setShowVipInfoPopup(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}>✕</button>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>👑</div>
            <h3 style={{ margin: '12px 0 6px 0', fontSize: '18px', color: '#1e293b' }}>Unlock Full Access</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>{vipPopupMessage}</p>
            <button onClick={() => { setShowVipInfoPopup(false); setShowPaymentModal(true); }} style={{ width: '100%', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>Get VIP Fast Pass (₹99)</button>
          </div>
        </div>
      )}

      {/* PROFESSIONAL PAYMENT MODAL POPUP */}
      {showPaymentModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px'
        }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '380px', padding: '24px', position: 'relative' }}>
            <button onClick={() => setShowPaymentModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}>✕</button>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: '12px 0 4px 0', fontSize: '18px', color: '#1e293b' }}>Instant Profile Unlock</h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Target: <b>@{username || 'user'}</b></p>
            </div>
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '20px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>VIP Fast Pass Fee</span>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '4px 0' }}>₹99</div>
            </div>
            <button onClick={handleVIP} style={{ width: '100%', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>Proceed to Secure Pay</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Private;