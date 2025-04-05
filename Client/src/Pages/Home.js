import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import "../Styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  const handleSketchClick = () => {
    navigate("/sketch");
  };

  const handlePromptClick = () => {
    setShowAlert(true);
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  return (
    <div>
      {/* Only this content will blur when modal is shown */}
      <div className={showAlert ? "blurred" : ""}>
        <Header />
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

      {/* Modal shown on top of blurred background */}
      {showAlert && (
        <div className="modal-overlay">
          <div className="alert-box modal">
            <p>
              To use the Prompt option, you must first{" "}
              <a href="/register" className="register-link">
                register
              </a>
              .
            </p>
            <button onClick={closeAlert} className="close-alert">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
