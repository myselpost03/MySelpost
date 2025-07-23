import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import "../Styles/Home.css";
import SketchyAlert from "../Components/SketchyAlert";
import InviteFAB from "../Components/InviteFAB";
import { supabase } from "../Utils/supabaseClient";
import { isRunningAsPWA } from "../Utils/CheckPWA";

const Home = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.id) return;
    if (storedUser && storedUser.id) {
      setUser(storedUser); // ✅ Save user to state
    } else {
      setUser(null);
      return;
    }
    const rewardKey = `${storedUser.id}`;

    if (isRunningAsPWA() && !localStorage.getItem(rewardKey)) {
      console.log("🚀 PWA detected – rewarding 30 coins");

      (async () => {
        try {
          const { error } = await supabase.rpc("increment_reward_coins", {
            user_id_input: storedUser.id,
            increment_by: 30,
          });

          if (error) {
            console.error("❌ PWA reward error:", error.message);
          } else {
            localStorage.setItem(rewardKey, "true");
            setAlertMessage({
              text: "🎉 App Installed! You got +30 coins.",
              withButton: true,
            });
          }
        } catch (err) {
          console.error("❗ Unexpected PWA reward error:", err);
        }
      })();
    }
  }, []);

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
      {user && <InviteFAB />}
    </div>
  );
};

export default Home;
