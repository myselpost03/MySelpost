import React, { useRef, useState, useEffect } from "react";
import OneSignal from 'react-onesignal';
import { useNavigate } from "react-router-dom";

const initialVideos = [
  { id: 0, fact: "Jalebi decieves pakoda", videoUrl: "/videos/1.mp4", likes: "1.2k", comments: "45" },
  { id: 1, fact: "Pav is in jail", videoUrl: "/videos/2.mp4", likes: "30k", comments: "120" },
  { id: 2, fact: "Chapri sting caught", videoUrl: "/videos/3.mp4", likes: "5.5k", comments: "300" },
  { id: 3, fact: "Halku story", videoUrl: "/videos/4.mp4", likes: "5.5k", comments: "300" },
  { id: 4, fact: "Love for Chai", videoUrl: "/videos/5.mp4", likes: "5.5k", comments: "300" },
  { id: 5, fact: "Chai decieves biscuit", videoUrl: "/videos/6.mp4", likes: "5.5k", comments: "300" },
];

const FactVideos = () => {
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const [playingIndex, setPlayingIndex] = useState(0);
  const [liked, setLiked] = useState({});
  const [started, setStarted] = useState({});
  const [seenVideos, setSeenVideos] = useState(new Set()); // Track viewed videos
  
  const navigate = useNavigate();
  const [notificationAllowed, setNotificationAllowed] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);
