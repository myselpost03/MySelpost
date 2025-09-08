import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { supabase } from "../Utils/supabaseClient";
import "../Styles/Profile.css";

export default function MosaicAvatar({
  src,
  userId, // profile owner
  currentUserId, // logged in user
  totalLikes = 1000,
  rows = 32,
  cols = 32,
  aspectRatio = "1/1",
  borderRadius = 16,
  className = "",
}) {
  const [likes, setLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  // Optimized fetch
  const fetchLikes = async () => {
    try {
      // Get total likes count
      const { count, error: countError } = await supabase
        .from("likes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);
      if (countError) throw countError;
      setLikes(count || 0);

      // Check if current user liked
      const { data: likedData, error: likedError } = await supabase
        .from("likes")
        .select("id")
        .eq("user_id", userId)
        .eq("liked_by", currentUserId)
        .single();

      if (likedError && likedError.code !== "PGRST116") throw likedError; // ignore not found
      setUserLiked(!!likedData);
    } catch (err) {
      console.error("Error fetching likes:", err);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [userId, currentUserId]);

  const handleLike = async () => {
    if (userId === currentUserId || userLiked) return;

    const { error } = await supabase.from("likes").insert({
      user_id: userId,
      liked_by: currentUserId,
    });

    if (error) console.error(error);
    else {
      setLikes((l) => l + 1);
      setUserLiked(true);
    }
    // 🔔 Send push notification to the owner
    try {

      await axios.post("https://myselpost.onrender.com/send-like-push", {
        userId,
      });
      console.log("✅ Push notification sent!");
    } catch (err) {
      console.error("❌ Error sending push notification:", err);
    }
  };

  // Snake order
  const snakeOrder = useMemo(() => {
    const order = [];
    for (let r = 0; r < rows; r++) {
      if (r % 2 === 0) {
        for (let c = 0; c < cols; c++) order.push([r, c]);
      } else {
        for (let c = cols - 1; c >= 0; c--) order.push([r, c]);
      }
    }
    return order;
  }, [rows, cols]);

  const revealedCount = Math.min(
    Math.floor((likes / totalLikes) * rows * cols),
    rows * cols
  );

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const img = imgRef.current;
    if (!canvas || !container || !img || !imgLoaded) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const tileW = canvas.width / cols;
    const tileH = canvas.height / rows;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = canvas.width / canvas.height;

    let sx, sy, sWidth, sHeight;
    if (imgAspect > canvasAspect) {
      sHeight = img.naturalHeight;
      sWidth = sHeight * canvasAspect;
      sx = (img.naturalWidth - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = img.naturalWidth;
      sHeight = sWidth / canvasAspect;
      sx = 0;
      sy = (img.naturalHeight - sHeight) / 2;
    }

    ctx.filter = "blur(24px)";
    ctx.drawImage(
      img,
      sx,
      sy,
      sWidth,
      sHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );
    ctx.filter = "none";

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    for (let i = 0; i < revealedCount; i++) {
      const [r, c] = snakeOrder[i];
      ctx.rect(c * tileW, r * tileH, tileW, tileH);
    }
    ctx.fill();
    ctx.restore();
  };

  useEffect(() => drawCanvas(), [likes, snakeOrder, revealedCount, imgLoaded]);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(() => drawCanvas());
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [imgLoaded]);

  return (
    <div
      className={`mosaic-wrap ${className}`}
      ref={containerRef}
      style={{ borderRadius, aspectRatio }}
    >
      <img
        ref={imgRef}
        src={src}
        alt="blurred profile"
        className="mosaic-img"
        onLoad={() => setImgLoaded(true)}
        draggable={false}
      />
      <canvas className="mosaic-canvas" ref={canvasRef} aria-hidden="true" />

      {likes < totalLikes && (
        <div className="mosaic-overlay">
          <button
            className="mosaic-like-btn"
            onClick={handleLike}
            disabled={userId === currentUserId || userLiked}
          >
            ❤️ {likes}
          </button>
        </div>
      )}
    </div>
  );
}
