import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SketchyHeader from '../Components/SketchyHeader';
import SketchyAlert from '../Components/SketchyAlert';
import '../Styles/Profile.css';
import empty from '../Assets/empty.png';
import { supabase, supabaseStorage } from '../Utils/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import MosaicAvatar from '../Components/MosaicAvatar';
import imageCompression from 'browser-image-compression';
import { trackEvent } from '../Utils/analytics';
import LoadingSpinner from '../Components/LoadingSpinner';
import { openDB } from 'idb';
import axios from 'axios';
import OneSignal from 'react-onesignal';
import BannerAd from '../Components/BannerAd';
import i18n from '../i18n';

const giftList = [
  'https://images.icon-icons.com/1478/PNG/96/bouquet_101953.png',
  'https://cdn1.iconfinder.com/data/icons/DarkGlass_Reworked/128x128/apps/beryl-manager.png',
  'https://cdn1.iconfinder.com/data/icons/icons-for-a-site-1/64/advantage_deliver-64.png',
  'https://cdn0.iconfinder.com/data/icons/icecandy-psd/256/icecandy-chocolate.png',
  'https://cdn1.iconfinder.com/data/icons/icons-for-a-site-1/64/advantage_quality-64.png',
  'https://images.icon-icons.com/327/PNG/256/Clown_Impish_35102.png',
];

const giftCoinRequirements = [1000, 1000000, 300000, 10, 10000, 100];
const formatCoins = (coins) => {
  if (coins >= 1000) return `${coins / 1000}k`; // 10k → 10k
  return coins.toString(); // <1000 → plain number
};

