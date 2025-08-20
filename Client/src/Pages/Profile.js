import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SketchyHeader from "../Components/SketchyHeader";
import SketchyAlert from "../Components/SketchyAlert";
import "../Styles/Profile.css";
import empty from "../Assets/empty.png";
import { supabase, supabaseStorage } from "../Utils/supabaseClient";
import toast, { Toaster } from "react-hot-toast";
import { openDB } from "idb";
import MosaicAvatar from "../Components/MosaicAvatar";
import imageCompression from "browser-image-compression";
import { trackEvent } from "../Utils/analytics";
import LoadingSpinner from "../Components/LoadingSpinner";
import { dbPromise } from "../Utils/db";

const giftList = [
  "https://images.icon-icons.com/1478/PNG/96/bouquet_101953.png",
  "https://cdn1.iconfinder.com/data/icons/DarkGlass_Reworked/128x128/apps/beryl-manager.png",
  "https://cdn1.iconfinder.com/data/icons/icons-for-a-site-1/64/advantage_deliver-64.png",
  "https://cdn0.iconfinder.com/data/icons/icecandy-psd/256/icecandy-chocolate.png",
  "https://cdn1.iconfinder.com/data/icons/icons-for-a-site-1/64/advantage_quality-64.png",
  "https://images.icon-icons.com/327/PNG/256/Clown_Impish_35102.png",
];

const giftCoinRequirements = [50, 300, 150, 10, 400, 100];

