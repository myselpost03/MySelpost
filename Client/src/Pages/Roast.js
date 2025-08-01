import React, { useState, useEffect } from "react";
import SketchyHeader from "../Components/SketchyHeader";
import "../Styles/Roast.css";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import LoadingIndicator from "../Components/LoadingIndicator";
import SketchyAlert from "../Components/SketchyAlert";
import { supabase } from "../Utils/supabaseClient"; // Update path if needed
import { FaFire } from "react-icons/fa";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  RedditShareButton,
} from "react-share";

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (let key in intervals) {
    const value = Math.floor(seconds / intervals[key]);
    if (value >= 1) return `${value}${key[0]} ago`;
  }

  return `Just now`;
};


function Roast() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [roastingIndex, setRoastingIndex] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const [fabOpen, setFabOpen] = useState(false);
  const [showTopRoastPopup, setShowTopRoastPopup] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSharedRoast, setHasSharedRoast] = useState(
    localStorage.getItem("hasSharedRoast") === "true"
  );
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const toggleFAB = () => {
    if (currentUser) {
      setFabOpen((prev) => !prev);
    } else {
      setAlertMessage({
        text: "You have to log in to access this feature.",
        withButton: true,
      });
    }
  };

  const handleShare = () => {
    if (!hasSharedRoast) {
      setHasSharedRoast(true);
      localStorage.setItem("hasSharedRoast", "true");
    }
  };

  const fetchCardsData = async () => {
    setLoading(true);
    const { data: images, error: imageErr } = await supabase
      .from("images")
      .select("id, image_url, user_id, created_at")
      .order("created_at", { ascending: false });

    if (imageErr) {
      console.error("Error fetching images:", imageErr);
      setLoading(false);
      return;
    }

    const cardsWithRoasts = await Promise.all(
      images.map(async (img) => {
        const { data: roasts, error: roastErr } = await supabase
          .from("roasts")
          .select("id, text, user_id")
          .eq("image_id", img.id)
          .order("created_at", { ascending: false });

        if (roastErr) {
          console.error("Error fetching roasts:", roastErr);
          return { ...img, roasts: [], newRoast: "" };
        }

        const roastsWithVotes = await Promise.all(
          roasts.map(async (r) => {
            const { count, error: voteErr } = await supabase
              .from("votes")
              .select("*", { count: "exact", head: true })
              .eq("roast_id", r.id)
              .eq("vote_type", "up");

            if (voteErr) {
              console.error("Vote error:", voteErr);
              return { ...r, votes: 0 };
            }

            return { ...r, votes: count || 0 };
          })
        );

        return {
          image: img.image_url,
          roasts: roastsWithVotes,
          newRoast: "",
          image_id: img.id,
            created_at: img.created_at, // ✅ include this

        };
      })
    );

    setCards(cardsWithRoasts);
    setCurrentIndex(0);
    setLoading(false);
  };

  useEffect(() => {
    fetchCardsData();
  }, []);

  useEffect(() => {
    const hasSeenOverlay = localStorage.getItem("hasSeenSwipeOverlay");

    if (!hasSeenOverlay) {
      setShowOverlay(true);
      const timer = setTimeout(() => {
        setShowOverlay(false);
        localStorage.setItem("hasSeenSwipeOverlay", "true");
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setShowOverlay(false);
    }
  }, []);

  const upvote = async (cardIndex, roastIndex) => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const userId = currentUser?.id;
    if (!currentUser) {
      setAlertMessage({
        text: "You have to log in to upvote the roast.",
        withButton: true,
      });
    }
    if (!userId) return;

    const roast = cards[cardIndex].roasts[roastIndex];

    // 1. Check if this user has already voted for this roast
    const { data: existingVote, error: checkError } = await supabase
      .from("votes")
      .select("id")
      .eq("roast_id", roast.id)
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing vote:", checkError);
      return;
    }

    if (existingVote) {
      // User already voted for this roast
      console.log("User has already voted.");
      return;
    }

    // 2. Insert vote if not voted before
    const { error: voteError } = await supabase.from("votes").insert({
      roast_id: roast.id,
      user_id: userId,
      vote_type: "up",
    });

    if (voteError) {
      console.error("Error voting:", voteError);
      return;
    }

    // 3. Update UI
    const updatedCards = [...cards];
    updatedCards[cardIndex].roasts[roastIndex].votes++;
    setCards(updatedCards);

    const btn = document.querySelectorAll(".vote-button")[roastIndex];
    btn.classList.add("fire-animate");
    setTimeout(() => btn.classList.remove("fire-animate"), 400);
  };

  const addRoast = async (cardIndex) => {
    const trimmed = cards[cardIndex].newRoast.trim();
    if (!trimmed) return;

    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) {
      setAlertMessage({
        text: "You have to log in to add roast.",
        withButton: true,
      });
    }
    const userId = currentUser?.id;
    if (!userId) return;

    const imageId = cards[cardIndex].image_id;

    // ✅ Check if the user has already roasted this image
    {
      /*const { data: existingRoast, error: checkError } = await supabase
      .from("roasts")
      .select("id")
      .eq("user_id", userId)
      .eq("image_id", imageId)
      .limit(1)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing roast:", checkError);
      return;
    }

    if (existingRoast) {
      setAlertMessage({
        text: "You’ve already roasted this image!",
        withButton: true,
      });
      return;
    }*/
    }
    setRoastingIndex(cardIndex);
    // ✅ Insert new roast
    const { data, error } = await supabase.from("roasts").insert({
      image_id: imageId,
      user_id: userId,
      text: trimmed,
    });
    setRoastingIndex(null);
    if (error) {
      return;
    }

    const updatedCards = [...cards];
    updatedCards[cardIndex].roasts.push({ text: trimmed, votes: 0 });
    updatedCards[cardIndex].newRoast = "";
    setCards(updatedCards);
  };

  const handleInputChange = (e, cardIndex) => {
    const updatedCards = [...cards];
    updatedCards[cardIndex].newRoast = e.target.value;
    setCards(updatedCards);
  };

  const handleBack = () => navigate(-1);

  const handleSwipe = (direction) => {
    setShowOverlay(false);
    if (direction === "Left" && currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === "Right" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("Left"),
    onSwipedRight: () => handleSwipe("Right"),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const userId = currentUser?.id;
    if (!userId) {
      alert("Please log in to upload.");
      return;
    }

    const CLOUDINARY_UPLOAD_PRESET = "ml_default";
    const CLOUDINARY_CLOUD_NAME = "dzoctpmmi";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      // Upload to Cloudinary

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudinaryData = await cloudinaryRes.json();
      const imageUrl = cloudinaryData.secure_url;

      if (!imageUrl) {
        setAlertMessage({
          text: "Upload failed.",
          withButton: true,
        });
        return;
      }

      // Save URL to Supabase
      const { error: insertErr } = await supabase.from("images").insert({
        image_url: imageUrl,
        user_id: userId,
      });

      if (insertErr) {
        console.error("Supabase insert error:", insertErr.message);
        //  alert("Failed to save image info.");
        return;
      }

      setAlertMessage({
        text: "Image uploaded successfully!.",
        withButton: true,
      });
      await fetchCardsData(); // ✅ Refresh data without reloading
      setCurrentIndex(0);
    } catch (err) {
      console.error("Upload error:", err);
      setAlertMessage({
        text: "Image uploaded successfully!.",
        withButton: true,
      });
    }
  };

  const topRoastData = (() => {
    let top = null;
    cards.forEach((card) =>
      card.roasts.forEach((r) => {
        if (!top || r.votes > top.votes) {
          top = {
            text: r.text,
            votes: r.votes,
            image: card.image,
          };
        }
      })
    );
    return top;
  })();

  if (!cards.length || loading)
    return (
      <div className="roast-page">
        <LoadingIndicator />
      </div>
    );

  return (
    <>
      <SketchyHeader title="Roast 🔥" onBack={handleBack} />

      <div className="roast-page" {...swipeHandlers}>
        <div className="roast-card-container">
          {showOverlay && (
            <div className="swipe-overlay">👈 Swipe to see next!</div>
          )}

          <div
            className={`roast-card animated-card ${
              showOverlay ? "blurred" : ""
            }`}
          >
            <div className="roast-image-container">
  <img
    src={cards[currentIndex].image}
    alt="Roastee"
    className="roast-image"
  />
  <div className="timestamp-glass">
    {timeAgo(cards[currentIndex].created_at)}
  </div>
</div>

{/*<span className="timestamp">
  {timeAgo(cards[currentIndex].created_at)}
</span>
*/}
            {/* Sketchy Share Buttons */}
            <div className="sketchy-share-buttons">
              <FacebookShareButton
                url={window.location.href}
                quote="🔥 Check this roast on myselpost!"
                onClick={handleShare}
              >
                <button className="sketchy-share">
                  Facebook{" "}
                  {(count) => (
                    <span className="myShareCountWrapper">{count}</span>
                  )}
                </button>
              </FacebookShareButton>
              <TwitterShareButton
                url={window.location.href}
                title="🔥 Check this roast on myselpost!"
                onClick={handleShare}
              >
                <button className="sketchy-share">
                  Twitter{" "}
                  {(count) => (
                    <span className="myShareCountWrapper">{count}</span>
                  )}
                </button>
              </TwitterShareButton>
              <WhatsappShareButton
                url={window.location.href}
                title="🔥 Check this roast on myselpost!"
                onClick={handleShare}
              >
                <button className="sketchy-share">
                  WhatsApp
                  {(shareCount) => (
                    <span className="myShareCountWrapper">{shareCount}</span>
                  )}
                </button>
              </WhatsappShareButton>
              <RedditShareButton
                url={window.location.href}
                title="🔥 Check this roast!"
                onClick={handleShare}
              >
                <button className="sketchy-share">
                  Reddit{" "}
                  {(count) => (
                    <span className="myShareCountWrapper">{count}</span>
                  )}
                </button>
              </RedditShareButton>
            </div>

            <ul className="roast-list">
              {cards[currentIndex].roasts
                .sort((a, b) => b.votes - a.votes)
                .map((r, i) => (
                  <li key={i} className="roast-item">
                    <span className={r.text.length > 120 ? "long-roast" : ""}>
                      {r.text}
                    </span>
                    <button
                      onClick={() => upvote(currentIndex, i)}
                      className="vote-button"
                      disabled={!currentUser}
                    >
                      🔥 {r.votes}
                    </button>
                  </li>
                ))}
            </ul>
            <div className="input-row">
              <input
                type="text"
                placeholder="Your roast..."
                value={cards[currentIndex].newRoast}
                maxLength={150}
                onChange={(e) => handleInputChange(e, currentIndex)}
                className="roast-input"
                disabled={!currentUser}
              />

              <button
                onClick={() => addRoast(currentIndex)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addRoast(currentIndex);
                  }
                }}
                className="roast-button"
                disabled={!currentUser || roastingIndex === currentIndex}
              >
                {roastingIndex === currentIndex ? "Roasting..." : "Roast!"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        id="upload-input"
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />

      {/* Main FAB */}
      <button
        className="fab-upload"
        onClick={() => {
          if (hasSharedRoast) {
            toggleFAB();
          } else {
            setAlertMessage({
              text: "You have to share one roast to access this feature.",
              withButton: true,
            });
          }
        }}
        title="Actions"
      >
        <FaFire />
      </button>

      {/* Expanding FAB options */}
      {fabOpen && (
        <div className="fab-options">
          <button
            className="fab-option"
            onClick={() => {
              document.getElementById("upload-input").click();
              setFabOpen(false);
            }}
          >
            📤
          </button>
          <button
            className="fab-option"
            onClick={() => {
              setShowTopRoastPopup(true);
              setFabOpen(false);
            }}
          >
            🔥
          </button>
        </div>
      )}

      {showTopRoastPopup && topRoastData && (
        <div className="top-roast-popup">
          <div className="top-roast-popup-inner">
            <button
              className="close-popup"
              onClick={() => setShowTopRoastPopup(false)}
            >
              ✖
            </button>
            <h3>🔥 Roast of the Day</h3>
            <img
              src={topRoastData.image}
              alt="Top Roast"
              className="top-roast-popup-image"
            />
            <p className="popup-roast-text">{topRoastData.text}</p>
            <span className="popup-roast-votes">🔥 {topRoastData.votes}</span>
          </div>
        </div>
      )}
      {alertMessage && (
        <SketchyAlert
          message={alertMessage.text}
          withButton={alertMessage.withButton}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </>
  );
}

export default Roast;
