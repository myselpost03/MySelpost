import React, { useState } from "react";
import confetti from "canvas-confetti"; // ✅ Import confetti
import "../Styles/FeedbackPopup.css";
import { supabase } from "../Utils/supabaseClient";

const FeedbackPopup = ({ onSubmitSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showPopup, setShowPopup] = useState(true);

  const handleRating = (star) => setRating(star);
  const handleSubmit = async () => {

    const { data, error } = await supabase.from("feedbacks").insert([
      {
        rating: rating,
        feedback: feedback,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error inserting feedback:", error.message);
    } else {
      console.log("Feedback submitted successfully:", data);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });
      onSubmitSuccess(); // Call parent to mark submission
    }

    setShowPopup(false);
  };

  const renderStar = (star) => {
    const filled = star <= (hovered || rating);
    return (
      <svg
        key={star}
        viewBox="0 0 24 24"
        width="32"
        height="32"
        className="svg-star"
        onClick={() => handleRating(star)}
        onMouseEnter={() => setHovered(star)}
        onMouseLeave={() => setHovered(0)}
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFC200" />
            <stop offset="100%" stopColor="#FFB700" />
          </linearGradient>
        </defs>
        <path
          d="M12 .587l3.668 7.568L24 9.75l-6 5.848 1.416 8.233L12 19.896l-7.416 3.935L6 15.598 0 9.75l8.332-1.595z"
          fill={filled ? "url(#goldGradient)" : "#ccc"}
        />
      </svg>
    );
  };

  return (
    <>
      {showPopup && (
        <div className="feedback-overlay">
          <div className="feedback-popup-box">
            <h2 className="feedback-title">Give Feedback</h2>
            <div className="feedback-star-container">
              {[1, 2, 3, 4, 5].map(renderStar)}
            </div>
            <textarea
              className="feedback-box"
              placeholder="Describe the issue or share your thoughts..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <div className="feedback-btn-group">
              <button onClick={handleSubmit} className="feedback-submit-btn">
                Submit
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="feedback-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackPopup;
