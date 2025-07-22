import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SketchyHeader from "../Components/SketchyHeader";
import "../Styles/Profile.css";
import empty from "../Assets/empty.png";
import { supabase } from "../Utils/supabaseClient";
import SketchyAlert from "../Components/SketchyAlert";

const Profile = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [sendingGift, setSendingGift] = useState(false);
  const [receivedGifts, setReceivedGifts] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  const giftList = [
    "https://images.icon-icons.com/1478/PNG/96/bouquet_101953.png",
    "https://cdn1.iconfinder.com/data/icons/DarkGlass_Reworked/128x128/apps/beryl-manager.png", // Flower
    "https://cdn1.iconfinder.com/data/icons/icons-for-a-site-1/64/advantage_deliver-64.png", // Gift Box
    "https://cdn0.iconfinder.com/data/icons/icecandy-psd/256/icecandy-chocolate.png", // Chocolate
    "https://cdn1.iconfinder.com/data/icons/icons-for-a-site-1/64/advantage_quality-64.png", // Party Hat
    "https://images.icon-icons.com/327/PNG/256/Clown_Impish_35102.png",
  ];

  const giftCoinRequirements = [50, 300, 150, 10, 400, 100];

  const isCurrentUser = currentUser?.id?.toString() === id;

  const handleBack = () => {
    navigate(-1);
  }

  const fetchUser = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, bio, profile_pic, app_created, reward_coins")
      .eq("id", id)
      .single();

    if (!error) {
      setUser({
        ...data,
        avatar: data.profile_pic || empty,
      });
      setName(data.name || "");
      setBio(data.bio || "");
    } else {
      console.error("Error fetching user:", error.message);
    }
  };

  const fetchGifts = async () => {
    const receiverId = isCurrentUser ? currentUser.id : id;

    const { data, error } = await supabase
      .from("gifts")
      .select("id, sender_id, gift_type, created_at")
      .eq("receiver_id", receiverId)
      .order("created_at", { ascending: false });

    if (!error) {
      setReceivedGifts(data);
    } else {
      console.error("Error fetching gifts:", error.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
      fetchGifts();
    }
  }, [id]);

const handleSendGift = async (giftUrl, index) => {
  if (sendingGift || !user) return;

  // ✅ Refetch latest user coin balance
  const { data: updatedUser, error: userError } = await supabase
    .from("users")
    .select("reward_coins")
    .eq("id", currentUser.id)
    .single();

  if (userError || !updatedUser) {
    console.error("Failed to fetch updated user coins:", userError?.message);
    return;
  }

  const requiredCoins = giftCoinRequirements[index];
  const currentCoins = updatedUser.reward_coins;

  if (currentCoins < requiredCoins) {
    setAlertMessage({
      text: `❌ You need ${requiredCoins} coins to send this gift.`,
      withButton: true,
    });
    return;
  }

  setSendingGift(true);

  // 🪙 Deduct coins
  const { error: coinUpdateError } = await supabase
    .from("users")
    .update({ reward_coins: currentCoins - requiredCoins })
    .eq("id", currentUser.id);

  if (coinUpdateError) {
    console.error("Failed to deduct coins:", coinUpdateError.message);
    setSendingGift(false);
    return;
  }

  // 🎁 Insert gift
  const { error: giftError } = await supabase.from("gifts").insert([
    {
      sender_id: currentUser.id,
      receiver_id: id,
      gift_type: giftUrl,
    },
  ]);

  if (giftError) {
    console.error("Gift send error:", giftError.message);
  } else {
    setAlertMessage("🎁 Gift sent successfully!");
    await fetchGifts();
    await fetchUser(); // ✅ Update coin UI in real-time
  }

  setSendingGift(false);
};



  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    window.location.href = "/"; // redirect to homepage or login
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${id}_${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from("profile-pics")
      .upload(filePath, imageFile, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      return null;
    }

    const { data } = supabase.storage
      .from("profile-pics")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleUpdate = async () => {
    setUploading(true);

    let profilePicUrl = user.avatar;
    if (imageFile) {
      const uploadedUrl = await uploadImage();
      if (uploadedUrl) profilePicUrl = uploadedUrl;
    }

    const { error } = await supabase
      .from("users")
      .update({ name, bio, profile_pic: profilePicUrl })
      .eq("id", id);

    if (!error) {
      setUser((prev) => ({ ...prev, name, bio, avatar: profilePicUrl }));
      setEditing(false);
      setImageFile(null);
    } else {
      console.error("Failed to update:", error.message);
    }

    setUploading(false);
  };

  if (!user) {
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
            {editing ? (
              <>
                <input
                  className="sketchy-profile-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <textarea
                  className="sketchy-profile-textarea"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </>
            ) : (
              <>
                <h2 className="sketchy-profile-name">{user.name}</h2>
                <p className="sketchy-profile-bio">
                  {user.bio || "No bio yet."}
                </p>
              </>
            )}

            <div className="sketchy-profile-stats-row">
              <p className="sketchy-profile-app-count">
                Apps Created: {user.appCreated || 0}
              </p>
              <p className="sketchy-profile-coin-count">
                Coins: {user.reward_coins || 0}
              </p>
            </div>

            {isCurrentUser && (
              <>
                <button
                  className="sketchy-profile-update-btn"
                  onClick={() => (editing ? handleUpdate() : setEditing(true))}
                  disabled={uploading}
                >
                  {editing
                    ? uploading
                      ? "Saving..."
                      : "Save Profile"
                    : "Update Profile"}
                </button>

                <button
                  className="sketchy-logout-btn"
                  onClick={handleLogout}
                  style={{ marginTop: "10px" }}
                >
                  Logout
                </button>
              </>
            )}
          </div>

          <div className="sketchy-profile-center">
            <img
              src={user.avatar}
              alt="Avatar"
              className="sketchy-profile-avatar"
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
          <div className="floating-gifts-container">
            {giftList.map((giftUrl, index) => (
              <img
                key={index}
                src={giftUrl}
                alt={`gift-${index}`}
                className="floating-gift"
                onClick={() => !sendingGift && handleSendGift(giftUrl, index)}
                title="Send gift"
              />
            ))}
          </div>
        )}
        {alertMessage && typeof alertMessage === "object" ? (
          <SketchyAlert
            message={alertMessage.text}
            onClose={() => setAlertMessage("")}
            buttonText="Get More Coins"
            onButtonClick={() => {
              setAlertMessage("");
              navigate(`/coins/${currentUser.id}`);
            }}
          />
        ) : (
          alertMessage && (
            <SketchyAlert
              message={alertMessage}
              onClose={() => setAlertMessage("")}
            />
          )
        )}
      </div>
    </>
  );
};

export default Profile;
