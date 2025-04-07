import React, { useState } from "react";
import Header from "../Components/Header";
import "../Styles/Prompt.css";

const Prompt = () => {
  const [prompt, setPrompt] = useState("");
  const [isPaid, setIsPaid] = useState(false);

  const handleSubmit = () => {
    if (prompt.trim() !== "") {
      console.log("Submitted prompt:", prompt);
      setPrompt("");
    }
  };

  const handlePayment = () => {
    // Simulated payment flow
    // Replace this with real payment integration later
    setIsPaid(true);
  };

  return (
    <div className="prompt-page">
      <Header />
      <div className="prompt-container">
        {!isPaid && (
          <button className="pay-button" onClick={handlePayment}>
            💸 Pay to Unlock Prompt Tool
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
          disabled={!isPaid}
        >
          Send ✏️
        </button>
      </div>
    </div>
  );
};

export default Prompt;
