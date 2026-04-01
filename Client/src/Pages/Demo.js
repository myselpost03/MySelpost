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
          onSeen(postId); // Pass postId up to mark as seen
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

// --- Main Demo Component ---
const Demo = () => {
  const [showCommunityPopup, setShowCommunityPopup] = useState(false);
  const [sessionViewCount, setSessionViewCount] = useState(0);
  const [filteredPostIds, setFilteredPostIds] = useState([]);

  const isTelegram =
    typeof window !== 'undefined' &&
    window.Telegram?.WebApp &&
    window.Telegram.WebApp.initData !== '';

  const CHANNEL_NAME = 'ind_vids';
  const LATEST_POST_ID = 23;
  const LOAD_COUNT = 23;

  // 1. Filter posts on mount based on LocalStorage
  useEffect(() => {
    const seenPosts = JSON.parse(localStorage.getItem('seen_vids') || '[]');

    const allPosts = Array.from(
      { length: LOAD_COUNT },
      (_, i) => `${CHANNEL_NAME}/${LATEST_POST_ID - i}`
    );

    // Only keep posts that are NOT in the seenPosts array
    const remainingPosts = allPosts.filter((id) => !seenPosts.includes(id));
    setFilteredPostIds(remainingPosts);
  }, []);

  // 2. Mark as seen in LocalStorage and handle the 10-swipe limit
  const handleReelSeen = (postId) => {
    // Update LocalStorage
    const seenPosts = JSON.parse(localStorage.getItem('seen_vids') || '[]');
    if (!seenPosts.includes(postId)) {
      const updatedSeen = [...seenPosts, postId];
      localStorage.setItem('seen_vids', JSON.stringify(updatedSeen));
    }

    // Update Session Count for the Popup restriction
    setSessionViewCount((prev) => {
      const nextCount = prev + 1;
      if (!isTelegram && nextCount === 10) {
        setShowCommunityPopup(true);
      }
      return nextCount;
    });
  };

  const getTomorrowTimestamp = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow.toLocaleString([], {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isLocked = !isTelegram && sessionViewCount >= 10;

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

      {/* Show maintenance if we run out of new videos or reached 10 on web */}
      {(filteredPostIds.length === 0 || isLocked) && (
        <div style={reelSection}>
          <div style={maintenanceModal}>
            <div style={modalIcon}>⚠️</div>
            <h2 style={modalTitle}>{'Server is Down'}</h2>
            <p style={modalText}>
              {'We are working to fix the issues soon.'}
              <br /> Server will be fixed by:
            </p>
            <div style={timestampBadge}>{getTomorrowTimestamp()}</div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Styles (Existing) ---
const maintenanceModal = {
  width: '100%',
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
  marginBottom: '25px',
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

export default Demo;
