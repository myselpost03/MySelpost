import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import AdBanner from "../Components/AdBanner";
import "../Styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

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
        <AdBanner />
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
          <div className="alert-box modal">
            <p>
              To use the Prompt option, you must first{" "}
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
  );
  
};

export default Home;
