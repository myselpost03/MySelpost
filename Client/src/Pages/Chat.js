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
        sender_id: msg.sender_id,
        time: new Date(msg.created_at).toLocaleTimeString(),
        status: msg.status,
        isRequest: msg.is_request,
        timestamp: msg.created_at,
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
    trackEvent({
      action: "button_click",
      category: "Chat Page",
      label: "Send Message Button",
    });
    if (!input.trim()) return;
    // Detect repeated messages in short time
    const now = Date.now();
    const recent = recentMessages.current;

    // Remove messages older than 15 seconds
    recentMessages.current = recent.filter((msg) => now - msg.time < 15000);

    // Check for same message sent recently
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

    // Record this message
    recentMessages.current.push({ text: input.trim(), time: now });

    setIsSending(true);

    const messageText = input.trim();
    const timestamp = new Date().toISOString();
    const tempId = Date.now(); // Temporary unique ID

    // Create a temporary local message
    const localMsg = {
      id: tempId,
      text: messageText,
      type: "sent",
      time: new Date().toLocaleTimeString(),
      timestamp,
    };

    // Add to messages state and localStorage immediately
    setMessages((prev) => {
      const updated = [...prev, localMsg];
      localStorage.setItem(chatStorageKey, JSON.stringify(updated));
      return updated;
    });

    setInput(""); // Clear input

    const newMessage = {
      sender_id: currentUser.id,
      receiver_id: targetId,
      message: messageText,
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from("chats")
      .insert([newMessage])
      .select();

    if (error) {
      console.error("❌ Supabase insert error:", error.message);
      setIsSending(false);
      return;
    }

    // If insert succeeded, replace local temp message with Supabase-confirmed one
    if (data && data[0]) {
      const dbMsg = {
        id: data[0].id,
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

    // Optional: Update unread count
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

          if (newCount > 0) {
            // Fetch last push time from Supabase
            const { data: receiverData, error: fetchError } = await supabase
              .from("users")
              .select("last_push_sent_at")
              .eq("id", targetId)
              .maybeSingle();

            if (fetchError) {
              console.error(
                "❌ Error fetching last push timestamp:",
                fetchError.message
              );
            } else {
              const lastPush = receiverData?.last_push_sent_at
                ? new Date(receiverData.last_push_sent_at).getTime()
                : 0;
              const now = Date.now();
              const PUSH_INTERVAL_MS = 5 * 60 * 60 * 1000; // 5 hours in milliseconds

              if (!lastPush || now - lastPush > PUSH_INTERVAL_MS) {
                try {
                  await axios.post("http://localhost:5000/send-push", {
                    userId: targetId,
                  });

                  // Update last push time in Supabase
                  const { error: updateError } = await supabase
                    .from("users")
                    .update({ last_push_sent_at: new Date().toISOString() })
                    .eq("id", targetId);

                  if (updateError) {
                    console.error(
                      "❌ Error updating last push time:",
                      updateError.message
                    );
                  } else {
                    console.log("✅ Push sent and timestamp updated");
                  }
                } catch (err) {
                  console.error(
                    "❌ Error sending push notification:",
                    err.message
                  );
                }
              } else {
                console.log("⏱️ Push skipped — sent within last 5 hours");
              }
            }
          }

          if (newCount > 0) {
            const { data: badgeUpdateData, error: badgeUpdateError } =
              await supabase
                .from("users")
                .update({ badge_seen: false })
                .eq("id", targetId)
                .select();

            if (badgeUpdateError) {
              console.error("❌ Badge update error:", badgeUpdateError.message);
            } else {
              console.log("✅ Badge update result:", badgeUpdateData);
            }
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
                  <FaMicrophone title="Coming Soon" className="icon-btn" />
                  <div className="coming-soon-ribbon">Coming Soon</div>
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
