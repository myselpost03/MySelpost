import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaBan, FaImage, FaTimes } from 'react-icons/fa';
import { supabaseChat } from '../Utils/supabaseGroupChat';
import '../Styles/ChatRoom.css';
import ChatHeader from '../Components/ChatHeader';

export default function GuestChat() {
  const { receiverId } = useParams(); // Get ID from URL (/chat/:receiverId)
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiver, setReceiver] = useState(null); // To store receiver's name/info
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [messageCount, setMessageCount] = useState(0);
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false); // Am I blocked by them?
  const [hasBlockedThem, setHasBlockedThem] = useState(false); // Did I block them?
  const [unblurredImages, setUnblurredImages] = useState({});
  const [deletingMessages, setDeletingMessages] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

  // Get current guest user from local storage
  const currentUser = JSON.parse(localStorage.getItem('guestUser'));
  const currentUserId = currentUser?.id;
  // Inside GuestChat.js
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

  const isTelegram =
    typeof window !== 'undefined' &&
    window.Telegram?.WebApp &&
    window.Telegram.WebApp.initData !== '';

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
    else setMessages(data || []);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => fetchMessages(), 3000);
    return () => clearInterval(interval);
  }, [receiverId, currentUserId, isBlocked, hasBlockedThem]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to handle Image Selection and Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || isBlocked || hasBlockedThem) return;
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
        message: 'Sent an image',
        image_url: publicUrl,
        status: 'sent',
      },
    ]);
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

    if (!isTelegram && messageCount >= 12) {
      setShowTelegramModal(true);
      return;
    }

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
      setMessageCount((prev) => prev + 1);
      fetchMessages(); // Refresh UI
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
        <div className="chat-room-modal-overlay telegram-popup-overlay">
          <div className="chat-room-modal-content telegram-popup-content">
            <div className="telegram-icon-wrapper">
              <svg viewBox="0 0 24 24" width="50" height="50" fill="#0088cc">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
            </div>
            <h3>Chat More on Telegram!</h3>
            <p>You've already chatted so much here.</p>
            <p>
              To keep the conversation going, join us on our official Telegram
              app!
            </p>
            <button onClick={handleTelegramRedirect} className="telegram-btn">
              Chat on Telegram (Free)
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
          messages.map((msg) => {
            const isOwn = msg.sender_id === currentUserId;
            const revealStatus = unblurredImages[msg.id] || 0;
            const isDisappearing = deletingMessages[msg.id];
            return (
              <div
                key={msg.id}
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
                      {!isOwn && revealStatus === 0 ? (
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
                    <p className="chat-room-bubble-text">{msg.message}</p>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </main>
      {!isBlocked && !hasBlockedThem && (
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
              className="guest-image-upload-btn"
              onClick={() => !isUploading && fileInputRef.current.click()}
            >
              {isUploading ? <div className="mini-spinner"></div> : <FaImage />}
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
      )}
    </div>
  );
}
