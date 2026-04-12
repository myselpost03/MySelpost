import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import '../Styles/ChatList.css';
import {
  FaCircle,
  FaMars,
  FaVenus,
  FaTimes,
  FaEnvelope,
  FaSearch,
} from 'react-icons/fa';
import empty from '../Assets/empty.png';
import { supabaseChat } from '../Utils/supabaseGroupChat';
import LoadingSpinner from '../Components/LoadingSpinner';
import ReactCountryFlag from 'react-country-flag';
import i18n from '../i18n';
import CommunityPopup from '../Components/CommunityPopup';

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

const countryList = {
  AF: 'Afghanistan',
  AL: 'Albania',
  DZ: 'Algeria',
  AD: 'Andorra',
  AO: 'Angola',
  AG: 'Antigua and Barbuda',
  AR: 'Argentina',
  AM: 'Armenia',
  AU: 'Australia',
  AT: 'Austria',
  AZ: 'Azerbaijan',
  BS: 'Bahamas',
  BH: 'Bahrain',
  BD: 'Bangladesh',
  BB: 'Barbados',
  BY: 'Belarus',
  BE: 'Belgium',
  BZ: 'Belize',
  BJ: 'Benin',
  BT: 'Bhutan',
  BO: 'Bolivia',
  BA: 'Bosnia and Herzegovina',
  BW: 'Botswana',
  BR: 'Brazil',
  BN: 'Brunei',
  BG: 'Bulgaria',
  BF: 'Burkina Faso',
  BI: 'Burundi',
  KH: 'Cambodia',
  CM: 'Cameroon',
  CA: 'Canada',
  CV: 'Cape Verde',
  CF: 'Central African Republic',
  TD: 'Chad',
  CL: 'Chile',
  CN: 'China',
  CO: 'Colombia',
  KM: 'Comoros',
  CG: 'Congo',
  CD: 'DR Congo',
  CR: 'Costa Rica',
  CI: 'Côte d’Ivoire',
  HR: 'Croatia',
  CU: 'Cuba',
  CY: 'Cyprus',
  CZ: 'Czech Republic',
  DK: 'Denmark',
  DJ: 'Djibouti',
  DM: 'Dominica',
  DO: 'Dominican Republic',
  EC: 'Ecuador',
  EG: 'Egypt',
  SV: 'El Salvador',
  GQ: 'Equatorial Guinea',
  ER: 'Eritrea',
  EE: 'Estonia',
  SZ: 'Eswatini',
  ET: 'Ethiopia',
  FJ: 'Fiji',
  FI: 'Finland',
  FR: 'France',
  GA: 'Gabon',
  GM: 'Gambia',
  GE: 'Georgia',
  DE: 'Germany',
  GH: 'Ghana',
  GR: 'Greece',
  GD: 'Grenada',
  GT: 'Guatemala',
  GN: 'Guinea',
  GW: 'Guinea-Bissau',
  GY: 'Guyana',
  HT: 'Haiti',
  HN: 'Honduras',
  HU: 'Hungary',
  IS: 'Iceland',
  IN: 'India',
  ID: 'Indonesia',
  IR: 'Iran',
  IQ: 'Iraq',
  IE: 'Ireland',
  IL: 'Israel',
  IT: 'Italy',
  JM: 'Jamaica',
  JP: 'Japan',
  JO: 'Jordan',
  KZ: 'Kazakhstan',
  KE: 'Kenya',
  KI: 'Kiribati',
  KP: 'North Korea',
  KR: 'South Korea',
  KW: 'Kuwait',
  KG: 'Kyrgyzstan',
  LA: 'Laos',
  LV: 'Latvia',
  LB: 'Lebanon',
  LS: 'Lesotho',
  LR: 'Liberia',
  LY: 'Libya',
  LI: 'Liechtenstein',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  MG: 'Madagascar',
  MW: 'Malawi',
  MY: 'Malaysia',
  MV: 'Maldives',
  ML: 'Mali',
  MT: 'Malta',
  MH: 'Marshall Islands',
  MR: 'Mauritania',
  MU: 'Mauritius',
  MX: 'Mexico',
  FM: 'Micronesia',
  MD: 'Moldova',
  MC: 'Monaco',
  MN: 'Mongolia',
  ME: 'Montenegro',
  MA: 'Morocco',
  MZ: 'Mozambique',
  MM: 'Myanmar',
  NA: 'Namibia',
  NR: 'Nauru',
  NP: 'Nepal',
  NL: 'Netherlands',
  NZ: 'New Zealand',
  NI: 'Nicaragua',
  NE: 'Niger',
  NG: 'Nigeria',
  MK: 'North Macedonia',
  NO: 'Norway',
  OM: 'Oman',
  PK: 'Pakistan',
  PW: 'Palau',
  PS: 'Palestine',
  PA: 'Panama',
  PG: 'Papua New Guinea',
  PY: 'Paraguay',
  PE: 'Peru',
  PH: 'Philippines',
  PL: 'Poland',
  PT: 'Portugal',
  QA: 'Qatar',
  RO: 'Romania',
  RU: 'Russia',
  RW: 'Rwanda',
  KN: 'Saint Kitts and Nevis',
  LC: 'Saint Lucia',
  VC: 'Saint Vincent and the Grenadines',
  WS: 'Samoa',
  SM: 'San Marino',
  ST: 'São Tomé and Príncipe',
  SA: 'Saudi Arabia',
  SN: 'Senegal',
  RS: 'Serbia',
  SC: 'Seychelles',
  SL: 'Sierra Leone',
  SG: 'Singapore',
  SK: 'Slovakia',
  SI: 'Slovenia',
  SB: 'Solomon Islands',
  SO: 'Somalia',
  ZA: 'South Africa',
  SS: 'South Sudan',
  ES: 'Spain',
  LK: 'Sri Lanka',
  SD: 'Sudan',
  SR: 'Suriname',
  SE: 'Sweden',
  CH: 'Switzerland',
  SY: 'Syria',
  TJ: 'Tajikistan',
  TZ: 'Tanzania',
  TH: 'Thailand',
  TL: 'Timor-Leste',
  TG: 'Togo',
  TO: 'Tonga',
  TT: 'Trinidad and Tobago',
  TN: 'Tunisia',
  TR: 'Turkey',
  TM: 'Turkmenistan',
  TV: 'Tuvalu',
  UG: 'Uganda',
  UA: 'Ukraine',
  AE: 'United Arab Emirates',
  GB: 'United Kingdom',
  US: 'United States',
  UY: 'Uruguay',
  UZ: 'Uzbekistan',
  VU: 'Vanuatu',
  VA: 'Vatican City',
  VE: 'Venezuela',
  VN: 'Vietnam',
  YE: 'Yemen',
  ZM: 'Zambia',
  ZW: 'Zimbabwe',
};

