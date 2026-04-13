import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import OneSignal from 'react-onesignal';
import {
  FaBan,
  FaImage,
  FaTimes,
  FaCoins,
  FaGift,
  FaPlayCircle,
} from 'react-icons/fa';
import { supabaseChat } from '../Utils/supabaseGroupChat';
import '../Styles/ChatRoom.css';
import ChatHeader from '../Components/ChatHeader';
import AdsterraNativeBanner from '../Components/AdsterraNativeBanner';
import AdsterraBanner from '../Components/AdsterraBanner';
import Gift from '../Assets/gift-2.png';
import axios from 'axios';

// Mock Gift Data
const GIFTS = [
  { id: 'rose', name: 'Rose', cost: 5, icon: '🌹' },
  { id: 'chocolate', name: 'Chocolate', cost: 20, icon: '🍫' },
  { id: 'diamond', name: 'Diamond', cost: 100, icon: '💎' },
  { id: 'car', name: 'Luxury Car', cost: 500, icon: '🏎️' },
];

export default function GuestChat() {
  const { receiverId } = useParams(); // Get ID from URL (/chat/:receiverId)
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiver, setReceiver] = useState(null); // To store receiver's name/info
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [hasPaidAccess, setHasPaidAccess] = useState(false);
 const [checkingPermission, setCheckingPermission] = useState(true);
   const [notificationAllowed, setNotificationAllowed] = useState(false);
   
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [showImageTelegramModal, setShowImageTelegramModal] = useState(false);
  const [showGiftTelegramModal, setShowGiftTelegramModal] = useState(false);
  const [showStarImageModal, setShowStarImageModal] = useState(false);

  const [isBlocked, setIsBlocked] = useState(false); // Am I blocked by them?
  const [hasBlockedThem, setHasBlockedThem] = useState(false); // Did I block them?
  const [unblurredImages, setUnblurredImages] = useState({});
  const [deletingMessages, setDeletingMessages] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [lastImageTimestamp, setLastImageTimestamp] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [userCoins, setUserCoins] = useState(0); // Track user coins

  // UI State
  const [showGiftPalette, setShowGiftPalette] = useState(false);
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [showReceivedGifts, setShowReceivedGifts] = useState(false); // New state for Gifts View
  const [adCooldown, setAdCooldown] = useState(0);
  const navigate = useNavigate();

  // Get current guest user from local storage
  const currentUser = JSON.parse(localStorage.getItem('guestUser'));
  const currentUserId = currentUser?.id;
  const tg = window.Telegram?.WebApp;
  const tgUser = tg?.initDataUnsafe?.user;
  const isTelegram =
    typeof window !== 'undefined' &&
    window.Telegram?.WebApp &&
    window.Telegram.WebApp.initData !== '';

  const fetchUserCoins = async () => {
    if (!currentUserId) return;
    const { data, error } = await supabaseChat
      .from('users')
      .select('coins')
      .eq('id', currentUserId)
      .single();
    if (!error && data) setUserCoins(data.coins || 0);
  };
  useEffect(() => {
    const checkAccess = async () => {
      if (tgUser) {
        const { data } = await supabaseChat
          .from('user_permissions') // Use your unified permissions table
          .select('*')
          .eq('telegram_user_id', tgUser.id)
          .eq('feature_key', 'guest_chat_image_access')
          .single();

        if (data) setHasPaidAccess(true);
      }
    };
    checkAccess();
  }, [tgUser]);
  useEffect(() => {
    fetchUserCoins();
  }, [currentUserId]);

   // --- OneSignal Permission Check ---
   useEffect(() => {
  const checkPermission = async () => {
    try {
      const saved = localStorage.getItem('notifSubscribed');

      if (Notification.permission === 'granted' || saved === 'true') {
        setNotificationAllowed(true);
        alert("🔔 Notifications enabled!");
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
          //console.log('✅ Player ID:', playerId);
  
          setNotificationAllowed(true);
        localStorage.setItem('notifSubscribed', 'true');

        } else {
          console.log('❌ Permission denied');
          setNotificationAllowed(false);
        }
      } catch (err) {
        console.error('❌ Error subscribing:', err);
        setNotificationAllowed(false);
      }
    };

  // Handle Ad Watch (10 coins + 30s cooldown)
  const handleWatchAd = async () => {
    if (adCooldown > 0) return;

    alert('Watching Ad... You earned 10 coins!');

    const newCoinCount = userCoins + 10;

    // Update Database
    const { error } = await supabaseChat
      .from('users')
      .update({ coins: newCoinCount })
      .eq('id', currentUserId);

    if (!error) {
      setUserCoins(newCoinCount);
      setAdCooldown(30);
    } else {
      console.error('Coin update failed:', error);
    }
  };

  // Cooldown timer for Ad
  useEffect(() => {
    if (adCooldown > 0) {
      const timer = setInterval(() => setAdCooldown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [adCooldown]);

  const handleGiftClick = () => {
    if (!isTelegram) {
      setShowGiftPalette(false);
      setShowGiftTelegramModal(true); // Show the redirect modal
      return;
    }
    setShowGiftPalette(true);
  };

  // Send Gift Function
  const sendGift = async (gift) => {
    if (!isTelegram) {
      setShowTelegramModal(true); // Show the redirect modal
      return;
    }
    if (userCoins < gift.cost) {
      setShowGiftPalette(false);
      setShowCoinModal(true);
      return;
    }

    // 1. Deduct coins in DB
    const { error: coinError } = await supabaseChat
      .from('users')
      .update({ coins: userCoins - gift.cost })
      .eq('id', currentUserId);

    if (!coinError) {
      setUserCoins((prev) => prev - gift.cost);

      // 2. Send gift as a message in the chat table
      const { error: msgError } = await supabaseChat.from('chats').insert([
        {
          sender_id: currentUserId,
          receiver_id: receiverId,
          message: `Sent a 🎁`,
          status: 'sent',
        },
      ]);

      if (!msgError) {
        setShowGiftPalette(false);
        fetchMessages();
      }
    }
  };

  // Helper to check if the user is allowed to send another message
  const checkCanSend = () => {
    if (isTelegram) return true; // Inside Telegram? No restrictions.

    // Count how many messages the current user has sent in this conversation
    const sentCount = messages.filter(
      (m) => m.sender_id === currentUserId
    ).length;

    if (sentCount >= 50) {
      setShowTelegramModal(true);
      return false;
    }
    return true;
  };

  useEffect(() => {
    let timer;
    if (cooldownRemaining > 0) {
      timer = setInterval(() => {
        setCooldownRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  // 1. Check Block Status
  const checkBlockStatus = async () => {
    if (!currentUserId || !receiverId) return;

    const { data: blockData } = await supabaseChat
      .from('blocks')
      .select('*')
      .or(
        `and(blocker_id.eq.${currentUserId},blocked_id.eq.${receiverId}),and(blocker_id.eq.${receiverId},blocked_id.eq.${currentUserId})`
      );

    if (blockData) {
      const blockedMe = blockData.find((b) => b.blocker_id === receiverId);
      const iBlockedThem = blockData.find(
        (b) => b.blocker_id === currentUserId
      );

      setIsBlocked(!!blockedMe);
      setHasBlockedThem(!!iBlockedThem);
    }
  };

  // 2. Handle Block Action
  const handleBlockUser = async () => {
    if (window.confirm('Are you sure you want to block this user?')) {
      const { error } = await supabaseChat
        .from('blocks')
        .insert([{ blocker_id: currentUserId, blocked_id: receiverId }]);

      if (!error) {
        setHasBlockedThem(true);
        alert('User blocked.');
      }
    }
  };

  useEffect(() => {
    checkBlockStatus();
    // Poll for block status so the receiver sees the "Blocked" message quickly
    const blockInterval = setInterval(checkBlockStatus, 5000);
    return () => clearInterval(blockInterval);
  }, [receiverId, currentUserId]);

  useEffect(() => {
    const clearUnread = async () => {
      if (!currentUserId || !receiverId || isBlocked) return;

      // When I enter the chat, mark all messages FROM this sender TO me as 'read'
      await supabaseChat
        .from('chats')
        .update({ status: 'read' })
        .eq('receiver_id', currentUserId)
        .eq('sender_id', receiverId)
        .eq('status', 'sent');
    };

    clearUnread();
  }, [receiverId, currentUserId, isBlocked]);

  const handleBack = () => navigate(-1);
  const handleTelegramRedirect = () => {
    window.open('https://t.me/myselpost_bot/myselpost', '_blank');
  };

  // 1. Fetch Receiver Details for the Header
  useEffect(() => {
    const fetchReceiverDetails = async () => {
      const { data, error } = await supabaseChat
        .from('users')
        .select('name')
        .eq('id', receiverId)
        .single();

      if (!error && data) setReceiver(data);
    };
    if (receiverId) fetchReceiverDetails();
  }, [receiverId]);

  // 2. Fetch ONLY private messages between these two users
  const fetchMessages = async () => {
    if (!currentUserId || !receiverId || isBlocked || hasBlockedThem) return;

    const { data, error } = await supabaseChat
      .from('chats')
      .select('*')
      .or(
        `and(sender_id.eq.${currentUserId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${currentUserId})`
      )
      .order('created_at', { ascending: true });

    if (error) console.error('Error fetching:', error);
    else
      setMessages((prev) => {
        const ads = prev.filter((m) => m.isAd); // keep old ads
        return [...(data || []), ...ads];
      });
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => fetchMessages(), 2000);
    return () => clearInterval(interval);
  }, [receiverId, currentUserId, isBlocked, hasBlockedThem]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to handle Image Selection and Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || isBlocked || hasBlockedThem) return;
    if (!checkCanSend()) return;
    // New check: If user typed 'sx' in the input box, we treat this as a Star payment test
    const isStarTest = newMessage.trim().toLowerCase() === 'sx';
    // Check Cooldown
    const now = Date.now();
    const secondsSinceLast = (now - lastImageTimestamp) / 1000;
    if (secondsSinceLast < 60) {
      alert(
        `Please wait ${Math.ceil(
          60 - secondsSinceLast
        )} seconds before sending another image.`
      );
      return;
    }
    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${currentUserId}/${fileName}`;

    // 1. Upload to Supabase Storage
    const { data, error: uploadError } = await supabaseChat.storage
      .from('chat-images')
      .upload(filePath, file);

    if (uploadError) return alert('Upload failed');

    // 2. Get Public URL
    const {
      data: { publicUrl },
    } = supabaseChat.storage.from('chat-images').getPublicUrl(filePath);

    // 3. Save to Chat Table
    await supabaseChat.from('chats').insert([
      {
        sender_id: currentUserId,
        receiver_id: receiverId,
        message: isStarTest ? 'STAR_PAY_REQ' : 'Sent an image',
        image_url: publicUrl,
        status: 'sent',
      },
    ]);
    if (isStarTest) setNewMessage('');
    setLastImageTimestamp(Date.now());
    setCooldownRemaining(60);
    setIsUploading(false);
    fetchMessages();
  };

  const finalDeleteImage = async (messageId, imageUrl) => {
    try {
      // 1. Extract file path from URL (assuming standard Supabase URL structure)
      // URL looks like: .../storage/v1/object/public/chat-images/senderId/filename.jpg
      const pathParts = imageUrl.split('chat-images/');
      const filePath = pathParts[1];

      if (filePath) {
        await supabaseChat.storage.from('chat-images').remove([filePath]);
      }

      // 2. Delete from Database
      await supabaseChat.from('chats').delete().eq('id', messageId);

      // 3. Update UI
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      setDeletingMessages((prev) => {
        const updated = { ...prev };
        delete updated[messageId];
        return updated;
      });
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const toggleBlur = (msg) => {
    if (!isTelegram) {
      setShowImageTelegramModal(true);
      return;
    }

    const messageId = msg.id;
    setUnblurredImages((prev) => {
      const currentStatus = prev[messageId] || 0;
      const newStatus = currentStatus + 1;

      // Trigger auto-delete when it becomes fully visible (status reaches 2)
      if (newStatus === 2) {
        setTimeout(() => {
          // Start "Disappearing" animation 10 seconds later
          setDeletingMessages((prev) => ({ ...prev, [messageId]: true }));

          // After animation (500ms), remove from DB/Storage
          setTimeout(() => {
            finalDeleteImage(messageId, msg.image_url);
          }, 500);
        }, 10000); // 10 second delay
      }

      return { ...prev, [messageId]: newStatus };
    });
  };

  // 3. Send Message with IDs
  const sendMessage = async (e) => {
    e.preventDefault();
    if (isBlocked || hasBlockedThem || !newMessage.trim() || !currentUserId)
      return;
    if (!checkCanSend()) return;
    const { error } = await supabaseChat.from('chats').insert([
      {
        sender_id: currentUserId,
        receiver_id: receiverId,
        message: newMessage,
        status: 'sent',
      },
    ]);

    if (error) {
      console.error('Error sending:', error);
    } else {
      setNewMessage('');

      fetchMessages(); // Refresh UI
    }
  };

  const receivedGifts = messages.filter(
    (m) => m.receiver_id === currentUserId && m.message.includes('🎁')
  );

  const handlePay = async () => {
    const tg = window.Telegram?.WebApp;
    const tgUser = tg?.initDataUnsafe?.user;

    if (!tgUser) {
      alert('Please open inside Telegram');
      return;
    }

    try {
      const response = await axios.post(
        'https://bot-1hr9.onrender.com/create-access-invoice',
        {
          telegram_user_id: tgUser.id,
          feature_type: 'guest_chat_image_access',
          title: 'Unlock Guest Image',
          amount: 10,
        }
      );

      const { invoice_url } = response.data;

      if (invoice_url) {
        tg.openInvoice(invoice_url, (status) => {
          if (status === 'paid') {
            setHasPaidAccess(true); // This updates the UI state immediately
            setShowStarImageModal(false); // Close the modal
            alert('Payment successful! Image unlocked.');
          } else if (status === 'failed') {
            alert('Payment failed.');
          }
        });
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Payment error.');
    }
  };

  return (
    <div className="chat-room-app-wrapper">
      {/* Updated Header with Receiver's Name */}
      <ChatHeader
        title={receiver?.name || 'Chat'}
        onBack={handleBack}
        showBlock={false}
        showVideo={false}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center', // Centers horizontally
          alignItems: 'center', // Centers vertically
          minHeight: '30vh', // Provides space without using padding
          width: '100%',
          overflow: 'hidden',
          paddingTop: '30%',
          // Ensures no scrollbars if the ad is slightly off
        }}
      >
        <div style={{ maxWidth: '100%' }}>
          <AdsterraBanner />
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <button
        className="fixed-gifts-btn"
        onClick={() => setShowReceivedGifts(true)}
      >
        <img src={Gift} alt="Gift Box" className="gift-img" />
      </button>
       {!notificationAllowed && !checkingPermission && (
  <button
    onClick={handleSubscribe}
    className="notify-float-btn"
  >
    🔔
  </button>
)}
      </div>
      {showReceivedGifts && (
        <div
          className="gift-palette-overlay"
          onClick={() => setShowReceivedGifts(false)}
        >
          <div
            className="gift-palette-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gift-palette-header">
              <h3>My Collection</h3>
              <button
                onClick={() => setShowReceivedGifts(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px' }}
              >
                <FaTimes />
              </button>
            </div>
            <div
              className="gift-grid"
              style={{ maxHeight: '400px', overflowY: 'auto' }}
            >
              {receivedGifts.length > 0 ? (
                receivedGifts.map((giftMsg) => (
                  <div
                    key={giftMsg.id}
                    className="gift-item"
                    style={{ border: '1px solid #ddd' }}
                  >
                    <span className="gift-icon" style={{ fontSize: '30px' }}>
                      {giftMsg.message.split(' ').pop()}
                    </span>
                    <span className="gift-name" style={{ fontSize: '12px' }}>
                      {new Date(giftMsg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ gridColumn: '1/-1', padding: '20px' }}>
                  No gifts received yet!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {showGiftPalette && (
        <div
          className="gift-palette-overlay"
          onClick={() => setShowGiftPalette(false)}
        >
          <div
            className="gift-palette-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gift-palette-header">
              <h3>Send a Gift</h3>
              <span>
                <FaCoins color="gold" /> {userCoins}
              </span>
            </div>
            <div className="gift-grid">
              {GIFTS.map((gift) => (
                <div
                  key={gift.id}
                  className="gift-item"
                  onClick={() => sendGift(gift)}
                >
                  <span className="gift-icon">{gift.icon}</span>
                  <span className="gift-name">{gift.name}</span>
                  <span className="gift-cost">{gift.cost} Coins</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Insufficient Coins / Ad Modal */}
      {showCoinModal && (
        <div className="coin-modal-overlay">
          <div className="coin-modal-card">
            <div className="coin-modal-icon">
              <FaCoins size={40} color="gold" />
            </div>

            <h3 className="coin-modal-title">Not Enough Coins!</h3>
            <p className="coin-modal-desc">
              You need more coins to send this gift.
            </p>

            <div className="coin-modal-actions">
              <button
                className={`coin-modal-btn ${
                  adCooldown > 0
                    ? 'coin-modal-btn--disabled'
                    : 'coin-modal-btn--primary'
                }`}
                onClick={handleWatchAd}
                disabled={adCooldown > 0}
              >
                {adCooldown > 0 ? (
                  `Wait ${adCooldown}s`
                ) : (
                  <>
                    <FaPlayCircle /> Watch Ad (+10 Coins)
                  </>
                )}
              </button>/

              <button
                className="coin-modal-btn coin-modal-btn--secondary"
                onClick={() => setShowCoinModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedImage && (
        <div
          className="fullscreen-overlay"
          onClick={() => setSelectedImage(null)}
        >
          <button className="close-fullscreen">
            <FaTimes />
          </button>
          <img src={selectedImage} alt="Fullscreen" />
        </div>
      )}
      {showTelegramModal && (
        <div className="tg-modal-overlay">
          <div className="tg-modal-card">
            <div className="tg-modal-icon">
              <svg viewBox="0 0 24 24" width="50" height="50" fill="#0088cc">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
            </div>

            <h3 className="tg-modal-title">Chat More on Telegram!</h3>

            <p className="tg-modal-desc">
              You've chatted a lot here! Continue the conversation in our
              Telegram community.
            </p>

            <div className="tg-modal-actions">
              <button
                className="tg-modal-btn tg-modal-btn--primary"
                onClick={handleTelegramRedirect}
              >
                Chat on Telegram (Free)
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
      {showImageTelegramModal && (
        <div className="tg-modal-overlay">
          <div className="tg-modal-card">
            <div className="tg-modal-icon">
              <svg viewBox="0 0 24 24" width="50" height="50" fill="#0088cc">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
            </div>

            <h3 className="tg-modal-title">View Image on Telegram</h3>

            <p className="tg-modal-desc">
              For privacy and security, full-resolution images can only be
              revealed within the official Telegram app.
            </p>

            <div className="tg-modal-actions">
              <button
                className="tg-modal-btn tg-modal-btn--primary"
                onClick={handleTelegramRedirect}
              >
                Open Telegram to Reveal
              </button>
              <button
                className="tg-modal-btn tg-modal-btn--secondary"
                onClick={() => setShowImageTelegramModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showStarImageModal && (
        <div className="star-modal-overlay">
          <div className="star-modal-card">
            <div className="star-modal-icon">⭐</div>
            <h2 className="star-modal-title">Unlock Adult Image</h2>
            <p className="star-modal-text">
              Pay <strong>10 Stars</strong> to unlock this adult image.
            </p>

            <div className="star-modal-actions">
              <button
                className="star-modal-btn star-modal-btn-cancel"
                onClick={() => setShowStarImageModal(false)}
              >
                Cancel
              </button>
              <button
                className="star-modal-btn star-modal-btn-confirm"
                onClick={handlePay}
              >
                Pay & Unlock
              </button>
            </div>
          </div>
        </div>
      )}
      {showGiftTelegramModal && (
        <div className="tg-modal-overlay">
          <div className="tg-modal-card">
            <div className="tg-modal-icon">
              <svg viewBox="0 0 24 24" width="50" height="50" fill="#0088cc">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
            </div>

            <h3>Send Gift on our Telegram App</h3>
            <p>
              For privacy and security, gifts can only be send within our
              official Telegram app myselpost.
            </p>

            <div className="tg-modal-actions">
              <button
                className="tg-modal-btn tg-modal-btn--primary"
                onClick={handleTelegramRedirect}
              >
                Open Telegram to Send Gift
              </button>
              <button
                className="tg-modal-btn tg-modal-btn--secondary"
                onClick={() => setShowGiftTelegramModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <main className="chat-room-messages-container">
        {isBlocked || hasBlockedThem ? (
          <div className="blocked-notice-container">
            <div className="blocked-badge">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="#ff4d4d">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
              </svg>
              <p>
                {isBlocked
                  ? 'You are blocked by this user'
                  : 'You have blocked this user'}
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwn = msg.sender_id === currentUserId;
            const revealStatus = unblurredImages[msg.id] || 0;
            const isDisappearing = deletingMessages[msg.id];
            // Logical message position (1-based index)
            const msgPos = index + 1;

            /** * Ad Logic:
             * 1. Show after the 5th message (msgPos === 5)
             * 2. Show after 30 more messages (msgPos === 35, 65, 95...)
             * Formula: (msgPos - 5) % 30 === 0
             */
            const shouldShowAd =
              msgPos === 5 || (msgPos > 5 && (msgPos - 5) % 15 === 0);
            return (
              <React.Fragment key={msg.id}>
                {shouldShowAd && (
                  <div className="chat-room-message-row" key={`ad-${index}`}>
                    <div
                      className="chat-room-bubble"
                      style={{
                        textAlign: 'center',
                        background: 'transparent',
                        boxShadow: 'none',
                        width: '100%',
                      }}
                    >
                      <AdsterraNativeBanner />
                    </div>
                  </div>
                )}
                <div
                  // Check sender_id to determine if it's the current user's message
                  className={
                    `chat-room-message-row 
        ${isOwn ? 'chat-room-own' : ''} 
        ${isDisappearing ? 'message-disappearing' : ''}` // Animation class
                  }
                >
                  <div className="chat-room-bubble">
                    {msg.image_url ? (
                      <div className="guest-image-message-container">
                        {!isOwn && msg.message === 'STAR_PAY_REQ' ? (
                          // SHOW STAR PAY BUTTON
                          isTelegram ? (
                            hasPaidAccess ? (
                              <button
                                className="guest-reveal-btn"
                                onClick={() => toggleBlur(msg)}
                              >
                                <span style={{ marginRight: '8px' }}>⭐</span>{' '}
                                CLICK TO REVEAL IMAGE
                              </button>
                            ) : (
                              <button
                                className="guest-reveal-btn"
                                onClick={() => setShowStarImageModal(true)}
                              >
                                <span style={{ marginRight: '8px' }}>⭐</span>{' '}
                                CLICK TO REVEAL IMAGE
                              </button>
                            )
                          ) : (
                            <button
                              className="guest-reveal-btn"
                              onClick={() => setShowImageTelegramModal(true)}
                            >
                              <span style={{ marginRight: '8px' }}>⭐</span>{' '}
                              CLICK TO REVEAL IMAGE
                            </button>
                          )
                        ) : !isOwn && revealStatus === 0 ? (
                          <button
                            className="guest-reveal-btn"
                            onClick={() => toggleBlur(msg)}
                          >
                            CLICK TO REVEAL IMAGE
                          </button>
                        ) : (
                          <div className="guest-image-wrapper">
                            <img
                              src={msg.image_url}
                              alt="Sent"
                              className={
                                !isOwn && revealStatus === 1
                                  ? 'guest-blurred-img'
                                  : ''
                              }
                              onClick={() => {
                                // Only allow fullscreen if revealed or own image
                                if (isOwn || revealStatus >= 2)
                                  setSelectedImage(msg.image_url);
                              }}
                            />
                            {!isOwn && revealStatus === 1 && (
                              <button
                                className="guest-unblur-overlay-btn"
                                onClick={() => toggleBlur(msg)}
                              >
                                Unblur
                              </button>
                            )}
                            {revealStatus >= 2 && !isOwn && (
                              <div className="self-destruct-badge">
                                Deletes in 10s
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="chat-room-bubble-text">{msg.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </main>

      {!isBlocked && !hasBlockedThem && (
        <>
          <footer className="chat-room-footer-input-bar">
            <form className="chat-room-input-form" onSubmit={sendMessage}>
              <button
                type="button"
                className="block-action-btn"
                onClick={handleBlockUser}
                title="Block User"
              >
                <FaBan />
              </button>
              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />

              {/* Image Icon Button */}
              <button
                type="button"
                className={`guest-image-upload-btn ${
                  cooldownRemaining > 0 ? 'cooldown-active' : ''
                }`}
                onClick={() =>
                  !isUploading &&
                  cooldownRemaining === 0 &&
                  fileInputRef.current.click()
                }
                disabled={cooldownRemaining > 0}
              >
                {isUploading ? (
                  <div className="mini-spinner"></div>
                ) : cooldownRemaining > 0 ? (
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    {cooldownRemaining}s
                  </span>
                ) : (
                  <FaImage />
                )}
              </button>
              <button
                type="button"
                className="gift-trigger-btn"
                onClick={handleGiftClick}
                style={{
                  color: '#111',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0 5px',
                }}
              >
                <FaGift />
              </button>
              
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                </svg>
              </button>
            </form>
          </footer>
        </>
      )}
     
    </div>
  );
}
