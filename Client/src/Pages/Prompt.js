import React, { useState, useEffect, useRef } from "react";
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
  const [clickedGetMore, setClickedGetMore] = useState(false);
  const [isPayingForPoints, setIsPayingForPoints] = useState(false);
  const paypalRef = useRef(null);
  const paypalGetMoreRef = useRef(null);

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
    setTimeout(() => setCustomAlert(""), 8000);
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

    const { error } = await supabase.from("users").update({ prompt }).eq("email", email);

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

    showCustomAlert(`⏳ Your ${type} will magically turn into a ${type} in 7 days.`);
  };

  const handleUnlockClick = () => {
    if (!paypalRef.current || paypalRef.current.hasChildNodes()) return;

    window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{ amount: { value: "5.00" } }],
        });
      },
      onApprove: async (data, actions) => {
        await actions.order.capture();
        setIsPaid(true);
        showCustomAlert("✅ Payment successful! Prompt tool unlocked.");
      },
      onError: (err) => {
        console.error("PayPal Error:", err);
        showCustomAlert("❌ Payment failed. Please try again.");
      },
    }).render(paypalRef.current);
  };

  const handleGetMorePoints = () => {
    setIsPayingForPoints(true); // Trigger PayPal $1 rendering
  };

  useEffect(() => {
    if (!isPayingForPoints || !paypalGetMoreRef.current || paypalGetMoreRef.current.hasChildNodes()) return;

    window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{ amount: { value: "1.00" } }],
        });
      },
      onApprove: async (data, actions) => {
        await actions.order.capture();
        const newPoints = promptPoints + 3;
        updatePromptPoints(newPoints);
        setClickedGetMore(true);
        setIsPayingForPoints(false);
        showCustomAlert("🎉 You've been credited with 3 more prompt points!");
      },
      onError: (err) => {
        console.error("PayPal Error:", err);
        showCustomAlert("❌ $1 Payment failed. Please try again.");
      },
    }).render(paypalGetMoreRef.current);
  }, [isPayingForPoints]);

  const isWebsite = submittedPrompt.toLowerCase().includes("website");

  return (
    <div className="prompt-page">
      <Header />

      {customAlert && <div className="custom-alert">{customAlert}</div>}

      <div className="prompt-container">
        {!isPaid && (
          <div>
            <button className="pay-button" onClick={handleUnlockClick}>
              💸 Pay $5 to Unlock Prompt Tool
            </button>
            <div ref={paypalRef} style={{ marginTop: "20px" }} />
          </div>
        )}

        {!isSubmitted && (
          <>
            {promptPoints > 0 ? (
              <button className="sketch-points-button">
                🖍️ Monthly Prompt Points: {promptPoints}
              </button>
            ) : (
              <>
                <button className="sketch-points-button" onClick={handleGetMorePoints}>
                  🎁 Get More Points ($1)
                </button>
                <div ref={paypalGetMoreRef} style={{ marginTop: "10px" }} />
              </>
            )}

            <textarea
              className="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the app or website you want to create..."
              disabled={!isPaid}
            />

            <button
              className="send-button"
              onClick={handleSubmit}
              disabled={!isPaid || promptPoints <= 0}
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
