import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import Header from "../Components/Header";
import { supabase } from "../Utils/supabaseClient";
import { FaImage, FaMicrophone, FaMoon, FaSun, FaSmile } from "react-icons/fa";
import "../Styles/Chat.css";

const emojis = ["😊", "😂", "👍", "❤️", "🔥", "😎", "🎨", "💬"];

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState("light");
  const [isBlocked, setIsBlocked] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [imagePermission, setImagePermission] = useState(false);
  const [audioPermission, setAudioPermission] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasInvitedFriend, setHasInvitedFriend] = useState(false); // NEW
  const { id: targetId } = useParams();
  const { state } = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [lastFetchedAt, setLastFetchedAt] = useState(null);

  const targetUser = state?.targetUser;
  const typingTimeoutRef = useRef(null);

  const [showEmojis, setShowEmojis] = useState(false);
  const messagesEndRef = useRef(null);

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const loadInitialMessages = async () => {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Initial message load failed:", error.message);
        return;
      }

      const filtered = data.filter(
        (msg) =>
          (msg.sender_id === currentUser.id && msg.receiver_id === targetId) ||
          (msg.sender_id === targetId && msg.receiver_id === currentUser.id)
      );

      const formatted = filtered.map((msg) => ({
        id: msg.id,
        text: msg.message,
        type: msg.sender_id === currentUser.id ? "sent" : "received",
        time: new Date(msg.created_at).toLocaleTimeString(),
        timestamp: msg.created_at,
      }));

      setMessages(formatted);
      if (filtered.length > 0) {
        setLastFetchedAt(filtered[filtered.length - 1].created_at);
      }
    };

    loadInitialMessages();
  }, [targetId, currentUser.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNewMessages();
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [lastFetchedAt, targetId, currentUser.id]);

  const fetchNewMessages = async () => {
    const query = supabase
      .from("chats")
      .select("*")
      .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
      .order("created_at", { ascending: true });

    if (lastFetchedAt) {
      query.gt("created_at", lastFetchedAt);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Polling error:", error.message);
      return;
    }

    const filtered = data.filter(
      (msg) =>
        (msg.sender_id === currentUser.id && msg.receiver_id === targetId) ||
        (msg.sender_id === targetId && msg.receiver_id === currentUser.id)
    );

    if (filtered.length > 0) {
      const formatted = filtered.map((msg) => ({
        id: msg.id,
        text: msg.message,
        type: msg.sender_id === currentUser.id ? "sent" : "received",
        time: new Date(msg.created_at).toLocaleTimeString(),
        timestamp: msg.created_at,
      }));

      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const unique = formatted.filter((msg) => !existingIds.has(msg.id));
        return [...prev, ...unique];
      });

      setLastFetchedAt(filtered[filtered.length - 1].created_at);
    }
  };

  function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  }

