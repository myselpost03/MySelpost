import React, { useCallback, useState, useRef, useEffect } from 'react';
import AdsterraNativeBanner from '../Components/AdsterraNativeBanner';
import { useAdManager } from '../Hooks/useAdManager';
import { useAdController } from '../Hooks/useAdController';

// --- Sub-Component for Individual Posts ---
const TelegramPost = ({ channel, postId, onSeen }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && !containerRef.current.hasChildNodes()) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?23';
      script.async = true;
      script.setAttribute('data-telegram-post', `${channel}/${postId}`);
      script.setAttribute('data-width', '100%');
      containerRef.current.appendChild(script);

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
  const [memeSeenCount, setMemeSeenCount] = useState(0);
  const [interstitialIndex, setInterstitialIndex] = useState(0);
const [cursor, setCursor] = useState(0);
  const { triggerAd } = useAdManager(6115107); // pass userId if you have
  const { canShowAd, getCooldownRemaining } = useAdController();

  const INTERSTITIAL_ORDER = ['monetag', 'gigapub', 'adradar'];

  const channelName = 'ind_meme_feed';
  const TOTAL_POSTS = 200;
  const INITIAL_LOAD = 6;

  const isTelegram =
    typeof window !== 'undefined' &&
    window.Telegram?.WebApp &&
    window.Telegram.WebApp.initData !== '';

  const getSeenPosts = () => {
    return JSON.parse(localStorage.getItem('seenPosts') || '[]');
  };

  const saveSeenPosts = (posts) => {
    localStorage.setItem('seenPosts', JSON.stringify(posts));
  };

  const unseenPosts = getUnseenPosts();

const [postIds, setPostIds] = useState(() => {
  return unseenPosts.slice(0, INITIAL_LOAD);
});

useEffect(() => {
  setCursor(INITIAL_LOAD);
}, []);
  const [isLoading, setIsLoading] = useState(false);
  const [seenPosts, setSeenPosts] = useState(getSeenPosts());
  const loadMoreRef = useRef(null);
  const getUnseenPosts = () => {
    const allPosts = Array.from(
      { length: TOTAL_POSTS },
      (_, i) => TOTAL_POSTS - i
    );
    return allPosts.filter((id) => !seenPosts.includes(id));
  };

 

  const markAsSeen = async (id) => {
    if (!seenPosts.includes(id)) {
      const updated = [...seenPosts, id];
      setSeenPosts(updated);
      saveSeenPosts(updated);

      // ✅ Increment meme counter
      const newCount = memeSeenCount + 1;
      setMemeSeenCount(newCount);

      // 🎯 Every 15 memes → trigger ad
      if (isTelegram && newCount % 15 === 0) {
        const primaryNetwork =
          INTERSTITIAL_ORDER[interstitialIndex % INTERSTITIAL_ORDER.length];

        const result = await triggerAd({
          type: 'interstitial',
          networks: [
            primaryNetwork,
            ...INTERSTITIAL_ORDER.filter((n) => n !== primaryNetwork), // fallback order
          ],
        });

        if (!result.success) {
          const check = canShowAd(primaryNetwork);

          // ⛔ Cooldown → skip ad but DON'T block feed
          if (check?.reason === 'cooldown') {
            const remaining = Math.ceil((getCooldownRemaining?.() || 0) / 1000);
            console.log(`Cooldown active: wait ${remaining}s`);
          } else {
            console.log('All networks exhausted → skipping ad');
          }
        } else {
          console.log('Interstitial shown via:', result.network);

          // ✅ Move to next network in rotation
          setInterstitialIndex((prev) => prev + 1);
        }
      }
    }
  };
 const loadMore = useCallback(() => {
  if (isLoading) return;

  setIsLoading(true);

  const unseen = getUnseenPosts();
  const nextPosts = unseen.slice(cursor, cursor + 6);

  setTimeout(() => {
    setPostIds((prev) => [...prev, ...nextPosts]);
    setCursor((prev) => prev + 6);
    setIsLoading(false);
  }, 300);
}, [isLoading, cursor, seenPosts]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadMore]);
  const unseenRemaining = getUnseenPosts().length;
  const isEndOfFeed = postIds.length >= unseenRemaining;

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'sans-serif',
        backgroundColor: '#f0f2f5',
      }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#2481cc' }}>MEME FEED</h2>
          <p>Your daily escape from reality</p>
        </header>

        <main style={{ position: 'relative', zIndex: 1 }}>
          {postIds.map((id, index) => (
            <React.Fragment key={id}>
              <TelegramPost
                channel={channelName}
                postId={id}
                onSeen={markAsSeen}
              />
              {(index + 1) % 3 === 0 && <AdsterraNativeBanner />}
            </React.Fragment>
          ))}
          <div ref={loadMoreRef} style={{ height: '20px' }}>
            {isLoading && (
              <div style={{ textAlign: 'center', padding: '10px' }}>
                <div className="spinner" />
              </div>
            )}{' '}
          </div>
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
