import React, { useState } from 'react';
import Header from '../Components/Header';
import '../Styles/Profile.css';

const Profile = ({ isCurrentUser = true, user = {
  name: "Anuj Rajput",
  bio: "Creative Developer. Loves sketchy UIs.",
  appsCreated: 7,
  avatar: "https://i.pravatar.cc/150?img=12"
} }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);

  const handleUpdate = () => {
    setEditing(false);
    // handle update logic here (API call, etc.)
    console.log("Updated name:", name, "Updated bio:", bio);
  };

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
            </>
          ) : (
            <>
              <h2 className="sketchy-profile-name">{name}</h2>
              <p className="sketchy-profile-bio">{bio}</p>
            </>
          )}
          <p className="sketchy-profile-app-count">Apps Created: {user.appsCreated}</p>

          {isCurrentUser && (
            <button
              className="sketchy-profile-update-btn"
              onClick={() => (editing ? handleUpdate() : setEditing(true))}
            >
              {editing ? "Save Profile" : "Update Profile"}
            </button>
          )}
        </div>

        <div className="sketchy-profile-center">
          <img src={user.avatar} alt="Avatar" className="sketchy-profile-avatar" />
        </div>
      </div>
    </div>
  );
};

export default Profile;
