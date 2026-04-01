import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../Utils/supabaseClient';
import Header from '../Components/Header';
import ReactCountryFlag from 'react-country-flag';
import QuizPopup from '../Components/QuizPopup';
import CommunityPopup from '../Components/CommunityPopup';
import AdsterraNativeBanner from '../Components/AdsterraNativeBanner';
import { isTelegram } from '../Utils/useIsTelegram';
import '../Styles/Adult.css';

const Adult = () => {
  const [comments, setComments] = useState({});
  const [showPopup, setShowPopup] = useState(false); // For Web (CommunityPopup)
  const [isQuizOpen, setIsQuizOpen] = useState(false); // For Telegram (QuizPopup)
  const [countryCode, setCountryCode] = useState('US');
  const [isAdLoading, setIsAdLoading] = useState(false);
  const adShowRef = useRef(null);

const handlePopup = () => {
  if (isTelegram) {
    setIsQuizOpen(true);   // Telegram
  } else {
    setShowPopup(true);   // Browser
  }
};

  // Restoration: Scroll/Wheel Trigger for Community Popup (Web Only)
  const handleCommentScroll = (e) => {
    if (!isTelegram && e.target.scrollTop > 5) {
      setShowPopup(true);
      e.target.scrollTop = 0;
    }
  };

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const ipData = await res.json();
        if (ipData && ipData.country) setCountryCode(ipData.country);
      } catch (e) {
        console.warn('Geo location detection failed.');
      }
    };
    detectLocation();
    fetchComments();
  }, []);

  // Ad SDK Init
  useEffect(() => {
    if (window.initCdTma) {
      window
        .initCdTma({ id: '433423' })
        .then((show) => {
          adShowRef.current = show;
        })
        .catch((e) => console.error('Ad Init Error:', e));
    }
  }, []);

  const images = [
    {
      id: 1,
      url: '/Games/1.jpg',
      title: 'First Sight',
      views: '542k',
      likes: '420k',
      time: '2h ago',
    },
    {
      id: 2,
      url: '/Games/2.jpg',
      title: 'Sunset Glow',
      views: '854k',
      likes: '612k',
      time: '5h ago',
    },
    {
      id: 3,
      url: '/Games/3.jpg',
      title: 'Hand in Hand',
      views: '92.4k',
      likes: '22k',
      time: '12h ago',
    },
  ];

  const countryGroups = [{ label: 'Indian', data: images }];

  const fetchComments = async () => {
    const { data, error } = await supabase.from('comments').select('*');
    if (error) return;
    const grouped = {};
    data.forEach((row) => {
      if (!grouped[row.image_id]) grouped[row.image_id] = [];
      grouped[row.image_id].push({
        text: row.comment_text,
        country: row.country_code,
      });
    });
    setComments(grouped);
  };

  return (
    <div className="love-page-wrapper">
      <Header />

      {/* Telegram-specific Terms/Quiz Overlay */}
      {isQuizOpen && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.9)',
            zIndex: 10000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <QuizPopup />
          <button
            onClick={() => setIsQuizOpen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              color: 'white',
              background: 'none',
              border: 'none',
              fontSize: '30px',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>
      )}

      <main className="content-container">
        <div
          className="fake-nav-container"
          style={{ marginLeft: '-1%', marginTop: '-9%', marginBottom: '5%' }}
        >
          <div className="fake-menu-icon" onClick={handlePopup}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </div>
          <div className="fake-search-bar">
            <input
              type="text"
              placeholder="Search videos..."
              readOnly
              onClick={handlePopup}
            />
          </div>
        </div>
        <div className="ad-wrapper-native-protected">
          <div className="ad-container-inner-protected">
            <AdsterraNativeBanner />
          </div>
        </div>
        {countryGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="country-section">
            <h2
              style={{
                color: '#ff4d6d',
                margin: '20px 0',
                borderLeft: '5px solid #ff4d6d',
                paddingLeft: '15px',
              }}
            >
              {group.label}
            </h2>
            <div className="love-grid">
              {group.data.map((img) => (
                <div key={img.id} className="love-card">
                  <div className="img-container">
                    <img
                      src={process.env.PUBLIC_URL + img.url}
                      alt={img.title}
                    />
                    <button
                      className="overlay-download-btn"
                      onClick={handlePopup}
                    >
                      Watch Full Video
                    </button>
                  </div>
                  <div className="love-card-body">
                    <div className="comment-area">
                      {/* Restoration: onWheel, onTouch, onScroll triggers */}
                      <div
                        className="comment-display no-scrollbar"
                        onClick={handlePopup}
                        onWheel={handlePopup}
                        onTouchStart={handlePopup}
                        onScroll={handleCommentScroll}
                        style={{
                          height: '75px',
                          overflowY: 'auto',
                          cursor: 'pointer',
                        }}
                      >
                        {comments[img.id]
                          ?.slice()
                          .reverse()
                          .map((c, index) => (
                            <div key={index} className="single-comment">
                              <span>💖</span> {c.text}{' '}
                              <ReactCountryFlag
                                countryCode={c.country}
                                svg
                                style={{ width: '1.2em' }}
                              />
                            </div>
                          ))}
                      </div>
                      <div className="input-box">
                        <input
                          type="text"
                          placeholder="Leave a note..."
                          onKeyDown={handlePopup}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Restoration: Load More Button */}
            <div
              className="load-more-container"
              style={{ textAlign: 'center', margin: '30px 0 60px 0' }}
            >
              <button
                className="load-more-btn"
                onClick={handlePopup}
                style={{
                  padding: '10px 25px',
                  borderRadius: '25px',
                  border: '2px solid #ff4d6d',
                  backgroundColor: 'transparent',
                  color: '#ff4d6d',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Load More {group.label} Content
              </button>
            </div>
          </div>
        ))}

        {/* Web-specific Community Popup */}
        {!isTelegram && (
          <CommunityPopup
            isOpen={showPopup}
            onClose={() => setShowPopup(false)}
          />
        )}
      </main>
    </div>
  );
};

export default Adult;
