import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import { supabase } from "../Utils/supabaseClient";
import "../Styles/Secret.css";

const Secret = () => {
  const [secret, setSecret] = useState("");
  const [submittedSecrets, setSubmittedSecrets] = useState([]);
  const [now, setNow] = useState(new Date());

  // Update "now" every second to refresh timestamps
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch secrets from Supabase on mount
  useEffect(() => {
    const fetchSecrets = async () => {
      const { data, error } = await supabase
        .from("secrets")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) {
        setSubmittedSecrets(data);
      }
    };
    fetchSecrets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (secret.trim() !== "") {
      // Insert into Supabase
      const { data, error } = await supabase
        .from("secrets")
        .insert([{ text: secret }])
        .select();

      if (!error && data.length > 0) {
        setSubmittedSecrets([data[0], ...submittedSecrets]);
        setSecret("");
      }
    }
  };

  // Function to get human-readable time
  const timeAgo = (date) => {
    const seconds = Math.floor((now - new Date(date)) / 1000);
    if (seconds < 5) return "just now";
    if (seconds < 60) return `${seconds} sec ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <>
    <Header />
    <div className="secret-container">
      
      <h1 className="secret-title">Write Your Secret</h1>

      <form onSubmit={handleSubmit} className="secret-form">
        <textarea
          placeholder="Type your secret here..."
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="secret-textarea"
        />
        <button type="submit" className="secret-btn">
          Submit Secret
        </button>
      </form>

      <p className="secret-hint">Your secret will remain anonymous 🤫</p>

      <div className="secret-list">
        {submittedSecrets.map((s) => (
          <div key={s.id} className="secret-item">
            <span className="secret-text">{s.text}</span>
            <span className="secret-time">{timeAgo(s.created_at)}</span>
          </div>
        ))}
      </div>
    </div></>
  );
};

export default Secret;
