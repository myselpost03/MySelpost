import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import "../Styles/AppSketch.css";
import confetti from "canvas-confetti";
import { supabase } from "../Utils/supabaseClient";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
} from "react-share";

const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const getCookie = (name) => {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
};

const WebSketch = () => {
  const [cooldownActive, setCooldownActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [showBonusAlert, setShowBonusAlert] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const now = Date.now();
    const TWENTY_DAYS = 20 * 24 * 60 * 60 * 1000;

    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
      const coinTime = localStorage.getItem("coin");
      if (coinTime) {
        const lastUsed = parseInt(coinTime, 10);
        if (now - lastUsed < TWENTY_DAYS) {
          setCooldownActive(true);
          const remaining = new Date(lastUsed + TWENTY_DAYS - now);
          const days = remaining.getUTCDate() - 1;
          const hours = remaining.getUTCHours();
          const minutes = remaining.getUTCMinutes();
          setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
        } else {
          // Expired - remove it
          localStorage.removeItem("coin");
          setCooldownActive(false);
        }
      }
    } else {
      const cookieVal = getCookie("usedFreeSketch");
      if (cookieVal) {
        const lastUsed = parseInt(cookieVal, 10);
        if (now - lastUsed < TWENTY_DAYS) {
          setCooldownActive(true);
          const remaining = new Date(lastUsed + TWENTY_DAYS - now);
          const days = remaining.getUTCDate() - 1;
          const hours = remaining.getUTCHours();
          const minutes = remaining.getUTCMinutes();
          setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
        } else {
          // Expired - remove cookie
          setCookie("usedFreeSketch", "", -1); // Set expired cookie
          setCooldownActive(false);
        }
      }
    }
  }, []);

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(
      validateEmail(value) ? "" : "Please enter a valid email address."
    );
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      alert("Only .jpg and .png files are allowed.");
    }
  };

  const handleUpload = async () => {
    if (!file || (!isLoggedIn && (!email || emailError))) return;

    // Check if free guest already used their sketch
    if (!isLoggedIn && getCookie("usedFreeSketch") === "true") {
      alert(
        "You've already used your 1 free sketch point. Please sign up to unlock more."
      );
      return;
    }

    // Check if logged-in user already submitted sketch
    if (isLoggedIn && localStorage.getItem("coin")) {
      alert("You've already used your 1 sketch point. Please wait 20 days.");
      return;
    }

    setUploading(true);

    let userEmail = "";
    if (isLoggedIn) {
      const storedUser = localStorage.getItem("user");
      try {
        const parsed = JSON.parse(storedUser);
        userEmail = parsed?.email || "unknown";
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
        userEmail = "unknown";
      }
    } else {
      userEmail = email;
    }

    // Keep email as-is
    const pagePath = window.location.pathname.replace(/[^\w]/g, "_"); // Sanitize URL path
    const fileExt = file.name.split(".").pop();
    const uniqueName = `${userEmail}_${pagePath}_${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("sketches")
      .upload(uniqueName, file);

    if (error) {
      console.error("Upload error:", error.message);
      alert("Upload failed!");
    } else {
      const { data } = supabase.storage
        .from("sketches")
        .getPublicUrl(uniqueName);

      setUploadedUrl(data.publicUrl);

      setShowCustomAlert(true);
      setTimeout(() => setShowCustomAlert(false), 7000);

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });

      const now = Date.now();
      if (isLoggedIn) {
        localStorage.setItem("coin", now.toString());
      } else {
        setCookie("usedFreeSketch", now.toString(), 20);
      }

      setCooldownActive(true);
    }

    setUploading(false);
  };

  const handleBonusClaim = () => {
    const now = Date.now();

    if (isLoggedIn) {
      const bonusClaimed = localStorage.getItem("bonusCoinClaimed");
      if (!bonusClaimed) {
        localStorage.setItem("coin", now.toString());
        localStorage.setItem("bonusCoinClaimed", "true");
        setCooldownActive(false);
        setShowBonusAlert(true);
        setTimeout(() => setShowBonusAlert(false), 6000);
      }
    } else {
      const bonusCookie = getCookie("bonusCoinClaimed");
      if (!bonusCookie) {
        setCookie("usedFreeSketch", "", -1); // Clear old usage
        setCookie("bonusCoinClaimed", "true", 20);
        setCooldownActive(false);
        setShowBonusAlert(true);
        setTimeout(() => setShowBonusAlert(false), 6000);
      }
    }
  };

  const isFormReady = isLoggedIn
    ? !!file && !uploading
    : !!file && validateEmail(email) && !uploading;

  return (
    <>
      <Header />
      <div className="upload-container">
        <h1 className="upload-title">Upload Your Sketch ✏️</h1>

        <div className="upload-box">
          <input
            type="file"
            id="fileUpload"
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
            hidden
          />
          <label htmlFor="fileUpload" className="upload-label">
            <p>
              {fileName
                ? `Selected: ${fileName}`
                : "Drag & drop or click to browse"}
            </p>
          </label>
        </div>

        {!isLoggedIn && (
          <>
            <input
              type="email"
              className="sketch-input"
              placeholder="Enter your email address"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <p className="error-text">{emailError}</p>}
          </>
        )}
        {cooldownActive ? (
          <p className="cooldown-text">
            ⏳ You’ve already used your 1 free sketch point.
            <br />
            Come back in <strong>{timeRemaining}</strong> to submit again.
            <br />
            <span className="share-instruction">
              🎁 Claim a bonus sketch point by sharing:
            </span>
            <div className="react-share-buttons">
              <FacebookShareButton
                url="https://myselpost.com/sketch"
                quote="Get your app built from a sketch!"
                onShareWindowClose={() => handleBonusClaim()}
              >
                <button className="share-coin-button">📘 Facebook</button>
              </FacebookShareButton>

              <TwitterShareButton
                url="https://myselpost.com/sketch"
                title="I just got an app built from a hand-drawn sketch. Try it yourself!"
                onShareWindowClose={() => handleBonusClaim()}
              >
                <button className="share-coin-button">🐦 Twitter</button>
              </TwitterShareButton>

              <WhatsappShareButton
                url="https://myselpost.com/sketch"
                title="Build an app from your hand-drawn sketch!"
                separator=":: "
                onShareWindowClose={() => handleBonusClaim()}
              >
                <button className="share-coin-button">🟢 WhatsApp</button>
              </WhatsappShareButton>

              <TelegramShareButton
                url="https://myselpost.com/sketch"
                title="Get your app built from a sketch!"
                onShareWindowClose={() => handleBonusClaim()}
              >
                <button className="share-coin-button">📨 Telegram</button>
              </TelegramShareButton>
            </div>
          </p>
        ) : (
          <button
            className="upload-button"
            disabled={!isFormReady || uploadedUrl !== ""}
            onClick={handleUpload}
          >
            {uploading ? "Uploading..." : "Submit Sketch"}
          </button>
        )}
        {showBonusAlert && (
          <div className="custom-alert bonus">
            <p>
              🎉 You’ve received a <strong>bonus sketch point</strong> for
              sharing!
              <br />
              You can now submit another sketch.
            </p>
            <button onClick={() => setShowBonusAlert(false)}>Awesome 🚀</button>
          </div>
        )}

        {showCustomAlert && (
          <div className="custom-alert">
            <p>
              ⏳ Your sketch will magically turn into a website in 20 days!
              <br />
              We'll send progress updates and code files straight to your inbox
              so you can follow along.
            </p>
            <button onClick={() => setShowCustomAlert(false)}>Okay ✨</button>
          </div>
        )}
      </div>
    </>
  );
};

export default WebSketch;
