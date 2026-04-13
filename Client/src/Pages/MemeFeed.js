import React, { useState, useRef, useEffect } from 'react';
import AdsterraNativeBanner from '../Components/AdsterraNativeBanner';

// --- Sub-Component for Individual Posts ---
const TelegramPost = ({ channel, postId, onSeen }) => {
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

      // Mark post as seen after render
      onSeen(postId);
    }
  }, [channel, postId, onSeen]);

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
  const channelName = 'ind_meme_feed';
  const TOTAL_POSTS = 200;
  const INITIAL_LOAD = 6;

  const getSeenPosts = () => {
    return JSON.parse(localStorage.getItem('seenPosts') || '[]');
  };

  const saveSeenPosts = (posts) => {
    localStorage.setItem('seenPosts', JSON.stringify(posts));
  };

  const [seenPosts, setSeenPosts] = useState(getSeenPosts());

  const getUnseenPosts = () => {
    const allPosts = Array.from({ length: TOTAL_POSTS }, (_, i) => TOTAL_POSTS - i);
    return allPosts.filter((id) => !seenPosts.includes(id));
  };

  const [postIds, setPostIds] = useState(() => {
    return getUnseenPosts().slice(0, INITIAL_LOAD);
  });

  const markAsSeen = (id) => {
    if (!seenPosts.includes(id)) {
      const updated = [...seenPosts, id];
      setSeenPosts(updated);
      saveSeenPosts(updated);
    }
  };

  const loadMore = () => {
    const unseen = getUnseenPosts();
    const currentCount = postIds.length;

    const nextPosts = unseen.slice(currentCount, currentCount + 6);
    setPostIds([...postIds, ...nextPosts]);
  };

  const unseenRemaining = getUnseenPosts().length;
  const isEndOfFeed = postIds.length >= unseenRemaining;

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
              <TelegramPost channel={channelName} postId={id} onSeen={markAsSeen} />
              {(index + 1) % 3 === 0 && <AdsterraNativeBanner />}
            </React.Fragment>
          ))}
        </main>

        {!isEndOfFeed && postIds.length > 0 && (
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

        {isEndOfFeed && (
          <div
            style={{
              textAlign: 'center',
              marginTop: '30px',
              padding: '20px',
              color: '#777',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            🎉 You're all caught up!
          </div>
        )}
      </div>
    </div>
  );
}