useEffect(() => {
    const checkPermission = async () => {
      try {
        // Check existing permission
        if (Notification.permission === 'granted') {
          setNotificationAllowed(true);
          await OneSignal.User.PushSubscription.optIn();
        } else {
          setNotificationAllowed(false);
        }
      } catch (err) {
        console.error(err);
        setNotificationAllowed(false);
      } finally {
        setCheckingPermission(false);
      }
    };

    checkPermission();
  }, []);
  // Intersection Observer to handle scroll and "Seen" logic
  useEffect(() => {
    const options = {
      root: containerRef.current,
      threshold: 0.6,
    };

    const callback = (entries) => {
      entries.forEach((entry) => {
        const index = parseInt(entry.target.getAttribute("data-index"));
        if (entry.isIntersecting) {
          setPlayingIndex(index);
          // Mark as seen when it comes into view
          setSeenVideos(prev => new Set(prev).add(index));
        } else {
          setStarted((prev) => ({ ...prev, [index]: false }));
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    videoRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref.parentElement);
    });

    return () => observer.disconnect();
  }, []);

  // Handle Tab Visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      const currentVideo = videoRefs.current[playingIndex];
      if (!currentVideo) return;
      if (document.visibilityState === "visible") {
        if (started[playingIndex]) currentVideo.play().catch(() => {});
      } else {
        currentVideo.pause();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [playingIndex, started]);

  // Video Play/Pause Logic
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === playingIndex) {
        if (started[index]) {
          video.muted = false;
          video.play().catch(() => {});
        }
      } else {
        video.pause();
        video.currentTime = 0;
        video.muted = true;
      }
    });
  }, [playingIndex, started]);

  const togglePlay = (index) => {
    setStarted((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleLike = (index) => {
    setLiked(prev => ({ ...prev, [index]: !prev[index] }));
    handleSubscribe();
  };

  const handleSubscribe = async () => {
    try {
      const permission = await OneSignal.Notifications.requestPermission();
      if (permission === true || Notification.permission === 'granted') {
        await OneSignal.User.PushSubscription.optIn();
        setNotificationAllowed(true);
      }
    } catch (err) {
      console.error('❌ Error subscribing:', err);
    }
  };

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <span style={styles.headerTabActive}>Short AI Stories</span>
        </div>
      </header>

      <div style={styles.slider} ref={containerRef}>
        {initialVideos.map((item, index) => (
          <div key={index} style={styles.card} data-index={index}>
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={item.videoUrl}
              style={styles.video}
              loop
              playsInline
              onClick={() => togglePlay(index)}
            />

            {!started[index] && (
              <div style={styles.centerOverlay} onClick={() => togglePlay(index)}>
                <div style={styles.playIcon}>▶</div>
              </div>
            )}

            <div style={styles.bottomSection}>
              <div style={styles.textContainer}>
                <h3 style={styles.username}>@FactFinder</h3>
                <p style={styles.factText}>{item.fact}</p>
              </div>

              <div style={styles.sideBar}>
                <div style={styles.iconGroup} onClick={() => handleLike(index)}>
                  <span style={styles.icon}>{liked[index] ? "❤️" : "🤍"}</span>
                  <span style={styles.iconLabel}>{liked[index] ? "Liked" : item.likes}</span>
                </div>
                <div style={styles.iconGroup}>
                  <span style={styles.icon}>💬</span>
                  <span style={styles.iconLabel}>{item.comments}</span>
                </div>
                <div style={styles.iconGroup}>
                  <span style={styles.icon}>🔗</span>
                  <span style={styles.iconLabel}>Share</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* --- COOL ALERT / END CARD --- */}
        <div style={styles.endCard}>
          <div style={styles.alertBox}>
            <div style={{ fontSize: '50px', marginBottom: '10px' }}>🌈</div>
            <h2 style={styles.alertTitle}>You're all caught up!</h2>
            <p style={styles.alertText}>
              Your hourly dose of 5 videos is done. <br/> 
              <strong>Come back in an hour for more!</strong>
            </p>
            <button 
                style={styles.backBtn} 
                onClick={() => navigate('/fact-pins')}
            >
                Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="bottom-nav" style={styles.bottomNavStyle}>
         <button className="tab-btn" onClick={() => navigate('/fact-pins')}>🏠<span>Home</span></button>
         <button className="tab-btn" onClick={() => navigate('/fact-videos')}>🎬<span>AI</span></button>
         <button className="tab-btn" onClick={() => navigate('/fact-date')}>❤️<span>Fact Date</span></button>
         <button className="tab-btn" onClick={() => navigate('/fact-profile')}>⚙️<span>Settings</span></button>
      </div>
    </div>
  );
};

const styles = {
  // ... (Your existing styles remain the same)
  appContainer: { backgroundColor: "#000", height: "100vh", width: "100vw", display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "sans-serif" },
  header: { position: "fixed", top: 0, width: "100%", zIndex: 10, height: "60px", display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)", backdropFilter: "blur(4px)" },
  headerContent: { display: "flex", gap: "20px" },
  headerTabActive: { color: "#fff", fontWeight: "700", fontSize: "17px", borderBottom: "2px solid #fff", paddingBottom: "4px" },
  slider: { flex: 1, overflowY: "scroll", scrollSnapType: "y mandatory", scrollbarWidth: "none" },
  card: { position: "relative", height: "100vh", width: "100%", scrollSnapAlign: "start", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center" },
  video: { width: "100%", height: "100%", objectFit: "cover" },
  centerOverlay: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.1)", zIndex: 5 },
  playIcon: { fontSize: "50px", color: "rgba(255,255,255,0.8)", backgroundColor: "rgba(0,0,0,0.3)", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: "8px" },
  bottomSection: { position: "absolute", bottom: "20px", left: 0, right: 0, padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)", paddingBottom: "60px" },
  textContainer: { flex: 1, paddingRight: "60px" },
  username: { color: "#fff", margin: "0 0 8px 0", fontSize: "16px", fontWeight: "bold" },
  factText: { color: "#eee", fontSize: "15px", lineHeight: "1.4", margin: 0 },
  sideBar: { display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" },
  iconGroup: { display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" },
  icon: { fontSize: "28px", marginBottom: "4px" },
  iconLabel: { color: "#fff", fontSize: "12px", fontWeight: "600" },
  
  // NEW STYLES FOR THE COOL ALERT
  endCard: {
    height: "100vh",
    width: "100%",
    scrollSnapAlign: "start",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#111",
  },
  alertBox: {
    textAlign: 'center',
    padding: '40px 20px',
    margin: '20px',
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  alertTitle: {
    color: '#fff',
    fontSize: '24px',
    marginBottom: '10px',
  },
  alertText: {
    color: '#ccc',
    fontSize: '16px',
    lineHeight: '1.5',
    marginBottom: '20px',
  },
  backBtn: {
    padding: '12px 24px',
    borderRadius: '30px',
    border: 'none',
    backgroundColor: '#fff',
    color: '#000',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default FactVideos;