import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import SketchyHeader from "../Components/SketchyHeader";
import { supabase } from "../Utils/supabaseClient";
import LoadingIndicator from "../Components/LoadingIndicator";
import { FaImage, FaMicrophone, FaMoon, FaSun, FaSmile } from "react-icons/fa";
import dayjs from "dayjs";
import bannedData from "../Utils/bannedWords.json";
import SketchyAlert from "../Components/SketchyAlert";
import "../Styles/Chat.css";

const emojis = ["😊", "😂", "👍", "❤️", "🔥", "😎", "🎨", "💬"];

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState("light");
  const [alertMessage, setAlertMessage] = useState(null);

  const [isBlocked, setIsBlocked] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [imagePermission, setImagePermission] = useState(false);
  const [audioPermission, setAudioPermission] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isTyping, setIsTyping] = useState(false);
  const [hasInvitedFriend, setHasInvitedFriend] = useState(false); // NEW
  const { id: targetId } = useParams();
  const { state } = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [lastFetchedAt, setLastFetchedAt] = useState(null);

  const targetUser = state?.targetUser;
  const typingTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const [showEmojis, setShowEmojis] = useState(false);
  const messagesEndRef = useRef(null);

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const checkIfBlocked = async () => {
      const { data, error } = await supabase
        .from("blocked_users")
        .select("*")
        .eq("blocker_id", currentUser.id)
        .eq("blocked_id", targetId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Block check failed:", error.message);
      } else {
        setIsBlocked(!!data);
      }
    };

    checkIfBlocked();
  }, [currentUser.id, targetId]);

  useEffect(() => {
    const checkBlockStatus = async () => {
      const { data: blockedByMe, error: error1 } = await supabase
        .from("blocked_users")
        .select("*")
        .eq("blocker_id", currentUser.id)
        .eq("blocked_id", targetId)
        .single();

      const { data: blockedMe, error: error2 } = await supabase
        .from("blocked_users")
        .select("*")
        .eq("blocker_id", targetId)
        .eq("blocked_id", currentUser.id)
        .single();

      if (error1 && error1.code !== "PGRST116")
        console.error("Error1:", error1.message);
      if (error2 && error2.code !== "PGRST116")
        console.error("Error2:", error2.message);
    };

    checkBlockStatus();
  }, [currentUser.id, targetId]);

  const [blockedByOtherUser, setBlockedByOtherUser] = useState(false);
  const [iBlockedOtherUser, setIBlockedOtherUser] = useState(false);

  useEffect(() => {
    const checkBlockStatus = async () => {
      const { data: blockedByMe, error: error1 } = await supabase
        .from("blocked_users")
        .select("*")
        .eq("blocker_id", currentUser.id)
        .eq("blocked_id", targetId)
        .single();

      const { data: blockedMe, error: error2 } = await supabase
        .from("blocked_users")
        .select("*")
        .eq("blocker_id", targetId)
        .eq("blocked_id", currentUser.id)
        .single();

      if (error1 && error1.code !== "PGRST116")
        console.error("Error1:", error1.message);
      if (error2 && error2.code !== "PGRST116")
        console.error("Error2:", error2.message);

      setIBlockedOtherUser(!!blockedByMe);
      setBlockedByOtherUser(!!blockedMe);
    };

    checkBlockStatus();
  }, [currentUser.id, targetId]);

  useEffect(() => {
    const loadInitialMessages = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Initial message load failed:", error.message);
        setIsLoading(false);
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
      setIsLoading(false); // Done loading
      // Reset unread count (other user → current user)
      await supabase
        .from("unread_counts")
        .update({ count: 0 })
        .eq("sender_id", targetId)
        .eq("receiver_id", currentUser.id);
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

  const deleteOldMessagesBetweenUsers = async (currentUserId, otherUserId) => {
    // Get current time in local timezone and subtract 24 hours
    const localCutoffTime = dayjs().subtract(24, "hour").toISOString();

    const { error } = await supabase
      .from("chats")
      .delete()
      .or(
        `and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`
      )
      .lt("created_at", localCutoffTime);

    if (error) {
      console.error("Failed to delete old messages:", error.message);
    } else {
      console.log("Old messages between users deleted.");
    }
  };
  const containsAbusiveOrLink = (text) => {
    const lowerText = text.toLowerCase();

    for (const word of bannedData.abusiveWords) {
      if (lowerText.includes(word.toLowerCase())) return "abusive";
    }

    for (const link of bannedData.bannedLinks) {
      if (lowerText.includes(link.toLowerCase())) return "link";
    }

    return false;
  };

  useEffect(() => {
    deleteOldMessagesBetweenUsers(currentUser.id, targetUser.id);
  }, [currentUser.id, targetUser.id]);

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

    setIsSending(true);
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
    } else {
      setInput("");
    }
    // Update unread count
    await supabase.rpc("increment_unread_count", {
      sender: currentUser.id,
      receiver: targetId,
    });

    // Instead of using RPC, we'll just do raw upsert manually:
    await supabase
      .from("unread_counts")
      .upsert(
        {
          sender_id: currentUser.id,
          receiver_id: targetId,
          count: 1, // initial
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: ["sender_id", "receiver_id"],
          ignoreDuplicates: false,
        }
      )
      .select()
      .then(async ({ data, error }) => {
        if (!error) {
          // Increment count manually if exists
          const existing = data[0];
          if (existing) {
            await supabase
              .from("unread_counts")
              .update({
                count: existing.count + 1,
                updated_at: new Date().toISOString(),
              })
              .eq("sender_id", currentUser.id)
              .eq("receiver_id", targetId);
          }
        }
      });
    console.log("✅ Message sent to Supabase:", data);

    // Don’t update local messages state manually to avoid duplication
    setInput("");
    setIsSending(false);
    setReplyTo(null);
  };

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

  const handleBlockToggle = async () => {
    if (!isBlocked) {
      const { error } = await supabase.from("blocked_users").insert([
        {
          blocker_id: currentUser.id,
          blocked_id: targetId,
        },
      ]);

      if (error) {
        console.error("Block failed:", error.message);
        return;
      }
      setIsBlocked(true);
    } else {
      const { error } = await supabase
        .from("blocked_users")
        .delete()
        .eq("blocker_id", currentUser.id)
        .eq("blocked_id", targetId);

      if (error) {
        console.error("Unblock failed:", error.message);
        return;
      }
      setIsBlocked(false);
    }
  };

  const updateTypingStatus = async (typing) => {
    await supabase.from("typing_status").upsert(
      {
        user_id: currentUser.id,
        target_id: targetId,
        is_typing: typing,
        updated_at: new Date().toISOString(),
      },
      { onConflict: ["user_id", "target_id"] }
    );
  };

  const handleInputChange = (e) => {
    const newText = e.target.value;
    const lowerText = newText.toLowerCase();

    // Normalize input for smart detection
    const normalizedText = lowerText
      .replace(/\s+/g, "") // Remove all spaces
      .replace(/[\-.:\/]/g, "") // Remove separators like '-', '.', ':', '/'
      .replace(/dot/g, "."); // Replace 'dot' with '.'

    const textsToCheck = [lowerText, normalizedText];

    // Check for abusive words
    const hasAbuse = bannedData.abusiveWords.some((word) =>
      textsToCheck.some((text) => text.includes(word.toLowerCase()))
    );

    if (hasAbuse) {
      setAlertMessage("🚫 Abusive words are not allowed.");
      setInput("");
      updateTypingStatus(false);
      return;
    }

    // Check for banned links/domains/keywords
    const hasLink = bannedData.bannedLinks.some((link) =>
      textsToCheck.some((text) => text.includes(link.toLowerCase()))
    );

    if (hasLink) {
      setAlertMessage("🚫 Links or obfuscated links are not allowed.");
      setInput("");
      updateTypingStatus(false);
      return;
    }

    // Passed checks, allow typing
    setInput(newText);
    updateTypingStatus(true);

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      updateTypingStatus(false);
    }, 1500);
  };

  //Is typing functionality
  {
    /*useEffect(() => {
    const interval = setInterval(async () => {
      const { data, error } = await supabase
        .from("typing_status")
        .select("is_typing")
        .eq("user_id", targetId)
        .eq("target_id", currentUser.id)
        .single();

      if (!error && data) {
        setIsTyping(data.is_typing);
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [targetId, currentUser.id]);*/
  }
  const handleBack = () => {
    navigate(-1);
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
      <SketchyHeader title="Chat" onBack={handleBack} />
      {alertMessage && (
        <SketchyAlert
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      )}

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

          {blockedByOtherUser || iBlockedOtherUser ? (
            <div className="blocked-ui">
              <h2>🚫 Chat Blocked</h2>
              {iBlockedOtherUser && <p>You have blocked this user.</p>}
              {blockedByOtherUser && (
                <p>
                  This user has blocked you. You can no longer send messages.
                </p>
              )}
            </div>
          ) : isLoading ? (
            <LoadingIndicator />
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
                <div className="icon-wrapper">
                  <FaImage title="Coming Soon" className="icon-btn" />
                  <div className="coming-soon-ribbon">Coming Soon</div>
                </div>

                <div className="icon-wrapper">
                  <FaMicrophone title="Coming Soon" className="icon-btn" />
                  <div className="coming-soon-ribbon">Coming Soon</div>
                </div>

                <input
                  type="text"
                  placeholder={
                    replyTo
                      ? `Replying to: ${replyTo.text}`
                      : "Write a message..."
                  }
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                />

                <button
                  onClick={sendMessage}
                  disabled={isSending || !input.trim()}
                >
                  {isSending ? "➤" : "➤"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
