import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseChat } from '../Utils/supabaseGroupChat';
import '../Styles/ChatRoom.css';
import ChatHeader from '../Components/ChatHeader';
import AdsterraBanner from '../Components/AdsterraBanner';
import AdsterraNativeBanner from '../Components/AdsterraNativeBanner';

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState(
    'Anon' + Math.floor(Math.random() * 1000)
  );
  const [tempUsername, setTempUsername] = useState('');
  const [showModal, setShowModal] = useState(() => {
    return !localStorage.getItem('chat_joined');
  });
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('chat_user_id') || null;
  });
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false); // Track first message
  const messagesEndRef = useRef(null);
  const [messageCount, setMessageCount] = useState(0); // Track sent messages
  const [showTelegramModal, setShowTelegramModal] = useState(false); // Telegram limit modal
  const navigate = useNavigate();
  const handleTelegramRedirect = () => {
    window.open('https://t.me/myselpost_bot/myselpost', '_blank'); // Replace with your actual link
  };
  const isTelegram =
    typeof window !== 'undefined' &&
    window.Telegram?.WebApp &&
    window.Telegram.WebApp.initData !== '';

  const handleBack = () => {
    navigate(-1);
  };
  useEffect(() => {
    const savedName = localStorage.getItem('chat_username');
    if (savedName) {
      setUsername(savedName);
    }
  }, []);
  const handleJoinChat = (e) => {
    e.preventDefault();
    if (tempUsername.trim()) {
      const name = tempUsername.trim();
      const newId =
        'user_' + Math.random().toString(36).substr(2, 9) + Date.now();
      setUsername(name);
      setUserId(newId);

      localStorage.setItem('chat_joined', 'true');
      localStorage.setItem('chat_username', name);
      localStorage.setItem('chat_user_id', newId); // Save ID

      setShowModal(false);
    }
  };
  const fetchMessages = async () => {
    const { data, error } = await supabaseChat
      .from('group_chat')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) console.error('Error fetching:', error);
    else setMessages(data || []);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => fetchMessages(), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    // Check if user hit the 10 message limit and is NOT on Telegram
    if (!isTelegram && messageCount >= 300) {
      setShowTelegramModal(true);
      return;
    }
    const { error } = await supabaseChat
      .from('group_chat')
      .insert([{ username, user_id: userId, message: newMessage }]);

    if (error) {
      console.error('Error sending:', error);
    } else {
      setNewMessage('');
      setMessageCount((prev) => prev + 1);
      setHasSentFirstMessage(true);
      fetchMessages();
    }
  };

  return (
    <div className="chat-room-app-wrapper">
      {/* Fixed Header */}
      <ChatHeader
        title="Chat Room"
        onBack={handleBack}
        showBlock={false}
        showVideo={false}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center', // Centers horizontally
          alignItems: 'center', // Centers vertically
          minHeight: '22vh', // Provides space without using padding
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
      {showModal && (
        <div className="chat-room-modal-overlay">
          <div className="chat-room-modal-content">
            <h3>Join Chat Room</h3>
            <form onSubmit={handleJoinChat}>
              <label>Enter in chat room as:</label>
              <input
                type="text"
                autoFocus
                placeholder="Your name..."
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                required
              />
              <button type="submit">Enter</button>
            </form>
          </div>
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
      {/* Full Screen Scrollable Area */}
      <main className="chat-room-messages-container">
        {messages.map((msg, index) => {
          const items = [];
          const globalIndex = index + 1;

          // 1. Show Native Banner after the user's first message
          if (hasSentFirstMessage && index === 0) {
            items.push(<AdsterraNativeBanner key="banner-first" />);
          }
          items.push(
            <div
              key={msg.id}
              className={`chat-room-message-row ${
                msg.user_id === userId ? 'chat-room-own' : ''
              }`}
            >
              <div className="chat-room-bubble">
                {msg.user_id !== userId && (
                  <span className="chat-room-bubble-user">{msg.username}</span>
                )}
                <p className="chat-room-bubble-text" style={{ color: '#111' }}>
                  {msg.message}
                </p>
              </div>
            </div>
          );

          // 3. Show Native Banner after every 30 messages
          if (globalIndex % 30 === 0) {
            items.push(<AdsterraNativeBanner key={`banner-${globalIndex}`} />);
          }

          return items;
        })}
        <div ref={messagesEndRef} />
      </main>

      {/* Fixed Bottom Input Area */}
      <footer className="chat-room-footer-input-bar">
        <form className="chat-room-input-form" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
}
