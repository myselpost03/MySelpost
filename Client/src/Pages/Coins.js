import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Components/Header";
import "../Styles/Coins.css";
import SketchyAlert from "../Components/SketchyAlert";
import { supabase } from "../Utils/supabaseClient";

const Coins = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [showPayPal, setShowPayPal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    const getUserById = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error("Error fetching user:", error.message);
      else setUser(data);
    };

    getUserById();
  }, [id]);

  useEffect(() => {
    if (showPayPal && window.paypal && user) {
      if (
        document.getElementById("paypal-button-container").childElementCount ===
        0
      ) {
        window.paypal
          .Buttons({
            style: {
              layout: "vertical",
              color: "blue",
              shape: "pill",
              label: "paypal",
            },
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [{ amount: { value: "1.00" } }],
              });
            },
            onApprove: async (data, actions) => {
              await actions.order.capture();

              // Add 100 coins to user
              const newCoins = (user.coins || 0) + 100;

              const { error: updateError } = await supabase
                .from("users")
                .update({ coins: newCoins })
                .eq("id", user.id);

              if (updateError) {
                console.error("Coin update failed:", updateError.message);
                alert("❌ Failed to add coins.");
              } else {
                alert("✅ 100 coins added!");
                setUser({ ...user, coins: newCoins });
              }

              setShowPayPal(false);
            },
            onError: (err) => {
              console.error("PayPal error:", err);
              setAlertMessage({
                text: `❌ Payment Failed.`,
                withButton: true,
              });
            },
          })
          .render("#paypal-button-container");
      }
    }
  }, [showPayPal, user]);

  return (
    <div className="sketchy-coins-container">
      <Header />
      <div className="sketchy-coins-box">
        <h1 className="sketchy-coins-title">💰 Get More Coins</h1>
        <p className="sketchy-coins-desc">
          Use coins to send gifts, unlock features, and surprise friends!
        </p>

        <div className="sketchy-coins-options">
          <button className="sketchy-coin-btn">
            ⏳ Spend 1 Hour & Earn 3 Coins
          </button>

          <button className="sketchy-coin-btn">
            📲 Invite Friends & Earn 50 Coins
          </button>
          <button
            className="sketchy-coin-btn"
            onClick={() => setShowPayPal(true)}
          >
            🛒 Buy 100 Coins - $1
          </button>
        </div>

        {showPayPal && (
          <div id="paypal-button-container" className="paypal-box"></div>
        )}

        <p className="sketchy-coin-note">
          * Coins are non-refundable & expire in 30 days.
        </p>
      </div>
      {alertMessage && (
        <SketchyAlert
          message={alertMessage.text}
          withButton={alertMessage.withButton}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </div>
  );
};

export default Coins;
