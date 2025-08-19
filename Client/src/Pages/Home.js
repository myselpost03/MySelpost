import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import "../Styles/Home.css";
import SketchyAlert from "../Components/SketchyAlert";
import InviteFAB from "../Components/InviteFAB";
import { supabase } from "../Utils/supabaseClient";
import { trackEvent } from "../Utils/analytics";

const Home = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [user, setUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ gender: "", age: "" });

  useEffect(() => {
    const fetchAndSetUser = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser?.id) {
        setUser(null);
        return;
      }

      // Fetch fresh user data from Supabase
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", storedUser.id)
        .single();

      if (error) {
        console.error("Failed to fetch user from DB:", error.message);
        setUser(null);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);

      // Show profile modal only if age or gender missing
      if (!data.gender || !data.age) {
        setShowProfileModal(true);
      } else {
        setShowProfileModal(false);
      }
    };

    fetchAndSetUser();
  }, [navigate]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async () => {
    trackEvent({
      action: "button_click",
      category: "Home Page",
      label: "Submit Gender & Age Button",
    });
    if (!profileForm.gender || !profileForm.age) return;

    const { error } = await supabase
      .from("users")
      .update({
        gender: profileForm.gender,
        age: parseInt(profileForm.age),
      })
      .eq("id", user.id);

    if (!error) {
      const updatedUser = { ...user, ...profileForm };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setShowProfileModal(false);
    } else {
      console.error("Update failed:", error.message);
    }
  };

  const handleChatClick = () => {
    navigate("/chat-entrance");
  };

  const handleBuildAppClick = () => {
    trackEvent({
      action: "button_click",
      category: "Home Page",
      label: "Sketch App Button",
    });
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

  const handleClick = async () => {
    await handleProfileSubmit();
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
              Sketch
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
      {showProfileModal && (
        <div className="popup-wrapper">
          <div className="popup-card">
            <h3 className="popup-title">Hey there!</h3>
            <p className="popup-text">
              Tell us your age and gender to continue.
            </p>

            <div className="option-row">
              <label className="option-box">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={profileForm.gender === "male"}
                  onChange={handleProfileChange}
                />{" "}
                Male
              </label>
              <label className="option-box">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={profileForm.gender === "female"}
                  onChange={handleProfileChange}
                />{" "}
                Female
              </label>
            </div>

            <input
              type="number"
              className="input-field"
              placeholder="Enter your age"
              name="age"
              value={profileForm.age}
              onChange={handleProfileChange}
            />

            <button className="submit-funky-btn" onClick={handleClick}>
              Submit
            </button>
          </div>
        </div>
      )}

      {user && <InviteFAB />}
    </div>
  );
};

export default Home;
