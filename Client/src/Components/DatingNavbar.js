import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityPopup from './CommunityPopup';
const DatingNavbar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showCommunityPopup, setShowCommunityPopup] = useState(false);

  const handleTelegramRedirect = () => {
    window.open('https://t.me/myselpost_bot/myselpost', '_blank'); // Replace with your actual link
  };
  const isTelegram =
    typeof window !== 'undefined' &&
    window.Telegram?.WebApp &&
    window.Telegram.WebApp.initData !== '';

  const navigate = useNavigate();

  // Theme Palette
  const theme = {
    primary: '#FF4458', // Deep Rose
    secondary: '#FF7854', // Sunset Orange
    border: 'rgba(0, 0, 0, 0.08)',
    inactive: '#757575',
    activeBg: 'rgba(255, 68, 88, 0.1)', // Light pink tint for active state
  };

  // Main Container Styles
  const navBarStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '75px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white
    backdropFilter: 'blur(10px)', // The "Glass" effect
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTop: `1px solid ${theme.border}`,
    paddingBottom: 'env(safe-area-inset-bottom)', // Support for iPhone notches
    zIndex: 2000,
  };

  const tabButtonStyle = (isActive) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
    cursor: 'pointer',
    position: 'relative',
    gap: '4px',
    transition: 'all 0.2s ease-in-out',
  });

  const iconStyle = (isActive) => ({
    fontSize: '22px',
    filter: isActive ? 'none' : 'grayscale(100%) opacity(0.6)',
    transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    transform: isActive ? 'scale(1.2)' : 'scale(1)',
  });

  const labelStyle = (isActive) => ({
    fontSize: '11px',
    fontWeight: '600',
    color: isActive ? theme.primary : theme.inactive,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  });

  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home', path: '/' }, // Replaced Matches with Home
    { id: 'date', icon: '🔥', label: 'Date', path: '/date' },
    { id: 'earn', icon: '🎮', label: 'Earn', path: '/dashboard' },
    { id: 'messages', icon: '💬', label: 'Chat Room', path: '/chat-room' },
    { id: 'memes', icon: '🍿', label: 'Memes', path: '/meme-feed' },
  ];

  const handleTabClick = (tabId, path) => {
    setActiveTab(tabId);

    // Show Telegram modal when Profile is clicked (only if NOT Telegram)
    {
      /* if (tabId === 'videos' && !isTelegram) {
      console.log("🚀 ~ handleTabClick ~ videos:")
     setShowCommunityPopup(true);
      return; // stop navigation
    }*/
    }

    if (tabId === 'date') {
      navigate('/date');
    } else {
      navigate(path);
    }
  };

  return (
    <>
      {!isTelegram && (
        <CommunityPopup
          isOpen={showCommunityPopup}
          onClose={() => setShowCommunityPopup(false)}
        />
      )}
      <nav style={navBarStyle}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              style={tabButtonStyle(isActive)}
              onClick={() => handleTabClick(tab.id, tab.path)}
            >
              <span style={iconStyle(isActive)}>{tab.icon}</span>
              <span style={labelStyle(isActive)}>{tab.label}</span>
            </div>
          );
        })}
      </nav>
    </>
  );
};

export default DatingNavbar;
