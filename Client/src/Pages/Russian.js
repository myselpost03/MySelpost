import React, { useState, useEffect } from 'react';
import { supabase } from '../Utils/supabaseClient';
import Header from '../Components/Header';
import ReactCountryFlag from 'react-country-flag';
import Tip from './Tip';
import AdultPopup from '../Components/AdultPopup';
import '../Styles/Russian.css';

const Russian = () => {
  const [comments, setComments] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [countryCode, setCountryCode] = useState('US'); // Default to US
 const handleClick = () => {
    window.open(
      "https://motorsnag.com/gkkasj8p?key=265fe969263955e511014d3ae8e8f17f",
      "_blank"
    );
  };
  // Fetch user location on mount
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const ipData = await res.json();
        if (ipData && ipData.country) {
          setCountryCode(ipData.country);
        }
      } catch (e) {
        console.warn(
          'Geo location detection failed, defaulting to International.'
        );
      }
    };
    detectLocation();
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
    {
      id: 4,
      url: '/Games/4.jpg',
      title: 'Laughter',
      views: '110k',
      likes: '85k',
      time: '1d ago',
    },
    {
      id: 5,
      url: '/Games/5.jpg',
      title: 'The Promise',
      views: '320k',
      likes: '190k',
      time: '2d ago',
    },
    {
      id: 6,
      url: '/Games/6.jpg',
      title: 'Rainy Days',
      views: '742k',
      likes: '530k',
      time: '3d ago',
    },
    {
      id: 7,
      url: '/Games/7.jpg',
      title: 'Cozy Mornings',
      views: '150k',
      likes: '45k',
      time: '4d ago',
    },
    {
      id: 8,
      url: '/Games/8.jpg',
      title: 'Adventure',
      views: '210k',
      likes: '112k',
      time: '1w ago',
    },
    {
      id: 9,
      url: '/Games/9.jpg',
      title: 'Fun',
      views: '943k',
      likes: '890k',
      time: '1w ago',
    },
  ];

  // UPDATED ORDER: American (Images 7-9), Indian (Images 1-3), Russian (Images 4-6)
  const countryGroups = [
  { label: 'Indian', data: images.slice(0, 3) },
];

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

  const handlePopup = () => setShowPopup(true);

  const handleCommentScroll = (e) => {
    if (e.target.scrollTop > 5) {
      handlePopup();
      e.target.scrollTop = 0;
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="love-page-wrapper">
      <Header />
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
            <svg
              className="search-svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search videos..."
              readOnly
              onClick={handlePopup}
            />
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
                    <div className="fake-stats-overlay">
                      <div className="stats-left">
                        <div
                          className="view-count"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          <span>{img.views}</span>
                        </div>
                        <div
                          className="like-count"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginLeft: '10px',
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="#ff4d6d"
                            stroke="#ff4d6d"
                            strokeWidth="2"
                          >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                          <span>{img.likes}</span>
                        </div>
                      </div>
                      <span className="upload-time">Top Videos</span>
                    </div>
                    <button
                      className="overlay-download-btn"
                      onClick={handlePopup}
                    >
                      Watch Full Video
                    </button>
                  </div>
                  <div className="love-card-body">
                    <div className="comment-area">
                      <div
                        className="comment-display no-scrollbar"
                        onClick={handlePopup}
                        onWheel={handlePopup}
                        onTouchStart={handlePopup}
                        style={{
                          height: '75px',
                          overflow: 'hidden',
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

        {/* CONDITIONAL POPUP RENDERING */}
        {countryCode === 'IN' ? (
          <AdultPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
        ) : (
          <AdultPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
        )}
      </main>
    </div>
  );
};

export default Russian;
