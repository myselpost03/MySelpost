import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import "../Styles/ChatList.css";
import {
  FaCircle,
  FaMars,
  FaVenus,
  FaCheckCircle,
  FaEnvelope,
  FaThumbtack,
  FaSearch,
  FaFilter,
  FaBell,
  FaBellSlash,
  FaCheck,
} from "react-icons/fa";
import empty from "../Assets/empty.png";
import { supabase } from "../Utils/supabaseClient";
import { subscribeUser } from "../Utils/subscribeUser";
import LoadingIndicator from "../Components/LoadingIndicator";
import ReactCountryFlag from "react-country-flag";
import MiniSpinner from "../Components/MiniSpinner";
import SketchyAlert from "../Components/SketchyAlert";
import FeedbackPopup from "../Components/FeedbackPopup";
import { trackEvent } from "../Utils/analytics";

const countryNameToCode = {
  AF: "AF",
  AL: "AL",
  DZ: "DZ",
  AD: "AD",
  AO: "AO",
  AG: "AG",
  AR: "AR",
  AM: "AM",
  AU: "AU",
  AT: "AT",
  AZ: "AZ",
  BS: "BS",
  BH: "BH",
  BD: "BD",
  BB: "BB",
  BY: "BY",
  BE: "BE",
  BZ: "BZ",
  BJ: "BJ",
  BT: "BT",
  BO: "BO",
  BA: "BA",
  BW: "BW",
  BR: "BR",
  BN: "BN",
  BG: "BG",
  BF: "BF",
  BI: "BI",
  CV: "CV",
  KH: "KH",
  CM: "CM",
  CA: "CA",
  CF: "CF",
  TD: "TD",
  CL: "CL",
  CN: "CN",
  CO: "CO",
  KM: "KM",
  CD: "CD",
  CG: "CG",
  CR: "CR",
  CI: "CI",
  HR: "HR",
  CU: "CU",
  CY: "CY",
  CZ: "CZ",
  DK: "DK",
  DJ: "DJ",
  DM: "DM",
  DO: "DO",
  EC: "EC",
  EG: "EG",
  SV: "SV",
  GQ: "GQ",
  ER: "ER",
  EE: "EE",
  SZ: "SZ",
  ET: "ET",
  FJ: "FJ",
  FI: "FI",
  FR: "FR",
  GA: "GA",
  GM: "GM",
  GE: "GE",
  DE: "DE",
  GH: "GH",
  GR: "GR",
  GD: "GD",
  GT: "GT",
  GN: "GN",
  GW: "GW",
  GY: "GY",
  HT: "HT",
  HN: "HN",
  HU: "HU",
  IS: "IS",
  IN: "IN",
  ID: "ID",
  IR: "IR",
  IQ: "IQ",
  IE: "IE",
  IL: "IL",
  IT: "IT",
  JM: "JM",
  JP: "JP",
  JO: "JO",
  KZ: "KZ",
  KE: "KE",
  KI: "KI",
  KP: "KP",
  KR: "KR",
  KW: "KW",
  KG: "KG",
  LA: "LA",
  LV: "LV",
  LB: "LB",
  LS: "LS",
  LR: "LR",
  LY: "LY",
  LI: "LI",
  LT: "LT",
  LU: "LU",
  MG: "MG",
  MW: "MW",
  MY: "MY",
  MV: "MV",
  ML: "ML",
  MT: "MT",
  MH: "MH",
  MR: "MR",
  MU: "MU",
  MX: "MX",
  FM: "FM",
  MD: "MD",
  MC: "MC",
  MN: "MN",
  ME: "ME",
  MA: "MA",
  MZ: "MZ",
  MM: "MM",
  NA: "NA",
  NR: "NR",
  NP: "NP",
  NL: "NL",
  NZ: "NZ",
  NI: "NI",
  NE: "NE",
  NG: "NG",
  MK: "MK",
  NO: "NO",
  OM: "OM",
  PK: "PK",
  PW: "PW",
  PS: "PS",
  PA: "PA",
  PG: "PG",
  PY: "PY",
  PE: "PE",
  PH: "PH",
  PL: "PL",
  PT: "PT",
  QA: "QA",
  RO: "RO",
  RU: "RU",
  RW: "RW",
  KN: "KN",
  LC: "LC",
  VC: "VC",
  WS: "WS",
  SM: "SM",
  ST: "ST",
  SA: "SA",
  SN: "SN",
  RS: "RS",
  SC: "SC",
  SL: "SL",
  SG: "SG",
  SK: "SK",
  SI: "SI",
  SB: "SB",
  SO: "SO",
  ZA: "ZA",
  SS: "SS",
  ES: "ES",
  LK: "LK",
  SD: "SD",
  SR: "SR",
  SE: "SE",
  CH: "CH",
  SY: "SY",
  TJ: "TJ",
  TZ: "TZ",
  TH: "TH",
  TL: "TL",
  TG: "TG",
  TO: "TO",
  TT: "TT",
  TN: "TN",
  TR: "TR",
  TM: "TM",
  TV: "TV",
  UG: "UG",
  UA: "UA",
  AE: "AE",
  GB: "GB",
  US: "US",
  UY: "UY",
  UZ: "UZ",
  VU: "VU",
  VA: "VA",
  VE: "VE",
  VN: "VN",
  YE: "YE",
  ZM: "ZM",
  ZW: "ZW",
};

