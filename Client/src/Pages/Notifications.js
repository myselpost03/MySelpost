import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Utils/supabaseClient";
import SketchyHeader from "../Components/SketchyHeader";
import LoadingSpinner from "../Components/LoadingSpinner";
import heart from "../Assets/heart.png";
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

      // --- Fetch Likes ---
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
        name: l.users?.name || "Someone",
      }));

      // --- Step 1: Fetch my image IDs ---
      const { data: myImages, error: imgError } = await supabase
        .from("images")
        .select("id, image_url")
        .eq("user_id", currentUser.id);

      if (imgError) throw imgError;

      const myImageIds = (myImages || []).map((img) => img.id);

      // --- Step 2: Fetch roasts only on my images ---
      let formattedRoasts = [];
      if (myImageIds.length > 0) {
        const { data: roasts, error: roastsError } = await supabase
          .from("roasts")
          .select(
            `
            id,
            created_at,
            text,
            user_id,
            image_id,
            images (image_url)
          `
          )
          .in("image_id", myImageIds)
          .neq("user_id", currentUser.id);

        if (roastsError) throw roastsError;

        formattedRoasts = (roasts || []).map((r) => ({
          id: `roast-${r.id}`,
          type: "roast",
          created_at: r.created_at,
          text: r.text,
          image_url: r.images?.image_url,
        }));
      }

      // --- Merge & Sort ---
      const merged = [...formattedLikes, ...formattedRoasts].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      // --- Pagination (slice manually) ---
      const start = pageNum * 10;
      const end = start + 10;
      const paginated = merged.slice(start, end);

      // Append or replace depending on page
      if (pageNum === 0) {
        setNotifications(paginated);
      } else {
        setNotifications((prev) => [...prev, ...paginated]);
      }

      // If less than 10 fetched → no more notifications
      setHasMore(merged.length > end);
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
    if (interval >= 1) return interval === 1 ? "1 year ago" : `${interval} years ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval === 1 ? "1 month ago" : `${interval} months ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval === 1 ? "1 day ago" : `${interval} days ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval === 1 ? "1 hour ago" : `${interval} hours ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval === 1 ? "1 min ago" : `${interval} mins ago`;

    return "Just now";
  };

  return (
    <>
      <SketchyHeader title="Notifications" onBack={handleBack} />
      <div className="notifications-wrap">
        {loading && <LoadingSpinner />}

        {!loading && notifications.length === 0 && (
          <div className="fallback-container">
            <img src={heart} alt="hanging hearts" className="heart" />
            <p className="notifications-empty">No Notifications Yet</p>
          </div>
        )}

        <ul className="notifications-list">
          {notifications.map((n) => (
            <li className="notification-card" key={n.id}>
              <div className="notification-content">
                {n.type === "like" ? (
                  <div className="notification-icon">❤️</div>
                ) : (
                  <div className="notification-icon">🔥</div>
                )}
                <div>
                  {n.type === "like" ? (
                    <p className="notification-text">
                      <strong>{n.name}</strong> liked your profile.
                    </p>
                  ) : (
                    <div className="notification-text">
                      <p>Someone roasted your selpost: “{n.text}”</p>
                    </div>
                  )}
                  <span className="notification-time">{timeAgo(n.created_at)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Load More button */}
        {!loading && hasMore && (
          <div className="load-more-wrap">
            <button className="load-more-btn" onClick={loadMore}>
              Load More
            </button>
          </div>
        )}
      </div>
    </>
  );
}
