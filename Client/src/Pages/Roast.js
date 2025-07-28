import React, { useState, useEffect } from "react";
import SketchyHeader from "../Components/SketchyHeader";
import "../Styles/Roast.css";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import LoadingIndicator from "../Components/LoadingIndicator";
import { supabase } from "../Utils/supabaseClient"; // Update path if needed

function Roast() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: images, error: imageErr } = await supabase
        .from("images")
        .select("id, image_url, user_id")
        .order("created_at", { ascending: false });

      if (imageErr) {
        console.error("Error fetching images:", imageErr);
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
          };
        })
      );

      setCards(cardsWithRoasts);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const upvote = async (cardIndex, roastIndex) => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const userId = currentUser?.id;
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
    const userId = currentUser?.id;
    if (!userId) return;

    const imageId = cards[cardIndex].image_id;

    // ✅ Check if the user has already roasted this image
    const { data: existingRoast, error: checkError } = await supabase
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
      alert("You’ve already roasted this image!");
      return;
    }

    // ✅ Insert new roast
    const { data, error } = await supabase.from("roasts").insert({
      image_id: imageId,
      user_id: userId,
      text: trimmed,
    });

    if (error) {
      console.error("Error adding roast:", error);
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

  if (!cards.length)
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
          {topRoastData && (
            <div className="roast-of-day">
              <div className="roast-content">
                <div className="roast-text-column">
                  <h3>Roast of the Day</h3>
                  <div className="roast-row">
                    <p className="roast-text">{topRoastData.text}</p>
                    <span className="votes">🔥 {topRoastData.votes}</span>
                  </div>
                </div>
                <img
                  src={topRoastData.image}
                  alt="Top Roast"
                  className="top-roast-image tall-image"
                />
              </div>
            </div>
          )}

          {showOverlay && (
            <div className="swipe-overlay">👈 Swipe to see next!</div>
          )}

          <div
            className={`roast-card animated-card ${
              showOverlay ? "blurred" : ""
            }`}
          >
            <img
              src={cards[currentIndex].image}
              alt="Roastee"
              className="roast-image"
            />
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
              />

              <button
                onClick={() => addRoast(currentIndex)}
                className="roast-button"
              >
                Roast!
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Roast;
