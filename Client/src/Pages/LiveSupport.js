import React, { useState, useEffect, useCallback, useRef } from 'react'; // 1. Added useRef
import '../Styles/LiveSupport.css';
import {useNavigate} from "react-router-dom"
import { supabase } from "../Utils/supabaseClient";
import SketchyHeader from '../Components/SketchyHeader';

const LiveSupport = () => {
  const [connecting, setConnecting] = useState(true);
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [bgStyle, setBgStyle] = useState('');
  const [isTyping, setIsTyping] = useState(false);
const navigate = useNavigate();
  // 2. Create a ref for the bottom of the chat
  const messagesEndRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const currentUserName = currentUser?.name;

  // 3. Function to perform the scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 4. Scroll whenever chatHistory or typing status changes
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const fetchMessages = useCallback(async () => {
    if (!currentUserName) return;
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_name', currentUserName)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setChatHistory(data);
    }
  }, [currentUserName]);
 useEffect(() => {
    // Load background from localStorage on component mount
    const savedBg =
      localStorage.getItem('chatBackground') ||
      `repeating-linear-gradient(
      45deg,
      #fffef9,
      #fffef9 10px,
      #f9f7ed 10px,
      #f9f7ed 20px
    ),
    radial-gradient(circle at top left, #fffef9 0%, #f1efdb 100%)`;
    setBgStyle(savedBg);
  }, []);

  useEffect(() => {
    if (!currentUserName) return;
    fetchMessages().then(() => setConnecting(false));
    const interval = setInterval(() => {
      fetchMessages();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentUserName, fetchMessages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUserName) return;

    const tempText = inputText;
    setInputText(""); 

    const { error } = await supabase
      .from('messages')
      .insert([{ 
        content: tempText, 
        sender_type: 'user', 
        user_name: currentUserName 
      }]);

    if (error) {
      console.error("Error:", error);
      return;
    }

    await fetchMessages();

    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    }, 1000); 
  };

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="chat-app-container" style={{
        background: bgStyle,
        backgroundBlendMode: 'multiply',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Poppins, sans-serif',
      }}>
      <SketchyHeader title="Live Support" onBack={handleBack} />

      <main className="chat-content-area" style={{ overflowY: 'auto', flex: 1 }}>
        {chatHistory.map((msg) => (
          <div 
            key={msg.id} 
            className={msg.sender_type === 'manager' ? 'message-bubble-received' : 'message-bubble-sent'}
          >
            {msg.sender_type === 'manager' && <strong>Manager: </strong>}
            {msg.content}
          </div>
        ))}

        {isTyping && (
          <div className="message-bubble-received typing-container">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
        
        {/* 5. Empty div that acts as the anchor for scrolling */}
        <div ref={messagesEndRef} />
      </main>

      <footer className="action-bar">
        <form className="input-group" onSubmit={sendMessage}>
          <input 
            type="text" 
            placeholder="Type your message..." 
            className="form-input"
            disabled={connecting}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="btn-send" disabled={connecting}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default LiveSupport;