const sendMessage = async () => {
  if (!input.trim()) return;

  const newMessage = {
    sender_id: currentUser.id,
    receiver_id: targetId,
    message: input.trim(),
    reply_to: replyTo?.id || null, // optional, if you have reply feature
  };

  // Insert into Supabase
  const { data, error } = await supabase.from("chats").insert([newMessage]);

  if (error) {
    console.error("❌ Supabase insert error:", error.message);
    return;
  }

  console.log("✅ Message sent to Supabase:", data);

  // Don’t update local messages state manually to avoid duplication
  setInput("");
  setReplyTo(null);
};



 {/* const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = {
      sender_id: currentUser.id,
      receiver_id: targetId,
      message: input.trim(),
    };

    // Insert to Supabase
    const { data, error } = await supabase.from("chats").insert([newMessage]);

    if (error) {
      console.error("Failed to send message:", error.message);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: input,
        type: "sent",
        time: new Date().toLocaleTimeString(),
        status: "sent",
        replyTo: replyTo,
        timestamp: new Date(),
      },
    ]);

    setInput("");
    setReplyTo(null);
  };
*/}
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleEmojiClick = (emoji) => {
    setInput((prev) => prev + emoji);
  };

  const requestPermission = (type) => {
    const msg = {
      id: Date.now(),
      text: `Request to send ${type}`,
      type: "sent",
      time: new Date().toLocaleTimeString(),
      status: "pending",
      isRequest: type,
    };
    setMessages((prev) => [...prev, msg]);
  };

  const handleImageClick = () => {
    if (imagePermission) {
      const msg = {
        id: Date.now(),
        text: "📸 Sent an image (demo)",
        type: "sent",
        time: new Date().toLocaleTimeString(),
        status: "sent",
      };
      setMessages((prev) => [...prev, msg]);
    } else {
      requestPermission("image");
    }
  };

  const handleAudioClick = () => {
    if (!hasInvitedFriend) {
      const inviteMsg = {
        id: Date.now(),
        text: "🎟️ Audio uploads are premium! Invite a friend using your code to unlock.",
        type: "sent",
        time: new Date().toLocaleTimeString(),
        status: "info",
      };
      setMessages((prev) => [...prev, inviteMsg]);
      return;
    }

    if (audioPermission) {
      const msg = {
        id: Date.now(),
        text: "🎤 Sent an audio (demo)",
        type: "sent",
        time: new Date().toLocaleTimeString(),
        status: "sent",
      };
      setMessages((prev) => [...prev, msg]);
    } else {
      requestPermission("audio");
    }
  };

  const handleReply = (msg) => {
    setReplyTo(msg);
  };

  const handlePermissionAccept = (reqType, id) => {
    if (reqType === "image") setImagePermission(true);
    if (reqType === "audio") setAudioPermission(true);

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, status: "accepted", isRequest: null } : msg
      )
    );

    // Simulate receiver reply
    const reply = {
      id: Date.now() + 1,
      text: `✔️ Accepted your ${reqType}`,
      type: "received",
      time: new Date().toLocaleTimeString(),
      status: "received",
    };
    setTimeout(() => {
      setMessages((prev) => [...prev, reply]);
    }, 1000);
  };

  const handlePermissionReject = (reqType, id) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, status: "rejected", isRequest: null } : msg
      )
    );

    const reply = {
      id: Date.now() + 1,
      text: `❌ Rejected your ${reqType}`,
      type: "received",
      time: new Date().toLocaleTimeString(),
      status: "received",
    };
    setTimeout(() => {
      setMessages((prev) => [...prev, reply]);
    }, 1000);
  };

  const handleBlockToggle = () => {
    setIsBlocked((prev) => !prev);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    document.body.className = theme === "dark" ? "theme-dark" : "theme-light";
  }, [theme]);

  return (
    <div className={`Chat-UI ${theme}`}>
      <Header />
      {/*     <div className="fixed-theme-toggle" onClick={handleThemeToggle}>
        {theme === "light" ? <FaMoon /> : <FaSun />}
      </div>
*/}
      <div className="chat-container">
        <div className="chat-box">
          <div className="top-actions">
            <button className="block-btn" onClick={handleBlockToggle}>
              {isBlocked ? "Unblock" : "Block"}
            </button>
          </div>

          {isBlocked ? (
            <div className="blocked-ui">
              <h2>🚫 You’re blocked!</h2>
              <p>This chat has gone full sketch-mode.</p>
            </div>
          ) : (
            <>
              <div className="messages">
                {messages.length === 0 && (
                  <div className="empty-msg">
                    <img
                      src="https://cdn3.iconfinder.com/data/icons/49handdrawing/256x256/comment.png"
                      alt="No messages"
                      className="empty-chat-img"
                    />
                    <p>Start your sketchy chat ✍️</p>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.type} ${msg.status || ""}`}
                  >
                    {msg.replyTo && (
                      <div className="reply-tag">
                        Replying to: <em>{msg.replyTo.text}</em>
                      </div>
                    )}
                    <p>{msg.text}</p>
                    <span className="time">{getTimeAgo(msg.timestamp)}</span>

                    {msg.isRequest && (
                      <div style={{ marginTop: "0.5rem" }}>
                        <button
                          className="accept-btn"
                          onClick={() =>
                            handlePermissionAccept(msg.isRequest, msg.id)
                          }
                        >
                          Accept {msg.isRequest}
                        </button>
                        <button
                          className="accept-btn"
                          style={{
                            backgroundColor: "#c44",
                            marginLeft: "0.5rem",
                          }}
                          onClick={() =>
                            handlePermissionReject(msg.isRequest, msg.id)
                          }
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {/*!msg.isRequest && msg.status && (
                      <div className="status">✔ {msg.status}</div>
                    )*/}
                    <div className="reply-btn" onClick={() => handleReply(msg)}>
                      ↩
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="typing-indicator">✍️ User is typing...</div>
                )}

                <div ref={messagesEndRef} />
                <div ref={messagesEndRef} />
              </div>

              <div className="input-area">
                <FaImage className="icon-btn" onClick={handleImageClick} />
                <FaMicrophone className="icon-btn" onClick={handleAudioClick} />

                <input
                  type="text"
                  placeholder={
                    replyTo
                      ? `Replying to: ${replyTo.text}`
                      : "Write a message..."
                  }
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setIsTyping(true);
                    clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = setTimeout(() => {
                      setIsTyping(false);
                    }, 1500); // 1.5 seconds of inactivity
                  }}
                  onKeyDown={handleKeyPress}
                />
                <button onClick={sendMessage}>➤</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
