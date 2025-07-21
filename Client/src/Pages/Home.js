import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import "../Styles/Home.css";
import { supabase } from "../Utils/supabaseClient";
import SketchyAlert from "../Components/SketchyAlert";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      const now = new Date();
      const lastAwardTime = user.last_coin_award_time
        ? new Date(user.last_coin_award_time)
        : null;

      if (!lastAwardTime || now - lastAwardTime >= 3600000) {
        const newCoins = (user.coins || 0) + 3;

        const { error } = await supabase
          .from("users")
          .update({
            coins: newCoins,
            last_coin_award_time: now.toISOString(),
          })
          .eq("id", user.id);

        if (!error) {
          setUser({
            ...user,
            coins: newCoins,
            last_coin_award_time: now.toISOString(),
          });

          setAlertMessage({
            text: `🕒 You've earned +3 coins for 1 hour of engagement!`,
            withButton: true,
          });
        } else {
          console.error("Hourly coin update failed:", error.message);
        }
      }
    }, 60000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, [user]);

  const handleSketchClick = () => {
    navigate("/sketch");
  };

  const handlePromptClick = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      navigate("/prompt"); // ✅ Navigate if user is logged in
    } else {
      setShowAlert(true); // 🔒 Show alert if not logged in
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="background-animated">
      <div className={showAlert ? "blurred" : ""}>
        <Header />
        {/*<AdBanner />*/}
        <main className="center-wrapper">
          <div className="button-container">
            <button className="sketchy-button" onClick={handleSketchClick}>
              Sketch (Free)
            </button>
            <span className="or-text">OR</span>
            <button className="sketchy-button" onClick={handlePromptClick}>
              Prompt (Paid)
            </button>
          </div>
        </main>
        <Footer />
      </div>

      {showAlert && (
        <div className="modal-overlay">
          <div className="sketchy-alert-box">
            <p>
              To use the Prompt option, you must first{" "}
              <Link to="/register" className="sketchy-link">
                register
              </Link>
              .
            </p>
            <button onClick={closeAlert} className="sketchy-close-btn">
              Got it!
            </button>
          </div>
        </div>
      )}
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

export default Home;
