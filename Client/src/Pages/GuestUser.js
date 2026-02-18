import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import '../Styles/ChatList.css';
import {
  FaCircle,
  FaMars,
  FaFire,
  FaVenus,
  FaEnvelope,
  FaThumbtack,
  FaMagic,
  FaSearch,
  FaMapMarkerAlt,
  FaFilter,
} from 'react-icons/fa';
import AdsterraBanner from "../Components/AdsterraBanner";
import empty from '../Assets/empty.png';
import { supabase } from '../Utils/supabaseClient';
import LoadingSpinner from '../Components/LoadingSpinner';
import ReactCountryFlag from 'react-country-flag';
import SketchyAlert from '../Components/SketchyAlert';
import i18n from '../i18n';
import Demo from './Demo';
import TermsPopup from '../Components/TermsPopup';
import AdVignette from '../Components/AdVignette';
import { FaTimes } from 'react-icons/fa';
const countryNameToCode = {
  AF: 'AF',
  AL: 'AL',
  DZ: 'DZ',
  AD: 'AD',
  AO: 'AO',
  AG: 'AG',
  AR: 'AR',
  AM: 'AM',
  AU: 'AU',
  AT: 'AT',
  AZ: 'AZ',
  BS: 'BS',
  BH: 'BH',
  BD: 'BD',
  BB: 'BB',
  BY: 'BY',
  BE: 'BE',
  BZ: 'BZ',
  BJ: 'BJ',
  BT: 'BT',
  BO: 'BO',
  BA: 'BA',
  BW: 'BW',
  BR: 'BR',
  BN: 'BN',
  BG: 'BG',
  BF: 'BF',
  BI: 'BI',
  CV: 'CV',
  KH: 'KH',
  CM: 'CM',
  CA: 'CA',
  CF: 'CF',
  TD: 'TD',
  CL: 'CL',
  CN: 'CN',
  CO: 'CO',
  KM: 'KM',
  CD: 'CD',
  CG: 'CG',
  CR: 'CR',
  CI: 'CI',
  HR: 'HR',
  CU: 'CU',
  CY: 'CY',
  CZ: 'CZ',
  DK: 'DK',
  DJ: 'DJ',
  DM: 'DM',
  DO: 'DO',
  EC: 'EC',
  EG: 'EG',
  SV: 'SV',
  GQ: 'GQ',
  ER: 'ER',
  EE: 'EE',
  SZ: 'SZ',
  ET: 'ET',
  FJ: 'FJ',
  FI: 'FI',
  FR: 'FR',
  GA: 'GA',
  GM: 'GM',
  GE: 'GE',
  DE: 'DE',
  GH: 'GH',
  GR: 'GR',
  GD: 'GD',
  GT: 'GT',
  GN: 'GN',
  GW: 'GW',
  GY: 'GY',
  HT: 'HT',
  HN: 'HN',
  HU: 'HU',
  IS: 'IS',
  IN: 'IN',
  ID: 'ID',
  IR: 'IR',
  IQ: 'IQ',
  IE: 'IE',
  IL: 'IL',
  IT: 'IT',
  JM: 'JM',
  JP: 'JP',
  JO: 'JO',
  KZ: 'KZ',
  KE: 'KE',
  KI: 'KI',
  KP: 'KP',
  KR: 'KR',
  KW: 'KW',
  KG: 'KG',
  LA: 'LA',
  LV: 'LV',
  LB: 'LB',
  LS: 'LS',
  LR: 'LR',
  LY: 'LY',
  LI: 'LI',
  LT: 'LT',
  LU: 'LU',
  MG: 'MG',
  MW: 'MW',
  MY: 'MY',
  MV: 'MV',
  ML: 'ML',
  MT: 'MT',
  MH: 'MH',
  MR: 'MR',
  MU: 'MU',
  MX: 'MX',
  FM: 'FM',
  MD: 'MD',
  MC: 'MC',
  MN: 'MN',
  ME: 'ME',
  MA: 'MA',
  MZ: 'MZ',
  MM: 'MM',
  NA: 'NA',
  NR: 'NR',
  NP: 'NP',
  NL: 'NL',
  NZ: 'NZ',
  NI: 'NI',
  NE: 'NE',
  NG: 'NG',
  MK: 'MK',
  NO: 'NO',
  OM: 'OM',
  PK: 'PK',
  PW: 'PW',
  PS: 'PS',
  PA: 'PA',
  PG: 'PG',
  PY: 'PY',
  PE: 'PE',
  PH: 'PH',
  PL: 'PL',
  PT: 'PT',
  QA: 'QA',
  RO: 'RO',
  RU: 'RU',
  RW: 'RW',
  KN: 'KN',
  LC: 'LC',
  VC: 'VC',
  WS: 'WS',
  SM: 'SM',
  ST: 'ST',
  SA: 'SA',
  SN: 'SN',
  RS: 'RS',
  SC: 'SC',
  SL: 'SL',
  SG: 'SG',
  SK: 'SK',
  SI: 'SI',
  SB: 'SB',
  SO: 'SO',
  ZA: 'ZA',
  SS: 'SS',
  ES: 'ES',
  LK: 'LK',
  SD: 'SD',
  SR: 'SR',
  SE: 'SE',
  CH: 'CH',
  SY: 'SY',
  TJ: 'TJ',
  TZ: 'TZ',
  TH: 'TH',
  TL: 'TL',
  TG: 'TG',
  TO: 'TO',
  TT: 'TT',
  TN: 'TN',
  TR: 'TR',
  TM: 'TM',
  TV: 'TV',
  UG: 'UG',
  UA: 'UA',
  AE: 'AE',
  GB: 'GB',
  US: 'US',
  UY: 'UY',
  UZ: 'UZ',
  VU: 'VU',
  VA: 'VA',
  VE: 'VE',
  VN: 'VN',
  YE: 'YE',
  ZM: 'ZM',
  ZW: 'ZW',
};

