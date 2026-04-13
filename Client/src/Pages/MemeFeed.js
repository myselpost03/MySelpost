import React, { useState, useRef, useEffect } from 'react';
import AdsterraNativeBanner from '../Components/AdsterraNativeBanner';

// --- Sub-Component for Individual Posts ---
const TelegramPost = ({ channel, postId }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?23';
      script.async = true;
      script.setAttribute('data-telegram-post', `${channel}/${postId}`);
      script.setAttribute('data-width', '100%');
      containerRef.current.appendChild(script);
    }
  }, [channel, postId]);

  return (
    <div style={{ position: 'relative', marginBottom: '25px' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          background: 'transparent',
          cursor: 'default',
        }}
      />
      <div ref={containerRef} style={{ minHeight: '150px' }} />
    </div>
  );
};

// --- Main Application Component ---
export default function MemeFeed() {
  const channelName = 'eng_vids_funny';
  const TOTAL_POSTS = 30;
  const INITIAL_LOAD = 6;
  
  // Initialize state with the first 6 IDs: [200, 199, 198, 197, 196, 195]
  const [postIds, setPostIds] = useState(
    Array.from({ length: INITIAL_LOAD }, (_, i) => TOTAL_POSTS - i)
  );

  const loadMore = () => {
    const lastId = postIds[postIds.length - 1];
    if (lastId > 1) {
      const nextPosts = Array.from(
        { length: Math.min(6, lastId - 1) }, 
        (_, i) => lastId - 1 - i
      );
      setPostIds([...postIds, ...nextPosts]);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f0f2f5' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#2481cc' }}>MEME FEED</h2>
          <p>Your daily escape from reality</p>
        </header>

        <main style={{ position: 'relative', zIndex: 1 }}>
          {postIds.map((id, index) => (
            <React.Fragment key={id}>
              <TelegramPost channel={channelName} postId={id} />
              {(index + 1) % 3 === 0 && <AdsterraNativeBanner />}
            </React.Fragment>
          ))}
        </main>

        {postIds.length < TOTAL_POSTS && (
          <button
            onClick={loadMore}
            style={{
              display: 'block',
              width: '100%',
              padding: '12px',
              backgroundColor: '#2481cc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '20px',
            }}
          >
            Load Older Posts
          </button>
        )}
      </div>
    </div>
  );
}