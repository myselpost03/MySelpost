import React, { useState, useMemo, useEffect } from "react";
import Header from "../Components/Header";
import "../Styles/ChatList.css";
import {
  FaCircle,
  FaMars,
  FaVenus,
  FaEnvelope,
  FaThumbtack,
  FaSearch,
} from "react-icons/fa";
import empty from "../Assets/empty.png";
import { supabase } from "../Utils/supabaseClient";
import LoadingSpinner from "../Components/LoadingSpinner";
import ReactCountryFlag from "react-country-flag";
import SketchyAlert from "../Components/SketchyAlert";

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

const GuestUser = () => {
  const [users, setUsers] = useState([]);
  const [genderFilter, setGenderFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showGenderTabs, setShowGenderTabs] = useState(false);
  const [showCountryTabs, setShowCountryTabs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);

  const [page, setPage] = useState(0); // pagination page
  const [hasMore, setHasMore] = useState(true); // track if more users exist
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select(
          "id, name, gender, age, country, status, decency_rating, profile_pic"
        )
        .neq("country", "IN")
              
        .order("created_at", { ascending: false })
        .range(page * 10, page * 10 + 9); // Pagination: 10 users per page

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        if (data.length < 10) {
          setHasMore(false); // No more data to load
        }
        setUsers((prev) => {
          const existingIds = new Set(prev.map((u) => u.id)); // assuming each user has a unique `id`
          const newUniqueUsers = data.filter((u) => !existingIds.has(u.id));
          return [...prev, ...newUniqueUsers];
        });
      }

      setLoading(false);
      setLoadingMore(false);
    };

    fetchUsers();
  }, [page]);

  const handleAlert = () => {
    setAlertMessage({
      text: "You have to log in to access the chat & other features.",
      withButton: true,
    });
  };
const filteredGuestUsers = useMemo(() => {
  // Step 1: Filter based on gender, country, and search
  let filtered = users.filter((user) => {
    const genderMatch = genderFilter === "all" || user.gender === genderFilter;
    const countryMatch = countryFilter === "all" || user.country === countryFilter;
    const nameMatch = user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return genderMatch && countryMatch && nameMatch;
  });

  // Step 2: Sort by newest first
  filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Step 3: Show one user per country (round-robin style)
  const countryGroups = filtered.reduce((acc, user) => {
    if (!acc[user.country]) acc[user.country] = [];
    acc[user.country].push(user);
    return acc;
  }, {});

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

  // Optional: limit number of users per page
  const pageSize = 10;
  const end = (page + 1) * pageSize;

  return roundRobin.slice(0, end);
}, [users, genderFilter, countryFilter, searchTerm, page]);


  return (
    <div className="chatlist-container">
      <Header />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="sketchy-search-wrapper">
            <input
              type="text"
              className="sketchy-search"
              placeholder="🔍 Search users..."
              value={searchTerm}
              onChange={(e) => {
                handleAlert();
              }}
            />
            <button className="search-button" onClick={handleAlert}>
              <FaSearch />
            </button>
          </div>
          <div className="tab-bar">
            <button className={`sketchy-tab`}>All</button>
            <button
              className={`sketchy-tab`}
              onClick={handleAlert}
              style={{ position: "relative" }}
            >
              📌 Pinned
            </button>

            <button
              className="sketchy-tab"
              onClick={() => {
                setShowGenderTabs(true);
                setShowCountryTabs(false);
                handleAlert();
              }}
            >
              Gender ▼
            </button>
            <button
              className="sketchy-tab"
              onClick={() => {
                setShowCountryTabs(true);
                setShowGenderTabs(false);
                handleAlert();
              }}
            >
              Country ▼
            </button>
          </div>
          <div className="sketchy-list-scrollable">
            {filteredGuestUsers.length > 0 ? (
              <>
                {filteredGuestUsers.map((user) => (
                  <>
                    <div className="user-card" onClick={handleAlert}>
                      <div className="user-avatar-wrapper">
                        <img
                          src={user.profile_pic || empty}
                          alt="avatar"
                          className="user-avatar"
                          onClick={handleAlert}
                        />
                      </div>

                      <div className="user-info">
                        <div className="user-top-row">
                          <span className="user-name">{user.name}</span>
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
                            onClick={handleAlert}
                          />
                          <FaEnvelope
                            className="dm-envelope"
                            onClick={handleAlert}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ))}
                {hasMore && (
                  <div style={{ textAlign: "center", margin: "-10px 0" }}>
                    <button className="sketchy-load-more" onClick={handleAlert}>
                      {loadingMore ? "Loading..." : "🌀 Load More"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div></div>
            )}
          </div>
        </>
      )}
      {alertMessage && (
        <SketchyAlert
          message={alertMessage.text}
          withButton={alertMessage.withButton}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </div>
  );
};

export default GuestUser;
