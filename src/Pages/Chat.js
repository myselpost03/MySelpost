import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ChatHeader from '../Components/ChatHeader';
import { supabase, supabaseStorage } from '../Utils/supabaseClient';
import { FaImage, FaCrown, FaEnvelope, FaCheck } from 'react-icons/fa';
import bannedData from '../JSON/bannedWords.json';
import { trackEvent } from '../Utils/analytics';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import imageCompression from 'browser-image-compression';
import i18n from '../i18n';
import UnblockPopup from '../Components/UnblockPopup';
import '../Styles/Chat.css';

const countryDialCodes = {
  // North America
  US: '+1', // United States
  CA: '+1', // Canada
  MX: '+52', // Mexico
  CU: '+53', // Cuba
  DO: '+1', // Dominican Republic
  HN: '+504', // Honduras

  // Europe
  GB: '+44', // Great Britain / UK
  IE: '+353', // Ireland
  FR: '+33', // France
  DE: '+49', // Germany
  IT: '+39', // Italy
  NL: '+31', // Netherlands / Holland
  BE: '+32', // Belgium
  CH: '+41', // Switzerland
  NO: '+47', // Norway
  PL: '+48', // Poland
  CZ: '+420', // Czech Republic
  RO: '+40', // Romania
  RU: '+7', // Russia
  SI: '+386', // Slovenia
  SK: '+421', // Slovakia

  // Middle East
  IL: '+972', // Israel
  KW: '+965', // Kuwait
  SA: '+966', // Saudi Arabia
  QA: '+974', // Qatar
  OM: '+968', // Oman
  JO: '+962', // Jordan
  IQ: '+964', // Iraq

  // Asia
  IN: '+91', // India
  PK: '+92', // Pakistan
  BD: '+880', // Bangladesh
  NP: '+977', // Nepal
  LK: '+94', // Sri Lanka
  SG: '+65', // Singapore
  PH: '+63', // Philippines
  ID: '+62', // Indonesia
  CN: '+86', // China
  JP: '+81', // Japan
  KR: '+82', // South Korea

  // Africa
  EG: '+20', // Egypt
  NG: '+234', // Nigeria
  KE: '+254', // Kenya
  TZ: '+255', // Tanzania
  SD: '+249', // Sudan
  MA: '+212', // Morocco
  DZ: '+213', // Algeria
  TN: '+216', // Tunisia
  MW: '+265', // Malawi
  MU: '+230', // Mauritius
  MZ: '+258', // Mozambique

  // South America
  BR: '+55', // Brazil
  CO: '+57', // Colombia
  PE: '+51', // Peru

  // Oceania
  AU: '+61', // Australia

  // Southeast Asia extra common
  MY: '+60', // Malaysia

  // Turkey
  TR: '+90',
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [modalImageMsg, setModalImageMsg] = useState(null);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showAudioTerms, setShowAudioTerms] = useState(false);
  const [pendingAudioStart, setPendingAudioStart] = useState(false);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [countryCode, setCountryCode] = useState(null);

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [revealedImages, setRevealedImages] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [isSendingImage, setIsSendingImage] = useState(false);
  const [autoDeleteEnabled, setAutoDeleteEnabled] = useState(true);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);
  const [blockedByOtherUser, setBlockedByOtherUser] = useState(false);
  const [iBlockedOtherUser, setIBlockedOtherUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotice, setShowNotice] = useState(false);
  const [showGifSearch, setShowGifSearch] = useState(false);
  const [gifQuery, setGifQuery] = useState('');
  const [gifs, setGifs] = useState([]);
  const [gifLoading, setGifLoading] = useState(false);
  const [isSendingGif, setIsSendingGif] = useState(false);
  const [sendingGifId, setSendingGifId] = useState(null);
  const [imageState, setImageState] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [showUnblockPopup, setShowUnblockPopup] = useState(false);
  const [showRevealNumberPopup, setShowRevealNumberPopup] = useState(false);

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const lastPasted = useRef('');
  const sendingGifRef = useRef(false);
  // Get reciever id
  const { id: targetId } = useParams();
  const [isChatLocked, setIsChatLocked] = useState(false);
  const MESSAGE_LIMIT = 20000000;

  const { state } = useLocation();
  // Add this state at the top with your other states
  const [targetCountry, setTargetCountry] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('user'));

  // Get target user
  const targetUser = state?.targetUser;
  const dialCode = countryDialCodes[targetUser?.country] || '';
  const navigate = useNavigate();
  const [bgStyle, setBgStyle] = useState('');
  const isDeveloperKirti = currentUser?.name?.toLowerCase() === 'Shivani';
  const upiLink =
    'upi://pay?pa=myselpost03@okhdfcbank&pn=Myselpost&am=10&cu=INR';
  const kofiLink = 'https://ko-fi.com/myselpost';
  const handleKofi = () => {
    window.open(kofiLink, '_blank');

    // simulate success
    setTimeout(() => {
      localStorage.setItem('isPremium', 'true');
      setShowPremiumPopup(false);
    }, 1500);
  };
  const handleUPI = () => {
    window.location.href = upiLink;
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

 useEffect(() => {
  const detectLocation = async () => {
    try {
      const res = await fetch('https://ipwho.is/?fields=country_code');
      const data = await res.json();

      if (data?.country_code) {
        setCountryCode(data.country_code); // example: IN, US, BR
      } else {
        setCountryCode('US'); // fallback
      }
    } catch (error) {
      console.warn('Location detection failed:', error);
      setCountryCode('US'); // fallback
    }
  };

  detectLocation();
}, []);

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

  // Reset notification unread count
  useEffect(() => {
    if (!targetId || !currentUser?.id) return;

    const resetUnreadCount = async () => {
      const { error } = await supabase
        .from('unread_counts')
        .update({ count: 0 })
        .eq('sender_id', targetId)
        .eq('receiver_id', currentUser.id);

      if (error) {
        console.error('Error resetting unread count:', error);
      }
    };

    resetUnreadCount();
  }, [targetId, currentUser]);

  // Check whether use has access of self destruct
  useEffect(() => {
    const checkAccess = async () => {
      if (!currentUser?.id) return;
      const { data, error } = await supabase
        .from('users')
        .select('self_destruct_pricing')
        .eq('id', currentUser.id)
        .single();

      if (!error && data?.self_destruct_pricing === 'paid') {
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
    };

    checkAccess();
  }, [currentUser?.id]);

  // Pay to unlock
  useEffect(() => {
    if (showPayPal && window.paypal && currentUser) {
      if (
        document.getElementById('paypal-button-container').childElementCount ===
        0
      ) {
        window.paypal
          .Buttons({
            style: {
              layout: 'vertical',
              color: 'blue',
              shape: 'pill',
              label: 'paypal',
            },
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [{ amount: { value: '1.00' } }],
              });
            },
            onApprove: async (data, actions) => {
              await actions.order.capture();

              setAlertMessage({
                text: '✅ Payment successful! Now you can chat with premium country user.',
                withButton: true,
              });

              const user = JSON.parse(localStorage.getItem('user'));
              const id = user?.id;

              if (id) {
                await supabase
                  .from('users')
                  .update({ self_destruct_pricing: 'paid' })
                  .eq('id', id);

                setHasAccess(true);
                setAutoDeleteEnabled(false);
              }
            },
            onError: (err) => {
              console.error('PayPal error:', err);
              setAlertMessage({
                text: `❌ Payment Failed.`,
                withButton: true,
              });
            },
          })
          .render('#paypal-button-container');
      }
    }
  }, [showPayPal, currentUser]);
  const checkBlockStatus = async () => {
    if (!currentUser?.id || !targetId) return;

    try {
      const [{ data: blockedByMe }, { data: blockedMe }] = await Promise.all([
        supabase
          .from('blocked_users')
          .select('*')
          .eq('blocker_id', currentUser.id)
          .eq('blocked_id', targetId)
          .maybeSingle(),

        supabase
          .from('blocked_users')
          .select('*')
          .eq('blocker_id', targetId)
          .eq('blocked_id', currentUser.id)
          .maybeSingle(),
      ]);

      setIsBlocked(!!blockedByMe);
      setIBlockedOtherUser(!!blockedByMe);
      setBlockedByOtherUser(!!blockedMe);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Check block status
  useEffect(() => {
    if (!currentUser?.id) return;

    const channel = supabase
      .channel('blocked-users-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blocked_users',
        },
        async (payload) => {
          const blockerId = payload.new?.blocker_id || payload.old?.blocker_id;

          const blockedId = payload.new?.blocked_id || payload.old?.blocked_id;

          const isRelevant =
            blockerId === currentUser.id || blockedId === currentUser.id;

          if (!isRelevant) return;

          // CRITICAL: re-fetch actual status
          await checkBlockStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.id, targetId]);

  useEffect(() => {
    checkBlockStatus();
  }, [currentUser?.id, targetId]);

  useEffect(() => {
    loadInitialMessages();
  }, [targetId, currentUser.id]);

  const handleAlert = () => {
    setShowPopup(true);
  };

  // Polling for new messages
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNewMessages();
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [lastFetchedAt, targetId, currentUser.id]);

  useEffect(() => {
    const handleFocus = () => {
      loadInitialMessages();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Inside an existing useEffect or a new one to fetch target user details
  useEffect(() => {
    const fetchTargetUserCountry = async () => {
      if (!targetId) return;
      const { data, error } = await supabase
        .from('users')
        .select('country')
        .eq('id', targetId)
        .single();

      if (!error && data) {
        setTargetCountry(data.country);
      }
    };

    fetchTargetUserCountry();
  }, [targetId]);
  // Get current user

  // Logic to determine if premium UI should show
  const isForeignChat =
    targetCountry &&
    currentUser?.country &&
    targetCountry === currentUser.country;
  // Fetch and store talked count
  useEffect(() => {
    const fetchAndStoreTalkedUsers = async () => {
      const { data, error } = await supabase
        .from('chats')
        .select('sender_id, receiver_id')
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`);

      if (error) {
        console.error('Error fetching messages:', error);
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
        .from('users')
        .select('talked_to_count')
        .eq('id', currentUser.id)
        .single();

      if (userFetchError) {
        console.error('Failed to fetch user data:', userFetchError);
        return;
      }

      const currentCount = userData?.talked_to_count || 0;

      // 🧠 Only update if count is different
      if (currentCount !== talkedToCount) {
        const { error: updateError } = await supabase
          .from('users')
          .update({ talked_to_count: talkedToCount })
          .eq('id', currentUser.id);

        if (updateError) {
          console.error('Failed to update talked_to_count:', updateError);
        } else {
          console.log(`Updated talked_to_count to ${talkedToCount}`);
        }
      } else {
        console.log('talked_to_count unchanged, skipping update');
      }
    };

    fetchAndStoreTalkedUsers();
  }, []);

  // Update message seen status
  useEffect(() => {
    messages.forEach(async (msg) => {
      if (msg.type === 'received' && !msg.seen) {
        // Update DB
        await supabase
          .from('chats')
          .update({ status: 'seen' })
          .eq('id', msg.id);

        // Update local state
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, seen: true } : m))
        );

        // Start 1-minute deletion timer
        startDeletionTimer(msg.id);
      }
    });
  }, [messages]);

  // Auto delete message that is 1 day old
  useEffect(() => {
    const now = Date.now();

    messages.forEach(async (msg) => {
      const createdAt = new Date(msg.created_at).getTime();
      if (now - createdAt >= 24 * 60 * 60 * 1000) {
        // Delete from DB
        await supabase.from('chats').delete().eq('id', msg.id);

        // Delete from local state
        setMessages((prev) => prev.filter((m) => m.id !== msg.id));
      }
    });
  }, [messages]);

  // Recording Audio for Desktops
  useEffect(() => {
    if (!mediaRecorder) return;

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const fileName = `${Date.now()}.webm`;
      const filePath = `chat-audio/${currentUser.id}/${fileName}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabaseStorage.storage
        .from('chat-audio')
        .upload(filePath, audioBlob);

      if (uploadError) {
        console.error('Upload failed:', uploadError.message);
        return;
      }

      const { data: publicURLData } = supabaseStorage.storage
        .from('chat-audio')
        .getPublicUrl(filePath);

      const audioUrl = publicURLData?.publicUrl;

      // Save message in chats table
      const { data, error } = await supabase
        .from('chats')
        .insert([
          {
            sender_id: currentUser.id,
            receiver_id: targetId,
            message: audioUrl,
            type: 'audio',
          },
        ])
        .select();

      if (error) {
        console.error('Insert audio message failed:', error.message);
        return;
      }

      if (data && data[0]) {
        const dbMsg = {
          id: data[0].id,
          text: data[0].message,
          type: 'sent',
          timestamp: data[0].created_at,
          isAudio: true,
        };
        setMessages((prev) => [...prev, dbMsg]);
      }
    };
  }, [mediaRecorder, audioChunks]);

  // Auto Scroll to Bottom of Newest Messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Load initital messages
  const loadInitialMessages = async () => {
    //setIsLoading(true);
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .or(
        `and(sender_id.eq.${currentUser.id},receiver_id.eq.${targetId}),and(sender_id.eq.${targetId},receiver_id.eq.${currentUser.id})`
      )
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Initial message load failed:', error.message);
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
      type: msg.sender_id === currentUser.id ? 'sent' : 'received',
      sender_id: msg.sender_id,
      time: new Date(msg.created_at).toLocaleTimeString(),
      status: msg.status,
      isRequest: msg.is_request,
      timestamp: msg.created_at,
      isAudio: msg.type === 'audio', // <-- mark audio messages here
      isImage: msg.type === 'image',
      isGif: msg.type === 'gif', // 👈 mark GIFs
      gifUrl: msg.type === 'gif' ? msg.message : null, // 👈 store URL
      seen: msg.status === 'seen',
    }));

    setMessages(formatted);
    // 🔒 Lock chat if received messages exceed free limit
    const receivedCount = formatted.filter(
      (msg) => msg.type === 'received'
    ).length;

    if (!isDeveloperKirti && receivedCount >= MESSAGE_LIMIT && !hasAccess) {
      setShowPopup(true);
      setIsChatLocked(true);
    } else {
      setIsChatLocked(false);
    }

    if (filtered.length > 0) {
      setLastFetchedAt(filtered[filtered.length - 1].created_at);
    }
    setIsLoading(false); // Done loading
    // Reset unread count (other user → current user)
    await supabase
      .from('unread_counts')
      .update({ count: 0 })
      .eq('sender_id', targetId)
      .eq('receiver_id', currentUser.id);
  };

  // Fetch new messages
  const fetchNewMessages = async () => {
    const query = supabase
      .from('chats')
      .select('*')
      .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
      .order('created_at', { ascending: true });

    if (lastFetchedAt) {
      query.gt('created_at', lastFetchedAt);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Polling error:', error.message);
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
        type: msg.sender_id === currentUser.id ? 'sent' : 'received',
        time: new Date(msg.created_at).toLocaleTimeString(),
        timestamp: msg.created_at,
        isImage: msg.type === 'image',
        isGif: msg.type === 'gif', // <-- ADD THIS
        gifUrl: msg.type === 'gif' ? msg.message : null,
      }));

      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const unique = formatted.filter((msg) => !existingIds.has(msg.id));

        const updated = [...prev, ...unique];

        const receivedCount = updated.filter(
          (m) => m.type === 'received'
        ).length;

        if (!isDeveloperKirti && receivedCount >= MESSAGE_LIMIT && !hasAccess) {
          setShowPopup(true);
          setIsChatLocked(true);
        }

        return updated;
      });

      setLastFetchedAt(filtered[filtered.length - 1].created_at);
    }
  };

  // Message deletion after 1 minute
  const startDeletionTimer = (messageId) => {
    setTimeout(async () => {
      const msgToDelete = messages.find((m) => m.id === messageId);
      if (!msgToDelete) return;

      try {
        // Delete from Supabase
        await supabase.from('chats').delete().eq('id', messageId);

        // Delete from storage if image
        {
          /*   if (msgToDelete.isImage) {
        const url = new URL(msgToDelete.text);
        const filePath = decodeURIComponent(
          url.pathname.split("/storage/v1/object/public/chat-assets/")[1]
        );
        if (filePath) {
          await supabase.storage.from("chat-assets").remove([filePath]);
        }
      }
*/
        }
        // Update local state
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      } catch (err) {
        console.error('Failed to delete message:', err.message);
      }
    }, 60 * 60 * 1000); // 1 hour
  };

  // Get readable time format for sent messages
  function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }

    return i18n.t('justNow');
  }

  // Send Message
  const sendMessage = async () => {
    if (isChatLocked && !isDeveloperKirti) {
      setShowPopup(true);
      return;
    }

    if (isSending) return;
    setIsSending(true);

    trackEvent({
      action: 'button_click',
      category: 'Chat Page',
      label: 'Send Message Button',
    });

    const messageTextRaw = input.trim();

    if (!messageTextRaw) {
      setIsSending(false);
      return;
    }

    // Replace message if developer code entered
    let messageText = messageTextRaw;

    // use name instead of id
    if (messageTextRaw === 'Code2087') {
      const callerName = targetUser?.name || 'Someone';

      messageText = `You getting a video call. Upgrade to premium to pick up the call`;
    }

    setInput('');
    inputRef.current?.focus();

    const isAbusive = bannedData.abusiveWords.some((w) =>
      messageText.toLowerCase().includes(w.toLowerCase())
    );
    try {
      const { data, error } = await supabase
        .from('chats')
        .insert([
          {
            sender_id: currentUser.id,
            receiver_id: targetId,
            message: messageText,
            type: 'text',
            is_abusive: isAbusive,
          },
        ])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const dbMsg = {
          id: data[0].id,
          text: data[0].message,
          type: 'sent',
          time: new Date(data[0].created_at).toLocaleTimeString(),
          timestamp: data[0].created_at,
        };

        // Directly update messages from DB
        setMessages((prev) => [...prev, dbMsg]);

        // Ensure chat partner is pinned
        await supabase
          .from('pinned_users')
          .upsert([{ user_id: currentUser.id, pinned_user_id: targetId }]);

        // Update unread counts
        if (!blockedByOtherUser && !iBlockedOtherUser) {
          const { data: unreadData, error: unreadError } = await supabase
            .from('unread_counts')
            .upsert(
              {
                sender_id: currentUser.id,
                receiver_id: targetId,
                count: 1,
                updated_at: new Date().toISOString(),
              },
              { onConflict: ['sender_id', 'receiver_id'] }
            )
            .select();

          if (!unreadError && unreadData?.[0]) {
            const newCount = unreadData[0].count + 1;
            await supabase
              .from('unread_counts')
              .update({ count: newCount, updated_at: new Date().toISOString() })
              .eq('sender_id', currentUser.id)
              .eq('receiver_id', targetId);

            // Send push if receiver not in same chat
            {
              /**      try {
              const { data: receiverData, error: routeError } = await supabase
                .from("users")
                .select("active_route")
                .eq("id", targetId)
                .single();

              if (!routeError) {
                const receiverRoute = receiverData?.active_route;
                if (!receiverRoute?.startsWith("/chat/")) {
                  await axios.post(
                    "https://myselpost.onrender.com/send-message-push",
                    { userId: targetId }
                  );
                }
              }
            } catch (err) {
              console.error("❌ Error sending push:", err.message);
            }*/
            }
          }
        } else {
          console.log('🚫 Message blocked, push skipped.');
        }
      }
    } catch (err) {
      console.error('❌ Supabase insert error:', err.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleBlockToggle = async () => {
    trackEvent({
      action: 'button_click',
      category: 'Chat Page',
      label: 'Block Button',
    });

    if (!isBlocked) {
      // optimistic update FIRST
      setIsBlocked(true);
      setIBlockedOtherUser(true);

      const { error } = await supabase.from('blocked_users').insert({
        blocker_id: currentUser.id,
        blocked_id: targetId,
      });

      if (error) {
        // revert if failed
        setIsBlocked(false);
        setIBlockedOtherUser(false);
        console.error('Block failed:', error.message);
        toast.error(i18n.t('blockFailed'));
        return;
      }

      toast.success(i18n.t('userBlocked'));
    } else {
      // optimistic update FIRST
      setIsBlocked(false);
      setIBlockedOtherUser(false);

      const { error } = await supabase
        .from('blocked_users')
        .delete()
        .eq('blocker_id', currentUser.id)
        .eq('blocked_id', targetId);

      if (error) {
        // revert if failed
        setIsBlocked(true);
        setIBlockedOtherUser(true);
        toast.error(i18n.t('unblockFailed'));
        console.error(error.message);
        return;
      }

      toast.success(i18n.t('userUnblocked'));
    }
  };

  // On pressing enter, send message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Sanitizing input and detecting abusive words/links/phone number
  const handleInputChange = async (e) => {
    const newText = e.target.value;
    setInput(newText);

    // Normalize input for smart detection
    const lowerText = newText.toLowerCase();
    const normalizedText = lowerText
      .replace(/[\s\-.:/]/g, '')
      .replace(/dot/g, '.');

    // Abusive check
    const abusiveWordsInText = bannedData.abusiveWords.filter((word) =>
      lowerText.includes(word.toLowerCase())
    );

    if (abusiveWordsInText.length > 0) {
      // Decrement decency in DB
      const { error } = await supabase.rpc('decrement_decency', {
        user_id_input: currentUser.id,
      });
      if (error) console.error('❌ RPC error:', error.message);
    }

    // Link check
    const hasLink = bannedData.bannedLinks.some((link) =>
      normalizedText.includes(link.toLowerCase())
    );
    if (hasLink) {
      setInput('');
      inputRef.current?.focus();
      await supabase.rpc('decrement_decency', {
        user_id_input: currentUser.id,
      });
      return;
    }

    // Phone number check
    const phonePattern = /\b\d{10,13}\b/;
    if (phonePattern.test(newText.replace(/[\s-]/g, ''))) {
      setInput('');
      inputRef.current?.focus();
      await supabase.rpc('decrement_decency', {
        user_id_input: currentUser.id,
      });
      return;
    }

    // Detect copy-paste
    const allowPasteUsers = ['Shivani', 'Madison'];
    if (
      !allowPasteUsers.includes(currentUser.name) &&
      newText.length - input.length > 10 &&
      newText !== lastPasted.current
    ) {
      lastPasted.current = newText;
      setAlertMessage({
        text: `⚠️ ${i18n.t('pasteLongNotAllowed')}`,
        buttons: ['close'],
      });
      setInput('');
      inputRef.current?.focus();
      await supabase.rpc('decrement_decency', {
        user_id_input: currentUser.id,
      });
      return;
    }
  };

  // Detect pasting and deduct the coins (skip Shivani & Madison)
  const handlePaste = async (e) => {
    trackEvent({
      action: 'button_click',
      category: 'Chat Page',
      label: 'Paste Button',
    });

    const allowPasteUsers = ['Shivani', 'Madison'];

    if (!allowPasteUsers.includes(currentUser.name)) {
      const pastedText = e.clipboardData.getData('text/plain').toLowerCase();
      if (pastedText) {
        setAlertMessage({
          text: i18n.t('pasteNotAllowed'),
          withButton: true,
        });
        const { error } = await supabase.rpc('decrement_decency', {
          user_id_input: currentUser.id,
        });

        if (error) {
          console.error('❌ RPC error:', error.message);
        }
      }
    }
  };

  // Utility: compress + resize
  const compressAndResize = async (file, targetKB = 60) => {
    let quality = 0.9;
    let maxWidthOrHeight = 1000;
    let compressedFile = file;

    for (let i = 0; i < 10; i++) {
      const options = {
        maxSizeMB: targetKB / 1024, // KB → MB
        maxWidthOrHeight,
        initialQuality: quality,
        useWebWorker: true,
      };

      compressedFile = await imageCompression(file, options);
      const sizeKB = compressedFile.size / 1024;

      if (sizeKB <= targetKB) break;

      quality -= 0.1;
      maxWidthOrHeight = Math.floor(maxWidthOrHeight * 0.8);
      if (quality <= 0.1) quality = 0.1;
      file = compressedFile;
    }

    return compressedFile;
  };

  // Image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Allow unlimited images if currentUser.name is shivani or madison
    {
      /*if (!(currentUser.name === "Shivani" || currentUser.name === "Madison")) {
      const imageSendKey = `imageSentDate_${currentUser.id}`;
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const lastSentDate = localStorage.getItem(imageSendKey);

      // Secondary check (failsafe)
      if (lastSentDate === today) {
        setAlertMessage("You can only send one image per day.");
        return;
      }
    }*/
    }
    setIsSendingImage(true);
    // 🔹 compress before upload
    let uploadFile = file;
    try {
      uploadFile = await compressAndResize(file, 60); // target ~60KB
    } catch (err) {
      console.error('Image compression failed, using original:', err);
    }
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `chat-images/${currentUser.id}/${fileName}`;

    const { error: uploadError } = await supabaseStorage.storage
      .from('chat-assets')
      .upload(filePath, uploadFile);

    if (uploadError) {
      console.error('Upload failed:', uploadError.message);
      setIsSendingImage(false);
      return;
    }

    const { data: publicURLData } = supabaseStorage.storage
      .from('chat-assets')
      .getPublicUrl(filePath);

    const imageUrl = publicURLData?.publicUrl;

    const { data, error } = await supabase
      .from('chats')
      .insert([
        {
          sender_id: currentUser.id,
          receiver_id: targetId,
          message: imageUrl,
          type: 'image',
        },
      ])
      .select();

    if (error) {
      console.error('Failed to insert image message:', error.message);
      setIsSendingImage(false);
      return;
    }
    const messageId = data?.[0]?.id;
    if (messageId) {
      // Update unread counts
      await supabase.from('unread_counts').upsert(
        {
          sender_id: currentUser.id,
          receiver_id: targetId,
          count: 1,
          updated_at: new Date().toISOString(),
        },
        { onConflict: ['sender_id', 'receiver_id'] }
      );
    }
    if (data && data[0]) {
      const dbMsg = {
        id: data[0].id,
        text: data[0].message,
        type: 'sent',
        isImage: true,
        time: new Date(data[0].created_at).toLocaleTimeString(),
        timestamp: data[0].created_at,
      };

      setMessages((prev) => [...prev, dbMsg]);
      if (!(currentUser.name === 'Shivani' || currentUser.name === 'Madison')) {
        const imageSendKey = `imageSentDate_${currentUser.id}`;
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        localStorage.setItem(imageSendKey, today);
      }
    }
    setIsSendingImage(false);
  };

  // Image selection for sending
  const handleFileInputClick = (e) => {
    {
      /* const hasUploadedImage =
      localStorage.getItem("hasUploadedImage") === "true";
    if (!hasUploadedImage) {
      setAlertMessage({
        text: (
          <>
            📸 Upload one post under{" "}
            <Link
              to="/roast"
              style={{
                color: "#e63946",
                fontWeight: "bold",
                textDecoration: "underline",
              }}
            >
              Roast
            </Link>{" "}
            section to send image.
          </>
        ),
        withButton: true,
      });

      e.preventDefault(); // prevent opening file dialog
      return;
    }
*/
    }
    if (currentUser.name === 'shivani' || currentUser.name === 'madison') {
      return; // no limit for these users
    }

    const imageSendKey = `imageSentDate_${currentUser.id}`;
    const lastSentDate = localStorage.getItem(imageSendKey);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    {
      /*if (lastSentDate === today) {
      e.preventDefault(); // Prevents file dialog from opening
      setAlertMessage("You can only send one image per day.");
    }*/
    }
  };

  // Delete Sent Image on Click
  const handleImageClick = async (msg) => {
    trackEvent({
      action: 'button_click',
      category: 'Chat Page',
      label: 'Share Image Button',
    });
    setModalImageMsg(msg);

    const bucketName = 'chat-assets';
    const imageUrl = msg.text;

    // 1. Unblur image immediately
    const imgElement = document.querySelector(`img[src="${imageUrl}"]`);
    if (imgElement) imgElement.classList.remove('blurred');

    setTimeout(async () => {
      try {
        // 2. Extract file path
        const url = new URL(imageUrl);
        const filePath = decodeURIComponent(
          url.pathname.split(`/storage/v1/object/public/${bucketName}/`)[1]
        );

        // 3. Delete all messages with same imageUrl (from both sides)
        await supabase.from('chats').delete().eq('message', imageUrl);

        // 4. Delete from storage
        if (filePath) {
          await supabaseStorage.storage.from(bucketName).remove([filePath]);
        }

        // 5. Update UI (remove all image messages with this URL)
        setMessages((prev) => prev.filter((m) => m.text !== imageUrl));
      } catch (err) {
        console.error('Error deleting image:', err.message);
      }
    }, 10000);
  };

  const handleAudioTermsAccept = () => {
    setShowAudioTerms(false); // close popup

    if (pendingAudioStart) {
      setPendingAudioStart(false);
      handleMicClick(); // now start recording
    }
  };

  // Mic Icon Click
  const handleMicClick = async () => {
    if (!isRecording) {
      try {
        // ✅ Ask permission first (needed for mobile Chrome)
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        // ✅ Better mobile-friendly MIME type fallback
        let mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          if (MediaRecorder.isTypeSupported('audio/mp4')) {
            mimeType = 'audio/mp4';
          } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
            mimeType = 'audio/ogg';
          } else {
            mimeType = ''; // let browser decide
          }
        }

        const chunks = [];
        const recorder = new MediaRecorder(
          stream,
          mimeType ? { mimeType } : {}
        );

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = async () => {
          const blob = new Blob(chunks, { type: mimeType || 'audio/webm' });
          const fileExt = mimeType.split('/')[1] || 'webm';
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `chat-audio/${currentUser.id}/${fileName}`;

          const { error: uploadError } = await supabaseStorage.storage
            .from('chat-audio')
            .upload(filePath, blob);

          if (uploadError) {
            console.error('Upload failed:', uploadError.message);
            return;
          }

          const { data: publicURLData } = supabaseStorage.storage
            .from('chat-audio')
            .getPublicUrl(filePath);

          const audioUrl = publicURLData?.publicUrl;

          await supabase.from('chats').insert([
            {
              sender_id: currentUser.id,
              receiver_id: targetId,
              message: audioUrl,
              type: 'audio',
            },
          ]);
        };

        recorder.start();
        setMediaRecorder(recorder);
        setAudioChunks(chunks);
        setIsRecording(true);
      } catch (err) {
        console.error('🎤 Mic error:', err);
        setAlertMessage({
          text: '❌ Audio sharing only works in laptops/computers.',
          withButton: true,
        });
      }
    } else {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const fetchGifs = async () => {
    if (!gifQuery.trim()) return;

    setGifLoading(true);
    setGifs([]);

    try {
      const customerId = 'user_' + Math.random().toString(36).substr(2, 9);
      const API_KEY =
        process.env.REACT_APP_KLIPY_KEY ||
        'QE4eFLlyLYo5GpWgrwgmKLojHdUZh9K5Ys8fJUmBO77H5G2xUFAzmxk2WiHDuMWf';
      const BASE = 'https://api.klipy.com/api/v1';
      const endpoint = `${BASE}/${API_KEY}/gifs/search?q=${encodeURIComponent(
        gifQuery.trim()
      )}&per_page=12&customer_id=${customerId}&content_filter=medium&locale=en`;

      const res = await axios.get(endpoint);
      const gifData = res.data?.data?.data || [];

      const mapped = gifData.map((gif, i) => {
        let url = null;
        if (gif.file?.hd?.gif?.url) {
          url = gif.file.hd.gif.url;
        } else if (gif.file?.md?.gif?.url) {
          url = gif.file.md.gif.url;
        } else if (gif.file?.sm?.gif?.url) {
          url = gif.file.sm.gif.url;
        } else if (gif.file?.xs?.gif?.url) {
          url = gif.file.xs.gif.url;
        }

        let mp4Url = null;
        if (gif.file?.hd?.mp4?.url) {
          mp4Url = gif.file.hd.mp4.url;
        } else if (gif.file?.md?.mp4?.url) {
          mp4Url = gif.file.md.mp4.url;
        } else if (gif.file?.sm?.mp4?.url) {
          mp4Url = gif.file.sm.mp4.url;
        }

        return {
          id: gif.id || i,
          url: url,
          mp4Url: mp4Url,
          title: gif.title || `GIF ${i}`,
          slug: gif.slug,
        };
      });

      setGifs(mapped);
    } catch (err) {
      console.error('Error fetching gifs', err);
      setGifs([]);
    } finally {
      setGifLoading(false);
    }
  };

  // Add this function to send a GIF
  const sendGif = async (gif) => {
    // 🚫 Hard block duplicates instantly
    if (sendingGifRef.current) return;
    sendingGifRef.current = true;
    setIsSending(true);
    setSendingGifId(gif.id); // 🟢 Show "Sending..." on this GIF

    const gifUrl = gif.url || `https://klipy.com/gif/${gif.slug || gif.id}`;

    try {
      const { data, error } = await supabase
        .from('chats')
        .insert([
          {
            sender_id: currentUser.id,
            receiver_id: targetId,
            message: gifUrl,
            type: 'gif',
          },
        ])
        .select();

      if (error) {
        console.error('Failed to send GIF:', error.message);
        return;
      }

      if (data && data[0]) {
        const dbMsg = {
          id: data[0].id,
          text: data[0].message,
          type: 'sent',
          isGif: true,
          gifUrl: data[0].message,
          time: new Date(data[0].created_at).toLocaleTimeString(),
          timestamp: data[0].created_at,
        };

        setMessages((prev) => [...prev, dbMsg]);

        // Auto-delete after 1 minute
        setTimeout(async () => {
          try {
            await supabase.from('chats').delete().eq('id', dbMsg.id);
            setMessages((prev) => prev.filter((m) => m.id !== dbMsg.id));
          } catch (err) {
            console.error('Error deleting GIF:', err.message);
          }
        }, 60 * 1000);
      }

      await supabase.from('unread_counts').upsert(
        {
          sender_id: currentUser.id,
          receiver_id: targetId,
          count: 1,
          updated_at: new Date().toISOString(),
        },
        { onConflict: ['sender_id', 'receiver_id'] }
      );

      setShowGifSearch(false);
    } finally {
      sendingGifRef.current = false;
      setIsSending(false);
      setSendingGifId(null); // 🔴 Remove "Sending..." overlay
    }
  };

  useEffect(() => {
    // Detect BACK button (browser navigation)
    const handlePopState = async () => {
      await supabase
        .from('users')
        .update({ active_route: `/` })
        .eq('id', currentUser.id);
    };
    window.addEventListener('popstate', handlePopState);

    // Detect BACKGROUND / FOREGROUND (like Home or Recent Apps button)
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        await supabase
          .from('users')
          .update({ active_route: `/` })
          .eq('id', currentUser.id);
      } else {
        //console.log("📱 App moved to foreground");
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Take user to previous page or one step back
  const handleBack = async () => {
    navigate(-1);
    await supabase
      .from('users')
      .update({ active_route: `/` })
      .eq('id', currentUser.id);
  };

  useEffect(() => {
    const hasSeenNotice = localStorage.getItem('autoDeleteNoticeSeen');
    if (!hasSeenNotice) {
      setShowNotice(true);

      const timer = setTimeout(() => {
        setShowNotice(false);
        localStorage.setItem('autoDeleteNoticeSeen', 'true'); // mark as seen
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleChatSupport = () => {
    navigate('/live-support');
  };

  const isIndianUser = countryCode === 'IN';
const CONTENT_LOCKER_URL = 'https://rapid-links.com/s?QzH2N7V2'
  return (
    <div
      className="Chat-UI"
      style={{
        background: bgStyle,
        backgroundBlendMode: 'multiply',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: '"Comic Sans MS", "Caveat", cursive',
      }}
    >
      <ChatHeader
        title={targetUser?.name || 'Chat'}
        onBack={handleBack}
        onBlockToggle={handleBlockToggle}
        isBlocked={isBlocked}
          showVideo={false}
      ></ChatHeader>

      {/*<div
        className="reveal-number"
        onClick={() => setShowRevealNumberPopup(true)}
      >

        <span className="mini-vip-badge">VIP</span>

        <strong className="reveal-num-text">🔒 Reveal Instagram: </strong>

        <span className="reveal-num-code">
          <span className="blur-number">856102469</span>
        </span>
      </div>*/}
      {showPremiumPopup && (
        <div className="video-premium-overlay">
          <div className="video-premium-modal">
            <div className="video-premium-header">
              <FaCrown className="video-premium-crown" />
              <h2>Premium Feature</h2>
              <p>Unlock Video Calling</p>
            </div>

            <div className="video-premium-price">
              {isIndianUser ? '₹10' : '$1'} <span>/ lifetime</span>
            </div>

            <div className="video-premium-features">
              <div className="video-premium-feature">
                <FaCheck className="video-check-icon" />
                <span>Unlimited video calls</span>
              </div>
              <div className="video-premium-feature">
                <FaCheck className="video-check-icon" />
                <span>HD video quality</span>
              </div>
              <div className="video-premium-feature">
                <FaCheck className="video-check-icon" />
                <span>Priority connection</span>
              </div>
              <div className="video-premium-feature">
                <FaCheck className="video-check-icon" />
                <span>Lifetime access</span>
              </div>
            </div>

            {/* New Contact Manager Section */}
            <div className="manager-contact-box">
              <p className="contact-text">
                Got questions? Contact your manager
              </p>
              <p className="manager-name">Anuj Rajput</p>
              <a
                href="mailto:anujrajput532@gmail.com"
                className="manager-email"
              >
                <FaEnvelope style={{ marginRight: '5px' }} />{' '}
                anujrajput532@gmail.com
              </a>
            </div>

            <div className="video-premium-actions">
              <button
                className="upi-btn"
                onClick={isIndianUser ? handleUPI : handleKofi}
              >
                {isIndianUser ? 'Pay via UPI' : 'Tip via Ko-fi'}
              </button>
              <button
                className="video-premium-cancel-btn"
                onClick={() => setShowPremiumPopup(false)}
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="chat-container">
        <div className="chat-box">
          {/* Top actions visible only on desktop */}
          <div className="top-actions desktop-only">
            <div className="left-actions">
              <button className="block-btn" onClick={handleBlockToggle}>
                {isBlocked ? 'Unblock' : 'Block'}
              </button>
            </div>

            <div className="right-actions auto-delete-toggle">
              <label className="toggle-label">Self-Destruct: 24h</label>
              <div
                className={`toggle-switch ${autoDeleteEnabled ? 'on' : 'off'}`}
              >
                <div className="toggle-thumb" />
              </div>
            </div>
          </div>
          {/*showNotice && (
            <div className="auto-delete-notice">🕒 {i18n.t('autoDelete')}</div>
          )*/}
          {/* Show user/chat blocked UI */}
          {blockedByOtherUser || iBlockedOtherUser ? (
            <div className="blocked-ui">
              <h2>🚫 {i18n.t('chatBlocked')}</h2>
              {iBlockedOtherUser && <p>{i18n.t('youBlocked')}</p>}
              {blockedByOtherUser && (
                <div>
                  <p className="blocked-by">{i18n.t('blockedByUser')}</p>
                  <button
                    className="get-unblocked"
                    onClick={() => setShowUnblockPopup(true)}
                  >
                    Get Unblocked
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Show fetched messages */}
              <div className="chat-messages">
                {messages.map((msg) => (
                  <div
                    key={msg.localId ?? msg.id} // <- stable key: prefer localId if present
                    className={`chat-message ${msg.type} ${msg.status || ''}`}
                    onClick={() => msg.isImage && handleImageClick(msg)}
                  >
                    {msg.isGif ? (
                      <img src={msg.gifUrl} alt="GIF" className="chat-gif" />
                    ) : msg.isImage ? (
                      msg.type === 'sent' ? (
                        <p>
                          <em>📤 {i18n.t('sentImage')}</em>
                        </p>
                      ) : (
                        <div className="chat-image-wrapper">
                          {(() => {
                            const state = imageState[msg.id] || {};

                            // STEP 1 — not revealed yet
                            if (!state.revealed) {
                              return (
                                <div
                                  className="image-placeholder"
                                  onClick={() => {
            // If locker not completed yet
            if (!state.unlocked) {
              window.open(CONTENT_LOCKER_URL, "_blank");

              // Mark as attempted unlock
              setImageState((prev) => ({
                ...prev,
                [msg.id]: { ...state, unlocked: true },
              }));

              return;
            }
             // If already unlocked, reveal image
            setImageState((prev) => ({
              ...prev,
              [msg.id]: { ...state, revealed: true },
            }));
          }}
                                >
                                  <p
                                    style={{ color: '#fff' }}
                                    className="click-to-reveal-img-text"
                                  >
                                    {state.unlocked
              ? "Click Again to Reveal Image"
              : "Click to Reveal Image"}
                                  </p>
                                </div>
                              );
                            }

                            // STEP 2 — revealed but BLURRED
                            if (state.revealed && !state.unblurred) {
                              return (
                                <div className="blurred-image-container">
                                  <img
                                    src={msg.text}
                                    alt="Blurred"
                                    className="chat-image blurred"
                                  />
                                  <button
                                    className="unblur-btn"
                                    onClick={() => setModalImageMsg(msg)}
                                  >
                                    Unblur Image
                                  </button>
                                </div>
                              );
                            }

                            // STEP 3 — permanently unblurred
                            return (
                              <img
                                src={msg.text}
                                alt="Unblurred"
                                className="chat-image"
                                onClick={() => handleImageClick(msg)}
                              />
                            );
                          })()}
                        </div>
                      )
                    ) : msg.isAudio ? (
                      <div className="chat-audio">
                        <audio controls src={msg.text} />
                      </div>
                    ) : msg.text?.includes(
                        'video calling you. Upgrade to premium to pick up the call'
                      ) ? (
                      <div className="premium-call-card">
                        <div className="premium-call-header">
                          <span className="premium-call-icon">📹</span>
                          <span className="premium-call-title">
                            Incoming Video Call
                          </span>
                          <span className="premium-call-badge">VIP</span>
                        </div>

                        <div className="premium-call-body">{msg.text}</div>

                        {!hasAccess && (
                          <button
                            className="premium-call-upgrade-btn"
                            onClick={() => setShowPremiumPopup(true)}
                          >
                            Upgrade
                          </button>
                        )}

                        {hasAccess && (
                          <button className="premium-call-answer-btn">
                            Answer Call
                          </button>
                        )}
                      </div>
                    ) : (
                      <p>
                        {msg.text.split(/\s+/).map((word, i) => {
                          const normalized = word
                            .toLowerCase()
                            .replace(/[\s\-.:/]/g, '');
                          const isWordAbusive = bannedData.abusiveWords.some(
                            (w) => normalized.includes(w.toLowerCase())
                          );

                          return (
                            <span
                              key={i}
                              style={{
                                filter:
                                  msg.is_abusive || isWordAbusive
                                    ? 'blur(5px)'
                                    : 'none',
                                backgroundColor: isWordAbusive
                                  ? '#eee'
                                  : 'transparent',
                                borderRadius: '4px',
                                padding: '0 2px',
                                marginRight: '2px',
                              }}
                            >
                              {word}
                            </span>
                          );
                        })}
                      </p>
                    )}
                    <div className="message-footer">
                      <span className="time">{getTimeAgo(msg.timestamp)}</span>
                      {msg.type === 'sent' && (
                        <span className={`time ${msg.seen}`}>
                          {msg.seen ? i18n.t('seen') : i18n.t('sent')}
                        </span>
                      )}
                    </div>{' '}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area visible only on desktop inside chat-box */}
              <div className="input-area desktop-only">
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
                    style={{ display: 'none' }}
                    onClick={handleFileInputClick}
                    onChange={handleImageUpload}
                  />
                </div>

                <div className="icon-wrapper">
                  <button
                    className="gif-btn"
                    onClick={() => setShowGifSearch(!showGifSearch)}
                  >
                    GIF
                  </button>
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  onPaste={handlePaste}
                  placeholder={i18n.t('typeMessage')}
                />

                <button
                  onClick={sendMessage}
                  disabled={isSending || isSendingImage || !input.trim()}
                >
                  {isSending ? '➤' : '➤'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {(!isChatLocked || isDeveloperKirti) &&
      !blockedByOtherUser &&
      !iBlockedOtherUser ? (
        <div className="input-area mobile-only">
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
              style={{ display: 'none' }}
              onClick={handleFileInputClick}
              onChange={handleImageUpload}
            />
          </div>
          <div className="icon-wrapper plus-wrapper">
            <button
              style={{ background: 'none', color: '#111', fontSize: '22px' }}
              onClick={() => setShowPlusMenu((prev) => !prev)}
            >
              +
            </button>

            <div className={`plus-menu ${showPlusMenu ? 'open' : ''}`}>
              <button
                className="plus-item"
                onClick={() => {
                  setShowGifSearch(true);
                  setShowPlusMenu(false);
                }}
              >
                🎞️ <span>GIF</span>
              </button>
            </div>
          </div>

      

          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            onPaste={handlePaste}
            placeholder={i18n.t('typeMessage')}
          />

          <button
            onClick={sendMessage}
            disabled={
              isSending || isSendingImage || isSendingGif || !input.trim()
            }
          >
            {isSending ? '➤' : '➤'}
          </button>
        </div>
      ) : (
     <div className="input-area mobile-only">
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
              style={{ display: 'none' }}
              onClick={handleFileInputClick}
              onChange={handleImageUpload}
            />
          </div>
          <div className="icon-wrapper plus-wrapper">
            <button
              style={{ background: 'none', color: '#111', fontSize: '22px' }}
              onClick={() => setShowPlusMenu((prev) => !prev)}
            >
              +
            </button>

            <div className={`plus-menu ${showPlusMenu ? 'open' : ''}`}>
              <button
                className="plus-item"
                onClick={() => {
                  setShowGifSearch(true);
                  setShowPlusMenu(false);
                }}
              >
                🎞️ <span>GIF</span>
              </button>
            </div>
          </div>

      

          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            onPaste={handlePaste}
            placeholder={i18n.t('typeMessage')}
          />

          <button
            onClick={sendMessage}
            disabled={
              isSending || isSendingImage || isSendingGif || !input.trim()
            }
          >
            {isSending ? '➤' : '➤'}
          </button>
        </div>
      )}

      {/* Show full view image on click */}
      {modalImageMsg && (
        <div className="image-modal" onClick={() => setModalImageMsg(null)}>
          <div
            style={{ position: 'relative', textAlign: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const state = imageState[modalImageMsg.id] || {};

              
              if (state.revealed && !state.unblurred) {
                return (
                  <>
                    <img
                      src={modalImageMsg.text}
                      alt="Blurred"
                      className="chat-image blurred"
                      style={{ maxWidth: '90%', maxHeight: '90%' }}
                    />

                    <button className="unblur-btn modal-unblur">
                      Unblur Image
                    </button>
                  </>
                );
              }

              // UNBLURRED
              return (
                <img
                  src={modalImageMsg.text}
                  alt="Full View"
                  style={{
                    maxWidth: '90%',
                    maxHeight: '90%',
                    display: 'block',
                    margin: '0 auto',
                  }}
                />
              );
            })()}
          </div>
        </div>
      )}

      {showGifSearch && (
        <div className="gif-search-panel">
          <div className="gif-search-header">
            <h4>{i18n.t('searchGifs')}</h4>
            <button onClick={() => setShowGifSearch(false)}>×</button>
          </div>

          <div className="gif-search-input">
            <input
              placeholder={i18n.t('searchGifExample')}
              value={gifQuery}
              onChange={(e) => setGifQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchGifs()}
            />
            <button onClick={fetchGifs} disabled={gifLoading}>
              {gifLoading ? i18n.t('searching') : i18n.t('search')}
            </button>
          </div>

          <div className="gif-results">
            {gifLoading && (
              <div style={{ marginLeft: '15%' }}>{i18n.t('loadingGifs')}</div>
            )}
            {gifs.map((gif) => (
              <div
                key={gif.id}
                className="gif-item"
                onClick={() => !isSending && sendGif(gif)}
              >
                {gif.mp4Url ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: '100%',
                      height: '100px',
                      objectFit: 'cover',
                    }}
                  >
                    <source src={gif.mp4Url} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={gif.url}
                    alt={gif.title}
                    style={{
                      width: '100%',
                      height: '100px',
                      objectFit: 'cover',
                    }}
                  />
                )}
                {sendingGifId === gif.id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}
                  >
                    {i18n.t('sending')}
                  </div>
                )}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '100%',
                    textAlign: 'center',
                    background: 'rgba(0,0,0,0.3)',
                    color: 'white',
                    fontSize: '10px',
                    padding: '2px 0',
                    borderBottomLeftRadius: '4px',
                    borderBottomRightRadius: '4px',
                  }}
                >
                  {i18n.t('gifVia')}{' '}
                  <a
                    href="https://klipy.com"
                    target="_blank"
                    style={{ color: 'white', textDecoration: 'underline' }}
                  >
                    Klipy
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <UnblockPopup
        isOpen={showUnblockPopup}
        onClose={() => setShowUnblockPopup(false)}
      />
      <Toaster />
    </div>
  );
};

export default Chat;
