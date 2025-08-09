import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import SketchyHeader from "../Components/SketchyHeader";
import { supabase } from "../Utils/supabaseClient";
import LoadingIndicator from "../Components/LoadingIndicator";
import { FaImage, FaMicrophone, FaMoon, FaSun, FaSmile } from "react-icons/fa";
import dayjs from "dayjs";
import bannedData from "../Utils/bannedWords.json";
import SketchyAlert from "../Components/SketchyAlert";
import { trackEvent } from "../Utils/analytics";
import axios from "axios";
import "../Styles/Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  const [loadingImages, setLoadingImages] = useState({});
  const [revealedImages, setRevealedImages] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingImage, setIsSendingImage] = useState(false);
  const [autoDeleteEnabled, setAutoDeleteEnabled] = useState(true);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);
  const [blockedByOtherUser, setBlockedByOtherUser] = useState(false);
  const [iBlockedOtherUser, setIBlockedOtherUser] = useState(false);

  const { id: targetId } = useParams();

  const { state } = useLocation();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const targetUser = state?.targetUser;

  const navigate = useNavigate();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!targetId || !currentUser?.id) return;

    const resetUnreadCount = async () => {
      const { error } = await supabase
        .from("unread_counts")
        .update({ count: 0 })
        .eq("sender_id", targetId)
        .eq("receiver_id", currentUser.id);

      if (error) {
        console.error("Error resetting unread count:", error);
      }
    };

    resetUnreadCount();
  }, [targetId, currentUser]);

  useEffect(() => {
    const checkAccess = async () => {
      if (!currentUser?.id) return;
      const { data, error } = await supabase
        .from("users")
        .select("self_destruct_pricing")
        .eq("id", currentUser.id)
        .single();

      if (!error && data?.self_destruct_pricing === "paid") {
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
    };

    checkAccess();
  }, [currentUser?.id]);

  useEffect(() => {
    if (showPayPal && window.paypal && currentUser) {
      if (
        document.getElementById("paypal-button-container").childElementCount ===
        0
      ) {
        window.paypal
          .Buttons({
            style: {
              layout: "vertical",
              color: "blue",
              shape: "pill",
              label: "paypal",
            },
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [{ amount: { value: "1.00" } }],
              });
            },
            onApprove: async (data, actions) => {
              await actions.order.capture();

              setAlertMessage({
                text: "✅ Payment successful! Now you can chat with premium country user.",
                withButton: true,
              });

              const user = JSON.parse(localStorage.getItem("user"));
              const id = user?.id;

              if (id) {
                await supabase
                  .from("users")
                  .update({ self_destruct_pricing: "paid" })
                  .eq("id", id);

                setHasAccess(true);
                setAutoDeleteEnabled(false);
              }
            },
            onError: (err) => {
              console.error("PayPal error:", err);
              setAlertMessage({
                text: `❌ Payment Failed.`,
                withButton: true,
              });
            },
          })
          .render("#paypal-button-container");
      }
    }
  }, [showPayPal, currentUser]);

  useEffect(() => {
    const checkBlockStatus = async () => {
      try {
        const [{ data: blockedByMe }, { data: blockedMe }] = await Promise.all([
          supabase
            .from("blocked_users")
            .select("*")
            .eq("blocker_id", currentUser.id)
            .eq("blocked_id", targetId)
            .maybeSingle(),

          supabase
            .from("blocked_users")
            .select("*")
            .eq("blocker_id", targetId)
            .eq("blocked_id", currentUser.id)
            .maybeSingle(),
        ]);

        setIsBlocked(!!blockedByMe);
        setIBlockedOtherUser(!!blockedByMe);
        setBlockedByOtherUser(!!blockedMe);
      } catch (err) {
        if (err.message !== "PGRST116") {
          console.error("Block status check failed:", err.message);
        }
      }
    };

    if (currentUser?.id && targetId) {
      checkBlockStatus();
    }
  }, [currentUser.id, targetId]);

  useEffect(() => {
    const checkBlockStatus = async () => {
      const { data: blockedByMe, error: error1 } = await supabase
        .from("blocked_users")
        .select("*")
        .eq("blocker_id", currentUser.id)
        .eq("blocked_id", targetId)
        .maybeSingle();

      const { data: blockedMe, error: error2 } = await supabase
        .from("blocked_users")
        .select("*")
        .eq("blocker_id", targetId)
        .eq("blocked_id", currentUser.id)
        .maybeSingle();

      if (error1 && error1.code !== "PGRST116")
        console.error("Error1:", error1.message);
      if (error2 && error2.code !== "PGRST116")
        console.error("Error2:", error2.message);

      setIBlockedOtherUser(!!blockedByMe);
      setBlockedByOtherUser(!!blockedMe);
    };

    checkBlockStatus();
  }, [currentUser.id, targetId]);

  const chatStorageKey = `chat_${currentUser.id}_${targetId}`;

  // Load from localStorage on mount
  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem(chatStorageKey)) || [];
    setMessages(localData);
  }, [currentUser.id, targetId]);

  useEffect(() => {
    const loadInitialMessages = async () => {
      //setIsLoading(true);
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUser.id},receiver_id.eq.${targetId}),and(sender_id.eq.${targetId},receiver_id.eq.${currentUser.id})`
        )
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
        sender_id: msg.sender_id,
        time: new Date(msg.created_at).toLocaleTimeString(),
        status: msg.status,
        isRequest: msg.is_request,
        timestamp: msg.created_at,
        isAudio: msg.type === "audio", // <-- mark audio messages here

        isImage: msg.type === "image",
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
        isImage: msg.type === "image",
      }));

      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const unique = formatted.filter((msg) => !existingIds.has(msg.id));
        return [...prev, ...unique];
      });

      setLastFetchedAt(filtered[filtered.length - 1].created_at);
    }
  };

  useEffect(() => {
    const deleteExpiredReceivedImages = async () => {
      const cutoffTime = dayjs().subtract(24, "hour").toISOString();

      // 1. Get image messages received by current user older than 24 hours
      const { data: oldImages, error } = await supabase
        .from("chats")
        .select("*")
        .eq("receiver_id", currentUser.id)
        .eq("type", "image")
        .lt("created_at", cutoffTime);

      if (error) {
        console.error("Error fetching expired images:", error.message);
        return;
      }

      if (oldImages.length === 0) return;

      for (const msg of oldImages) {
        try {
          // 2. Extract file path from URL
          const url = new URL(msg.message);
          const bucketPath = decodeURIComponent(
            url.pathname.split("/storage/v1/object/public/chat-assets/")[1]
          );

          // 3. Delete image from storage
          if (bucketPath) {
            const { error: deleteError } = await supabase.storage
              .from("chat-assets")
              .remove([bucketPath]);

            if (deleteError) {
              console.error(
                "Error deleting from storage:",
                deleteError.message
              );
            } else {
              console.log("✅ Deleted from bucket:", bucketPath);
            }
          }

          // 4. Delete message from chats table
          const { error: deleteChatError } = await supabase
            .from("chats")
            .delete()
            .eq("id", msg.id);

          if (deleteChatError) {
            console.error(
              "Error deleting chat entry:",
              deleteChatError.message
            );
          } else {
            console.log("✅ Deleted image message from DB:", msg.id);
          }

          // 5. Update local state
          setMessages((prev) => prev.filter((m) => m.id !== msg.id));
        } catch (err) {
          console.error("Error cleaning expired image:", err.message);
        }
      }
    };

    // Run on mount and every 5 minutes
    deleteExpiredReceivedImages(); // Run once immediately
    const interval = setInterval(deleteExpiredReceivedImages, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [currentUser.id]);

  useEffect(() => {
    const fetchAndStoreTalkedUsers = async () => {
      const { data, error } = await supabase
        .from("chats")
        .select("sender_id, receiver_id")
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`);

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      if (!data) return;

      const uniqueUsers = new Set();

      data.forEach((msg) => {
        const otherUser =
          msg.sender_id === currentUser.id ? msg.receiver_id : msg.sender_id;
        uniqueUsers.add(otherUser);
      });

      const talkedToCount = uniqueUsers.size;

      // 🔍 Fetch current talked_to_count from users table
      const { data: userData, error: userFetchError } = await supabase
        .from("users")
        .select("talked_to_count")
        .eq("id", currentUser.id)
        .single();

      if (userFetchError) {
        console.error("Failed to fetch user data:", userFetchError);
        return;
      }

      const currentCount = userData?.talked_to_count || 0;

      // 🧠 Only update if count is different
      if (currentCount !== talkedToCount) {
        const { error: updateError } = await supabase
          .from("users")
          .update({ talked_to_count: talkedToCount })
          .eq("id", currentUser.id);

        if (updateError) {
          console.error("Failed to update talked_to_count:", updateError);
        } else {
          console.log(`Updated talked_to_count to ${talkedToCount}`);
        }
      } else {
        console.log("talked_to_count unchanged, skipping update");
      }
    };

    fetchAndStoreTalkedUsers();
  }, []);

  const deleteOldMessagesBetweenUsers = async (currentUserId, otherUserId) => {
    const cutoffTime = dayjs().subtract(24, "hour").toISOString();

    const { error } = await supabase
      .from("chats")
      .delete()
      .lt("created_at", cutoffTime)
      .or(
        `and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`
      );

    if (error) {
      console.error("Failed to delete old messages:", error.message);
    } else {
      console.log("Messages older than 24h deleted between users.");
    }
  };

  useEffect(() => {
    if (currentUser?.id && targetUser?.id) {
      deleteOldMessagesBetweenUsers(currentUser.id, targetUser.id);
    }
  }, [currentUser?.id, targetUser?.id]);

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
    trackEvent({
      action: "button_click",
      category: "Chat Page",
      label: "Send Message Button",
    });

    if (!input.trim()) return;

    const now = Date.now();
    const recent = recentMessages.current;

    // Remove messages older than 15 seconds
    recentMessages.current = recent.filter((msg) => now - msg.time < 15000);

    // Prevent spamming same message
    if (recentMessages.current.some((msg) => msg.text === input.trim())) {
      setAlertMessage({
        text: "⚠️ You are sending the same message repeatedly.",
        buttons: ["close"],
      });

      const { error } = await supabase.rpc("decrement_decency", {
        user_id_input: currentUser.id,
      });

      if (error) {
        console.error("❌ RPC error:", error.message);
      }
      return;
    }

    recentMessages.current.push({ text: input.trim(), time: now });
    setIsSending(true);

    const messageText = input.trim();
    const timestamp = new Date().toISOString();
    const tempId = Date.now();

    const localMsg = {
      id: tempId,
      text: messageText,
      type: "sent",
      time: new Date().toLocaleTimeString(),
      timestamp,
    };

    setMessages((prev) => {
      const updated = [...prev, localMsg];
      localStorage.setItem(chatStorageKey, JSON.stringify(updated));
      return updated;
    });

    setInput("");

    const newMessage = {
      sender_id: currentUser.id,
      receiver_id: targetId,
      message: messageText,
    };

    const { data, error } = await supabase
      .from("chats")
      .insert([newMessage])
      .select();

    if (error) {
      console.error("❌ Supabase insert error:", error.message);
      setIsSending(false);
      return;
    }

    let messageId = null;

    if (data && data[0]) {
      messageId = data[0].id;
      const dbMsg = {
        id: messageId,
        text: data[0].message,
        type: "sent",
        time: new Date(data[0].created_at).toLocaleTimeString(),
        timestamp: data[0].created_at,
      };

      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== tempId);
        const updated = [...filtered, dbMsg];
        localStorage.setItem(chatStorageKey, JSON.stringify(updated));
        return updated;
      });
    }

    await supabase
      .from("unread_counts")
      .upsert(
        {
          sender_id: currentUser.id,
          receiver_id: targetId,
          count: 1,
          updated_at: new Date().toISOString(),
        },
        { onConflict: ["sender_id", "receiver_id"] }
      )
      .select()
      .then(async ({ data, error }) => {
        if (!error && data?.[0]) {
          const newCount = data[0].count + 1;

          await supabase
            .from("unread_counts")
            .update({
              count: newCount,
              updated_at: new Date().toISOString(),
            })
            .eq("sender_id", currentUser.id)
            .eq("receiver_id", targetId);

          // Update badge_seen to false
          await supabase
            .from("users")
            .update({ badge_seen: false })
            .eq("id", targetId);

          // Send push with messageId
          // Send push only if not blocked by or blocking the target
          if (messageId && !blockedByOtherUser && !iBlockedOtherUser) {
            try {
              await axios.post("https://myselpost.onrender.com/send-push", {
                userId: targetId,
                messageId: messageId,
              });
            } catch (err) {
              console.error("❌ Error sending push:", err.message);
            }
          } else {
            console.log("🔕 Push notification skipped due to block status.");
          }
        }
      });

    setIsSending(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleBlockToggle = async () => {
    trackEvent({
      action: "button_click",
      category: "Chat Page",
      label: "Block Button",
    });
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

  const recentMessages = useRef([]);
  const lastPasted = useRef("");

  const handleInputChange = async (e) => {
    const newText = e.target.value;
    const lowerText = newText.toLowerCase();

    // Normalize input for smart detection
    const normalizedText = lowerText
      .replace(/\s+/g, "")
      .replace(/[\-.:\/]/g, "")
      .replace(/dot/g, ".");

    const textsToCheck = [lowerText, normalizedText];

    // Abusive check
    const hasAbuse = bannedData.abusiveWords.some((word) =>
      textsToCheck.some((text) => text.includes(word.toLowerCase()))
    );

    const words = lowerText.split(/\s+/);

    // Regex: match any word that contains at least one special character
    const hasSpecialCharacter = words.some((word) =>
      /[@&#$%()\[\]{};:"<>^\/\\|]/.test(word)
    );

    if (hasSpecialCharacter) {
      setAlertMessage({
        text: "🚫 Special characters are not allowed.",
        withButton: true,
      });
      const { error } = await supabase.rpc("decrement_decency", {
        user_id_input: currentUser.id,
      });

      if (error) {
        console.error("❌ RPC error:", error.message);
      }
      return;
    }

    if (hasAbuse) {
      setAlertMessage({
        text: "🚫 Abusive words are not allowed.",
        buttons: ["close"],
      });
      setInput("");

      const { data, error } = await supabase.rpc("decrement_decency", {
        user_id_input: currentUser.id,
      });

      if (error) {
        console.error("❌ RPC error:", error.message);
      }

      return;
    }

    // Link check
    const hasLink = bannedData.bannedLinks.some((link) =>
      textsToCheck.some((text) => text.includes(link.toLowerCase()))
    );

    if (hasLink) {
      setAlertMessage("🚫 Links or obfuscated links are not allowed.");
      setInput("");
      const { data, error } = await supabase.rpc("decrement_decency", {
        user_id_input: currentUser.id,
      });

      if (error) {
        console.error("❌ RPC error:", error.message);
      }
      return;
    }

    // Phone number check
    const phonePattern = /\b\d{10,13}\b/;
    if (phonePattern.test(newText.replace(/[\s\-]/g, ""))) {
      setAlertMessage({
        text: "🚫 Sharing phone numbers is not allowed.",
        buttons: ["close"],
      });
      setInput("");
      const { data, error } = await supabase.rpc("decrement_decency", {
        user_id_input: currentUser.id,
      });

      if (error) {
        console.error("❌ RPC error:", error.message);
      }
      return;
    }

    // Detect copy-paste if large jump in text length
    if (newText.length - input.length > 10 && newText !== lastPasted.current) {
      lastPasted.current = newText;
      setAlertMessage({
        text: "⚠️ Pasting long text is not allowed.",
        buttons: ["close"],
      });
      setInput("");
      const { data, error } = await supabase.rpc("decrement_decency", {
        user_id_input: currentUser.id,
      });

      if (error) {
        console.error("❌ RPC error:", error.message);
      }
      return;
    }

    setInput(newText);
  };

  const handlePaste = async (e) => {
    trackEvent({
      action: "button_click",
      category: "Chat Page",
      label: "Paste Button",
    });
    const pastedText = e.clipboardData.getData("text/plain").toLowerCase();
    if (pastedText) {
      setAlertMessage({
        text: "Pasting is not allowed",
        withButton: true,
      });
      const { data, error } = await supabase.rpc("decrement_decency", {
        user_id_input: currentUser.id,
      });

      if (error) {
        console.error("❌ RPC error:", error.message);
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleFileInputClick = (e) => {
    const imageSendKey = `imageSentDate_${currentUser.id}`;
    const lastSentDate = localStorage.getItem(imageSendKey);
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    if (lastSentDate === today) {
      e.preventDefault(); // Prevents file dialog from opening
      setAlertMessage("You can only send one image per day.");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageSendKey = `imageSentDate_${currentUser.id}`;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const lastSentDate = localStorage.getItem(imageSendKey);

    // Secondary check (failsafe)
    if (lastSentDate === today) {
      setAlertMessage("You can only send one image per day.");
      return;
    }

    setIsSendingImage(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `chat-images/${currentUser.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("chat-assets")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload failed:", uploadError.message);
      setIsSendingImage(false);
      return;
    }

    const { data: publicURLData } = supabase.storage
      .from("chat-assets")
      .getPublicUrl(filePath);

    const imageUrl = publicURLData?.publicUrl;

    const { data, error } = await supabase
      .from("chats")
      .insert([
        {
          sender_id: currentUser.id,
          receiver_id: targetId,
          message: imageUrl,
          type: "image",
        },
      ])
      .select();

    if (error) {
      console.error("Failed to insert image message:", error.message);
      setIsSendingImage(false);
      return;
    }

    if (data && data[0]) {
      const dbMsg = {
        id: data[0].id,
        text: data[0].message,
        type: "sent",
        isImage: true,
        time: new Date(data[0].created_at).toLocaleTimeString(),
        timestamp: data[0].created_at,
      };

      setMessages((prev) => [...prev, dbMsg]);

      // Save today's date after successful send
      localStorage.setItem(imageSendKey, today);
    }

    setIsSendingImage(false);
  };

  const handleImageClick = async (msg) => {
    trackEvent({
      action: "button_click",
      category: "Chat Page",
      label: "Share Image Button",
    });
    setModalImage(msg.text); // Open modal

    const bucketName = "chat-assets";
    const imageUrl = msg.text;

    // 1. Unblur image immediately
    const imgElement = document.querySelector(`img[src="${imageUrl}"]`);
    if (imgElement) imgElement.classList.remove("blurred");

    setTimeout(async () => {
      try {
        // 2. Extract file path
        const url = new URL(imageUrl);
        const filePath = decodeURIComponent(
          url.pathname.split(`/storage/v1/object/public/${bucketName}/`)[1]
        );

        // 3. Delete all messages with same imageUrl (from both sides)
        await supabase.from("chats").delete().eq("message", imageUrl);

        // 4. Delete from storage
        if (filePath) {
          await supabase.storage.from(bucketName).remove([filePath]);
        }

        // 5. Update UI (remove all image messages with this URL)
        setMessages((prev) => prev.filter((m) => m.text !== imageUrl));
      } catch (err) {
        console.error("Error deleting image:", err.message);
      }
    }, 10000);
  };

  useEffect(() => {
    if (!mediaRecorder) return;

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const fileName = `${Date.now()}.webm`;
      const filePath = `chat-audio/${currentUser.id}/${fileName}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("chat-audio")
        .upload(filePath, audioBlob);

      if (uploadError) {
        console.error("Upload failed:", uploadError.message);
        return;
      }

      const { data: publicURLData } = supabase.storage
        .from("chat-audio")
        .getPublicUrl(filePath);

      const audioUrl = publicURLData?.publicUrl;

      // Save message in chats table
      const { data, error } = await supabase
        .from("chats")
        .insert([
          {
            sender_id: currentUser.id,
            receiver_id: targetId,
            message: audioUrl,
            type: "audio",
          },
        ])
        .select();

      if (error) {
        console.error("Insert audio message failed:", error.message);
        return;
      }

      if (data && data[0]) {
        const dbMsg = {
          id: data[0].id,
          text: data[0].message,
          type: "sent",
          timestamp: data[0].created_at,
          isAudio: true,
        };
        setMessages((prev) => [...prev, dbMsg]);
      }
    };
  }, [mediaRecorder, audioChunks]);

  const handleMicClick = async () => {
    const hasUploadedImage =
      localStorage.getItem("hasUploadedImage") === "true";
    if (!hasUploadedImage) {
      setAlertMessage({
        text: "📸 Upload your image under roast section to use microphone 🎤.",
        withButton: true,
      });

      return;
    }
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          const audioUrl = URL.createObjectURL(blob);
          console.log("Audio ready:", audioUrl);
          // Here you can upload `blob` to Supabase storage
        };

        recorder.start();
        setMediaRecorder(recorder);
        setAudioChunks(chunks);
        setIsRecording(true);
      } catch (err) {
        console.error("Mic access denied:", err);
      }
    } else {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className={`Chat-UI`}>
      <SketchyHeader title={targetUser.name} onBack={handleBack} />
      {alertMessage && !hasAccess && (
        <SketchyAlert
          message={
            showPayPal ? (
              <div>
                <div>💳 Complete your payment below:</div>
                <div
                  id="paypal-button-container"
                  style={{ marginTop: "1rem" }}
                ></div>
              </div>
            ) : typeof alertMessage === "string" ? (
              alertMessage
            ) : (
              alertMessage.text
            )
          }
          buttons={
            showPayPal
              ? ["close"]
              : typeof alertMessage === "object" &&
                Array.isArray(alertMessage.buttons)
              ? alertMessage.buttons
              : ["close"]
          }
          onClose={() => {
            setAlertMessage(null);
            setShowPayPal(false);
          }}
          onPay={() => {
            setShowPayPal(true);
          }}
        />
      )}

      <div className="chat-container">
        <div className="chat-box">
          <div className="top-actions">
            <div className="left-actions">
              <button className="block-btn" onClick={handleBlockToggle}>
                {isBlocked ? "Unblock" : "Block"}
              </button>
            </div>

            <div className="right-actions auto-delete-toggle">
              <label className="toggle-label">Self-Destruct: 24h</label>
              <div
                className={`toggle-switch ${autoDeleteEnabled ? "on" : "off"}`}
                onClick={() => {
                  if (hasAccess) {
                    setAutoDeleteEnabled(!autoDeleteEnabled);
                  } else {
                    setAlertMessage({
                      text: "⚠️ Pay $1 to disable self-destruct mode.",
                      buttons: ["pay", "close"],
                    });
                  }
                }}
              >
                <div className="toggle-thumb" />
              </div>
            </div>
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
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.type} ${msg.status || ""}`}
                    onClick={() => msg.isImage && handleImageClick(msg)}
                  >
                    {msg.isImage ? (
                      msg.type === "sent" ? (
                        <p>
                          <em>📤 Sent image</em>
                        </p>
                      ) : (
                        <div className="chat-image-wrapper">
                          {!revealedImages[msg.id] ? (
                            <div
                              className="image-placeholder"
                              onClick={() => {
                                setRevealedImages((prev) => ({
                                  ...prev,
                                  [msg.id]: true,
                                }));
                                handleImageClick(msg); // start timer and delete logic
                              }}
                            >
                              <p className="click-to-reveal-text">
                                Click to Reveal Image
                              </p>
                            </div>
                          ) : (
                            <img
                              src={msg.text}
                              alt="Received"
                              className="chat-image"
                              onLoad={() =>
                                setLoadingImages((prev) => ({
                                  ...prev,
                                  [msg.id]: false,
                                }))
                              }
                            />
                          )}
                        </div>
                      )
                    ) : msg.isAudio ? (
                      <div className="chat-audio">
                        <audio controls src={msg.text} />
                      </div>
                    ) : (
                      <p>{msg.text}</p>
                    )}

                    <span className="time">{getTimeAgo(msg.timestamp)}</span>
                  </div>
                ))}

                <div ref={messagesEndRef} />
                <div ref={messagesEndRef} />
              </div>

              <div className="input-area">
                <div className="icon-wrapper">
                  <label htmlFor="image-upload" className="icon-btn">
                    {isSendingImage ? (
                      <span className="dotting-indicator">...</span>
                    ) : (
                      <FaImage />
                    )}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    id="image-upload"
                    style={{ display: "none" }}
                    onClick={handleFileInputClick}
                    onChange={handleImageUpload}
                  />
                </div>

                <div className="icon-wrapper">
                  <FaMicrophone
                    onClick={handleMicClick}
                    className="icon-btn"
                    style={{
                      cursor: "pointer",
                      color: isRecording ? "#ff6f61" : "#444",
                    }}
                  />
                </div>

                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  onPaste={handlePaste}
                  placeholder="Type your message..."
                />

                <button
                  onClick={sendMessage}
                  disabled={isSending || isSendingImage || !input.trim()}
                >
                  {isSending ? "➤" : "➤"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {modalImage && (
        <div className="image-modal" onClick={() => setModalImage(null)}>
          <img src={modalImage} alt="Full View" />
        </div>
      )}
    </div>
  );
};

export default Chat;
