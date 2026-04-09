import React, { useEffect, useRef, useState } from 'react';

// --- Sub-Component for individual Reels remains the same ---
const TelegramReel = ({ postId, onSeen }) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenCounted, setHasBeenCounted] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 100));
  const [dislikes, setDislikes] = useState(Math.floor(Math.random() * 10));
  const [active, setActive] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && !hasBeenCounted) {
          onSeen(postId);
          setHasBeenCounted(true);
        }
      },
      { threshold: 0.6 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasBeenCounted, onSeen, postId]);

  const handleAction = (type) => {
    if (active === type) {
      type === 'like' ? setLikes((l) => l - 1) : setDislikes((d) => d - 1);
      setActive(null);
    } else {
      if (active === 'like') setLikes((l) => l - 1);
      if (active === 'dislike') setDislikes((d) => d - 1);
      type === 'like' ? setLikes((l) => l + 1) : setDislikes((d) => d + 1);
      setActive(type);
    }
  };

  const widgetUrl = `https://t.me/${postId}?embed=1&userpic=0&autoplay=1`;

  return (
    <div ref={containerRef} style={reelSection}>
      <div style={cropWrapper}>
        {isVisible ? (
          <iframe
            src={widgetUrl}
            style={iframeStyle}
            frameBorder="0"
            scrolling="no"
            title={postId}
            allow="autoplay; encrypted-media"
          ></iframe>
        ) : (
          <div style={placeholderStyle}>Loading...</div>
        )}
        <div style={sideBar}>
          <div style={actionItem} onClick={() => handleAction('like')}>
            <span
              style={{
                ...iconStyle,
                color: active === 'like' ? '#ff4757' : '#fff',
              }}
            >
              ❤️
            </span>
            <span style={countText}>{likes}</span>
          </div>
          <div style={actionItem} onClick={() => handleAction('dislike')}>
            <span
              style={{
                ...iconStyle,
                color: active === 'dislike' ? '#2f3542' : '#fff',
              }}
            >
              👎
            </span>
            <span style={countText}>{dislikes}</span>
          </div>
        </div>
        <div style={bottomShield}></div>
      </div>
    </div>
  );
};

