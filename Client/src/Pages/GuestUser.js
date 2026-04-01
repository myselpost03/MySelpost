import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import '../Styles/ChatList.css';
import {
  FaCircle,
  FaMars,
  FaFire,
  FaVenus,
  FaTimes,
  FaEnvelope,
  FaSearch,
  FaMapMarkerAlt,
  FaFilter,
} from 'react-icons/fa';
import empty from '../Assets/empty.png';
import { supabase } from '../Utils/supabaseClient';
import LoadingSpinner from '../Components/LoadingSpinner';
import ReactCountryFlag from 'react-country-flag';
import SketchyAlert from '../Components/SketchyAlert';
import QuizPopup from '../Components/QuizPopup';
import WelcomePopup from '../Components/WelcomePopup';
import CommunityPopup from '../Components/CommunityPopup';
import DatingNavbar from '../Components/DatingNavbar';
import i18n from '../i18n';

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
  const [username, setUsername] = useState(
    'Anon' + Math.floor(Math.random() * 1000)
  );
  const [searchLoading, setSearchLoading] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false); // For Telegram (QuizPopup)

  const [alertMessage, setAlertMessage] = useState(null);

  const [page, setPage] = useState(0); // pagination page
  const [hasMore, setHasMore] = useState(true); // track if more users exist
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCommunityPopup, setShowCommunityPopup] = useState(false);

  const [tempUsername, setTempUsername] = useState('');
  const [showModal, setShowModal] = useState(true); // Show popup on entry

  const isTelegram =
    typeof window !== 'undefined' &&
    window.Telegram?.WebApp &&
    window.Telegram.WebApp.initData !== '';

  const handleActionClick = (e) => {
    if (e) e.stopPropagation();
    if (isTelegram) {
      // Trigger handleAlert logic (SketchyAlert)
      setAlertMessage({
        text: i18n.t('loginForChat'),
        withButton: true,
      });
    } else {
      // Trigger CommunityPopup
      setShowCommunityPopup(true);
    }
  };

  {
    /*useEffect(() => {
    // Check if the user has ever seen the welcome theme before
    const hasSeenWelcome = localStorage.getItem('welcomeThemeShown');

    if (!hasSeenWelcome) {
      // If not, show the popup and mark it as shown in localStorage
      setShowWelcome(true);
      localStorage.setItem('welcomeThemeShown', 'true');
    }
  }, []);

  // Handler to close the popup
  const handleCloseWelcome = () => {
    setShowWelcome(false);
  };*/
  }
  {
    /*
  useEffect(() => {
    const hasVisited = localStorage.getItem('quizShown');

    if (!hasVisited && isTelegram) {
      setIsQuizOpen(true);
      localStorage.setItem('quizShown', 'true');
    }
  }, []);*/
  }

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      // 1. Start the query
      let query = supabase
        .from('users')
        .select(
          'id, name, gender, age, country, status, decency_rating, profile_pic, google_login, created_at'
        )
        .neq('country', 'IN');

      // 2. ONLY fetch females if the active tab is 'all'
      if (activeTab === 'all') {
        query = query.eq('gender', 'female');
      } else if (activeTab === 'male') {
        query = query.eq('gender', 'male');
      }

      // 3. Apply sorting and pagination
      const { data, error } = await query
        .order('google_login', { ascending: true })
        .order('created_at', { ascending: false })
        .range(page * 10, page * 10 + 9);

      if (error) {
        console.error('Error fetching users:', error);
      } else {
        if (data.length < 10) setHasMore(false);

        setUsers((prev) => {
          // If we are on page 0, it means we switched tabs or refreshed.
          // We should replace the list, not add to it.
          if (page === 0) return data;

          const existingIds = new Set(prev.map((u) => u.id));
          const newUniqueUsers = data.filter((u) => !existingIds.has(u.id));
          return [...prev, ...newUniqueUsers];
        });
      }

      setLoading(false);
      setLoadingMore(false);
    };

    fetchUsers();
  }, [page, activeTab]); // <--- CRITICAL: Add activeTab here
  const handleNavigate = () => {
    navigate('/roast');
  };

  const handleAlert = () => {
    setAlertMessage({
      text: i18n.t('loginForChat'),
      withButton: true,
    });
    setShowPopup(true);
  };

  const filteredGuestUsers = useMemo(() => {
    return users.filter((user) => {
      // 1. Search filter (keep this)
      const nameMatch = user.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      if (!nameMatch) return false;

      // 2. Tab Logic Fix
      if (activeTab === 'all') {
        // If you want "All" to show ONLY females:
        return user.gender === 'female';
      }

      if (activeTab === 'male') {
        return user.gender === 'male';
      }

      if (activeTab === 'female') {
        return user.gender === 'female';
      }

      return true;
    });
  }, [users, activeTab, searchTerm]);

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
            <button className="search-button" onClick={handleActionClick}>
              <FaSearch />
            </button>
          </div>

          <div className="tab-bar">
            <button
              className={`sketchy-tab `}
              onClick={() => {
                navigate('/guest-profiles');
              }}
            >
              Guest Users
            </button>

            <button
              className={`sketchy-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('all');
                localStorage.setItem('activeTab', 'all');
              }}
            >
              Female
            </button>
            <button
              className={`sketchy-tab ${activeTab === 'male' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('male');
                localStorage.setItem('activeTab', 'male');
              }}
            >
              Male
            </button>
            {/* <button
              className={`sketchy-tab`}
              onClick={() => navigate('/chat-room')}
              style={{ position: 'relative' }}
            >
              Chat Room (No Login)
            </button>*/}

            <button
              className="sketchy-tab"
              onClick={() => {
                setShowGenderTabs(true);
                setShowCountryTabs(false);
                handleActionClick();
              }}
            >
              {i18n.t('inbox')}
            </button>
            {/* <button
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
              <FaFilter />
            </button>*/}
          </div>
          <div className="sketchy-list-scrollable">
            {filteredGuestUsers.length > 0 ? (
              <>
                {filteredGuestUsers.map((user) => (
                  <>
                    <div className="user-card" onClick={handleActionClick}>
                      <div className="user-avatar-wrapper">
                        <img
                          src={user.profile_pic || empty}
                          alt="avatar"
                          className="user-avatar"
                          onClick={handleActionClick}
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

                          <FaEnvelope
                            className="dm-envelope"
                            onClick={handleActionClick}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ))}
                {hasMore && (
                  <div style={{ textAlign: 'center', margin: '-10px 0' }}>
                    <button
                      className="sketchy-load-more"
                      onClick={handleActionClick}
                    >
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

      {/* <button onClick={handleNavigate} className="fab-roast-btn" title="Roast">
        <FaFire />
      </button>*/}
      {/*isQuizOpen && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.9)',
            zIndex: 10000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <QuizPopup onClose={() => setIsQuizOpen(false)} />
        </div>
      )*/}
      {/*showWelcome && <WelcomePopup onClose={handleCloseWelcome} />*/}
      {!isTelegram && (
        <CommunityPopup
          isOpen={showCommunityPopup}
          onClose={() => setShowCommunityPopup(false)}
        />
      )}
    </div>
  );
};

export default GuestUser;
