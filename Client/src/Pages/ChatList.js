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
} from "react-icons/fa";
import empty from "../Assets/empty.png";
import { supabase } from "../Utils/supabaseClient";
import LoadingIndicator from "../Components/LoadingIndicator";
import ReactCountryFlag from "react-country-flag";

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
  const [activeTab, setActiveTab] = useState("all");
  const [showGenderTabs, setShowGenderTabs] = useState(false);
  const [showCountryTabs, setShowCountryTabs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [showPremiumNotice, setShowPremiumNotice] = useState(false);
  const [premiumTargetUser, setPremiumTargetUser] = useState(null);
  const [hasPaidPremium, setHasPaidPremium] = useState(false);
  const [page, setPage] = useState(0); // pagination page
  const [hasMore, setHasMore] = useState(true); // track if more users exist
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [unreadCounts, setUnreadCounts] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));

  const listRef = useRef(null);

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

    fetchUnreadCounts();
    const interval = setInterval(fetchUnreadCounts, 3000);
    return () => clearInterval(interval);
  }, [user.id]);

  const handleUserClick = (clickedId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === clickedId ? { ...user, notifications: 0 } : user
      )
    );
  };

  useEffect(() => {
    if (users.length > 0) {
      const uniqueCountries = [...new Set(users.map((u) => u.country))];
      setCountries(uniqueCountries);
    }
  }, [users]);

  // 1️⃣ Pagination or manual load
  useEffect(() => {
    const fetchUsers = async () => {
      if (page === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const limit = 10;
      const offset = page * limit;
      const { data: allUsers, error } = await supabase
        .from("users")
        .select(
          "id, name, profile_pic, country, gender, status, age, decency_rating"
        )
        .range(offset, offset + limit - 1); // only 10 items

      // Get pinned IDs
      let pinnedIds = [];
      if (user) {
        const { data: pinnedData, error: pinnedError } = await supabase
          .from("pinned_users")
          .select("pinned_user_id")
          .eq("user_id", user.id);
        if (!pinnedError && pinnedData) {
          pinnedIds = pinnedData.map((row) => row.pinned_user_id);
        }
      }

      if (!error && allUsers) {
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

        if (activeTab === "pinned") {
          const totalPinnedUsers = processed.filter((u) => u.pinned).length;
          if (totalPinnedUsers < limit) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        } else {
          if (allUsers.length < limit) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        }
      }

      setLoading(false);
      setLoadingMore(false);
    };

    fetchUsers();
  }, [page]);

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
        const pinMatch = activeTab === "pinned" ? user.pinned : true;
        return genderMatch && countryMatch && searchMatch && pinMatch;
      })
      .sort((a, b) => {
        const aCount = unreadCounts[a.id] || 0;
        const bCount = unreadCounts[b.id] || 0;
        if (bCount !== aCount) return bCount - aCount;

        if (a.status === "online" && b.status !== "online") return -1;
        if (a.status !== "online" && b.status === "online") return 1;

        const aHasPic = a.profile_pic ? 1 : 0;
        const bHasPic = b.profile_pic ? 1 : 0;
        if (bHasPic !== aHasPic) return bHasPic - aHasPic;

        const getPriority = (u) => {
          if (u.verified && u.pinned) return 4000;
          if (u.verified) return 3000;
          if (u.pinned) return 2000;
          return 1000;
        };

        return getPriority(b) - getPriority(a);
      });
  }, [users, genderFilter, countryFilter, searchTerm, activeTab, unreadCounts]);

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

  useEffect(() => {
    const controller = new AbortController();
    const delayDebounce = setTimeout(() => {
      const fetchSearchResults = async () => {
        if (searchTerm.trim() === "") return;

        setLoading(true); // Set loading true immediately

        try {
          const { data, error } = await supabase
            .from("users")
            .select(
              "id, name, profile_pic, country, gender, status, age, decency_rating"
            )
            .ilike("name", `%${searchTerm}%`)
            .abortSignal(controller.signal);

          if (error) throw error;

          const pinnedData = await supabase
            .from("pinned_users")
            .select("pinned_user_id")
            .eq("user_id", user.id);

          const pinnedIds =
            pinnedData.data?.map((row) => row.pinned_user_id) || [];

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
          setHasMore(false);
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error("Search error:", err);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchSearchResults();
    }, 500);

    return () => {
      clearTimeout(delayDebounce);
      controller.abort(); // cancel previous fetch if user types again
    };
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setPage(0);
      setUsers([]);
      setHasMore(true);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setPage(0); // reset pagination
      setUsers([]);
      setHasMore(true);

      // Trigger re-fetch of initial user list
      const fetchInitialUsers = async () => {
        setLoading(true);
        const limit = 10;
        const offset = 0;
        const { data: allUsers, error } = await supabase
          .from("users")
          .select(
            "id, name, profile_pic, country, gender, status, age, decency_rating"
          )
          .range(offset, offset + limit - 1);

        if (!error && allUsers) {
          const { data: pinnedData } = await supabase
            .from("pinned_users")
            .select("pinned_user_id")
            .eq("user_id", user.id);

          const pinnedIds = pinnedData?.map((row) => row.pinned_user_id) || [];

          const processed = allUsers
            .filter((u) => u.id !== user.id)
            .map((user) => ({
              ...user,
              avatar: user.profile_pic || empty,
              notifications: user.notifications || 0,
              pinned: pinnedIds.includes(user.id),
              status: user.status || "offline",
            }));

          setUsers(processed);
          if (allUsers.length < limit) {
            setHasMore(false);
          }
        }

        setLoading(false);
      };

      fetchInitialUsers();
    }
  }, [searchTerm]);

  useEffect(() => {
    if (activeTab === "all" && users.length === 0 && !loading) {
      setPage(0);
      setHasMore(true);
      const fetchInitialUsers = async () => {
        setLoading(true);
        const limit = 10;
        const offset = 0;
        const { data: allUsers, error } = await supabase
          .from("users")
          .select(
            "id, name, profile_pic, country, gender, status, age, decency_rating"
          )
          .range(offset, offset + limit - 1);

        if (!error && allUsers) {
          const { data: pinnedData } = await supabase
            .from("pinned_users")
            .select("pinned_user_id")
            .eq("user_id", user.id);

          const pinnedIds = pinnedData?.map((row) => row.pinned_user_id) || [];

          const processed = allUsers
            .filter((u) => u.id !== user.id)
            .map((user) => ({
              ...user,
              avatar: user.profile_pic || empty,
              notifications: user.notifications || 0,
              pinned: pinnedIds.includes(user.id),
              status: user.status || "offline",
            }));

          setUsers(processed);
          if (allUsers.length < limit) setHasMore(false);
        }

        setLoading(false);
      };

      fetchInitialUsers();
    }
  }, [activeTab, users, loading]);

  const handlePinToggle = (e, userId) => {
  e.preventDefault(); // Stop navigation
  e.stopPropagation(); // Prevent click bubbling

  setUsers((prevUsers) =>
    prevUsers.map((user) =>
      user.id === userId ? { ...user, pinned: !user.pinned } : user
    )
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
            />
          </div>

          <div className="tab-bar">
            <button
              className={`sketchy-tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button
              className={`sketchy-tab ${
                activeTab === "pinned" ? "active" : ""
              }`}
              onClick={() => setActiveTab("pinned")}
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
                    padding: "2px 6px",
                    borderRadius: "12px",
                  }}
                >
                  !
                </span>
              )}
            </button>

            <button
              className="sketchy-tab"
              onClick={() => {
                setShowGenderTabs(true);
                setShowCountryTabs(false);
              }}
            >
              Gender ▼
            </button>
            <button
              className="sketchy-tab"
              onClick={() => {
                setShowCountryTabs(true);
                setShowGenderTabs(false);
              }}
            >
              Country ▼
            </button>
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
                          {user.decency_rating && (
                            <div className="decency-label">
                              <span className="star">★</span>
                              <span className="rating">
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
                                  onClick={(e) => handlePinToggle(e, user.id)}

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
                  <div style={{ textAlign: "center", margin: "-10px 0" }}>
                    <button
                      className="sketchy-load-more"
                      onClick={() => {
                        setLoadingMore(true);
                        setPage((prev) => prev + 1);
                      }}
                      disabled={loadingMore}
                    >
                      {loadingMore ? "Loading..." : "🌀 Load More"}
                    </button>
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

          {/* Modal for Gender Filter */}
          {showGenderTabs && (
            <div
              className="modal-backdrop"
              onClick={() => setShowGenderTabs(false)}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <h3>Choose Gender</h3>
                <button
                  className={`modal-btn ${
                    genderFilter === "all" ? "active" : ""
                  }`}
                  onClick={() => {
                    setGenderFilter("all");
                    setShowGenderTabs(false);
                  }}
                >
                  All Genders
                </button>
                <button
                  className={`modal-btn ${
                    genderFilter === "male" ? "active" : ""
                  }`}
                  onClick={() => {
                    setGenderFilter("male");
                    setShowGenderTabs(false);
                  }}
                >
                  ♂️ Male
                </button>
                <button
                  className={`modal-btn ${
                    genderFilter === "female" ? "active" : ""
                  }`}
                  onClick={() => {
                    setGenderFilter("female");
                    setShowGenderTabs(false);
                  }}
                >
                  ♀️ Female
                </button>
              </div>
            </div>
          )}

          {/* Modal for Country Filter */}
          {showCountryTabs && (
            <div
              className="modal-backdrop"
              onClick={() => setShowCountryTabs(false)}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <h3>Choose Country</h3>
                <button
                  className={`modal-btn ${
                    countryFilter === "all" ? "active" : ""
                  }`}
                  onClick={() => {
                    setCountryFilter("all");
                    setShowCountryTabs(false);
                  }}
                >
                  All Countries
                </button>
                {countries.map((country, i) => (
                  <button
                    key={i}
                    className={`modal-btn ${
                      countryFilter === country ? "active" : ""
                    }`}
                    onClick={() => {
                      setCountryFilter(country);
                      setShowCountryTabs(false);
                    }}
                  >
                    {country}{" "}
                    {countryNameToCode[country] && (
                      <ReactCountryFlag
                        countryCode={countryNameToCode[country]}
                        svg
                      />
                    )}
                  </button>
                ))}
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
    </div>
  );
};

export default ChatList;
