import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SketchyHeader from "../Components/SketchyHeader";
import SketchyAlert from "../Components/SketchyAlert";
import "../Styles/Profile.css";
import empty from "../Assets/empty.png";
import { supabase } from "../Utils/supabaseClient";
import toast, { Toaster } from "react-hot-toast";
import MosaicAvatar from "../Components/MosaicAvatar";

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

  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isCurrentUser = currentUser?.id?.toString() === id;

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
  const totalLikes = 400; // total blocks = total likes for 1:1 reveal
  const rows = 20;
  const cols = 20;

  const [likes, setLikes] = useState(0);

  // Build snake-like grid order
  const grid = [];
  let counter = 0;
  for (let r = rows - 1; r >= 0; r--) {
    // bottom to top
    if ((rows - r) % 2 === 1) {
      // left → right
      for (let c = 0; c < cols; c++) {
        grid.push({ row: r, col: c, index: counter++ });
      }
    } else {
      // right → left
      for (let c = cols - 1; c >= 0; c--) {
        grid.push({ row: r, col: c, index: counter++ });
      }
    }
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, imageFile: file }));
      // Optional: Set image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchUser = async () => {
    const { data, error } = await supabase
      .from("users")
      .select(
        "id, name, talked_to_count, bio, profile_pic, app_created, reward_coins, decency_rating"
      )
      .eq("id", id)
      .single();

    if (data && !error) {
      setUserData({
        ...data,
        avatar: data.profile_pic || empty,
      });
      setForm((prev) => ({
        ...prev,
        name: data.name || "",
        bio: data.bio || "",
      }));
    } else {
      console.error("Error fetching user:", error?.message);
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

  const uploadImage = async () => {
    if (!form.imageFile) return null;

    const fileExt = form.imageFile.name.split(".").pop();
    const fileName = `${id}_${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error } = await supabase.storage
      .from("profile-pics")
      .upload(filePath, form.imageFile, { upsert: true });

    if (error) {
      toast.error("Failed to upload image.");
      console.error("Upload error:", error.message);
      return null;
    }

    const { data } = supabase.storage
      .from("profile-pics")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleUpdate = async () => {
    setStatus((s) => ({ ...s, uploading: true }));
    let profilePicUrl = userData.avatar;

    if (form.imageFile) {
      const uploadedUrl = await uploadImage();
      if (uploadedUrl) profilePicUrl = uploadedUrl;
    }

    const { error } = await supabase
      .from("users")
      .update({ name: form.name, bio: form.bio, profile_pic: profilePicUrl })
      .eq("id", id);

    if (!error) {
      setUserData((u) => ({
        ...u,
        name: form.name,
        bio: form.bio,
        avatar: profilePicUrl,
      }));
      setStatus({ ...status, editing: false, uploading: false });
      setForm((f) => ({ ...f, imageFile: null }));
    } else {
      toast.error("Failed to update.");
      console.error("Failed to update:", error.message);
      setStatus((s) => ({ ...s, uploading: false }));
    }
  };

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

  if (!userData) {
    return (
      <>
        <SketchyHeader title="Profile" onBack={handleBack} />
        <div className="sketchy-profile-wrapper">
          <div className="sketchy-profile-tab">Loading Profile...</div>
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
                <button
                  className="sketchy-profile-update-btn"
                  onClick={() =>
                    status.editing
                      ? handleUpdate()
                      : setStatus((s) => ({ ...s, editing: true }))
                  }
                  disabled={status.uploading}
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
                  Get More Coins
                </button>
                <button
                  className="sketchy-logout-btn"
                  onClick={handleLogout}
                  style={{ marginTop: 10 }}
                >
                  Logout
                </button>
              </>
            )}
          </div>

          <div className="sketchy-profile-center">
            <MosaicAvatar src={userData.avatar} />
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
      <Toaster />
    </>
  );
};

export default Profile;
