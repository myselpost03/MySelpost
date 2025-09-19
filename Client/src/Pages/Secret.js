import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import { supabase } from "../Utils/supabaseClient";
import i18n from "../i18n";
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
    if (seconds < 5) return i18n.t("justNow");
    if (seconds < 60) return `${seconds} ${i18n.t("sec")} ${i18n.t("ago")}`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} ${i18n.t("min")} ${i18n.t("ago")}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${i18n.t("hour")}${hours > 1 ? "s" : ""} ${i18n.t("ago")}`;
    const days = Math.floor(hours / 24);
    return `${days} ${i18n.t("day")}${days > 1 ? "s" : ""} ${i18n.t("ago")}`;
  };

  return (
    <>
      <Header />
      <div className="secret-container">
        <h1 className="secret-title">{i18n.t("writeSecret")}</h1>

        <form onSubmit={handleSubmit} className="secret-form">
          <textarea
            placeholder={i18n.t("secretPlaceholder")}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="secret-textarea"
          />
          <button type="submit" className="secret-btn">
            {i18n.t("submitSecret")}
          </button>
        </form>

        <p className="secret-hint">{i18n.t("secretNote")} 🤫</p>

        <div className="secret-list">
          {submittedSecrets.map((s) => (
            <div key={s.id} className="secret-item">
              <span className="secret-text">{s.text}</span>
              <span className="secret-time">{timeAgo(s.created_at)}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Secret;
