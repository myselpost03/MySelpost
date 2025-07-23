import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SketchyHeader from "../Components/SketchyHeader";
import SketchyAlert from "../Components/SketchyAlert";
import { supabase } from "../Utils/supabaseClient";
import "../Styles/PaymentPage.css";

const PaymentPage = () => {
  const [alertMessage, setAlertMessage] = useState(null);

  const [showPayPal, setShowPayPal] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

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
                purchase_units: [{ amount: { value: "0.57" } }],
              });
            },
            onApprove: async (data, actions) => {
              await actions.order.capture();

              setAlertMessage({
                text: "✅ Payment successful! Now you can chat with premium country user.",
                withButton: true,
              });

              const user = JSON.parse(localStorage.getItem("user"));
              const id = user?.id;

              if (id) {
                await supabase
                  .from("users")
                  .update({ premium_country: "paid" })
                  .eq("id", id);
              }
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

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <SketchyHeader title="Payment" onBack={handleBack} />
      <div className="sketchy-payment-container">
        <h1 className="sketchy-payment-title">💳 Unlock Premium Chat</h1>

        <div className="sketchy-payment-box">
          <p className="sketchy-payment-text">
            You're trying to chat with someone from a premium country (like 🇺🇸
            US).
          </p>

          <p className="sketchy-payment-text">
            💎 Access to chat with premium users costs just{" "}
            {user.country === "IN" ? "₹49" : "$0.50"}.
          </p>

          <div className="sketchy-payment-buttons">
            <button
              className="sketchy-pay-now"
              onClick={() => setShowPayPal(true)}
            >
              💰 Pay {user.country === "IN" ? "₹49" : "$0.50"} Now
            </button>
            <button className="sketchy-cancel" onClick={() => navigate(-1)}>
              ❌ Cancel
            </button>
            {showPayPal && (
              <div id="paypal-button-container" className="paypal-box"></div>
            )}
          </div>
        </div>
        {alertMessage && (
          <SketchyAlert
            message={alertMessage.text}
            withButton={alertMessage.withButton}
            onClose={() => setAlertMessage(null)}
          />
        )}
      </div>
    </>
  );
};

export default PaymentPage;
