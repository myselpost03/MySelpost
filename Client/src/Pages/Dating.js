import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SketchyHeader from '../Components/SketchyHeader';
import { supabaseChat } from '../Utils/supabaseGroupChat';
import { users } from '../Data/users';
import SketchyAlert from '../Components/SketchyAlert';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useMessageAdFlow } from '../Hooks/useMessageAdFlow';
import { useAdController } from '../Hooks/useAdController';
import { useAdManager } from '../Hooks/useAdManager';
import '../Styles/AlertBoxes.css';

function Card({ user, isActionable, onAction, onUploadClick, onMessage }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div style={cardStyle}>
      {/* Container for image + upload button */}
      <div
        style={{
          shimmer,
          position: 'relative',
          width: '300px',
          height: '300px',
        }}
      >
        {!isLoaded && (
          <div
            className="shimmer"
            style={{ width: '300px', height: '300px' }}
          />
        )}
        <img
          src={user.image}
          alt={user.name}
          style={{
            ...imageStyle,
            display: isLoaded ? 'block' : 'none',
          }}
          onLoad={() => setIsLoaded(true)}
        />

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const [showFreeLimitModal, setShowFreeLimitModal] = useState(false);
  const [swipeCount, setSwipeCount] = useState(0);
  const [alertMessage, setAlertMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false); // NEW
  const [selectedTarget, setSelectedTarget] = useState(null); // NEW
  const [chatMessage, setChatMessage] = useState(''); // NEW
  // Add this in your Dating component
  const [messagedUsers, setMessagedUsers] = useState([]); // Array to store IDs/names

  const [datingLastAdTime, setDatingLastAdTime] = useState(0);
  const [showAdModal, setShowAdModal] = useState(false);
  const [hasPaidAccess, setHasPaidAccess] = useState(false);
  const navigate = useNavigate();
  const tg = window.Telegram?.WebApp;
  const tgUser = tg?.initDataUnsafe?.user;
  const isTelegram =
    typeof window !== 'undefined' &&
    window.Telegram?.WebApp &&
    window.Telegram.WebApp.initData !== '';

  const swipeLimit = isTelegram ? 40 : 10;

  const { canShowAd, getCooldownRemaining } = useAdController();

  const [id] = useState(6115107);

  const { triggerAd } = useAdManager(id);

  const { canShowMessageAd, registerMessageAd } = useMessageAdFlow();

  useEffect(() => {
    const checkAccess = async () => {
      if (tgUser) {
        const { data } = await supabaseChat
          .from('user_permissions') // Use your unified permissions table
          .select('*')
          .eq('telegram_user_id', tgUser.id)
          .eq('feature_key', 'dating_upgrade_no_ads')
          .single();

        if (data) setHasPaidAccess(true);
      }
    };
    checkAccess();
  }, [tgUser]);

  const handleTelegramRedirect = () => {
    window.open('https://t.me/myselpost_bot/myselpost', '_blank');
  };

const handleAdAction = async (direction) => {
  if (!isTelegram || hasPaidAccess) {
    handleAction(direction);
    return;
  }

  if (direction === 'like') {
    const nextSwipe = swipeCount + 1;
    const shouldShowAd = nextSwipe % 5 === 0;

    if (shouldShowAd) {
      const result = await triggerAd({
        type: "interstitial",
        networks: ["monetag", "adradar", "gigapub"], // ✅ correct
      });

      if (!result.success) {
        const check = canShowAd(result.network || "monetag");

        if (check?.reason === "cooldown") {
          const remaining = Math.ceil((getCooldownRemaining?.() || 0) / 1000);
          toast.error(`Wait ${remaining}s before next swipe ad`);

          // ✅ STILL ALLOW SWIPE
          handleAction(direction);
          return;
        }

        // ✅ fallback exhausted → free swipe
        console.log("All interstitial networks exhausted → skipping ad");
      } else {
        console.log("Interstitial shown via:", result.network);
      }
    }
  }

  handleAction(direction);
};

  const handleAction = (direction) => {
    if (animationClass) return;

    // NEW: Check limit before processing swipe
    if (!hasPaidAccess && swipeCount >= swipeLimit) {
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
      setShowMessageModal(true);
      return;
    }
    // Check if already messaged
    if (messagedUsers.includes(targetUser.name)) {
      toast.error("You've already sent a message to this person!");
      return;
    }

    // Check if limit reached
    if (messagedUsers.length >= 2) {
      setAlertMessage({
        text: 'You can only message 2 people per day!',
        withButton: true,
      });
      return;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setAlertMessage({
        text: 'Please login to send a message.',
        withButton: true,
      });
      return;
    }
    setSelectedTarget(targetUser);
    setShowChatModal(true);
  };

  const submitMessage = async () => {
    const sender = JSON.parse(localStorage.getItem('user'));

    // 🚨 STEP 1: Ad Flow
    if (isTelegram && canShowMessageAd()) {
      const result = await triggerAd();

      if (!result.success) {
        // ❗ Check cooldown specifically (from primary network)
        const check = canShowAd('onclicka');

        if (check.reason === 'cooldown') {
          const remaining = Math.ceil((getCooldownRemaining?.() || 0) / 1000);
          toast.error(`Wait ${remaining}s before sending message`);
          return; // ⛔ block
        }

        // ✅ ALL NETWORKS FAILED → allow free message
        console.log('All ad networks exhausted → allowing free message');
      } else {
        // ✅ Ad success → count it
        registerMessageAd();
        console.log('Ad shown via:', result.network);
      }
    }

    // 🚀 STEP 2: Send message
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

      setMessagedUsers((prev) => [...prev, selectedTarget.name]);

      toast.success('Message sent successfully!', { duration: 4000 });

      setShowChatModal(false);
      setChatMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message.');
    }
  };
  const handleUpgrade = async () => {
    const tg = window.Telegram?.WebApp;
    const tgUser = tg?.initDataUnsafe?.user;

    if (!tgUser) {
      console.log('Open inside Telegram');
      return;
    }
    try {
      // 1. Get the invoice URL from your backend
      const response = await axios.post(
        'https://bot-1hr9.onrender.com/create-access-invoice',
        {
          telegram_user_id: tgUser.id,
          feature_type: 'dating_upgrade_no_ads', // Dynamic key
          title: 'Dating Upgraded',
          amount: 30, // Price in Stars
        }
      );

      const { invoice_url } = response.data;

      if (invoice_url) {
        tg.openInvoice(invoice_url, (status) => {
          // Statuses: 'paid', 'failed', 'pending', 'cancelled'
          if (status === 'paid') {
            setHasPaidAccess(true);
            toast.success('Payment successful! You can now swipe without any ads.', { duration: 4000 });
          } else if (status === 'failed') {
            toast.error('Payment failed. Please try again.', { duration: 4000 });
          }
        });

        setShowAdModal(false);
      }
    } catch (err) {
      console.error('Error initiating payment:', err);
      toast.error('Could not create invoice. Please try again later.', { duration: 4000 });
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
        <div className="chat-modal-overlay">
          <div className="chat-modal-container">
            <h3 className="chat-modal-title">Message {selectedTarget?.name}</h3>

            <textarea
              className="chat-modal-input"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type something special to get her attention..."
            />

            <div className="chat-modal-actions">
              <button
                className="chat-modal-btn chat-modal-btn--primary"
                onClick={submitMessage}
              >
                Send
              </button>
              <button
                className="chat-modal-btn chat-modal-btn--secondary"
                onClick={() => setShowChatModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showFreeLimitModal && (
        <div className="limit-modal-overlay">
          <div className="limit-modal-content">
            <div className="limit-modal-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="limit-modal-title">Limit Reached</h3>
            <p className="limit-modal-message">
              Free users can only swipe 40 cards per day.
            </p>
            <button
              className="limit-modal-close-btn"
              onClick={() => setShowFreeLimitModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showModal && (
        <div className="security-modal-overlay">
          <div className="security-modal-content">
            <h2>🛡️ Verification Pending</h2>
            <p>
              Your account is currently undergoing an{' '}
              <strong>automated security review</strong>. Uploads will be{' '}
              <strong>automatically enabled in 30 days</strong> once your human
              presence is verified.
            </p>

            <button
              className="security-btn"
              onClick={() => setShowModal(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
      {showAdModal && (
        <div className="dating-modal-overlay">
          <div className="dating-ad-modal">
            <h3 className="modal-title">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="#ff4757"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  filter: 'drop-shadow(0px 4px 6px rgba(255, 71, 87, 0.3))',
                }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>Get More Swipes</span>
            </h3>
            <p className="modal-description">
              Watch an ad to continue, or go Premium for an
              <span className="highlight-adfree"> ad-free </span>
              experience.
            </p>
            <div className="dating-button-group">
              <button
                onClick={() => {
                  setDatingLastAdTime(Date.now());
                  setShowAdModal(false);
                  handleAction('like');
                }}
                className="dating-btn-primary"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: '10px', verticalAlign: 'middle' }}
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Watch Ad
              </button>
              <button className="dating-btn-secondary" onClick={handleUpgrade}>
                Upgrade (Stars)
              </button>
            </div>
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
            onAction={handleAdAction}
            onMessage={() => handleOpenChat(users[currentIndex])}
            onUploadClick={() => setShowModal(true)}
          />
        </div>
      </div>
      {showTelegramModal && (
        <div className="tg-modal-overlay">
          <div className="tg-modal-card">
            <div className="tg-modal-icon">
              <svg viewBox="0 0 24 24" width="50" height="50" fill="#0088cc">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
            </div>

            <h3 className="tg-modal-title">Swipe More on Telegram!</h3>

            <p className="tg-modal-desc">
              <strong>Swipe more</strong> and chat with your matches directly on
              our Telegram community.
            </p>

            <div className="tg-modal-actions">
              <button
                className="tg-modal-btn tg-modal-btn--primary"
                onClick={handleTelegramRedirect}
              >
                Open App on Telegram (Free)
              </button>
              <button
                className="tg-modal-btn tg-modal-btn--secondary"
                onClick={() => setShowTelegramModal(false)}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
      {showMessageModal && (
        <div className="tg-modal-overlay">
          <div className="tg-modal-card">
            <div className="tg-modal-icon">
              <svg viewBox="0 0 24 24" width="50" height="50" fill="#0088cc">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
            </div>

            <h3 className="tg-modal-title">Send Message on Telegram!</h3>

            <p className="tg-modal-desc">
              You can only send message via our official telegram app.
            </p>

            <div className="tg-modal-actions">
              <button
                className="tg-modal-btn tg-modal-btn--primary"
                onClick={handleTelegramRedirect}
              >
                Open App on Telegram (Free)
              </button>
              <button
                className="tg-modal-btn tg-modal-btn--secondary"
                onClick={() => setShowMessageModal(false)}
              >
                Maybe Later
              </button>
            </div>
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
  backgroundImage:
    'linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%)',
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
