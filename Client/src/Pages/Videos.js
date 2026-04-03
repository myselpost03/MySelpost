import React, { useEffect, useRef, useState } from 'react';
import CommunityPopup from '../Components/CommunityPopup';

// --- Sub-Component for individual Reels ---
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
  const [showCommunityPopup, setShowCommunityPopup] = useState(false);
  const [sessionViewCount, setSessionViewCount] = useState(0);
  const [filteredPostIds, setFilteredPostIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Default true for geo-check
  const [isIndian, setIsIndian] = useState(true); // Default true, will update

  const nextIdRef = useRef(24);
  const loaderRef = useRef(null);

  const CHANNEL_NAME = 'ind_vids';
  const LOAD_BATCH_SIZE = 5;

  const isTelegram =
    typeof window !== 'undefined' &&
    window.Telegram?.WebApp &&
    window.Telegram.WebApp.initData !== '';

  // 1. Check Country on Mount
  useEffect(() => {
    const checkCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        // Check if country is NOT India
        if (data.country_code !== 'IN') {
          setIsIndian(false);
        }
      } catch (error) {
        console.error("Geo-check failed, defaulting to show content", error);
      } finally {
        setIsLoading(false);
        loadMoreVideos(); // Load videos only after geo-check
      }
    };

    checkCountry();
  }, []);

  const loadMoreVideos = () => {
    // Don't load videos if not Indian or already loading
    if (!isIndian || nextIdRef.current <= 0) return;
    
    setIsLoading(true);
    const seenPosts = JSON.parse(localStorage.getItem('seen_vids') || '[]');
    let newBatch = [];
    let tempPointer = nextIdRef.current;
    let safetyCounter = 0;

    while (newBatch.length < LOAD_BATCH_SIZE && tempPointer > 0 && safetyCounter < 100) {
      const postId = `${CHANNEL_NAME}/${tempPointer}`;
      if (!seenPosts.includes(postId)) {
        newBatch.push(postId);
      }
      tempPointer--;
      safetyCounter++;
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
        if (entries[0].isIntersecting && !isLoading && isIndian) {
          loadMoreVideos();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [isLoading, isIndian]);

  const MAX_FREE_VIEWS = 100;

  const handleReelSeen = (postId) => {
    const seenPosts = JSON.parse(localStorage.getItem('seen_vids') || '[]');
    if (!seenPosts.includes(postId)) {
      const updatedSeen = [...seenPosts, postId];
      localStorage.setItem('seen_vids', JSON.stringify(updatedSeen));
    }

    setSessionViewCount((prev) => {
      const nextCount = prev + 1;
      if (!isTelegram && nextCount === MAX_FREE_VIEWS) setShowCommunityPopup(true);
      return nextCount;
    });
  };

  const isLocked = !isTelegram && sessionViewCount >= MAX_FREE_VIEWS;

  // --- RENDERING LOGIC ---

  // 2. Show Country Modal for non-Indian users
  if (!isLoading && !isIndian) {
    return (
      <div style={reelSection}>
        <div style={maintenanceModal}>
          <div style={modalIcon}>🌍</div>
          <h2 style={modalTitle}>Coming Soon</h2>
          <p style={modalText}>
            This feature will come soon for your country. Stay tuned!
          </p>
          <div style={timestampBadge}>Global Launch 2026</div>
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

      {/* Loading Indicator */}
      {!isLocked && nextIdRef.current > 0 && (
        <div ref={loaderRef} style={loaderContainer}>
          {isLoading && <div style={{ color: 'white' }}>Loading...</div>}
        </div>
      )}

      {/* End of Feed */}
      {!isLocked && nextIdRef.current <= 0 && isIndian && (
        <div style={reelSection}>
          <div style={maintenanceModal}>
            <div style={modalIcon}>🏁</div>
            <h2 style={modalTitle}>End of Feed</h2>
            <p style={modalText}>You've seen all available videos!</p>
          </div>
        </div>
      )}

      {/* Lock Screen */}
      {isLocked && (
        <div style={lockOverlay}>
          <div style={maintenanceModal}>
            <div style={modalIcon}>🔒</div>
            <h2 style={modalTitle}>Limit Reached</h2>
            <p style={modalText}>
              Join our community to watch more than 10 videos!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Styles (New & Existing) ---
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