// --- Main Video Component ---
const Videos = () => {
  const [viewCount, setViewCount] = useState(0);
  const [filteredPostIds, setFilteredPostIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isIndian, setIsIndian] = useState(true);

  const nextIdRef = useRef(100);
  const loaderRef = useRef(null);

  const CHANNEL_NAME = 'x_hams_t';
  const LOAD_BATCH_SIZE = 5;

  // 1. Telegram Detection
  const isTelegram =
    typeof window !== 'undefined' &&
    (window.Telegram?.WebApp?.initData !== '' ||
      navigator.userAgent.includes('Telegram'));

  const VIEW_LIMIT = isTelegram ? 50 : 10;

  // 2. Persistent View Counting Logic
  useEffect(() => {
    const today = new Date().toDateString();
    const storedData = JSON.parse(localStorage.getItem('user_stats') || '{}');

    // If it's a new day, reset the count for the user
    if (storedData.lastDate !== today) {
      const resetData = { count: 0, lastDate: today };
      localStorage.setItem('user_stats', JSON.stringify(resetData));
      setViewCount(0);
    } else {
      setViewCount(storedData.count || 0);
    }
  }, []);

  useEffect(() => {
    const checkCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country_code !== 'IN') setIsIndian(false);
      } catch (error) {
        console.error('Geo-check failed', error);
      } finally {
        setIsLoading(false);
        loadMoreVideos();
      }
    };
    checkCountry();
  }, [viewCount]); // Re-run if viewCount is loaded

  const loadMoreVideos = () => {
    if (!isIndian || nextIdRef.current <= 0 || viewCount >= VIEW_LIMIT) return;

    setIsLoading(true);
    const seenPosts = JSON.parse(localStorage.getItem('seen_vids') || '[]');
    let newBatch = [];
    let tempPointer = nextIdRef.current;

    while (newBatch.length < LOAD_BATCH_SIZE && tempPointer > 0) {
      const postId = `${CHANNEL_NAME}/${tempPointer}`;
      if (!seenPosts.includes(postId)) {
        newBatch.push(postId);
      }
      tempPointer--;
    }

    nextIdRef.current = tempPointer;
    if (newBatch.length > 0) {
      setFilteredPostIds((prev) => [...prev, ...newBatch]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          isIndian &&
          viewCount < VIEW_LIMIT
        ) {
          loadMoreVideos();
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [isLoading, isIndian, viewCount]);

  const handleReelSeen = (postId) => {
    const seenPosts = JSON.parse(localStorage.getItem('seen_vids') || '[]');
    if (!seenPosts.includes(postId)) {
      // Update seen posts list
      const updatedSeen = [...seenPosts, postId];
      localStorage.setItem('seen_vids', JSON.stringify(updatedSeen));

      // Update and Persist View Count
      setViewCount((prev) => {
        const newCount = prev + 1;
        const today = new Date().toDateString();
        localStorage.setItem(
          'user_stats',
          JSON.stringify({ count: newCount, lastDate: today })
        );
        return newCount;
      });
    }
  };

  const isLocked = viewCount >= VIEW_LIMIT;

  // --- RENDERING LOGIC ---
  if (!isLoading && !isIndian) {
    return (
      <div style={reelSection}>
        <div style={maintenanceModal}>
          <div style={modalIcon}>🌍</div>
          <h2 style={modalTitle}>Coming Soon</h2>
          <p style={modalText}>This feature will come soon for your country.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...reelsContainer,
        overflowY: isLocked ? 'hidden' : 'scroll',
        touchAction: isLocked ? 'none' : 'auto',
      }}
    >
      {filteredPostIds.map((id) => (
        <TelegramReel key={id} postId={id} onSeen={handleReelSeen} />
      ))}

      {!isLocked && nextIdRef.current > 0 && (
        <div ref={loaderRef} style={loaderContainer}>
          {isLoading && <div style={{ color: 'white' }}>Loading...</div>}
        </div>
      )}

      {isLocked && (
        <div style={lockOverlay}>
          <div style={maintenanceModal}>
            <div style={modalIcon}>{isTelegram ? '⏰' : '🔒'}</div>
            <h2 style={modalTitle}>
              {isTelegram ? 'Daily Limit' : 'Community Required'}
            </h2>
            <p style={modalText}>
              {isTelegram
                ? 'You crossed the daily limit, come tomorrow.'
                : 'Join our community to watch more than 10 videos!'}
            </p>
            {!isTelegram && (
              <a
                href="https://t.me/your_channel"
                style={{ textDecoration: 'none' }}
              >
                <div style={timestampBadge}>Join our Telegram App</div>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Styles remain exactly as you provided ---
const loaderContainer = {
  height: '20vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const lockOverlay = {
  width: '100%',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 100,
  background: 'black',
};
const maintenanceModal = {
  width: '90%',
  maxWidth: '400px',
  backgroundColor: '#1a1a1a',
  borderRadius: '24px',
  padding: '40px 20px',
  textAlign: 'center',
  border: '1px solid #333',
  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
  color: '#fff',
};
const modalIcon = { fontSize: '60px', marginBottom: '15px' };
const modalTitle = { fontSize: '24px', margin: '0 0 10px 0', color: '#ff4757' };
const modalText = {
  fontSize: '15px',
  color: '#aaa',
  lineHeight: '1.5',
  margin: '0 0 20px 0',
};
const timestampBadge = {
  backgroundColor: '#333',
  padding: '10px 20px',
  borderRadius: '50px',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#00d2ff',
  cursor: 'pointer',
};
const reelsContainer = {
  width: '100%',
  height: '100vh',
  scrollSnapType: 'y mandatory',
  backgroundColor: '#000',
  scrollbarWidth: 'none',
};
const reelSection = {
  width: '100%',
  height: '100vh',
  scrollSnapAlign: 'start',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const cropWrapper = {
  width: '90%',
  maxWidth: '420px',
  height: '75vh',
  overflow: 'hidden',
  borderRadius: '16px',
  position: 'relative',
  backgroundColor: '#111',
};
const sideBar = {
  position: 'absolute',
  right: '10px',
  bottom: '100px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  zIndex: 20,
};
const actionItem = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  textShadow: '0px 2px 4px rgba(0,0,0,0.8)',
};
const iconStyle = {
  fontSize: '28px',
  marginBottom: '4px',
  transition: 'transform 0.1s ease',
};
const countText = { color: '#fff', fontSize: '12px', fontWeight: 'bold' };
const iframeStyle = {
  width: '100%',
  height: 'calc(100% + 100px)',
  marginTop: '-50px',
};
const placeholderStyle = {
  color: '#333',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
};
const bottomShield = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '80px',
  backgroundColor: '#000',
  zIndex: 10,
};

export default Videos;
