import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import "../Styles/ChatList.css";
import {
  FaCircle,
  FaMars,
  FaVenus,
  FaCheckCircle,
  FaEnvelope,
} from "react-icons/fa";

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
  },
  {
    id: 6,
    name: "Isla Byrne",
    country: "Ireland",
    status: "online",
    gender: "female",
    avatar: "https://i.pravatar.cc/150?img=9",
    verified: false,
  },
  {
    id: 7,
    name: "Carlos Mendez",
    country: "Mexico",
    status: "offline",
    gender: "male",
    avatar: "https://i.pravatar.cc/150?img=10",
    verified: false,
  },
  {
    id: 8,
    name: "Maya Patel",
    country: "India",
    status: "online",
    gender: "female",
    avatar: "https://i.pravatar.cc/150?img=12",
    verified: true,
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
  const [users, setUsers] = useState(initialUsers);
  const [genderFilter, setGenderFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const countries = [...new Set(users.map((u) => u.country))];

  const handleUserClick = (clickedId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === clickedId ? { ...user, notifications: 0 } : user
      )
    );
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
      return genderMatch && countryMatch && searchMatch;
    })
    .sort((a, b) => {
      // ✅ Step 1: Show online users first
      if (a.status === "online" && b.status !== "online") return -1;
      if (a.status !== "online" && b.status === "online") return 1;

      // ✅ Step 2: Then apply priority logic
      const getPriority = (u) => {
        if (u.verified && u.notifications > 0) return 4000;
        if (!u.verified && u.notifications > 0) return 3000;
        if (u.verified && !u.notifications) return 2000;
        return 1000;
      };

      const priorityA = getPriority(a);
      const priorityB = getPriority(b);

      if (priorityA !== priorityB) return priorityB - priorityA;

      // Optional: tiebreaker by number of notifications
      return (b.notifications || 0) - (a.notifications || 0);
    });

  return (
    <div className="chatlist-container">
      <Header />
      <h2 className="chatlist-title">🖋️ Your Circles</h2>

      <input
        type="text"
        className="sketchy-search"
        placeholder="🔍 Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="filter-bar">
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
        >
          <option value="all">All Genders</option>
          <option value="male">♂️ Male</option>
          <option value="female">♀️ Female</option>
        </select>

        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
        >
          <option value="all">All Countries</option>
          {countries.map((country, i) => (
            <option key={i} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <div className="sketchy-list-scrollable">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className={`user-card ${
              user.notifications > 0 ? "has-notification" : ""
            }`}
            onClick={() => handleUserClick(user.id)}
          >
            <div className="user-avatar-wrapper">
              <img src={user.avatar} alt={user.name} className="user-avatar" />
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
                <span className="country">{user.country}</span>
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
                <Link to="/chat" className="dm-link">
                  <FaEnvelope />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
