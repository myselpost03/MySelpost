import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import "../Styles/ChatList.css";
import {
  FaCircle,
  FaMars,
  FaVenus,
  FaCheckCircle,
  FaEnvelope,
  FaThumbtack,
} from "react-icons/fa";
import empty from "../Assets/empty.png";
import { supabase } from "../Utils/supabaseClient";
import  LoadingIndicator  from "../Components/LoadingIndicator";

// Move user data into state
const initialUsers = [
  {
    id: 1,
    name: "Arjun Raj",
    country: "India",
    status: "online",
    gender: "male",
    avatar: "https://i.pravatar.cc/150?img=3",
    verified: true,
    notifications: 3,
    pinned: false,
  },
  {
    id: 2,
    name: "Sophia Lynn",
    country: "USA",
    status: "offline",
    gender: "female",
    avatar: "https://i.pravatar.cc/150?img=5",
    verified: true,
    notifications: 10,
    pinned: false,
  },
  {
    id: 3,
    name: "Kenji Ito",
    country: "Japan",
    status: "online",
    gender: "male",
    avatar: "https://i.pravatar.cc/150?img=11",
    verified: false,
    notifications: 5,
    pinned: false,
  },
  {
    id: 4,
    name: "Amira Noor",
    country: "UAE",
    status: "online",
    gender: "female",
    avatar: "https://i.pravatar.cc/150?img=7",
    verified: false,
    notifications: 6,
    pinned: false,
  },
  {
    id: 5,
    name: "Liam Zhao",
    country: "China",
    status: "offline",
    gender: "male",
    avatar: "https://i.pravatar.cc/150?img=8",
    verified: true,
    notifications: 1,
    pinned: false,
  },
  {
    id: 6,
    name: "Isla Byrne",
    country: "Ireland",
    status: "online",
    gender: "female",
    avatar: "https://i.pravatar.cc/150?img=9",
    verified: false,
    pinned: false,
  },
  {
    id: 7,
    name: "Carlos Mendez",
    country: "Mexico",
    status: "offline",
    gender: "male",
    avatar: "https://i.pravatar.cc/150?img=10",
    verified: false,
    pinned: false,
  },
  {
    id: 8,
    name: "Maya Patel",
    country: "India",
    status: "online",
    gender: "female",
    avatar: "https://i.pravatar.cc/150?img=12",
    verified: true,
    pinned: false,
  },
  {
    id: 9,
    name: "Yuki Arai",
    country: "Japan",
    status: "offline",
    gender: "female",
    avatar: "https://i.pravatar.cc/150?img=14",
    verified: false,
  },
  {
    id: 10,
    name: "Leo Rossi",
    country: "Italy",
    status: "online",
    gender: "male",
    avatar: "https://i.pravatar.cc/150?img=15",
    verified: true,
  },
];

const ChatList = () => {
  const [users, setUsers] = useState([]);
  const [genderFilter, setGenderFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showGenderTabs, setShowGenderTabs] = useState(false);
  const [showCountryTabs, setShowCountryTabs] = useState(false);
  const [loading, setLoading] = useState(true);

  const countries = [...new Set(users?.map((u) => u.country))];

  const handleUserClick = (clickedId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === clickedId ? { ...user, notifications: 0 } : user
      )
    );
  };

  useEffect(() => {
    const fetchUsers = async () => {
  const { data: allUsers, error } = await supabase
    .from("users")
    .select("id, name, profile_pic, country, gender, status");

  const user = JSON.parse(localStorage.getItem("user"));

  let pinnedIds = [];
  if (user) {
    const { data: pinnedData, error: pinnedError } = await supabase
      .from("pinned_users")
      .select("pinned_user_id")
      .eq("user_id", user.id);

    if (!pinnedError && pinnedData) {
      pinnedIds = pinnedData.map((row) => row.pinned_user_id);
    }
  }

  if (error) {
    console.error("Error fetching users:", error.message);
  } else {
    const processed = allUsers.map((user) => ({
      ...user,
      avatar:
        user.profile_pic ||
       empty +
          user.id,
      notifications: user.notifications || 0,
      pinned: pinnedIds.includes(user.id),
      status: user.status || "offline",
    }));
    setUsers(processed);
  }

  setLoading(false);
};

    fetchUsers();
  }, []);

  const navigate = useNavigate();

  const handleProtectedNavigation = (e, path, targetUser = null) => {
    e.preventDefault();
    const isLoggedIn = localStorage.getItem("user");

    if (isLoggedIn) {
      navigate(path, { state: { targetUser } }); // 👈 Pass clicked user to next screen
    } else {
      navigate("/register");
    }
  };

  const filteredUsers = users
    .filter((user) => {
      const genderMatch =
        genderFilter === "all" || user.gender === genderFilter;
      const countryMatch =
        countryFilter === "all" || user.country === countryFilter;
      const searchMatch = user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const pinMatch = activeTab === "pinned" ? user.pinned : true;
      return genderMatch && countryMatch && searchMatch && pinMatch;
    })
    .sort((a, b) => {
      if (a.status === "online" && b.status !== "online") return -1;
      if (a.status !== "online" && b.status === "online") return 1;

      const getPriority = (u) => {
        if (u.verified && u.notifications > 0) return 4000;
        if (!u.verified && u.notifications > 0) return 3000;
        if (u.verified && !u.notifications) return 2000;
        return 1000;
      };

      const priorityA = getPriority(a);
      const priorityB = getPriority(b);

      return priorityB - priorityA;
    });

