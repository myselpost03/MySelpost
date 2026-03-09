import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { supabase } from '../Utils/supabaseClient';
import InstaPopup from '../Components/InstaPopup';
import Tip from './Tip';
import group from '../Assets/group.jpg';
import kofi from "../Assets/kofi.jpg";
import Header from '../Components/Header';
import Demo from './Demo';
import '../Styles/Private.css';

const Results = () => {
  const [step, setStep] = useState('results');
  const [activeTab, setActiveTab] = useState('home');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [progress, setProgress] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(
    Math.floor(Math.random() * 1000) + 9000
  );
  const [log, setLog] = useState('Initializing secure handshake...');
  const [queuePos] = useState(Math.floor(Math.random() * 200) + 114);
  const [showPopup, setShowPopup] = useState(false);
  const [countryCode, setCountryCode] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();
  // Carousel Data
  const carouselItems = [
    { type: 'media', title: 'Posts History', count: 9, icon: '📸' },
  ];
  const [lastSearchTime, setLastSearchTime] = useState(
    localStorage.getItem('lastSearchTime') || null
  );
  const [isLocked, setIsLocked] = useState(false);

  const postImages = React.useMemo(() => {
    return Array.from({ length: 9 }, (_, i) => ({
      id: i,
      url: i === 0 ? kofi : `https://picsum.photos/seed/post${i}/300/300`,
    }));
  }, []);

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

  useEffect(() => {
    if (step === 'processing') {
      const stages = [
        'Establishing secure tunnel...',
        'Overriding handshake protocol...',
        'Bypassing SSL pinning...',
        'Extracting encrypted shards...',
        'Reassembling media packets...',
        'Decrypting metadata...',
        'Finalizing secure connection...',
      ];

      let currentTick = 0;

      // Interval set to 250ms (~25 seconds total)
      const interval = setInterval(() => {
        setStep((prevStep) => {
          // Random increment logic:
          // Sometimes it moves 1%, sometimes it "stalls" (0)
          const increment = Math.random() > 0.3 ? 1 : 0;
          currentTick += increment;

          const p = Math.min((currentTick / 100) * 100, 100);
          setProgress(p);

          // Log update logic
          const logIndex = Math.floor((p / 101) * stages.length);
          setLog(stages[logIndex]);

          if (p >= 100) {
            clearInterval(interval);
            // 2 second "Hold" at 100% for dramatic effect
            setTimeout(() => navigate('/results', { state: { username } }), 500);
          }
          return 'processing';
        });
      }, 250); // 250ms = slower, more deliberate pace

      return () => clearInterval(interval);
    }
  }, [step]);
  const handleStartSearch = () => {
    const now = new Date().getTime();
    localStorage.setItem('lastSearchTime', now);
    setLastSearchTime(now);
    setIsLocked(true);
    setStep('processing');
  };
  return (
    <>
      <Header />
      <div className="bg-container">
        <div className="glass-card">
          {step !== 'results' && (
            <div className="live-indicator">
              <div className="dot"></div>
              <b>{onlineUsers.toLocaleString()}</b>
              <span style={{ marginLeft: '4px', opacity: 0.6 }}>Online</span>
            </div>
          )}
          <div className="tab-nav">
            {['recent', 'home', 'stories'].map((t) => (
              <button
                key={t}
                className={`tab-btn ${activeTab === t ? 'active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {activeTab === 'home' && (
            <div className="fade-content">
              {step === 'home' && (
                <>
                  <h2 className="title-text">Insta Viewer</h2>
                  <p className="sub-text">Enter Target ID to scan profile.</p>
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
                  <button
                    className="primary-btn"
                    disabled={!username || isLocked}
                    onClick={handleStartSearch}
                  >
                    {isLocked ? '1 Search Allowed Per Week' : 'START'}
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

              {step === 'results' && (
                <Demo
                  username={username}
                  carouselItems={carouselItems}
                  carouselIndex={carouselIndex}
                  setCarouselIndex={setCarouselIndex}
                  postImages={postImages}
                  handleContentLocker={handleVIP}
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

{activeTab === 'stories' && (
  <div className="stories-view">
    <p className="sub-text">Recent Stories of Target User</p>
    <div className="stories-grid">
      {[1, 2,3].map((num) => (
        <div 
          key={num} 
          className="story-item" 
          onClick={() => {
            handleVIP();
          }}
        >
          <div className="story-ring">
            <img src={group} alt="Story" className="story-thumb" />
            <div className="lock-overlay-small">🔒</div>
          </div>
          <span>Story {num}</span>
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
        {countryCode === 'IN' ? (
          <InstaPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
        ) : (
          <InstaPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
        )}
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
    </>
  );
};

export default Results;
