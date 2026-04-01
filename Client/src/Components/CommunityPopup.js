import React from 'react';

const CommunityPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleTelegramRedirect = () => {
    window.open('https://t.me/myselpost_bot/myselpost', '_blank'); // Replace with your actual link
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.iconContainer}>
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
        <h2 style={styles.title}>Platform Shifted to Telegram!</h2>
        <p style={styles.text}>
          Join our global community! We’ve moved all our{' '}
          <b>international chat rooms and profiles</b> to our official Telegram
          app @myselpost_bot.
        </p>
        <button onClick={handleTelegramRedirect} style={styles.button}>
          Start (Free)
        </button>
        <button onClick={onClose} style={styles.closeLink}>
          Maybe later
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)',
  },
  modal: {
    backgroundColor: '#1c1c1e',
    padding: '40px 30px',
    borderRadius: '24px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    border: '1px solid #333',
  },
  iconContainer: {
    marginBottom: '20px',
  },
  title: {
    color: '#fff',
    fontSize: '24px',
    marginBottom: '15px',
    fontWeight: '700',
  },
  text: {
    color: '#b0b0b0',
    fontSize: '16px',
    lineHeight: '1.5',
    marginBottom: '30px',
  },
  button: {
    backgroundColor: '#0088cc',
    color: '#fff',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    transition: 'transform 0.2s',
  },
  closeLink: {
    background: 'none',
    border: 'none',
    color: '#666',
    marginTop: '15px',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'underline',
  },
};

export default CommunityPopup;