const GuestUser = () => {
  const [users, setUsers] = useState([]);
  const [genderFilter, setGenderFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showGenderTabs, setShowGenderTabs] = useState(false);
  const [showCountryTabs, setShowCountryTabs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'all';
  });
  const [searchLoading, setSearchLoading] = useState(false); // dedicated search loader

  const [alertMessage, setAlertMessage] = useState(null);
  const [showTerms, setShowTerms] = useState(false);

  const [page, setPage] = useState(0); // pagination page
  const [hasMore, setHasMore] = useState(true); // track if more users exist
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const handleNavigate = () => {
    navigate('/roast');
  };
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select(
          'id, name, gender, age, country, status, decency_rating, profile_pic, google_login, created_at'
        )
        .neq('country', 'IN')
        .order('google_login', { ascending: true }) // false (0) comes first, true (1) comes later
        .order('created_at', { ascending: false }) // newest first within each group
        .range(page * 10, page * 10 + 9);

      if (error) {
        console.error('Error fetching users:', error);
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
      text: i18n.t('loginForChat'),
      withButton: true,
    });
    setShowPopup(true);
  };
  const filteredGuestUsers = useMemo(() => {
    // Step 1: Filter based on gender, country, and search
    let filtered = users.filter((user) => {
      const genderMatch =
        genderFilter === 'all' || user.gender === genderFilter;
      const countryMatch =
        countryFilter === 'all' || user.country === countryFilter;
      const nameMatch = user.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return genderMatch && countryMatch && nameMatch;
    });

    // Step 2: SORT BY GENDER FIRST, then by newest first
    // Assuming gender values are 'female' and 'male'
    filtered.sort((a, b) => {
      // 1. Primary Sort: Gender (Female first)
      if (a.gender === 'female' && b.gender !== 'female') return -1;
      if (a.gender !== 'female' && b.gender === 'female') return 1;

      // 2. Secondary Sort: Newest first (created_at)
      return new Date(b.created_at) - new Date(a.created_at);
    });

    // Step 3: Show one user per country (round-robin style)
    // Note: This logic will naturally prioritize women because they
    // are now at the front of each country's array.
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

    // Final Step: If you want to strictly force ALL females to the top
    // regardless of the round-robin country mixing, sort one last time:
    roundRobin.sort((a, b) => {
      if (a.gender === 'female' && b.gender !== 'female') return -1;
      if (a.gender !== 'female' && b.gender === 'female') return 1;
      return 0;
    });

    const pageSize = 10;
    const end = (page + 1) * pageSize;

    return roundRobin.slice(0, end);
  }, [users, genderFilter, countryFilter, searchTerm, page]);
  const handleUserClick = () => {
    handleAlert();
  };



  const handleSearchSubmit = async () => {
    if (searchTerm.trim() === '') {
      setPage(0);
      setUsers([]);
      setHasMore(true);
      return;
    }
    setSearchLoading(true); // ✅ Show spinner only on button click

    try {
      const { data, error } = await supabase
        .from('users')
        .select(
          'id, name, profile_pic, country, gender, status, age, decency_rating'
        )
        .ilike('name', `%${searchTerm}%`);

      if (error) throw error;
    } catch (err) {
      console.error('Search error:', err.message);
    } finally {
      setLoading(false);
      setSearchLoading(false); // ✅ Hide spinner after search
    }
  };

  const handlePrivate = () => {
    navigate('/private');
  };

  return (
    <div className="chatlist-container">
      <Header />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
     
          {/* <div className="page-wrapper">
              <AdsterraBanner />
            {/*showBanner && (
              <div
                className="viewPrivate"
                onClick={handlePrivate}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <button
                  className="closeBadge"
                  onClick={() => setShowBanner(false)}
                >
                  &times;
                </button>

                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
                  alt="Instagram"
                  style={{ width: '25px', height: '25px' }}
                />
                <span>Private Account Viewer</span>
              </div>
            )
          </div>*/}
          <div className="sketchy-search-wrapper">
            <div className="search-input-container">
              <input
                type="text"
                className="sketchy-search"
                placeholder={`🔍 ${i18n.t('searchUsers')}`}
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);

                  if (value.trim() === '') {
                    setPage(0);
                    setUsers([]);
                    setHasMore(true);
                    setActiveTab('all');
                    localStorage.setItem('activeTab', 'all');
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit();
                  }
                }}
              />

              {/* Show cross icon inside input when there is text */}
              {searchTerm.trim() !== '' && (
                <button
                  className="clear-search-button"
                  onClick={async () => {
                    setSearchTerm(''); // clear input
                    setPage(0);
                    setHasMore(true);
                    setActiveTab('all');
                    localStorage.setItem('activeTab', 'all');

                    setLoading(true); // ✅ show spinner while loading "All" tab

                    try {
                      const { data, error } = await supabase
                        .from('users')
                        .select(
                          'id, name, profile_pic, country, gender, status, age, decency_rating, created_at'
                        )
                        .order('created_at', { ascending: false });

                      if (error) throw error;

                      // Process users as usual
                      const processed = data.map((u) => ({
                        ...u,
                        avatar: u.profile_pic || empty,
                        // notifications: unreadCounts[u.id] || 0,
                        pinned: false, // reset pinned if needed
                        status: u.status || 'offline',
                      }));

                      setUsers(processed);
                    } catch (err) {
                      console.error('Error loading all users:', err);
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
            <button className="search-button" onClick={handleUserClick}>
              <FaSearch />
            </button>
          </div>

          <div className="tab-bar">
            <button className={`sketchy-tab`}>{i18n.t('all')}</button>
            <button
              className={`sketchy-tab`}
              onClick={handleUserClick}
              style={{ position: 'relative' }}
            >
              {i18n.t('chats')}
            </button>

            <button
              className="sketchy-tab"
              onClick={() => {
                setShowGenderTabs(true);
                setShowCountryTabs(false);
                handleAlert();
              }}
            >
              {i18n.t('inbox')}
            </button>
            <button
              className="sketchy-tab"
              onClick={() => {
                setShowCountryTabs(true);
                setShowGenderTabs(false);
                handleAlert();
              }}
            >
              {i18n.t('online')}
            </button>
            <button
              className="sketchy-tab"
              onClick={() => {
                setShowCountryTabs(true);
                setShowGenderTabs(false);
                handleAlert();
              }}
            >
              <FaMapMarkerAlt />
            </button>

            <button
              className="sketchy-tab"
              onClick={() => {
                setShowCountryTabs(true);
                setShowGenderTabs(false);
                handleAlert();
              }}
            >
              <FaFilter />
            </button>
          </div>
          <div className="sketchy-list-scrollable">
            {filteredGuestUsers.length > 0 ? (
              <>
                {filteredGuestUsers.map((user) => (
                  <>
                    <div className="user-card" onClick={handleUserClick}>
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
                                      ? 'star'
                                      : user.decency_rating >= 5
                                      ? 'medium-rating'
                                      : 'low-rating'
                                  }`}
                                >
                                  ★
                                </span>
                                <span
                                  className={` ${
                                    user.decency_rating >= 8
                                      ? 'star-rating'
                                      : user.decency_rating >= 5
                                      ? 'medium-number-rating'
                                      : 'low-number-rating'
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
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            {user.country &&
                              countryNameToCode[user.country] && (
                                <ReactCountryFlag
                                  countryCode={countryNameToCode[user.country]}
                                  svg
                                  style={{
                                    width: '1.5em',
                                    height: '1.5em',
                                    borderRadius: '3px',
                                  }}
                                  title={user.country}
                                />
                              )}
                            {user.country || 'Hidden'}
                          </span>
                          {user.age && (
                            <span
                              className="user-age"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                marginLeft: '8px',
                                fontSize: '0.95em',
                              }}
                            >
                              {user.age}
                            </span>
                          )}

                          {user.gender === 'male' ? (
                            <FaMars className="gender-icon male" />
                          ) : (
                            <FaVenus className="gender-icon female" />
                          )}
                          <span
                            className={`status-dot ${
                              user.status === 'online' ? 'online' : 'offline'
                            }`}
                          >
                            <FaCircle />
                          </span>

                          {/* <div className="spacer" />
                          <FaThumbtack
                            className={`pin-icon ${
                              user.pinned ? "pinned" : ""
                            }`}
                            onClick={handleAlert}
                          />*/}
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
                  <div style={{ textAlign: 'center', margin: '-10px 0' }}>
                    <button className="sketchy-load-more" onClick={handleAlert}>
                      {loadingMore ? 'Loading...' : `🌀 ${i18n.t('loadMore')} `}
                    </button>
                  </div>
                )}
                <div className="policy-links">
                  <Link
                    to="/about"
                    style={{ textDecoration: 'none' }}
                    className="policy-link"
                  >
                    {i18n.t('about')}
                  </Link>{' '}
                  ·{' '}
                  <Link
                    to="/privacy-policy"
                    style={{ textDecoration: 'none' }}
                    className="policy-link"
                  >
                    {i18n.t('privacy')}
                  </Link>{' '}
                  ·{' '}
                  <Link
                    to="/terms"
                    style={{ textDecoration: 'none' }}
                    className="policy-link"
                  >
                    {i18n.t('terms')}
                  </Link>{' '}
                  ·{' '}
                  <Link
                    to="/contact-us"
                    style={{ textDecoration: 'none' }}
                    className="policy-link"
                  >
                    {i18n.t('contact')}
                  </Link>
                </div>
              </>
            ) : (
              <div></div>
            )}
          </div>
        </>
      )}
      {alertMessage && (
        <SketchyAlert
          message="You have to log in to access this feature."
          withButton={alertMessage.withButton}
          onClose={() => setAlertMessage(null)}
        />
      )}
      {/*
        <Demo 
        isOpen={showPopup} 
        onClose={() => setShowPopup(false)} 
      />
     */}
      <button onClick={handleNavigate} className="fab-roast-btn" title="Roast">
        <FaFire />
      </button>
      {/*showTerms && <TermsPopup onDone={handleTermsDone} />*/}
    </div>
  );
};

export default GuestUser;