const ChatList = () => {
  const [users, setUsers] = useState([]);
  const [genderFilter, setGenderFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "all";
  });
  const [enabled, setEnabled] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showPremiumNotice, setShowPremiumNotice] = useState(false);
  const [premiumTargetUser, setPremiumTargetUser] = useState(null);
  const [hasPaidPremium, setHasPaidPremium] = useState(false);
  const [page, setPage] = useState(0); // pagination page
  const [hasMore, setHasMore] = useState(true); // track if more users exist
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllTabs, setShowAllTabs] = useState(false);
  const [allFilter, setAllFilter] = useState("all"); // 'all' or 'online'
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [inboxUserIds, setInboxUserIds] = useState(new Set());
  const PUBLIC_VAPID_KEY =
    "BMt7fVUizCYq_PQkR-gkxa9azLTlzoLVgFQEIDjjJdP35dj2LyvHKCbBnp3YvsYdPmYwjx7gfnoMMhejp9i85-4";

  const user = JSON.parse(localStorage.getItem("user"));

  const listRef = useRef(null);

  const observerRef = useRef();

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      const { data, error } = await supabase
        .from("unread_counts")
        .select("sender_id, receiver_id, count")
        .eq("receiver_id", user.id);

      if (!error && data) {
        const countMap = {};
        const missingUserIds = [];

        data.forEach((item) => {
          if (item.count > 0) {
            countMap[item.sender_id] = item.count;

            const exists = users.some((u) => u.id === item.sender_id);
            if (!exists) missingUserIds.push(item.sender_id);
          }
        });

        setUnreadCounts(countMap);

        if (missingUserIds.length > 0) {
          const { data: newUsers, error: userErr } = await supabase
            .from("users")
            .select(
              "id, name, profile_pic, country, gender, status, age, decency_rating"
            )
            .in("id", missingUserIds);

          if (!userErr && newUsers) {
            const { data: pinnedData } = await supabase
              .from("pinned_users")
              .select("pinned_user_id")
              .eq("user_id", user.id);

            const pinnedIds =
              pinnedData?.map((row) => row.pinned_user_id) || [];

            const processed = newUsers.map((user) => ({
              ...user,
              avatar: user.profile_pic || empty,
              notifications: countMap[user.id] || 0,
              pinned: pinnedIds.includes(user.id),
              status: user.status || "offline",
            }));

            // merge and remove duplicates
            setUsers((prev) => {
              const allUsers = [...prev, ...processed];

              const uniqueUsers = [];
              const seen = new Set();

              for (const user of allUsers) {
                if (!seen.has(user.id)) {
                  seen.add(user.id);
                  uniqueUsers.push(user);
                }
              }

              return uniqueUsers;
            });
          }
        }
      }
    };
    const fetchInboxUserIds = async () => {
      const { data: sentMsgs, error: sentErr } = await supabase
        .from("messages")
        .select("receiver_id")
        .eq("sender_id", user.id);

      const { data: receivedMsgs, error: recvErr } = await supabase
        .from("messages")
        .select("sender_id")
        .eq("receiver_id", user.id);

      const ids = new Set();

      if (sentMsgs) sentMsgs.forEach((m) => ids.add(m.receiver_id));
      if (receivedMsgs) receivedMsgs.forEach((m) => ids.add(m.sender_id));

      setInboxUserIds(ids);
    };

    fetchInboxUserIds();

    fetchUnreadCounts();
    const interval = setInterval(fetchUnreadCounts, 3000);
    return () => clearInterval(interval);
  }, [user.id]);

  useEffect(() => {
    if (!user?.id) return;

    const updateOnlineStatus = async (status) => {
      const { error } = await supabase
        .from("users")
        .update({ status }) // "online" or "offline"
        .eq("id", user.id);

      if (error) {
        console.error("Failed to update online status:", error.message);
      }
    };

    const handleOnline = () => updateOnlineStatus("online");
    const handleOffline = () => updateOnlineStatus("offline");

    // Initial status based on browser state
    updateOnlineStatus(navigator.onLine ? "online" : "offline");

    // Listen for changes
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      updateOnlineStatus("offline");
    };
  }, [user?.id]);

  const handleUserClick = (clickedId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === clickedId ? { ...user, notifications: 0 } : user
      )
    );
  };

  useEffect(() => {
    const used = new Set(users.map((u) => u.country));
    const allCountries = Object.values(countryNameToCode);

    const usedCountries = Array.from(used).sort();
    const unusedCountries = allCountries
      .filter((code) => !used.has(code))
      .sort();

    // Combined list: used first, then the rest
    setCountries([...usedCountries, ...unusedCountries]);
  }, [users]);

  // 2️⃣ Background refresh for latest data, without showing loading indicator
  useEffect(() => {
    const refreshUsers = async () => {
      const { data: allUsers, error } = await supabase
        .from("users")
        .select(
          "id, name, profile_pic, country, gender, status, age, decency_rating"
        );

      if (!error && allUsers) {
        const pinnedIdsResp = await supabase
          .from("pinned_users")
          .select("pinned_user_id")
          .eq("user_id", user.id);

        const pinnedIds =
          pinnedIdsResp.data?.map((row) => row.pinned_user_id) || [];

        const processed = allUsers
          .filter((u) => u.id !== user.id)
          .map((user) => ({
            ...user,
            avatar: user.profile_pic || empty,
            notifications: user.notifications || 0,
            pinned: pinnedIds.includes(user.id),
            status: user.status || "offline",
          }));

        setUsers((prev) => {
          const existingIds = new Set(prev.map((u) => u.id));
          const newUsers = processed.filter((u) => !existingIds.has(u.id));
          return [...prev, ...newUsers];
        });
      }
    };

    const interval = setInterval(refreshUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = async () => {
    try {
      const subscription = await subscribeUser(PUBLIC_VAPID_KEY);
      setIsSubscribed(true);

      const data = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
        user_id: user.id,
      };

      // Optionally: Check if subscription already exists before upsert
      const { data: existing, error: selectError } = await supabase
        .from("subscriptions")
        .select("endpoint, keys")
        .eq("endpoint", subscription.endpoint)
        .single();

      // Only upsert if changed or not found
      if (
        !existing ||
        existing.keys.p256dh !== data.keys.p256dh ||
        existing.keys.auth !== data.keys.auth
      ) {
        const { error } = await supabase.from("subscriptions").upsert(data, {
          onConflict: ["endpoint"],
        });

        if (error) {
          console.error("Supabase insert error:", error);
          console.log("Failed to save subscription.");
        } else {
          console.log("Subscribed & saved to Supabase!");
        }
      } else {
        console.log("Subscription already up-to-date.");
      }
    } catch (err) {
      console.error("Subscription failed:", err);
    }
  };

  const askNotificationPermission = async () => {
    trackEvent({
      action: "button_click",
      category: "Chat List Page",
      label: "Notification Button",
    });
    if (Notification.permission === "granted") {
      setEnabled(true);
      console.log("Already granted.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setEnabled(true);
      console.log("Push notifications granted.");
      await handleSubscribe();
    } else {
      setEnabled(false);
      setAlertMessage({
        text: "Push notifications not granted!",
        withButton: true,
      });
    }
  };

  const navigate = useNavigate();

  const handleProtectedNavigation = (e, path, targetUser = null) => {
    e.preventDefault();
    const isLoggedIn = localStorage.getItem("user");

    if (isLoggedIn) {
      // console.log("Logged in user:", user);

      // 🚫 Restrict if non-US user (except Akriti) tries to chat with US user
      const isNotUS = user.country !== "US";
      const isNotAkriti = user.name?.trim().toLowerCase() !== "akriti";
      const isTargetUS = targetUser?.country === "US";

      if (isNotUS && isNotAkriti && isTargetUS && !hasPaidPremium) {
        setPremiumTargetUser(targetUser);
        setShowPremiumNotice(true);
        return;
      }

      navigate(path, { state: { targetUser } }); // 👈 Pass clicked user to next screen
    } else {
      navigate("/register");
    }
  };

  useEffect(() => {
    const fetchUserPremiumStatus = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("premium_pricing")
        .eq("id", user?.id)
        .single();

      if (!error && data?.premium_pricing === true) {
        setHasPaidPremium(true);
      } else {
        setHasPaidPremium(false);
      }
    };

    if (user?.id) {
      fetchUserPremiumStatus();
    }
  }, [user?.id]);

  const handlePaypalRedirect = () => {
    navigate(`/payments/${user.id}`);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchTerm.trim() === "" && page === 0) setLoading(true);
      else setLoadingMore(true);

      const limit = 10;
      const offset = page * limit;

      let query = supabase
        .from("users")
        .select(
          "id, name, profile_pic, country, gender, status, age, decency_rating"
        );

      if (genderFilter !== "all") query = query.eq("gender", genderFilter);
      if (countryFilter !== "all") query = query.eq("country", countryFilter);
      if (activeTab === "online") query = query.eq("status", "online");

      // Handle pinned tab separately
      if (activeTab === "pinned") {
        const { data: pinnedData } = await supabase
          .from("pinned_users")
          .select("pinned_user_id")
          .eq("user_id", user.id);

        const pinnedIds = pinnedData?.map((row) => row.pinned_user_id) || [];
        if (pinnedIds.length === 0) {
          setUsers([]);
          setHasMore(false);
          setLoading(false);
          setLoadingMore(false);
          return;
        }

        query = query.in("id", pinnedIds);
      }

      if (searchTerm.trim() !== "") {
        query = query.ilike("name", `%${searchTerm}%`);
      }

      // Prioritize users with profile_pic first only under All tab
      if (activeTab === "all") {
        query = query.order("profile_pic", {
          ascending: false,
          nullsFirst: false,
        });
      }

      const { data: fetchedUsers, error } = await query.range(
        offset,
        offset + limit - 1
      );

      if (!error && fetchedUsers) {
        const { data: pinnedData } = await supabase
          .from("pinned_users")
          .select("pinned_user_id")
          .eq("user_id", user.id);

        const pinnedIds = pinnedData?.map((row) => row.pinned_user_id) || [];

        const processed = fetchedUsers
          .filter((u) => u.id !== user.id)
          .map((user) => ({
            ...user,
            avatar: user.profile_pic || empty,
            notifications: unreadCounts[user.id] || 0,
            pinned: pinnedIds.includes(user.id),
            status: user.status || "offline",
          }));

        if (page === 0) setUsers(processed);
        else
          setUsers((prev) => {
            const existingIds = new Set(prev.map((u) => u.id));
            const newUsers = processed.filter((u) => !existingIds.has(u.id));
            return [...prev, ...newUsers];
          });

        setHasMore(fetchedUsers.length === limit);
      }

      setLoading(false);
      setLoadingMore(false);
    };

    fetchUsers();
  }, [page, activeTab, genderFilter, countryFilter, searchTerm]);

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const genderMatch =
          genderFilter === "all" || user.gender === genderFilter;
        const countryMatch =
          countryFilter === "all" || user.country === countryFilter;
        const searchMatch = user.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const pinMatch =
          activeTab === "pinned"
            ? user.pinned
            : activeTab === "inbox"
            ? unreadCounts[user.id] > 0
            : !(unreadCounts[user.id] > 0); // 👈 Fix: show users only if no unread notifications

        const onlineMatch =
          activeTab === "online" ? user.status === "online" : true;
        return (
          genderMatch && countryMatch && searchMatch && pinMatch && onlineMatch
        );
      })
      .sort((a, b) => {
        const aCount = unreadCounts[a.id] || 0;
        const bCount = unreadCounts[b.id] || 0;
        if (bCount !== aCount) return bCount - aCount;

        const aHasPic = a.avatar !== empty ? 1 : 0;
        const bHasPic = b.avatar !== empty ? 1 : 0;

        if (bHasPic !== aHasPic) return bHasPic - aHasPic;

        const getPriority = (u) => {
          if (u.verified && u.pinned) return 4000;
          if (u.verified) return 3000;
          if (u.pinned) return 2000;
          return 1000;
        };

        return getPriority(b) - getPriority(a);
      });
  }, [
    users,
    genderFilter,
    countryFilter,
    searchTerm,
    activeTab,
    unreadCounts,
    allFilter,
  ]);

  useEffect(() => {
    const hasSubmitted = localStorage.getItem("feedback_submitted");
    if (hasSubmitted === "true") return;

    const lastShown = localStorage.getItem("last_feedback_shown");
    const now = new Date();

    if (lastShown) {
      const lastDate = new Date(lastShown);
      const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
      if (diffDays < 7) return; // Already shown within the past 7 days
    }

    const delayMinutes = Math.floor(Math.random() * 6) + 5; // 5–10 min
    const delayMs = delayMinutes * 60 * 1000;

    const timeout = setTimeout(() => {
      setShowFeedback(true);
      localStorage.setItem("last_feedback_shown", now.toISOString());
    }, delayMs);

    return () => clearTimeout(timeout);
  }, []);

  const handleSubmitSuccess = () => {
    trackEvent({
      action: "button_click",
      category: "Chat List Page",
      label: "Feedback Submission Button",
    });
    localStorage.setItem("feedback_submitted", "true");
    setShowFeedback(false);
  };

  const togglePin = async (targetUserId) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    const alreadyPinned = users.find((u) => u.id === targetUserId && u.pinned);

    if (alreadyPinned) {
      // Unpin
      const { error } = await supabase
        .from("pinned_users")
        .delete()
        .match({ user_id: user.id, pinned_user_id: targetUserId });

      if (!error) {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === targetUserId ? { ...u, pinned: false } : u
          )
        );
      } else {
        console.error("Error unpinning:", error.message);
      }
    } else {
      // Pin
      const { error } = await supabase
        .from("pinned_users")
        .insert([{ user_id: user.id, pinned_user_id: targetUserId }]);

      if (!error) {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === targetUserId ? { ...u, pinned: true } : u
          )
        );
      } else {
        console.error("Error pinning:", error.message);
      }
    }
  };

  const hasPinnedNotification = users.some(
    (u) => u.pinned && unreadCounts[u.id] > 0
  );

  const handleSearchSubmit = async () => {
    trackEvent({
      action: "button_click",
      category: "Chat List Page",
      label: "Search Bar",
    });
    if (searchTerm.trim() === "") {
      setPage(0);
      setUsers([]);
      setHasMore(true);
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("users")
        .select(
          "id, name, profile_pic, country, gender, status, age, decency_rating"
        )
        .ilike("name", `%${searchTerm}%`);

      if (error) throw error;

      const { data: pinnedData } = await supabase
        .from("pinned_users")
        .select("pinned_user_id")
        .eq("user_id", user.id);

      const pinnedIds = pinnedData?.map((row) => row.pinned_user_id) || [];

      const processed = data
        .filter((u) => u.id !== user.id)
        .map((user) => ({
          ...user,
          avatar: user.profile_pic || empty,
          notifications: unreadCounts[user.id] || 0,
          pinned: pinnedIds.includes(user.id),
          status: user.status || "offline",
        }));

      setUsers(processed);
      setHasMore(false); // No infinite scroll during search
    } catch (err) {
      console.error("Search error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasMore || loadingMore || loading || searchTerm.trim() !== "") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      {
        threshold: 1.0,
      }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [hasMore, loadingMore, loading, searchTerm]);

  const handlePinToggle = (e, userId) => {
    e.preventDefault(); // Stop navigation
    e.stopPropagation(); // Prevent click bubbling

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, pinned: !user.pinned } : user
      )
    );
  };

  const handleMarkAllAsSeen = async () => {
    const updated = { ...unreadCounts };
    for (let userId in updated) {
      updated[userId] = 0;
    }
    setUnreadCounts(updated);
    await supabase
      .from("unread_counts")
      .update({ count: 0 })
      .eq("receiver_id", user.id);

    setUsers((prevUsers) =>
      prevUsers.map((u) => ({
        ...u,
        notifications: 0,
      }))
    );
  };

  return (
    <div className="chatlist-container">
      <Header />
      <h2 className="chatlist-title">🖋️ Your Circles</h2>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <>
          <div className="sketchy-search-wrapper">
            <input
              type="text"
              className="sketchy-search"
              placeholder="🔍 Search users..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit();
                }
              }}
            />
            <button className="search-button" onClick={handleSearchSubmit}>
              <FaSearch />
            </button>
          </div>

          <div className="tab-bar">
            <button
              className={`sketchy-tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("all");
                localStorage.setItem("activeTab", "all");
              }}
            >
              All
            </button>
            <button
              className={`sketchy-tab ${
                activeTab === "pinned" ? "active" : ""
              }`}
              onClick={() => {
                setActiveTab("pinned");
                localStorage.setItem("activeTab", "pinned");
              }}
              style={{ position: "relative" }}
            >
              📌 Pinned
              {hasPinnedNotification && (
                <span
                  className="sketchy-badge pinned-tab-badge"
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    fontSize: "0.7rem",
                    backgroundColor: "#e53935",
                    padding: "0.4rem",
                    borderRadius: "50px",
                  }}
                ></span>
              )}
            </button>
            <button
              className={`sketchy-tab ${activeTab === "inbox" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("inbox");
                localStorage.setItem("activeTab", "inbox");
              }}
              style={{ position: "relative" }}
            >
              Inbox
              {Object.values(unreadCounts).some((count) => count > 0) && (
                <span
                  className="sketchy-badge pinned-tab-badge"
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    fontSize: "0.7rem",
                    backgroundColor: "#e53935",
                    padding: "0.4rem",
                    borderRadius: "50px",
                  }}
                ></span>
              )}
            </button>
            {activeTab === "inbox" &&
              Object.values(unreadCounts).some((c) => c > 0) && (
                <button
                  onClick={handleMarkAllAsSeen}
                  className="mark-all-seen-btn"
                  style={{
                    position: "fixed",
                    bottom: "50px",
                    right: "20px",
                    zIndex: 999,
                    padding: "0.8rem 1.2rem",
                    backgroundColor: "#222",
                    color: "white",
                    borderRadius: "30px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                    fontWeight: "bold",
                    fontSize: "0.95rem",
                  }}
                >
                  <FaCheck size={20} color="white" />
                </button>
              )}

            <button
              className={`sketchy-tab ${
                activeTab === "online" ? "active" : ""
              }`}
              onClick={() => {
                const newTab = activeTab === "online" ? "all" : "online";
                setActiveTab(newTab);
                setAllFilter(newTab === "online" ? "online" : "all");
                localStorage.setItem("activeTab", newTab);
              }}
            >
              Online
            </button>
            <button
              onClick={askNotificationPermission}
              className={`notify-btn ${enabled ? "disabled" : "enabled"}`}
            >
              {enabled ? <FaBell /> : <FaBellSlash />}
            </button>

            {activeTab === "all" && (
              <button
                className="fab-filter-button"
                onClick={() => setShowAllTabs(true)}
                title="Filter users"
              >
                <FaFilter />
              </button>
            )}
          </div>

          <div ref={listRef} className="sketchy-list-scrollable">
            {filteredUsers.length > 0 ? (
              <>
                {filteredUsers
                  .filter((u) => u.id !== user.id)
                  .map((user) => (
                    <Link
                      to="#"
                      key={user.id}
                      className={`user-card ${
                        user.notifications > 0 ? "has-notification" : ""
                      }`}
                      onClick={(e) => {
                        handleUserClick(user.id);
                        handleProtectedNavigation(e, `/chat/${user.id}`, user);
                      }}
                    >
                      <div className="user-avatar-wrapper">
                        <Link
                          to={`/profile/${user.id}`}
                          onClick={(e) => {
                            e.stopPropagation(); // 👈 prevent parent click
                          }}
                        >
                          <img
                            src={user.avatar}
                            alt="avatar"
                            className="user-avatar"
                          />
                        </Link>

                        {unreadCounts[user.id] > 0 && (
                          <span className="sketchy-badge">
                            {unreadCounts[user.id]}
                          </span>
                        )}
                      </div>

                      <div className="user-info">
                        <div className="user-top-row">
                          <span className="user-name">{user.name}</span>
                          {user.verified && (
                            <FaCheckCircle className="verified-icon" />
                          )}
                          {user.decency_rating !== null &&
                            user.decency_rating !== undefined && (
                              <div className="decency-label">
                                <span
                                  className={` ${
                                    user.decency_rating >= 8
                                      ? "star"
                                      : user.decency_rating >= 5
                                      ? "medium-rating"
                                      : "low-rating"
                                  }`}
                                >
                                  ★
                                </span>
                                <span
                                  className={` ${
                                    user.decency_rating >= 8
                                      ? "star-rating"
                                      : user.decency_rating >= 5
                                      ? "medium-number-rating"
                                      : "low-number-rating"
                                  }`}
                                >
                                  {user.decency_rating}
                                </span>
                              </div>
                            )}
                        </div>

                        <div className="user-bottom-row">
                          <span
                            className="country"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            {user.country &&
                              countryNameToCode[user.country] && (
                                <ReactCountryFlag
                                  countryCode={countryNameToCode[user.country]}
                                  svg
                                  style={{
                                    width: "1.5em",
                                    height: "1.5em",
                                    borderRadius: "3px",
                                  }}
                                  title={user.country}
                                />
                              )}
                            {user.country || "Hidden"}
                          </span>
                          {user.age && (
                            <span
                              className="user-age"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                marginLeft: "8px",
                                fontSize: "0.95em",
                              }}
                            >
                              {user.age}
                            </span>
                          )}

                          {user.gender === "male" ? (
                            <FaMars className="gender-icon male" />
                          ) : (
                            <FaVenus className="gender-icon female" />
                          )}
                          <span
                            className={`status-dot ${
                              user.status === "online" ? "online" : "offline"
                            }`}
                          >
                            <FaCircle />
                          </span>

                          <div className="spacer" />
                          <FaThumbtack
                            className={`pin-icon ${
                              user.pinned ? "pinned" : ""
                            }`}
                            onClick={(e) => {
                              handlePinToggle(e, user.id);
                              togglePin(user.id);
                            }}
                          />
                          <FaEnvelope
                            className="dm-envelope"
                            onClick={(e) =>
                              handleProtectedNavigation(
                                e,
                                `/chat/${user.id}`,
                                user
                              )
                            }
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                {hasMore && (
                  <div
                    ref={observerRef}
                    style={{
                      textAlign: "center",
                      margin: "20px 0",
                      paddingBottom: "1rem",
                    }}
                  >
                    {loadingMore && <MiniSpinner />}{" "}
                    {/* Use your custom spinner */}
                  </div>
                )}
              </>
            ) : (
              <div className="no-pinned-users">
                <img
                  src="https://cdn4.iconfinder.com/data/icons/essentials-72/24/031_-_Pin-64.png"
                  alt="No pinned users"
                  className="empty-state-image"
                  style={{
                    maxWidth: "300px",
                    margin: "2rem auto",
                    display: "block",
                  }}
                />
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "1.2rem",
                    color: "#555",
                  }}
                >
                  No pinned users yet. Start pinning to keep your favorites
                  close! 📌
                </p>
              </div>
            )}
          </div>

          {showAllTabs && (
            <div
              className="modal-backdrop"
              onClick={() => setShowAllTabs(false)}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="modal-title">🎛️ Filters</h3>

                <div className="modal-section">
                  <h4>Gender</h4>
                  <div className="btn-group">
                    {["all", "male", "female"].map((g) => (
                      <button
                        key={g}
                        className={`modal-btn ${
                          genderFilter === g ? "active" : ""
                        }`}
                        onClick={() => {
                          setGenderFilter(g);
                          setShowAllTabs(false);
                        }}
                      >
                        {g === "all"
                          ? "🌐 All Genders"
                          : g === "male"
                          ? "♂️ Male"
                          : "♀️ Female"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="modal-section">
                  <h4>Country</h4>
                  <div className="btn-group">
                    <button
                      className={`modal-btn ${
                        countryFilter === "all" ? "active" : ""
                      }`}
                      onClick={() => {
                        setCountryFilter("all");
                        setShowAllTabs(false);
                      }}
                    >
                      🌍 All Countries
                    </button>
                    {countries.map((c) => (
                      <button
                        key={c}
                        className={`modal-btn ${
                          countryFilter === c ? "active" : ""
                        }`}
                        onClick={() => {
                          setCountryFilter(c);
                          setShowAllTabs(false);
                        }}
                      >
                        {countryNameToCode[c] && (
                          <ReactCountryFlag
                            countryCode={countryNameToCode[c]}
                            svg
                            style={{
                              width: "1.2em",
                              height: "1.2em",
                              marginRight: "8px",
                            }}
                          />
                        )}
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {showPremiumNotice && (
        <div
          className="premium-modal-overlay"
          onClick={() => setShowPremiumNotice(false)}
        >
          <div
            className="premium-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="premium-modal-title">🌍 Premium Chat</h2>
            <p className="premium-modal-message">
              Pay to chat with premium country people.
            </p>
            <div className="premium-modal-buttons">
              <button
                className="premium-btn premium-pay-btn"
                onClick={() => {
                  setShowPremiumNotice(false);
                  handlePaypalRedirect();
                  // Replace this with actual payment logic
                }}
              >
                💰 Pay to Unlock
              </button>
              <button
                className="premium-btn premium-cancel-btn"
                onClick={() => setShowPremiumNotice(false)}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {alertMessage && (
        <SketchyAlert
          message={alertMessage.text}
          withButton={alertMessage.withButton}
          onClose={() => setAlertMessage(null)}
        />
      )}
      {showFeedback && <FeedbackPopup onSubmitSuccess={handleSubmitSuccess} />}
    </div>
  );
};

export default ChatList;
