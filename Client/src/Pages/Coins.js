import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SketchyHeader from "../Components/SketchyHeader";
import "../Styles/Coins.css";
import SketchyAlert from "../Components/SketchyAlert";
import LoadingSpinner from "../Components/LoadingSpinner";
import { supabase } from "../Utils/supabaseClient";
import { trackEvent } from "../Utils/analytics";

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
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get("payment");

    const handleSuccessfulPayment = async () => {
      if (paymentSuccess === "success") {
        // Prevent duplicate rewards by using localStorage
        const rewardedKey = `rewarded_${id}`;
        if (localStorage.getItem(rewardedKey)) return;

        const { error: rpcError } = await supabase.rpc(
          "increment_reward_coins",
          {
            user_id_input: id,
            increment_by: 100,
          }
        );

        if (rpcError) {
          setAlertMessage({
            text: "❌ Failed to add coins after payment.",
            withButton: true,
          });
        } else {
          setAlertMessage({
            text: "✅ 100 coins added after payment!",
            withButton: true,
          });
          setUser((prevUser) => ({
            ...prevUser,
            reward_coins: (prevUser.reward_coins || 0) + 100,
          }));
          localStorage.setItem(rewardedKey, "true");
        }
      }
    };

    handleSuccessfulPayment();
  }, [id]);

  useEffect(() => {
    const getUserById = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (
        error // console.error("Error fetching user:", error.message)*/};
      );
      else setUser(data);
    };

    getUserById();
  }, [id]);

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      // console.log("👍 beforeinstallprompt fired");
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    const handleAppInstalled = async () => {
      // console.log("App installed successfully");
      setShowPrompt(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installApp = () => {
    trackEvent({
      action: "button_click",
      category: "Mobile Coins Section",
      label: "Install App Button",
    });
    // Check if app is already installed
    const isInstalled =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isInstalled) {
      setAlertMessage({
        text: "✅ Installed already! If not then refresh the page",
        withButton: true,
      });
      return;
    }

    setShowPrompt(false);

    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          // console.log("User accepted the install prompt");
        } else {
          // console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
      });
    } else {
      setAlertMessage({
        text: "✅ Installed already! If not then refresh the page", //"❌ Install not available now",
        withButton: true,
      });
    }
  };

  const cancelInstall = () => {
    trackEvent({
      action: "button_click",
      category: "Mobile Coins Section",
      label: "Cancel App Install Button",
    });
    // console.log("User cancelled install prompt");
    setShowPrompt(false);
  };

  const generateRandomCode = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const handleInviteClick = async () => {
    trackEvent({
      action: "button_click",
      category: "Mobile Coins Section",
      label: "Invite Button",
    });
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
      // console.error("Error checking existing invite:", fetchError.message);
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
      // console.error("Error saving invite code:", response.error.message);
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

              try {
                const { error: rpcError } = await supabase.rpc(
                  "increment_reward_coins",
                  {
                    user_id_input: user.id,
                    increment_by: 100,
                  }
                );

                if (rpcError) {
                  // console.error("❌ RPC update error:", rpcError.message);
                  setAlertMessage({
                    text: "❌ Failed to add coins.",
                    withButton: true,
                  });
                } else {
                  setAlertMessage({
                    text: "100 coins added.",
                    withButton: true,
                  });
                  setUser((prevUser) => ({
                    ...prevUser,
                    reward_coins: (prevUser.reward_coins || 0) + 100,
                  }));
                }

                setShowPayPal(false);
              } catch (err) {
                // console.error("❗ Unexpected RPC error:", err);
                setAlertMessage({
                  text: "❌ Something went wrong while adding coins.",
                  withButton: true,
                });
              }
            },
            onError: (err) => {
              // console.error("PayPal error:", err);
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
            ⏳ Spend 1 Hour & Earn 3 Coins (Auto Transfer)
          </button>

          {/*  <button className="sketchy-coin-btn" onClick={installApp}>
            🎁 Install App & Get +30 Coins
          </button>
*/}
          <button className="sketchy-coin-btn" onClick={handleInviteClick}>
            📲 Invite Friends & Earn 50 Coins
          </button>

          <button
            className="sketchy-coin-btn"
            onClick={() => setShowPayPal(true)}

            /*  onClick={() => {
              const paymentLink = `https://checkout.dodopayments.com/buy/pdt_F75qrtOLCHlR8RlJ18JS0?quantity=1&redirect_url=https://www.myselpost.com/coins/${id}?payment=success`;
              window.location.href = paymentLink;
            }}*/
          >
            🛒 Buy 100 Coins - {user?.country === "IN" ? "₹86" : "$1"}
          </button>
        </div>

        {showPayPal && (
          <div id="paypal-button-container" className="paypal-box"></div>
        )}
        {loading && !showInvitePopup && <LoadingSpinner />}
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
        {/*
        <p className="sketchy-coin-note">
          * Coins are non-refundable & expire in 30 days.
        </p>*/}
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