const Profile = () => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Add new state
  const [showGiftList, setShowGiftList] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isCurrentUser = currentUser?.id?.toString() === id;
  const currentUserId = currentUser?.id;
  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({ name: '', bio: '', imageFile: null });
  const [status, setStatus] = useState({
    editing: false,
    uploading: false,
    sendingGift: false,
    alertMessage: '',
  });
  const [receivedGifts, setReceivedGifts] = useState([]);
  const orientationColors = {
    gay: '🌈 #1d9bf0', // blue
    lesbian: '🌸 #e75480', // pink
    trans: '⚧ #9b59b6', // purple
    hetero: '⚪ #2ecc71', // green
    bi: '💜 #ff69b4', // magenta
  };

  // inside state
  const [orientation, setOrientation] = useState('');

  const handleBack = () => navigate(-1);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Compress the image first
    const compressAndResize = async (file, targetKB = 9) => {
      let quality = 0.9;
      let maxWidthOrHeight = 1000;
      let compressedFile = file;

      for (let i = 0; i < 10; i++) {
        const options = {
          maxSizeMB: targetKB / 1024,
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

    try {
      const compressedFile = await compressAndResize(file, 9);
      setForm((prev) => ({ ...prev, imageFile: compressedFile }));

      // Preview compressed image
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      console.error('Image compression failed:', err);
      // fallback to original file if compression fails
      setForm((prev) => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowPopup(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('✅ User accepted the install');
    } else {
      console.log('❌ User dismissed the install');
    }

    setDeferredPrompt(null);
    setShowPopup(false);
    const { data, error } = await supabase
      .from('users')
      .update({ installed_app: true })
      .eq('id', currentUserId);

    if (error) {
      console.error('Error updating field:', error);
    } else {
      console.log('Updated field:', data);
    }
    // Track install click
    trackEvent({
      action: 'button_click',
      category: 'Install Popup',
      label: 'Install App',
    });
  };

  const handleCancel = () => {
    setShowPopup(false);
    setDeferredPrompt(null);

    // Track cancel click
    window.gtag?.('event', 'click', {
      event_category: 'Install Popup',
      event_label: 'Cancel Button',
      value: 1,
    });
  };

  // 🔹 IndexedDB setup
  const dbPromise = openDB('UserDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('profile_pics')) {
        db.createObjectStore('profile_pics', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id' });
      }
    },
  });

  // Save user + profile_pic to IndexedDB (update if changed)
  const saveUserToIDB = async (user) => {
    const db = await dbPromise;

    try {
      const existing = await db.get('profile_pics', user.id);

      if (user.profile_pic) {
        let shouldUpdate = false;

        // If no cached pic → must save
        if (!existing) {
          shouldUpdate = true;
          console.log(
            `💾 No cached profile pic found, will save new one for ${user.id}`
          );
        }
        // If cached but URL changed → update
        else if (existing.url !== user.profile_pic) {
          shouldUpdate = true;
          console.log(`🔄 Profile pic changed for ${user.id}, updating cache`);
        }

        if (shouldUpdate) {
          try {
            const response = await fetch(user.profile_pic + `?t=${Date.now()}`); // bust CDN cache
            const blob = await response.blob();
            await db.put('profile_pics', {
              id: user.id,
              blob,
              url: user.profile_pic,
            });
            console.log(`💾 Profile pic cached/updated for user ${user.id}`);
          } catch (fetchErr) {
            console.warn(
              '⚠️ Could not fetch profile_pic, skipped caching:',
              fetchErr
            );
          }
        } else {
          console.log(
            `⚡ Cached profile pic for user ${user.id} is still valid, skipping update`
          );
        }
      } else {
        // User removed profile pic → delete from IndexedDB
        if (existing) {
          await db.delete('profile_pics', user.id);
          console.log(`🗑️ Removed cached profile pic for user ${user.id}`);
        }
      }

      // Always update full user object (bio, name, etc.)
      await db.put('users', user);
    } catch (err) {
      console.error('⚠️ saveUserToIDB error:', err);
    }
  };

  // Fetch user from Supabase + IndexedDB caching
  const fetchUser = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(
          'id, name, talked_to_count, bio, profile_pic, reward_coins, decency_rating, orientation'
        )
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('❌ Error fetching user:', error?.message);
        setUserData({ avatar: empty, name: '', bio: '' });
        return;
      }

      const db = await dbPromise;

      // Try to get cached avatar first
      const cached = await db.get('profile_pics', data.id);
      let avatar;
      let loadedFromCache = false;

      if (cached?.blob) {
        avatar = URL.createObjectURL(cached.blob);
        console.log(
          `📦 Loaded profile pic for user ${data.id} from IndexedDB (blob).`
        );
        loadedFromCache = true;
      } else if (data.profile_pic) {
        avatar = data.profile_pic;
        console.log(
          `🌐 Loaded profile pic for user ${data.id} from Supabase/network URL.`
        );
      } else {
        avatar = empty;
        console.log(
          `❌ No profile pic found for user ${data.id}, using default empty.png`
        );
      }

      // Only cache if we didn’t already load from IndexedDB
      if (!loadedFromCache) {
        await saveUserToIDB(data);
      }

      setUserData({ ...data, avatar });
      setForm((prev) => ({
        ...prev,
        name: data.name || '',
        bio: data.bio || '',
      }));
      setOrientation(data.orientation || '');

      console.log('✅ User fetch complete');
    } catch (err) {
      console.error('⚠️ fetchUser error:', err);
      setUserData({ avatar: empty, name: '', bio: '' });
    }
  };

  // 🔹 Handle Update
  const handleUpdate = async () => {
    setStatus((s) => ({ ...s, uploading: true }));
    let profilePicUrl = userData.avatar;

    try {
      // 1️⃣ Upload new image if selected
      if (form.imageFile) {
        const fileExt = form.imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabaseStorage.storage
          .from('profile-pics')
          .upload(filePath, form.imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabaseStorage.storage
          .from('profile-pics')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          profilePicUrl = publicUrlData.publicUrl;
        }
      }

      // 2️⃣ Update user in Supabase
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({
          name: form.name,
          bio: form.bio,
          profile_pic: profilePicUrl,
          orientation, // 🔹 new field
        })
        .eq('id', id)
        .select()
        .single();

      if (!error && updatedUser) {
        // 3️⃣ Save/Update IndexedDB (only for non-google OR google after update)
        if (!currentUser?.google_login || profilePicUrl.includes('supabase')) {
          await saveUserToIDB(updatedUser);
        }

        // 4️⃣ Update UI immediately
        setUserData((u) => ({
          ...u,
          name: form.name,
          bio: form.bio,
          avatar: profilePicUrl || empty,
        }));

        setStatus({ ...status, editing: false, uploading: false });
        setForm((f) => ({ ...f, imageFile: null }));
        toast.success(i18n.t('profileUpdated'));

        console.log('✅ User updated in Supabase + IndexedDB');
      } else {
        toast.error(i18n.t('failedUpdate'));
        console.error('❌ Update failed:', error?.message);
        setStatus((s) => ({ ...s, uploading: false }));
      }
    } catch (err) {
      toast.error(i18n.t('somethingWrongUploading'));
      console.error('⚠️ Update error:', err);
      setStatus((s) => ({ ...s, uploading: false }));
    }
  };

  const fetchGifts = async () => {
    const receiverId = isCurrentUser ? currentUser.id : id;
    const { data, error } = await supabase
      .from('gifts')
      .select('id, sender_id, gift_type, created_at')
      .eq('receiver_id', receiverId)
      .order('created_at', { ascending: false });

    if (data && !error) setReceivedGifts(data);
    else console.error('Error fetching gifts:', error?.message);
  };

  useEffect(() => {
    if (id) {
      fetchUser();
      fetchGifts();
    }
  }, [id]);

  const handleSendGift = async (giftUrl, index) => {
    if (status.sendingGift || !userData) return;

    const { data, error } = await supabase
      .from('users')
      .select('reward_coins')
      .eq('id', currentUser.id)
      .single();

    if (error || !data) return;

    const currentCoins = data.reward_coins;
    const requiredCoins = giftCoinRequirements[index];

    if (currentCoins < requiredCoins) {
      return setStatus({
        ...status,
        alertMessage: {
          text: `❌ ${i18n.t('youNeed')} ${requiredCoins} ${i18n.t(
            'coinsToSend'
          )}`,
          withButton: true,
        },
      });
    }

    setStatus((s) => ({ ...s, sendingGift: true }));

    const { error: coinError } = await supabase
      .from('users')
      .update({ reward_coins: currentCoins - requiredCoins })
      .eq('id', currentUser.id);

    if (coinError) {
      console.error('Coin deduction error:', coinError.message);
      return setStatus((s) => ({ ...s, sendingGift: false }));
    }

    const { error: giftError } = await supabase
      .from('gifts')
      .insert([
        { sender_id: currentUser.id, receiver_id: id, gift_type: giftUrl },
      ]);

    if (!giftError) {
      setStatus({
        ...status,
        alertMessage: `🎁 ${i18n.t('giftSuccess')}`,
        sendingGift: false,
      });
      await fetchGifts();
      await fetchUser();
    } else {
      console.error('Gift send error:', giftError.message);
      setStatus((s) => ({ ...s, sendingGift: false }));
    }
  };

  const handleUnsubscribe = async () => {
    try {
      if (!currentUser?.id) return;

      // Fetch player_id from Supabase
      const { data, error } = await supabase
        .from('players') // replace with your actual table
        .select('player_id')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching player_id from Supabase:', error.message);
        return;
      }

      const playerId = data?.player_id;

      if (!playerId) {
        console.log('⚠️ No active push subscription found in Supabase');
        return;
      }

      // Call backend to delete the player
      await axios.delete('https://myselpost.onrender.com/delete-player', {
        data: {
          userId: currentUser.id,
          playerId,
        },
      });

      // Optionally opt-out locally (if needed)
      if (window.OneSignal) {
        await OneSignal.User.PushSubscription.optOut();
      }

      console.log('✅ Player unsubscribed successfully');
    } catch (error) {
      console.error('Error deleting the player:', error);
    }
  };

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true); // Show "Logging out..."
    try {
      //await handleUnsubscribe(); // Unsubscribe from push notifications or cleanup
      localStorage.clear(); // Clear localStorage
      navigate('/'); // Redirect to homepage/login
    } catch (err) {
      console.error('Logout failed:', err);
      setLoggingOut(false); // Reset if something fails
    }
  };

  const handleCoins = () => navigate(`/coins/${currentUser.id}`);

  const handleSettings = () => {
    navigate('/settings');
  };

  useEffect(() => {
    const alreadyShown = localStorage.getItem('blurredNoteShown');
    if (!alreadyShown) {
      setShowNote(true);

      // auto-hide after 3s
      const timer = setTimeout(() => {
        setShowNote(false);
        localStorage.setItem('blurredNoteShown', 'true');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!userData) {
    return (
      <>
        <SketchyHeader title={i18n.t('profile')} onBack={handleBack} />
        <div>
          <LoadingSpinner /> {/* <-- show loading spinner */}
        </div>
      </>
    );
  }

  return (
    <>
      <SketchyHeader title={i18n.t('profile')} onBack={handleBack} />
      <div className="sketchy-profile-wrapper">
        <div className="sketchy-profile-tab">Sketchy Profile</div>
        <div className="sketchy-profile-card">
          <div className="sketchy-profile-left">
            {status.editing ? (
              <>
                <input
                  name="name"
                  className="sketchy-profile-input"
                  value={form.name}
                  onChange={handleChange}
                />
                <textarea
                  name="bio"
                  className="sketchy-profile-textarea"
                  value={form.bio}
                  onChange={handleChange}
                />
                <div className="sketchy-file-upload-wrapper">
                  <button
                    type="button"
                    className="sketchy-file-upload-btn"
                    onClick={() =>
                      document.getElementById('sketchy-file-input').click()
                    }
                  >
                    {form.imageFile
                      ? form.imageFile.name
                      : i18n.t('changeProfile')}
                  </button>
                  <input
                    id="sketchy-file-input"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                </div>
              </>
            ) : (
              <>
                <h2 className="sketchy-profile-name">{userData.name}</h2>
                <p className="sketchy-profile-bio">
                  {userData.bio || i18n.t('noBio')}
                </p>
              </>
            )}

            <div className="sketchy-profile-stats-row">
              <p>
                {i18n.t('conversations')}
                <span className="sketchy-stat-value">
                  {userData.talked_to_count || 0}
                </span>
              </p>
              <p>
                {i18n.t('coinsLabel')}
                <span className="sketchy-stat-value">
                  {userData.reward_coins || 0}
                </span>
              </p>
            </div>
            {/**{isCurrentUser && status.editing ? (
              <div className="sketchy-orientation-section">
                <h4 style={{ marginBottom: "6px" }}>{i18n.t("orientation")}</h4>
                <div className="sketchy-orientation-options">
                  {[
                    i18n.t("gay"),
                    i18n.t("lesbian"),
                    i18n.t("transgender"),
                    i18n.t("heterosexual"),
                    i18n.t("bisexual"),
                  ].map((o) => (
                    <label key={o} className="orientation-label">
                      <input
                        type="radio"
                        name="orientation"
                        value={o}
                        checked={orientation === o}
                        onChange={(e) => setOrientation(e.target.value)}
                      />
                      {o.charAt(0).toUpperCase() + o.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              orientation && (
                <div className="orientation-dot">
                  <span
                    style={{
                      display: "inline-block",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor:
                        orientationColors[orientation].split(" ")[1],
                      marginRight: "6px",
                    }}
                  />
                  {orientationColors[orientation].split(" ")[0]}
                </div>
              )
            )}  */}

            {isCurrentUser && (
              <>
                <div className="grid-group">
                  <button
                    className="sketchy-profile-update-btn"
                    onClick={() =>
                      status.editing
                        ? handleUpdate()
                        : setStatus((s) => ({ ...s, editing: true }))
                    }
                    disabled={status.uploading}
                    style={{ marginTop: 10 }}
                  >
                    {status.editing
                      ? status.uploading
                        ? i18n.t('saving')
                        : i18n.t('saveProfile')
                      : i18n.t('updateProfile')}
                  </button>
                  <button
                    className="sketchy-coin-btn-new"
                    onClick={handleCoins}
                    style={{ marginTop: 10 }}
                  >
                    {i18n.t('getCoins')}
                  </button>
                  <button
                    className="sketchy-install-btn"
                    onClick={() => setShowPopup(true)}
                    disabled={!deferredPrompt}
                    style={{ marginTop: 10 }}
                  >
                    {i18n.t('installApp')}
                  </button>
                  <button
                    className="sketchy-logout-btn"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    style={{ marginTop: 10 }}
                  >
                    {loggingOut ? i18n.t('loggingOut') : i18n.t('logOut')}
                  </button>
                </div>
                <button className="settings-btn" onClick={handleSettings}>
                  <span className="gear">&#9881;</span>{' '}
                  {/* Unicode gear icon */}
                  <span className="text">{i18n.t('settings')}</span>
                </button>
              </>
            )}
          </div>

          <div className="sketchy-profile-center">
            <MosaicAvatar
              src={userData.avatar}
              userId={id}
              currentUserId={currentUserId}
            />
            <span className={`blurred-note ${!showNote ? 'hidden' : ''}`}>
              {i18n.t('eachTap')} <br />
              {i18n.t('reachLikes')}
            </span>
          </div>
        </div>

        {receivedGifts.length > 0 && (
          <div className="sketchy-gift-section">
            <h3>🎁 {i18n.t('giftsReceived')}</h3>
            <div className="sketchy-gift-list">
              {receivedGifts.map((gift) => (
                <img
                  key={gift.id}
                  src={gift.gift_type}
                  alt="gift"
                  className="sketchy-gift"
                />
              ))}
            </div>
          </div>
        )}

        {!isCurrentUser && (
          <div className="send-gift-section" style={{ marginTop: 20 }}>
            <button
              className="sketchy-send-gift-btn"
              onClick={() => setShowGiftList((prev) => !prev)}
            >
              🎁 {i18n.t('sendGift')}
            </button>

            {showGiftList && (
              <div className="sketchy-gift-list-container">
                {giftList.map((giftUrl, index) => (
                  <div
                    key={index}
                    className="sketchy-gift-item"
                    onClick={() => handleSendGift(giftUrl, index)}
                  >
                    <img src={giftUrl} alt={`gift-${index}`} />
                    <span>
                      {formatCoins(giftCoinRequirements[index])}{' '}
                      {i18n.t('coins')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {status.alertMessage && (
          <SketchyAlert
            message={
              typeof status.alertMessage === 'object'
                ? status.alertMessage.text
                : status.alertMessage
            }
            onClose={() => setStatus((s) => ({ ...s, alertMessage: '' }))}
          />
        )}
        {showImageModal && (
          <div
            className="sketchy-image-modal"
            onClick={() => setShowImageModal(false)}
          >
            <div className="sketchy-blur-overlay" />
            <img
              src={userData.avatar || empty}
              alt="Full Avatar"
              className="sketchy-fullscreen-image"
            />
          </div>
        )}
      </div>
      {showPopup && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: '#ffffff',
            padding: '20px',
            textAlign: 'center',
            boxShadow: 'rgba(0,0,0,0.1) 0px 4px 12px',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <button
              onClick={handleInstall}
              style={{
                backgroundColor: '#111',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                fontSize: '16px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Install
            </button>
            <button
              onClick={handleCancel}
              style={{
                backgroundColor: '#f1f1f1',
                color: '#111',
                border: 'none',
                padding: '10px 20px',
                fontSize: '16px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
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
      <BannerAd />
      <Toaster />
    </>
  );
};

export default Profile;
