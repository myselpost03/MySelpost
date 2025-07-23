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
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.id) return;

    if (storedUser && storedUser.id) {
      setUser(storedUser);
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

  const handleChatClick = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // No user found in localStorage
    if (!storedUser || !storedUser.id) {
      setAlertMessage({
        text: "You have to log in to access the chat feature.",
        withButton: true,
      });
      return;
    }

    // Valid user, proceed to chat
    navigate("/chat-list");
  };

  const handleBuildAppClick = () => {
    setShowBuildModal(true);
  };

  const closeAlert = () => setShowAlert(false);
  const closeBuildModal = () => setShowBuildModal(false);

  const handleBuildChoice = (type) => {
    setShowBuildModal(false);
    if (type === "sketch") {
      navigate("/sketch");
    } else if (type === "prompt") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        navigate("/prompt");
      } else {
        setShowAlert(true);
      }
    }
  };

  return (
    <div className="background-animated">
      <div className={showAlert || showBuildModal ? "blurred" : ""}>
        <Header />
        <main className="center-wrapper">
          <div className="button-container">
            <button className="sketchy-button" onClick={handleChatClick}>
              Chat
            </button>
            <span className="or-text">OR</span>
            <button className="sketchy-button" onClick={handleBuildAppClick}>
              Build App
            </button>
          </div>
        </main>
        <Footer />
      </div>

      {showBuildModal && (
        <div className="modal-overlay">
          <div className="sketchy-alert-box build-app-modal">
            <h3>🚀 Build App</h3>
            <p>Choose how you want to build:</p>
            <div className="modal-buttons">
              <button
                className="sketchy-button"
                onClick={() => handleBuildChoice("sketch")}
              >
                Sketch (Free)
              </button>
              <button
                className="sketchy-button"
                onClick={() => handleBuildChoice("prompt")}
              >
                Prompt (Paid)
              </button>
            </div>
            <button onClick={closeBuildModal} className="sketchy-close-btn">
              Cancel
            </button>
          </div>
        </div>
      )}

      {showAlert && (
        <div className="modal-overlay">
          <div className="sketchy-alert-box register-alert-modal">
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
