import React from 'react';

const CommunityPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleTelegramRedirect = () => {
    window.open('https://t.me/myselpost_bot/myselpost', '_blank'); // Replace with your actual link
  };

  return (
    <div className="tg-modal-overlay">
  <div className="tg-modal-card">
    <div className="tg-modal-icon">
      <svg
        width="50"
        height="50"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42l10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701l-.331 4.958c.488 0 .702-.223.974-.488l2.337-2.27l4.861 3.59c.896.494 1.54.24 1.763-.83l3.19-15.03c.327-1.31-.504-1.907-1.362-1.537z"
          fill="#0088cc"
        />
      </svg>
    </div>

    <h2 className="tg-modal-title" style={{fontFamily: 'poppins', fontSize: '1.2rem', whiteSpace:'nowrap'}}>Platform Shifted to Telegram!</h2>
    
    <p className="tg-modal-desc" style={{fontFamily: 'poppins'}}>
      Join our global community! We’ve moved all our{' '}
      <b className="tg-modal-highlight">international chat rooms and profiles</b> to our official Telegram
      app @myselpost_bot.
    </p>

    <div className="tg-modal-actions">
      <button 
        className="tg-modal-btn tg-modal-btn--primary" 
        onClick={handleTelegramRedirect}
      >
        Open Telegram (Free)
      </button>
      <button 
        className="tg-modal-btn tg-modal-btn--secondary" 
        onClick={onClose}
      >
        Maybe later
      </button>
    </div>
  </div>
</div>
  );
};


export default CommunityPopup;
