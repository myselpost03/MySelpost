import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SketchyHeader from '../Components/SketchyHeader';
import { supabaseChat } from '../Utils/supabaseGroupChat';
import { users } from '../Data/users';
import SketchyAlert from '../Components/SketchyAlert';
import toast, { Toaster } from 'react-hot-toast';
// 1. Add this to your Card component
function Card({ user, isActionable, onAction, onUploadClick, onMessage }) {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div style={cardStyle}>
      {/* Container for image + upload button */}
      <div style={{ shimmer, position: 'relative', width: '300px', height: '300px' }}>
        {!isLoaded && (
          <div className="shimmer" style={{ width: '300px', height: '300px' }} />
        )}
        <img src={user.image} alt={user.name} style={{ 
            ...imageStyle, 
            display: isLoaded ? 'block' : 'none' 
          }} 
          onLoad={() => setIsLoaded(true)} />

        {/* The "Cool" Upload Button */}
        <div style={rectUploadBtnStyle} onClick={onUploadClick}>
          UPLOAD
          <input type="file" id="upload-btn" style={{ display: 'none' }} />
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{user.name}</h3>
        <p style={{ margin: 0, color: '#777', fontSize: '0.9rem' }}>
          📍 {user.location}
        </p>
      </div>

      {isActionable && (
        <div style={buttonContainer}>
          <button
            className="btn-action"
            onClick={() => onAction('reject')}
            style={rejectBtn}
          >
            ✕
          </button>
          <button className="btn-action" style={msgBtn} onClick={onMessage}>
            💬
          </button>
          <button
            className="btn-action"
            onClick={() => onAction('like')}
            style={heartBtn}
          >
            ♥
          </button>
        </div>
      )}
    </div>
  );
}
export default function Dating() {
  const [showModal, setShowModal] = useState(false);
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const [showFreeLimitModal, setShowFreeLimitModal] = useState(false);
  const [swipeCount, setSwipeCount] = useState(0);
  const [alertMessage, setAlertMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false); // NEW
  const [selectedTarget, setSelectedTarget] = useState(null); // NEW
  const [chatMessage, setChatMessage] = useState(''); // NEW
  const navigate = useNavigate();
  const isTelegram =
    typeof window !== 'undefined' &&
    window.Telegram?.WebApp &&
    window.Telegram.WebApp.initData !== '';
  const swipeLimit = isTelegram ? 40 : 10;
  const handleTelegramRedirect = () => {
    window.open('https://t.me/myselpost_bot/myselpost', '_blank');
  };

  const handleAction = (direction) => {
    if (animationClass) return;

    // NEW: Check limit before processing swipe
    if (swipeCount >= swipeLimit) {
      if (isTelegram) {
        setShowFreeLimitModal(true);
      } else {
        setShowTelegramModal(true);
      }
      return;
    }

    setAnimationClass(direction === 'like' ? 'swipe-right' : 'swipe-left');

    setTimeout(() => {
      setAnimationClass('');
      setCurrentIndex((prev) => (prev + 1) % users.length);
      setSwipeCount((prev) => prev + 1); // Increment count
    }, 500);
  };

  const nextIndex = (currentIndex + 1) % users.length;

  const handleOpenChat = (targetUser) => {
   if (!isTelegram) {
      setShowTelegramModal(true);
      return;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setAlertMessage({ text: "Please login to send a message.", withButton: true });
      return;
    }
    setSelectedTarget(targetUser);
    setShowChatModal(true);
  };

  const submitMessage = async () => {
    const sender = JSON.parse(localStorage.getItem('user'));
    try {
      const { error } = await supabaseChat.from('dating_messages').insert([
        {
          sender_username: sender.name,
          receiver_name: selectedTarget.name,
          message: chatMessage,
          created_at: new Date(),
        },
      ]);
      if (error) throw error;
      toast.success('Message sent successfully!', {
        duration: 4000,
        position: 'top-right',
      });
      setShowChatModal(false);
      setChatMessage('');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div style={datingContainer}>
      <SketchyHeader title="Date & Meet" onBack={() => navigate('-1')} />

      <style>{`
        .card-wrapper { position: absolute; transition: transform 0.5s ease-out, opacity 0.5s; width: 300px; }
        .swipe-right { transform: translateX(120%) rotate(20deg); opacity: 0; }
        .swipe-left { transform: translateX(-120%) rotate(-20deg); opacity: 0; }
        .btn-action:hover { transform: scale(1.15); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .btn-action:active { transform: scale(0.9); }
      `}</style>
      {showChatModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Message {selectedTarget?.name}</h3>
            <textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type something special to get her attention..."
              style={{
                width: '90%',
                height: '80px',
                margin: '10px 0',
                padding: '10px',
              }}
            />
            <div
              style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}
            >
              <button onClick={submitMessage} style={closeBtnStyle}>
                Send
              </button>
              <button
                onClick={() => setShowChatModal(false)}
                style={{ ...closeBtnStyle, background: '#ccc' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showFreeLimitModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Limit Reached</h3>
            <p>Free users can only swipe 40 cards per day.</p>
            <button
              onClick={() => setShowFreeLimitModal(false)}
              style={closeBtnStyle}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ color: '#333' }}>Verification Pending</h2>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Your account is currently undergoing an automated security review.
              Uploads will be <b>automatically enabled in 30 days</b> once your
              human presence is verified.
            </p>
            <button onClick={() => setShowModal(false)} style={closeBtnStyle}>
              Got it
            </button>
          </div>
        </div>
      )}

      <div style={{ position: 'relative', width: '300px', height: '450px' }}>
        <div style={{ position: 'absolute', zIndex: 1 }}>
          <Card
            user={users[nextIndex]}
            onMessage={() => handleOpenChat(users[currentIndex])}
            onUploadClick={() => setShowModal(true)}
          />
        </div>
        <div className={`card-wrapper ${animationClass}`} style={{ zIndex: 2 }}>
          <Card
            user={users[currentIndex]}
            isActionable
            onAction={handleAction}
            onMessage={() => handleOpenChat(users[currentIndex])}
          />
        </div>
      </div>
      {showTelegramModal && (
        <div className="chat-room-modal-overlay telegram-popup-overlay">
          <div className="chat-room-modal-content telegram-popup-content">
            <div className="telegram-icon-wrapper">
              <svg viewBox="0 0 24 24" width="50" height="50" fill="#0088cc">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
            </div>
            <h3>Swipe More on Telegram!</h3>
            <p>You've already swiped many cards here.</p>
            <p>
              To keep swiping the dating cards, join us on our official Telegram
              app!
            </p>
            <button onClick={handleTelegramRedirect} className="telegram-btn">
              Find Your Match on Telegram (Free)
            </button>
            <button
              className="close-limit-btn"
              onClick={() => setShowTelegramModal(false)}
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}
      {showMessageModal && (
        <div className="chat-room-modal-overlay telegram-popup-overlay">
          <div className="chat-room-modal-content telegram-popup-content">
            <div className="telegram-icon-wrapper">
              <svg viewBox="0 0 24 24" width="50" height="50" fill="#0088cc">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
            </div>
            <h3>Send Message on Telegram!</h3>
            <p>You can only send message via our official telegram app.</p>
            <p>
              Join our growing community on telegram and find suitable matches
              for you via messaging!
            </p>
            <button onClick={handleTelegramRedirect} className="telegram-btn">
              Open App on Telegram (Free)
            </button>
            <button
              className="close-limit-btn"
              onClick={() => setShowMessageModal(false)}
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}
      {showAuthModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Message via Telegram</h3>
            <p>To send a message, please continue on our Telegram app.</p>
            <button onClick={handleTelegramRedirect} style={closeBtnStyle}>
              Join Telegram
            </button>
            <button
              onClick={() => setShowAuthModal(false)}
              style={{ ...closeBtnStyle, background: '#ccc' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {alertMessage && (
        <SketchyAlert
          message={alertMessage.text}
          withButton={alertMessage.withButton}
          onClose={() => setAlertMessage(null)}
        />
      )}
      <Toaster />
    </div>
  );
}

// 2. Add this style object
const rectUploadBtnStyle = {
  position: 'absolute',
  bottom: '15px',
  right: '15px', // Changed from left: 50% and transform
  background: 'rgba(0, 0, 0, 0.6)',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: 'bold',
  letterSpacing: '1px',
  cursor: 'pointer',
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease', // Added for smoother hover
  zIndex: 3, // Ensures it stays on top of the image
};

// Updated Styles
const datingContainer = {
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
};

const cardStyle = {
  width: '300px',
  background: '#ffffff',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const imageStyle = { width: '300px', height: '300px', objectFit: 'cover' };

const shimmer = {
  background: '#f6f7f8',
  backgroundImage: 'linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '800px 300px',
  display: 'inline-block',
  position: 'relative',
  animation: 'shimmer-animation 1s linear infinite',
};

const buttonContainer = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px 30px 20px 30px',
};

const heartBtn = {
  background: 'linear-gradient(45deg, #ff477e, #ff7e5f)',
  border: 'none',
  borderRadius: '50%',
  width: '55px',
  height: '55px',
  cursor: 'pointer',
  fontSize: '24px',
  color: 'white',
  boxShadow: '0 4px 15px rgba(255, 71, 126, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const rejectBtn = {
  background: 'linear-gradient(135deg, #ff477e, #ff5f6d)', // Paste your chosen one-liner here
  border: 'none',
  borderRadius: '50%',
  width: '55px',
  height: '55px',
  cursor: 'pointer',
  fontSize: '20px',
  color: 'white',
  boxShadow: '0 4px 10px rgba(255, 95, 109, 0.3)',
};

const msgBtn = {
  background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
  border: 'none',
  borderRadius: '50%',
  width: '55px',
  height: '55px',
  cursor: 'pointer',
  fontSize: '20px',
  color: 'white',
  boxShadow: '0 4px 10px rgba(79, 172, 254, 0.3)',
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(5px)',
};

const modalContentStyle = {
  background: '#fff',
  padding: '30px',
  borderRadius: '15px',
  width: '80%',
  maxWidth: '300px',
  textAlign: 'center',
  border: '4px solid #000', // Sticker aesthetic
  boxShadow: '8px 8px 0px #000', // Bold shadow
  fontFamily: "'poppins', cursive",
};
const closeBtnStyle = {
  marginTop: '20px',
  padding: '12px 30px',
  background: '#fbc2eb',
  border: '3px solid #000',
  borderRadius: '10px',
  color: '#000',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
  boxShadow: '4px 4px 0px #000',
  transition: 'transform 0.1s',
};

