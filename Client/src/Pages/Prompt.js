import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  const [remainingTime, setRemainingTime] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoValid, setPromoValid] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isSubmitted) return;

    const user = JSON.parse(localStorage.getItem("user"));
    const submittedAt = localStorage.getItem("submittedAt");

    if (!submittedAt) {
      const newTimestamp = new Date().toISOString();
      localStorage.setItem("submittedAt", newTimestamp);
    }

    const deadline = new Date(localStorage.getItem("submittedAt"));
    deadline.setDate(deadline.getDate() + 7);

    const updateCountdown = () => {
      const now = new Date();
      const diff = deadline - now;

      if (diff <= 0) {
        setRemainingTime("Delivered ✅");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, [isSubmitted]);

  useEffect(() => {
    const storedPoints = localStorage.getItem("promptPoints");
    setPromptPoints(storedPoints !== null ? parseInt(storedPoints) : 3);
  }, []);

  useEffect(() => {
    const checkUserPaidStatus = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user?.email;

      if (!email) return;

      const { data, error } = await supabase
        .from("users")
        .select("pricing")
        .eq("email", email)
        .single();

      if (error) {
        console.error("Error fetching user pricing status:", error);
        return;
      }

      if (data?.pricing === "paid") {
        setIsPaid(true);
      }
    };

    checkUserPaidStatus();
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
      `⏳ Your sketch will magically turn into a ${type} in 48 hours. You'll get your ${type} & code files to your email.`
    );
  };

  const handleBack = () => {
    navigate("/prompt");
  };

  const handleUnlockClick = async () => {
    const code = promoCode.trim();

    if (code && !promoValid) {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("used")
        .eq("code", code)
        .single();

      if (error || !data) {
        showCustomAlert("❌ Invalid promo code.");
        return;
      }

      if (data.used) {
        showCustomAlert("⚠️ This promo code has already been used.");
        return;
      }

      setPromoValid(true);
      showCustomAlert("🎉 Promo applied! $0.50 price unlocked!");
    }

    if (!paypalRef.current || paypalRef.current.hasChildNodes()) return;

    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          const finalPrice = promoValid ? "0.50" : "5.00";
          return actions.order.create({
            purchase_units: [{ amount: { value: finalPrice } }],
          });
        },

        onApprove: async (data, actions) => {
          await actions.order.capture();
          setIsPaid(true);
          showCustomAlert("✅ Payment successful! Prompt tool unlocked.");

          const user = JSON.parse(localStorage.getItem("user"));
          const email = user?.email;

          if (email) {
            await supabase
              .from("users")
              .update({ pricing: "paid" })
              .eq("email", email);
          }

          if (promoValid) {
            await supabase
              .from("promo_codes")
              .update({ used: true })
              .eq("code", promoCode.trim());
          }
        },

        onError: (err) => {
          console.error("PayPal Error:", err);
          showCustomAlert("❌ Payment failed. Please try again.");
        },
      })
      .render(paypalRef.current);
  };

  const handleGetMorePoints = () => {
    setIsPayingForPoints(true);
  };

  useEffect(() => {
    if (
      !isPayingForPoints ||
      !paypalGetMoreRef.current ||
      paypalGetMoreRef.current.hasChildNodes()
    )
      return;

    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: "5.00" } }],
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
          showCustomAlert("❌ $5 Payment failed. Please try again.");
        },
      })
      .render(paypalGetMoreRef.current);
  }, [isPayingForPoints]);

  const isWebsite = submittedPrompt.toLowerCase().includes("website");

  return (
    <div className="prompt-page">
      <Header />

      {customAlert && <div className="custom-alert">{customAlert}</div>}

      <div className="prompt-container">
        {!isPaid && (
          <div>
            <div className="promo-container">
              <input
                type="text"
                className="promo-input"
                value={promoCode}
                onChange={async (e) => {
                  const code = e.target.value;
                  setPromoCode(code);
                  if (code.trim()) {
                    const { data, error } = await supabase
                      .from("promo_codes")
                      .select("used")
                      .eq("code", code)
                      .single();

                    if (error || !data) {
                      setPromoValid(false);
                    } else if (!data.used) {
                      setPromoValid(true);
                    }
                  } else {
                    setPromoValid(false);
                  }
                }}
                placeholder="Enter promo code (if any)"
              />
              {promoValid && <span className="checkmark">✅</span>}
            </div>

            <button className="pay-button" onClick={handleUnlockClick}>
              💸 Pay {promoValid ? "$0.50" : "$5"} to Unlock Prompt Tool
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
                <button
                  className="sketch-points-button"
                  onClick={handleGetMorePoints}
                >
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
              <br />⏳ {remainingTime}
            </p>

            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>

            <button className="back-btn" onClick={handleBack}>
              Go to Prompt
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prompt;
