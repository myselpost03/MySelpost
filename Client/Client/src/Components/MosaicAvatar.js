import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { supabase } from '../Utils/supabaseClient';
import { isWebView } from '../Utils/isWebView';
import '../Styles/Profile.css';

export default function MosaicAvatar({
  src,
  userId, // profile owner
  currentUserId, // logged in user
  totalLikes = 1000,
  aspectRatio = '1/1',
  borderRadius = 16,
  className = '',
}) {
  const [likes, setLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);

  // Fetch likes
  const fetchLikes = async () => {
    try {
      // get likes count
      const { count, error: countError } = await supabase
        .from('likes')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (countError) throw countError;
      setLikes(count || 0);

      // check if current user liked already
      const { data: likedData, error: likedError } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('liked_by', currentUserId)
        .single();

      if (likedError && likedError.code !== 'PGRST116') throw likedError;
      setUserLiked(!!likedData);
    } catch (err) {
      console.error('Error fetching likes:', err);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [userId, currentUserId]);

  const handleLike = async () => {
    if (userId === currentUserId || userLiked) return;

    const { error } = await supabase.from('likes').insert({
      user_id: userId,
      liked_by: currentUserId,
    });

    if (error) console.error(error);
    else {
      setLikes((l) => l + 1);
      setUserLiked(true);
    }

    // Send push notification
    try {
      await axios.post('https://myselpost.onrender.com/send-like-push', {
        userId,
      });
    } catch (err) {
      console.error('Error sending push notification:', err);
    }

    // Notify WebView
    if (isWebView() && window.ReactNativeWebView && userId) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ userId }));
    }
  };

  return (
    <div
      className={`mosaic-wrap ${className}`}
      style={{ borderRadius, aspectRatio }}
    >
      {/* DIRECT CLEAR IMAGE (NO BLUR, NO CANVAS) */}
      <img
        src={src}
        alt="profile"
        className="mosaic-img"
        draggable={false}
        style={{
          borderRadius,
        }}
      />

      {/* Overlay only if not fully liked */}
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
