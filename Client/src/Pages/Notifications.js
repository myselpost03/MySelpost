import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Utils/supabaseClient";
import SketchyHeader from "../Components/SketchyHeader";
import LoadingSpinner from "../Components/LoadingSpinner";
import heart from "../Assets/heart.png";
import i18n from "../i18n";
import "../Styles/Notifications.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // track pages
  const [hasMore, setHasMore] = useState(true); // check if more notifications exist

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchNotifications = async (pageNum = 0) => {
    try {
      setLoading(true);

      // --- Fetch Likes only ---
      const { data: likes, error: likesError } = await supabase
        .from("likes")
        .select(
          `
        id,
        created_at,
        liked_by,
        users:liked_by (name)
      `
        )
        .eq("user_id", currentUser.id);

      if (likesError) throw likesError;

      const formattedLikes = (likes || []).map((l) => ({
        id: `like-${l.id}`,
        type: "like",
        created_at: l.created_at,
        name: l.users?.name || i18n.t("someone"),
      }));

      // --- Sort by date ---
      const sortedLikes = formattedLikes.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      // --- Pagination (slice manually) ---
      const start = pageNum * 10;
      const end = start + 10;
      const paginated = sortedLikes.slice(start, end);

      // Append or replace depending on page
      if (pageNum === 0) {
        setNotifications(paginated);
      } else {
        setNotifications((prev) => [...prev, ...paginated]);
      }

      // If less than 10 fetched → no more notifications
      setHasMore(sortedLikes.length > end);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage);
  };

  useEffect(() => {
    if (currentUser.id) {
      setPage(0);
      fetchNotifications(0);
    }
  }, [currentUser.id]);

  const handleBack = () => navigate(-1);

  // Helper for time
  const timeAgo = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1)
      return interval === 1 ? "1 year ago" : `${interval} years ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1)
      return interval === 1
        ? `1 ${i18n.t("month")} ${i18n.t("ago")} `
        : `${interval} months ${i18n.t("ago")} `;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1)
      return interval === 1
        ? `1 ${i18n.t("day")} ${i18n.t("ago")} `
        : `${interval} ${i18n.t("days")} ${i18n.t("ago")} `;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1)
      return interval === 1
        ? `1 ${i18n.t("hour")} ${i18n.t("ago")} `
        : `${interval} ${i18n.t("hours")} ${i18n.t("ago")} `;

    interval = Math.floor(seconds / 60);
    if (interval >= 1)
      return interval === 1
        ? `1 min ${i18n.t("ago")} `
        : `${interval} mins ${i18n.t("ago")} `;

    return i18n.t("justNow");
  };

  return (
    <>
      <SketchyHeader title={i18n.t("notifications")} onBack={handleBack} />
      <div className="notifications-wrap">
        {loading && <LoadingSpinner />}

        {!loading && notifications.length === 0 && (
          <div className="fallback-container">
            <img src={heart} alt="hanging hearts" className="heart" />
            <p className="notifications-empty">{i18n.t("noLikes")}</p>
          </div>
        )}

        <ul className="notifications-list">
          {notifications.map((n) => (
            <li className="notification-card" key={n.id}>
              <div className="notification-content">
                {n.type === "like" && (
                  <div className="notification-icon">❤️</div>
                )}
                <div>
                  {n.type === "like" && (
                    <p className="notification-text">
                      <strong>{n.name}</strong> {i18n.t("likedProfile")}
                    </p>
                  )}
                  <span className="notification-time">
                    {timeAgo(n.created_at)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Load More button */}
        {!loading && hasMore && (
          <div className="load-more-wrap">
            <button className="load-more-btn" onClick={loadMore}>
              {i18n.t("loadMore")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
