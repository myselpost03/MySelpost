import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import { supabase } from "../Utils/supabaseClient";
import "../Styles/Prompt.css";

const Prompt = () => {
  const [prompt, setPrompt] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedPrompt, setSubmittedPrompt] = useState("");
  const [customAlert, setCustomAlert] = useState("");
  const [promptPoints, setPromptPoints] = useState(3);
  const [clickedGetMore, setClickedGetMore] = useState(false); // track "Get More Points" click

  useEffect(() => {
    const storedPoints = localStorage.getItem("promptPoints");
    setPromptPoints(storedPoints !== null ? parseInt(storedPoints) : 3);
  }, []);

  const updatePromptPoints = (newPoints) => {
    setPromptPoints(newPoints);
    localStorage.setItem("promptPoints", newPoints);
  };

  const showCustomAlert = (message) => {
    setCustomAlert(message);
    setTimeout(() => setCustomAlert(""), 6000);
  };

  const handleSubmit = async () => {
    if (prompt.trim() === "") return;

    if (promptPoints <= 0) {
      showCustomAlert("You've used all your free prompt points. 🎁");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email;

    if (!email) {
      showCustomAlert("User not found in localStorage.");
      return;
    }

    const { error } = await supabase
      .from("users")
      .update({ prompt })
      .eq("email", email);

    if (error) {
      console.error("Error inserting prompt:", error);
      showCustomAlert("Failed to submit prompt. Please try again.");
      return;
    }

    const isWebsite = prompt.toLowerCase().includes("website");
    const type = isWebsite ? "website" : "app";

    setSubmittedPrompt(prompt);
    setIsSubmitted(true);
    setPrompt("");
    updatePromptPoints(promptPoints - 1);

    showCustomAlert(
      `⏳ Your ${type} will magically turn into a ${type} in 7 days. We'll send progress updates and code files straight to your inbox so you can follow along.`
    );
  };

  const handlePayment = () => {
    setIsPaid(true);
  };

  const handleGetMorePoints = () => {
    const newPoints = promptPoints + 3;
    updatePromptPoints(newPoints);
    setClickedGetMore(true);
    showCustomAlert("🎉 You've been credited with 3 more prompt points!");
  };
  

  const isWebsite = submittedPrompt.toLowerCase().includes("website");

  return (
    <div className="prompt-page">
      <Header />

      {customAlert && <div className="custom-alert">{customAlert}</div>}

      <div className="prompt-container">
        {!isPaid && (
          <>
            <button className="pay-button" onClick={handlePayment}>
              💸 Pay to Unlock Prompt Tool
            </button>
          </>
        )}

        {!isSubmitted && (
          <>
            {promptPoints > 0 ? (
              <button className="sketch-points-button">
                🖍️ Monthly Prompt Points: {promptPoints}
              </button>
            ) : (
              <button
                className="sketch-points-button"
                onClick={handleGetMorePoints}
              >
                🎁 Get More Points
              </button>
            )}

            <textarea
              className="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the app or website you want to create. For example: 'A journal app for tracking daily moods' or 'A site where people can swap books locally.'"
              disabled={!isPaid}
            />

            <button
              className="send-button"
              onClick={handleSubmit}
              disabled={
                !isPaid || promptPoints <= 0 || (promptPoints === 0 && !clickedGetMore)
              }
            >
              Send ✏️
            </button>
          </>
        )}

        {isSubmitted && (
          <div className="building-container">
            <p className="building-text">
              Your {isWebsite ? "website" : "app"} is building...
            </p>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prompt;
