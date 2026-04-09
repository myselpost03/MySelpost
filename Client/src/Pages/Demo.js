import React, { useState, useEffect, useRef } from 'react';

// --- Sub-Component for Individual Posts ---
const TelegramPost = ({ channel, postId }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Clear container to prevent duplicate embeds on re-renders
      containerRef.current.innerHTML = '';
      
      const script = document.createElement('script');
      script.src = "https://telegram.org/js/telegram-widget.js?23";
      script.async = true;
      script.setAttribute('data-telegram-post', `${channel}/${postId}`);
      script.setAttribute('data-width', '100%');
      
      containerRef.current.appendChild(script);
    }
  }, [channel, postId]);

  return <div ref={containerRef} style={{ minHeight: '150px', marginBottom: '20px' }} />;
};

// --- Main Application Component ---
export default function Demo() {
  const channelName = "eng_vids_funny";
  
  // Since the Telegram widget doesn't have a "get all" API, 
  // we define a range of post IDs to display.
  const [postIds, setPostIds] = useState([5, 4,3,2,1]);

  const loadMore = () => {
    const lastId = postIds[postIds.length - 1];
    if (lastId > 1) {
      // Add the next 5 older posts
      const nextPosts = Array.from({ length: 5 }, (_, i) => lastId - 1 - i).filter(id => id > 0);
      setPostIds([...postIds, ...nextPosts]);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f0f2f5' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#2481cc' }}>@{channelName} Feed</h2>
          <p>Displaying posts directly from Telegram</p>
        </header>

        <main>
          {postIds.map((id) => (
            <TelegramPost key={id} channel={channelName} postId={id} />
          ))}
        </main>

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
            fontWeight: 'bold'
          }}
        >
          Load Older Posts
        </button>
      </div>
    </div>
  );
}