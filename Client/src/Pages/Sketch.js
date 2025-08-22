import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { Link, useNavigate } from "react-router-dom";
import first from "../Assets/1.jpg";
import second from "../Assets/2.jpg";
import Lottie from "lottie-react";
import arrow from "../JSON/arrow.json";
import draw from "../Assets/draw.png"; // Add your image for the new FAB
import "../Styles/Sketch.css";

const Sketch = () => {
  const [count, setCount] = useState(0);
  const target = 1500;
  const duration = 3000;
  const [showAlert, setShowAlert] = useState(false);

  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let start = 0;
    const stepTime = Math.max(Math.floor(duration / target), 1);

    const counter = setInterval(() => {
      start += Math.floor(target / (duration / stepTime));
      if (start >= target) {
        setCount(target);
        clearInterval(counter);
      } else {
        setCount(start);
      }
    }, stepTime);

    // Check if tutorial has been shown before
    const tutorialShown = localStorage.getItem("tutorialShown");
    if (tutorialShown) {
      setShowTutorial(false);
    }

    return () => clearInterval(counter);
  }, []);

  const handleFabClick = () => {
    setShowAlert(!showAlert);
    // Mark tutorial as completed
    setShowTutorial(false);
    localStorage.setItem("tutorialShown", "true");
  };

  const handleDoodle = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      navigate("/app-doodle"); // ✅ Navigate if user is logged in
    } else {
      setShowCustomAlert(true); // 🔒 Show alert if not logged in
    }
  };

  const closeAlert = () => {
    setShowCustomAlert(false);
  };

  return (
    <div>
      <Header />
      <div className="sketch-image-row">
        <div className="sketch-image-block">
          <p className="sketch-label">Sketch</p>
          <img src={first} alt="Sketch Example 1" className="sketch-img-1" />
        </div>

        <div className="arrow-animation-desktop">
          <Lottie
            animationData={arrow}
            loop={true}
            style={{ height: "120px", width: "120px" }}
          />
        </div>

        <div className="sketch-image-block">
          <p className="sketch-label">Result</p>
          <img src={second} alt="Sketch Example 2" className="sketch-img-2" />
        </div>
      </div>

      <div className="counter-container">
        <div className="sketchy-text-wrapper">
          <p className="sketchy-text">
            <span className="sketchy-number">{count.toLocaleString()}+</span>{" "}
            users turned their sketches into a working website and app.
          </p>
        </div>
      </div>

      {/* Onboarding Tutorial */}
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-content">
            <p className="tutorial-text">
              Start sketching by tapping on the pencil or draw icon
            </p>
            <div className="tutorial-arrow"></div>
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="sketch-fab-container">
        <button className="sketch-fab-button new-fab" onClick={handleDoodle}>
          <img src={draw} alt="New FAB" className="sketch-fab-icon" />
        </button>
        <button className="sketch-fab-button" onClick={handleFabClick}>
          ✏️
        </button>

        {showAlert && (
          <div className="sketch-fab-options">
            <Link to="/app-sketch" className="sketch-fab-option">
              ✨ Create App
            </Link>
            <Link to="/web-sketch" className="sketch-fab-option">
              🌐 Create Website
            </Link>
          </div>
        )}

        {showCustomAlert && (
          <div className="modal-overlay">
            <div className="alert-box modal">
              <p>
                To use the Online Sketch feature, you must first{" "}
                <Link to="/register" className="register-link">
                  register
                </Link>
                .
              </p>
              <button onClick={closeAlert} className="close-alert">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sketch;