const Profile = () => {
  const [showImageModal, setShowImageModal] = useState(false);
  // Add new state
  const [showGiftList, setShowGiftList] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isCurrentUser = currentUser?.id?.toString() === id;
  const currentUserId = currentUser?.id;
  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({ name: "", bio: "", imageFile: null });
  const [status, setStatus] = useState({
    editing: false,
    uploading: false,
    sendingGift: false,
    alertMessage: "",
  });
  const [receivedGifts, setReceivedGifts] = useState([]);

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
      console.error("Image compression failed:", err);
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

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("✅ User accepted the install");
    } else {
      console.log("❌ User dismissed the install");
    }

    setDeferredPrompt(null);
    setShowPopup(false);
    const { data, error } = await supabase
      .from("users")
      .update({ installed_app: true })
      .eq("id", currentUserId);

    if (error) {
      console.error("Error updating field:", error);
    } else {
      console.log("Updated field:", data);
    }
    // Track install click
    trackEvent({
      action: "button_click",
      category: "Install Popup",
      label: "Install App",
    });
  };

  const handleCancel = () => {
    setShowPopup(false);
    setDeferredPrompt(null);

    // Track cancel click
    window.gtag?.("event", "click", {
      event_category: "Install Popup",
      event_label: "Cancel Button",
      value: 1,
    });
  };

  // 🔹 Utility for saving a single user into IndexedDB
  const saveUserToIDB = async (user) => {
    const db = await dbPromise;
    try {
      // Only cache if user has a Supabase storage URL (not raw Google avatar)
      if (user.profile_pic && !user.google_login) {
        const response = await fetch(user.profile_pic);
        const blob = await response.blob();
        await db.put("profile_pics", { id: user.id, blob });
      }

      // Special case: Google user who has updated profile_pic in Supabase
      if (
        user.profile_pic &&
        user.google_login &&
        user.profile_pic.includes("supabase.co")
      ) {
        const response = await fetch(user.profile_pic);
        const blob = await response.blob();
        await db.put("profile_pics", { id: user.id, blob });
      }

      await db.put("users", user);
    } catch (err) {
      console.error("⚠️ saveUserToIDB error:", err);
    }
  };

  const fetchUser = async () => {
    try {
      const isGoogleUser = currentUser?.google_login;

      const { data, error } = await supabase
        .from("users")
        .select(
          "id, name, talked_to_count, bio, profile_pic, reward_coins, decency_rating"
        )
        .eq("id", id)
        .single();

      if (!error && data) {
        let avatar = empty;
        const db = await openDB("UserDB", 1);
        const cached = await db.get("profile_pics", data.id);

        if (isGoogleUser) {
          if (data.profile_pic?.includes("supabase")) {
            // ✅ Supabase-hosted → cache & use
            if (!cached || cached.url !== data.profile_pic) {
              await saveUserToIDB(data); // overwrite old one
              //console.log("♻️ Updated Google-user pic in IndexedDB");
            }
            avatar = cached?.blob
              ? URL.createObjectURL(cached.blob)
              : data.profile_pic;
          } else {
            // ✅ Original Google pic → no caching
            avatar = data.profile_pic || empty;
          }
        } else {
          // ✅ Non-Google user
          if (!cached || cached.url !== data.profile_pic) {
            await saveUserToIDB(data); // overwrite old pic
            //console.log("♻️ Updated non-Google-user pic in IndexedDB");
          }
          avatar = cached?.blob
            ? URL.createObjectURL(cached.blob)
            : data.profile_pic || empty;
        }

        setUserData({
          ...data,
          avatar,
        });

        setForm((prev) => ({
          ...prev,
          name: data.name || "",
          bio: data.bio || "",
        }));

        //console.log("✅ User fetched successfully");
      } else {
        console.error("❌ Error fetching user:", error?.message);
        setUserData({ avatar: empty, name: "", bio: "" });
      }
    } catch (err) {
      console.error("⚠️ fetchUser error:", err);
      setUserData({ avatar: empty, name: "", bio: "" });
    }
  };

  // 🔹 Handle Update
  const handleUpdate = async () => {
    setStatus((s) => ({ ...s, uploading: true }));
    let profilePicUrl = userData.avatar;

    try {
      // 1️⃣ Upload new image if selected
      if (form.imageFile) {
        const fileExt = form.imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabaseStorage.storage
          .from("profile-pics")
          .upload(filePath, form.imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabaseStorage.storage
          .from("profile-pics")
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          profilePicUrl = publicUrlData.publicUrl;
        }
      }

      // 2️⃣ Update user in Supabase
      const { data: updatedUser, error } = await supabase
        .from("users")
        .update({
          name: form.name,
          bio: form.bio,
          profile_pic: profilePicUrl,
        })
        .eq("id", id)
        .select()
        .single();

      if (!error && updatedUser) {
        // 3️⃣ Save/Update IndexedDB (only for non-google OR google after update)
        if (!currentUser?.google_login || profilePicUrl.includes("supabase")) {
          await saveUserToIDB(updatedUser);
        }

        // 4️⃣ Update UI immediately
        setUserData((u) => ({
          ...u,
          name: form.name,
          bio: form.bio,
          avatar: profilePicUrl,
        }));

        setStatus({ ...status, editing: false, uploading: false });
        setForm((f) => ({ ...f, imageFile: null }));
        toast.success("Profile Updated!");

        //console.log("✅ User updated in Supabase + IndexedDB");
      } else {
        toast.error("Failed to update.");
        console.error("❌ Update failed:", error?.message);
        setStatus((s) => ({ ...s, uploading: false }));
      }
    } catch (err) {
      toast.error("Something went wrong while uploading image.");
      console.error("⚠️ Update error:", err);
      setStatus((s) => ({ ...s, uploading: false }));
    }
  };

  const fetchGifts = async () => {
    const receiverId = isCurrentUser ? currentUser.id : id;
    const { data, error } = await supabase
      .from("gifts")
      .select("id, sender_id, gift_type, created_at")
      .eq("receiver_id", receiverId)
      .order("created_at", { ascending: false });

    if (data && !error) setReceivedGifts(data);
    else console.error("Error fetching gifts:", error?.message);
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
      .from("users")
      .select("reward_coins")
      .eq("id", currentUser.id)
      .single();

    if (error || !data) return;

    const currentCoins = data.reward_coins;
    const requiredCoins = giftCoinRequirements[index];

    if (currentCoins < requiredCoins) {
      return setStatus({
        ...status,
        alertMessage: {
          text: `❌ You need ${requiredCoins} coins to send this gift.`,
          withButton: true,
        },
      });
    }

    setStatus((s) => ({ ...s, sendingGift: true }));

    const { error: coinError } = await supabase
      .from("users")
      .update({ reward_coins: currentCoins - requiredCoins })
      .eq("id", currentUser.id);

    if (coinError) {
      console.error("Coin deduction error:", coinError.message);
      return setStatus((s) => ({ ...s, sendingGift: false }));
    }

    const { error: giftError } = await supabase
      .from("gifts")
      .insert([
        { sender_id: currentUser.id, receiver_id: id, gift_type: giftUrl },
      ]);

    if (!giftError) {
      setStatus({
        ...status,
        alertMessage: "🎁 Gift sent successfully!",
        sendingGift: false,
      });
      await fetchGifts();
      await fetchUser();
    } else {
      console.error("Gift send error:", giftError.message);
      setStatus((s) => ({ ...s, sendingGift: false }));
    }
  };

  const handleLogout = async () => {
    localStorage.clear();
    window.location.href = "/";
    //  localStorage.removeItem("user");
    //  localStorage.removeItem("activeTab");
  };

  const handleCoins = () => navigate(`/coins/${currentUser.id}`);

  const handleSettings = () => {
    navigate('/settings')
  }

  if (!userData) {
    return (
      <>
        <SketchyHeader title="Profile" onBack={handleBack} />
        <div>
          <LoadingSpinner /> {/* <-- show loading spinner */}
        </div>
      </>
    );
  }

  return (
    <>
      <SketchyHeader title="Profile" onBack={handleBack} />
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
                      document.getElementById("sketchy-file-input").click()
                    }
                  >
                    {form.imageFile ? form.imageFile.name : "Change Profile"}
                  </button>
                  <input
                    id="sketchy-file-input"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>
              </>
            ) : (
              <>
                <h2 className="sketchy-profile-name">{userData.name}</h2>
                <p className="sketchy-profile-bio">
                  {userData.bio || "No bio yet."}
                </p>
              </>
            )}

            <div className="sketchy-profile-stats-row">
              <p>
                Conversations:
                <span className="sketchy-stat-value">
                  {userData.talked_to_count || 0}
                </span>
              </p>
              <p>
                Coins:
                <span className="sketchy-stat-value">
                  {userData.reward_coins || 0}
                </span>
              </p>
            </div>

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
                        ? "Saving..."
                        : "Save Profile"
                      : "Update Profile"}
                  </button>
                  <button
                    className="sketchy-coin-btn-new"
                    onClick={handleCoins}
                    style={{ marginTop: 10 }}
                  >
                    Get Coins
                  </button>
                  <button
                    className="sketchy-install-btn"
                    onClick={() => setShowPopup(true)}
                    disabled={!deferredPrompt}
                    style={{ marginTop: 10 }}
                  >
                    Install App
                  </button>
                  <button
                    className="sketchy-logout-btn"
                    onClick={handleLogout}
                    style={{ marginTop: 10 }}
                  >
                    Logout
                  </button>
                </div>
                <button className="settings-btn" onClick={handleSettings}>
                  <span className="gear">&#9881;</span>{" "}
                  {/* Unicode gear icon */}
                  <span className="text">Settings</span>
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
          </div>
        </div>

        {receivedGifts.length > 0 && (
          <div className="sketchy-gift-section">
            <h3>🎁 Gifts Received</h3>
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
              🎁 Send Gift
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
                    <span>{giftCoinRequirements[index]} coins</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {status.alertMessage && (
          <SketchyAlert
            message={
              typeof status.alertMessage === "object"
                ? status.alertMessage.text
                : status.alertMessage
            }
            onClose={() => setStatus((s) => ({ ...s, alertMessage: "" }))}
          />
        )}
        {showImageModal && (
          <div
            className="sketchy-image-modal"
            onClick={() => setShowImageModal(false)}
          >
            <div className="sketchy-blur-overlay" />
            <img
              src={userData.avatar}
              alt="Full Avatar"
              className="sketchy-fullscreen-image"
            />
          </div>
        )}
      </div>
      {showPopup && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: "#ffffff",
            padding: "20px",
            textAlign: "center",
            boxShadow: "rgba(0,0,0,0.1) 0px 4px 12px",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <button
              onClick={handleInstall}
              style={{
                backgroundColor: "#03c988",
                color: "#ffffff",
                border: "none",
                padding: "10px 20px",
                fontSize: "16px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Install
            </button>
            <button
              onClick={handleCancel}
              style={{
                backgroundColor: "#ff6666",
                color: "#ffffff",
                border: "none",
                padding: "10px 20px",
                fontSize: "16px",
                borderRadius: "4px",
                cursor: "pointer",
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

      <Toaster />
    </>
  );
};

export default Profile;
