import React, { useState, useEffect } from "react";
import SketchyHeader from "../Components/SketchyHeader";
import "../Styles/Roast.css";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";

function Roast() {
  const navigate = useNavigate();
  const [showExplosion, setShowExplosion] = useState(false);

  const [cards, setCards] = useState([
    {
      image:
        "https://cdn.pixabay.com/photo/2025/07/23/00/56/ai-generated-9729388_640.jpg",
      roasts: [
        { text: "Looks like a villain from a silent film.", votes: 5 },
        { text: "Face says 'Error 404: Swag not found.'", votes: 3 },
      ],
      newRoast: "",
    },
    {
      image:
        "https://cdn.pixabay.com/photo/2015/04/24/20/58/girl-738303_640.jpg",
      roasts: [
        { text: "His mirror must be legally blind.", votes: 2 },
        { text: "Looks like WiFi dropped on his style update.", votes: 4 },
      ],
      newRoast: "",
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true); // 👈 Overlay visibility
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(
      "https://gist.githubusercontent.com/myselpost03/11b01194cf415890dea341c198678293/raw/0930118a8e61b9a7a56b7ef09c84dcf36a1a95b7/data.json"
    )
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error fetching JSON:", err));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 4000); // auto-hide after 4s
    return () => clearTimeout(timer);
  }, []);

  const upvote = (cardIndex, roastIndex) => {
    const updatedCards = [...cards];
    updatedCards[cardIndex].roasts[roastIndex].votes++;
    setCards(updatedCards);

    // Fire trail animation
    const btn = document.querySelectorAll(".vote-button")[roastIndex];
    btn.classList.add("fire-animate");
    setTimeout(() => btn.classList.remove("fire-animate"), 400);
  };
  const addRoast = (cardIndex) => {
    const trimmed = cards[cardIndex].newRoast.trim();
    if (!trimmed) return;

    const updatedCards = cards.map((card, index) =>
      index === cardIndex
        ? {
            ...card,
            roasts: [...card.roasts, { text: trimmed, votes: 0 }],
            newRoast: "",
          }
        : card
    );
    setCards(updatedCards);
  };

  const handleInputChange = (e, cardIndex) => {
    const updatedCards = cards.map((card, index) =>
      index === cardIndex ? { ...card, newRoast: e.target.value } : card
    );
    setCards(updatedCards);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSwipe = (direction) => {
    setShowOverlay(false); // hide overlay after swipe
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
  // Find top roast across all cards
  const topRoast = (() => {
    let top = null;
    cards.forEach((card) =>
      card.roasts.forEach((r) => {
        if (!top || r.votes > top.votes) {
          top = r;
        }
      })
    );
    return top;
  })();

  return (
    <>
      <SketchyHeader title="Roast Me 🔥" onBack={handleBack} />

      <div className="roast-page" {...swipeHandlers}>
        <div className="roast-card-container">
          {topRoast && (
            <div className="roast-of-day">
              <h3>🔥 Roast of the Day</h3>
              <p>{topRoast.text}</p>
              <span className="votes">🔥 {topRoast.votes}</span>
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
                maxLength={150} // ← change as needed
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
