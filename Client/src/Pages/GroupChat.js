import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Utils/supabaseClient';
import myBackgroundImage from '../Assets/bg.png';
import '../Styles/GroupChat.css'

export default function GroupChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState(
    'Anon' + Math.floor(Math.random() * 1000)
  );
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('group_chat')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) console.error('Error fetching:', error);
    else setMessages(data);
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

    const { error } = await supabase
      .from('group_chat')
      .insert([{ username, message: newMessage }]);

    if (error) console.error('Error sending:', error);
    else {
      setNewMessage('');
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      fetchMessages();
    }
  };

  return (
    <div>
      {' '}
      <img
        src={myBackgroundImage}
        alt="background"
        className="background-image"
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f4f0d7', // calm light background
          padding: '10px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '450px',
            backgroundColor: '#f4f0d7',
            borderRadius: '12px',
            padding: '20px',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1,
          }}
        >
          <div
            style={{
              height: '45vh', // fixed height
              overflowY: 'auto', // enable scrolling
              padding: '10px',
              borderRadius: '10px',
              backgroundColor: '#e2e8f0',
              marginBottom: '15px',
              display: 'flex',
              flexDirection: 'column',
              scrollbarWidth: 'none'
            }}
              className="scrollable-messages"

          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf:
                    m.username === username ? 'flex-end' : 'flex-start',
                  backgroundColor:
                    m.username === username ? '#a0d9d9' : '#ffffff',
                  color: '#1a202c',
                  padding: '8px 12px',
                  borderRadius: '15px',
                  marginBottom: '6px',
                  maxWidth: '75%',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <strong style={{ fontSize: '0.85em', color: '#2d3748' }}>
                  {m.username}:
                </strong>{' '}
                <span>{m.message}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={sendMessage}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nickname"
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e0',
                backgroundColor: '#f7fafc',
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e0',
                  backgroundColor: '#f7fafc',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#4299e1',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = '#4299e1')
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = '#4299e1')
                }
              >
                Send
              </button>
            </div>
          </form>

          <div
            className="bottom-nav"
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              marginTop: '15px',
            }}
          >
            <button className="tab-btn" onClick={() => navigate('/fact-pins')}>
              🏠<span>Home</span>
            </button>
            <button className="tab-btn" onClick={() => navigate('/group-chat')}>
              💬 <span>Group Chat</span>
            </button>
            <button
              className="tab-btn"
              onClick={() => navigate('/fact-profile')}
            >
              ⚙️ <span>Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
