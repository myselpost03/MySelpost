import React, { useState, useEffect } from 'react';
import logo from '../Assets/game-logo.png';
import OneSignal from 'react-onesignal';
import firstPoster from "../Assets/poster-1.png";
import secondPoster from "../Assets/poster-2.png";
import thirdPoster from "../Assets/poster-3.png";
import '../Styles/EarningDashboard.css';

const EarningDashboard = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notificationAllowed, setNotificationAllowed] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);
// Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Placeholder images - Replace these with your actual imported assets
 const screenshots = [
  { id: 1, url: firstPoster, alt: 'Gameplay Action' },
  { id: 2, url: secondPoster, alt: 'Character Selection' },
  { id: 3, url: thirdPoster, alt: 'Rewards Dashboard' },
];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  };
  const highlightStyle = {
    color: '#4d4dff', // Matches your theme's purple/blue
    fontWeight: 'bold',
  };

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

  const handleSubscribe = async () => {
    try {
      const permission = await OneSignal.Notifications.requestPermission();

      if (permission === true || Notification.permission === 'granted') {
        await OneSignal.User.PushSubscription.optIn();

        const playerId = OneSignal.User.PushSubscription.id;
        console.log('✅ Player ID:', playerId);

        setNotificationAllowed(true);
        setIsSubscribed(true);
      } else {
        console.log('❌ Permission denied');
        setNotificationAllowed(false);
      }
    } catch (err) {
      console.error('❌ Error subscribing:', err);
      setNotificationAllowed(false);
    }
  };

  return (
    <div className="holographic-shell">
      <div className="shape sphere-1"></div>
      <div className="shape sphere-2"></div>

      <div className="main-content">
        {/* --- TESTER STATUS HEADER --- */}
        <section
          className="tester-status-card"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(15px)',
            borderRadius: '20px',
            padding: '25px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '0px',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '5px 15px',
              borderRadius: '20px',
              background: 'rgba(77, 77, 255, 0.2)',
              color: '#8080ff',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              marginBottom: '10px',
            }}
          >
            VERIFIED BETA ACCESS
          </div>
          <h2 style={{ fontSize: '1.8rem', margin: '5px 0', color: '#111' }}>
            Welcome, Tester
          </h2>
          <p style={{ color: '#111', fontSize: '0.9rem' }}>
            We are excited to announce that we will soon be launching Morning
            Sprint <span style={highlightStyle}>play-to-earn game</span>.
          </p>
        </section>

        {/* --- MAIN GAME PREVIEW --- */}
        <section
          className="game-promo-card"
          style={{
            background: 'linear-gradient(135deg, #161625 0%, #1c1c3c 100%)',
            borderRadius: '16px',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            border: '1px solid rgba(77, 77, 255, 0.3)',
            marginBottom: '30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}
        >
          <img
            src={logo}
            alt="Morning Sprint Logo"
            style={{
              width: '100px',
              marginBottom: '20px',
              filter: 'drop-shadow(0 0 15px #4d4dff)',
            }}
          />
          <h4
            style={{ color: '#fff', fontSize: '1.5rem', margin: '0 0 12px 0' }}
          >
            Morning Sprint
          </h4>
          <p
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.95rem',
              lineHeight: '1.5',
            }}
          >
            The ultimate play-to-earn endless runner game experience is almost
            here. We're currently working to launch the game soon.
          </p>

          <button
            className="btn-primary"
            onClick={handleSubscribe}
            disabled={isSubscribed}
            style={{
              width: '100%',
              padding: '15px',
              marginTop: '25px',
              fontSize: '1rem',
              fontWeight: 'bold',
              background: isSubscribed ? '#10b981' : '#4d4dff',
              transition: 'all 0.3s ease',
            }}
          >
            {isSubscribed ? '✓ You are on the list' : '🔔 Notify Me When Live'}
          </button>
        </section>
       <section className="carousel-container" style={carouselContainerStyle}>
          <div style={{
            display: 'flex',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: `translateX(-${currentSlide * 100}%)`,
          }}>
            {screenshots.map((img) => (
              <img 
                key={img.id} 
                src={img.url} 
                alt={img.alt} 
                style={{ width: '100%', flexShrink: 0, objectFit: 'cover', display: 'block' }} 
              />
            ))}
          </div>
          
          {/* Controls - Separated Left and Right properly */}
          <button onClick={prevSlide} style={leftArrowStyle}>❮</button>
          <button onClick={nextSlide} style={rightArrowStyle}>❯</button>
          
          {/* Dots */}
          <div style={dotContainerStyle}>
            {screenshots.map((_, index) => (
              <div 
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{
                  ...dotStyle,
                  background: currentSlide === index ? '#4d4dff' : 'rgba(255,255,255,0.3)',
                  width: currentSlide === index ? '20px' : '8px', // Visual cue for active slide
                }}
              />
            ))}
          </div>
        </section>
      </div>

      <footer
        style={{
          textAlign: 'center',
          padding: '30px',
          opacity: 0.4,
          fontSize: '0.7rem',
          color: '#fff',
        }}
      >
        BUILD v0.0.1-BETA | STAGE: CLOSED TESTING
      </footer>
    </div>
  );
};

const carouselContainerStyle = {
  position: 'relative',
  width: '100%',
  borderRadius: '20px',
  overflow: 'hidden',
  marginBottom: '30px',
  boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  background: '#000' // Prevents white flicker during transitions
};

const commonArrowStyle = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  color: 'white',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  cursor: 'pointer',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
};

const leftArrowStyle = { ...commonArrowStyle, left: '15px' };
const rightArrowStyle = { ...commonArrowStyle, right: '15px' };

const dotContainerStyle = {
  position: 'absolute',
  bottom: '15px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  gap: '8px',
  zIndex: 10
};

const dotStyle = {
  height: '8px',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

export default EarningDashboard;
