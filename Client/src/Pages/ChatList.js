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
  FaComments,
  FaSearch,
  FaFilter,
  FaMapMarkerAlt,
  FaHeart,
  FaBolt,
  FaUsers,
  FaEnvelopeOpenText,
  FaCheck,
  FaTimes,
  FaMagic,
} from "react-icons/fa";
import empty from "../Assets/empty.png";
import { supabase } from "../Utils/supabaseClient";
import useDebounce from "../Utils/useDebounce";
import ReactCountryFlag from "react-country-flag";
import MiniSpinner from "../Components/MiniSpinner";
import SketchyAlert from "../Components/SketchyAlert";
import { trackEvent } from "../Utils/analytics";
import { dbPromise } from "../Utils/db";
import LoadingSpinner from "../Components/LoadingSpinner";
import Maps from "../Components/Maps";
import i18n from "../i18n";

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
  const [shuffledUsers, setShuffledUsers] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ gender: "", age: "" });
  const [newUser, setNewUser] = useState(null);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "all";
  });
  const [clickedUserId, setClickedUserId] = useState(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true); // tab/filter loading
  const [hasFetched, setHasFetched] = useState(false); // 👈 new flag

  const [searchLoading, setSearchLoading] = useState(false); // dedicated search loader
  const [countries, setCountries] = useState([]);
  const [showPremiumNotice, setShowPremiumNotice] = useState(false);
  const [premiumTargetUser, setPremiumTargetUser] = useState(null);
  const [hasPaidPremium, setHasPaidPremium] = useState(false);
  const [page, setPage] = useState(0); // pagination page
  const [hasMore, setHasMore] = useState(true); // track if more users exist
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllTabs, setShowAllTabs] = useState(false);
  const [allFilter, setAllFilter] = useState("all"); // 'all' or 'online'
  const [alertMessage, setAlertMessage] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [badgeSeen, setBadgeSeen] = useState("true"); // assume no badge unless told otherwise
  const [inboxUserIds, setInboxUserIds] = useState(new Set());
  const [notificationCount, setNotificationCount] = useState(0);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const listRef = useRef(null);

  const observerRef = useRef();

  useEffect(() => {
    const fetchAndSetUser = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser?.id) {
        setNewUser(null);
        return;
      }

      // Fetch fresh user data from Supabase
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", storedUser.id)
        .single();

      if (error) {
        console.error("Failed to fetch user from DB:", error.message);
        setNewUser(null);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      setNewUser(data);
      const isMobile = window.innerWidth < 768;
      if ((!data.gender || !data.age) && isMobile) {
        setShowProfileModal(true);
      } else {
        setShowProfileModal(false);
      }
    };

    fetchAndSetUser();
  }, [navigate]);

  useEffect(() => {
    const fetchNotificationsCount = async () => {
      try {
        // --- Likes (unseen only) ---
        const { data: likes, error: likesErr } = await supabase
          .from("likes")
          .select("id")
          .eq("user_id", user.id)
          .eq("seen", false);

        if (likesErr) throw likesErr;
        // --- Total unseen count ---
        setNotificationCount(likes?.length || 0);
      } catch (err) {
        console.error("Error fetching notification count:", err);
      }
    };

    fetchNotificationsCount();
  }, [user.id]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    if (name === "age") {
      // allow only numbers
      if (!/^\d*$/.test(value)) return;

      // restrict to 2 digits
      if (value.length > 2) return;

      let num = parseInt(value, 10);

      // if user has typed 2 digits, enforce min/max
      if (value.length === 2 && !isNaN(num)) {
        if (num < 13) num = 13;
        if (num > 99) num = 99;
        setProfileForm((prev) => ({ ...prev, [name]: String(num) }));
        return;
      }
    }

    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async () => {
    setSubmitting(true);
    trackEvent({
      action: "button_click",
      category: "Home Page",
      label: "Submit Gender & Age Button",
    });
    if (!profileForm.gender || !profileForm.age) return;

    const { error } = await supabase
      .from("users")
      .update({
        gender: profileForm.gender,
        age: parseInt(profileForm.age),
      })
      .eq("id", user.id);

    if (!error) {
      const updatedUser = { ...user, ...profileForm };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setNewUser(updatedUser);
      setShowProfileModal(false);
      setDataChanged(true); // ✅ Trigger refetch
    } else {
      console.error("Update failed:", error.message);
    }
    setSubmitting(false); // ✅ Stop "Submitting..."
  };

  const handleClick = async () => {
    await handleProfileSubmit();
  };

  useEffect(() => {
    if (activeTab === "all") {
      setShuffledUsers((prev) => {
        // Shuffle the current `users` array
        const shuffled = [...users]
          .map((u) => ({ u, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ u }) => u);
        return shuffled;
      });
    }
  }, [activeTab]); // Runs only when activeTab changes

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
        //updateBadgeSeenStatus(countMap);

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

  const handleUserClick = async (clickedId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === clickedId ? { ...user, notifications: 0 } : user
      )
    );

    await supabase
      .from("users")
      .update({ active_route: "/chat/" })
      .eq("id", user.id);
  };

  const handleRouteUpdate = async () => {
    await supabase
      .from("users")
      .update({ active_route: "/chat/" })
      .eq("id", user.id);
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

  const getAutoPinnedIds = () => {
    return JSON.parse(localStorage.getItem("autoPinnedUsers") || "[]");
  };

  // Add a user to auto-pinned list with max limit of 10
  const addAutoPinnedId = (userId) => {
    let current = getAutoPinnedIds();
    if (!current.includes(userId)) {
      if (current.length < 10) {
        current.push(userId); // add if space available
      } else {
        // Replace last one with new user
        current[current.length - 1] = userId;
      }
      localStorage.setItem("autoPinnedUsers", JSON.stringify(current));
    }
  };

  const handleProtectedNavigation = (e, path, targetUser = null) => {
    e.preventDefault();
    const isLoggedIn = localStorage.getItem("user");

    if (isLoggedIn) {
      // Auto-pin this user
      addAutoPinnedId(targetUser.id);

      // console.log("Logged in user:", user);

      // 🚫 Restrict if non-US user (except Akriti) tries to chat with US user
      {
        /*const isNotUS = user.country !== "US";
      const isNotAkriti = user.name?.trim().toLowerCase() !== "akriti";
      const isTargetUS = targetUser?.country === "US";

      if (isNotUS && isNotAkriti && isTargetUS && !hasPaidPremium) {
        setPremiumTargetUser(targetUser);
        setShowPremiumNotice(true);
        return;
      }
*/
      }
      // --- Manage auto-pinned users ---
      const maxPinned = 10;
      const autoPinnedIds = JSON.parse(
        localStorage.getItem("autoPinnedUsers") || "[]"
      );

      // If user is not already pinned
      if (!autoPinnedIds.includes(targetUser.id)) {
        if (autoPinnedIds.length >= maxPinned) {
          // Remove the oldest (first) pinned user
          autoPinnedIds.shift();
        }
        autoPinnedIds.push(targetUser.id);
        localStorage.setItem("autoPinnedUsers", JSON.stringify(autoPinnedIds));
      }

      // Update local state so UI shows the pin immediately
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === targetUser.id ? { ...u, pinned: true } : u
        )
      );

      navigate(path, { state: { targetUser } });
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
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [dataChanged, setDataChanged] = useState(false); // ✅ Track if data changed
  const [submitting, setSubmitting] = useState(false); // ✅ Show "Submitting..."

  useEffect(() => {
    // Only trigger for tabs/filters, not search
    if (searchTerm.trim() === "") {
      setUsers([]);
      setPage(0);
      setHasMore(true);
      setLoading(true);
    }
  }, [activeTab, genderFilter, countryFilter]);

  // Fetch users with IndexedDB caching
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setHasFetched(false); // reset before fetch starts

      if (
        debouncedSearchTerm.trim().length > 0 &&
        debouncedSearchTerm.trim().length < 2
      ) {
        setUsers([]);
        setLoading(false);
        setLoadingMore(false);
        return;
      }
      if (searchTerm.trim() !== "") {
        setSearchLoading(true);
      }

      try {
        const db = await dbPromise;

        // Supabase query (same as your code)
        let query = supabase
          .from("users")
          .select(
            "id, name, profile_pic, country, gender, status, age, decency_rating, created_at"
          );

        if (activeTab === "all")
          query = query
            .neq("country", "IN")
            .order("created_at", { ascending: false });
        if (genderFilter !== "all") query = query.eq("gender", genderFilter);
        if (countryFilter !== "all") query = query.eq("country", countryFilter);
        if (activeTab === "online")
          query = query
            .eq("status", "online")
            .order("created_at", { ascending: false });
        if (searchTerm.trim() !== "")
          query = query.ilike("name", `%${searchTerm}%`);

        const { data: fetchedUsers, error } = await query;
        if (error) throw error;

        // Pinned users
        const { data: pinnedData } = await supabase
          .from("pinned_users")
          .select("pinned_user_id")
          .eq("user_id", user.id);

        const pinnedIds = pinnedData?.map((row) => row.pinned_user_id) || [];

        // Load cached blobs
        const cachedPics = await db.getAll("profile_pics");
        let cachedMap = new Map(cachedPics.map((item) => [item.id, item.blob]));

        // Detect missing blobs
        const missing = fetchedUsers.filter(
          (u) => u.profile_pic && !cachedMap.has(u.id)
        );

        if (missing.length > 0) {
          console.log(
            `🖼 Fetching ${missing.length} new profile pics in parallel...`
          );

          // Fetch all in parallel
          const downloads = await Promise.allSettled(
            missing.map(async (u) => {
              const res = await fetch(u.profile_pic);
              const blob = await res.blob();
              await db.put("profile_pics", { id: u.id, blob });
              return { id: u.id, blob };
            })
          );

          // Merge new blobs into cachedMap
          downloads.forEach((d) => {
            if (d.status === "fulfilled") {
              cachedMap.set(d.value.id, d.value.blob);
            }
          });
        }
        const autoPinnedIds = getAutoPinnedIds();

        // Build user list
        const processed = fetchedUsers.map((u) => {
          const blob = cachedMap.get(u.id);
          const avatar = blob ? URL.createObjectURL(blob) : empty;
          return {
            ...u,
            avatar,
            notifications: unreadCounts[u.id] || 0,
            pinned: pinnedIds.includes(u.id) || autoPinnedIds.includes(u.id), // ✅ include auto-pins

            status: u.status || "offline",
          };
        });

        setUsers(processed);
        setHasFetched(true); // ✅ only mark fetched after success

        console.log(`✅ Processed ${processed.length} users`);
      } catch (err) {
        console.error("⚠️ fetchUsers error:", err);
        setHasFetched(true); // mark as finished, even on error
      } finally {
        if (searchTerm.trim() !== "") setSearchLoading(false);
        else setLoading(false);
        setLoadingMore(false);
        setFirstLoad(false);
      }
    };

    fetchUsers();
  }, [activeTab, genderFilter, countryFilter]);

  // ------------------- filteredUsers logic -------------------
  const filteredUsers = useMemo(() => {
    let filtered = users.filter((user) => {
      const genderMatch =
        genderFilter === "all" || user.gender === genderFilter;
      const countryMatch =
        countryFilter === "all" || user.country === countryFilter;
      const searchMatch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const pinMatch =
        activeTab === "pinned"
          ? user.pinned
          : activeTab === "inbox"
          ? unreadCounts[user.id] > 0
          : !(unreadCounts[user.id] > 0);
      const onlineMatch =
        activeTab === "online" ? user.status === "online" : true;

      return (
        genderMatch && countryMatch && searchMatch && pinMatch && onlineMatch
      );
    });

    // Sort by unread, profile pic, verified/pinned
    filtered.sort((a, b) => {
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

    // All tab → round-robin per country, newest first
    if (activeTab === "all") {
      const countryGroups = filtered.reduce((acc, user) => {
        if (!acc[user.country]) acc[user.country] = [];
        acc[user.country].push(user);
        return acc;
      }, {});

      for (const country in countryGroups) {
        countryGroups[country].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      }

      let roundRobin = [];
      let index = 0;
      let added = true;
      while (added) {
        added = false;
        for (const country in countryGroups) {
          if (countryGroups[country][index]) {
            roundRobin.push(countryGroups[country][index]);
            added = true;
          }
        }
        index++;
      }
      filtered = roundRobin;
    }

    // Online tab → alternate genders
    if (activeTab === "online") {
      const females = filtered.filter((u) => u.gender === "female");
      const males = filtered.filter((u) => u.gender === "male");
      const others = filtered.filter(
        (u) => u.gender !== "female" && u.gender !== "male"
      );

      const alternated = [];
      let f = 0,
        m = 0;
      while (f < females.length || m < males.length) {
        if (f < females.length) alternated.push(females[f++]);
        if (m < males.length) alternated.push(males[m++]);
      }
      filtered = [...alternated, ...others];
    }

    const pageSize = 10;
    const end = (page + 1) * pageSize;
    return filtered.slice(0, end);
  }, [
    users,
    genderFilter,
    countryFilter,
    searchTerm,
    activeTab,
    unreadCounts,
    page,
  ]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (scrollTop + clientHeight >= scrollHeight - 50 && !loadingMore) {
      setLoadingMore(true);

      setTimeout(() => {
        setPage((prev) => prev + 1);
        setLoadingMore(false);
      }, 800); // simulate load delay
    }
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

        // Also update localStorage
        const autoPinned =
          JSON.parse(localStorage.getItem("autoPinnedUsers")) || [];
        localStorage.setItem(
          "autoPinnedUsers",
          JSON.stringify(autoPinned.filter((id) => id !== targetUserId))
        );
      } else {
        console.error("Error unpinning:", error.message);
      }
    } else {
      // Pin
      // 1. Get current pinned users count from Supabase
      const { data: currentPinned, error: fetchError } = await supabase
        .from("pinned_users")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true }); // oldest first

      if (fetchError) {
        console.error("Error fetching pinned users:", fetchError.message);
        return;
      }

      // 2. If already 10 pinned, remove the oldest one
      if (currentPinned.length >= 10) {
        const oldest = currentPinned[0];
        const { error: deleteError } = await supabase
          .from("pinned_users")
          .delete()
          .match({ user_id: user.id, pinned_user_id: oldest.pinned_user_id });

        if (deleteError) {
          console.error(
            "Error removing oldest pinned user:",
            deleteError.message
          );
          return;
        }
      }

      // 3. Insert new pinned user
      const { error: insertError } = await supabase
        .from("pinned_users")
        .insert([{ user_id: user.id, pinned_user_id: targetUserId }]);

      if (!insertError) {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === targetUserId ? { ...u, pinned: true } : u
          )
        );

        // Update localStorage
        const autoPinned =
          JSON.parse(localStorage.getItem("autoPinnedUsers")) || [];
        autoPinned.push(targetUserId);
        if (autoPinned.length > 10) autoPinned.shift();
        localStorage.setItem("autoPinnedUsers", JSON.stringify(autoPinned));
      } else {
        console.error("Error pinning:", insertError.message);
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
    setSearchLoading(true); // ✅ Show spinner only on button click

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
      setSearchLoading(false); // ✅ Hide spinner after search
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
        root: null, // viewport
        rootMargin: "100px", // start loading a bit earlier
        threshold: 0.1, // trigger when 10% visible
      }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
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
    //updateBadgeSeenStatus(updated);
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

  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent right-click menu
  };

  const formatCount = (num) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return num.toString();
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768); // Mobile breakpoint
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScratch = () => {
    navigate("/miss-scratch");
  };
  const handleFilterClick = () => {
    // Check notification permission
    if (Notification.permission === "granted") {
      setShowAllTabs(true);
    } else {
      // Show alert if permission not granted
      setAlertMessage({
        text: i18n.t("notificationPermission"),
      });
    }
  };

  const handleNotification = async () => {
    setNotificationCount(0); // reset UI immediately
    navigate("/notifications");
    // Mark all likes as seen
    await supabase
      .from("likes")
      .update({ seen: true })
      .eq("user_id", user.id)
      .eq("seen", false);

    // Mark all roasts as seen
    const { data: myImages } = await supabase
      .from("images")
      .select("id")
      .eq("user_id", user.id);

    if (myImages?.length > 0) {
      const imageIds = myImages.map((img) => img.id);
      await supabase
        .from("roasts")
        .update({ seen: true })
        .in("image_id", imageIds)
        .eq("seen", false);
    }
  };

  // 👉 searchLoading can be used inside your list UI
  {
    searchLoading && (
      <div className="flex justify-center py-4">
        <MiniSpinner /> {/* a subtle loader under search results */}
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="chatlist-container">
        <h2 className="chatlist-title">🖋️ Your Circles</h2>

        <>
          <div className="sketchy-search-wrapper">
            <div className="search-input-container">
              <input
                type="text"
                className="sketchy-search"
                placeholder={`🔍 ${i18n.t("searchUsers")}`}
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);

                  if (value.trim() === "") {
                    setPage(0);
                    setUsers([]);
                    setHasMore(true);
                    setActiveTab("all");
                    localStorage.setItem("activeTab", "all");
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit();
                  }
                }}
              />

              {/* Show cross icon inside input when there is text */}
              {searchTerm.trim() !== "" && (
                <button
                  className="clear-search-button"
                  onClick={async () => {
                    setSearchTerm(""); // clear input
                    setPage(0);
                    setHasMore(true);
                    setActiveTab("all");
                    localStorage.setItem("activeTab", "all");

                    setLoading(true); // ✅ show spinner while loading "All" tab

                    try {
                      const { data, error } = await supabase
                        .from("users")
                        .select(
                          "id, name, profile_pic, country, gender, status, age, decency_rating, created_at"
                        )
                        .order("created_at", { ascending: false });

                      if (error) throw error;

                      // Process users as usual
                      const processed = data.map((u) => ({
                        ...u,
                        avatar: u.profile_pic || empty,
                        notifications: unreadCounts[u.id] || 0,
                        pinned: false, // reset pinned if needed
                        status: u.status || "offline",
                      }));

                      setUsers(processed);
                    } catch (err) {
                      console.error("Error loading all users:", err);
                    } finally {
                      setLoading(false); // ✅ hide spinner
                    }
                  }}
                  title="Clear search"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Search icon outside input */}
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
              {i18n.t("all")}
            </button>
            <button
              className={`sketchy-tab ${
                activeTab === "pinned" ? "active" : ""
              }`}
              onClick={() => {
                setActiveTab("pinned");
                localStorage.setItem("activeTab", "pinned");
                handleRouteUpdate();
              }}
              style={{ position: "relative" }}
            >
              {i18n.t("chats")}
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
                handleRouteUpdate();
              }}
              style={{ position: "relative" }}
            >
              {i18n.t("inbox")}
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
              {i18n.t("online")}
            </button>

            <button
              className={`sketchy-tab ${activeTab === "maps" ? "active" : ""}`}
              onClick={() => {
                const newTab = activeTab === "maps" ? "all" : "maps";
                setActiveTab(newTab);
                setAllFilter(newTab === "maps" ? "maps" : "all");
                localStorage.setItem("activeTab", newTab);
              }}
            >
              <FaMapMarkerAlt style={{ marginRight: "6px" }} />
            </button>

            <button className="sketchy-tab" onClick={handleFilterClick}>
              <FaFilter style={{ marginRight: "6px" }} />
            </button>

            {activeTab === "all" && (
              <>
                <button
                  className="fab-camera-button"
                  onClick={handleScratch}
                  title="Open camera"
                >
                  <FaMagic />
                </button>

                {/* Filter FAB */}
                <button
                  className="fab-heart-button"
                  onClick={handleNotification}
                  title="Notification"
                >
                  <FaHeart />
                  {notificationCount > 0 && (
                    <span className="heart-fab-count">
                      {formatCount(notificationCount)}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>

          <div
            ref={listRef}
            onScroll={handleScroll}
            style={{ overflowY: "auto", height: "100vh" }}
            className={`${
              activeTab === "maps" ? "maps-active" : "sketchy-list-scrollable "
            }`}
          >
            {activeTab === "maps" ? (
              <Maps />
            ) : searchLoading || loading ? ( // ✅ show spinner if either search or tab is loading
              <LoadingSpinner />
            ) : filteredUsers.length > 0 ? (
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
                            onContextMenu={handleContextMenu}
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
                          {/*<FaThumbtack
                          className={`pin-icon ${user.pinned ? "pinned" : ""}`}
                          onClick={(e) => {
                            handlePinToggle(e, user.id);
                            togglePin(user.id);
                          }}
                        />*/}
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
            ) : hasFetched ? (
              <div className="no-results-card">
                {activeTab === "all" && (
                  <>
                    <FaUsers size={40} className="no-icon" />
                    <p className="no-title">{i18n.t("noUsers")}</p>
                  </>
                )}

                {activeTab === "pinned" && (
                  <>
                    <FaComments size={40} className="no-icon" />
                    <p className="no-title">{i18n.t("noChats")}</p>
                    <p className="no-sub">{i18n.t("inoxHistory")}</p>
                  </>
                )}

                {activeTab === "inbox" && (
                  <>
                    <FaEnvelopeOpenText size={40} className="no-icon" />
                    <p className="no-title">{i18n.t("inboxEmpty")}</p>
                    <p className="no-sub">{i18n.t("newMessages")}</p>
                  </>
                )}

                {activeTab === "online" && (
                  <>
                    <FaBolt size={40} className="no-icon" />
                    <p className="no-title">No one’s online</p>
                    <p className="no-sub">
                      Check back later or explore all users.
                    </p>
                    <button
                      onClick={() => setActiveTab("all")}
                      className="retry-btn"
                    >
                      🌍 View All Users
                    </button>
                  </>
                )}

                {activeTab === "maps" && <Maps />}
              </div>
            ) : null}
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
                <h3 className="modal-title">🎛️ {i18n.t("filters")}</h3>

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
                          ? `🌐 ${i18n.t("allGenders")}`
                          : g === "male"
                          ? `♂️ ${i18n.t("male")}`
                          : `♀️ ${i18n.t("female")}`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="modal-section">
                  <h4>{i18n.t("country")}</h4>
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
                      🌍 {i18n.t("allCountries")}
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
            buttons={["allow", "close"]}
            onClose={() => setAlertMessage(null)}
          />
        )}
        {showProfileModal && (
          <div className="popup-wrapper">
            <div className="popup-card">
              <h3 className="popup-title">{i18n.t("hey")}</h3>
              <p className="popup-text">{i18n.t("askAgeGender")}</p>

              <div className="option-row">
                <label className="option-box">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={profileForm.gender === "male"}
                    onChange={handleProfileChange}
                  />{" "}
                  {i18n.t("male")}
                </label>
                <label className="option-box">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={profileForm.gender === "female"}
                    onChange={handleProfileChange}
                  />{" "}
                  {i18n.t("Female")}
                </label>
              </div>

              <input
                type="number"
                className="input-field"
                placeholder={i18n.t("enterAge")}
                name="age"
                value={profileForm.age}
                onChange={handleProfileChange}
              />

              <button
                className={`submit-funky-btn ${
                  !profileForm.gender ||
                  !profileForm.age ||
                  parseInt(profileForm.age, 10) < 13 ||
                  parseInt(profileForm.age, 10) > 99
                    ? "disabled"
                    : ""
                }`}
                onClick={handleClick}
                disabled={
                  !profileForm.gender ||
                  !profileForm.age ||
                  parseInt(profileForm.age, 10) < 13 ||
                  parseInt(profileForm.age, 10) > 99
                }
              >
                {i18n.t("submit")}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatList;
