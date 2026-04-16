import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OneSignal from "react-onesignal";
import { supabase } from "../Utils/supabaseClient";
import i18n from "../i18n";
import "../Styles/SketchyAlert.css";

const SketchyAlert = ({ message, buttons = ["close"], onClose, onGuest, onNews, onPay }) => {
  const [subscribed, setSubscribed] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

const [adLoaded, setAdLoaded] = useState(false); // track ad load
  
    const [adVisible, setAdVisible] = useState(false);
    const [closeAdCountdown, setCloseAdCountdown] = useState(5); // 5 seconds countdown
    const navigate = useNavigate();
    useEffect(() => {
      if (adVisible) {
        setCloseAdCountdown(5); // reset countdown every time ad opens
    
        const timer = setInterval(() => {
          setCloseAdCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
    
        return () => clearInterval(timer);
      }
    }, [adVisible]);
    
const loadAd = () => {
    const adContainer = document.getElementById('ad-container');
    if (!adContainer) return; // wait until container exists

    // Remove old script if any
    const existingScript = document.getElementById('adsterra-script');
    if (existingScript) existingScript.remove();

    adContainer.innerHTML = '';

    const innerContainer = document.createElement('div');
    innerContainer.id = 'container-61abb6ea6099c52057a640165e20675a';
    adContainer.appendChild(innerContainer);

    const script = document.createElement('script');
    script.id = 'adsterra-script';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src =
      '//pl27196664.effectivegatecpm.com/61abb6ea6099c52057a640165e20675a/invoke.js';

    script.onload = () => console.log('Ad script loaded.');
    script.onerror = () => console.error('Failed to load ad script.');

    adContainer.appendChild(script);
  };

  // Run loadAd when popup becomes visible
  useEffect(() => {
    if (adVisible) {
      setAdLoaded(false);
      loadAd();
    }
  }, [adVisible]);

  const handleCloseAd = () => {
    setAdVisible(false);
    navigate('/miss-scratch')
  };


  useEffect(() => {
    const isSubscribed =
      localStorage.getItem("notificationsEnabled") === "true";
    setSubscribed(isSubscribed);
  }, []);

  const handleSubscribe = async () => {
    try {
      // Ask permission
      await OneSignal.Notifications.requestPermission();

      if (Notification.permission === "granted") {
        await OneSignal.User.PushSubscription.optIn();
        const playerId = OneSignal.User.PushSubscription.id;
        console.log("✅ Player ID:", playerId);

        const { data, error } = await supabase
          .from("players")
          .upsert(
            { player_id: playerId, user_id: user?.id },
            { onConflict: "player_id" }
          );

        if (error) {
          console.error("❌ Error saving player to Supabase:", error.message);
        } else {
          console.log("✅ Player saved to Supabase:", data);
        }
        localStorage.setItem("notificationsEnabled", "true");
        setSubscribed(true);
      } else {
        console.log("⚠️ Notification permission not granted");
      }
    } catch (err) {
      console.error("❌ Error subscribing for push:", err);
    }
  };

  const handleGuest = () => {
    setAdVisible(true);
  };

  const handleNews = () => {
    navigate("/news")
  }

  return (
    <div className="sketchy-alert-new">
      <div className="alert-content">
        <p>{message}</p>
        {/*<div className="alert-banner">
          <AdsterraBanner />
        </div>*/}
        <div className="alert-buttons">
          {buttons.includes("pay") && (
            <button className="pay-btn" onClick={onPay}>
              Pay $1
            </button>
          )}
          {buttons.includes("allow") && (
            <button
              className={
                subscribed ? "disabled-allow-btn" : "sketchy-allow-btn"
              } // greyed out if already subscribed
              onClick={handleSubscribe}
              disabled={subscribed} // disable only if already subscribed
            >
              {subscribed ? "Granted" : "Allow"}
            </button>
          )}

          {buttons.includes("guest") && (
            <button className="sketchy-alert-close-btn" onClick={onGuest}>
              {i18n.t("guest")}
            </button>
          )}
          {buttons.includes("close") && (
            <button className="sketchy-alert-close-btn" onClick={onClose}>
              {i18n.t("close")}
            </button>
          )}
          {buttons.includes("news") && (
            <button className="sketchy-alert-close-btn" onClick={handleNews}>
              {i18n.t("news")}
            </button>
          )}
        </div>
      </div>
       {adVisible && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
              }}
            >
              <div
                style={{
                  background: '#fff',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  width: '90%',
                  maxWidth: '400px',
                }}
              >
                <div className="ad-header">
                  <span className="ad-label">Ad</span>
                  <span className="ad-by">Powered by Adsterra</span>
                </div>
                <div
                  id="ad-container"
                  style={{
                    marginTop: '20px',
                    minHeight: '100px',
                    border: '2px dashed #007bff',
                    borderRadius: '10px',
                    background: '#f9f9f9',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {!adLoaded && <span>Loading Ad...</span>}
                </div>
                <button
                  onClick={handleCloseAd}
                  disabled={closeAdCountdown > 0} // disabled until countdown ends
                  style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    background: closeAdCountdown > 0 ? '#555' : '#111', // different style while disabled
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: closeAdCountdown > 0 ? 'not-allowed' : 'pointer',
                    position: 'relative',
                  }}
                >
                  Close Ad {closeAdCountdown > 0 && `(${closeAdCountdown})`}
                </button>
              </div>
            </div>
          )}
    </div>
  );
};

export default SketchyAlert;
