import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SketchyHeader from "../Components/SketchyHeader";
import "../Styles/Coins.css";
import SketchyAlert from "../Components/SketchyAlert";
import LoadingIndicator from "../Components/LoadingIndicator";
import { supabase } from "../Utils/supabaseClient";

const Coins = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [showPayPal, setShowPayPal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [inviteCode, setInviteCode] = useState("");
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

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

  const generateRandomCode = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const handleInviteClick = async () => {
    setLoading(true);
    const code = generateRandomCode();

    // First, check if invite already exists for this user
    const { data: existingInvite, error: fetchError } = await supabase
      .from("invites")
      .select("*")
      .eq("sender_id", id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // Only log unexpected errors, not "row not found"
      console.error("Error checking existing invite:", fetchError.message);
      setAlertMessage({
        text: "❌ Something went wrong. Try again later.",
        withButton: true,
      });
      setLoading(false);
      return;
    }

    let response;

    if (existingInvite) {
      // Update existing invite code
      response = await supabase
        .from("invites")
        .update({ code: code })
        .eq("sender_id", id);
    } else {
      // Insert new invite
      response = await supabase.from("invites").insert([
        {
          sender_id: id,
          code: code,
        },
      ]);
    }

    if (response.error) {
      console.error("Error saving invite code:", response.error.message);
      setAlertMessage({
        text: "❌ Failed to generate invite code. Try again.",
        withButton: true,
      });
      setLoading(false);
    } else {
      setInviteCode(code);
      setShowInvitePopup(true);
      setLoading(false);
    }
  };

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
              const newCoins = (user.reward_coins || 0) + 100;
              const { error: updateError } = await supabase
                .from("users")
                .update({ reward_coins: newCoins })
                .eq("id", user.id);

              if (updateError) {
                console.error("Coin update failed:", updateError.message);
                alert("❌ Failed to add coins.");
              } else {
                alert("✅ 100 coins added!");
                setUser({ ...user, reward_coins: newCoins });
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
      <SketchyHeader title="Coins" onBack={handleBack} />
      <div className="sketchy-coins-box">
        <h1 className="sketchy-coins-title">💰 Get More Coins</h1>
        <p className="sketchy-coins-desc">
          Use coins to send gifts, unlock features, and surprise friends!
        </p>

        <div className="sketchy-coins-options">
          <button className="sketchy-coin-btn">
            ⏳ Spend 1 Hour & Earn 3 (Auto Detect)
          </button>

          <button className="sketchy-coin-btn" onClick={handleInviteClick}>
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
{loading && !showInvitePopup && <LoadingIndicator />}
        {showInvitePopup && (
          <div className="invite-popup">
            <div className="invite-box">
              <h3>Your Invite Code</h3>
              <p className="invite-code">{inviteCode}</p>
              <p>
                Share this with your friend. You’ll get 50 coins if they use it.
              </p>
              <button
                onClick={() => setShowInvitePopup(false)}
                className="close-btn"
              >
                Close
              </button>
            </div>
          </div>
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