const togglePin = async (targetUserId) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const alreadyPinned = users.find(
    (u) => u.id === targetUserId && u.pinned
  );

  if (alreadyPinned) {
    // Unpin
    const { error } = await supabase
      .from("pinned_users")
      .delete()
      .match({ user_id: user.id, pinned_user_id: targetUserId });

    if (!error) {
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === targetUserId ? { ...u, pinned: false } : u
        )
      );
    } else {
      console.error("Error unpinning:", error.message);
    }
  } else {
    // Pin
    const { error } = await supabase.from("pinned_users").insert([
      { user_id: user.id, pinned_user_id: targetUserId },
    ]);

    if (!error) {
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === targetUserId ? { ...u, pinned: true } : u
        )
      );
    } else {
      console.error("Error pinning:", error.message);
    }
  }
};


  return (
    <div className="chatlist-container">
      <Header />
      <h2 className="chatlist-title">🖋️ Your Circles</h2>
{loading ? (
      <LoadingIndicator />
    ) : (<>
      <input
        type="text"
        className="sketchy-search"
        placeholder="🔍 Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="tab-bar">
        <button
          className={`sketchy-tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          className={`sketchy-tab ${activeTab === "pinned" ? "active" : ""}`}
          onClick={() => setActiveTab("pinned")}
        >
          📌 Pinned
        </button>
        <button
          className="sketchy-tab"
          onClick={() => {
            setShowGenderTabs(true);
            setShowCountryTabs(false);
          }}
        >
          Gender ▼
        </button>
        <button
          className="sketchy-tab"
          onClick={() => {
            setShowCountryTabs(true);
            setShowGenderTabs(false);
          }}
        >
          Country ▼
        </button>
      </div>

      <div className="sketchy-list-scrollable">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Link
              to="#"
              key={user.id}
              className={`user-card ${
                user.notifications > 0 ? "has-notification" : ""
              }`}
              onClick={(e) => {
                handleUserClick(user.id);
                handleProtectedNavigation(e, `/chat/${user.id}`, user);
              }}
            >
              <div className="user-avatar-wrapper">
                <Link to={`/profile/${user.id}`}>
                  {user.img ? (
                    <img
                      src={user.avatar}
                      alt="white area"
                      className="user-avatar"
                    />
                  ) : (
                    <img src={empty} alt="whie area" className="user-avatar" />
                  )}
                </Link>
                {user.notifications > 0 && (
                  <span className="sketchy-badge">{user.notifications}</span>
                )}
              </div>

              <div className="user-info">
                <div className="user-top-row">
                  <span className="user-name">{user.name}</span>
                  {user.verified && <FaCheckCircle className="verified-icon" />}
                </div>

                <div className="user-bottom-row">
                  <span className="country">
                    {user.country ? user.country : "Hidden"}
                  </span>
                  {user.gender === "male" ? (
                    <FaMars className="gender-icon male" />
                  ) : (
                    <FaVenus className="gender-icon female" />
                  )}
                  <span
                    className={`status-dot ${
                      user.status === "online" ? "online" : "offline"
                    }`}
                  >
                    <FaCircle />
                  </span>

                  <div className="spacer" />
                  <FaThumbtack
                    className={`pin-icon ${user.pinned ? "pinned" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      togglePin(user.id);
                    }}
                  />
                  <FaEnvelope
                    className="dm-envelope"
                    onClick={(e) =>
                      handleProtectedNavigation(e, `/chat/${user.id}`, user)
                    }
                  />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-pinned-users">
            <img
              src="https://cdn4.iconfinder.com/data/icons/essentials-72/24/031_-_Pin-64.png"
              alt="No pinned users"
              className="empty-state-image"
              style={{
                maxWidth: "300px",
                margin: "2rem auto",
                display: "block",
              }}
            />
            <p
              style={{ textAlign: "center", fontSize: "1.2rem", color: "#555" }}
            >
              No pinned users yet. Start pinning to keep your favorites close!
              📌
            </p>
          </div>
        )}
      </div>

      {/* Modal for Gender Filter */}
      {showGenderTabs && (
        <div
          className="modal-backdrop"
          onClick={() => setShowGenderTabs(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Choose Gender</h3>
            <button
              className={`modal-btn ${genderFilter === "all" ? "active" : ""}`}
              onClick={() => {
                setGenderFilter("all");
                setShowGenderTabs(false);
              }}
            >
              All Genders
            </button>
            <button
              className={`modal-btn ${genderFilter === "male" ? "active" : ""}`}
              onClick={() => {
                setGenderFilter("male");
                setShowGenderTabs(false);
              }}
            >
              ♂️ Male
            </button>
            <button
              className={`modal-btn ${
                genderFilter === "female" ? "active" : ""
              }`}
              onClick={() => {
                setGenderFilter("female");
                setShowGenderTabs(false);
              }}
            >
              ♀️ Female
            </button>
          </div>
        </div>
      )}

      {/* Modal for Country Filter */}
      {showCountryTabs && (
        <div
          className="modal-backdrop"
          onClick={() => setShowCountryTabs(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Choose Country</h3>
            <button
              className={`modal-btn ${countryFilter === "all" ? "active" : ""}`}
              onClick={() => {
                setCountryFilter("all");
                setShowCountryTabs(false);
              }}
            >
              All Countries
            </button>
            {countries.map((country, i) => (
              <button
                key={i}
                className={`modal-btn ${
                  countryFilter === country ? "active" : ""
                }`}
                onClick={() => {
                  setCountryFilter(country);
                  setShowCountryTabs(false);
                }}
              >
                {country}
              </button>
            ))}
          </div>
        </div>
      )}
      </>
  )}
    </div>
  );
};

export default ChatList;