const GuestProfiles = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempGender, setTempGender] = useState('male');
  const [tempCountry, setTempCountry] = useState('IN');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'guest';
  });
  const [username, setUsername] = useState(
    'Anon' + Math.floor(Math.random() * 1000)
  );
  const [isJoining, setIsJoining] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false); // For Telegram (QuizPopup)

  const [page, setPage] = useState(0); // pagination page
  const [hasMore, setHasMore] = useState(true); // track if more users exist
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCommunityPopup, setShowCommunityPopup] = useState(false);
  const [tempAge, setTempAge] = useState('18');
  const [tempUsername, setTempUsername] = useState('');
  const [showModal, setShowModal] = useState(true); // Show popup on entry
  const [unreadCounts, setUnreadCounts] = useState({});
  const [latestMessageTime, setLatestMessageTime] = useState({});
  const [showLimitModal, setShowLimitModal] = useState(false);

  const [showVignette, setShowVignette] = useState(false);
  useEffect(() => {
    const savedGuest = JSON.parse(localStorage.getItem('guestUser'));
    if (!savedGuest) return;

    const fetchUnreadStatus = async () => {
      // Fetch all messages sent TO me that are still marked as 'sent'
      const { data, error } = await supabaseChat
        .from('chats')
        .select('sender_id, created_at')
        .eq('receiver_id', savedGuest.id)
        .eq('status', 'sent');

      if (!error && data) {
        // First build latestMsgTime properly
        const counts = {};
        const latestMsgTime = {};

        data.forEach((msg) => {
          counts[msg.sender_id] = (counts[msg.sender_id] || 0) + 1;

          if (
            !latestMsgTime[msg.sender_id] ||
            new Date(msg.created_at) > new Date(latestMsgTime[msg.sender_id])
          ) {
            latestMsgTime[msg.sender_id] = msg.created_at;
          }
        });

        setUnreadCounts(counts);
        setLatestMessageTime(latestMsgTime);

        // ✅ Fetch missing users ONCE and merge safely
        const missingIds = Object.keys(latestMsgTime);

        if (missingIds.length > 0) {
          const { data: newUsersData } = await supabaseChat
            .from('users')
            .select('*')
            .in('id', missingIds);

          if (newUsersData) {
            setUsers((prev) => {
              const existingIds = new Set(prev.map((u) => u.id));

              const uniqueNewUsers = newUsersData.filter(
                (u) => !existingIds.has(u.id)
              );

              return [...uniqueNewUsers, ...prev]; // add on top safely
            });
          }
        }
      }
    };

    fetchUnreadStatus();
    const interval = setInterval(() => fetchUnreadStatus(), 10000);
    return () => clearInterval(interval);
  }, []); // Only runs once on mount

  const isTelegram =
    typeof window !== 'undefined' &&
    window.Telegram?.WebApp &&
    window.Telegram.WebApp.initData !== '';

  const getRandomAvatar = (gender) => {
    const randomSeed = Math.floor(Math.random() * 10000);
    // Using DiceBear "Lorelei" for females and "Avataaars" for males
    if (gender === 'female') {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
    } else {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
    }
  };
  // 1. Updated Join Chat logic to store in Supabase
  const handleJoinChat = async (e) => {
    e.preventDefault();

    // 1. Prevent execution if already processing or name is empty
    if (isJoining) return;

    const trimmedName = tempUsername.trim();
    if (!trimmedName) return;

    // 2. Lock the function
    setIsJoining(true);
    const welcomeCoins = 0;
    const generatedProfilePic = getRandomAvatar(tempGender);

    try {
      const { data, error } = await supabaseChat
        .from('users')
        .insert([
          {
            name: trimmedName,
            gender: tempGender,
            country: tempCountry,
            age: parseInt(tempAge),
            status: 'online',
            profile_pic: generatedProfilePic,
            coins: welcomeCoins,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Insert Error:', error.message);
        // 3. Unlock if there is an error so they can try again
        setIsJoining(false);
        return;
      }

      if (data) {
        setUsername(trimmedName);
        localStorage.setItem('guestUser', JSON.stringify(data));

        // Update local state
        setUsers((prev) => [data, ...prev]);
        setShowModal(false);
        setActiveTab('guest');

        // Optional: No need to setIsJoining(false) here if the modal disappears
      }
    } catch (err) {
      console.error(err);
      setIsJoining(false); // 4. Unlock on catch
    }
  };

  // 2. Add this useEffect to prevent the modal from showing if they already "logged in"
  useEffect(() => {
    const savedGuest = localStorage.getItem('guestUser');
    if (savedGuest) {
      const parsed = JSON.parse(savedGuest);
      setUsername(parsed.name);
      setShowModal(false);
    }
  }, []);

  const handleActionClick = (e) => {
    if (e) e.stopPropagation();
  };

  useEffect(() => {
    // Check if the user has ever seen the welcome theme before
    const hasSeenWelcome = localStorage.getItem('welcomeThemeShown');

    if (!hasSeenWelcome) {
      // If not, show the popup and mark it as shown in localStorage
      setShowWelcome(true);
      localStorage.setItem('welcomeThemeShown', 'true');
    }
  }, []);

  // 1. Check if user is already logged in
  useEffect(() => {
    const savedGuest = localStorage.getItem('guestUser');
    if (savedGuest) {
      const parsed = JSON.parse(savedGuest);
      setUsername(parsed.name);
      setShowModal(false);
    } else {
      // 2. If NOT logged in, decide which popup to show first
      if (isTelegram) {
        const hasVisitedQuiz = localStorage.getItem('quizShown');
        if (!hasVisitedQuiz) {
          setIsQuizOpen(true);
          // showModal remains false for now
        } else {
          // Quiz was already seen in a past session, but user is not logged in
          setShowModal(true);
        }
      } else {
        // Not on Telegram, show guest modal immediately
        setShowModal(true);
      }
    }
  }, [isTelegram]);
  const fetchUsers = async () => {
    setLoading(true);
    const savedGuest = JSON.parse(localStorage.getItem('guestUser'));
    const userGender = savedGuest?.gender; // 'male' or 'female'
    // 1. Start the query
    let query = supabaseChat
      .from('users')
      .select('id, name, gender, age, coins, country, status,   created_at');
    if (savedGuest?.id) {
      query = query.neq('id', savedGuest.id);
    }
    if (activeTab === 'guest') {
      if (userGender === 'male') {
        // If I am male, show only females in the "Guest" tab
        query = query.eq('gender', 'female');
      } else if (userGender === 'female') {
        // If I am female, show only males in the "Guest" tab
        query = query.eq('gender', 'male');
      }
    } else if (activeTab === 'male') {
      query = query.eq('gender', 'male');
    } else if (activeTab === 'female') {
      query = query.eq('gender', 'female');
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
      const normalizedData = data.map((u) => ({
        ...u,
        coins: u.coins ?? 0, // If coins is null, set it to 0
      }));
      setUsers((prev) => {
        // If we are on page 0, it means we switched tabs or refreshed.
        // We should replace the list, not add to it.
        if (page === 0) return normalizedData;

        const existingIds = new Set(prev.map((u) => u.id));
        const newUniqueUsers = normalizedData.filter(
          (u) => !existingIds.has(u.id)
        );
        return [...prev, ...newUniqueUsers];
      });
    }

    setLoading(false);
    setLoadingMore(false);
  };
  useEffect(() => {
    fetchUsers();
  }, [page, activeTab]); // <--- CRITICAL: Add activeTab here

  const filteredGuestUsers = useMemo(() => {
    const savedGuest = JSON.parse(localStorage.getItem('guestUser'));
    const myGender = savedGuest?.gender;

    // 1. Filter the users first
    const filtered = users.filter((user) => {
      // Search filter
      const nameMatch = user.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      if (!nameMatch) return false;

      // Tab Logic
      if (activeTab === 'guest') {
        if (myGender === 'male') return user.gender === 'female';
        if (myGender === 'female') return user.gender === 'male';
      }
      return true;
    });

    // 2. Sort: Users with unread messages (unreadCounts[id] > 0) come first
    return [...filtered].sort((a, b) => {
      const unreadA = unreadCounts[a.id] || 0;
      const unreadB = unreadCounts[b.id] || 0;

      const timeA = latestMessageTime[a.id]
        ? new Date(latestMessageTime[a.id]).getTime()
        : 0;

      const timeB = latestMessageTime[b.id]
        ? new Date(latestMessageTime[b.id]).getTime()
        : 0;

      // 1. Users with unread messages first
      if (unreadA > 0 && unreadB === 0) return -1;
      if (unreadA === 0 && unreadB > 0) return 1;

      // 2. If both have unread → sort by latest message
      if (unreadA > 0 && unreadB > 0) {
        return timeB - timeA;
      }

      // 3. If no unread → fallback to created_at (optional)
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [users, activeTab, searchTerm, unreadCounts, latestMessageTime]); // Added unreadCounts as a dependency

  // Add this or update your existing handleUserClick
  const handleUserClick = (receiverId, receiverGender) => {
    const savedGuest = JSON.parse(localStorage.getItem('guestUser'));
    if (savedGuest && savedGuest.id === receiverId) {
      alert('You cannot chat with yourself!');
      return;
    }

    if (receiverGender === 'female') {
      const now = Date.now();
      const FIVE_HOURS = 5 * 60 * 60 * 1000;

      // Get the stored data (or default structure)
      const storedData = JSON.parse(
        localStorage.getItem('clickedFemalesData') ||
          '{"list": [], "lastReset": null}'
      );

      let { list, lastReset } = storedData;

      // Check if 5 hours have passed since the last reset
      if (!lastReset || now - lastReset > FIVE_HOURS) {
        list = [];
        lastReset = now;
      }

      // Check if this specific user is already in the list
      if (!list.includes(receiverId)) {
        if (list.length >= 5) {
          setShowLimitModal(true);
          return;
        }

        // Add new female ID to the list and save updated data
        list.push(receiverId);
        localStorage.setItem(
          'clickedFemalesData',
          JSON.stringify({ list, lastReset })
        );
      }
    }

    // Navigate to the chat page
    navigate(`/guest-chat/${receiverId}`);
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
      const { data, error } = await supabaseChat
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
  const handleLoadMore = (e) => {
    if (e) e.stopPropagation();
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      setPage((prevPage) => prevPage + 1);
    }
  };
  return (
    <div className="chatlist-container">
      <Header />
      {loading && page === 0 ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="sketchy-search-wrapper">
            <div className="search-input-container">
              <input
                type="text"
                className="sketchy-search"
                placeholder={`🔍 ${i18n.t('searchUsers')}`}
                value={searchTerm}
                onChange={(e) => {
                  // If not in Telegram, show popup and prevent typing/searching
                  if (!isTelegram) {
                    setShowCommunityPopup(true);
                    return;
                  }

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
                      const { data, error } = await supabaseChat
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
              className={`sketchy-tab  ${
                activeTab === 'guest' ? 'active' : ''
              } `}
              onClick={() => {
                setActiveTab('guest');
                localStorage.setItem('activeTab', 'guest');
              }}
            >
              Guest Users
            </button>
            <button
              className={`sketchy-tab`}
              onClick={() => navigate('/guest-user')}
            >
              All Users
            </button>
          </div>
          <div className="sketchy-list-scrollable">
            {filteredGuestUsers.length > 0 ? (
              <>
                {filteredGuestUsers.map((user) => (
                  <>
                    <div
                      className="user-card"
                      onClick={() => handleUserClick(user.id, user.gender)}
                    >
                      <div className="user-avatar-wrapper">
                        <img
                          src={
                            user.profile_pic ||
                            (user.gender === 'female'
                              ? `https://api.dicebear.com/7.x/lorelei/svg?seed=${user.name}`
                              : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`)
                          }
                          alt="avatar"
                          className="guest-profile-user-avatar"
                          onClick={handleActionClick}
                        />
                        {unreadCounts[user.id] > 0 && (
                          <span className="guest-profile-notification-badge">
                            {unreadCounts[user.id]}
                          </span>
                        )}
                      </div>

                      <div className="user-info">
                        <div className="user-top-row">
                          <span className="user-name">{user.name}</span>
                          {user.coins !== null && user.coins !== undefined && (
                            <div className="decency-label">
                              <span className="star">★</span>
                              <span className="star-rating">
                                {user.coins ?? 0}
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
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent double trigger
                              handleUserClick(user.id, user.gender);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ))}
                {hasMore && (
                  <div style={{ textAlign: 'center', margin: '10px 0 20px 0' }}>
                    <button
                      className="sketchy-load-more"
                      onClick={handleLoadMore} // Changed from handleActionClick
                      disabled={loadingMore} // Prevent double clicks
                    >
                      {loadingMore ? (
                        <span>⏳ {i18n.t('loading')}...</span>
                      ) : (
                        `🌀 ${i18n.t('loadMore')}`
                      )}
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

      {showModal && (
        <div className="chat-room-modal-overlay">
          <div className="chat-room-modal-content compact-modal">
            <h3>Join as Guest User</h3>
            <form onSubmit={handleJoinChat}>
              <input
                type="text"
                autoFocus
                className="modal-input"
                placeholder="What's your name?"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                required
              />

              <div className="modal-row">
                <select
                  value={tempGender}
                  onChange={(e) => setTempGender(e.target.value)}
                  className="modal-select"
                >
                  <option value="female">♀ Female</option>
                  <option value="male">♂ Male</option>
                </select>
                <select
                  value={tempAge}
                  onChange={(e) => setTempAge(e.target.value)}
                  className="modal-select"
                >
                  {[...Array(43)].map((_, i) => (
                    <option key={i} value={i + 18}>
                      {i + 18}
                    </option>
                  ))}
                </select>
                <select
                  value={tempCountry}
                  onChange={(e) => setTempCountry(e.target.value)}
                  className="modal-select"
                  style={{ width: '20px' }}
                >
                  {Object.entries(countryList).map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="modal-submit"
                disabled={isJoining} // Disable the button while processing
              >
                {isJoining ? 'Joining...' : 'Start Chatting'}
              </button>
            </form>
          </div>
        </div>
      )}
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
          <QuizPopup
            onClose={() => {
              setIsQuizOpen(false);
              localStorage.setItem('quizShown', 'true');

              // TRIGGER GUEST MODAL NOW
              const savedGuest = localStorage.getItem('guestUser');
              if (!savedGuest) {
                setShowModal(true);
              }
            }}
          />
        </div>
      )*/}
      {/*showVignette && (
        <AdVignette />
      )*/}
      {!isTelegram && (
        <CommunityPopup
          isOpen={showCommunityPopup}
          onClose={() => setShowCommunityPopup(false)}
        />
      )}
      {showLimitModal && (
        <div className="chat-room-modal-overlay telegram-popup-overlay">
          <div className="chat-room-modal-content telegram-popup-content">
            <div className="people-icon-wrapper">
              <svg viewBox="0 0 24 24" width="50" height="50" fill="#0088cc">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </div>
            <h3>Limit Reached!</h3>
            <p>The limit for free accounts is 5 chats every 5 hours.</p>

            <button className="telegram-btn">Okay</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestProfiles;
