import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import "../Styles/Pricing.css";
import { supabase } from "../Utils/supabaseClient";
import AlertBox from "../Components/AlertBox"; // Import custom alert component

const Pricing = () => {
  const navigate = useNavigate();
  const [isBusinessUnlocked, setIsBusinessUnlocked] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);
  const [email, setEmail] = useState("");
  const [showAlert, setShowAlert] = useState(false); // State to manage the custom alert

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const storedEmail = user?.email;
    if (storedEmail) {
      setEmail(storedEmail);
      // Check if user already unlocked business based on pricing column
      supabase
        .from("users")
        .select("pricing")
        .eq("email", storedEmail)
        .single()
        .then(({ data }) => {
          if (data?.pricing === "business") setIsBusinessUnlocked(true);
        });
    }
  }, []);

  const handleBusiness = () => {
    if (!email) {
      setShowAlert(true); // Show the custom alert if not logged in
      return;
    }
    setShowPayPal(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false); // Close the alert
  };

  const renderPayPalButton = () => {
    if (!window.paypal || !email) return;

    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: { value: "100.00" },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          await actions.order.capture();

          // Update Supabase: Set the pricing to "business" for the user
          await supabase
            .from("users")
            .update({ pricing: "business" })
            .eq("email", email);

          setIsBusinessUnlocked(true);
          setShowPayPal(false);
        },
        onError: (err) => {
          alert("Payment failed. Please try again.");
          console.error(err);
        },
      })
      .render("#paypal-button-container");
  };

  useEffect(() => {
    if (showPayPal) {
      renderPayPalButton();
    }
  }, [showPayPal]);

  return (
    <div className="pricing-page">
      <Header />

      {showAlert && (
        <AlertBox
          message="Please log in first to unlock business features."
          onClose={handleCloseAlert}
        />
      )}
      <div className="pricing-container">
        <div className="plans-wrapper">
          {/* Sketch Plan */}

          <div className="plan-card free">
            <h2 className="plan-name">🎨 Sketch</h2>
            <p className="plan-price">Free</p>
            <ul className="plan-features">
              <li>📦 Delivery Time: 48 Hours</li>
              <li>🖍️ Monthly Points: 1</li>
              <li>💡 Submit using hand-drawn sketches</li>
            </ul>
            <button
              className="select-button"
              onClick={() => navigate("/sketch")}
            >
              Start Free
            </button>
          </div>

          {/* Prompt Plan */}
          <div className="plan-card paid">
            <h2 className="plan-name">✏️ Prompt</h2>
            <p className="plan-price">$5/month</p>
            <ul className="plan-features">
              <li>⚡ Delivery Time: Instant</li>
              <li>🖍️ Monthly Points: 3</li>
              <li>💬 Describe your idea in text</li>
            </ul>
            <button
              className="select-button"
              onClick={() => navigate("/prompt")}
            >
              Unlock Prompt Tool
            </button>
          </div>

          {/* Business Plan */}
          <div className="plan-card business">
            <h2 className="plan-name">💼 Business</h2>
            <p className="plan-price">$100/month</p>
            <ul className="plan-features">
              <li>⚡ Delivery Time: Instant</li>
              <li>🖍️ Monthly Points: 5</li>
              <li>💬 24/7 Customer Support</li>
              <li>📱 Get AI-Generated free device mockups</li>
            </ul>

            {isBusinessUnlocked ? (
              <button className="select-button green" disabled>
                Unlocked
              </button>
            ) : (
              <button className="select-button" onClick={handleBusiness}>
                Unlock Business Features
              </button>
            )}

            {showPayPal && (
              <div
                id="paypal-button-container"
                style={{ marginTop: "1rem" }}
              ></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
