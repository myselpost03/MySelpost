import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import '../Styles/ChatList.css';
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
} from 'react-icons/fa';
import empty from '../Assets/empty.png';
import { supabase } from '../Utils/supabaseClient';
import useDebounce from '../Utils/useDebounce';
import ReactCountryFlag from 'react-country-flag';
import MiniSpinner from '../Components/MiniSpinner';
import SketchyAlert from '../Components/SketchyAlert';
import { trackEvent } from '../Utils/analytics';
import { dbPromise } from '../Utils/db';
import LoadingSpinner from '../Components/LoadingSpinner';
import Maps from '../Components/Maps';
import toast, { Toaster } from 'react-hot-toast';
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

const ChatList = () => {
  const [users, setUsers] = useState([]);
  const [genderFilter, setGenderFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [shuffledUsers, setShuffledUsers] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ gender: '', age: '' });
  const [newUser, setNewUser] = useState(null);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'all';
  });
  const [clickedUserId, setClickedUserId] = useState(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const [loading, setLoading] = useState(true); // tab/filter loading
  const [hasFetched, setHasFetched] = useState(false); // 👈 new flag
  const [searchLoading, setSearchLoading] = useState(false); // dedicated search loader
  const [countries, setCountries] = useState([]);
  const [hasPaidPremium, setHasPaidPremium] = useState(false);
  const [page, setPage] = useState(0); // pagination page
  const [hasMore, setHasMore] = useState(true); // track if more users exist
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllTabs, setShowAllTabs] = useState(false);
  const [allFilter, setAllFilter] = useState('all'); // 'all' or 'online'
  const [alertMessage, setAlertMessage] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [badgeSeen, setBadgeSeen] = useState('true'); // assume no badge unless told otherwise
  const [inboxUserIds, setInboxUserIds] = useState(new Set());
  const [notificationCount, setNotificationCount] = useState(0);

  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const listRef = useRef(null);

  const observerRef = useRef();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [dataChanged, setDataChanged] = useState(false); // ✅ Track if data changed
  const [submitting, setSubmitting] = useState(false); // ✅ Show "Submitting..."

  const isForeignerChat = (targetUser) => {
    if (!user?.country || !targetUser?.country) return false;
    return user.country !== targetUser.country;
  };
  const [pushAllowed, setPushAllowed] = useState(false);
  const [showPushPrompt, setShowPushPrompt] = useState(false);
  const [pushStatus, setPushStatus] = useState('idle');
  // idle | requesting | granted | denied

  useEffect(() => {
    let isMounted = true;

    const fetchAndSetUser = async () => {
      const storedUserRaw = localStorage.getItem('user');
      if (!storedUserRaw) {
        setNewUser(null);
        return;
      }

      const storedUser = JSON.parse(storedUserRaw);
      if (!storedUser?.id) {
        setNewUser(null);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', storedUser.id)
        .single();

      // 1. Prevent state updates if the component unmounted or effect re-ran
      if (!isMounted) return;

      if (error) {
        console.error('Failed to fetch user from DB:', error.message);
        setNewUser(null);
        return;
      }

      if (data) {
        localStorage.setItem('user', JSON.stringify(data));
        setNewUser(data);

        // 2. Clean up logic: Boolean coercion is faster and cleaner
        const isMobile = window.innerWidth < 768;
        const needsProfileUpdate = (!data.gender || !data.age) && isMobile;
        setShowProfileModal(needsProfileUpdate);
      }
    };

    fetchAndSetUser();

    return () => {
      isMounted = false; // Cleanup to prevent memory leaks/race conditions
    };
    // 4. Dependency check: Ensure 'navigate' is actually needed here.
    // If this should only run on mount, use an empty array [].
  }, [navigate]);

  useEffect(() => {
    // Prevent execution if user.id is missing
    if (!user?.id) return;

    const controller = new AbortController();

    const fetchNotificationsCount = async () => {
      try {
        // Use 'count: exact' and 'head: true' to get the number without the data
        const { count, error } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('seen', false);

        if (error) throw error;

        setNotificationCount(count || 0);
      } catch (err) {
        // Ignore errors caused by component unmounting
        if (err.name !== 'AbortError') {
          console.error('Error fetching notification count:', err);
        }
      }
    };

    fetchNotificationsCount();

    return () => controller.abort();
  }, [user?.id]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    // Handle non-age fields immediately
    if (name !== 'age') {
      setProfileForm((prev) => ({ ...prev, [name]: value }));
      return;
    }

    // Age Validation Logic:
    // 1. Only allow digits. 2. Max 2 characters.
    if (!/^\d*$/.test(value) || value.length > 2) return;

    let finalValue = value;

    // Enforce range only when exactly 2 digits are entered
    if (value.length === 2) {
      const num = parseInt(value, 10);
      finalValue = String(Math.min(Math.max(num, 13), 99));
    }

    setProfileForm((prev) => ({ ...prev, age: finalValue }));
  };

  const handleProfileSubmit = async () => {
    const { gender, age } = profileForm;

    // 1. Early Exit: Validate before triggering state or tracking
    if (!gender || !age) return;

    setSubmitting(true);

    // 2. Analytics: Fire and forget (don't let it block UI logic)
    trackEvent({
      action: 'button_click',
      category: 'Home Page',
      label: 'Submit Gender & Age Button',
    });

    try {
      const { error } = await supabase
        .from('users')
        .update({ gender, age: parseInt(age, 10) })
        .eq('id', user.id);

      if (error) throw error;

      // 3. Optimized State Sync
      const updatedUser = { ...user, gender, age: parseInt(age, 10) };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setNewUser(updatedUser);
      setShowProfileModal(false);
      setDataChanged((prev) => !prev); // Use functional update for stability
    } catch (error) {
      console.error('Update failed:', error.message);
      // Add user feedback here (e.g., toast notification)
    } finally {
      // 4. Guaranteed Reset: Runs whether success or failure
      setSubmitting(false);
    }
  };

  const handleClick = async () => {
    await handleProfileSubmit();
  };

  // 1. Move the logic outside the component or wrap in useCallback
  // This prevents the function from being recreated on every render.
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Inside your component:
  useEffect(() => {
    // 2. Consistent guard clauses
    if (activeTab === 'all' && users.length > 0) {
      setShuffledUsers(shuffleArray(users));
    }
  }, [activeTab]); // Standardizing on activeTab to match your strict functionality

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      // 1. Parallelize independent fetches to eliminate waterfalls
      const [unreadRes, sentRes, recvRes, pinnedRes] = await Promise.all([
        supabase
          .from('unread_counts')
          .select('sender_id, count')
          .eq('receiver_id', user.id),
        supabase
          .from('messages')
          .select('receiver_id')
          .eq('sender_id', user.id),
        supabase
          .from('messages')
          .select('sender_id')
          .eq('receiver_id', user.id),
        supabase
          .from('pinned_users')
          .select('pinned_user_id')
          .eq('user_id', user.id),
      ]);

      // Handle Inbox IDs (Set is already optimized for uniqueness)
      const ids = new Set();
      sentRes.data?.forEach((m) => ids.add(m.receiver_id));
      recvRes.data?.forEach((m) => ids.add(m.sender_id));
      setInboxUserIds(ids);

      // Handle Unread Counts
      if (!unreadRes.error && unreadRes.data) {
        const countMap = {};
        const missingUserIds = [];
        const pinnedIds = new Set(
          pinnedRes.data?.map((r) => r.pinned_user_id) || []
        );

        // Use a Set for O(1) lookup speed instead of .some() O(n)
        const existingUserIds = new Set(users.map((u) => u.id));

        unreadRes.data.forEach(({ sender_id, count }) => {
          if (count > 0) {
            countMap[sender_id] = count;
            if (!existingUserIds.has(sender_id)) {
              missingUserIds.push(sender_id);
            }
          }
        });

        setUnreadCounts(countMap);

        // Fetch missing users only if necessary
        if (missingUserIds.length > 0) {
          const { data: newUsers, error: userErr } = await supabase
            .from('users')
            .select(
              'id, name, profile_pic, country, gender, status, age, decency_rating'
            )
            .in('id', missingUserIds);

          if (!userErr && newUsers) {
            const processed = newUsers.map((u) => ({
              ...u,
              avatar: u.profile_pic || empty,
              notifications: countMap[u.id] || 0,
              pinned: pinnedIds.has(u.id),
              status: u.status || 'offline',
            }));

            setUsers((prev) => {
              const userMap = new Map(prev.map((u) => [u.id, u]));
              processed.forEach((u) => userMap.set(u.id, u));
              return Array.from(userMap.values());
            });
          }
        }
      }
    };

    fetchData();
    // 2. Poll only the countMap, not the entire user object fetch
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [user.id]);

  const handleUserClick = (clickedId) => {
    // 1. Optimistic UI Update: Update state immediately without waiting
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === clickedId ? { ...u, notifications: 0 } : u
      )
    );

    // 2. Fire and Forget: Don't 'await' unless you need to handle the result
    // This prevents the function from "hanging" in an async state
    supabase
      .from('users')
      .update({ active_route: '/chat/' })
      .eq('id', user.id)
      .then(({ error }) => {
        if (error) console.error('Failed to update route:', error.message);
      });
  };

  const handleRouteUpdate = () => {
    // 1. Guard clause: prevents unnecessary network calls
    if (!user?.id || user.active_route === '/chat/') return;

    // 2. Fire and Forget: Remove 'async/await' so the UI doesn't hang.
    // The database update happens in the background.
    supabase
      .from('users')
      .update({ active_route: '/chat/' })
      .eq('id', user.id)
      .then(({ error }) => {
        if (error) {
          console.error('Background route update failed:', error.message);
        }
      });
  };

  useEffect(() => {
    if (!users.length) return;

    const used = new Set(users.map((u) => u.country));
    const allCountries = Object.values(countryNameToCode);

    // Optimization: Partition in a single loop instead of filtering twice
    const usedCountries = [];
    const unusedCountries = [];

    for (const code of allCountries) {
      if (used.has(code)) {
        usedCountries.push(code);
      } else {
        unusedCountries.push(code);
      }
    }

    // Sorting smaller arrays is faster than sorting one giant array
    setCountries([...usedCountries.sort(), ...unusedCountries.sort()]);
  }, [users]); // Only re-runs when users array reference changes

  // 2️⃣ Background refresh for latest data, without showing loading indicator
  useEffect(() => {
    if (!user?.id) return;

    const refreshUsers = async () => {
      // 1. Parallelize fetches to avoid the "Waterfall" delay
      const [usersRes, pinnedRes] = await Promise.all([
        supabase
          .from('users')
          .select(
            'id, name, profile_pic, country, gender, status, age, decency_rating, notifications'
          )
          .neq('id', user.id) // 2. Filter out current user at the DB level (much faster)
          .limit(100), // 3. Add a limit! Don't fetch the whole DB every 30s

        supabase
          .from('pinned_users')
          .select('pinned_user_id')
          .eq('user_id', user.id),
      ]);

      if (usersRes.error || !usersRes.data) return;

      // 4. Use a Set for O(1) lookup speed for pinned status
      const pinnedSet = new Set(
        pinnedRes.data?.map((row) => row.pinned_user_id) || []
      );

      const processed = usersRes.data.map((u) => ({
        ...u,
        avatar: u.profile_pic || empty,
        notifications: u.notifications || 0,
        pinned: pinnedSet.has(u.id),
        status: u.status || 'offline',
      }));

      // 5. Optimized Merge: Use a Map to handle updates and additions in one pass
      setUsers((prev) => {
        const userMap = new Map(prev.map((u) => [u.id, u]));

        processed.forEach((u) => {
          // Only add if it doesn't exist, or update existing data
          userMap.set(u.id, { ...userMap.get(u.id), ...u });
        });

        return Array.from(userMap.values());
      });
    };

    refreshUsers(); // Run immediately on mount
    const interval = setInterval(refreshUsers, 30000);
    return () => clearInterval(interval);
  }, [user.id]); // Added user.id to dependencies to ensure correct pinned status

  // 1. Memoize the result outside the function if the data is static for the session
  let cachedAutoPinnedIds = null;

  const getAutoPinnedIds = () => {
    // 2. Return cached version to avoid repetitive localStorage hits
    if (cachedAutoPinnedIds !== null) return cachedAutoPinnedIds;

    try {
      const raw = localStorage.getItem('autoPinnedUsers');
      // 3. Early return for null/undefined to skip JSON.parse
      if (!raw) {
        cachedAutoPinnedIds = [];
        return cachedAutoPinnedIds;
      }

      cachedAutoPinnedIds = JSON.parse(raw);
      return cachedAutoPinnedIds;
    } catch (e) {
      // 4. Defensive coding: handle corrupted JSON
      console.error('Failed to parse autoPinnedUsers', e);
      return [];
    }
  };

  const addAutoPinnedId = (userId) => {
    // 1. Get current list (uses our cached version from the previous step)
    const current = getAutoPinnedIds();

    // 2. Use a Set for O(1) lookup - cleaner and faster
    const idSet = new Set(current);

    if (idSet.has(userId)) return;

    // 3. Optimized Limit Logic
    // If at limit, remove the last item to make room for the new one at the end
    const updatedList =
      current.length >= 10
        ? [...current.slice(0, 9), userId]
        : [...current, userId];

    // 4. Update both Disk and Memory Cache
    localStorage.setItem('autoPinnedUsers', JSON.stringify(updatedList));

    // Update the global cache variable from our previous 'getAutoPinnedIds' optimization
    cachedAutoPinnedIds = updatedList;
  };

  useEffect(() => {
    // Use a local variable to avoid unnecessary multiple calls to localStorage
    const isAllowed = localStorage.getItem('pushAllowed');

    // Strict check to avoid setting state if it's already the default
    // (This prevents a potential redundant 2nd render if state was already true)
    if (isAllowed === 'true') {
      setPushAllowed(true);
    } else if (isAllowed === 'false') {
      setPushAllowed(false);
    }
  }, []);

  useEffect(() => {
    // 1. Guard Clause: Skip the entire logic if the user is searching
    if (searchTerm.trim() !== '') return;

    // 2. Optimization: Check if state actually needs to change
    // to avoid redundant "reset" cycles.
    setUsers((prev) => {
      if (prev.length === 0) return prev; // If already empty, keep the same reference
      return [];
    });

    // 3. Sequential Reset: React batches these, but we only set them
    // if they aren't already at their default values.
    setPage((prev) => (prev === 0 ? prev : 0));
    setHasMore((prev) => (prev === true ? prev : true));
    setLoading((prev) => (prev === true ? prev : true));

    // The logic remains identical, but avoids re-triggering
    // expensive downstream effects or renders.
  }, [activeTab, genderFilter, countryFilter]);

  useEffect(() => {
    let isMounted = true;
    // Store object URLs to clean them up later and prevent memory leaks
    const objectUrls = [];

    const fetchUsers = async () => {
      // 1. Pre-validation and UI State
      const trimmedSearch = searchTerm.trim();
      const isSearching = trimmedSearch !== '';

      setLoading(true);
      setHasFetched(false);

      if (debouncedSearchTerm.trim().length === 1) {
        setUsers([]);
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      if (isSearching) setSearchLoading(true);

      try {
        const db = await dbPromise;

        // 2. Parallelize Supabase Queries to eliminate the "Waterfall"
        // We fetch Users and Pinned IDs at the same time
        let query = supabase
          .from('users')
          .select(
            'id, name, profile_pic, country, gender, status, age, decency_rating, created_at'
          );

        if (activeTab === 'all')
          query = query
            .neq('country', 'IN')
            .order('created_at', { ascending: false });
        if (genderFilter !== 'all') query = query.eq('gender', genderFilter);
        if (countryFilter !== 'all') query = query.eq('country', countryFilter);
        if (activeTab === 'online')
          query = query
            .eq('status', 'online')
            .order('created_at', { ascending: false });
        if (isSearching) query = query.ilike('name', `%${trimmedSearch}%`);

        const [usersRes, pinnedRes, cachedPics, autoPinnedIds] =
          await Promise.all([
            query,
            supabase
              .from('pinned_users')
              .select('pinned_user_id')
              .eq('user_id', user.id),
            db.getAll('profile_pics'),
            getAutoPinnedIds(), // Uses the optimized cache we built earlier
          ]);

        if (!isMounted) return; // Race condition check
        if (usersRes.error) throw usersRes.error;

        // 3. Optimized Lookup Structures
        const pinnedIdsSet = new Set([
          ...(pinnedRes.data?.map((row) => row.pinned_user_id) || []),
          ...autoPinnedIds,
        ]);
        const cachedMap = new Map(
          cachedPics.map((item) => [item.id, item.blob])
        );

        // 4. Parallel Image Processing
        const missing = usersRes.data.filter(
          (u) => u.profile_pic && !cachedMap.has(u.id)
        );

        if (missing.length > 0) {
          const downloads = await Promise.allSettled(
            missing.map(async (u) => {
              const res = await fetch(u.profile_pic);
              const blob = await res.blob();
              await db.put('profile_pics', { id: u.id, blob });
              return { id: u.id, blob };
            })
          );

          downloads.forEach((d) => {
            if (d.status === 'fulfilled')
              cachedMap.set(d.value.id, d.value.blob);
          });
        }

        // 5. Final Mapping
        const processed = usersRes.data.map((u) => {
          const blob = cachedMap.get(u.id);
          let avatar = empty;
          if (blob) {
            avatar = URL.createObjectURL(blob);
            objectUrls.push(avatar); // Track for cleanup
          }
          return {
            ...u,
            avatar,
            notifications: unreadCounts[u.id] || 0,
            pinned: pinnedIdsSet.has(u.id),
            status: u.status || 'offline',
          };
        });

        if (isMounted) {
          setUsers(processed);
          setHasFetched(true);
        }
      } catch (err) {
        console.error('⚠️ fetchUsers error:', err);
        if (isMounted) setHasFetched(true);
      } finally {
        if (isMounted) {
          setSearchLoading(false);
          setLoading(false);
          setLoadingMore(false);
          setFirstLoad(false);
        }
      }
    };

    fetchUsers();

    // 6. Cleanup: Prevent memory leaks and race conditions
    return () => {
      isMounted = false;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [activeTab, genderFilter, countryFilter, debouncedSearchTerm]);
  // Added debouncedSearchTerm to deps to ensure search actually triggers the fetch

  useEffect(() => {
    // 1. Guard Clause: Don't set up the observer if searching
    if (searchTerm.trim() !== '') return;

    // 2. Optimization: Keep the observer logic simple.
    // We only care if we AREN'T currently loading and HAVE more to fetch.
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // 3. Multi-gate check: Only increment if intersecting AND idle
        // Checking loading state inside the callback prevents observer recreation
        if (entry.isIntersecting && hasMore && !loading && !loadingMore) {
          setPage((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: '200px', // Increased margin for smoother "Infinite" feel
        threshold: 0.01, // Trigger as soon as 1% is visible
      }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.disconnect(); // Use disconnect() to clear all targets
    };
    // 4. Reduced Dependency Array:
    // We remove loading states here and check them inside the callback instead.
  }, [hasMore, searchTerm]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768); // Mobile breakpoint
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const shouldShowToast = localStorage.getItem('showFilterToast');

    if (shouldShowToast) {
      handleFilterToast();
      localStorage.removeItem('showFilterToast'); // prevent repeat
    }
  }, []);

  const handleProtectedNavigation = (e, path, targetUser = null) => {
    // 1. Early exits: Check for required data first
    if (e?.preventDefault) e.preventDefault();
    if (!targetUser?.id) return;

    // 2. Performance: Direct string check is faster than parsing JSON
    // If 'user' exists in localStorage, it's a truthy string.
    const userSession = localStorage.getItem('user');
    if (!userSession) {
      navigate('/register');
      return;
    }

    // 3. Logic: Execute state updates and side effects
    addAutoPinnedId(targetUser.id);

    // 4. Optimization: Functional state update
    setUsers((prevUsers) =>
    prevUsers.map((u) =>
      u.id === targetUser.id ? { ...u, pinned: true } : u
    )
  );

    // 5. Final navigation
    navigate(path, { state: { targetUser } });
  };

  // ------------------- filteredUsers logic -------------------
  const filteredUsers = useMemo(() => {
    // 1. Pre-calculate search term once to avoid O(n) calls to toLowerCase()
    const lowerSearch = searchTerm.toLowerCase().trim();

    // 2. Single-pass Filter
    let filtered = users.filter((user) => {
      if (genderFilter !== 'all' && user.gender !== genderFilter) return false;
      if (countryFilter !== 'all' && user.country !== countryFilter)
        return false;

      // Check search match efficiently
      if (lowerSearch && !user.name?.toLowerCase().includes(lowerSearch))
        return false;

      // Check Tab Specifics
      const hasUnread = (unreadCounts[user.id] || 0) > 0;
      if (activeTab === 'pinned' && !user.pinned) return false;
      if (activeTab === 'inbox' && !hasUnread) return false;
      // Original logic: if not inbox/pinned, exclude those with unread counts
      if (activeTab !== 'pinned' && activeTab !== 'inbox' && hasUnread)
        return false;

      if (activeTab === 'online' && user.status !== 'online') return false;

      return true;
    });

    // 3. Priority Sorting (Optimized with a pre-defined map or fixed values)
    filtered.sort((a, b) => {
      const bUnread = unreadCounts[b.id] || 0;
      const aUnread = unreadCounts[a.id] || 0;
      if (bUnread !== aUnread) return bUnread - aUnread;

      const bHasPic = b.avatar !== empty ? 1 : 0;
      const aHasPic = a.avatar !== empty ? 1 : 0;
      if (bHasPic !== aHasPic) return bHasPic - aHasPic;

      // Optimized priority logic (avoiding function declaration inside sort)
      const pB = (b.verified ? 3000 : 1000) + (b.pinned ? 1000 : 0);
      const pA = (a.verified ? 3000 : 1000) + (a.pinned ? 1000 : 0);
      return pB - pA;
    });

    // 4. Tab-Specific Formatting
    if (activeTab === 'all') {
      // Optimized Round-Robin: Group and Sort in one pass where possible
      const groups = new Map();
      filtered.forEach((u) => {
        if (!groups.has(u.country)) groups.set(u.country, []);
        groups.get(u.country).push(u);
      });

      // Sort subgroups by date (pre-convert to number for faster comparison)
      groups.forEach((list) =>
        list.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );

      const roundRobin = [];
      const groupArrays = Array.from(groups.values());
      let maxLen = Math.max(...groupArrays.map((a) => a.length), 0);

      for (let i = 0; i < maxLen; i++) {
        for (const group of groupArrays) {
          if (group[i]) roundRobin.push(group[i]);
        }
      }
      filtered = roundRobin;
    } else if (activeTab === 'online') {
      // Optimized Alternating Genders
      const females = [],
        males = [],
        others = [];
      for (const u of filtered) {
        if (u.gender === 'female') females.push(u);
        else if (u.gender === 'male') males.push(u);
        else others.push(u);
      }

      const alternated = [];
      const len = Math.max(females.length, males.length);
      for (let i = 0; i < len; i++) {
        if (i < females.length) alternated.push(females[i]);
        if (i < males.length) alternated.push(males[i]);
      }
      filtered = [...alternated, ...others];
    }

    // 5. Pagination
    return filtered.slice(0, (page + 1) * 10);
  }, [
    users,
    genderFilter,
    countryFilter,
    searchTerm,
    activeTab,
    unreadCounts,
    page,
  ]);

  // 1. Wrap in useCallback to keep the reference stable
  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;

      // 2. Optimization: Use a larger threshold or specific 'hasMore' check
      // Added 'hasMore' check to prevent infinite triggers when no data is left
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        // 3. The "Gatekeeper" pattern: Prevents multiple triggers while loading
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);

        // 4. Clean timeout handling
        const timer = setTimeout(() => {
          setPage((prev) => prev + 1);
          setLoadingMore(false);
        }, 800);

        return () => clearTimeout(timer);
      }
    },
    [loadingMore, hasMore]
  ); // Only recreate if these change

  const hasPinnedNotification = users.some(
    (u) => u.pinned && unreadCounts[u.id] > 0
  );

  const handleSearchSubmit = async () => {
    trackEvent({
      action: 'button_click',
      category: 'Chat List Page',
      label: 'Search Bar',
    });

    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm) {
      setPage(0);
      setUsers([]);
      setHasMore(true);
      return;
    }

    setSearchLoading(true);

    try {
      const db = await dbPromise; // Initialize IDB connection in parallel

      // 1. Parallelize everything: DB Data + Local Pinned Cache + IDB Blobs
      const [searchRes, pinnedRes, cachedPics, autoPinnedIds] =
        await Promise.all([
          supabase
            .from('users')
            .select(
              'id, name, profile_pic, country, gender, status, age, decency_rating'
            )
            .ilike('name', `%${trimmedTerm}%`)
            .neq('id', user.id)
            .limit(50),
          supabase
            .from('pinned_users')
            .select('pinned_user_id')
            .eq('user_id', user.id),
          db.getAll('profile_pics'),
          getAutoPinnedIds(), // Using the cached version
        ]);

      if (searchRes.error) throw searchRes.error;

      // 2. Optimized Lookup Structures (Combined Set)
      const pinnedSet = new Set([
        ...(pinnedRes.data?.map((row) => row.pinned_user_id) || []),
        ...autoPinnedIds,
      ]);
      const cachedMap = new Map(cachedPics.map((item) => [item.id, item.blob]));

      // 3. Process data with avatar Blob support
      // This prevents the search results from showing "empty" while images download
      const processed = searchRes.data.map((u) => {
        const blob = cachedMap.get(u.id);
        return {
          ...u,
          avatar: blob ? URL.createObjectURL(blob) : u.profile_pic || empty,
          notifications: unreadCounts[u.id] || 0,
          pinned: pinnedSet.has(u.id),
          status: u.status || 'offline',
        };
      });

      setUsers(processed);
      setHasMore(false);
    } catch (err) {
      console.error('Search error:', err.message);
    } finally {
      setSearchLoading(false);
      setLoading(false);
    }
  };

  const handleMarkAllAsSeen = async () => {
    const updated = { ...unreadCounts };
    for (let userId in updated) {
      updated[userId] = 0;
    }
    setUnreadCounts(updated);
    //updateBadgeSeenStatus(updated);
    await supabase
      .from('unread_counts')
      .update({ count: 0 })
      .eq('receiver_id', user.id);

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
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
  };

  const handleRoast = () => {
    trackEvent({
      action: 'button_click',
      category: 'Header',
      label: 'Roast Button',
    });

    localStorage.setItem('showFilterToast', 'true');
    toast.error('Reach 100 likes on your profile to unlock this feature', {
      duration: 4000,
      position: 'top-center',
    });
  };

  const handleFilterToast = () => {
    toast.error('Reach 100 likes on your profile to unlock this feature', {
      duration: 4000,
      position: 'top-center',
    });
  };

  const handleNotification = async () => {
    // 1. Optimistic UI Update
    setNotificationCount(0);
    navigate('/notifications');

    try {
      // 2. Parallelize the independent update tasks
      // We fire the 'likes' update and the 'image fetch' at the same time
      const [likesUpdate, imagesRes] = await Promise.all([
        supabase
          .from('likes')
          .update({ seen: true })
          .eq('user_id', user.id)
          .eq('seen', false),

        supabase.from('images').select('id').eq('user_id', user.id),
      ]);

      // 3. Conditional secondary update
      // If the user has images, mark those roasts as seen
      if (imagesRes.data?.length > 0) {
        const imageIds = imagesRes.data.map((img) => img.id);

        await supabase
          .from('roasts')
          .update({ seen: true })
          .in('image_id', imageIds)
          .eq('seen', false);
      }
    } catch (err) {
      console.error('Failed to mark notifications as seen:', err);
      // Optional: Revert UI count if essential, but usually not needed for 'seen' status
    }
  };
  // 👉 searchLoading can be used inside your list UI
  {
    searchLoading && (
      <div
        className="flex justify-center items-center py-4 min-h-[64px]"
        aria-live="polite"
      >
        <MiniSpinner />
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
                        notifications: unreadCounts[u.id] || 0,
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
            <button className="search-button" onClick={handleSearchSubmit}>
              <FaSearch />
            </button>
          </div>

          <div className="tab-bar">
            <button
              className={`sketchy-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('all');
                localStorage.setItem('activeTab', 'all');
              }}
            >
              {i18n.t('all')}
            </button>
          
           {/* <button
              className={`sketchy-tab ${
                activeTab === 'pinned' ? 'active' : ''
              }`}
              onClick={() => {
                setActiveTab('pinned');
                localStorage.setItem('activeTab', 'pinned');
                handleRouteUpdate();
              }}
              style={{ position: 'relative' }}
            >
              {i18n.t('chats')}
              {hasPinnedNotification && (
                <span
                  className="sketchy-badge pinned-tab-badge"
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    fontSize: '0.7rem',
                    backgroundColor: '#e53935',
                    padding: '0.4rem',
                    borderRadius: '50px',
                  }}
                ></span>
              )}
            </button>*/}
            <button
              className={`sketchy-tab ${activeTab === 'inbox' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('inbox');
                localStorage.setItem('activeTab', 'inbox');
                handleRouteUpdate();
              }}
              style={{ position: 'relative' }}
            >
              {i18n.t('inbox')}
              {Object.values(unreadCounts).some((count) => count > 0) && (
                <span
                  className="sketchy-badge pinned-tab-badge"
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    fontSize: '0.7rem',
                    backgroundColor: '#e53935',
                    padding: '0.4rem',
                    borderRadius: '50px',
                  }}
                ></span>
              )}
            </button>
            {activeTab === 'inbox' &&
              Object.values(unreadCounts).some((c) => c > 0) && (
                <button
                  onClick={handleMarkAllAsSeen}
                  className="mark-all-seen-btn"
                  style={{
                    position: 'fixed',
                    bottom: '50px',
                    right: '20px',
                    zIndex: 999,
                    padding: '0.8rem 1.2rem',
                    backgroundColor: '#222',
                    color: 'white',
                    borderRadius: '30px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                  }}
                >
                  <FaCheck size={20} color="white" />
                </button>
              )}

            <button
              className={`sketchy-tab ${
                activeTab === 'online' ? 'active' : ''
              }`}
              /** 
  onClick={() => {
    const newTab = activeTab === 'online' ? 'all' : 'online';
    setActiveTab(newTab);
    setAllFilter(newTab === 'online' ? 'online' : 'all');
    localStorage.setItem('activeTab', newTab);
  }} 
  */
              onClick={handleRoast}
            >
              {i18n.t('online')}
            </button>

            <button
              className={`sketchy-tab ${activeTab === 'maps' ? 'active' : ''}`}
              onClick={() => {
                const newTab = activeTab === 'maps' ? 'all' : 'maps';
                setActiveTab(newTab);
                setAllFilter(newTab === 'maps' ? 'maps' : 'all');
                localStorage.setItem('activeTab', newTab);
              }}
            >
              <FaMapMarkerAlt style={{ marginRight: '6px' }} />
            </button>

            <button className="sketchy-tab" onClick={handleRoast}>
              {' '}
              {/* handleFilterClick */}
              <FaFilter style={{ marginRight: '6px' }} />
            </button>

            {activeTab === 'all' && (
              <>
                {/* <button
                  className="fab-camera-button"
                  onClick={handleScratch}
                  title="Open camera"
                >
                  <FaMagic />
                </button>
 */}
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
            style={{ overflowY: 'auto', height: '100vh' }}
            className={`${
              activeTab === 'maps' ? 'maps-active' : 'sketchy-list-scrollable '
            }`}
          >
            {activeTab === 'maps' ? (
              <Maps />
            ) : searchLoading || loading ? ( // ✅ show spinner if either search or tab is loading
              <LoadingSpinner />
            ) : filteredUsers.length > 0 ? (
              <>
                {filteredUsers
                  .filter((u) => u.id !== user.id)
                  .map((user) => (
                    <Link
                      key={user.id}
                      className={`user-card ${
                        user.notifications > 0 ? 'has-notification' : ''
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
                      textAlign: 'center',
                      margin: '20px 0',
                      paddingBottom: '1rem',
                    }}
                  >
                    {loadingMore && <MiniSpinner />}{' '}
                    {/* Use your custom spinner */}
                  </div>
                )}
              </>
            ) : hasFetched ? (
              <div className="no-results-card">
                {activeTab === 'all' && (
                  <>
                    <FaUsers size={40} className="no-icon" />
                    <p className="no-title">{i18n.t('noUsers')}</p>
                  </>
                )}

                {activeTab === 'pinned' && (
                  <>
                    <FaComments size={40} className="no-icon" />
                    <p className="no-title">{i18n.t('noChats')}</p>
                    <p className="no-sub">{i18n.t('inboxHistory')}</p>
                  </>
                )}

                {activeTab === 'inbox' && (
                  <>
                    <FaEnvelopeOpenText size={40} className="no-icon" />
                    <p className="no-title">{i18n.t('inboxEmpty')}</p>
                    <p className="no-sub">{i18n.t('newMessages')}</p>
                  </>
                )}

                {activeTab === 'online' && (
                  <>
                    <FaBolt size={40} className="no-icon" />
                    <p className="no-title">No one’s online</p>
                    <p className="no-sub">
                      Check back later or explore all users.
                    </p>
                    <button
                      onClick={() => setActiveTab('all')}
                      className="retry-btn"
                    >
                      🌍 View All Users
                    </button>
                  </>
                )}

                {activeTab === 'maps' && <Maps />}
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
                <h3 className="modal-title">🎛️ {i18n.t('filters')}</h3>

                <div className="modal-section">
                  <h4>Gender</h4>
                  <div className="btn-group">
                    {['all', 'male', 'female'].map((g) => (
                      <button
                        key={g}
                        className={`modal-btn ${
                          genderFilter === g ? 'active' : ''
                        }`}
                        onClick={() => {
                          setGenderFilter(g);
                          setShowAllTabs(false);
                        }}
                      >
                        {g === 'all'
                          ? `🌐 ${i18n.t('allGenders')}`
                          : g === 'male'
                          ? `♂️ ${i18n.t('male')}`
                          : `♀️ ${i18n.t('female')}`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="modal-section">
                  <h4>{i18n.t('country')}</h4>
                  <div className="btn-group">
                    <button
                      className={`modal-btn ${
                        countryFilter === 'all' ? 'active' : ''
                      }`}
                      onClick={() => {
                        setCountryFilter('all');
                        setShowAllTabs(false);
                      }}
                    >
                      🌍 {i18n.t('allCountries')}
                    </button>
                    {countries.map((c) => (
                      <button
                        key={c}
                        className={`modal-btn ${
                          countryFilter === c ? 'active' : ''
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
                              width: '1.2em',
                              height: '1.2em',
                              marginRight: '8px',
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

        {alertMessage && (
          <SketchyAlert
            message={alertMessage.text}
            buttons={['allow', 'close']}
            onClose={() => setAlertMessage(null)}
          />
        )}
        {showProfileModal && (
          <div className="popup-wrapper">
            <div className="popup-card">
              <h3 className="popup-title">{i18n.t('hey')}</h3>
              <p className="popup-text">{i18n.t('askAgeGender')}</p>

              <div className="option-row">
                <label className="option-box">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={profileForm.gender === 'male'}
                    onChange={handleProfileChange}
                  />{' '}
                  {i18n.t('male')}
                </label>
                <label className="option-box">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={profileForm.gender === 'female'}
                    onChange={handleProfileChange}
                  />{' '}
                  {i18n.t('Female')}
                </label>
              </div>

              <input
                type="number"
                className="input-field"
                placeholder={i18n.t('enterAge')}
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
                    ? 'disabled'
                    : ''
                }`}
                onClick={handleClick}
                disabled={
                  !profileForm.gender ||
                  !profileForm.age ||
                  parseInt(profileForm.age, 10) < 13 ||
                  parseInt(profileForm.age, 10) > 99
                }
              >
                {i18n.t('submit')}
              </button>
            </div>
          </div>
        )}
        {/*showPushPrompt && (
          <div className="push-overlay">
            <div className="push-box">
              <h3 className="push-title">Enable Notifications</h3>
              <p className="push-desc">
                Please allow push notifications to continue.
              </p>

              <button
                onClick={requestRollerAdsPermission}
                className={`btn-allow-push glow-button`}
              >
                {pushStatus === 'idle' && 'Allow Push Notifications'}
                {pushStatus === 'requesting' && 'Waiting for browser prompt…'}
                {pushStatus === 'granted' && 'Permission Granted ✓'}
                {pushStatus === 'denied' && 'Denied — Try Again'}
              </button>
            </div>
          </div>
        )*/}
      </div>

      <Toaster />
    </>
  );
};

export default ChatList;
