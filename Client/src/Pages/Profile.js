import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../Components/Header";
import "../Styles/Profile.css";
import empty from "../Assets/empty.png";
import { supabase } from "../Utils/supabaseClient";

const Profile = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const isCurrentUser = currentUser?.id?.toString() === id;

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, bio, profile_pic, app_created")
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

    if (id) fetchUser();
  }, [id]);

  const handleLogout = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem("user");
  window.location.href = "/"; // redirect to homepage or login
};


  const uploadImage = async () => {
    if (!imageFile) return null;

    const fileExt = imageFile.name.split('.').pop();
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
      <div className="sketchy-profile-wrapper">
        <Header />
        <div className="sketchy-profile-tab">Loading Profile...</div>
      </div>
    );
  }

  return (
    <div className="sketchy-profile-wrapper">
      <Header />
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
              <p className="sketchy-profile-bio">{user.bio || "No bio yet."}</p>
            </>
          )}

          <p className="sketchy-profile-app-count">
            Apps Created: {user.appsCreated || 0}
          </p>

         {isCurrentUser && (
  <>
    <button
      className="sketchy-profile-update-btn"
      onClick={() => (editing ? handleUpdate() : setEditing(true))}
      disabled={uploading}
    >
      {editing ? (uploading ? "Saving..." : "Save Profile") : "Update Profile"}
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
    </div>
  );
};

export default Profile;
